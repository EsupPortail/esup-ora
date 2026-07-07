const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

// --- Configuration ---
const PROJECT_ROOT = process.cwd();
const NODE_MODULES_DIR = path.join(PROJECT_ROOT, 'node_modules');

// Version du projet, lue depuis le package.json racine
const rootPackageJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
const projectVersion = rootPackageJson.version || '1.0.0';

// Répertoire de sortie : un seul niveau, pas d'arborescence récursive.
// (l'ancienne structure imbriquée dupliquait les paquets partagés à chaque
// occurrence dans l'arbre de dépendances)
const ROOT_PACKAGE_DIR = path.join(PROJECT_ROOT, 'packed-project', `ora-backend-${projectVersion}`);
fs.ensureDirSync(ROOT_PACKAGE_DIR);

let packedCount = 0;
const seen = new Set(); // clés "nom@version" déjà empaquetées : évite doublons et boucles infinies

// Nom de dossier/fichier sûr pour un paquet potentiellement scoped (@scope/nom)
function safeName(name, version) {
  return `${name.replace(/^@/, '').replace(/\//g, '__')}-${version}`;
}

// Parcourt récursivement node_modules, y compris les node_modules imbriqués
// (utiles pour les conflits de versions), en se protégeant contre les liens
// symboliques cycliques (workspaces, pnpm, yarn link...).
function collectPackageDirs(dir, results = [], visitedRealPaths = new Set()) {
  if (!fs.existsSync(dir)) return results;

  let real;
  try {
    real = fs.realpathSync(dir);
  } catch {
    return results;
  }
  if (visitedRealPaths.has(real)) return results;
  visitedRealPaths.add(real);

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    let isDir = entry.isDirectory();
    if (entry.isSymbolicLink()) {
      try {
        isDir = fs.statSync(entryPath).isDirectory();
      } catch {
        continue; // lien symbolique cassé
      }
    }
    if (!isDir || entry.name === '.bin') continue;

    if (entry.name.startsWith('@')) {
      // Dossier de scope (@nestjs, @vue...) : on descend d'un niveau
      collectPackageDirs(entryPath, results, visitedRealPaths);
      continue;
    }

    if (fs.existsSync(path.join(entryPath, 'package.json'))) {
      results.push(entryPath);
    }
    collectPackageDirs(path.join(entryPath, 'node_modules'), results, visitedRealPaths);
  }
  return results;
}

// Empaquette un seul paquet (déduplication globale par nom@version)
function packOne(pkgDir) {
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
  } catch (err) {
    console.error(`package.json illisible dans ${pkgDir} :`, err.message);
    return;
  }

  const { name, version } = pkg;
  if (!name || !version) return;

  const key = `${name}@${version}`;
  if (seen.has(key)) return;
  seen.add(key);

  const depDir = path.join(ROOT_PACKAGE_DIR, safeName(name, version));
  fs.ensureDirSync(depDir);
  const destPath = path.join(depDir, `${safeName(name, version)}.tgz`);

  if (fs.existsSync(destPath)) {
    packedCount++;
    return;
  }

  try {
    // On empaquette le dossier réellement installé (et non le registre npm),
    // pour garantir qu'on sauvegarde exactement le code utilisé par le projet,
    // y compris d'éventuels correctifs locaux (patch-package, etc.), et sans
    // dépendre d'un accès réseau.
    const output = execSync(`npm pack "${pkgDir}" --silent`, { cwd: depDir }).toString();
    const lines = output.trim().split('\n').filter(Boolean);
    const generatedFilename = lines[lines.length - 1].trim();
    const generatedPath = path.join(depDir, generatedFilename);
    if (generatedPath !== destPath) {
      fs.moveSync(generatedPath, destPath, { overwrite: true });
    }
    packedCount++;
  } catch (error) {
    console.error(`Erreur lors de l'emballage de ${key} :`, error.message);
  }
}

// --- Exécution ---
const packageDirs = collectPackageDirs(NODE_MODULES_DIR);
console.log(`${packageDirs.length} dossiers de paquets détectés dans node_modules.`);

packageDirs.forEach(packOne);

console.log(`Nombre total de dépendances empaquetées : ${packedCount}`);
console.log(`Répertoire de sortie : ${ROOT_PACKAGE_DIR}`);
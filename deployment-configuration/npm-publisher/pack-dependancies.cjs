const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

// Obtenir la version du projet depuis le package.json
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const projectVersion = rootPackageJson.version || '1.0.0'; // Fallback à une version par défaut si non présente

// Répertoire principal avec nom du projet et version
const ROOT_PACKAGE_DIR = `packed-project/ora-backend-${projectVersion}`;
fs.ensureDirSync(ROOT_PACKAGE_DIR);

let packedCount = 0; // Compteur des dépendances empaquetées

function packDependencies(dep, baseDir, depth = 0, maxDepth = 5) {
  if (depth > maxDepth) {
    console.warn(`Profondeur maximale atteinte pour ${dep}`);
    return;
  }

  try {
    const packageJsonPath = path.join('node_modules', dep, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`Le package.json pour ${dep} n'existe pas.`);
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;
    const depDirName = `${dep}-${version}`;
    const depDirPath = path.join(baseDir, depDirName);

    fs.ensureDirSync(depDirPath);

    const filename = `${dep}-${version}.tgz`;
    const destPath = path.join(depDirPath, filename);

    if (!fs.existsSync(destPath)) {
      const result = execSync(`npm pack ${dep} --silent`).toString();
      const generatedFilename = result.trim();
      fs.moveSync(path.resolve(generatedFilename), destPath);
    }

    const subDependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
    if (subDependencies.length > 0) {
      const subDepDirPath = path.join(depDirPath, 'sub-dependency-dependencies');
      fs.ensureDirSync(subDepDirPath);
      subDependencies.forEach(subDep => packDependencies(subDep, subDepDirPath, depth + 1, maxDepth));
    }
  } catch (error) {
    console.error(`Erreur lors de l'emballage de ${dep}:`, error);
  }
}

const dependencies = JSON.parse(execSync('npm ls --json').toString()).dependencies;
const depNames = Object.keys(dependencies);

// Emballer chaque dépendance dans le répertoire principal
depNames.forEach(dep => {
  packDependencies(dep, ROOT_PACKAGE_DIR);
});

console.log(`Nombre total de dépendances empaquetées : ${packedCount}`);

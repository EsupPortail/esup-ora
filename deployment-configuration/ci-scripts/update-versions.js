const fs = require('fs');
const path = require('path');

// Chemins vers les fichiers package.json du backend et du frontend
const backendPackagePath = path.join(__dirname, '../../ora-backend', 'package.json');
const frontendPackagePath = path.join(__dirname, '../../ora-frontend', 'package.json');

// Chemin vers le fichier app.module.version
const versionFilePath = path.join(__dirname, '../../app.module.version');

// Lire et extraire les versions depuis app.module.version
function extractVersions(versionFile) {
    const versionData = fs.readFileSync(versionFile, 'utf8');
    const versionRegex = /(\w+_VERSION): "([\d\.\-]+)"/g;
    let versions = {};
    let match;

    while ((match = versionRegex.exec(versionData)) !== null) {
        versions[match[1]] = match[2];
    }
    return versions;
}

// Fonction pour mettre à jour la version dans un package.json
function updatePackageVersion(packagePath, newVersion) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log(`Version mise à jour pour ${packagePath}: ${newVersion}`);
}

// Extraire les versions du frontend et du backend
const versions = extractVersions(versionFilePath);
const backendVersion = versions['BACKEND_VERSION'];
const frontendVersion = versions['FRONTEND_VERSION'];

// Mettre à jour les versions dans les package.json du backend et du frontend
updatePackageVersion(backendPackagePath, backendVersion);
updatePackageVersion(frontendPackagePath, frontendVersion);

console.log('Mise à jour des versions terminée.');

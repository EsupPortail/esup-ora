const fs = require('fs');

function parseCSV(filePath, fallbackHeaders) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    const headers = fallbackHeaders;

    return lines.map(line => {
        const values = line.split(';');
        const obj = {};
        headers.forEach((header, index) => {
            let val = values[index]?.trim();
            if (val === 'True' || val === 'true') val = true;
            else if (val === 'False' || val === 'false') val = false;
            else if (!isNaN(val) && val !== '' && header !== 'csv_etab_code') val = Number(val);
            else if (val === '') val = null;
            obj[header.trim()] = val;
        });
        return obj;
    });
}

async function importData() {
    const args = process.argv.slice(2);
    
    if (args.length < 4) {
        console.error('Erreur : Fournir client_id, client_secret, chemin_etablissements et chemin_composantes');
        process.exit(1);
    }

    const [clientId, clientSecret, etablissementsPath, composantesPath] = args;
    const baseUrl = 'http://localhost:817/api';
    
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    try {
        const authResponse = await fetch(`${baseUrl}/auth/client-connector`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (!authResponse.ok) {
            throw new Error(`Erreur Authentification ! Statut : ${authResponse.status}`);
        }

        const authData = await authResponse.json();
        console.log('Connexion réussie !');
        
        const token = authData.data?.access_token || authData.token;
        if (!token) {
            throw new Error("Impossible de récupérer le token depuis la réponse d'authentification.");
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Is-Connector': 'true'
        };

        const etablissementsRaw = parseCSV(etablissementsPath, ['code', 'libelle', 'is_imported_by_connector']);
        const composantes = parseCSV(composantesPath, ['code', 'libelle', 'is_historized', 'csv_etab_code', 'is_imported_by_connector']);

        // 1. Insertion des Établissements
        for (const etab of etablissementsRaw) {
            const payload = {
                code: etab.code,
                libelle: etab.libelle,
                parametre_id: null,
                is_imported_by_connector: etab.is_imported_by_connector
            };

            const res = await fetch(`${baseUrl}/etablissement`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (res.status === 401 || res.status === 403) {
                throw new Error(`Token expiré ou rejeté (Statut: ${res.status})`);
            }

            if (res.ok) {
                console.log(`POST Etablissement [Code: ${etab.code}] -> Envoyé avec succès`);
            } else {
                console.error(`Erreur POST Etablissement [Code: ${etab.code}] -> Statut: ${res.status}`);
            }
        }

        // 2. GET Établissements pour récupérer les IDs générés par la BDD
        console.log('Récupération des établissements depuis la BDD...');
        const getEtabRes = await fetch(`${baseUrl}/etablissement`, {
            method: 'GET',
            headers: headers
        });

        if (!getEtabRes.ok) {
            throw new Error(`Impossible de récupérer la liste des établissements. Statut : ${getEtabRes.status}`);
        }

        const bddEtablissements = await getEtabRes.json();
        
        // Création d'une table de correspondance [code] -> id
        const etabCodeToIdMap = {};
        if (Array.isArray(bddEtablissements)) {
            bddEtablissements.forEach(e => {
                if (e.code) etabCodeToIdMap[e.code] = e.id;
            });
        } else if (bddEtablissements.data && Array.isArray(bddEtablissements.data)) {
            bddEtablissements.data.forEach(e => {
                if (e.code) etabCodeToIdMap[e.code] = e.id;
            });
        }

        // 3. Insertion des Composantes rattachées par le Code
        for (const comp of composantes) {
            const realEtabId = etabCodeToIdMap[comp.csv_etab_code] || null;

            const payload = {
                code: comp.code,
                libelle: comp.libelle,
                is_historized: comp.is_historized,
                etablissement_id: realEtabId,
                utilisateurs_rattaches: [],
                is_imported_by_connector: comp.is_imported_by_connector
            };

            const res = await fetch(`${baseUrl}/composante`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (res.status === 401 || res.status === 403) {
                throw new Error(`Token expiré ou rejeté (Statut: ${res.status})`);
            }

            console.log(`POST Composante [Code: ${comp.code}] rattachée au code [${comp.csv_etab_code}] (ID BDD: ${realEtabId}) -> Statut : ${res.status}`);
        }

    } catch (error) {
        console.error('Erreur :', error.message || error);
    }
}

importData();
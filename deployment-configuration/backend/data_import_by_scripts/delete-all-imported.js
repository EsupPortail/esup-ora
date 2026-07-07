async function cleanData() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.error('Erreur : Fournir client_id et client_secret');
        process.exit(1);
    }

    const [clientId, clientSecret] = args;
    const baseUrl = 'http://localhost:817/api';
    
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    try {
        // 1. Authentification
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
            throw new Error("Impossible de récupérer le token.");
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Is-Connector': 'true'
        };

        // 2. Nettoyage des Composantes
        console.log('Récupération des composantes...');
        const getCompRes = await fetch(`${baseUrl}/composante`, { method: 'GET', headers });
        if (!getCompRes.ok) throw new Error(`Erreur GET Composante: ${getCompRes.status}`);
        
        const compsData = await getCompRes.json();
        const composantes = Array.isArray(compsData) ? compsData : (compsData.data || []);
        
        // Filtrage de celles importées par le connecteur
        const compsToDelete = composantes.filter(c => c.is_imported_by_connector === true);
        console.log(`${compsToDelete.length} composante(s) à supprimer.`);

        for (const comp of compsToDelete) {
            const delRes = await fetch(`${baseUrl}/composante/${comp.id}`, {
                method: 'DELETE',
                headers: headers
            });
            console.log(`DELETE Composante [ID: ${comp.id}, Code: ${comp.code}] -> Statut: ${delRes.status}`);
        }

        // 3. Nettoyage des Établissements
        console.log('Récupération des établissements...');
        const getEtabRes = await fetch(`${baseUrl}/etablissement`, { method: 'GET', headers });
        if (!getEtabRes.ok) throw new Error(`Erreur GET Etablissement: ${getEtabRes.status}`);
        
        const etabsData = await getEtabRes.json();
        const etablissements = Array.isArray(etabsData) ? etabsData : (etabsData.data || []);
        
        // Filtrage de ceux importés par le connecteur
        const etabsToDelete = etablissements.filter(e => e.is_imported_by_connector === true);
        console.log(`${etabsToDelete.length} établissement(s) à supprimer.`);

        for (const etab of etabsToDelete) {
            const delRes = await fetch(`${baseUrl}/etablissement/${etab.id}`, {
                method: 'DELETE',
                headers: headers
            });
            console.log(`DELETE Etablissement [ID: ${etab.id}, Code: ${etab.code}] -> Statut: ${delRes.status}`);
        }

        console.log('Nettoyage terminé avec succès !');

    } catch (error) {
        console.error('Erreur lors du nettoyage :', error.message || error);
    }
}

cleanData();
import { Request, Response } from 'express';
import { logger } from '../configs/logger';

export class rncpController {

   static async searchRncp(req: Request, res: Response): Promise<Response> {
    try {
        const { intitule, numeroFiche } = req.query;
        
        let queryString = "";
        if (numeroFiche) {
            queryString = `numeroFiche=${encodeURIComponent(String(numeroFiche))}`;
        } else if (intitule) {
            queryString = `intitule=${encodeURIComponent(String(intitule))}`;
        } else {
            return res.status(400).json({ message: "Paramètre de recherche manquant." });
        }

        const baseUrl = process.env.RNCP_URL?.endsWith('/') ? process.env.RNCP_URL : `${process.env.RNCP_URL}/`;
        // 1. Authentification avec les Cookies du CURL
        const authResponse = await fetch(`${baseUrl}api/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                clientId: process.env.RNCP_CLIENT_ID,
                clientSecret: process.env.RNCP_CLIENT_SECRET
            })
        });
        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            logger.error(`Erreur auth RNCP: ${errorText}`);
            return res.status(authResponse.status).json({ message: "Échec auth RNCP" });
        }

        const authData = await authResponse.json() as { token?: string };
        const token = authData.token;

        if (!token) {
            return res.status(401).json({ message: "Token non trouvé dans la réponse." });
        }

        // 2. Appel final
        const response = await fetch(`${baseUrl}api/fiches?${queryString}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            }
        });

        const data = await response.json();
        return res.status(200).json(data['hydra:member'] || []);

    } catch (error) {
        logger.error('Erreur relais API RNCP:', error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
}
}
import { Request, Response } from 'express';

import { ExportService } from '../services/export.service';

export class exportController {

    static async getExportByPDF(req: Request, res: Response): Promise<Response> {
        const { formationID, versionID } = req.query;

        if (!formationID || !versionID) {
            return res.status(400).json({ error: 'formationID and versionID are required' });
        }
        const downloadURL = ExportService.generatePDF( formationID, versionID ).then( url => { return url; } );
        return res.status(200).json( { downloadURL: downloadURL });
    }

    static async getExportByExcel(req: Request, res: Response): Promise<Response> {
        const { formationID, versionID } = req.query;

        if (!formationID || !versionID) {
            return res.status(400).json({ error: 'formationID and versionID are required' });
        }
        const downloadURL = ExportService.generateExcel( formationID, versionID ).then( url => { return url; } );
        return res.status(200).json( { downloadURL: downloadURL });
    }
 
}
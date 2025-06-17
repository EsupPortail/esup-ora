import { Request, Response, NextFunction } from 'express';
import { SocketService } from '../services/socket.service';

export async function interceptorNotification(req: Request, res: Response, next: NextFunction) {   
    if (!req.path.includes('/auth') && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
        const idFormationToNotify = req.body.metadata.formationId;
        delete req.body.metadata;
        const objectToRefresh = req.path.split('/')[2];
        SocketService.needRefresh(idFormationToNotify.id, objectToRefresh);
    }

    return next();
}

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.service';
import { logger } from '../configs/logger';

export const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // On ne logue que ce qui n'est pas un GET (donc POST, PUT, DELETE, PATCH)
    if (req.method === 'GET') {
        return next();
    }

    // On écoute l'événement 'finish' pour loguer APRES que la réponse soit envoyée
    res.on('finish', async () => {
        try {
            // On récupère l'email depuis la session (si l'utilisateur est connecté)
            const userEmail = (req.session as any)?.user?.email || 'anonymous';
            
            // On définit une action lisible basée sur la route et la méthode
            const actionName = `${req.method}_${req.path.split('/').filter(p => p).join('_').toUpperCase()}`;

            await prisma.log.create({
                data: {
                    userEmail: userEmail,
                    action: actionName,
                    method: req.method,
                    endpoint: req.originalUrl,
                    statusCode: res.statusCode,
                    ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                    userAgent: req.headers['user-agent'],
                    // On évite de loguer des données sensibles comme les passwords
                    payload: req.body ? { ...req.body, password: req.body.password ? '******' : undefined } : {}
                }
            });
        } catch (error) {
            // On utilise ton logger.ts interne pour ne pas crash en cas d'erreur de log
            logger.error('Logger Middleware Error:', error);
        }
    });

    next();
};
import { Request, Response, NextFunction } from 'express';
import { logger } from '../configs/logger';

export async function isAuthorized(isAPI: Boolean, req: Request, res: Response, next: NextFunction): Promise<number> {
    // Liste des routes qui ne nécessitent PAS de rôle actif
    const authRoutes = ['/auth/shibboleth', '/auth/local', '/auth/logout', '/auth/me'];
    
    // Si l'URL contient l'une de ces routes, on bypass la vérification du rôle
    if (authRoutes.some(route => req.path.includes(route))) {
        return 200; 
    }

    try {
        const activeRole = req.headers['x-active-role'] as string;

        if (!activeRole) {
            logger.warn(`No active role provided for path: ${req.path}`);
            return 401;
        }

        if (activeRole.toLowerCase() === 'observateur') {
            if (req.path.startsWith('/api/auth')) {
                return 200;
            } 
            
            if (req.method !== 'GET') {
                logger.info(`Role 'observateur' denied access to ${req.method} ${req.path}`);
                return 403;
            }
        }
        return 200;
    } catch (error) {
        logger.error('Authorization Middleware Error:', error);
        return 500;
    }
}
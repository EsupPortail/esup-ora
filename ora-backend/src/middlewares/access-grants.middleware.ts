import { Request, Response, NextFunction } from 'express';
import { logger } from '../configs/logger';
import { KeycloakService } from '../services/keycloak.service';
import { prisma } from '../services/prisma.service';

export async function isAuthorized(isAPI: Boolean, req: Request, res: Response, next: NextFunction): Promise<number> {
    // Liste des routes qui ne nécessitent PAS de rôle actif
    const authRoutes = ['/auth/client-connector', '/auth/shibboleth', '/auth/local', '/auth/logout', '/auth/me'];

    // Si l'URL contient l'une de ces routes, on bypass la vérification du rôle
    if (authRoutes.some(route => req.path.includes(route))) {
        return 200;
    }

    try {
        const activeRole = req.headers['x-active-role'] as string;

        if (!activeRole) {
            logger.warn(`No active role provided for path: ${req.path}`);
            const userAccessToken = req.headers.authorization?.replace('Bearer ', '');
            const hasAccess = await KeycloakService.checkClientHasDistantAccessAttribute(userAccessToken);

            if (hasAccess) {
                // Check if client is authorized to ask endpoints
                const payload = JSON.parse(Buffer.from(userAccessToken.split('.')[1], 'base64').toString());
                const clientId = payload.azp || payload.client_id;

                const authorizedLinks = await prisma.link_client_to_ora_endpoint.findMany({
                    where: {
                        client_id: clientId,
                    }
                });

                const matchedEndpoint = authorizedLinks.find(link =>
                    req.path.startsWith(link.endpoint) || link.endpoint === req.path
                );

                if (!matchedEndpoint) {
                    logger.warn(`Client ${clientId} is not authorized for endpoint: ${req.path}`);
                    return 403;
                }

                if (matchedEndpoint.read_only && req.method !== 'GET') {
                    logger.warn(`Client ${clientId} has read-only access, ${req.method} not allowed on: ${req.path}`);
                    return 403;
                }

                return 200;
            }
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
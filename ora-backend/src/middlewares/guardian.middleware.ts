import { Request, Response, NextFunction } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import routesBackend from '../configs/guardian.routes.json';
import routesFrontend from '../configs/interceptor.routes.json';


export async function guardian(isAPI: boolean, req: Request, res: Response, next: NextFunction) {
    const routesToSkip: string[] = isAPI ? routesBackend.routes : routesFrontend.routes;

    if (routesToSkip.some(route => req.path.startsWith(route))) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        
        const tokenIsValid = await KeycloakService.tokenIntrospection(token);
        if (tokenIsValid) {
            return next();
        } else {
            const refreshToken = req.cookies?.refresh_token;
            if (refreshToken) {
                const newToken = await KeycloakService.refreshToken(refreshToken);
                
                if (newToken) {
                    const cookieOptions = { httpOnly: true, secure: true, sameSite: 'none' as const };
                    res.cookie('access_token', newToken.access_token, cookieOptions);
                    res.cookie('refresh_token', newToken.refresh_token, cookieOptions);
                    return next();
                }
            }
            
            if (isAPI) {
                return res.status(419).json({
                    code: 419,
                    response: 'Session expired. Please log in again.',
                    data: { mustLogin: true }
                });
            }
        }
    }

    if (isAPI) {
        return res.status(401).json({
            code: 401,
            response: 'HTTP Request Error : Access not granted.',
            data: {}
        });            
    } else {
        if (!req.cookies?.access_token) {
            return res.redirect('/login');
        }
        return next();
    }
}
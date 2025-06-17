import { logger } from '../configs/logger';
import { Request, Response, NextFunction } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import routesBackend from '../configs/guardian.routes.json';
import routesFrontend from '../configs/interceptor.routes.json';


export async function guardian( isAPI: Boolean, req: Request, res: Response, next: NextFunction) {
    const routesToSkip: string[] = isAPI ? routesBackend.routes : routesFrontend.routes;

    if (routesToSkip.some(route => req.path.startsWith(route))) {
        return next();
    }

    if( req.headers.authorization !== undefined ) {
        const token = req.headers.authorization?.replace('Bearer ', '') as string;
        const tokenIsValid = await KeycloakService.tokenIntrospection( token ).then( (result) => {
            return result;
        });
        if( tokenIsValid ) {
            return next();
        } else {
            const refreshToken = req.cookies?.refresh_token;
            if( refreshToken !== undefined ) {
                const newToken = await KeycloakService.refreshToken( refreshToken ).then( (result) => {
                    return result;
                });
                if( newToken !== undefined ) {
                    res.cookie('access_token', newToken.access_token, { httpOnly: true, secure: true, sameSite: 'none' });
                    res.cookie('expires_in', newToken.expires_in, { httpOnly: true, secure: true, sameSite: 'none' });
                    res.cookie('refresh_token', newToken.refresh_token, { httpOnly: true, secure: true, sameSite: 'none' });
                    res.cookie('refresh_expires_in', newToken.refresh_expires_in, { httpOnly: true, secure: true, sameSite: 'none' });
                    return next();
                }
            }
        }
    }

    if( isAPI === true ) {
        return res.status(401).json({
            'code': 401,
            'response': 'HTTP Request Error : Access not granted. Please, login.',
            'data': {}
        });            
    } else {
        const accessToken = req.cookies?.access_token;
        if( !accessToken ) {
            return res.redirect('/login');
        }
        return next();
    }
}

import { Request, Response, NextFunction } from 'express';
import routesConfig from '../configs/interceptor.routes.json';

export async function interceptorHTTP(req: Request, res: Response, next: NextFunction) {
    // Utiliser les routes depuis le JSON
    const routesToSkip: string[] = routesConfig.routes;

 
    // Vérifier si la route doit être ignorée
    if (routesToSkip.some(route => req.url.startsWith(route))) {
        return next();
    }

    if( req.headers.authorization === undefined ) {
        logger.info('Guardian intercept a non authorized request.');
        return res.status(401).json({
            'code': 401,
            'response': 'HTTP Request Error : Access not granted. Please, login.',
            'data': {}
        });
    }

    const token = req.headers.authorization?.replace('Bearer ', '') as string;
    const tokenIsValid = await KeycloakService.tokenIntrospection( token ).then( (result) => {
        return result;
    });

    if( tokenIsValid ) {
        return next();
    }

    return res.redirect('/login');
}

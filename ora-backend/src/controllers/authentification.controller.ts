import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { logger } from '../configs/logger';
import { prisma } from '../services/prisma.service';
export class authentificationController {
    static async authClientCredentials(req: Request, res: Response): Promise<Response> {
    try {
        const { client_id, client_secret } = req.body;

        if (!client_id || !client_secret) {
            return res.status(400).json({
                code: 400,
                response: 'client_id and client_secret must be provided.',
                data: {}
            });
        }

        const tokenResponse = await KeycloakService.getTokenByClientCredentials(client_id, client_secret)
            .catch(() => null);

        if (!tokenResponse || tokenResponse.code !== 200) {
            await prisma.log.create({
                data: {
                    userEmail: client_id,
                    action: 'CONNEXION_CLIENT_CREDENTIALS_ECHEC',
                    method: 'POST',
                    endpoint: req.originalUrl,
                    statusCode: 401,
                    ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                    userAgent: req.headers['user-agent'],
                    payload: { loginType: 'client_credentials', client_id }
                }
            }).catch(err => console.error("Erreur Log Prisma (401):", err));

            return res.status(401).json({
                code: 401,
                response: 'HTTP Request Error : Access not granted. Invalid client credentials.',
                data: {}
            });
        }

        await prisma.log.create({
            data: {
                userEmail: client_id,
                action: 'CONNEXION_CLIENT_CREDENTIALS',
                method: 'POST',
                endpoint: req.originalUrl,
                statusCode: 200,
                ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                userAgent: req.headers['user-agent'],
                payload: { loginType: 'client_credentials', client_id }
            }
        }).catch(err => console.error("Erreur Log Prisma:", err));

        return res.status(200).json({
            code: 200,
            data: {
                access_token: tokenResponse.data.access_token,
                expires_in: tokenResponse.data.expires_in,
                token_type: tokenResponse.data.token_type,
            }
        });

    } catch (error) {
        return res.status(500).json({ code: 500, message: 'Internal server error' });
    }
}


    static async authLocalAccount(req: Request, res: Response): Promise<Response> {
        try {
            const result = await authentificationController.login(req, res, false).then((response) => {
                return response;
            });
            console.log(result) ;
            if (result.code !== 200) {
                await prisma.log.create({
                    data: {
                        userEmail: req.body.username || 'unknown',
                        action: 'CONNEXION_LOCALE_ECHEC',
                        method: 'POST',
                        endpoint: req.originalUrl,
                        statusCode: 401,
                        ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                        userAgent: req.headers['user-agent'],
                        payload: {
                            loginType: 'local',
                            reason: 'Invalid credentials or access not granted'
                        }
                    }
                }).catch(err => console.error("Erreur Log Prisma (401):", err));
                return res.status(401).json({
                    'code': 401,
                    'response': 'HTTP Request Error : Access not granted. Please, login again.',
                    'data': {}
                });
            }
            if (result.data !== undefined) {
                res.cookie('access_token', result.data.access_token, {
                    httpOnly: false,
                    secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                    domain: '.' + process.env.COOKIE_DOMAIN
                });
                res.cookie('expires_in', result.data.expires_in, {
                    httpOnly: false,
                    secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                    domain: '.' + process.env.COOKIE_DOMAIN
                });
                res.cookie('refresh_expires_in', result.data.refresh_expires_in, {
                    httpOnly: false,
                    secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                    domain: '.' + process.env.COOKIE_DOMAIN
                });
                res.cookie('refresh_token', result.data.refresh_token, {
                    httpOnly: false,
                    secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                    domain: '.' + process.env.COOKIE_DOMAIN
                });


                req.session.user = {
                    givenname: result.data?.userInformations?.firstName,
                    sn: result.data?.userInformations.lastName,
                    eppn: result.data?.userInformations.username,
                    email: result.data?.userInformations.email,
                    role: result.data?.userInformations.roles
                };
                req.session.save((err: any) => {
                    if (err) {
                        console.error('Erreur lors de la sauvegarde de la session :', err);
                    }
                });
                await prisma.log.create({
                    data: {
                        userEmail: req.session.user.email,
                        action: 'CONNEXION_LOCALE',
                        method: 'POST',
                        endpoint: req.originalUrl,
                        statusCode: 200,
                        ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                        userAgent: req.headers['user-agent'],
                        payload: { loginType: 'local' }
                    }
                }).catch(err => console.error("Erreur Log Prisma:", err));
                return res.status(200).json({ code: 200, redirectUrl: '/authentication-return' });
            }
            return res.status(500).json({ code: 500, message: 'Unexpected error: No data returned' });
        } catch (error) {
            return res.status(500).json({ code: 500, message: 'Internal server error' });
        }
    };

    static async authShibboleth(req: Request, res: Response): Promise<Response> {

        if (!req.headers['x-user-eppn'] || !req.headers['x-user-givenname'] || !req.headers['x-user-sn']) {
            return res.status(400).json({
                'code': 400,
                'response': 'Missing required headers.',
                'data': {}
            });
        }

        const result = await authentificationController.login(req, res, true, req.headers['x-user-eppn'], req.headers['x-user-givenname'], req.headers['x-user-sn']).then((response) => {
            if (!response?.isValid) {
                return res.status(401).json({
                    'code': 401,
                    'response': 'HTTP Request Error : Access not granted. Please, login again.',
                    'data': {}
                });
            }
            return response;
        });

        res.cookie('access_token', result.data.access_token, {
            httpOnly: false,
            secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
            domain: '.' + process.env.COOKIE_DOMAIN
        });
        res.cookie('expires_in', result.data.expires_in, {
            httpOnly: false,
            secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
            domain: '.' + process.env.COOKIE_DOMAIN
        });
        res.cookie('refresh_expires_in', result.data.refresh_expires_in, {
            httpOnly: false,
            secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
            domain: '.' + process.env.COOKIE_DOMAIN
        });
        res.cookie('refresh_token', result.data.refresh_token, {
            httpOnly: false,
            secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
            domain: '.' + process.env.COOKIE_DOMAIN
        });
        req.session.user = {
            givenname: req.headers['x-user-givenname'],
            sn: req.headers['x-user-sn'],
            eppn: req.headers['x-user-eppn'],
            email: req.headers['x-user-email'],
            role: result.data?.userInformations.roles
        };

        await prisma.log.create({
            data: {
                userEmail: req.session.user.email,
                action: 'CONNEXION_SHIBBOLETH',
                method: 'GET',
                endpoint: req.originalUrl,
                statusCode: 302,
                ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                userAgent: req.headers['user-agent'],
                payload: { eppn: req.headers['x-user-eppn'] }
            }
        }).catch(err => console.error("Erreur Log Prisma:", err));

        return res.status(302).redirect('/authentication-return');
    }

    static async getMyInfo(req: Request, res: Response): Promise<Response> {
        if (!req.session) {
            return res.status(400).json({
                code: 400,
                message: 'No active session found.'
            });
        }

        if (!req.session.user) {
            return res.status(401).json({
                code: 401,
                response: 'Utilisateur non authentifié ou session invalide.',
            });
        }

        const isTokenValid = await KeycloakService.tokenIntrospection(req.cookies['access_token']).then(data => {
            return data;
        }).catch(error => {
            return false;
        });

        if (!isTokenValid) {

            return res.status(419).json({
                code: 419,
                response: 'Token invalide ou expiré. Authentication timeout.',
            });
        }

        return res.status(200).json({
            data: {
                ...req.session.user
            }
        });
    }



    // Processus : 
    // Si login via shibboleth :
    // si pas de compte alors on en créé un
    // si compte existant alors on le connecte via un mot de passe temporaire car on ne veut pas définir de mot de passe
    //    persistant
    // Si login via local account
    // alors on le login via les credentials fournis dans le formulaire
    static async login(req: Request, res: Response, fromShibboleth: boolean, eppn?: string, firstname?: string, lastname?: string): Promise<Object> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        let username = undefined;
        let password = undefined;

        if (!fromShibboleth) {
            username = req.body.username || '';
            password = req.body.password || '';
            if (!username || !password) {
                return {
                    isValid: false,
                    code: 400,
                    message: 'Username and password must be provided.'
                };
            }
        }
        let resultUserInfo = await KeycloakService.getUserInformations(access_token, fromShibboleth ? eppn : username);
        if (fromShibboleth) {
            try {
                // Login via shibboleth & creation de compte utilisateur
                if (resultUserInfo.code === 404) {
                    await KeycloakService.createAccount(access_token, eppn, firstname, lastname);
                    resultUserInfo = await KeycloakService.getUserInformations(access_token, eppn);
                    let observateurRole = undefined;
                    const response = await KeycloakService.getExistantsRoles(access_token).then(roles => {
                        return roles.data.find(role => role.name === 'enseignant');
                    })
                    await KeycloakService.changeRoleOfUser(access_token, resultUserInfo[0].id, response.id);
                    resultUserInfo = await KeycloakService.getUserInformations(access_token, eppn);

                }
            } catch (error) {
                throw error;
            }
        }

        // Generation d'un mot de passe temporaire et éphémère pour la connexion
        if (fromShibboleth) {
            try {
                const passwordReturned = await KeycloakService.generatePasswordForShibbolethAccount(access_token, resultUserInfo[0].id).then(data => {
                    return data;
                })
                if (passwordReturned.length !== 0) {
                    password = passwordReturned;
                } else {
                    return {
                        isValid: false,
                        code: 500,
                        message: 'An error occurred while generating a temporary password.'
                    };
                }
            } catch (error) {
                throw error;
            }
        }
        if (fromShibboleth) {
            username = eppn;
        }
        const r = await KeycloakService.getTokenForUserConnection(access_token, username, password)
            .then(tokenForUser => { return tokenForUser; })
            .catch(error => { logger.error('Error occurred:', error); return error; });
        if (r.code !== 200) {
            return {
                isValid: false,
                code: 401,
                message: 'HTTP Request Error : Access not granted. Please, login again.'
            }
        }

        let dataR = {
            access_token: r.data.access_token,
            expires_in: r.data.expires_in,
            refresh_expires_in: r.data.refresh_expires_in,
            refresh_token: r.data.refresh_token,
            userInformations: resultUserInfo[0]
        }
        try {
            const userRoleNames = await KeycloakService.getRoleOfUser(
                access_token,
                resultUserInfo[0].id
            );

            const existingRoles = await KeycloakService.getExistantsRoles(access_token);

            const roleNamesArray = Array.isArray(userRoleNames) ? userRoleNames : [userRoleNames];
            const enrichedRoles = existingRoles.data.filter((role: any) =>
                roleNamesArray.includes(role.displayName)
            );

            dataR.userInformations.roles = enrichedRoles;

        } catch (error) {
            console.error(error);
            throw error;
        }




        return {
            isValid: true,
            code: 200,
            message: 'Login successful',
            data: dataR
        }
    }

    static async logout(req: Request, res: Response): Promise<void> {
        if (!req.session) {
            return res.status(400).json({
                code: 400,
                message: 'No active session found.'
            });
        }
        try {
            // Supprimer les cookies
            res.clearCookie('connect.sid', {
                httpOnly: false,
                secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                domain: '.' + process.env.COOKIE_DOMAIN
            });
            res.clearCookie('access_token', {
                httpOnly: false,
                secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                domain: '.' + process.env.COOKIE_DOMAIN
            });
            res.clearCookie('expires_in', {
                httpOnly: false,
                secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                domain: '.' + process.env.COOKIE_DOMAIN
            });
            res.clearCookie('refresh_token', {
                httpOnly: false,
                secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                domain: '.' + process.env.COOKIE_DOMAIN
            });
            res.clearCookie('refresh_expires_in', {
                httpOnly: false,
                secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                domain: '.' + process.env.COOKIE_DOMAIN
            });

            // Détruire la session
            if (req.session) {
                await new Promise<void>((resolve, reject) => {
                    req.session.destroy((err) => {
                        if (err) {
                            logger.error('Erreur lors de la destruction de la session :', err.message || err);
                            return reject(err);
                        }
                        resolve();
                    });
                });
            }

            // Redirection après déconnexion
            return res.redirect('https://' + process.env.SERVER_NAME + '/Shibboleth.sso/Logout');
        } catch (error) {
            logger.error('Erreur lors du processus de déconnexion:');
            res.status(500).send('Erreur lors de la déconnexion.');
        }
    }

}
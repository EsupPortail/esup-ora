import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { logger } from '../configs/logger';

export class authentificationController {

    static async authLocalAccount(req: Request, res: Response): Promise<Response> {
        try {
            const result = await authentificationController.login(req, res, false).then((response) => {
                return response;
            });
            if (result.code !== 200) {
                return res.status(401).json({
                    'code': 401,
                    'response': 'HTTP Request Error : Access not granted. Please, login again.',
                    'data': {}
                });
            }
            logger.info(req.body.username + ' logged in.');
            if (result.data !== undefined) {
                res.cookie('access_token', result.data.access_token, {
                    httpOnly: false,
                    secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
                    domain: '.' + process.env.COOKIE_DOMAIN
                });
                res.cookie('expires_in', result.data.expires_in,{
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
                    role: result.data?.userInformations.roles[0]
                };
                req.session.save((err: any) => {
                    if (err) {
                        console.error('Erreur lors de la sauvegarde de la session :', err);
                    }
                });
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

        logger.info(req.headers['x-user-eppn'] + ' logged in.');
        res.cookie('access_token', result.data.access_token, {
            httpOnly: false,
            secure: process.env.COOKIE_DOMAIN === 'localhost' ? false : true,
            domain: '.' + process.env.COOKIE_DOMAIN
        });
        res.cookie('expires_in', result.data.expires_in,{
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

        return res.status(200).json({
            data: req.session.user,
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

        // Get keycloak token
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        let { username, password } = req.body;
        if( !fromShibboleth ) {
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
                    logger.info('First connection for user ' + eppn + '. Creating user account.');
                    await KeycloakService.createAccount(access_token, eppn, firstname, lastname);
                    logger.info('User account created with success. EPPN: ' + eppn);
                    resultUserInfo = await KeycloakService.getUserInformations(access_token, eppn);
                    let observateurRole = undefined;
                    const response = await KeycloakService.getExistantsRoles(access_token).then(roles => {
                        return roles.data.find(role => role.name === 'observateur');
                    })
                    await KeycloakService.changeRoleOfUser( access_token, resultUserInfo[0].id, response.id);
                    resultUserInfo = await KeycloakService.getUserInformations(access_token, eppn);                      

                }
            } catch (error) {
                // console.error('Error checking user existence:', error.response ? error.response.data : error.message);
                console.log(error);
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
                console.log(error);
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
            const role = await KeycloakService.getRoleOfUser( access_token, resultUserInfo[0].id).then( data => {
                return data;
            });
            dataR.userInformations.roles = role;
        } catch (error) {
                console.log(error);
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
                        logger.info('Session détruite avec succès.');
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
import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { logger } from '../configs/logger';
import axios from 'axios';
import qs from 'qs';

export class authentificationController {

    static async login(req: Request, res: Response) {
        
        // Get keycloak token
        const access_token = await KeycloakService.getToken().then( data => { 
            return data.access_token;
        });

        const { username, password } = req.body;
        logger.info(`Login attempt for user ${username}`);
        try {
            const resultUserInfo = await KeycloakService.getUserInformations( access_token, username );
            // Keycloak returns an array of users matching the username
            if( resultUserInfo.length === 0 ) {
                return {
                    isValid: false, 
                    code: 404,
                    message: 'User not found'
                };
            } else {
                // On login le user maintenant et on voudrait lui retourner le token fournit par keycloak pour son compte utilisateur
                const r = await KeycloakService.getTokenForUserConnection( access_token, username, password )
                    .then( tokenForUser => { return tokenForUser; });
                let dataR = { 
                    access_token: r.data.access_token,
                    expires_in: r.data.expires_in,
                    refresh_expires_in: r.data.refresh_expires_in,
                    refresh_token: r.data.refresh_token,
                    userInformations: resultUserInfo[0]
                }
                return {
                    isValid: true,
                    code: 200,
                    message: 'Login successful',
                    data: dataR
                }
            }
        } catch (error) {
            // console.error('Error checking user existence:', error.response ? error.response.data : error.message);
            console.log( error );
            throw error;
        }
    }

    static async logout(req: Request, res: Response) {
        let currentToken = undefined;

        if( req.body.oratoken === undefined ) {
            return res.status( 401 ).json({
                'code': 401,
                'response': 'HTTP Request Error : Access not granted. Please, login.',
                'data': {}
            });
        }

        const tokenLogoutUrl = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/revoke';

        const data = qs.stringify({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET, 
            grant_type: 'client_credentials',
            token_type_hint: 'access_token',
            token: req.body.oratoken
        });

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        let statusCode = undefined;

        try {
            await axios.post(tokenLogoutUrl, data, config).then(response => {
                statusCode = response.status;
            })
            .catch(error => {
                console.error(error);
                return false;
            });
        } catch (error) {
            console.error('Error occurred:', error);
            return false;
        }
        
        if( statusCode !== 200 ) {
            return {
                isValid: false,
                code: 500,
                message: "An error occurred while logout to system."
            }    
        }
        
        return {
            isValid: true,
            code: 200,
            message: "Logout was success."
        }
    }

}
import qs from 'qs';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../configs/logger';

const middlewareGuardian = async (req : Request, res : Response, next : NextFunction) => {
    logger.info('Guardian privilege activated');
    let currentToken = undefined;
    let middlewareIsOk = false;

    if( req.body.oratoken === undefined ) {
        return res.status( 403 ).json({ redirect: true, redirectPath: '/login' } );
    } else {
        currentToken = req.body.oratoken;
        const tokenIntrospectValidityURL = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token/introspect';

        const data = qs.stringify({
            token: currentToken,
            grant_type: 'client_credentials',
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET
        });

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        middlewareIsOk = true;
        let tokenIsActive = true;
        try {
            await axios.post(tokenIntrospectValidityURL, data, config).then(response => {
                tokenIsActive = response.data.active;
                if( tokenIsActive === false ) {
                    middlewareIsOk = false;
                    return res.status( 401 ).json({ redirect: true, redirectPath: '/login' } );
                }
            })
            .catch(error => {
                console.error(error);
                return false;
            });
        } catch (error) {
            console.error('Error occurred:', error.response ? error.response.data : error.message );
            return res.status( 401 ).json({ redirect: true, redirectPath: '/login' } );
        }
    }
    if( middlewareIsOk ) {
        logger.info('Authentication middleware validate access.');

        // Call next function of route.
        next();
    }
    else {
        return;
    }
};

// const testAuthentHandler = async ( req, method, expectedHeaders, expectedBody ) => {
//     console.log('MiddlewareGuardian : test is a success.');
//     return {
//         isValid: true,
//         code: 200,
//         message: 'MiddlewareGuardian : test is a success.'
//     }
// };

export {
    middlewareGuardian
};

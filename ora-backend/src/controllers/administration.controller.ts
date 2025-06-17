import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { logger } from '../configs/logger';

export class administrationController {
    static async changeRoleOfUser( req: Request, res: Response ): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const { userId, roleId } = req.body;

        const result = await KeycloakService.changeRoleOfUser( access_token, userId, roleId ).then( (result) => {
            return result;
        });

        return res.status(200).json(result);
    }

    static async getExistantsRoles(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const roles = await KeycloakService.getExistantsRoles( access_token ).then( (result) => {
            return result;
        });

        return res.status(200).json(roles);
    }

    static async getUsers(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const users = await KeycloakService.getUsersList( access_token ).then( (result) => {
            return result;
        });

        return res.status(200).json(users);
    }
    
}
import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { logger } from '../configs/logger';
import { prisma } from '../services/prisma.service';
import { routes } from '../configs/open-endpoints.routes.json';

export class administrationController {
    static async deleteClient(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const { clientId } = req.body;

        if (!clientId) {
            return res.status(400).json({ message: 'Données manquantes : clientId est requis' });
        }

        try {
            const result = await KeycloakService.deleteClientId(access_token, clientId);
            return res.status(result.code).json(result);
        } catch (error: any) {
            logger.error('Error deleting client:', error);
            return res.status(500).json({ message: 'Error deleting client', details: error.message });
        }
    }

    static async getOpenEndpoints(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json({
                routes: routes
            });
        } catch (error: any) {
            logger.error('Error fetching available routes:', error);
            return res.status(500).json({ message: 'Error fetching available routes', details: error.message });
        }
    }


    static async getClients(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        try {
            const result = await KeycloakService.getClients(access_token);
            return res.status(result.code).json(result);
        } catch (error: any) {
            logger.error('Error fetching clients:', error);
            return res.status(500).json({ message: 'Error fetching clients', details: error.message });
        }
    }
    static async addClient(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const { clientName } = req.body;

        if (!clientName) {
            return res.status(400).json({ message: 'Données manquantes : clientName est requis' });
        }

        try {
            const result = await KeycloakService.addClientId(access_token, clientName);
            return res.status(200).json(result);
        } catch (error: any) {
            logger.error('Error adding client:', error);
            return res.status(500).json({ message: 'Error adding client', details: error.message });
        }
    }

    static async changeRoleOfUser(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const { userId, roleId } = req.body;

        const result = await KeycloakService.changeRoleOfUser(access_token, userId, roleId).then((result) => {
            return result;
        });

        await prisma.log.create({
            data: {
                userEmail: (req.session as any)?.user?.email || 'anonymous',
                action: 'ADMIN_CHANGE_USER_ROLE',
                method: 'POST',
                endpoint: req.originalUrl,
                statusCode: 200,
                ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                userAgent: req.headers['user-agent'],
                payload: { target_userId: userId, target_roleId: roleId }
            }
        }).catch(err => console.error("Erreur Log Prisma:", err));

        return res.status(200).json(result);
    }

    static async addRoleToUser(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const { userId, roleId } = req.body;

        const result = await KeycloakService.addRoleToUser(access_token, userId, roleId).then((result) => {
            return result;
        });

        return res.status(200).json(result);
    }

    static async removeRoleFromUser(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const { userId, roleId } = req.body;

        const result = await KeycloakService.removeRoleFromUser(access_token, userId, roleId).then((result) => {
            return result;
        });

        return res.status(200).json(result);
    }

    static async getExistantsRoles(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const roles = await KeycloakService.getExistantsRoles(access_token).then((result) => {
            return result;
        });

        return res.status(200).json(roles);
    }

    static async getUsers(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        const users = await KeycloakService.getUsersList(access_token).then((result) => {
            return result;
        });

        return res.status(200).json(users);
    }

    static async addUser(req: Request, res: Response): Promise<Response> {
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Données manquantes ou corps de requête invalide',
                details: {
                    username: !req.body?.username,
                    email: !req.body?.email,
                    password: !req.body?.password
                }
            });
        }

        const { username, email, password } = req.body;

        try {
            await KeycloakService.createLocalAccount(
                access_token,
                username,
                email,
                password
            );

            const newUser = await KeycloakService.getUserInformations(access_token, username);
            let observateurRole = undefined;
            const response = await KeycloakService.getExistantsRoles(access_token).then(roles => {
                return roles.data.find(role => role.name === 'enseignant');
            })
            await KeycloakService.changeRoleOfUser(access_token, newUser[0].id, response.id);
            await prisma.log.create({
                data: {
                    userEmail: (req.session as any)?.user?.email || 'anonymous',
                    action: 'ADMIN_ADD_USER_SUCCESS',
                    method: 'POST',
                    endpoint: req.originalUrl,
                    statusCode: 200,
                    ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                    userAgent: req.headers['user-agent'],
                    payload: { created_username: username, created_email: email, password: '***' } // Sécurité !
                }
            }).catch(err => console.error("Erreur Log Prisma:", err));

            return res.status(200).json({
                message: 'User added successfully',
            });
        } catch (error: any) {
            logger.error('Error adding user:', error);
            return res.status(500).json({ message: 'Error adding user' });
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<Response> {
        // 1. Récupération du token via le service
        const access_token = await KeycloakService.getToken().then(data => {
            return data.access_token;
        });

        // 2. Extraction du paramètre 'user-id' depuis le corps du POST (req.body)
        const userId = req.body['user-id'];

        if (!userId) {
            return res.status(400).json({
                message: "L'identifiant 'user-id' est manquant dans le corps de la requête",
            });
        }

        try {
            // 3. Appel de la suppression dans Keycloak
            const result = await KeycloakService.deleteUser(access_token, userId);

            if (result.code === 204 || result.code === 200) {
                await prisma.log.create({
                    data: {
                        userEmail: (req.session as any)?.user?.email || 'anonymous',
                        action: action,
                        method: 'POST',
                        endpoint: req.originalUrl,
                        statusCode: status,
                        ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
                        userAgent: req.headers['user-agent'],
                        payload: { deleted_userId: userId }
                    }
                }).catch(err => console.error("Erreur Log Prisma:", err));
                return res.status(200).json({
                    message: 'User deleted successfully from Keycloak',
                });
            } else if (result.code === 404) {
                return res.status(404).json({
                    message: 'User not found in Keycloak',
                });
            } else {
                throw new Error(result.message);
            }

        } catch (error: any) {
            logger.error('Error deleting user:', error);
            return res.status(500).json({
                message: 'Error deleting user',
                details: error.message
            });
        }
    }
}
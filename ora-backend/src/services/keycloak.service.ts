
import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { logger } from '../configs/logger';

export class KeycloakService {

    static async getClients(access_token: string): Promise<any> {
        const clientsURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/clients`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.get(clientsURL, config);
            const clients = response.data
                .filter((client: { clientId: string }) =>
                    client.clientId?.startsWith('distant-access-ora-')
                )
                .map((client: {
                    id: string;
                    clientId: string;
                    name: string;
                    enabled: boolean;
                    attributes: { 'ora-distant-access-api': string[] }
                }) => ({
                    id: client.id,
                    clientId: client.clientId,
                    name: client.name || client.clientId,
                    enabled: client.enabled,
                }));

            return {
                code: 200,
                message: 'Clients fetched successfully',
                data: { clients: clients }
            };
        } catch (err: any) {
            logger.error('Error fetching clients:', err.message);
            return {
                code: 500,
                message: 'An error occurred while fetching clients.',
                error: err.message,
            };
        }
    }
    static async addClientId(access_token: string, clientName: string): Promise<any> {
        const clientsURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/clients`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        const clientId = `distant-access-ora-${clientName}`;

        try {
            const existing = await axios.get(`${clientsURL}?clientId=${clientId}`, config);
            if (existing.data && existing.data.length > 0) {
                return {
                    code: 409,
                    message: `Client '${clientId}' already exists.`,
                };
            }
        } catch (err: any) {
            logger.error('Error checking existing client:', err.message);
            return {
                code: 500,
                message: 'An error occurred while checking existing clients.',
                error: err.message,
            };
        }

        const data = {
            clientId: clientId,
            name: clientId,
            enabled: true,
            serviceAccountsEnabled: true,
            publicClient: false,
            standardFlowEnabled: false,
            implicitFlowEnabled: false,
            directAccessGrantsEnabled: false,
            authorizationServicesEnabled: false,
            attributes: {
                "ora-distant-access-api": "true",
            },
        };

        try {
            // 1. Création du client
            await axios.post(clientsURL, data, config);

            // 2. Récupération de l'UUID du client créé
            const clientInfo = await axios.get(`${clientsURL}?clientId=${clientId}`, config);
            const uuid = clientInfo.data[0].id;

            // 3. Récupération du service account lié au client
            const serviceAccountURL = `${clientsURL}/${uuid}/service-account-user`;
            const serviceAccount = await axios.get(serviceAccountURL, config);
            const serviceAccountId = serviceAccount.data.id;

            // 4. Récupération des rôles realm actuellement assignés au service account
            const assignedRolesURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${serviceAccountId}/role-mappings/realm`;
            const assignedRoles = await axios.get(assignedRolesURL, config);
            // Juste avant le filtre, étape 5
            console.log('=== SERVICE ACCOUNT ID ===', serviceAccountId);
            console.log('=== ROLES ASSIGNÉS ===', JSON.stringify(assignedRoles.data, null, 2));

            // 6. Récupération du secret
            const secretRes = await axios.get(`${clientsURL}/${uuid}/client-secret`, config);
            const secret = secretRes.data.value;

            return {
                code: 201,
                message: 'Client created successfully',
                data: {
                    clientId: clientId,
                    secret: secret,
                },
            };
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            return {
                code: 500,
                message: 'An error occurred while creating the client.',
                error: err.message,
            };
        }
    }

    static async checkClientHasDistantAccessAttribute(userAccessToken: string): Promise<boolean> {
        const payload = JSON.parse(Buffer.from(userAccessToken.split('.')[1], 'base64').toString());
        const clientId = payload.azp || payload.client_id;

        if (!clientId) {
            logger.error('checkClientHasDistantAccessAttribute: aucun clientId trouvé dans le token');
            return false;
        }

        const url = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/clients?clientId=${clientId}`;

        try {
            const { access_token } = await this.getToken();

            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                }
            });

            const clients = response.data;
            if (!clients || clients.length === 0) return false;

            return clients[0].attributes?.['ora-distant-access-api'] === 'true';

        } catch (error: any) {
            logger.error('Erreur checkClientHasDistantAccessAttribute:', error.message);
            return false;
        }
    }
    
    static async deleteClientId(access_token: string, clientId: string): Promise<any> {
        const clientsURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/clients`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        // 1. Récupération de l'UUID à partir du clientId
        let uuid: string;
        try {
            const existing = await axios.get(`${clientsURL}?clientId=${clientId}`, config);
            if (!existing.data || existing.data.length === 0) {
                return {
                    code: 404,
                    message: `Client '${clientId}' introuvable.`,
                };
            }
            uuid = existing.data[0].id;
        } catch (err: any) {
            logger.error('Error finding client:', err.message);
            return {
                code: 500,
                message: 'An error occurred while finding the client.',
                error: err.message,
            };
        }

        // 2. Suppression du client Keycloak
        try {
            await axios.delete(`${clientsURL}/${uuid}`, config);

            // 3. Suppression des entrées liées en base

            return {
                code: 200,
                message: `Client '${clientId}' supprimé avec succès.`,
            };
        } catch (err: any) {
            logger.error('Error deleting client:', err.message);
            return {
                code: 500,
                message: 'An error occurred while deleting the client.',
                error: err.message,
            };
        }
    }

    static async addRoleToUser(access_token: string, id_user: string, id_role: string): Promise<any> {
        const roleURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${id_user}/role-mappings/realm`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        const existingRoles = await this.getExistantsRoles(access_token);
        const roleRepresentation = existingRoles.data.find((role: { id: string }) => role.id === id_role);

        if (!roleRepresentation) {
            return {
                code: 404,
                message: 'Role not found',
            };
        }

        const data = [
            {
                id: id_role,
                name: roleRepresentation.name,
                composite: false,
                clientRole: false,
                containerId: roleRepresentation.containerId
            }
        ];

        try {
            const result = await axios.post(roleURL, data, config).then(r => {
                return r;
            })

            return {
                code: 200,
                message: 'Role added successfully',
                data: result.data,
            };
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            return {
                code: 500,
                message: 'An error occurred while adding role.',
                error: err.message,
            }
        }
    }

    static async removeRoleFromUser(access_token: string, id_user: string, id_role: string): Promise<any> {
        const roleURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${id_user}/role-mappings/realm`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        const existingRoles = await this.getExistantsRoles(access_token);
        const roleRepresentation = existingRoles.data.find((role: { id: string }) => role.id === id_role);

        if (!roleRepresentation) {
            return {
                code: 404,
                message: 'Role not found',
            };
        }

        const data = [
            {
                id: id_role,
                name: roleRepresentation.name,
                composite: false,
                clientRole: false,
                containerId: roleRepresentation.containerId
            }
        ];

        try {
            const result = await axios.delete(roleURL, { data: data, ...config }).then(r => {
                return r;
            })

            return {
                code: 200,
                message: 'Role removed successfully',
                data: result.data,
            };
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            return {
                code: 500,
                message: 'An error occurred while removing role.',
                error: err.message,
            }
        }
    }

    static async changeRoleOfUser(access_token: string, id_user: string, id_role: string): Promise<any> {
        const roleURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${id_user}/role-mappings/realm`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        const existingRoles = await this.getExistantsRoles(access_token);
        const roleRepresentation = existingRoles.data.find((role: { id: string }) => role.id === id_role);

        if (!roleRepresentation) {
            return {
                code: 404,
                message: 'Role not found',
            };
        }

        const data = [
            {
                id: id_role,
                name: roleRepresentation.name,
                composite: false,
                clientRole: false,
                containerId: roleRepresentation.containerId
            }
        ];


        try {
            const userRolesURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${id_user}/role-mappings/realm`;
            const userRolesResponse = await axios.get(userRolesURL, config);
            const userRoles = userRolesResponse.data.filter((role: { attributes: { 'ora-roles': string[] } }) => role.attributes?.['ora-roles']?.includes('true'));
            await axios.delete(roleURL, { data: userRoles.data, ...config });

            const result = await axios.post(roleURL, data, config).then(r => {
                return r;
            })


            return {
                code: 200,
                message: 'Role changed successfully',
                data: result.data,
            };
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            return {
                code: 500,
                message: 'An error occurred while changing role.',
                error: err.message,
            }
        }
    }

    static async revokeToken(access_token: string, user_id: string) {
        const revokeTokenURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${user_id}/logout`;
        const config = {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            await axios.post(revokeTokenURL, {}, config);
        } catch (err: any) {
            logger.error('Error revoking token:', err.message);
            throw err;
        }
    }

    static async getExistantsRoles(access_token: string): Promise<any> {
        const rolesURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/roles?briefRepresentation=false`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.get(rolesURL, config);
            const roles = response.data
                .filter((role: { id: string, name: string, description: string, attributes: { 'ora-roles': string[], 'display_name': string[] } }) => role.attributes?.['ora-roles']?.includes('true'))
                .map((role: {
                    attributes: any; id: string; name: string; description: string
                }) => ({
                    id: role.id,
                    name: role.name,
                    hierarchy: role.attributes?.hierarchy ? parseInt(role.attributes.hierarchy[0], 10) : null,
                    displayName: role.attributes?.display_name[0] || null,
                    description: role.description || null,
                }));
            return {
                code: 200,
                message: 'Roles fetched successfully',
                data: roles,
            };
        } catch (err: any) {
            logger.error('Error fetching roles:', err.message);
            return {
                code: 500,
                message: 'An error occurred while fetching roles.',
                error: err.message,
            };
        }
    }

    static async getRoleOfUser(access_token: string, user_id: string) {
        const getRoleUserURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users`;
        const endPointRole = '/role-mappings/realm';
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const rolesResponse = await axios.get(`${getRoleUserURL}/${user_id}${endPointRole}`, config).then(d => {
                return d.data;
            })
            const existantsRoles = await this.getExistantsRoles(access_token);
            const roles = rolesResponse.map((r: { id: any; name: any }) => ({
                id: r.id,
                name: r.name
            }));
            const filteredRoles = existantsRoles.data.filter((role: { id: string; name: string }) =>
                roles.some((existantRole: { id: string }) => existantRole.id === role.id)
            );
            return filteredRoles.map((ro: any) => ro.displayName);
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            throw err;
        }
    }

    static async getUsersList(access_token: string): Promise<any> {
        const usersURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users`;
        const getRoleUserURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users`;
        const endPointRole = '/role-mappings/realm';
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const existantsRoles = await this.getExistantsRoles(access_token);

            const response = await axios.get(usersURL, config);
            const users: any[] = [];

            for (const user of response.data) {
                const rolesResponse = await axios.get(`${getRoleUserURL}/${user.id}${endPointRole}`, config);

                const roles = rolesResponse.data.map((r: { id: any; name: any }) => ({
                    id: r.id,
                    name: r.name
                }));
                const filteredRoles = existantsRoles.data.filter((role: { id: string; name: string }) =>
                    roles.some((existantRole: { id: string }) => existantRole.id === role.id)
                );
                users.push({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    fromShibboleth: user.attributes?.fromShibboleth ? user.attributes.fromShibboleth : false,
                    roles: filteredRoles
                });
            }

            return {
                code: 200,
                message: 'Users fetched successfully',
                data: users,
            };
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            throw err;
        }
    }

    static async tokenIntrospection(token_user_to_check: string): Promise<Boolean> {
        const tokenIntrospectionURL = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token/introspect';

        if (!token_user_to_check || token_user_to_check === 'undefined') {
            return false;
        }

        const data = qs.stringify({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            token: token_user_to_check
        });

        const config = {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };


        const res = await axios.post(tokenIntrospectionURL, data, config).then(response => {
            return response.data.active;
        })

        return res;
    }

    static async generatePasswordForShibbolethAccount(access_token: string, user_id: string): Promise<string> {
        const password = Math.random().toString(36).slice(-8);
        const urlForEditingPasswordUser = process.env.KEYCLOAK_HOST + 'admin/realms/' + process.env.KEYCLOAK_REALM + '/users/' + user_id + '/reset-password';
        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        };

        const data = {
            type: 'password',
            value: password,
            temporary: false,
        };

        try {
            const response = await axios.put(urlForEditingPasswordUser, data, config).then(response => { return response });
            return password;
        } catch (error: any) {
            return '';
        }
    }

    static async createLocalAccount(access_token: string, username: string, email: string, password: string): Promise<any> {
        const userURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        };

        const data = {
            username: username,
            firstName: username,
            lastName: username,
            email: email,
            enabled: true,
            emailVerified: true,
            credentials: [
                {
                    type: 'password',
                    value: password,
                    temporary: false,
                }
            ],
            attributes: {
                "fromShibboleth": ["false"]
            }
        };

        try {
            const result = await axios.post(userURL, data, config).then(response => {
            });
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            throw err;
        }
    }

    static async createAccount(access_token: string, username: string, firstname: string, lastname: string): Promise<any> {
        const userURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        };

        const data = {
            username: username,
            firstName: firstname,
            lastName: lastname,
            email: username,
            enabled: true,
            emailVerified: true,
            attributes: {
                "fromShibboleth": ["true"]
            }
        };

        try {
            const result = await axios.post(userURL, data, config).then(response => {
            });
            // return result.data;
        } catch (err: any) {
            logger.error('Error occurred:', err.message);
            throw err;
        }
    }

    static async refreshToken(refreshToken: string): Promise<any> {
        const tokenUrl = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token';
        const data = qs.stringify({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });

        const config = {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        try {
            const result = await axios.post(tokenUrl, data, config).then(response => {
                return response.data;
            });
            return result;
        } catch (err: any) {
            return undefined
        }
    }
    static async getToken(): Promise<any> {

        const tokenUrl = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token';
        const data = qs.stringify({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: 'client_credentials'
        });

        const config = {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        let aToken = undefined;
        let expiresDelay = undefined;

        try {
            const response = await axios.post(tokenUrl, data, config);
            aToken = response.data.access_token;
            expiresDelay = response.data.expires_in;
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                logger.error('Token has expired:');
            } else {
                logger.error('Error occurred:');
            }
        }

        return {
            access_token: aToken,
            expires_in: expiresDelay
        }
    }

    static async getTokenByClientCredentials(clientId: string, clientSecret: string): Promise<any> {
        const tokenUrl = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token';

        const data = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        });

        const config = {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        try {
            const response = await axios.post(tokenUrl, data, config);
            return {
                code: 200,
                data: {
                    access_token: response.data.access_token,
                    expires_in: response.data.expires_in,
                    token_type: response.data.token_type,
                }
            };
        } catch (error: any) {
            if (error.response?.status === 401) {
                logger.error('Client credentials invalides:', clientId);
            } else {
                logger.error('Erreur getTokenByClientCredentials:', error.message);
            }
            return { code: error.response?.status ?? 500, data: null };
        }
    }

    static async getUserInformations(access_token: string, username: string): Promise<any> {
        const userInformationsURL = process.env.KEYCLOAK_HOST + 'admin/realms/' + process.env.KEYCLOAK_REALM + '/users?username=' + username + '&exact=true';
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        const data = qs.stringify({});

        try {

            const result = await axios.get(userInformationsURL, config).then(response => {
                if (response.data.length === 0) {
                    return {
                        code: 404,
                        message: 'User not found'
                    }
                } else {
                    return response.data;
                }
            })
            return result;
        } catch (err: any) {
            logger.error('Error occurred: when getting user informations');
        }
    }

    static async deleteUser(access_token: string, id_user: string): Promise<any> {
        const userURL = `${process.env.KEYCLOAK_HOST}admin/realms/${process.env.KEYCLOAK_REALM}/users/${id_user}`;

        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const result = await axios.delete(userURL, config);

            return {
                code: 204,
                message: 'User deleted successfully',
                data: result.data,
            };
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                return {
                    code: 404,
                    message: 'User not found',
                };
            }

            logger.error('Error occurred during user deletion:', err.message);
            return {
                code: 500,
                message: 'An error occurred while deleting user.',
                error: err.message,
            };
        }
    }

    static async getTokenForUserConnection(access_token: string, username: string, password: string): Promise<any> {
        const tokenUrl = process.env.KEYCLOAK_HOST + 'realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token';

        const data = qs.stringify({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: 'password',
            username: username,
            password: password
        });

        const config = {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${access_token}`
            }
        };

        try {
            const result = await axios.post(tokenUrl, data, config).then(response => {
                if (response.data.access_token) {
                    return {
                        isValid: true,
                        code: 200,
                        message: 'Login successful',
                        data: {
                            access_token: response.data.access_token,
                            expires_in: response.data.expires_in,
                            refresh_expires_in: response.data.refresh_expires_in,
                            refresh_token: response.data.refresh_token,
                        }
                    };
                } else {
                    return {
                        isValid: false,
                        code: 401,
                        message: 'Invalid credentials'
                    };
                }
            })
            return result;
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                return {
                    isValid: false,
                    code: 401,
                    message: 'Token has expired'
                };
            } else {
                return {
                    isValid: false,
                    code: 500,
                    message: 'An error occurred while login to backend.'
                };
            }
        }
    }
}


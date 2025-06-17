import { defineStore } from 'pinia'
import axios from 'axios'
import { config } from '@/environment/environment'
import { backendRoutes } from '@/environment/backendRoutes'
import { postApiRequest } from '@/helpers/api/post'
import Cookies from 'js-cookie';
import router from '@/router/router'
import { paths } from '@/router/routesEnumeration'
import { useEtablissementStore } from './etablissementStore'

export const useConnectionStore = defineStore('connection', {
    // 1. State is a function returning an object
    state: () => ({
        token: {} as Record<string, any>,
        user: {} as Record<string, any>,
        isAuthenticated: false as boolean,
        loading: false as boolean,
        error: false as boolean | Object
    }),


    getters: {
    },

    actions: {
        async login() {
            this.loading = true
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get(config.backend.url + '/auth/me', {
                    withCredentials: true,
                    headers: {
                        Authorization: 'Bearer ' + this.token.access_token
                    }
                })
                if (response.data) {
                    this.isAuthenticated = true
                    this.user.email = response.data.data.email
                    this.user.eppn = response.data.data.eppn
                    this.user.givenname = response.data.data.givenname
                    this.user.sn = response.data.data.sn
                    this.user.roles = Array.isArray(response.data.data.role) ? response.data.data.role[0] : response.data.data.role;
                    const establissementStore = useEtablissementStore()
                    await establissementStore.fetchEtablissements()
                    this.user.etablissementSelected = establissementStore.etablissements[0]
                } else {
                    this.isAuthenticated = false;
                }
            } catch (error) {
                this.error = error as any
            } finally {
                this.loading = false
                router.push({path: paths.parcoursFormation});
            }
        },

        async completeCookie() {
            // Récupération des cookies nécessaires
            const accessToken = Cookies.get('access_token');
            const expiresIn = Cookies.get('expires_in');
            const refreshToken = Cookies.get('refresh_token');
            const refreshExpiresIn = Cookies.get('refresh_expires_in');
        
            // Vérifiez si tous les cookies sont présents
            if (!accessToken || !expiresIn || !refreshToken || !refreshExpiresIn) {
                console.warn('One or more required cookies are missing');
                return;
            }
        
            // Stockage des cookies récupérés dans l'objet
            this.token = {
                access_token: accessToken,
                expires_in: parseInt(expiresIn, 10),
                refresh_token: refreshToken,
                refresh_expires_in: parseInt(refreshExpiresIn, 10),
            };
            console.log(this.token);
        },

        async localLogin(username: string, password: string) {
            console.log('localLogin');
            const body = {
                username: username,
                password: password
            }
            const result = await postApiRequest(config.backend.url + backendRoutes.login, body).then((response) => {
                return response;
            });
            if( result.code !== 200 ) {
                return {
                    isValid: false,
                    code: 401,
                    message: 'Données de connexion invalide'
                }
            } else {
                await this.completeCookie();
                await this.login();
            }
        }, 

        async logout() {
            this.loading = true;
        
            console.log('hello')
            this.token = {};
            this.user = {};
            this.isAuthenticated = false;
        
            try {
                await axios.get(config.backend.url + '/auth/logout');
                
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    Cookies.remove(cookie);
                }
            } catch (error) {
                this.error = error as any;
            } finally {
                this.loading = false;
                window.location.reload();
            }
        }
        
    },
    persist: {
        pick: ['isAuthenticated', 'user', 'token']
    }
})

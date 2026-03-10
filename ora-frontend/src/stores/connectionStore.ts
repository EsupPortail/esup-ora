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
        selectedRole: {} as Record<string, any>,
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
                    this.user.roles = response.data.data.role;
                    this.selectedRole = this.user.roles[0]

                    localStorage.setItem('selectedRole', JSON.stringify(this.selectedRole))
                    console.log('Rôle sélectionné après login :', this.selectedRole);

                    const establissementStore = useEtablissementStore()
                    await establissementStore.fetchEtablissements()
                    this.user.etablissementSelected = establissementStore.etablissements[0]
                } else {
                    this.isAuthenticated = false;
                }
            } catch (error) {
                this.error = error as any
                console.log('Erreur lors de la récupération des informations utilisateur :', error);
            } finally {
                this.loading = false
                console.log('Redirection après login');
                router.push({ path: paths.parcoursFormation });
            }
        },

        async completeCookie() {
            const accessToken = Cookies.get('access_token');
            const expiresIn = Cookies.get('expires_in');
            const refreshToken = Cookies.get('refresh_token');
            const refreshExpiresIn = Cookies.get('refresh_expires_in');

            if (!accessToken || !expiresIn || !refreshToken || !refreshExpiresIn) {
                console.warn('One or more required cookies are missing');
                return;
            }

            this.token = {
                access_token: accessToken,
                expires_in: parseInt(expiresIn, 10),
                refresh_token: refreshToken,
                refresh_expires_in: parseInt(refreshExpiresIn, 10),
            };
        },

        async localLogin(username: string, password: string) {
            const body = {
                username: username,
                password: password
            }
            const result = await postApiRequest(config.backend.url + backendRoutes.login, body).then((response) => {
                return response;
            });
            if (result.code !== 200) {
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
            
            try {
                // Appel API logout si nécessaire
                await axios.get(config.backend.url + '/auth/logout');
            } catch (error) {
                console.error('Erreur lors du logout API', error);
            } finally {
                // --- DÉSTRUCTURATION ET RÉINITIALISATION COMPLÈTE ---
                this.$patch({
                    token: {},
                    user: {},
                    selectedRole: {},
                    isAuthenticated: false,
                    loading: false,
                    error: false
                });

                // Nettoyage Storage
                localStorage.removeItem('selectedRole');
                localStorage.removeItem('connection'); // Si utilisé par pinia-plugin-persistedstate

                // Nettoyage de TOUS les cookies connus
                const allCookies = Cookies.get();
                Object.keys(allCookies).forEach(cookieName => Cookies.remove(cookieName));

                // Hard reload pour purger tous les états restants
                window.location.href = paths.login;
            }
        },
    },
    persist: {
        pick: ['isAuthenticated', 'user', 'token', 'selectedRole']
    }
})

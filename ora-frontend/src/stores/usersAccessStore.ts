import { defineStore } from 'pinia'
import axios from 'axios'

import { useConnectionStore } from './connectionStore'
import { config } from '@/environment/environment'

export const useUserAccessStore = defineStore('users-access', {
    state: () => ({
        users: [] as Array<any>,
        roles: {} as Record<string, any>,
        loading: false as boolean,
        error: false as boolean | Record<string, any>
    }),
    getters: {
    },
    actions: {
        fetchRoles() {
            return new Promise(async (resolve, reject) => {
                const connectionStore = useConnectionStore()
                await axios.get(config.backend.url + '/admin/roles', {
                    withCredentials: true,
                    headers: {
                        Authorization: 'Bearer ' + connectionStore.token.access_token
                    }
                }).then((res) => {
                    console.log(res);
                    this.roles = res.data.data;
                    resolve(res.data);
                }).catch((err) => {
                    console.log(err);
                })
            })
        },
        fetchUsers() {
            return new Promise(async (resolve, reject) => {
                const connectionStore = useConnectionStore()
                await axios.get(config.backend.url + '/admin/users', {
                    withCredentials: true,
                    headers: {
                        Authorization: 'Bearer ' + connectionStore.token.access_token
                    }
                }).then((res) => {
                    this.users = res.data.data;
                    resolve(res.data);
                }).catch((err) => {
                    console.log(err);
                })
            })
        },
        addUser(userData: any) {
            return new Promise((resolve, reject) => {
            })
        }
    },
    persist: {
        pick: []
    }
})

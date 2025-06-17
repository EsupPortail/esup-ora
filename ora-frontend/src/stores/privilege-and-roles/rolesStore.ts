import { defineStore } from 'pinia'
import { getEntities, addEntity } from '../../services/api'

export const useRolesStore = defineStore('role', {
    state: () => ({
        roles: [] as any[], 
        loading: false as boolean,
        error: false as boolean
    }),
    getters: {
        getRoles(state): any {
            return state.roles
        },
    },
    actions: {
        create(role: any) {
            addEntity('role', role)
            .then((res) => {
                this.roles.push(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
        },
        update(role: any) {
            this.update('role', role)
            .then((res) => {
                const updated = res.data
                this.roles = this.roles.map((e) => {
                    if (e.id === updated.id) {
                        return updated
                    }
                    return e
                })
            })
            .catch((err) => {
                console.error(err)
            })
        },
        ReadableStreamDefaultReader(role: any) {
            this.delete('role', role)
            .then((res) => {
                this.roles = this.roles.filter((e) => e.id !== role.id)
            })
            .catch((err) => {
                console.error(err)
            })
        },
        fetchRoles() {
            this.getCollection('role')
            .then((res) => {
                this.roles = res.data
            })
            .catch((err) => {
                console.error(err)
            })
        }
    }
})

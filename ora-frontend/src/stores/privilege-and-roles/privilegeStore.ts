import { defineStore } from 'pinia'
import { getEntities, addEntity } from '../../services/api'

export const usePrivilegeStore = defineStore('privilege', {
    state: () => ({
        privileges: [] as any[], 
        loading: false as boolean,
        error: false as boolean
    }),
    getters: {
        getPrivileges(state): any {
            return state.privileges
        },
    },
    actions: {
        create(privilege: any) {
            addEntity('privilege', privilege)
            .then((res) => {
                this.privileges.push(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
        },
        update(privilege: any) {
            this.update('privilege', privilege)
            .then((res) => {
                const updated = res.data
                this.privileges = this.privileges.map((e) => {
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
        ReadableStreamDefaultReader(privilege: any) {
            this.delete('privilege', privilege)
            .then((res) => {
                this.privileges = this.privileges.filter((e) => e.id !== privilege.id)
            })
            .catch((err) => {
                console.error(err)
            })
        },
        fetchPrivileges() {
            this.getCollection('privilege')
            .then((res) => {
                this.privileges = res.data
            })
            .catch((err) => {
                console.error(err)
            })
        }
    }
})

import { defineStore } from 'pinia'

export const useClientEndpointStore = defineStore('clientEndpoint', {
    state: () => ({
        entity: 'link_client_to_ora_endpoint',
        links: [] as any[],
        loading: false,
        error: false as boolean | object,
    }),

    getters: {
        allLinks: (state) => state.links,

        byClientId: (state) => (clientId: string) =>
            state.links.filter((l: any) => l.client_id === clientId),
    },

    actions: {
        fetchLinks() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {})
                    .then((res: any) => {
                        this.links = [...res.data]
                        resolve(res.data)
                    })
                    .catch((err: any) => {
                        this.error = err
                        reject(err)
                    })
            })
        },

        createLink(link: { client_id: string; endpoint: string; read_only: boolean }) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, link)
                    .then((res: any) => {
                        this.links.push(res.data)
                        resolve(res.data)
                    })
                    .catch(reject)
            })
        },

        // Appelé après deleteClient : nettoyage local + suppression en base
        deleteByClientId(clientId: string) {
            const toDelete = this.links.filter((l: any) => l.client_id === clientId)
            toDelete.forEach((l: any) => {
                this.delete(this.entity, l).catch(() => {})
            })
            this.links = this.links.filter((l: any) => l.client_id !== clientId)
        },
    },
})
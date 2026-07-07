import { defineStore } from 'pinia'
// Supposons que tu as un service API ou un mixin pour getCollection
// J'utilise ici une structure similaire à ton exemple

export const useLogStore = defineStore('log', {
    state: () => ({
        entity: 'log',
        logs: [] as any[],
        loading: false,
        error: null as any
    }),
    
    getters: {
        allLogs: (state) => state.logs,
        // Filtres côté client (optionnel, utile pour la recherche instantanée)
        byUserEmail: (state) => (email: string) => state.logs.filter(l => l.userEmail === email),
        byIp: (state) => (ip: string) => state.logs.filter(l => l.ipAddress === ip),
        byStatus: (state) => (code: number) => state.logs.filter(l => l.statusCode === code),
    },

    actions: {
        // Récupération globale
        fetchLogs(params = {}) {
            this.loading = true
            return new Promise((resolve, reject) => {
                // Ici, on passe les params à l'API (ex: { userEmail: '...' })
                this.getCollection(this.entity, { params })
                    .then((res) => {
                        this.logs = res.data
                        resolve(res)
                    })
                    .catch((err) => {
                        this.error = err
                        reject(err)
                    })
                    .finally(() => this.loading = false)
            })
        },

        // Méthodes spécifiques demandées
        fetchByEmail(email: string) {
            return this.fetchLogs({ userEmail: email })
        },

        fetchByIp(ip: string) {
            return this.fetchLogs({ ipAddress: ip })
        },

        fetchByStatus(code: number) {
            return this.fetchLogs({ statusCode: code })
        }
    }
})
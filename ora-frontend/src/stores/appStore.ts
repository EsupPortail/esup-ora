import { defineStore } from 'pinia'

// loading et error sont des propriétés globales définis dans le crudStorePlugin
export const useAppStore = defineStore('app', {
    state: () => ({
        loading: false,
        error: false
    }),
    getters: {
        getLoadingState(state): boolean {
            return this.loading
        }
    },
    actions: {

    }
})

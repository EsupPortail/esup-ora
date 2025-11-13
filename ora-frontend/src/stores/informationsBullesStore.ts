import { defineStore } from 'pinia'

export const useApplicationInformationsBullesStore = defineStore('application_informations_bulles', {
    state: () => ({
        entity: 'application_informations_bulles',
        informations_bulles: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getApplicationInformationsBulles(state): any {
            return state.informations_bulles
        }
    },
    actions: {
        fetchApplicationInformationsBulles(): any {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity)
                    .then((res) => {
                        this.informations_bulles = res.data
                        resolve(res)
                    })
                    .catch((err) => {
                        this.error = err
                        reject(err)
                    })
            })
        },
        createApplicationInformationsBulle(informationsBulle: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, informationsBulle)
                    .then((res) => {
                        this.fetchApplicationInformationsBulles();
                        resolve(res)
                    })
                    .catch((err) => {
                        this.error = err
                        reject(err)
                    })
            })
        },
        updateApplicationInformationsBulle(informationsBulle: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, informationsBulle)
                    .then((res) => {
                        this.fetchApplicationInformationsBulles();
                        resolve(res)
                    })
                    .catch((err) => {
                        this.error = err
                        reject(err)
                    })
            })
        }
    }
})

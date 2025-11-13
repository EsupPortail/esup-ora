import { defineStore } from 'pinia'

export const useApplicationParameterStore = defineStore('application_parameter', {
    state: () => ({
        entity: 'application_parameter',
        application_parameters: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getApplicationParameters(state): any {
            return state.application_parameters
        }
    },
    actions: {
        fetchApplicationParameters(): any {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity)
                    .then((res) => {
                        this.application_parameters = res.data
                        resolve(res)
                    })
                    .catch((err) => {
                        this.error = err
                        reject(err)
                    })
            })
        },
        createApplicationParameter(applicationParameter: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, applicationParameter)
                    .then((res) => {
                        this.fetchApplicationParameters();
                        resolve(res)
                    })
                    .catch((err) => {
                        this.error = err
                        reject(err)
                    })
            })
        },
        updateApplicationParameter(applicationParameter: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, applicationParameter)
                    .then((res) => {
                        this.fetchApplicationParameters();
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

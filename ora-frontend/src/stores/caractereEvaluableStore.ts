import { defineStore } from 'pinia'
import { useParcoursStore } from './parcoursStore'

export const useCaractereEvaluableStore = defineStore('caractereEvaluable', {
    state: () => ({
        entity: 'caractere_evaluable',
        caractereEvaluableTypes: [] as Array<any>,
        loading: false as boolean,
        error: false as Boolean | Record<string, any>
    }),
    getters: {
        
    },
    actions: {
        fetchCaractereEvaluableTypes() {
            return new Promise((resolve, reject) => {
                this.getCollection('caractere_evaluable_type')
                .then((res) => {
                    this.caractereEvaluableTypes = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateCaractereEvaluable(caractereEvaluable: Record<string, any>) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, caractereEvaluable)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createCaractereEvaluable(caractereEvaluable: Record<string, any>) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, caractereEvaluable)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    }
})

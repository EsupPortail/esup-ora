import { defineStore } from 'pinia'

export const useTypeDiplomeStore = defineStore('typeDiplome', {
    state: () => ({
        entity: 'type_diplome',
        typeDiplomes: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {

    },
    actions: {
        fetchTypeDiplomes() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity)
                .then((res) => {
                    this.typeDiplomes = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createTypeDiplome(typeDiplome: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, typeDiplome)
                .then((res) => {
                    this.typeDiplomes.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateTypeDiplome(typeDiplome: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, typeDiplome)
                .then((res) => {
                    const updated = res.data
                    this.typeDiplomes = this.typeDiplomes.map((e) => {
                        if (e.id === updated.id) {
                            return updated
                        }
                        return e
                    })
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        deleteTypeDiplome(typeDiplome: any) {
            return new Promise((resolve, reject) => {
                this.delete(this.entity, typeDiplome)
                .then((res) => {
                    this.typeDiplomes = this.typeDiplomes.filter((e) => e.id !== typeDiplome.id)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    }
})

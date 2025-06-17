import { defineStore } from 'pinia'

export const useDiplomeStore = defineStore('diplome', {
    state: () => ({
        entity: 'diplome',
        diplomes: [] as any[],
        diplomeElements: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getDiplomes(state): any {
            return state.diplomes
        },
        getDiplomeElements(state): any {
            return state.diplomeElements
        }
    },
    actions: {
        createDiplome(diplome: any) {
            this.create(this.entity, diplome)
            .then((res) => {
                this.diplomes.push(res.data)
            })
            .catch((err) => {
            })
        },
        createDiplomeWithElement(diplome: any) {
            this.create('diplomeWithElement', diplome)
            .then((res) => {
                this.diplomes.push(res.data)
            })
            .catch((err) => {
            })
        },
        updateDiplome(diplome: any) {
            this.update(this.entity, diplome)
            .then((res) => {
                const updated = res.data
                this.diplomes = this.diplomes.map((e) => {
                    if (e.id === updated.id) {
                        return updated
                    }
                    return e
                })
            })
            .catch((err) => {
            })
        },
        deleteDiplome(diplome: any) {
            this.delete(this.entity, diplome)
            .then((res) => {
                this.diplomes = this.diplomes.filter((e) => e.id !== diplome.id)
            })
            .catch((err) => {
            })
        },
        fetchDiplome() {
            this.getCollection(this.entity)
            .then((res) => {
                this.diplomes = res.data
            })
            .catch((err) => {
            })
        }
    }
})

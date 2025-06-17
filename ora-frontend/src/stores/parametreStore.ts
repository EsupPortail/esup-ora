import { defineStore } from 'pinia'

export const useParametreStore = defineStore('parametre', {
    state: () => ({
        entity: 'parametre',
        parametres: [] as any[],
        parametreElements: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getParametres(state): any {
            return state.parametres
        },
        getParametreElements(state): any {
            return state.parametreElements
        },
        getParametreByFormation: (state) => (formationId: number) => {
            
            return state.parametres.filter((e) => e.formation_id === formationId)
        }
    },
    actions: {
        createParametre(parametre: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, parametre)
                .then((res) => {
                    this.parametres.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createParametreWithElement(parametre: any) {
            this.create('parametreWithElement', parametre)
            .then((res) => {
                this.parametres.push(res.data)
            })
            .catch((err) => {
            })
        },
        updateParametre(parametre: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, parametre)
                .then((res) => {
                    const updated = res.data
                    this.parametres = this.parametres.map((e) => {
                        if (e.id === updated.id) {
                            return updated
                        }
                        return e
                    })
                    resolve(updated)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        deleteParametre(parametre: any) {
            this.delete(this.entity, parametre)
            .then((res) => {
                this.parametres = this.parametres.filter((e) => e.id !== parametre.id)
            })
            .catch((err) => {
            })
        },
        fetchParametres() {
            this.getCollection(this.entity, {
                include: {
                    type_diplomes: true,
                    tags: true,
                }
            })
            .then((res) => {
                this.parametres = res.data
            })
            .catch((err) => {
            })
        },
    }
})

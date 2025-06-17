import { defineStore } from 'pinia'

export const useTypeFormationStore = defineStore('typeFormation', {
    state: () => ({
        entity: 'type_formation',
        typeFormations: [] as any[],
        typeFormationElements: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getTypeFormations(state): any {
            return state.typeFormations
        },
        getTypeFormationElements(state): any {
            return state.typeFormationElements
        }
    },
    actions: {
        createTypeFormation(typeFormation: any) {
            this.create(this.entity, typeFormation)
            .then((res) => {
                this.typeFormations.push(res.data)
            })
            .catch((err) => {
            })
        },
        createTypeFormationWithElement(typeFormation: any) {
            this.create('typeFormationWithElement', typeFormation)
            .then((res) => {
                this.typeFormations.push(res.data)
            })
            .catch((err) => {
            })
        },
        updateTypeFormation(typeFormation: any) {
            this.update(this.entity, typeFormation)
            .then((res) => {
                const updated = res.data
                this.typeFormations = this.typeFormations.map((e) => {
                    if (e.id === updated.id) {
                        return updated
                    }
                    return e
                })
            })
            .catch((err) => {
            })
        },
        deleteTypeFormation(typeFormation: any) {
            this.delete(this.entity, typeFormation)
            .then((res) => {
                this.typeFormations = this.typeFormations.filter((e) => e.id !== typeFormation.id)
            })
            .catch((err) => {
            })
        },
        async fetchTypeFormation() {
            await this.getCollection(this.entity)
            .then((res) => {
                this.typeFormations = res.data
            })
            .catch((err) => {
            })
        },
    }
})

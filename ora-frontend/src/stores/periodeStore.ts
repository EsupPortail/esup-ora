import { defineStore } from 'pinia'

import { useParcoursStore } from './parcoursStore'

export const usePeriodeStore = defineStore('periodes', {
    state: () => ({
        entity: 'periodes',
        periodes: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getAllPeriodes(state): any {
            return state.periodes
        },
        getPeriodesByVersion(state): any {
            return state.periodes.filter((p) => p.version_id === useParcoursStore().versionSelected.id)
        }
    },
    actions: {
        fetchPeriodeWithEnseignementFromID( idPeriode: string ){
            return new Promise((resolve, reject) => {
                this.get(this.entity, idPeriode)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchPeriodesWithVersionID( versionID: number ) {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        version_id: versionID
                    }
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchPeriodesByVersionWithEnseignements( versionId?: number ) {

            let version_id = versionId || useParcoursStore().versionSelected.id

            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        version_id: version_id
                    },
                    include: {
                        enseignements: {
                            include: {
                                apprentissages_critiques: true
                            }
                        }
                    }
                })
                .then((res) => {
                    this.periodes = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createPeriode(libelle: string, version_id: number) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: libelle,
                    version_id: version_id
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
    }
})

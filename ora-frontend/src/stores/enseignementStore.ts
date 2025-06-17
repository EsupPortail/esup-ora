import { defineStore } from 'pinia'
import { useSocketStore } from './socketStore'

export const useEnseignementStore = defineStore('enseignement', {
    state: () => ({
        entity: 'enseignement',
        enseignements: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getAllEnseignements(state): any {
            return state.enseignements
        }
    },
    actions: {
        fetchEnseignementsOfVersion( idPeriode: number ) {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        periode_id: idPeriode
                    }, include: {
                        apprentissages_critiques: true
                    }})
                .then((res) => {
                    this.enseignements = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchEnseignements() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {include: {
                    tags: true,
                    apprentissages_critiques: true
                }})
                .then((res) => {
                    this.enseignements = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateEnseignement( enseignement: any ) {
            return new Promise((resolve, reject) => {
                this.update('enseignement', {
                    id: enseignement.id,
                    libelle: enseignement.libelle,
                    est_evaluation_directe: enseignement.est_evaluation_directe,
                    est_evaluation_indirecte: enseignement.est_evaluation_indirecte,
                })
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('enseignement')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createEnseignement(libelle: any, periode_id: any, formationId: any) {
            return new Promise((resolve, reject) => {
                this.create('enseignement', {
                    libelle: libelle,
                    periode: {
                        connect: {
                            id: periode_id
                        }
                    },
                    formation: { 
                        connect: {
                            id: formationId
                        }
                    }
                })
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('enseignement')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        connectEnseignementToApprentissageCritique( enseignement: any, ac: any) {
            return new Promise((resolve, reject) => {
                this.update('enseignement', {
                    id: enseignement.id,
                    apprentissages_critiques: { 
                        connect: { 
                            id: ac.id
                        } 
                    }
                })
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('enseignement')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        getEnseignementWithACConnected( enseignementId: any ) {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        id: enseignementId
                    },
                    include: {
                        apprentissages_critiques: true
                    }})
                .then((res) => {
                    this.enseignements = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        removeEnseignement(enseignementId: any) {
            return new Promise((resolve, reject) => {
                this.delete(this.entity, enseignementId)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('enseignement')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    }
})

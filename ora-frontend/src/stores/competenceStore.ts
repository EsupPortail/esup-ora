import { defineStore } from 'pinia'
import { useParcoursStore } from './parcoursStore'
import { useSocketStore } from './socketStore'

export const useCompetenceStore = defineStore('competence', {
    state: () => ({
        entity: 'competence',
        competences: [] as Array<any>,
        competenceSelected: {} as Record<string, any>,
        loading: false as boolean,
        error: false as Boolean | Record<string, any>
    }),
    getters: {
        getAllCompetence(state): any {
            return state.competences
        },
        getOneCompetence: (state) => (id: number) => {
            return state.competences.find((e) => e.id === +id)
        },
        getCompetenceByVersion: (state) => (versionId: number) => {
            const parcoursStore = useParcoursStore()
            const versionIdSelected = versionId || parcoursStore.versionSelected.id
            return state.competences.filter((e) => e.version_id === +versionIdSelected)
        }
    },
    actions: {
        fetchOneCompetence(competenceId: string) {
            return new Promise((resolve, reject) => {
                this.get(this.entity, competenceId, {
                    include: {
                        contexte_evaluation: true
                    }
                }
            )
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchCompetences() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    include: {
                        critere_exigences: true,
                        caractere_evaluables: true
                    }
                })
                .then((res) => {
                    this.competences = res.data
                    this.competences = res.data.sort((a: { libelle: string }, b: { libelle: string }) => a.libelle.localeCompare(b.libelle))

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchCompetenceForSelectedVersion() {
            const parcoursStore = useParcoursStore()
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        version_id: parcoursStore.versionSelected.id
                    },
                    include: {
                        critere_exigences: true,
                        niveau: {
                            include: {
                                apprentissage_critique: {
                                    orderBy: {
                                        ordre: 'asc'
                                    }
                                }
                            },
                        },
                        contexte_evaluation: {
                            orderBy: {
                                ordre: 'asc'
                            }
                        },
                        caractere_evaluables: true
                    }
                })
                .then((res) => {
                    this.competences = res.data.sort((a: { libelle: string }, b: { libelle: string }) => a.libelle.localeCompare(b.libelle))
                    if (this.competenceSelected.id) {
                        this.competenceSelected = this.competences.find((e) => e.id === this.competenceSelected.id)
                    } else {
                        this.competenceSelected = this.competences[0]
                    }
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateCompetence(competence: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: competence.id,
                    libelle: competence.libelle,
                    competence_contextualisee: competence.competence_contextualisee,
                })
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createCompetence(competence: any, nbNiveau: number) {
            const niveaux = Array.from({ length: nbNiveau }, (_, i) => ({
                libelle: `Niveau ${i + 1}`,
                description: ''
            }));
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: competence.libelle,
                    version: {
                        connect: {
                            id: +competence.version_id
                        }
                    },
                    niveau: {
                        createMany: {
                            data: niveaux
                        }
                    }
                })
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        deleteCompetence(competence: any) {
            return new Promise((resolve, reject) => {
                this.delete(this.entity, competence)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        addCritereExigence(critereExigence: any) {
            return new Promise((resolve, reject) => {
                this.create('critere_exigence', critereExigence)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')
                    this.fetchCompetenceForSelectedVersion();
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        deleteCritereExigence(critereExigence: any) {
            return new Promise((resolve, reject) => {
                this.delete('critere_exigence', critereExigence)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateCritereExigence(critereExigence: any) {
            return new Promise((resolve, reject) => {
                this.update('critere_exigence', critereExigence)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        addContexteEvaluation(competenceId: number, contexteEvaluation: any) {
            return new Promise((resolve, reject) => {
                this.create('contexte_evaluation', {
                    competence: {
                        connect: {
                            id: competenceId
                        }
                    },
                    libelle: contexteEvaluation.libelle,
                    ordre: contexteEvaluation.ordre
                })
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateContexteEvaluation(contexteEvaluation: any) {
            return new Promise((resolve, reject) => {
                this.update('contexte_evaluation', contexteEvaluation)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        deleteContexteEvaluation(contexteEvaluation: any) {
            return new Promise((resolve, reject) => {
                this.delete('contexte_evaluation', contexteEvaluation)
                .then((res) => {
                    const socketStore = useSocketStore()
                    socketStore.notifyChange('competence')

                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    },
    persist: {
        pick: ['competenceSelected']
    }
})

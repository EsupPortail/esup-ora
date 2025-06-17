import { defineStore } from 'pinia'
import { useParcoursStore } from './parcoursStore'

export const useBccStore = defineStore('bloc_de_competence', {
    state: () => ({
        entity: 'bloc_de_competence',
        bccs: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getBccsByVersion(state) {
            const parcoursStore = useParcoursStore()
            return state.bccs.filter((e) => e.version_id === +parcoursStore.versionSelected.id)
        },
        getBccById(state) {
            return (id: number) => {
                return state.bccs.find((e) => e.id === id)
            }
        },
        getAllCompetence(state): any {
            return state.bccs
        }
    },
    actions: {
        getBCCByVersionId(versionId: any) {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        version_id: versionId
                    },
                    
                        include: {
                            element_constitutif: {
                                include: {
                                    tags: true,
                                    enseignement: true
                                }
                            },
                            groupe_ec: {
                                include: {
                                    element_constitutif: {
                                        include: {
                                            enseignement: true
                                        }
                                    }
                                }
                            },
                            competences: {
                                include: {
                                    contexte_evaluation: true
                                }
                            },
                            apprentissage_critiques: true,
                            parcours: true,
                        }
                })
                .then((res) => {
                    this.bccs = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchAllMutualisedBCCs() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        est_mutualisable: true
                    },
                    include: {
                        element_constitutif: {
                            include: {
                                tags: true,
                                enseignement: true
                            }
                        },
                        groupe_ec: {
                            include: {
                                element_constitutif: {
                                    include: {
                                        enseignement: true
                                    }
                                }
                            }
                        },
                        competences: {
                            include: {
                                contexte_evaluation: true
                            }
                        },
                        apprentissage_critiques: true,
                        parcours: true,
                        importation_mutualisation: true
                    }
                })
                .then((res) => {
                    res.data = res.data.filter((bcc: any) => bcc.est_mutualisable === true)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })           
        },
        fetchBCCById(bccId: any) {
            return new Promise((resolve, reject) => {
                this.get(this.entity, bccId, {
                    include: {
                        element_constitutif: {
                            include: {
                                tags: true,
                                enseignement: true
                            }
                        },
                        groupe_ec: {
                            include: {
                                element_constitutif: {
                                    include: {
                                        enseignement: true
                                    }
                                }
                            }
                        },
                        competences: {
                            include: {
                                contexte_evaluation: true
                            }
                        },
                        apprentissage_critiques: true,
                        parcours: true,
                        importation_mutualisation: true
                    }
                })
                .then((res) => {
                    // update bccs list with the new data
                    const index = this.bccs.findIndex((e) => e.id === +bccId)
                    this.bccs[index] = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchBccs() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    include: {
                        element_constitutif: {
                            include: {
                                tags: true
                            }
                        },
                        apprentissage_critiques: true,
                        parcours: true,
                        competences: {
                            include: {
                                contexte_evaluation: true
                            }
                        }
                    },
                })
                .then((res) => {
                    this.bccs = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchBccsByVersion() {
            const parcoursStore = useParcoursStore()
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    where: {
                        version_id: parcoursStore.versionSelected.id,
                    },
                    include: {
                        element_constitutif: {
                            include: {
                                tags: true,
                                enseignement: true,
                                contextes_evaluations: true
                            } 
                        },
                        groupe_ec: {
                            include: {
                                element_constitutif: true
                            }
                        },
                        apprentissage_critiques: true,
                        parcours: true,
                        competences: true
                    },
                    orderBy: {
                        id: 'asc'
                    }
                })
                .then((res) => {
                    this.bccs = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createBCC(bcc: any) {
            const parcoursStore = useParcoursStore()
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: bcc.libelle,
                    version: {
                        connect: {
                            id: +parcoursStore.versionSelected.id
                        }
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
        updateBcc(bcc: any) {
            const dataToSend = {
                id: bcc.id,
                libelle: bcc.libelle,
                description: bcc.description,
                est_mutualisable: bcc.est_mutualisable,
                credits: +bcc.credits,
            }
            return new Promise((resolve, reject) => {
                this.update(this.entity, dataToSend)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        linkMutualiseToBCC(ecId: string, bccId: string) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bccId,
                    importation_mutualisation: {
                        connect: {
                            id: ecId
                        }
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
        unlinkMutualiseECAtSource(ecId: string, bccId: string) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bccId,
                    element_constitutif: {
                        disconnect: {
                            id: ecId
                        }
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
        unlinkMutualiseToBCC(ecId: string, bccId: string) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bccId,
                    importation_mutualisation: {
                        disconnect: {
                            id: ecId
                        }
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
        linkMutualiseBCCToVersion(bccId: string) {
            const parcoursStore = useParcoursStore()

            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bccId,
                    importation_mutualisation_bcc: {
                        connect: {
                            id: +parcoursStore.versionSelected.id
                        }
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
        unlinkMutualiseBCCAtSource(bccId: string) {
            const parcoursStore = useParcoursStore()
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bccId,
                    version: {
                        disconnect: {
                            id: +parcoursStore.versionSelected.id
                        }
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
        unlinkMutualiseBCCToVersion(bccId: string) {
            const parcoursStore = useParcoursStore()
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bccId,
                    importation_mutualisation_bcc: {
                        disconnect: {
                            id: +parcoursStore.versionSelected.id
                        }
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
        updateBccCompetence(bcc: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bcc.id,
                    competences: {
                        connect: bcc.competences.map((id: any) => {
                            return {
                                id: id
                            }
                        }),
                        disconnect: bcc.competencesToRemove.map((id: any) => {
                            return {
                                id: id
                            }
                        })
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
        updateBccApprentissages(bcc: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bcc.id,
                    apprentissage_critiques: {
                        connect: bcc.apprentissages.map((id: any) => {
                                return {
                                    id: id
                                }
                        }),
                        disconnect: bcc.apprentissagesToRemove.map((id: any) => {
                            return {
                                id: id
                            }
                        })
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
        updateBccParcours(bcc: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: bcc.id,
                    parcours: {
                        connect: bcc.parcours.map((id: any) => {
                            return {
                                id: id
                            }
                        }),
                        disconnect: bcc.parcoursToRemove.map((id: any) => {
                            return {
                                id: id
                            }
                        })
                    },
                    est_tronc_commun: bcc.est_tronc_commun
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        removeBCC(bcc: any) {
            return new Promise((resolve, reject) => {
                this.delete(this.entity, bcc)
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

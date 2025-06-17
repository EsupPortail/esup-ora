import { defineStore } from 'pinia'

export const useEcStore = defineStore('element_constitutif', {
    state: () => ({
        entity: 'element_constitutif',
        ecs: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getAllCompetence(state): any {
            return state.ecs
        }
    },
    actions: {
        fetchAllMutualisedECs() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                })
                .then((res) => {
                    res.data = res.data.filter((ec: any) => ec.est_mutualisable === true)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchECOfThisBCC(bccID: number) {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {
                    bloc_de_competence_id: bccID,
                    include: {
                        enseignements: true,
                        stages: true
                    }
                })
                .then((res) => {
                    this.ecs = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchECs() {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, {})
                .then((res) => {
                    this.ecs = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        fetchGroupOfECs( bccID: number) {
            return new Promise((resolve, reject) => {
                this.getCollection('groupe_ec', {
                    bloc_de_competence_id: bccID,
                    include: {
                        element_constitutif: true
                    }
                })
                .then((res) => {
                    this.ecs = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        insertECInGroup( ecId: number, groupId: number) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: ecId,
                    groupe_ec: {
                        connect: {
                            id: groupId
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
        changeRenderOrderOfEC( ec: any ) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: ec.id,
                    render_order: ec.render_order
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createSAEPortfolioInGroup( ec: any ) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: '',
                    type: ec.type,
                    groupe_ec: {
                        connect: {
                            id: ec.groupe
                        }
                    }
                })
                .then((res) => {
                    this.ecs.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createECInGroup(ec: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: ec.enseignementLib,
                    type: ec.type,
                    enseignement: {
                        connect: {
                            id: ec.enseignement
                        }
                    },
                    groupe_ec: {
                        connect: {
                            id: ec.groupe
                        }
                    }
                })
                .then((res) => {
                    this.ecs.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        removeGroupeEC( gec: any ) {
            return new Promise((resolve, reject) => {
                this.delete('groupe_ec', gec)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createGroupOfEC(bccId: number) {
            return new Promise((resolve, reject) => {
                this.create('groupe_ec', {
                    libelle: '',
                    bloc_de_competence: {
                        connect: {
                            id: bccId
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
        updateGroupeOfEc( groupe: any ) {
            return new Promise((resolve, reject) => {
                this.update('groupe_ec', {
                    id: groupe.id,
                    libelle: groupe.libelle
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateECContexteSae(ec: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: ec.id,
                    contextes_evaluations: {
                        connect: ec.contexte_evaluation.map((id: any) => {
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
        updateECTag(ec: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: ec.id,
                    tags: {
                        connect: ec.tags.map((id: any) => {
                                return {
                                    id: id
                                }
                        }),
                        disconnect: ec.tagsToDisconnect.map((id: any) => {
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
        updateEC(ec: any) {
            return new Promise((resolve, reject) => {
                this.update(this.entity, {
                    id: +ec.id,
                    libelle: ec.libelle,
                    volume_horaire_tp: +ec.volume_horaire_tp,
                    volume_horaire_td: +ec.volume_horaire_td,
                    volume_horaire_cm: +ec.volume_horaire_cm,
                    volume_horaire_pt: +ec.volume_horaire_pt,
                    est_mutualisable: ec.est_mutualisable,
                    credits_ects: +ec.credits_ects,
                    volume_horaire_etudiant: +ec.volume_horaire_etudiant,
                    travail_personnel: +ec.travail_personnel,
                    nb_etudiant_min: +ec.nb_etudiant_min,
                    nb_etudiant_max: +ec.nb_etudiant_max,
                    presentiel: ec.presentiel,
                    obligatoire: ec.obligatoire,
                    est_ouvert_etudiants_internationaux: ec.est_ouvert_etudiants_internationaux,
                    description: ec.description,
                    commentaire: ec.commentaire
                })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createEC(ec: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: ec.enseignementLib,
                    type: ec.type,
                    bloc_de_competence: {
                        connect: {
                            id: ec.bccId
                        }
                    },
                    enseignement: {
                        connect: {
                            id: ec.enseignement
                        }
                    }
                })
                .then((res) => {
                    this.ecs.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createSAEPortfolio(ec: any) {
            return new Promise((resolve, reject) => {
                this.create(this.entity, {
                    libelle: '',
                    type: ec.type,
                    bloc_de_competence: {
                        connect: {
                            id: ec.bccId
                        }
                    },
                })
                .then((res) => {
                    this.ecs.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        removeEC(ec: any) {
            return new Promise((resolve, reject) => {
                this.delete(this.entity, ec)
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

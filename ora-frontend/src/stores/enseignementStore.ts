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
    fetchEnseignementFullToCompetenceById(enseignementId: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, enseignementId, {
          include: {
            apprentissages_critiques: {
              include: {
                niveau: true
              }
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
    fetchEnseignementById(id: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, id, {
          include: {
            tags: true,
            apprentissages_critiques: true
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
    fetchEnseignementsOfVersion(idPeriode: number) {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            periode_id: idPeriode
          },
          include: {
            apprentissages_critiques: true
          }
        })
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
        this.getCollection(this.entity, {
          include: {
            tags: true,
            apprentissages_critiques: {
              include: {
                niveau: true,

              }
            }
          }
        })
          .then((res) => {
            this.enseignements = [...res.data]
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    changeRenderOrder(enseignementId: number, newOrder: number) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: +enseignementId,
          render_order: newOrder
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
    updateEnseignement(enseignement: any) {
      return new Promise((resolve, reject) => {
        enseignement.tags = null
        this.update(this.entity, {
          id: +enseignement.id,
          libelle: enseignement.libelle,
          volume_horaire_cm: +enseignement.volume_horaire_cm,
          volume_horaire_td: +enseignement.volume_horaire_td,
          volume_horaire_tp: +enseignement.volume_horaire_tp
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
            console.log('creat ens')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    connectEnseignementToApprentissageCritique(enseignement: any, ac: any) {
      return new Promise((resolve, reject) => {
        this.update('enseignement', {
          id: enseignement,
          apprentissages_critiques: {
            connect: {
              id: ac
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
    disconnectEnseignementToApprentissageCritique(enseignement: any, ac: any) {
      return new Promise((resolve, reject) => {
        this.update('enseignement', {
          id: enseignement,
          apprentissages_critiques: {
            disconnect: {
              id: ac
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
    getEnseignementWithACConnected(enseignementId: any) {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            id: enseignementId
          },
          include: {
            apprentissages_critiques: true
          }
        })
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

import { defineStore } from 'pinia'
import { useParcoursStore } from './parcoursStore'
import { useSocketStore } from './socketStore'

export const useApprentissageStore = defineStore('apprentissage', {
  state: () => ({
    entity: 'apprentissage',
    apprentissages: [] as any[],
    loading: false as boolean,
    error: false as Boolean | Object
  }),
  getters: {},
  actions: {
    getApprentissagesCritiquesWithEnseignements() {},
    fetchNiveauById(niveauId: string) {
      return new Promise((resolve, reject) => {
        this.get('niveau', niveauId, {
          include: {
            apprentissage_critique: true,
            parcours: true
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
    updateNiveau(niveau: any) {
      return new Promise((resolve, reject) => {
        console.log(niveau.parcoursToConnect)
        this.update('niveau', {
          id: niveau.id,
          libelle: niveau.libelle,
          description: niveau.description,
          parcours: {
            connect: niveau.parcoursToConnect.map((element: any) => { return { id: element.id } }),
            disconnect: niveau.parcoursToDisconnect.map((element: any) => { return { id: element.id } })
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('apprentissage_critique')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createApprentissage(apprentissageLibelle: string, ordre: number, niveauId: number) {
      return new Promise((resolve, reject) => {
        this.create('apprentissage_critique', {
          libelle: apprentissageLibelle,
          ordre: +ordre,
          niveau: {
            connect: {
              id: niveauId
            }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('apprentissage_critique')
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateApprentissage(apprentissage: any) {
      return new Promise((resolve, reject) => {
        this.update('apprentissage_critique', {
          id: apprentissage.id,
          libelle: apprentissage.libelle,
          ordre: apprentissage.ordre
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('apprentissage_critique')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteApprentissage(apprentissage: any) {
      return new Promise((resolve, reject) => {
        this.delete('apprentissage_critique', {
          id: apprentissage.id
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('apprentissage_critique')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchElementsApprentissageByNiveau(niveau: any) {
      return new Promise((resolve, reject) => {
        this.getCollection('apprentissage_critique', {
          orderBy: [
            {
              ordre: 'asc'
            }
          ],
          where: {
            niveau_id: niveau.id
          },
          include: {
            enseignements: true
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
    fetchElementsApprentissageByVersion() {
      return new Promise((resolve, reject) => {
        const parcoursStore = useParcoursStore()
        this.getCollection('apprentissage_critique', {
          where: {
            niveau: {
              competence: {
                version_id: parcoursStore.versionSelected.id
              }
            }
          },
          include: {
            niveau: true,
            enseignements: true
          }
        })
          .then((res) => {
            this.apprentissages = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})

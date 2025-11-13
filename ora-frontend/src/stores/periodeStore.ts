import { defineStore } from 'pinia'

import { useParcoursStore } from './parcoursStore'
import { includes } from 'vuetify/lib/util/helpers.mjs'
import { useSocketStore } from './socketStore'

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
    fetchPeriodes() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            version_id: useParcoursStore().versionSelected.id
          },
          include: {
            element_constitutif: true,
            unites_enseignement: {
                include: {
                    elements_constitutifs: true,
                    ecs_imported: true
                }
            },
            enseignements: {
              include: {
                apprentissages_critiques: true
              }
            },
            linked_element_constitutif: true,
            ec_imported_by_mutualisation: true
          }
        })
          .then((res) => {
            this.periodes = res.data.map((p: any) => ({
              ...p,
              unites_enseignement: [...p.unites_enseignement]
            }))
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async updatePeriode(periode: object) {
      return new Promise(async (resolve, reject) => {
        this.update(this.entity, periode)
          .then(async (res) => {
            console.log('Periode updated')
            await this.fetchPeriodes()
            console.log(this.periodes)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchPeriodeWithEnseignementFromID(idPeriode: string) {
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
    fetchPeriodesWithVersionID(versionID: number) {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            version_id: versionID
          },
          include: {
            enseignements: true,
            unites_enseignement: true
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
    fetchPeriodesByVersionWithEnseignements(versionId?: number) {
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
            },
            unites_enseignement: true
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
    changeRenderOrderOfUE( ueId: number, newRender_order: number ) {
      
      return new Promise((resolve, reject) => {
        this.update('unites_enseignement', {
          id: ueId,
          render_order: newRender_order
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('periodes')
            
            this.fetchPeriodes();
            resolve(res.data)          
          })
          .catch((err) => {
            reject(err)
          })
      } )
    },
    updateUE(ueLibelle: string, iduE: number) {
      return new Promise((resolve, reject) => {
        this.update('unites_enseignement', {
          id: iduE,
          libelle: ueLibelle
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('periodes')

            this.fetchPeriodes();
            resolve(res.data)          
          })
          .catch((err) => {
            reject(err)
          })
      } )
    },
    addUEToPeriode(periodeId: number) {
      const me = this.periodes.find(p => p.id === periodeId)
      let render_order = 0;
      if( me.unites_enseignement.length !== 0 ) {
        render_order = Math.max(...me.unites_enseignement.map((ue: any) => ue.render_order)) + 1
      }
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: periodeId,
          unites_enseignement: {
            create: { 
              libelle: 'UE',
              render_order: render_order
             }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('periodes')

            this.fetchPeriodes();
            resolve(res.data)          
          })
          .catch((err) => {
            reject(err)
          })
      } )
    }
  }
})

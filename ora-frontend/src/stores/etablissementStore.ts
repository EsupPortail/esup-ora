import { defineStore } from 'pinia'

export const useEtablissementStore = defineStore('etablissement', {
  state: () => ({
    entity: 'etablissement',
    etablissements: [] as any[],
    etablissementSelected: {} as Record<any, any>,
    loading: false as boolean,
    error: false as Boolean | Object
  }),
  getters: {
    getEtablissements(state): any {
      return state.etablissements
    },
    getEtablissementSelected(state): any {
      return state.etablissementSelected
    }
  },
  actions: {
    fetchEtablissementById(idEtab: any) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, idEtab, {
          include: { parametre: true }
        })
          .then((res) => {
            this.etablissementSelected = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createEtablissement(etablissement: any) {
      return new Promise((resolve, reject) => {
        etablissement.parametre_id = etablissement.parametre
        delete etablissement.parametre
        this.create(this.entity, etablissement)
          .then((res) => {
            this.etablissements.push(res.data)
            const thisComposante = this.etablissements.find(
              (etab) => etab.libelle === res.data.libelle
            )
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateEtablissement(etablissement: any) {
      return new Promise( async (resolve, reject) => {

        this.update(this.entity, etablissement)
          .then((res) => {
            this.fetchEtablissements()
            resolve(res.data)
          })
          .catch(reject)
      })
    },

    deleteEtablissement(etablissement: any) {
      this.delete(this.entity, etablissement)
        .then((res) => {
          this.etablissements = this.etablissements.filter((e) => e.id !== etablissement.id)
        })
        .catch((err) => {})
    },
    fetchEtablissements() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
        })
          .then((res) => {
            this.etablissements = [...res.data]
            if (Object.keys(this.etablissementSelected).length === 0) {
              this.etablissementSelected = this.etablissements[0]
            }
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})

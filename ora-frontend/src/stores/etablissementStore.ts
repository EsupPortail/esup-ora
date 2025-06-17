import { defineStore } from 'pinia'

export const useEtablissementStore = defineStore('etablissement', {
  state: () => ({
    entity: 'etablissement',
    etablissements: [] as Record<string, any>[],
    etablissementSelected: {} as Record<string, any>,
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
    if (typeof etablissement.parametre.connect.id !== 'number' ) {
        const id_to_take = etablissement.parametre.connect.id.id;
        delete etablissement.parametre.connect.id;
        etablissement.parametre.connect.id = id_to_take;
    }
      this.update(this.entity, etablissement)
        .then((res) => {
          const updated = res.data
          this.etablissements = this.etablissements.map((e) => {
            if (e.id === updated.id) {
              return updated
            }
            return e
          })
        })
        .catch((err) => {
        })
    },
    deleteEtablissement(etablissement: any) {
      this.delete(this.entity, etablissement)
        .then((res) => {
          this.etablissements = this.etablissements.filter((e) => e.id !== etablissement.id)
        })
        .catch((err) => {
        })
    },
    fetchEtablissements() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          include: {
            parametre: true
          }
        })
          .then((res) => {
            this.etablissements = res.data
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

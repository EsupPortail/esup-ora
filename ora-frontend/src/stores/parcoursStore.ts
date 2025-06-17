import { defineStore } from 'pinia'

export const useParcoursStore = defineStore('parcours', {
  state: () => ({
    entity: 'parcours',
    parcours: [] as Array<any>,
    versions: [] as Array<any>,
    parcoursSelected: {} as Record<string, any>,
    versionSelected: {} as Record<string, any>,
    loading: false as boolean,
    error: false as boolean | Record<string, any>
  }),
  getters: {
    getAllParcours(state): any {
      return state.parcours
    },
    getOneParcours: (state) => (id: number) => {
      return state.parcours.find((e) => e.id === +id)
    },
    getVersionById: (state) => (id: number) => {
      return state.versions.find((e) => e.id === +id)
    }
  },
  actions: {
    fetchVersionWithAllData(versionId: string) {
      return new Promise((resolve, reject) => {
        this.get('version', versionId, {
          include: {
            periodes: true,
            bloc_de_competences: true,
            competences: true,
            element_constitutifs: true
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
    fetchVersionWithPeriodes(versionId: string) {
      return new Promise((resolve, reject) => {
        this.get('version', versionId, {
          include: {
            periodes: true
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
    fetchOneParcoursFromId(parcoursId: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, parcoursId)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchParcours() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {})
          .then((res) => {
            this.parcours = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchParcoursByFormationId(formationId: number) {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            formation_id: formationId
          }
        })
          .then((res) => {
            this.parcours = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchVersionById(versionId: string) {
      return new Promise((resolve, reject) => {
        this.get('version', versionId)
          .then((res) => {
            this.versionSelected = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    addVersion(parcoursId: any, versionLibelle: any) {
      return new Promise((resolve, reject) => {
        this.create('version', {
          parcours: {
            connect: {
              id: parcoursId
            }
          },
          libelle: versionLibelle
        })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateVersion(version: any) {
      return new Promise((resolve, reject) => {
        this.update('version', {
          id: version.id,
          libelle: version.libelle,
          rncp: version.rncp,
          rome4: version.rome4
        })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateParcours(parcours: any) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: parcours.id,
          libelle: parcours.libelle,
          effectif_theorique: parcours.effectif_theorique
        })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteParcours(parcours: any) {
      this.delete(this.entity, parcours)
        .then((res) => {
        })
        .catch((err) => {
        })
    }
  },
  persist: {
    pick: ['versionSelected', 'parcoursSelected']
  }
})

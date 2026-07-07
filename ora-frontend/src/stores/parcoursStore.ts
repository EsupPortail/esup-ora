import { defineStore } from 'pinia'
import { effect } from 'vue'

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
    updateAllPeriodesOfParcours(parcours: any, duree: number, periodesLocales: any[]) {
      return new Promise(async (resolve, reject) => {
        // 1. Récupération des données existantes
        const res = await this.getCollection('periode_of_parcours_informations', {
          where: { parcours_id: Number(parcours.id) }
        });
        const existingPeriodes = res.data || [];

        // 2. Boucle séquentielle
        for (let unite = 1; unite <= duree; unite++) {
          const dataSaisie = periodesLocales.find(p => p.periode_index === unite);

          if (dataSaisie) {
            const existingInfo = existingPeriodes.find((p: any) => Number(p.periode_index) === unite);

      const dataPayload = {
        effectif_theorique_regime_fa: Number(dataSaisie.effectif_theorique_regime_fa) || 0,
        effectif_theorique_regime_fc: Number(dataSaisie.effectif_theorique_regime_fc) || 0,
        effectif_theorique_regime_fi: Number(dataSaisie.effectif_theorique_regime_fi) || 0,
      }

            try {
              if (existingInfo) {
                // UPDATE : On attend simplement la fin de l'opération
                await this.update('periode_of_parcours_informations', {
                  id: existingInfo.id,
                  ...dataPayload
                });
                console.log(`Période ${unite} mise à jour`);
              } else {
                // CREATE : On attend simplement la fin de l'opération
                await this.create('periode_of_parcours_informations', {
                  parcours_id: Number(parcours.id),
                  periode_index: unite,
                  ...dataPayload
                });
                console.log(`Période ${unite} créée`);
              }
            } catch (err) {
              console.error(`Erreur période ${unite}:`, err);
              // Optionnel : throw err; // si vous voulez stopper tout le processus en cas d'erreur
            }
          }
        }

        // 3. On retourne vrai une fois que TOUTE la boucle est terminée

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
    fetchOneParcoursFromIdWithConfiguration(parcoursId: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, parcoursId, {
          include: {
            periode_of_parcours_informations: true
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
    fetchVersions() {
      return new Promise((resolve, reject) => {
        this.getCollection('version', {
          include: {
            formation: true
          }
        })
          .then((res) => {
            this.versions = [...res.data]
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

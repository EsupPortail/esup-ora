import { defineStore } from 'pinia'

import { useParcoursStore } from './parcoursStore'

export const useFormationStore = defineStore('formation', {
  state: () => ({
    entity: 'formation',
    formations: [] as Array<any>,
    formationSelected: {} as Record<string, any>,
    formationElements: [] as Array<any>,
    loading: false as boolean,
    error: false as boolean | Record<string, any>
  }),
  getters: {
    getFormations(state): any {
      return state.formations
    },
    getFormationElements(state): any {
      return state.formationElements
    }
  },
  actions: {
    fetchOneFormationFromId(formationID: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, formationID, {
          include: {
            parcours: true,
            version: true,
            composante: {
              include: {
                parametre: true
              }
            }
          }
        })
          .then((res) => {
            this.formations = this.formations.map((e) => {
              if (e.id === formationID) {
                return res.data
              }
              return e
            })
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    getFormationFromParcoursId(parcoursId: number) {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            parcours_id: parcoursId
          }
        })
          .then((res) => {
            this.formations = res.data
          })
          .catch((err) => {
          })
      })
    },
    createFormation(formation: any) {
      return new Promise((resolve, reject) => {
        this.create(this.entity, formation)
          .then((res) => {
            this.formations.push(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createFormationWithElement(formation: any) {
      this.create('formationWithElement', formation)
        .then((res) => {
          this.formations.push(res.data)
        })
        .catch((err) => {
        })
    },
    updateFormation(formation: any) {
      return new Promise( async (resolve, reject) => {
        
        let currentFormation = {} as any; 
        await this.fetchOneFormationFromId(formation.id).then( d => {
          currentFormation = d;
        })
        if (currentFormation.composante?.id !== formation.composante?.id) {
          let idTmp = formation.composante?.id;
          delete formation.composante;
          formation.composante = {
            disconnect: {
              id: currentFormation.composante?.id
            },
            connect: {
              id: idTmp
            }
          };
        }

        if (currentFormation.type_diplome?.id !== formation.type_diplome?.id) {
          let idTmp = formation.type_diplome?.id;
          delete formation.type_diplome;
          formation.type_diplome = {
            disconnect: {
              id: currentFormation.type_diplome?.id
            },
            connect: {
              id: idTmp
            }
          };
        }
        console.log(formation)
        delete formation.composante_id;
        delete formation.type_diplome_id;
        delete formation.diplome_id;
        delete formation.version;
        delete formation.composante;
        
        this.update(this.entity, formation)
          .then(async (res) => {
            const updated = res.data
            this.fetchOneFormationFromId(updated.id)
            resolve(updated);
          })
          .catch((err) => {
            reject(err)
          })
        })
    },
    deleteFormation(formation: any) {
      this.delete(this.entity, formation)
        .then((res) => {
          this.formations = this.formations.filter((e) => e.id !== formation.id)
        })
        .catch((err) => {
        })
    },
    fetchFormation() {
      this.getCollection(this.entity, {
        include: {
          parcours: true,
          version: true,
          composante: {
            include: {
              parametre: true
            }
          }
        }
      })
        .then((res) => {
          this.formations = res.data
        })
        .catch((err) => {
        })
    },
    fetchMutualisedBCCForVersion(versionId: string) {
      return new Promise((resolve, reject) => {
        this.get('version', versionId, {
            include: {
              importation_mutualisation_bcc: true,
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
    fetchVersionById(versionId: string) {
      return new Promise((resolve, reject) => {
        this.get('version', versionId)
          .then((res) => {
            useParcoursStore().versionSelected = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    addVersion(formationId: any, versionLibelle: any) {
      return new Promise((resolve, reject) => {
        this.create('version', {
          formation: {
            connect: {
              id: formationId
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
    }
  },
  persist: {
    pick: ['formationSelected']
  }
})

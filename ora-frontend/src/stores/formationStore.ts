import { defineStore } from 'pinia'

import { useParcoursStore } from '@/stores/parcoursStore'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useApprentissageStore } from "@/stores/apprentissageStore";

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
            parcours: {
              include: {
                periode_of_parcours_informations: true
              }
            },
            version: true,
            type_diplome: true,
            composante: {
              include: {
                parametre: {
                  include: {
                    tags: true
                  }
                }
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
    async duplicateVersion(version: any) {

      const parcoursStore = useParcoursStore()
      const competencesStore = useCompetenceStore()
      const apprentissageStore = useApprentissageStore()

      try {
        let resultVersion: any;
        //Create version
        await this.create('version', {
          libelle: 'A Copie de la version "' + version.libelle + '" ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('fr-FR'),
          formation: {
            connect: {
              id: version.formation_id
            }
          },
        }).then((res) => {
          resultVersion = res.data
        }).catch((err) => {
          console.error('Erreur duplicateVersion', err)
          throw err
        })
        if (resultVersion === undefined) {
          throw new Error('Erreur lors de la création de la nouvelle version')
        }

        parcoursStore.versionSelected = version
        const newVersion = resultVersion;
        await competencesStore.fetchCompetenceForSelectedVersion()

        // Duplication competences of previous version in new version
        for (const competence of competencesStore.competences) {
          await competencesStore.createCompetence({
            libelle: competence.libelle,
            competence_contextualisee: competence.competence_contextualisee,
            color: competence.color_hexadecimal,
            critere_exigences: {
              createMany: {
                data: competence.critere_exigences.map((ce: any) => ({
                  libelle: ce.libelle
                }))
              }
            },
            famille_de_situations: {
              createMany: {
                data: competence.famille_de_situations.map((fs: any) => ({
                  libelle: fs.libelle
                }))
              }
            },
            version: {
              connect: {
                id: newVersion.id
              }
            },
          }, this.formationSelected.noms_des_niveaux)
        }
        competencesStore.fetchCompetenceForSelectedVersion()
        console.log(competencesStore.competences)

        // Duplication ACs of previous version in new version

        parcoursStore.versionSelected = newVersion

        return true
      } catch (err) {
        console.error('Erreur duplicateVersion', err)
        throw err
      }
    },
    updateUserAttachment(formation: any) {
      return new Promise(async (resolve, reject) => {
        try {
          const payload = {
            id: formation.id,
            utilisateurs_rattaches: formation.utilisateurs_rattaches
          }

          this.update(this.entity, payload)
            .then((res) => {
              this.fetchFormation()
              resolve(res.data)
            })
            .catch(reject)
        } catch (err) {
          reject(err)
        }
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
      return new Promise(async (resolve, reject) => {
        this.create(this.entity, formation)
          .then((res) => {
            this.formations.push(res.data)
            resolve(res.data.id)
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
      return new Promise(async (resolve, reject) => {

        let currentFormation = {} as any;
        await this.fetchOneFormationFromId(formation.id).then(d => {
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
        if (currentFormation.type_diplome?.id !== formation.type_diplome_to_connect && formation.type_diplome_to_connect !== undefined) {
          let idTmp = formation.type_diplome_to_connect;
          delete formation.type_diplome;
          delete formation.type_diplome_to_connect;
          formation.type_diplome = {
            disconnect: {
              id: currentFormation.type_diplome?.id
            },
            connect: {
              id: idTmp
            }
          };
        } else {
          delete formation.type_diplome_to_connect;
          delete formation.type_diplome;
        }
        delete formation.composante_id;
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
    changeStateFormation(idFormation: any, state: string) {
      return new Promise(async (resolve, reject) => {
        this.update(this.entity, {
          id: idFormation,
          state: state
        })
          .then((res) => {
            this.fetchOneFormationFromId(idFormation)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchFormation() {
      return new Promise(async (resolve, reject) => {

        this.getCollection(this.entity, {
          include: {
            parcours: {
              include: {
                periode_of_parcours_informations: true
              }
            },
            version: true,
            type_diplome: true,
            composante: {
              include: {
                parametre: {
                  include: {
                    tags: true
                  }
                }
              }
            }
          }
        })
          .then((res) => {
            this.formations = [...res.data]
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
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

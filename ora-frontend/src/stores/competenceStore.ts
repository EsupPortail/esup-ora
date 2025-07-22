import { defineStore } from 'pinia'
import { useParcoursStore } from './parcoursStore'
import { useSocketStore } from './socketStore'
import { useFormationStore } from './formationStore'

export const useCompetenceStore = defineStore('competence', {
  state: () => ({
    entity: 'competence',
    competences: [] as Array<any>,
    competenceSelected: {} as Record<string, any>,
    loading: false as boolean,
    error: false as Boolean | Record<string, any>
  }),
  getters: {
    getAllCompetence(state): any {
      return state.competences
    },
    getOneCompetence: (state) => (id: number) => {
      return state.competences.find((e) => e.id === +id)
    },
    getCompetenceByVersion: (state) => (versionId: number) => {
      const parcoursStore = useParcoursStore()
      const versionIdSelected = versionId || parcoursStore.versionSelected.id
      return state.competences.filter((e) => e.version_id === +versionIdSelected)
    }
  },
  actions: {
    fetchOneCompetence(competenceId: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, competenceId, {
          include: {
            contexte_evaluation: true,
            famille_de_situations: true,
            niveau: {
                include: {
                    apprentissage_critique: {
                        orderBy: {
                            ordre: 'asc'
                        }
                    }
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
    fetchCompetences() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          include: {
            critere_exigences: true,
            caractere_evaluables: true,
            famille_de_situations: true
          }
        })
          .then((res) => {
            this.competences = res.data
            this.competences = res.data.sort((a: { libelle: string }, b: { libelle: string }) =>
              a.libelle.localeCompare(b.libelle)
            )

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchCompetenceForSelectedVersion() {
      const parcoursStore = useParcoursStore()
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          where: {
            version_id: parcoursStore.versionSelected.id
          },
          include: {
            critere_exigences: true,
            famille_de_situations: true,
            niveau: {
              include: {
                apprentissage_critique: {
                  orderBy: {
                    ordre: 'asc'
                  }
                }
              }
            },
            contexte_evaluation: {
              orderBy: {
                ordre: 'asc'
              }
            },
            caractere_evaluables: true
          }
        })
          .then((res) => {
            this.competences = res.data.sort((a: { libelle: string }, b: { libelle: string }) =>
              a.libelle.localeCompare(b.libelle)
            )
            if (this.competenceSelected.id) {
              this.competenceSelected = this.competences.find(
                (e) => e.id === this.competenceSelected.id
              )
            } else {
              this.competenceSelected = this.competences[0]
            }
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateCompetence(competence: any) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: competence.id,
          libelle: competence.libelle,
          color_hexadecimal: competence.color_hexadecimal,
          competence_contextualisee: competence.competence_contextualisee
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createCompetence(competence: any, noms_des_niveaux: number | string[]) {
      return new Promise(async (resolve, reject) => {
        const formationStore = useFormationStore()
        const socketStore = useSocketStore()
        const formation = formationStore.formationSelected

        // Construire les niveaux avec parcours connectés
        const niveaux = Array.isArray(noms_des_niveaux)
          ? noms_des_niveaux.map((libelle: string, index: number) => ({
              libelle,
              description: '',
              print_order: index,
              parcours: {
                connect: formation.parcours.map((p: any) => ({ id: p.id }))
              }
            }))
          : Array.from({ length: noms_des_niveaux }, (_, i) => ({
              libelle: `Niveau ${i + 1}`,
              description: '',
              print_order: i,
              parcours: {
                connect: formation.parcours.map((p: any) => ({ id: p.id }))
              }
            }))

        // Appel au backend Prisma via this.create avec `niveau.create` (et non createMany)
        this.create(this.entity, {
          libelle: competence.libelle,
          color_hexadecimal: competence.color_hexadecimal,
          version: {
            connect: {
              id: +competence.version_id
            }
          },
          niveau: {
            create: niveaux // ✅ create et non createMany
          }
        })
          .then((res) => {
            socketStore.notifyChange('competence')
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteCompetence(competence: any) {
      return new Promise((resolve, reject) => {
        this.delete(this.entity, competence)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    addCritereExigence(critereExigence: any) {
      return new Promise((resolve, reject) => {
        this.create('critere_exigence', critereExigence)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')
            this.fetchCompetenceForSelectedVersion()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteCritereExigence(critereExigence: any) {
      return new Promise((resolve, reject) => {
        this.delete('critere_exigence', critereExigence)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    addFamilleDeSituation(familleDeSituation: any) {
      return new Promise((resolve, reject) => {
        this.create('famille_de_situation', familleDeSituation)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')
            this.fetchCompetenceForSelectedVersion()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteFamilleDeSituation(familleDeSituation: any) {
      return new Promise((resolve, reject) => {
        this.delete('famille_de_situation', familleDeSituation)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateFamilleDeSituation(familleDeSituation: any) {
      return new Promise((resolve, reject) => {
        this.update('famille_de_situation', familleDeSituation)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateCritereExigence(critereExigence: any) {
      return new Promise((resolve, reject) => {
        this.update('critere_exigence', critereExigence)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    addContexteEvaluation(competenceId: number, contexteEvaluation: any) {
      return new Promise((resolve, reject) => {
        this.create('contexte_evaluation', {
          competence: {
            connect: {
              id: competenceId
            }
          },
          libelle: contexteEvaluation.libelle,
          ordre: contexteEvaluation.ordre
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateContexteEvaluation(contexteEvaluation: any) {
      return new Promise((resolve, reject) => {
        this.update('contexte_evaluation', contexteEvaluation)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteContexteEvaluation(contexteEvaluation: any) {
      return new Promise((resolve, reject) => {
        this.delete('contexte_evaluation', contexteEvaluation)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('competence')

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  persist: {
    pick: ['competenceSelected']
  }
})

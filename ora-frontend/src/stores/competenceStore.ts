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
            rncp_bccs: true,
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
            famille_de_situations: true,
            rncp_bccs: true,
            niveau: {
              include: {
                apprentissage_critique: true
              }
            },
            linked_periodes_maquette: true
          }
        })
          .then((res) => {
            this.competences = [...res.data].sort(
              (a: { libelle: string }, b: { libelle: string }) =>
                (a.libelle || '').localeCompare(b.libelle || '')
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
            rncp_bccs: true,
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
            }
          }
        })
          .then((res) => {
            this.competences = [...res.data].sort(
              (a: { libelle: string }, b: { libelle: string }) =>
                (a.libelle || '').localeCompare(b.libelle || '')
            )
            if (this.competences.length > 0) {
              if (this.competenceSelected?.id) {
                this.competenceSelected = this.competences.find(
                  (e) => e.id === this.competenceSelected.id
                )
              } else {
                this.competenceSelected = this.competences[0]
              }
            }
            console.log(this.competences);
            console.log(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    linkCompetenceToPeriode(competenceId: number, periodeId: number) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: competenceId,
          periodes: {
            connect: { id: periodeId }
          }
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
    duplicateCompetence(competence: any, noms_des_niveaux: number | string[]) {
      return new Promise((resolve, reject) => {
        // Copie superficielle : on ne mute pas l'objet original affiché dans l'UI
        const copie = {
          ...competence,
          id: undefined,
          libelle: competence.libelle ? `${competence.libelle} (copie)` : '(copie)',
          competence_contextualisee: competence.competence_contextualisee
            ? `${competence.competence_contextualisee} (copie)`
            : ''
        }

        this.createCompetence(copie, noms_des_niveaux)
          .then(async (res: any) => {
            await Promise.all([
              ...competence.famille_de_situations.map((fds: any) =>
                this.addFamilleDeSituation({
                  competence_id: res.id,
                  libelle: fds.libelle,
                  ordre: fds.ordre
                })
              ),
              ...competence.critere_exigences.map((ce: any) =>
                this.addCritereExigence({
                  competence_id: res.id,
                  libelle: ce.libelle,
                  ordre: ce.ordre
                })
              )
            ])
            resolve(res)
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

        const versionId = competence.version_id ?? competence.version?.connect?.id
        if (!versionId) {
          reject(new Error('createCompetence: version_id manquant'))
          return
        }

        // Normalise critere_exigences et famille_de_situations
        // Accepte soit un tableau simple [{libelle}, ...], soit déjà {createMany:{data:[...]}}
        const normalizeCreateMany = (input: any) => {
          if (!input) return undefined
          const data = Array.isArray(input) ? input : input?.createMany?.data
          if (!data || data.length === 0) return undefined
          return { createMany: { data } }
        }

        const payload: any = {
          libelle: competence.libelle,
          competence_contextualisee: competence.competence_contextualisee ?? '',
          color_hexadecimal: competence.color_hexadecimal ?? competence.color,
          version: {
            connect: {
              id: +versionId
            }
          },
          niveau: {
            create: niveaux
          }
        }

        const critereExigences = normalizeCreateMany(competence.critere_exigences)
        if (critereExigences) payload.critere_exigences = critereExigences

        const familleDeSituations = normalizeCreateMany(competence.famille_de_situations)
        if (familleDeSituations) payload.famille_de_situations = familleDeSituations

        this.create(this.entity, payload)
          .then((res) => {
            socketStore.notifyChange('competence')
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteRncpOfCompetence(competence: any) {
      return new Promise((resolve, reject) => {
        if (competence.rncp_bccs.length === 0 || !competence.rncp_bccs) {
          resolve(null)
          return
        }
        competence.rncp_bccs.forEach((bcc: any) => {
          this.delete('rncp_bcc', bcc)
        })
        const socketStore = useSocketStore()
        socketStore.notifyChange('competence')
      })
    },
    deleteCompetence(competence: any) {
      return new Promise((resolve, reject) => {
        competence.niveau.forEach((niveau: any) => {
          this.delete('niveau', niveau)
        })

        competence.rncp_bccs.forEach((bcc: any) => {
          this.delete('rncp_bcc', bcc)
        })

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
    async linkBccRncpToCompetence(competence: any, bccData: any) {
      const socketStore = useSocketStore();

      // 1. On cherche si la BCC est déjà liée (comparaison par code)
      const existingBcc = competence.rncp_bccs?.find((b: any) => b.code === bccData.code);

      try {
        // 2. Construction du payload atomique
        // On utilise un tableau [] pour les opérations de relation pour éviter l'écrasement global
        const payload = {
          id: competence.id,
          rncp_bccs: existingBcc
            ? { delete: [{ id: existingBcc.id }] } // Suppression ciblée
            : {
              create: [{
                libelle: bccData.libelle,
                code: bccData.code,
                numero_fiche: bccData.numero_fiche
              }]
            }
        };

        const res = await this.update(this.entity, payload);

        socketStore.notifyChange('competence');

        return res.data;

      } catch (err) {
        console.error("Erreur Toggle BCC:", err);
        throw err;
      }
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
    }
  },
  persist: {
    pick: ['competenceSelected']
  }
})

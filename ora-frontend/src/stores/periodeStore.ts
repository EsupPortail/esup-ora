import { defineStore } from 'pinia'

import { useParcoursStore } from './parcoursStore'
import { includes } from 'vuetify/lib/util/helpers.mjs'
import { useSocketStore } from './socketStore'

export const usePeriodeStore = defineStore('periodes', {
  state: () => ({
    entity: 'periodes',
    ue: [] as any[],
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
    },
    getAllUEs(state): any {
      return state.periodes.flatMap((periode: any) => periode.unites_enseignement ?? [])
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
                ecs_imported: true,
                ens_options: true,
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
    changeRenderOrderOfUE(ueId: number, newRender_order: number) {

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
      })
    },
    updateUE(ue: object) {
      const stripUE = (data: any) => {
        const {
          elements_constitutifs, ecs_imported, parcours, tags,
          periode, periode_id, connected_to, ams_connected,
          ams_dependant, ens_options,
          ...clean
        } = data;
        return {
          ...clean,
          volume_horaire_tp: clean.volume_horaire_tp != null ? +clean.volume_horaire_tp : null,
          volume_horaire_td: clean.volume_horaire_td != null ? +clean.volume_horaire_td : null,
          volume_horaire_cm: clean.volume_horaire_cm != null ? +clean.volume_horaire_cm : null,
          volume_horaire_cm_td: clean.volume_horaire_cm_td != null ? +clean.volume_horaire_cm_td : null,
          credits_ects: clean.credits_ects != null ? +clean.credits_ects : null,
          nb_etudiant_max: clean.nb_etudiant_max != null ? +clean.nb_etudiant_max : null,
        };
      };

      return new Promise((resolve, reject) => {
        this.update('unites_enseignement', stripUE(ue))
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('periodes')
            this.fetchPeriodes()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    async makeOptionUEs(cluster: any[], ue: any) {
      try {
        // Strip tout sauf ce qu'on veut passer explicitement
        const stripUE = (data: any) => {
          const {
            elements_constitutifs, ecs_imported, parcours, tags,
            periode, periode_id, connected_to, ams_connected,
            ams_dependant, ens_options, // ← on strip ens_options aussi
            ...clean
          } = data;
          return clean;
        };

        // 1️⃣ Récupérer la UE actuelle avec ses options
        await this.fetchPeriodes();
        const oldCurrentUE = this.getAllUEs.find((u: any) => u.id === ue.id);
        const oldOptions = (oldCurrentUE as { ens_options?: { id: number }[] } | undefined)
          ?.ens_options?.map(opt => opt.id) ?? [];

        const newOptions = cluster.map((item: any) => (typeof item === 'object' ? item.id : item)) || [];

        // 2️⃣ Récupérer les connexions existantes de chaque membre du nouveau cluster
        const allRelatedIds = new Set<number>([...newOptions, ue.id]);

        for (const id of newOptions) {
          const memberUE = this.getAllUEs.find((u: any) => u.id === id);
          const memberOptions = (memberUE as { ens_options?: { id: number }[] } | undefined)
            ?.ens_options?.map(opt => opt.id) ?? [];
          memberOptions.forEach(relId => allRelatedIds.add(relId));
        }

        // 3️⃣ Détecter les UE qui quittent le cluster
        const removedIds = oldOptions.filter(id => !newOptions.includes(id));

        // 4️⃣ Déconnexion totale — on passe ens_options Prisma directement, sans stripUE
        const allIdsToDisconnect = [...new Set([...oldOptions, ...allRelatedIds, ue.id])];
        for (const id of allIdsToDisconnect) {
          await this.update('unites_enseignement', {
            id,
            ens_options: { set: [] },
            est_optionnel: false
          });
        }

        // 5️⃣ Si cluster vide → tout le monde est sorti
        if (newOptions.length === 0) {
          const socketStore = useSocketStore();
          socketStore.notifyChange('periodes');
          await this.fetchPeriodes();
          return true;
        }

        // 6️⃣ Construire le cluster final sans les UE retirées
        const clusterOnlyId = [...allRelatedIds].filter(id => !removedIds.includes(id));

        // 7️⃣ Si cluster réduit à 1 seul → plus optionnel
        if (clusterOnlyId.length <= 1) {
          const socketStore = useSocketStore();
          socketStore.notifyChange('periodes');
          await this.fetchPeriodes();
          return true;
        }

        // 8️⃣ Reconnecter — idem, pas de stripUE ici
        for (const idUE of clusterOnlyId) {
          const clusterWithoutMe = clusterOnlyId.filter((id) => id !== idUE);

          await this.update('unites_enseignement', {
            id: idUE,
            est_optionnel: true,
            ens_options: { set: [] }
          });

          await this.update('unites_enseignement', {
            id: idUE,
            ens_options: { connect: clusterWithoutMe.map((id) => ({ id })) }
          });
        }

        // 9️⃣ Notifier et rafraîchir
        const socketStore = useSocketStore();
        socketStore.notifyChange('periodes');
        await this.fetchPeriodes();
        return true;

      } catch (err) {
        console.error('Erreur cluster UE update', err);
        throw err;
      }
    },
    addUEToPeriode(periodeId: number) {
      const me = this.periodes.find(p => p.id === periodeId)
      let render_order = 0;
      if (me.unites_enseignement.length !== 0) {
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
      })
    }
  }
})

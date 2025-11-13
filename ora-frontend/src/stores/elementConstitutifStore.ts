import { defineStore } from 'pinia'
import { useFormationStore } from './formationStore'
import { useParcoursStore } from './parcoursStore'
import { useSocketStore } from './socketStore'
import { usePeriodeStore } from './periodeStore'
import { useEnseignementStore } from './enseignementStore'
import { render } from 'vue'

export const useEcStore = defineStore('element_constitutif', {
  state: () => ({
    entity: 'element_constitutif',
    ecs: [] as any[],
    loading: false as boolean,
    error: false as Boolean | Object
  }),
  getters: {
    getAllCompetence(state): any {
      return state.ecs
    }
  },
  actions: {
    fetchOneEcById(id: string) {
      return new Promise((resolve, reject) => {
        this.get(this.entity, id, {
          include: {
            ens_options: true,
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
    fetchAllMutualisedECs() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {})
          .then((res) => {
            res.data = res.data.filter((ec: any) => ec.est_mutualisable === true)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchECOfThisBCC(bccID: number) {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          bloc_de_competence_id: bccID,
          include: {
            enseignements: true,
            stages: true
          }
        })
          .then((res) => {
            this.ecs = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchECs() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          include: {
            parcours: true,
            tags: true,
            ens_options: true,
            version: true,
            linked_periodes_maquette: true
          }
        })
          .then((res) => {
            this.ecs = [...res.data]
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    fetchGroupOfECs(bccID: number) {
      return new Promise((resolve, reject) => {
        this.getCollection('groupe_ec', {
          bloc_de_competence_id: bccID,
          include: {
            element_constitutif: true
          }
        })
          .then((res) => {
            this.ecs = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    importedOutOfUE(ueId: number, periodeId: number, importedId: number) {
      return new Promise((resolve, reject) => {
        this.update('element_constitutif_mutualised_imported', {
          id: importedId,
          unites_enseignement: {
            disconnect: { id: ueId }
          },
          periode:
          {
            connect: { id: periodeId }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            this.fetchECs()

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    ecOutOfUeToPeriod(ecId: number, ueId: number, periodeId?: number) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: ecId,
          unites_enseignement: {
            disconnect: { id: ueId }
          },
          linked_periodes_maquette:
          {
            connect: { id: periodeId }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            this.fetchECs()

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    insertECInGroup(ecId: number, groupId: number) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: ecId,
          groupe_ec: {
            connect: {
              id: groupId
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
    changeRenderOrderOfEC(ec: any) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: ec.id,
          render_order: ec.render_order
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            this.fetchECs()

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    changeImportedElementOfUE(importedId: any, ueId: any) {
      return new Promise(async (resolve, reject) => {
        try {
          const periodesStore = usePeriodeStore()
          if (periodesStore.periodes.length === 0) await periodesStore.fetchPeriodes()

          // Trouver la période contenant l'UE cible
          const allPeriodes = periodesStore.periodes
          const targetPeriode = allPeriodes.find((p) =>
            p.unites_enseignement.some((ue: any) => ue.id === ueId)
          )

          if (!targetPeriode) {
            console.error("Impossible de trouver la période associée à l'UE cible.")
            return reject("Période non trouvée pour l'UE cible.")
          }

          // Récupérer l'UE cible
          const targetUE = targetPeriode.unites_enseignement.find((u: any) => u.id === ueId)
          if (!targetUE) {
            console.error("Impossible de trouver l'UE cible dans la période.")
            return reject("UE cible introuvable.")
          }

          // Calcul du nouveau render_order
          let render_order = 0
          if (targetUE.ecs_imported && targetUE.ecs_imported.length > 0) {
            render_order = Math.max(...targetUE.ecs_imported.map((ec: any) => ec.render_order || 0)) + 1
          }

          // ✅ Payload au même format que changeUEOFEC
          const payload = {
            id: Number(importedId), // 🔧 force conversion pour éviter NaN
            unites_enseignement_id: ueId,
            periode_id: targetPeriode.id,
            render_order
          }

          // ✅ Même appel que changeUEOFEC
          this.update("element_constitutif_mutualised_imported", payload)
            .then((res) => {
              const socketStore = useSocketStore()
              socketStore.notifyChange("element_constitutif_mutualised_imported")
              const periodesStore = usePeriodeStore()
              periodesStore.fetchPeriodes()
              this.fetchECs()
              resolve(res.data)
            })
            .catch((err) => {
              console.error("Erreur lors de la mise à jour de l'élément importé :", err)
              reject(err)
            })
        } catch (error) {
          console.error("Erreur inattendue dans changeImportedElementOfUE :", error)
          reject(error)
        }
      })
    }


    ,
    changeUEOFEC(ecId: number, ueId: number, oldUE: number, periodeId: number) {
      return new Promise(async (resolve, reject) => {
        const periodesStore = usePeriodeStore()
        if (periodesStore.periodes.length === 0) await periodesStore.fetchPeriodes()
        const me = periodesStore.periodes.find((p) => p.id === periodeId)
        const myUE = me.unites_enseignement.find((u: any) => u.id === ueId)
        let render_order = 0
        if (myUE.elements_constitutifs.length !== 0) {
          render_order =
            Math.max(...myUE.elements_constitutifs.map((ec: any) => ec.render_order)) + 1
        }

        this.update(this.entity, {
          id: ecId,
          unites_enseignement_id: ueId,
          render_order: render_order,
          linked_periodes_maquette: {
            disconnect: { id: periodeId }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            this.fetchECs()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createSAEPortfolioInGroup(ec: any) {
      return new Promise((resolve, reject) => {
        this.create(this.entity, {
          libelle: '',
          type: ec.type,
          groupe_ec: {
            connect: {
              id: ec.groupe
            }
          }
        })
          .then((res) => {
            this.ecs.push(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createECInGroup(ec: any) {
      return new Promise((resolve, reject) => {
        this.create(this.entity, {
          libelle: ec.enseignementLib,
          type: ec.type,
          enseignement: {
            connect: {
              id: ec.enseignement
            }
          },
          groupe_ec: {
            connect: {
              id: ec.groupe
            }
          }
        })
          .then((res) => {
            this.ecs.push(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    removeGroupeEC(gec: any) {
      return new Promise((resolve, reject) => {
        this.delete('groupe_ec', gec)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createGroupOfEC(bccId: number) {
      return new Promise((resolve, reject) => {
        this.create('groupe_ec', {
          libelle: '',
          bloc_de_competence: {
            connect: {
              id: bccId
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
    updateGroupeOfEc(groupe: any) {
      return new Promise((resolve, reject) => {
        this.update('groupe_ec', {
          id: groupe.id,
          libelle: groupe.libelle
        })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    updateECContexteSae(ec: any) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: ec.id,
          contextes_evaluations: {
            connect: ec.contexte_evaluation.map((id: any) => {
              return {
                id: id
              }
            })
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
    updateECTag(ec: any) {
      return new Promise((resolve, reject) => {
        this.update(this.entity, {
          id: ec.id,
          tags: {
            connect: ec.tags.map((id: any) => {
              return {
                id: id
              }
            }),
            disconnect: ec.tagsToDisconnect.map((id: any) => {
              return {
                id: id
              }
            })
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
    async makeOptionECs(cluster: any[], ec: any) {
      try {
        // 1️⃣ Récupérer l'EC actuel avec ses options
        const oldCurrentEC = await this.fetchOneEcById(ec.id);
        const oldOptions = (oldCurrentEC as { ens_options?: { id: string | number }[] } | undefined)
          ?.ens_options?.map(opt => opt.id) ?? [];

        const newOptions = cluster.map((item: any) => (typeof item === 'object' ? item.id : item)) || [];

        // 2️⃣ Déconnexion totale de toutes les EC du cluster actuel
        const allIdsToDisconnect = [...new Set([...oldOptions, ec.id])]; // tous les EC concernés
        for (const id of allIdsToDisconnect) {
          await this.update(this.entity, {
            id,
            ens_options: { set: [] },
            est_optionnel: false
          });
        }

        // 3️⃣ Si cluster vide après tout
        if (cluster.length === 0) {
          await this.fetchECs();
          return true;
        }

        // 4️⃣ Construire le cluster final (unique + inclure EC actuel)
        const clusterOnlyId = [...new Set([...newOptions, ec.id])];

        // 5️⃣ Connecter chaque EC à tous les autres (graphe complet)
        for (const idEC of clusterOnlyId) {
          const clusterWithoutMe = clusterOnlyId.filter((id) => id !== idEC);

          await this.update(this.entity, {
            id: idEC,
            est_optionnel: true,
            ens_options: {
              set: [], // réinitialiser avant de reconnecter
              connect: clusterWithoutMe.map((id) => ({ id }))
            }
          });
        }

        // 6️⃣ Rafraîchir la liste
        await this.fetchECs();
        return true;

      } catch (err) {
        console.error('Erreur cluster update', err);
        throw err;
      }
    }
    ,

    updateEC(ec: any) {
      return new Promise(async (resolve, reject) => {
        const normalizeToIds = (arr: any[]): number[] => {
          return (arr || [])
            .map((item: any) => {
              if (!item) return null
              if (typeof item === 'number') return item // déjà un id
              if (typeof item === 'object' && item.id) return item.id // objet {id, ...}
              return null
            })
            .filter((id: any) => id != null)
        }

        const currentEC = await this.get(this.entity, ec.id, {
          include: {
            tags: true,
            parcours: true,
            ens_options: true
          }
        }).then((res) => res.data)
        // 🔹 Normalisation des tags
        const newTags = normalizeToIds(ec.tags)
        const oldTags = normalizeToIds(currentEC?.tags)

        const tagsToConnect = newTags.filter((id) => !oldTags.includes(id))
        const tagsToDisconnect = oldTags.filter((id) => !newTags.includes(id))

        const jsonTag =
          tagsToConnect.length > 0 || tagsToDisconnect.length > 0
            ? {
              tags: {
                connect: tagsToConnect.map((id) => ({ id })),
                disconnect: tagsToDisconnect.map((id) => ({ id }))
              }
            }
            : {}

        // 🔹 Normalisation des parcours
        const newParcours = normalizeToIds(ec.parcours)
        const oldParcours = normalizeToIds(currentEC?.parcours)

        const parcoursToConnect = newParcours.filter((id) => !oldParcours.includes(id))
        const parcoursToDisconnect = oldParcours.filter((id) => !newParcours.includes(id))

        const jsonParcours =
          parcoursToConnect.length > 0 || parcoursToDisconnect.length > 0
            ? {
              parcours: {
                connect: parcoursToConnect.map((id) => ({ id })),
                disconnect: parcoursToDisconnect.map((id) => ({ id }))
              }
            }
            : {}
        const updateData: any = {
          id: +ec.id,
          libelle: ec.libelle,
          volume_horaire_tp: +ec.volume_horaire_tp,
          volume_horaire_td: +ec.volume_horaire_td,
          volume_horaire_cm: +ec.volume_horaire_cm,
          volume_horaire_pt: +ec.volume_horaire_pt,
          est_mutualisable: ec.est_mutualisable,
          credits_ects: +ec.credits_ects,
          volume_horaire_etudiant: +ec.volume_horaire_etudiant,
          volume_horaire_cm_td: +ec.volume_horaire_cm_td,
          travail_personnel: +ec.travail_personnel,
          nb_etudiant_min: +ec.nb_etudiant_min,
          nb_etudiant_max: +ec.nb_etudiant_max,
          presentiel: ec.presentiel,
          est_presentiel: ec.est_presentiel,
          est_distanciel: ec.est_distanciel,
          est_hybride: ec.est_hybride,
          est_optionnel: ec.est_optionnel,
          obligatoire: ec.obligatoire,
          est_ouvert_etudiants_internationaux: ec.est_ouvert_etudiants_internationaux,
          description: ec.description,
          est_isole: ec.est_isole,
          est_assoce: ec.est_assoce,
          commentaire: ec.commentaire,
          ...jsonTag,
          ...jsonParcours
        }

        if (ec.ams_connected_id != null) {
          updateData.ams_connected = {
            connect: {
              id: ec.ams_connected_id
            }
          }
        }

        this.update(this.entity, updateData)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')
            this.fetchECs()

            // Notification si mutualisation activée
            if (ec.est_mutualisable) {
              // Prévoir la notification en temps réel

              socketStore.notifyChange('notification')
            }

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    importerEC(ec: any, periodeId?: number) {
      return new Promise((resolve, reject) => {
        const periodesStore = usePeriodeStore()
        periodesStore.fetchPeriodes()
        const periode = periodesStore.periodes.find((p: any) => p.id === periodeId);
        let newRenderOrder = 0;
        if (periode) {
          // On combine les deux listes (element_constitutif et ec_imported_by_mutualisation)
          const allRenderOrders = [
            ...(periode.linked_element_constitutif?.map((ec: any) => ec.render_order) || []),
            ...(periode.ec_imported_by_mutualisation?.map((ec: any) => ec.render_order) || []),
          ];
          console.log(allRenderOrders)
          // Si la liste est vide, on démarre à 1
          const maxRenderOrder = allRenderOrders.length > 0
            ? Math.max(...allRenderOrders)
            : 0;

          newRenderOrder = maxRenderOrder + 1;

        }

        this.create('element_constitutif_mutualised_imported', {
          element_constitutif: {
            connect: { id: ec.id }
          },
          render_order: newRenderOrder,
          periode: {
            connect: { id: periodeId }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            const periodesStore = usePeriodeStore()
            periodesStore.fetchPeriodes()
            this.fetchECs()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createECEnseignementInPeriodeByLink(periodeId: number, enseignementId: number) {
      return new Promise(async (resolve, reject) => {
        const formationStore = useFormationStore()
        const parcoursStore = useParcoursStore()
        const parcoursIds = formationStore.formationSelected.parcours.map((p: any) => ({
          id: p.id
        }))


        const enseignementStore = useEnseignementStore()
        const enseignement = enseignementStore.enseignements.find((e) => e.id === enseignementId)
        const ecExists = this.ecs.find(
          (ec) =>
            ec.enseignement_id === enseignementId);
        if (ecExists) {
          reject(new Error('Un élément constitutif pour cet enseignement existe déjà dans cette période'))
          return
        }

        this.fetchECs();
        const lastRenderOrder = this.ecs.length > 0 ? Math.max(...this.ecs.map((ec) => ec.render_order)) : 0;

        // On vérifie qu'il n'existe pas déjà un EC pour cet enseignement dans cette période
        this.create(this.entity, {
          libelle: enseignement.libelle,
          type: 'enseignement',
          render_order: lastRenderOrder + 1,
          parcours: {
            connect: [...parcoursIds.map((p: any) => ({ id: p.id }))]
          },
          enseignement: {
            connect: {
              id: enseignement.id
            }
          },
          linked_periodes_maquette: {
            connect: {
              id: periodeId
            }
          },
          version: {
            connect: {
              id: parcoursStore.versionSelected.id
            }
          }
        })
          .then(async (res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')
            res.data.render_order = res.data.id;
            let currentEC = null;
            await this.get(this.entity, res.data.id, {
              include: {
                parcours: true,
                tags: true,
                ens_options: true,
              }
            }).then((res) => {
              currentEC = res.data;
              currentEC.render_order = currentEC.id;
              return;
            });

            this.updateEC(currentEC).then(() => {
              this.fetchECs()
              resolve(res.data)
            })
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createECInPeriode(periodeId: number, typeEC: string) {
      return new Promise(async (resolve, reject) => {
        const periodesStore = usePeriodeStore()
        if (periodesStore.periodes.length === 0) await periodesStore.fetchPeriodes()
        const me = periodesStore.periodes.find((p) => p.id === periodeId)
        let render_order = 0
        if (me.linked_element_constitutif.length !== 0) {
          render_order =
            Math.max(...me.linked_element_constitutif.map((ec: any) => ec.render_order)) + 1
        }

        const formationStore = useFormationStore()
        const parcoursStore = useParcoursStore()

        const parcoursIds = formationStore.formationSelected.parcours.map((p: any) => ({
          id: p.id
        }))


        this.create(this.entity, {
          libelle: typeEC,
          type: typeEC,
          parcours: {
            connect: parcoursIds
          },
          linked_periodes_maquette: {
            connect: {
              id: periodeId
            }
          },
          version: {
            connect: {
              id: parcoursStore.versionSelected.id
            }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            this.fetchECs()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createEC(ec: any) {
      return new Promise((resolve, reject) => {
        this.create(this.entity, {
          libelle: ec.enseignementLib,
          type: ec.type,
          bloc_de_competence: {
            connect: {
              id: ec.bccId
            }
          },
          enseignement: {
            connect: {
              id: ec.enseignement
            }
          }
        })
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')

            this.ecs.push(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createSAEPortfolio(ec: any) {
      return new Promise((resolve, reject) => {
        this.create(this.entity, {
          libelle: '',
          type: ec.type,
          bloc_de_competence: {
            connect: {
              id: ec.bccId
            }
          }
        })
          .then((res) => {
            this.ecs.push(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    removeEC(ec: any) {
      return new Promise((resolve, reject) => {
        this.delete(this.entity, ec)
          .then((res) => {
            const socketStore = useSocketStore()
            socketStore.notifyChange('element_constitutif')
            this.fetchECs()
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})

<template>
  <v-row>
    <ArianeParcoursPath />
  </v-row>
  <v-row style="margin-top: 24px; margin-bottom: 12px">
    <v-col cols="6">
      <h1>Données globales de la version de formation</h1>
    </v-col>
    <v-col offset="3" cols="2">
      <v-btn :loading="exportIsLoading" @click="nextStep" style="background-color: #1e88e5; color: white">
        <template v-slot:default>
          <span>Exporter la formation</span>
        </template>
        <template v-slot:loader>
          <v-progress-circular
            v-if="exportIsLoading"
            indeterminate
            color="white"
          />
        </template>
      </v-btn>
    </v-col>

    <v-col cols="1">
      <UsersConnectedInfo />
    </v-col>
  </v-row>
  <v-row style="margin-bottom: 12px">
    <v-col cols="2">
      <v-row style="margin-left: 0px">
        <div style="width: 20px; height: 20px; background-color: #43a047" />
        <span style="margin-left: 10px">Nombre d'heures</span>
      </v-row>
      <v-row style="margin-left: 0px">
        <div style="width: 20px; height: 20px; background-color: #7b1fa2" />
        <span style="margin-left: 10px">Nombre de crédits</span>
      </v-row>
    </v-col>
  </v-row>
  <v-row v-for="(parcours, index) in globalData.parcours" :key="index">
    <v-col>
      <v-expansion-panels v-model="panels[index]" multiple>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h2>Données globales parcours : {{ parcours.libelle }}</h2>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="6">
                <ProgressLinearData
                  label="Cumul des heures d'enseignement"
                  :current="parcours.totalHeures"
                  :max="globalData.maxHeures"
                />
              </v-col>
              <v-col offset="2">
                <ProgressLinearData
                  label="Cumul des crédits ECTS"
                  :current="parcours.totalCredits"
                  :max="parcours.maxCredits"
                  color="purple-darken-2"
                  bg-color="purple-lighten-1"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h2>Volume horaire par période (enseignements)</h2>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row v-for="(periode, pIndex) in parcours.periodes" :key="pIndex">
              <v-col cols="2">
                <h3>{{ periode.libelle }}</h3>
              </v-col>
              <v-col cols="10">
                <ProgressLinearData
                  label="Cumul des heures d'enseignement"
                  :current="periode.periodeHeures"
                  :max="globalData.maxHeures"
                />
              </v-col>
              <!-- <v-col cols="5">
                <ProgressLinearData
                  label="Cumul des crédits ECTS"
                  :current="periode.periodeCredits"
                  :max="globalData.maxCredits"
                  color="purple-darken-2"
                  bg-color="purple-lighten-1"
                />
              </v-col> -->
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <StatsData :globalData="globalData" :versionId="parcoursStore.versionSelected.id" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from 'vue'

import router from '@/router/router'

import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'
import ProgressLinearData from '@/components/ProgressLinearData.vue'
import StatsData from './donnees/StatsData.vue'

import UsersConnectedInfo from '@/components/UsersConnectedInfo.vue'

import { useParcoursStore } from '@/stores/parcoursStore'
import { useFormationStore } from '@/stores/formationStore'
import { useBccStore } from '@/stores/bccStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useCompetenceStore } from '@/stores/competenceStore'

const panels = ref([])

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const formation = ref(null)
const formationId = ref(parcoursStore.versionSelected.formation_id)
const periodesStore = usePeriodeStore()
const competencesStore = useCompetenceStore()

const bccStore = useBccStore()

const parcours = ref([])

const globalData = ref({})

const exportIsLoading = ref(false)

const nextStep = () => {
  exportIsLoading.value = true

  setTimeout(() => {
    exportIsLoading.value = false
  }, 10000)
}

const togglePanels = (index) => {
  panels.value[index] = !panels.value[index]
}

const initData = async () => {
  if (competencesStore.competences.length === 0) {
    return
  }
  globalData.value = {}
  await formationStore.fetchOneFormationFromId(formationId.value).then((d) => {
    formation.value = d
    parcours.value = d.parcours
  })
  let finalData = {}
  finalData.parcours = []

  // On récupère le nom des parcours
  parcours.value.forEach(async (p, index) => {
    finalData.parcours.push({ libelle: p.libelle })
  })

  await bccStore.getBCCByVersionId(parcoursStore.versionSelected.id).then((data) => {
    finalData.bccs = data
  })
  finalData.maxHeures = formation.value.nb_heures_enseignement
  finalData.maxCredits = formation.value.nb_credits

  // Deux cas : tronc commun / spé parcours
  // À voir plus tard -> possibiltié d'etre tronc commun + spé ? (les deux)
  // Étape 1 : Tronc commun
  finalData.parcours.forEach((parcours) => {
    parcours.totalCredits = 0
    parcours.totalHeures = 0
  })

  //Init des périodes
  let periodes = []
  await periodesStore.fetchPeriodesWithVersionID(parcoursStore.versionSelected.id).then((data) => {
    data.forEach((periode) => {
      periodes.push({
        id: periode.id,
        libelle: periode.libelle,
        periodeHeures: 0,
        periodeCredits: 0
      })
    })
  })

  // Init des compétences
  finalData.competences = []
  await competencesStore.fetchCompetenceForSelectedVersion().then((competences) => {
    console.log(competences)
    competences.forEach((comp) => {
      finalData.competences.push({
        id: comp.id,
        libelle: comp.libelle,
        compHeures: 0,
        compCredits: 0,
        connectedApprentissages: [],
        connectedEnseignements: [],
        connectedBccs: [],
        connectedECs: []
      })
    })
  })
  console.log(finalData.competences)
  finalData.parcours.forEach((parcours) => {
    parcours.periodes = []
  })

  finalData.parcours.forEach((parcours) => {
    parcours.periodes = periodes.map((p) => ({ ...p }))
  })

  finalData.bccs.forEach((bcc) => {
    //Crédits
    if (bcc.est_tronc_commun === true) {
      finalData.parcours.forEach((parcours) => {
        parcours.totalCredits += bcc.credits
      })
    } else {
      finalData.parcours.forEach((parcours) => {
        bcc.parcours.forEach((pbcc) => {
          if (parcours.libelle === pbcc.libelle) {
            parcours.totalCredits += bcc.credits
          }
        })
      })
    }
    //Heures
    bcc.element_constitutif.forEach((ec) => {
      if (bcc.est_tronc_commun === true) {
        //Si tronc commun alors on incrémente tous les parcours
        finalData.parcours.forEach((parcours) => {
          parcours.totalHeures +=
            ec.volume_horaire_cm +
            ec.volume_horaire_td +
            ec.volume_horaire_tp +
            ec.volume_horaire_etudiant +
            ec.travail_personnel +
            ec.volume_horaire_pt
        })
      } else {
        finalData.parcours.forEach((parcours) => {
          //On cherche les parcours référencés
          bcc.parcours.forEach((pbcc) => {
            if (parcours.libelle === pbcc.libelle) {
              parcours.totalHeures +=
                ec.volume_horaire_cm +
                ec.volume_horaire_td +
                ec.volume_horaire_tp +
                ec.volume_horaire_etudiant +
                ec.travail_personnel +
                ec.volume_horaire_pt
            }
          })
        })
      }
    })
    // Calcul des groupes ec
    bcc.groupe_ec.forEach((gec) => {
      gec.element_constitutif.forEach((ec) => {
        if (bcc.est_tronc_commun === true) {
          //Si tronc commun alors on incrémente tous les parcours
          finalData.parcours.forEach((parcours) => {
            parcours.totalHeures +=
              ec.volume_horaire_cm +
              ec.volume_horaire_td +
              ec.volume_horaire_tp +
              ec.volume_horaire_etudiant +
              ec.travail_personnel +
              ec.volume_horaire_pt
            parcours.totalCredits += ec.credits_ects
          })
        } else {
          finalData.parcours.forEach((parcours) => {
            //On cherche les parcours référencés
            bcc.parcours.forEach((pbcc) => {
              if (parcours.libelle === pbcc.libelle) {
                parcours.totalHeures +=
                  ec.volume_horaire_cm +
                  ec.volume_horaire_td +
                  ec.volume_horaire_tp +
                  ec.volume_horaire_etudiant +
                  ec.travail_personnel +
                  ec.volume_horaire_pt
                parcours.totalCredits += ec.credits_ects
              }
            })
          })
        }
      })
    })

    if (bcc.est_tronc_commun === true) {
      finalData.parcours.forEach((parc) => {
        parc.periodes.forEach((per) => {
          bcc.element_constitutif.forEach((ec) => {
            if (ec.enseignement?.periode_id === per.id) {
              per.periodeHeures +=
                ec.volume_horaire_cm +
                ec.volume_horaire_td +
                ec.volume_horaire_tp +
                ec.volume_horaire_pt
            }
          })
        })
      })
    } else {
      finalData.parcours.forEach((parc) => {
        bcc.parcours.forEach((pbcc) => {
          if (parc.libelle === pbcc.libelle) {
            parc.periodes.forEach((per) => {
              bcc.element_constitutif.forEach((ec) => {
                if (ec.enseignement?.periode_id === per.id) {
                  per.periodeHeures +=
                    ec.volume_horaire_cm +
                    ec.volume_horaire_td +
                    ec.volume_horaire_tp +
                    ec.volume_horaire_pt
                }
              })
            })
          }
        })
      })
    }

    // Calcul de chaque période appelé par chaque BCC pour la remontée des credits par periode
    // Chaque crédit de BCC doit être comptabilisé une et une seulle fois par période
    let periodesAlreadyCounted = []
    finalData.parcours.forEach((p) => {
      periodesAlreadyCounted.push({
        libParcours: p.libelle,
        periodes: p.periodes.map((per) => {
          return {
            id: per.id,
            periodeCredits: 0,
            alreadyDone: false
          }
        })
      })
    })

    bcc.element_constitutif.forEach((ec) => {
      if (bcc.est_tronc_commun === true) {
        finalData.parcours.forEach((parc) => {
          parc.periodes.forEach((per) => {
            let currentPAD = periodesAlreadyCounted.find((pad) => pad.libParcours === parc.libelle)
            let currentPeriodeAD = currentPAD.periodes.find((pad) => pad.id === per.id)
            if (ec.enseignement?.periode_id === per.id && !currentPeriodeAD.alreadyDone) {
              per.periodeCredits += bcc.credits
              currentPeriodeAD.alreadyDone = true
            }
          })
        })
      } else {
        finalData.parcours.forEach((parc) => {
          bcc.parcours.forEach((pbcc) => {
            if (parc.libelle === pbcc.libelle) {
              parc.periodes.forEach((per) => {
                let currentPAD = periodesAlreadyCounted.find(
                  (pad) => pad.libParcours === parc.libelle
                )
                let currentPeriodeAD = currentPAD.periodes.find((pad) => pad.id === per.id)
                if (ec.enseignement?.periode_id === per.id && !currentPeriodeAD.alreadyDone) {
                  periodesAlreadyCounted.push(per.id)
                  per.periodeCredits += bcc.credits
                  currentPeriodeAD.alreadyDone = true
                }
              })
            }
          })
        })
      }
    })
    // Calcul de chaque compétence lié à un apprentissage pour remonter les heures + credits
    bcc.competences.forEach((c) => {
      finalData.competences.forEach((fC) => {
        if (fC.id === c.id && !fC.connectedBccs.includes(bcc.id)) {
          fC.connectedBccs.push(bcc.id)
          bcc.apprentissage_critiques.forEach((a) => {
            if (!fC.connectedApprentissages.includes(a.id)) {
              fC.connectedApprentissages.push(a.id)
            }
          })
          bcc.element_constitutif.forEach((ec) => {
            if (ec.type === 'Enseignement') {
              if (!fC.connectedEnseignements.includes(ec.enseignement.id)) {
                fC.connectedEnseignements.push(ec.enseignement.id)
              }
              if (!fC.connectedECs.includes(ec.id)) {
                fC.connectedECs.push(ec.id)
              }
            }
          })
        }
      })
    })
  })
  finalData.competences.forEach((c) => {
    c.connectedBccs.forEach((cid) => {
      finalData.bccs.forEach((bccTmp) => {
        if (cid === bccTmp.id) {
          c.compCredits += bccTmp.credits
        }
      })
    })
    c.connectedECs.forEach((ecTmp) => {
      finalData.bccs.forEach((bccTmp) => {
        bccTmp.element_constitutif.forEach((ec) => {
          if (ec.id === ecTmp) {
            c.compHeures +=
              ec.volume_horaire_cm +
              ec.volume_horaire_td +
              ec.volume_horaire_tp +
              ec.volume_horaire_pt
          }
        })
      })
    })
  })

  // Clean competences, je ne sais pas d'où vient les doublons..
  // TO DO

  globalData.value = finalData
}
initData()

watch(
  globalData,
  (newValue, oldValue) => {
    console.log('Global data changed:', newValue)
  },
  { deep: true }
)
</script>

<style scoped>
</style>

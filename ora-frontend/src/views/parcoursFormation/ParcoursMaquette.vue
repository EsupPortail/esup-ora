<template>
  <PageInDev />
  <RecursivTree :items="items" :root="true" />
    <v-row>
        <v-col cols="6">
            <v-row align="center">
                <v-col cols="auto">
                    <v-icon size="36">mdi-chart-box-outline</v-icon>
                </v-col>
                <v-col>
                    <h3 style="display: inline-block; vertical-align: middle; margin-left: 8px;">Maquette</h3>
                </v-col>
                <v-col cols="auto">
                    <v-btn-toggle v-model="selectedView" mandatory>
                        <v-btn value="semestre">Vue en semestre</v-btn>
                        <v-btn value="bcc">Vue en bloc de connaissances et de compétences</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
        </v-col>
        <v-col offset="4" cols="2">
            <v-btn color="secondary" @click="exporter">
                Exporter
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="6">
            <template v-if="periodeStore.getPeriodesByVersion !== 0">
            <v-card v-for="periode in periodeStore.getPeriodesByVersion" :key="periode.id" class="mb-4">
                <v-card-title>
                    {{ periode.libelle }}
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item
                            v-for="(competence, index) in competenceStore.getCompetenceByVersion(parcoursStore.versionSelected.id)"
                            :key="index"
                        >
                            {{ parametre.semantique_competence || 'Compétence' }} {{ index + 1 }} : {{ competence.competence_contextualisee || competence.libelle }}
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>

            </template>
        </v-col>
        <v-col cols="6">
        </v-col>
    </v-row>
  <v-row
    v-if="competenceStore.getCompetenceByVersion(parcoursStore.versionSelected.id).length !== 0"
  >
    <v-col cols="12">
      <v-row>
          <v-col cols="8">
            <h1>{{ parametre.semantique_bcc || 'Bloc de connaissances et de compétences' }}</h1>
          </v-col>
          <v-col offset="2" cols="2" justify="end">
            <v-btn @click="nextStep" color="primary">Etape suivante</v-btn>
          </v-col>

      </v-row>
      <v-row>
        <v-col cols="7" class="ml-10">

          <div v-for="bloc in bccsList" :key="bloc.id">
            <div style="margin-top: 14px; box-shadow: 10px 20px 70px rgba(0, 0, 0, 0.1)">
              <BCC
                :bloc="bloc"
                :myId="bloc.id"
                :parametre="parametre"
                :blocSelectedId="blocSelectedId"
                :competences="
                  competenceStore.getCompetenceByVersion(parcoursStore.versionSelected.id)
                "
                :parcours="parcoursStore.parcours"
                :apprentissages="apprentissageStore.apprentissages"
                :periodes="periodeStore.getPeriodesByVersion"
                :tags="tagStore.tags"
                @deleteItem="removeItem"
                @setStateOverlay="setStateOverlay"
                class="card-3d"
                :recapBccExpanded="recapBccExpanded"
                @recapBccExpanded="recapBccExpandedFunction"
                @updateBcc="updateBcc"
                @addEcToBcc="addEcToBcc"
                :refreshAskedId="refBccRefresh"
                :resetRefresh="resetRefresh"
                :resetBCCListRefresh="resetBCCListRefresh"
                :isImported="bloc.isBCCImported"
              />
            </div>
          </div>
          <v-row align="center">
            <v-col cols="7">
              <v-text-field
                style="margin-top: 26px"
                variant="outlined"
                density="compact"
                :label="'Libellé du nouveau ' + parametre.semantique_bcc || 'bcc'"
                v-model="currentNewBccLabel"
                @keyup.enter="addNewBCC"
              />
            </v-col>
            <v-col>
              <v-btn :loading="loaderCreateBCC" @click="addNewBCC" color="green">
                <template v-slot:loader>
                  <v-progress-circular
                    v-if="loaderCreateBCC"
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                </template>
                <template v-slot:default>
                  <v-icon left>mdi-plus</v-icon>
                </template>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="info" @click="overlayActiveBCC = !overlayActiveBCC">
                Importer un BCC
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="ml-10">
          <SommeBCC
            v-if="blocSelectedId"
            :bloc="bccStore.getBccById(blocSelectedId)"
            @recapBccClose="close"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="12">
      <h3>
        Veuillez d'abord compléter les éléments précédents tels que les compétences, apprentissages
        critiques, etc.
      </h3>
    </v-col>
  </v-row>
  <v-overlay
    v-model="overlayActive"
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-container>
      <ECImport :bccId="overlayOfBCCid" />
    </v-container>
  </v-overlay>
  <v-overlay
    v-model="overlayActiveBCC"
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-container>
      <BCCImport />
    </v-container>
  </v-overlay>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import BCC from '../bcc/BCC.vue'
import router from '@/router/router'

import PageInDev from '@/components/PageInDev.vue'
import RecursivTree from '@/components/tree/RecursivTree.vue'
import SommeBCC from '../bcc/SommeBCC.vue'
import ECImport from './mutualisation/ECImport.vue'
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'
import { useBccStore } from '@/stores/bccStore'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useFormationStore } from '@/stores/formationStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useApprentissageStore } from '@/stores/apprentissageStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useTagStore } from '@/stores/tagStore'
import ScreenOverlayed from './mutualisation/ScreenOverlayed.vue'
import BCCImport from './mutualisation/BCCImport.vue'


const items = ref([
  {
    name: 'Débutant',
    children: [
      { 
        name: 'Implémenter des conceptions simples',
        children: [
          {
            name: 'Lire un cahier des charges',
            children: [
              { name: 'Identifier les exigences fonctionnelles' },
              { name: 'Identifier les contraintes techniques' }
            ]
          },
          {
            name: 'Traduire en pseudo-code',
            children: [
              { name: 'Utiliser des structures de contrôle' },
              { name: 'Décomposer en sous-tâches' }
            ]
          }
        ]
      },
      { 
        name: 'Élaborer des conceptions simples',
        children: [
          {
            name: 'Créer un diagramme de flux',
            children: [
              { name: 'Définir les entrées et sorties' },
              { name: 'Identifier les processus clés' }
            ]
          }
        ]
      },
      {
        name: 'Faire des essais et évaluer leurs résultats en regard de spécifications',
        children: [
          {
            name: 'Écrire des cas de test',
            children: [
              { name: 'Définir les critères d’acceptation' },
              { name: 'Automatiser les tests simples' }
            ]
          }
        ]
      },
      { 
        name: 'Développer des interfaces utilisateurs',
        children: [
          {
            name: 'Créer une maquette',
            children: [
              { name: 'Utiliser un outil de prototypage' },
              { name: 'Recueillir des retours utilisateurs' }
            ]
          }
        ]
      },
    ],
  },
  {
    name: 'Intermédiaire',
    children: [
      { 
        name: 'Implémenter des conceptions simples',
        children: [
          {
            name: 'Optimiser le code',
            children: [
              { name: 'Analyser la complexité' },
              { name: 'Réduire la duplication' }
            ]
          }
        ]
      },
      { 
        name: 'Élaborer des conceptions simples',
        children: [
          {
            name: 'Utiliser des patrons de conception',
            children: [
              { name: 'Appliquer le patron Singleton' },
              { name: 'Appliquer le patron Observateur' }
            ]
          }
        ]
      },
      {
        name: 'Faire des essais et évaluer leurs résultats en regard de spécifications',
        children: [
          {
            name: 'Analyser les résultats de test',
            children: [
              { name: 'Identifier les causes d’échec' },
              { name: 'Proposer des corrections' }
            ]
          }
        ]
      },
      { 
        name: 'Développer des interfaces utilisateurs',
        children: [
          {
            name: 'Intégrer l’accessibilité',
            children: [
              { name: 'Respecter les normes WCAG' },
              { name: 'Tester avec des outils d’accessibilité' }
            ]
          }
        ]
      },
    ],
  },
])

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const ecStore = useEcStore()
const competenceStore = useCompetenceStore()
const apprentissageStore = useApprentissageStore()
const periodeStore = usePeriodeStore()
const tagStore = useTagStore()
const bccStore = useBccStore()

const refreshPlaned = ref(false)

const close = () => {
  blocSelectedId.value = null
}

const overlayActiveBCC = ref(false)

watch(overlayActiveBCC, async (newVal) => {
  if (!newVal) {
    resetBCCListRefresh()
  }
})

const overlayOfBCCid = ref(-1)
const overlayActive = ref(false)
const setStateOverlay = (idBccAsked) => {
  overlayOfBCCid.value = idBccAsked
  overlayActive.value = !overlayActive.value
}
const loaderCreateBCC = ref(false)
const refBccRefresh = ref(-1)

const resetBCCListRefresh = () => {
  updateListBCC()
}

const resetRefresh = () => {
  refBccRefresh.value = -1
}
watch(overlayActive, (newVal) => {
  if (!newVal) {
    refBccRefresh.value = overlayOfBCCid.value
    overlayOfBCCid.value = -1
  }
})

const parametre = ref({})
const bccsList = ref([])
const blocSelectedId = ref(null)

const updatePeriode = async () => {
  await periodeStore.fetchPeriodesByVersionWithEnseignements()
}

const updateTags = async () => {
  await tagStore.fetchAllTags()
}

const refBCCsMutualises = ref([])

const updateListBCC = async () => {
  try {
    await competenceStore.fetchCompetenceForSelectedVersion()
    await apprentissageStore.fetchElementsApprentissageByVersion()
    await parcoursStore.fetchParcoursByFormationId(formationStore.formationSelected.id)

    parametre.value = formationStore.formationSelected.composante.parametre

    const data = []
    await bccStore.getBCCByVersionId(parcoursStore.versionSelected.id).then((d) => {
      data.push(...d)
    })

    bccsList.value = data

    const d = await formationStore.fetchMutualisedBCCForVersion(parcoursStore.versionSelected.id)
    refBCCsMutualises.value = d.importation_mutualisation_bcc

    const promises = d.importation_mutualisation_bcc.map((bccM) =>
      bccStore.fetchBCCById(bccM.id).then((b) => ({ ...b, isBCCImported: true }))
    )
    const results = await Promise.all(promises)
    //Duplicate keys id because imported BCCs have the same id as the original BCCs
    bccsList.value.push(...results)
    const uniqueBccs = new Map()
    bccsList.value.forEach((bcc) => {
      if (!uniqueBccs.has(bcc.id)) {
        uniqueBccs.set(bcc.id, bcc)
      }
    })
    bccsList.value = Array.from(uniqueBccs.values())

    bccsList.value.sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la liste des BCC :', error)
  }
}

const currentNewBccLabel = ref('')
const recapBccExpanded = ref(null)

const updateBcc = async () => {
  updateListBCC()
}

const addEcToBcc = async (data) => {
  updateListBCC()
}

const addNewBCC = async () => {
  if (currentNewBccLabel.value !== '') {
    loaderCreateBCC.value = true
    await bccStore.createBCC({ libelle: currentNewBccLabel.value })
    currentNewBccLabel.value = ''
    updateListBCC()
    setTimeout(() => {
      loaderCreateBCC.value = false
    }, 1500)
  }
}

const removeItem = async (id) => {
  //Delete cascade
  const currentBCC = bccsList.value.find((bcc) => bcc.id === id)
  currentBCC.element_constitutif.forEach(async (ec) => {
    await ecStore.removeEC(ec)
  })
  await bccStore.removeBCC({ id: id })
  updateListBCC()
}

function recapBccExpandedFunction(bloc) {
  blocSelectedId.value = bloc.id
}

const periode = 'Semestre 1'

onMounted(() => {
  updatePeriode()
  updateTags()
  updateListBCC()
})

const nextStep = () => {
  router.push({ name: 'globalData' })
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <h3 style="font-weight: normal; display: flex; align-items: center; gap: 8px;">
        <v-icon left >mdi-book-open-variant-outline</v-icon>
        Les apprentissages
      </h3>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="10" offset="1">
      <v-carousel
        v-if="chunkedCompetences.length > 0"
        hide-delimiter-background
        height="320"
        transition="fade-transition"
        reverse-transition="fade-transition"
        style="background-color: #fcfcfc; border-radius: 16px; padding: 24px"
      >
        <v-carousel-item v-for="(chunk, i) in chunkedCompetences" :key="i" :ripple="false">
          <v-row style="padding-top: 12px">
            <v-col
              v-for="(item, index) in chunk"
              :key="item.id"
              :cols="5"
              :offset="index % 2 === 0 ? 1 : 0"
            >
              <v-card
                color="white"
                elevation="2"
                @click="() => (competenceStore.competenceSelected = item)"
                :style="{
                  height: normalizedValue + 'px',
                  cursor: 'pointer',
                  borderRadius: '15px 15px 0px 0px'
                }"
                class="v-card-carousel-item"
              >
                <v-card-title
                  :style="{
                  backgroundColor: item.color_hexadecimal,
                  color: '#222',
                  paddingTop: '16px',
                  paddingBottom: '16px'
                  }"
                >
                  {{ item.competence_contextualisee || item.libelle }}
                </v-card-title>
                <v-card-text style="height: 200px">
                  <div>
                    <template v-if="item.critere_exigences && item.critere_exigences.length">
                      <v-list style="background: transparent; color: #707070">
                        <v-list-item
                          v-for="ce in item.critere_exigences"
                          :key="ce.id"
                          style="padding-top: 0px; padding-bottom: 0px; min-height: 20px"
                        >
                          {{ ce.libelle }}
                        </v-list-item>
                      </v-list>
                    </template>
                    <template v-else>
                      <div style="padding-top: 8px">
                        <span style="color: #707070">Aucun critère d'exigence renseigné</span>
                      </div>
                    </template>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>
  <v-row style="padding-left: 32px; padding-right: 32px">
    <v-col>
      <v-card style="margin-top: 20px; background-color: transparent; box-shadow: none">
        <v-card-title
          class="text-h6"
          :style="{
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            backgroundColor: competenceStore.competenceSelected?.color_hexadecimal || '#1976d2',
            color: '#fff',
            paddingTop: '20px',
            paddingBottom: '20px'
          }"
        >
          <h3 style="margin: 0; color: #222; font-weight: normal;">
            {{ competenceStore.competenceSelected?.libelle }}
          </h3>
        </v-card-title>
        <v-card-text style="background-color: #fcfcfc">
          <v-row v-for="(arrayOf3Max, idx) in niveauRef" :key="idx" style="padding-top: 14px">
            <v-col v-for="(niveau, nidx) in arrayOf3Max" :key="niveau.id || nidx" cols="4">
              <NiveauApprentissage
                :valueToHave="heightEntete"
                @setHeight="setHeight"
                :niveau="niveau"
                :nLines="nLines"
                @nLinesHandler="handleNLines"
                @fetch-competence="fetchCompetence"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ContexteEvaluation from './apprentissages/ContexteEvaluation.vue'
import { useFormationStore } from '@/stores/formationStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useApprentissageStore } from '@/stores/apprentissageStore'
import { useCompetenceStore } from '@/stores/competenceStore'

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const apprentissageStore = useApprentissageStore()
const competenceStore = useCompetenceStore()

function chunkArray(array, size) {
  const chunked = []
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size))
  }
  console.log('chunked', chunked)
  return chunked
} // Compute chunked competences for the carousel
const chunkedCompetences = computed(() => {
  if (!competenceStore.competences || !competenceStore.competences.length) return []
  return chunkArray(competenceStore.competences, 2)
})
import NiveauApprentissage from '@/views/parcoursFormation/apprentissages/NiveauApprentissage.vue'
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'
import router from '@/router/router'

const parametre = ref({})
const heightEntete = ref(0)

const niveauRef = ref(null)
const normalizedValue = ref(200)

const init = async () => {
  await competenceStore.fetchCompetenceForSelectedVersion()
  parametre.value = formationStore.formationSelected.composante.parametre
  competenceStore.competenceSelected = competenceStore.competences[0]
  getNiveauSliced()
}
init()

const fetchCompetence = async () => {
  await competenceStore.fetchCompetenceForSelectedVersion()
}

const render = ref(0)

const rerender = () => {
  render.value = render.value + 1
}

const getNiveauSliced = async () => {
  let sliced = []
  if (competenceStore.competenceSelected?.niveau) {
    const tmp = competenceStore.competenceSelected?.niveau.sort((a, b) => a.id - b.id)
    for (let i = 0; i < tmp.length; i += 3) {
      sliced.push(tmp.slice(i, i + 3))
    }
  }
  niveauRef.value = sliced
}

const getNLines = computed(() => {
  let highestOrder = 1
  if (!competenceStore.competenceSelected?.niveau) {
    return 0
  }
  competenceStore.competenceSelected?.niveau.forEach((n) => {
    n.apprentissage_critique?.forEach((a) => {
      highestOrder = a.ordre > highestOrder ? a.ordre : highestOrder
    })
  })
  return highestOrder
})

const setHeight = (newVal) => {
  if (newVal > heightEntete.value) {
    heightEntete.value = newVal
  }
  // Force the update to children NiveauApprentissage components
  heightEntete.value = heightEntete.value
}

const nextStep = () => {
  router.push({ name: 'elementsConstitutifsParcours' })
}

const nLines = ref(getNLines.value)

const handleNLines = () => {
  setNLines()
}

const maxCritereExigenceCount = computed(() => {
  if (!competenceStore.competences || !competenceStore.competences.length) return 0
  return Math.max(
    ...competenceStore.competences.map((c) =>
      Array.isArray(c.critere_exigences) ? c.critere_exigences.length : 0
    )
  )
})

const setNLines = async () => {
  await fetchCompetence()
  let highestRank = 1
  const arraysSliced = niveauRef.value
  arraysSliced.forEach((array) => {
    array.forEach((array) => {
      if (array.apprentissage_critique) {
        if (array.apprentissage_critique.length > highestRank) {
          highestRank = array.apprentissage_critique.length
        }
      }
    })
  })
  console.log('highestRank', highestRank)
  nLines.value = highestRank
}

watch(
  () => competenceStore.competences,
  (newCompetences) => {
    console.log('watch competences from apprentissages', newCompetences)
    getNiveauSliced()
  }
)

watch(
  async () => competenceStore.competenceSelected,
  (newCompetence) => {
    niveauRef.value = null
    getNiveauSliced()
    nLines.value = getNLines.value
  }
)
</script>

<style>
.formation-creation h1 {
  color: #333;
}
.v-carousel-item,
.v-window-item--active {
  background-color: transparent !important;
  filter: none !important;
  transition: none !important;
}

/* Supprime le pseudo-élément qui ajoute un overlay sombre */
.v-carousel-item::before,
.v-window-item--active::before {
  background: transparent !important;
  content: none !important;
}

/* Supprime toute trace d'effets de clic */
.v-carousel-item .v-ripple__container,
.v-carousel-item .v-ripple__animation {
  display: none !important;
}

/* Désactive le ripple sur tous les descendants */
.v-carousel-item * {
  --v-theme-overlay-multiplier: 0 !important;
  --v-hover-overlay-opacity: 0 !important;
  --v-pressed-overlay-opacity: 0 !important;
  --v-theme-overlay-opacity: 0 !important;
  box-shadow: none !important;
}

.v-window-item {
  transition-duration: 3000ms !important; /* 1 seconde */
}
</style>
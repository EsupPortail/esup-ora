<template>
  <v-row>
    <v-col cols="10">
      <h3 style="font-weight: normal; display: inline-block; align-items: center; gap: 8px">
        <v-icon left>mdi-book-open-variant-outline</v-icon>
        Les apprentissages
      </h3>
      <div style="display: inline-block; margin-left: 12px">
        <AideBulles pageAsked="apprentissages-critiques" />
      </div>
    </v-col>
    <v-col cols="2">
      <ButtonExport pageAsked="AC" />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="10" offset="1">
      <v-carousel
        v-if="chunkedCompetences.length > 0"
        v-model="carouselIndex"
        class="competence-carousel"
        hide-delimiter-background
        :show-arrows="chunkedCompetences.length > 1"
        :continuous="false"
        height="360"
      >
        <v-carousel-item v-for="(chunk, i) in chunkedCompetences" :key="i">
          <v-row class="carousel-slide" no-gutters>
            <v-col v-for="item in chunk" :key="item.id" cols="6" class="carousel-slide__col">
              <v-card
                elevation="2"
                class="competence-card"
                :class="{
                  'competence-card--selected': competenceStore.competenceSelected?.id === item.id
                }"
                :style="{ '--card-color': item.color_hexadecimal || '#1976d2' }"
                @click="selectCompetence(item)"
              >
                <v-card-title
                  class="competence-card__title"
                  :style="{ backgroundColor: item.color_hexadecimal || '#1976d2' }"
                >
                  {{ item.competence_contextualisee || item.libelle }}
                </v-card-title>
                <v-card-text class="competence-card__body">
                  <v-list
                    v-if="item.critere_exigences?.length"
                    density="compact"
                    style="background: transparent; color: #707070"
                  >
                    <v-list-item
                      v-for="ce in item.critere_exigences"
                      :key="ce.id"
                      style="padding-top: 0px; padding-bottom: 0px; min-height: 20px"
                    >
                      {{ ce.libelle }}
                    </v-list-item>
                  </v-list>
                  <div v-else style="padding-top: 8px">
                    <span style="color: #707070">Aucun critère d'exigence renseigné</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>

  <v-row style="padding-left: 32px; padding-right: 32px" v-if="competenceStore.competenceSelected">
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
          <h3 style="margin: 0; color: white; font-weight: normal">
            {{
              competenceStore.competenceSelected?.competence_contextualisee ||
              competenceStore.competenceSelected?.libelle
            }}
          </h3>
        </v-card-title>
        <v-card-text style="background-color: #fcfcfc">
          <v-row v-for="(arrayOf3Max, idx) in niveauRef" :key="idx" style="padding-top: 14px">
            <v-col v-for="(niveau, nidx) in arrayOf3Max" :key="niveau.id || nidx" cols="4">
              <NiveauApprentissage
                :valueToHave="heightEntete"
                :measureTick="measureTick"
                @requestRemeasure="resetAndRemeasure"
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

  <v-row v-if="competenceStore.competences.length === 0" style="margin-top: 32px">
    <v-col cols="12">
      <h4>
        Veuillez ajouter des compétences à l'étape précédente et en sélectionner une dans le
        carrousel en haut de cette page.
      </h4>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFormationStore } from '@/stores/formationStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import NiveauApprentissage from '@/views/parcoursFormation/apprentissages/NiveauApprentissage.vue'
import ButtonExport from '@/views/parcoursFormation/exportExcelPDF/ButtonExport.vue'
import AideBulles from '@/components/AideBulles.vue'

const formationStore = useFormationStore()
const competenceStore = useCompetenceStore()

/* ---------- Carrousel ---------- */

const carouselIndex = ref(0)

function chunkArray(array, size) {
  const chunked = []
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size))
  }
  return chunked
}

const chunkedCompetences = computed(() => {
  if (!competenceStore.competences?.length) return []
  return chunkArray(competenceStore.competences, 2)
})

// Si la liste change (refetch, suppression…), on évite de rester
// bloqué sur un index de slide qui n'existe plus → slide vide.
watch(chunkedCompetences, (chunks) => {
  if (carouselIndex.value >= chunks.length) {
    carouselIndex.value = Math.max(0, chunks.length - 1)
  }
})

const selectCompetence = (item) => {
  competenceStore.competenceSelected = item
}

/* ---------- Détail de la compétence sélectionnée ---------- */

const parametre = ref({})
const heightEntete = ref(0)
const measureTick = ref(0)
const niveauRef = ref(null)

const init = async () => {
  await competenceStore.fetchCompetenceForSelectedVersion()
  parametre.value = formationStore.formationSelected.composante.parametre
  competenceStore.competenceSelected = competenceStore.competences[0] ?? null
  getNiveauSliced()
}
init()

const fetchCompetence = async () => {
  await competenceStore.fetchCompetenceForSelectedVersion()
}

const getNiveauSliced = () => {
  const sliced = []
  if (competenceStore.competenceSelected?.niveau) {
    const tmp = [...competenceStore.competenceSelected.niveau].sort((a, b) => a.id - b.id)
    for (let i = 0; i < tmp.length; i += 3) {
      sliced.push(tmp.slice(i, i + 3))
    }
  }
  niveauRef.value = sliced
}

const getNLines = computed(() => {
  let highestOrder = 1
  if (!competenceStore.competenceSelected?.niveau) return 0
  competenceStore.competenceSelected.niveau.forEach((n) => {
    n.apprentissage_critique?.forEach((a) => {
      highestOrder = a.ordre > highestOrder ? a.ordre : highestOrder
    })
  })
  return highestOrder
})

const nLines = ref(getNLines.value)

const setHeight = (newVal) => {
  if (newVal > heightEntete.value) {
    heightEntete.value = newVal
  }
}

const resetAndRemeasure = () => {
  heightEntete.value = 0
  measureTick.value++ // signal envoyé aux enfants pour re-mesurer
}

const handleNLines = () => {
  setNLines()
}

const setNLines = async () => {
  await fetchCompetence()
  let highestRank = 1
  niveauRef.value?.forEach((group) => {
    group.forEach((niveau) => {
      if (niveau.apprentissage_critique?.length > highestRank) {
        highestRank = niveau.apprentissage_critique.length
      }
    })
  })
  nLines.value = highestRank
}

watch(
  () => competenceStore.competences,
  () => {
    getNiveauSliced()
  }
)

watch(
  () => competenceStore.competenceSelected,
  () => {
    niveauRef.value = null
    heightEntete.value = 0
    getNiveauSliced()
    nLines.value = getNLines.value
  }
)
</script>

<style>
.formation-creation h1 {
  color: #333;
}

/* ---------- Carrousel ---------- */

.competence-carousel {
  background-color: #fcfcfc;
  border-radius: 16px;
  padding: 24px 0;
}

/* Flèches et pastilles : foncées, sinon elles sont blanches
   sur fond #fcfcfc et donc invisibles */
.competence-carousel .v-window__controls .v-btn,
.competence-carousel .v-carousel__controls .v-btn {
  color: #616161 !important;
}

/* Pastille active dans la couleur primaire pour repérer la slide courante */
.competence-carousel .v-carousel__controls .v-btn--active {
  color: #1976d2 !important;
}

.carousel-slide {
  padding: 12px 64px 0; /* marge latérale pour ne pas passer sous les flèches */
}

.carousel-slide__col {
  padding: 0 12px;
}

/* ---------- Cartes compétence ---------- */

.competence-card {
  height: 260px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 15px 15px 0 0 !important;
  background-color: white;
}

.competence-card--selected {
  outline: 3px solid var(--card-color);
  outline-offset: 2px;
}

.competence-card__title {
  color: white;
  white-space: normal; /* autorise le titre sur plusieurs lignes sans le tronquer */
  line-height: 1.3;
  padding-top: 16px;
  padding-bottom: 16px;
  flex: 0 0 auto;
}

.competence-card__body {
  flex: 1 1 auto;
  overflow-y: auto; /* les critères longs scrollent au lieu d'être coupés */
}

/* Pas d'overlay sombre ni de ripple sur les items du carrousel */
.competence-carousel .v-carousel-item::before {
  background: transparent !important;
  content: none !important;
}
.competence-carousel .v-ripple__container,
.competence-carousel .v-ripple__animation {
  display: none !important;
}
</style>
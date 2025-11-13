<template>
  <v-overlay v-model="overlay" scroll-strategy="block">
    <div
      style="
        width: 60vw;
        margin-left: 20vw;
        margin-right: 20vw;
        display: flex;
        margin-top: 10px;
        align-items: center;
        justify-content: center;
        min-height: 820px;
        height: 820px;
        max-height: 820px;
      "
    >
      <v-card
        class="pa-4"
        style="
          width: 100%;
          display: flex;
          height: 100%;
          flex-direction: column;
          padding-top: 0px !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        "
        rounded="xl"
      >
        <!-- Header -->
        <v-card-title
          class="d-flex justify-space-between align-center"
          style="
            padding-left: 40px;
            padding-right: 20px;
            background-color: #14275c;
            color: #fff;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 10;
          "
        >
          Importer un élément mutualisé dans la période
          {{ periodeStore.periodes.find((p) => p.id === props.periodeId)?.libelle }}
          <v-btn
            icon
            color="red"
            class="ml-auto"
            style="background-color: red; color: white; border-radius: 50%"
            @click="$emit('update:overlayShow', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <div
          style="
            padding: 40px;
            max-height: 180px;
            padding-top: 20px;
            padding-bottom: 0px !important;
            flex: 1;
          "
        >
          <v-text-field
            v-model="search"
            label="Rechercher par nom d'élément constitutif"
            prepend-inner-icon="mdi-magnify"
            clearable
          ></v-text-field>
          <v-row>
            <v-col cols="5">
              <v-select
                v-model="selectedComposante"
                :items="existingComposantes"
                item-title="libelle"
                item-value="id"
                label="Sélectionner une composante"
                clearable
                return-object
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="selectedFormation"
                :items="existingFormations"
                item-title="libelle"
                item-value="id"
                label="Sélectionner une formation"
                clearable
                return-object
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-btn @click="resetFilters"> Réinitialiser les filtres </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-divider />
        <v-card-text
          style="
            padding: 40px;
            padding-top: 20px;
            padding-bottom: 20px;
            flex: 1;
            max-height: 700px;
            overflow-y: auto;
          "
        >
          <div v-for="ec in filteredEcs" :key="ec.id" class="mb-4">
            <v-card rounded="lg" elevation="2">
              <v-card-title
                class="d-flex justify-space-between align-center"
                style="cursor: pointer"
                @click="toggleExpanded(ec.id)"
              >
                <div>
                  <v-icon v-if="ec.type === 'enseignement'" icon="mdi-book-open-variant-outline" />
                  <v-icon v-else-if="ec.type === 'AMS'" icon="mdi-account-group-outline" />
                  <v-icon v-else-if="ec.type === 'Portfolio'" icon="mdi-folder-multiple-outline" />
                  <v-icon v-else-if="ec.type === 'Stage'" icon="mdi-briefcase-outline" />
                  <strong style="margin-left: 10px">{{ ec.libelle }}</strong>
                  <strong style="margin-left: 4px">({{ ec.type }})</strong>
                </div>
                <v-icon>
                  {{ expandedCards.includes(ec.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </v-card-title>

              <v-expand-transition>
                <div v-if="expandedCards.includes(ec.id)">
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <h4
                          v-if="
                            ec.volume_horaire_tp ||
                            ec.volume_horaire_td ||
                            ec.volume_horaire_cm ||
                            ec.volume_horaire_pt ||
                            ec.volume_horaire_etudiant ||
                            ec.volume_horaire_cm_td
                          "
                        >
                          Volumes horaires :
                        </h4>
                        <h4 v-else>Pas de volumes horaires</h4>
                        <v-list dense class="pa-0 compact-list">
                          <v-list-item v-if="ec.volume_horaire_tp"
                            >TP : {{ ec.volume_horaire_tp }} heures</v-list-item
                          >
                          <v-list-item v-if="ec.volume_horaire_td"
                            >TD : {{ ec.volume_horaire_td }} heures</v-list-item
                          >
                          <v-list-item v-if="ec.volume_horaire_cm"
                            >CM : {{ ec.volume_horaire_cm }} heures</v-list-item
                          >
                          <v-list-item v-if="ec.volume_horaire_pt"
                            >PT : {{ ec.volume_horaire_pt }} heures</v-list-item
                          >
                          <v-list-item v-if="ec.volume_horaire_etudiant"
                            >Étudiant : {{ ec.volume_horaire_etudiant }} heures</v-list-item
                          >
                          <v-list-item v-if="ec.volume_horaire_cm_td"
                            >CM/TD : {{ ec.volume_horaire_cm_td }} heures</v-list-item
                          >
                        </v-list>
                      </v-col>
                      <v-col cols="6">
                        <h4>Crédits ECTS : {{ ec.credits_ects }}</h4>
                        <h4 v-if="ec.type === 'enseignement'">
                          Modalité :
                          <div class="d-flex align-center" style="gap: 12px">
                            <v-checkbox
                              label="Présentiel"
                              disabled
                              v-model="ec.est_presentiel"
                              class="ma-0"
                            />
                            <v-checkbox
                              label="Distanciel"
                              disabled
                              v-model="ec.est_distanciel"
                              class="ma-0"
                            />
                            <v-checkbox
                              label="Hybride"
                              disabled
                              v-model="ec.est_hybride"
                              class="ma-0"
                            />
                          </div>
                        </h4>
                        <h4 v-if="ec.est_assoce">Évaluation associée</h4>
                        <h4 v-if="ec.isole">Évaluation isolée</h4>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <h4>Description :</h4>
                        <p v-if="ec.description">{{ ec.description }}</p>
                        <p v-else>Aucune description disponible.</p>
                      </v-col>
                    </v-row>
                    <v-row v-if="ec.type === 'AMS'">
                      <v-col cols="12">
                        <h4>Commentaires :</h4>
                        <p v-if="ec.commentaires">{{ ec.commentaires }}</p>
                        <p v-else>Aucun commentaire disponible.</p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <h4>
                          Formation d'origine : <strong>{{ ec.formation.libelle }}</strong>
                        </h4>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn
                      color="primary"
                      :disabled="estDejaImporte(ec)"
                      @click="() => importerEC(ec)"
                      >{{ estDejaImporte(ec) ? 'Déjà importé' : 'Importer' }}</v-btn
                    >
                  </v-card-actions>
                </div>
              </v-expand-transition>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-overlay>
</template>



<script setup>
import { ref, watch, defineEmits, computed } from 'vue'

import { useComposanteStore } from '@/stores/composanteStore'
import { useFormationStore } from '@/stores/formationStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useEcStore } from '@/stores/elementConstitutifStore'

const props = defineProps({
  overlayShow: {
    type: Boolean,
    required: true
  },
  periodeId: {
    type: Number,
    required: true
  },
  refKeyRefreshTreeView: {
    type: Number,
    required: false
  }
})

const composanteStore = useComposanteStore()
const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const periodeStore = usePeriodeStore()
const ecStore = useEcStore()

const emit = defineEmits(['update:overlayShow, refreshTreeView'])
const overlay = ref(false)

const expandedCards = ref([])

const existingFormations = ref([])
const existingComposantes = ref([])
const selectedComposante = ref(null)
const selectedFormation = ref(null)
const search = ref('')
function normalizeText(text) {
  return text
    .normalize('NFD') // décompose les lettres accentuées
    .replace(/\p{Diacritic}/gu, '') // enlève les diacritiques
    .toLowerCase()
}

const filteredEcs = computed(() => {
  // --- 1️⃣ Base : copie pour ne pas modifier le store ---
  let ecs = ecStore.ecs
    .filter((ec) => ec.est_mutualisable)
    .filter((ec) => ec.version_id !== parcoursStore.versionSelected.id)
    .map((ec) => ({
      ...ec,
      // on ajoute une propriété "formation" dérivée sans muter l'original
      formation: parcoursStore.versions.find((v) => v.id === ec.version_id)?.formation
    }))

  // --- 2️⃣ Filtrage par formation sélectionnée ---
  if (selectedFormation.value) {
    ecs = ecs.filter((ec) => {
      const formation = formationStore.formations.find((f) => f.id === ec.formation_id)
      return formation?.composante_id === selectedFormation.value.composante_id
    })
  }

  // --- 3️⃣ Filtrage par recherche texte ---
  const query = normalizeText(search.value.trim())
  if (query) {
    ecs = ecs.filter((ec) => normalizeText(ec.libelle).includes(query))
  }

  // --- 4️⃣ Tri (commence par la recherche en premier) ---
  ecs.sort((a, b) => {
    const aLabel = normalizeText(a.libelle)
    const bLabel = normalizeText(b.libelle)
    const aStarts = aLabel.startsWith(query)
    const bStarts = bLabel.startsWith(query)
    if (aStarts && !bStarts) return -1
    if (!aStarts && bStarts) return 1
    return aLabel.localeCompare(bLabel)
  })

  // --- 5️⃣ Debug optionnel ---
  // console.log('Filtered ECs:', ecs)

  return ecs
})

const resetFilters = () => {
  search.value = ''
  selectedComposante.value = null
  selectedFormation.value = null
}
const toggleExpanded = (id) => {
  const index = expandedCards.value.indexOf(id)
  if (index === -1) {
    expandedCards.value.push(id)
  } else {
    expandedCards.value.splice(index, 1)
  }
}

const estDejaImporte = (ec) => {
  return periodeStore.periodes
    .find((p) => p.id === props.periodeId)
    .ec_imported_by_mutualisation.some((importedEc) => importedEc.element_constitutif_id === ec.id)
}

const ecsMutualisedAndFormationInformations = ref([])

const importerEC = (ec) => {
  ecStore.importerEC(ec, props.periodeId)
  emit('refreshTreeView')
  emit('update:overlayShow', false)
}

const initData = async () => {
  await composanteStore.fetchComposantes()
  console.log('Composantes fetched:', composanteStore.composantes)
  await formationStore.fetchFormation()
  existingComposantes.value = [
    ...composanteStore.composantes.filter((composante) => !composante.is_historized)
  ].sort((a, b) => (a.libelle || '').localeCompare(b.libelle || '', 'fr', { sensitivity: 'base' }))

  existingFormations.value = [...formationStore.formations]
    // 🔹 d'abord on filtre selon la composante sélectionnée
    .filter(
      (formation) =>
        formation.composante_id === selectedComposante.value?.id || !selectedComposante.value
    )
    // 🔹 ensuite on trie par libellé (ordre alphabétique sans accents)
    .sort((a, b) => (a.libelle || '').localeCompare(b.libelle || '', 'fr', { sensitivity: 'base' }))

  await parcoursStore.fetchVersions()
  await periodeStore.fetchPeriodes()
  ecStore.fetchECs()
  // formationStore.fetchFormation();
  // ecStore.ecs.filter((ec) => ec.est_mutualisable).forEach((ec) => {
  //   formationStore.fetchFormationById(ec.formation_id).then((formation) => {
  //     ecsMutualisedAndFormationInformations.value.push({
  //       ec,
  //       formation
  //     })
  //   })
  // })
  console.log(
    'Mutualised ECs fetched:',
    ecStore.ecs.filter((ec) => ec.est_mutualisable)
  )
}

initData()
watch(
  () => props.overlayShow,
  (val) => {
    overlay.value = val
  },
  { immediate: true }
)
watch(selectedComposante, () => {
  existingFormations.value = [...formationStore.formations]
    .filter((f) =>
      !selectedComposante.value ? true : f.composante_id === selectedComposante.value.id
    )
    .sort((a, b) => (a.libelle || '').localeCompare(b.libelle || '', 'fr', { sensitivity: 'base' }))
})
</script>
<style scoped>
.compact-list .v-list-item {
  min-height: 24px !important; /* réduit la hauteur de chaque ligne */
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin: 0 !important;
}

.compact-list .v-list-item-title,
.compact-list .v-list-item-subtitle {
  line-height: 1.2 !important;
}
</style>
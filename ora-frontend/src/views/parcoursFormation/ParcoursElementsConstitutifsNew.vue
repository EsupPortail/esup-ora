<template>
  <v-row style="margin-bottom: 8px">
    <v-col cols="10">
      <h3 style="font-weight: normal; display: inline-block; align-items: center; gap: 8px">
        <v-icon left>mdi-school-outline</v-icon>
        {{ parametre.semantique_ec || 'Éléments constitutifs' }}
      </h3>
            <div style="display: inline-block; margin-left: 12px">
        <AideBulles pageAsked="elements-constitutifs" />
      </div>

    </v-col>
    <v-col cols="2">
      <ButtonExport pageAsked="EC" />
    </v-col>
  </v-row>
  <v-container
    style="
      background-color: #fcfcfc;
      border-radius: 15px;
      width: 100% !important;
      max-width: none !important;
    "
  >
    <v-row>
      <v-col cols="3">
        <v-card outlined style="padding: 0px; border: 1px solid #707070; border-radius: 15px">
          <v-card-title style="text-align: center">
            <span>
              <v-icon left>mdi-calendar-blank-outline</v-icon>
              Durée de la formation (2 max)
            </span>
            <v-btn icon variant="text" @click="dureeExpanded = !dureeExpanded">
              <v-icon>{{ dureeExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-spacer style="height: 1px; background: #707070" />
          </v-card-title>
          <v-expand-transition>
            <div v-show="dureeExpanded">
              <v-card-text style=" padding: 15px 8px 8px 15px !important;">
                <v-row style="padding-bottom: 12px">
                  <v-col
                    v-for="periode in periodes"
                    :key="periode.id"
                    style="padding: 0px; padding-left: 12px !important"
                    cols="12"
                  >
                    <v-checkbox
                      v-model="periodesSelected"
                      :label="periode.libelle"
                      :value="periode.id"
                      :disabled="
                        periodesSelected.length >= 2 && !periodesSelected.includes(periode.id)
                      "
                      @change="selectPeriodes(periodesSelected)"
                      hide-details
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card outlined style="border: 1px solid #707070; border-radius: 15px; padding: 0px;">
          <v-card-title style="text-align: center">
            <span>
              <v-icon left>mdi-bullseye</v-icon>
              Compétences
            </span>
            <v-btn icon variant="text" @click="competencesExpanded = !competencesExpanded">
              <v-icon>{{ competencesExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-spacer style="height: 1px; background: #707070" />
          </v-card-title>
          <v-expand-transition>
            <div v-show="competencesExpanded">
              <v-card-text style=" padding: 15px 8px 8px 15px !important;">
                <v-row style="padding-bottom: 12px">
                  <v-col
                    v-for="competence in competencesListOfSelectedVersion"
                    :key="competence.id"
                    cols="12"
                    style="padding: 0px; padding-left: 12px !important"
                  >
                    <v-checkbox
                      v-model="competencesSelected"
                      :label="competence.libelle"
                      :value="competence.id"
                      @change="selectCompetences(competencesSelected)"
                      hide-details
                      density="comfortable"
                      style="max-width: 320px !important"
                      />
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card outlined style="border: 1px solid #707070; border-radius: 15px; padding: 0px">
          <v-card-title style="text-align: center">
            <span>
              <v-icon left>mdi-chart-line-variant</v-icon>
              Niveaux
            </span>
            <v-btn icon variant="text" @click="niveauxExpanded = !niveauxExpanded">
              <v-icon>{{ niveauxExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-spacer style="height: 1px; background: #707070" />
          </v-card-title>
          <v-expand-transition>
            <div v-show="niveauxExpanded">
              <v-card-text style="display: 0px;  padding: 15px 8px 8px 15px !important;">
                <v-row style="padding-bottom: 12px">
                  <v-col
                    v-for="niveau in [...niveauxRef].sort((a, b) => a.id - b.id)"
                    :key="niveau.id"
                    style="padding: 0px; padding-left: 12px !important"
                    cols="12"
                  >
                    <v-checkbox
                      v-model="niveauxSelected"
                      :label="niveau.libelle"
                      :value="niveau.id"
                      @change="selectNiveaux(niveauxSelected)"
                      hide-details
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      style="margin-top: 16px; margin-bottom: 16px"
      @click="validerSelection"
      :disabled="
        periodesSelected.length === 0 ||
        competencesSelected.length === 0 ||
        niveauxSelected.length === 0
      "
    >
      Valider la sélection des périodes, compétences et niveaux
    </v-btn>

    <template v-for="(chunk, rowIndex) in chunkedPeriodesSelected" :key="rowIndex">
      <v-row style="padding-top: 12px">
        <v-col
          cols="6"
          v-for="(periodeObj, idx) in chunk"
          :key="periodeObj.id"
          :style="idx % 2 === 0 ? 'border-right: 2px solid #707070;' : ''"
        >
          <ECAddEnseignement
            :parcours="parcoursSelected"
            :version="versionSelected"
            :periode="periodeObj"
            @refresh-enseignements="refreshEnseignements"
          />
        </v-col>
      </v-row>
    </template>
    <div style="border-top: 1px dashed #707070; margin-top: 12px; margin-bottom: 12px" />

    <v-row v-if="competencesListOfSelectedVersion.length > 0" style="margin-top: 160px">
      <v-col>
        <TabTreeAppEns
          v-if="
            periodesSelected.length > 0 &&
            competencesSelected.length > 0 &&
            niveauxSelected.length > 0
          "
          :keyForRefresh="childKeyForRefresh"
          :competencesSelected="competencesSelected"
          :niveauxSelected="niveauxSelected"
          :periodes="periodesSelected"
          @refreshTreeView="refreshTreeView"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

import PageInDev from '@/components/PageInDev.vue'
import ECAddEnseignement from '@/views/parcoursFormation/elementConstitutif/ECAddEnseignement.vue'

import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useFormationStore } from '@/stores/formationStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import TabTreeAppEns from './elementConstitutif/TabTreeAppEns.vue'
import ButtonExport from '@/views/parcoursFormation/exportExcelPDF/ButtonExport.vue'
import AideBulles from '@/components/AideBulles.vue'
const competenceStore = useCompetenceStore()
const competencesListOfSelectedVersion = ref([])
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()
const parcoursSelected = parcoursStore.parcoursSelected
const versionSelected = parcoursStore.versionSelected
const periodeStore = usePeriodeStore()

const niveauxRef = ref([])
const periodes = ref([])
const periodesInSelectList = ref([])
const periodeSelected = ref(null)
const refreshAsked = ref(false)
const parametre = ref({})
const childKeyForRefresh = ref(0)

const dureeExpanded = ref(true)
const periodesSelected = ref([])

const refreshTreeView = async () => {
  await refreshEnseignements();
}

const competencesExpanded = ref(true)
const competencesSelected = ref([])

const niveauxExpanded = ref(true)
const niveauxSelected = ref([])
const chunkedPeriodesSelected = computed(() => {
  if (
    !periodesSelected.value ||
    !Array.isArray(periodesSelected.value) ||
    periodesSelected.value.length === 0
  ) {
    return []
  }

  // Filtrer uniquement les périodes réellement sélectionnées
  const filtered = periodesInSelectList.value.filter((p) => periodesSelected.value.includes(p.id))

  // Découper en groupes de 2 pour affichage par ligne
  const result = []
  for (let i = 0; i < filtered.length; i += 2) {
    result.push(filtered.slice(i, i + 2))
  }

  return result
})

const initParam = async () => {
  const v = parcoursStore.versionSelected
  const formation = await formationStore.fetchOneFormationFromId(v.formation_id)
  parametre.value = formation.composante.parametre
}
initParam()

const getDureeEnUnit = async () => {
  await periodeStore.fetchPeriodesWithVersionID(versionSelected.id).then((d) => {
    periodes.value = d
  })
  let idSelect = 0
  for (let i = 0; i < periodes.value.length; i += 2) {
    let title = periodes.value[i + 1]
      ? periodes.value[i].libelle + ' - ' + periodes.value[i + 1].libelle
      : periodes.value[i].libelle
    let periodesObjects = periodes.value[i + 1]
      ? [periodes.value[i], periodes.value[i + 1]]
      : [periodes.value[i]]
    periodesInSelectList.value.push({
      id: idSelect,
      title: title,
      periodesObjects: periodesObjects
    })
    idSelect++
  }
  periodeSelected.value = periodesInSelectList.value[0]?.id ?? null
  selectPeriodes()
}

const fetchCompetence = async () => {
  await competenceStore.fetchCompetenceForSelectedVersion().then((data) => {
    competencesListOfSelectedVersion.value = data
  })
}

const init = async () => {
  await getDureeEnUnit()
  await fetchCompetence()
  periodesSelected.value = [
    ...periodes.value.slice(0, 2).map((p) => {
      return p.id
    })
  ]
  await selectPeriodes(periodesSelected.value)
  competencesListOfSelectedVersion.value = competenceStore.competences.filter(
    (c) => c.version_id === parcoursStore.versionSelected.id
  )
  niveauxRef.value = competencesListOfSelectedVersion.value[0]?.niveau
  // Sélectionne le premier élément de chaque liste si disponible
  if (competencesListOfSelectedVersion.value.length > 0) {
    competencesSelected.value = [competencesListOfSelectedVersion.value[0].id]
  }
  if (competenceStore.competenceSelected?.niveau?.length > 0) {
    niveauxSelected.value = [competenceStore.competenceSelected.niveau[0].id]
  }
  await selectCompetences(competencesSelected.value)
  await selectNiveaux(niveauxSelected.value)
  await nextTick()
  parametre.value = formationStore.formationSelected.composante.parametre
  validerSelection();
}
init()

const refreshEnseignements = async () => {
  childKeyForRefresh.value++
  refreshAsked.value = true

  await nextTick()
  setTimeout(() => {
    refreshAsked.value = false
  }, 3000)
}

const selectPeriodes = async (selectedIds) => {
  if (!Array.isArray(selectedIds)) return

  periodesSelected.value = selectedIds
  // Supprimer celles qui ne sont plus sélectionnées en premier
  periodesInSelectList.value = periodesInSelectList.value.filter((p) => selectedIds.includes(p.id))

  // Tableau pour stocker les promesses de fetch
  const fetchPromises = []

  selectedIds.forEach((id) => {
    const alreadyExists = periodesInSelectList.value.some((p) => p.id === id)
    if (!alreadyExists) {
      fetchPromises.push(
        periodeStore.fetchPeriodeWithEnseignementFromID(id).then((fullPeriodeFetched) => {
          // On ne garde que l'id
          periodesInSelectList.value.push({
            id: fullPeriodeFetched.id,
            libelle: fullPeriodeFetched.libelle
          })
          periodesInSelectList.value.sort((a, b) => a.id - b.id)
        })
      )
    }
  })

  // Attendre que tous les fetch soient finis avant de rafraîchir
  await Promise.all(fetchPromises)

  // Déclencher un refresh
  refreshAsked.value = true
  setTimeout(() => {
    refreshAsked.value = false
  }, 3000)
}

const selectCompetences = async (selectedIds) => {
  if (!Array.isArray(selectedIds)) return
  competencesSelected.value = selectedIds
}

const selectNiveaux = async (selectedIds) => {
  if (!Array.isArray(selectedIds)) return
  niveauxSelected.value = selectedIds
}

const validerSelection = () => {
  childKeyForRefresh.value++
  refreshAsked.value = true
}

watch(
  () => chunkedPeriodesSelected.value,
  (newVal) => {
  }
)

// watch(() => competenceStore.competences, (newCompetences) => {
//     console.log('watch competences from apprentissages', newCompetences);
//     competencesListOfSelectedVersion.value = newCompetences;
// });
</script>

<style scoped>
</style>
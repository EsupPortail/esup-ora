<template>
  <v-row>
    <v-col cols="6">
      <h3 style="font-weight: normal; display: inline-block; align-items: center; gap: 8px">
        <v-icon left>mdi-bullseye</v-icon>
        {{ parametre.semantique_competence || 'Compétences' }} et
        {{ parametre.semantique_critere || "critères d'exigences" }}
      </h3>
      <div style="display: inline-block; margin-left: 12px">
        <AideBulles pageAsked="competences" />
      </div>
    </v-col>
    <v-col cols="2" offset="4">
      <ButtonExport pageAsked="Competences" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <v-autocomplete
        v-if="!currentFicheData"
        v-model="selectedFiche"
        v-model:search="searchInputText"
        v-model:menu="isMenuOpen"
        :items="rncpResults"
        :loading="searchLoading"
        item-title="intitule"
        item-value="id"
        label="Rechercher dans le référentiel RNCP"
        variant="solo-filled"
        flat
        hide-no-data
        return-object
        :no-filter="true"
        @update:model-value="onSelectFiche"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :title="item.raw.numeroFiche + ' - ' + item.raw.intitule">
            <template v-slot:append>
              <v-icon color="primary">mdi-import</v-icon>
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>

      <v-card v-else variant="outlined" class="d-flex align-center pa-3" border color="primary">
        <v-icon start icon="mdi-file-check" class="mr-3"></v-icon>
        <div class="overflow-hidden">
          <div class="text-subtitle-1 font-weight-bold">{{ currentFicheData.numeroFiche }}</div>
          <div class="text-caption text-truncate">{{ currentFicheData.intitule }}</div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="error"
          @click="showConfirmDelete = true"
        ></v-btn>
      </v-card>
    </v-col>

    <v-dialog v-model="showConfirmDelete" max-width="500px">
      <v-card>
        <v-card-title class="bg-error text-white">Confirmer la suppression</v-card-title>
        <v-card-text class="pt-4">
          Êtes-vous sûr de vouloir retirer cette fiche ?
          <strong
            >Tous les blocs de compétences associés seront supprimés de votre parcours.</strong
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showConfirmDelete = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="confirmCancelImport">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <v-row style="padding-left: 40px; padding-right: 40px">
    <v-col cols="12">
      <v-card
        v-for="(comp, index) in competencesList.sort((a, b) => a.id - b.id)"
        class="elevation-5"
        :key="index"
        :style="{
          marginTop: '20px',
          borderLeft: `23px solid ${comp.color_hexadecimal}`,
          borderRadius: '15px 0px 0px 15px',
          paddingTop: '10px',
          paddingBottom: '10px'
        }"
      >
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="11" style="padding-left: 40px; padding-top: 20px">
                  <v-row>
                    <v-col class="pt-0 pb-0" cols="12">
                      <v-text-field
                        @blur="libChangeCompContext(comp) && libChange(comp)"
                        @keyup.enter="libChangeCompContext(comp) && libChange(comp)"
                        v-model="comp.competence_contextualisee"
                        :disabled="!comp.id"
                        label="Ajouter une compétence contextualisée"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card variant="outlined" class="mt-4">
                    <v-expansion-panels>
                      <v-expansion-panel elevation="0">
                        <v-expansion-panel-title @click.stop="togglePanel(comp.id)">
                          <div class="text-subtitle-1 font-weight-medium">
                            <span v-if="!blocCheckedInComp(comp)"
                              >RNCP :
                              <b
                                >{{ currentFicheData?.blocsCompetences.length }} blocs de
                                compétences disponibles</b
                              ></span
                            >
                            <v-list density="compact" v-else>
                              <template
                                v-for="bcc in (currentFicheData?.blocsCompetences || []).sort(
                                  (a, b) => a.code.localeCompare(b.code)
                                )"
                                :key="bcc.code"
                              >
                                <v-list-item v-if="estRncpCheck(comp, bcc)" class="pa-0 py-2">
                                  <template v-slot:title>
                                    <div class="text-wrap" style="line-height: 1.4">
                                      <span class="font-weight-bold">{{ bcc.code }}</span> -
                                      {{ bcc.libelle }}
                                    </div>
                                  </template>

                                  <template v-slot:prepend>
                                    <v-checkbox-btn
                                      disabled="true"
                                      :model-value="estRncpCheck(comp, bcc)"
                                      @change="addBccRncp(comp, bcc, currentFicheData.numeroFiche)"
                                      class="pe-2"
                                    ></v-checkbox-btn>
                                  </template>
                                </v-list-item>
                              </template>
                            </v-list>
                          </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-row>
                            <v-col cols="12">
                              <v-list density="compact">
                                <v-list-item
                                  v-for="bcc in (currentFicheData?.blocsCompetences || []).sort(
                                    (a, b) => a.code.localeCompare(b.code)
                                  )"
                                  :key="bcc.code"
                                  class="pa-0 py-2"
                                >
                                  <template v-slot:title>
                                    <div class="text-wrap" style="line-height: 1.4">
                                      <span class="font-weight-bold">{{ bcc.code }}</span> -
                                      {{ bcc.libelle }}
                                    </div>
                                  </template>

                                  <template v-slot:prepend>
                                    <v-checkbox-btn
                                      :model-value="estRncpCheck(comp, bcc)"
                                      @change="addBccRncp(comp, bcc, currentFicheData.numeroFiche)"
                                      class="pe-2"
                                    ></v-checkbox-btn>
                                  </template>
                                </v-list-item>
                              </v-list>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                  <v-row v-for="critExig in comp.critere_exigences" style="margin-top: 10px">
                    <v-col cols="10" style="padding-top: 0px; padding-bottom: 0px">
                      <div v-if="!(showInputCritEx === critExig.id)">{{ critExig.libelle }}</div>
                      <div v-else>
                        <v-text-field
                          @blur="updateCritEx(critExig)"
                          @keyup.enter="updateCritEx(critExig)"
                          v-model="critExig.libelle"
                          :label="parametre.semantique_critere || 'Critères d\'exigence'"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="2" style="padding-top: 0px; padding-bottom: 0px">
                      <v-icon
                        size="small"
                        v-if="!(showInputCritEx === critExig.id)"
                        @click="showInputCritEx = critExig.id"
                        >mdi-pencil</v-icon
                      >
                      <v-icon v-else color="success" @click="updateCritEx(critExig)" size="small">
                        mdi-check-circle
                      </v-icon>

                      <v-icon color="error" @click="deleteNCritEx(critExig)" size="small"
                        >mdi-trash-can</v-icon
                      >
                    </v-col>
                  </v-row>
                  <v-row style="margin-top: 6px">
                    <v-col cols="10">
                      <v-text-field
                        @keyup.enter="addNCritExig(comp)"
                        v-model="comp.nCritExig"
                        :label="
                          'Ajouter un ' + (parametre.semantique_critere || 'Critères d\'exigence')
                        "
                        variant="outlined"
                        density="compact"
                        :disabled="!comp.id"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn @click="addNCritExig(comp)" color="success" :disabled="!comp.nCritExig"
                        >Ajouter</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="1" class="d-flex justify-end">
                  <v-icon size="small" @click="duplicateCompetence(comp)"
                    >mdi-content-duplicate</v-icon
                  >
                  <v-icon @click="deleteCompetence(comp)" color="error" size="small"
                    >mdi-trash-can</v-icon
                  >
                  <v-icon @click="() => (paletteColorOfSelectedComp = comp.id)" size="small"
                    >mdi-palette</v-icon
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical :thickness="2"></v-divider>
            <v-col cols="5" style="padding-left: 80px; padding-top: 80px">
              <h3>Famille de situations</h3>

              <v-row
                v-for="fdi in [...comp.famille_de_situations].sort((a, b) =>
                  a.libelle.localeCompare(b.libelle)
                )"
                style="margin-top: 22px"
              >
                <v-col cols="10" style="padding-top: 0px; padding-bottom: 0px">
                  <div v-if="!(showInputFdi === fdi.id)">{{ fdi.libelle }}</div>
                  <div v-else>
                    <v-text-field
                      @blur="updateSituationPro(fdi)"
                      @keyup.enter="updateSituationPro(fdi)"
                      v-model="fdi.libelle"
                      :label="'Éditer ' + (parametre.semantique_famille || 'famille de situations')"
                      variant="outlined"
                      density="compact"
                      style="margin-top: 10px; margin-bottom: 10px"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col
                  cols="2"
                  class="d-flex align-center justify-center"
                  style="padding-top: 0px; padding-bottom: 0px"
                >
                  <v-icon
                    v-if="!(showInputFdi === fdi.id)"
                    size="small"
                    @click="showInputFdi = fdi.id"
                    >mdi-pencil</v-icon
                  >
                  <v-icon v-else color="success" @click="updateSituationPro(fdi)" size="small">
                    mdi-check-circle
                  </v-icon>
                  <v-icon color="error" @click="deleteSituationPro(fdi)" size="small">
                    mdi-trash-can
                  </v-icon>
                </v-col>
              </v-row>
              <v-row style="margin-top: 10px">
                <v-col cols="10">
                  <v-text-field
                    v-model="vModelSituationPro[comp.id]"
                    :label="'Ajouter ' + (parametre.semantique_famille || 'famille de situations')"
                    variant="outlined"
                    @keyup.enter="addSituationPro(comp)"
                    density="compact"
                    :disabled="!comp.id"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    @click="addSituationPro(comp)"
                    color="success"
                    :disabled="!vModelSituationPro"
                  >
                    Ajouter
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row class="mt-2">
        <v-col cols="9">
          <v-btn @click="preAddCompetence" color="success"
            ><v-icon>mdi-plus</v-icon>Ajouter
            {{ parametre.semantique_competence || 'Compétence' }}</v-btn
          >
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import router from '@/router/router'

import Cookies from 'js-cookie'

import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useFormationStore } from '@/stores/formationStore'
import { useParametreStore } from '@/stores/parametreStore'
import { useConnectionStore } from '@/stores/connectionStore'

import ButtonExport from '@/views/parcoursFormation/exportExcelPDF/ButtonExport.vue'
import AideBulles from '@/components/AideBulles.vue'
import { config } from '@/environment/environment'

const colors = [
  '#6BFA0A',
  '#FA2B0A',
  '#5277A8',
  '#4E7E36',
  '#7C818A',
  '#C256A1',
  '#CD55FA',
  '#55BFFA',
  '#FA7B55',
  '#FA7B55',
  '#E1A624',
  '#287A8F',
  '#CE6A6B',
  '#91228D',
  '#B2C453',
  '#212153'
]

const swatches = [
  ['#6BFA0A', '#FA2B0A', '#5277A8', '#4E7E36', '#7C818A'],
  ['#C256A1', '#CD55FA', '#55BFFA', '#FA7B55', '#E1A624'],
  ['#287A8F', '#CE6A6B', '#91228D', '#B2C453', '#212153']
]

const paletteColorOfSelectedComp = ref(null)

const vModelSituationPro = ref({})
const competencesList = ref([])
const versionId = router.currentRoute.value.params.idVersion
const version = ref(null)
const toggleHelp = ref(null)
const showInputCritEx = ref(0)
const showInputFdi = ref(0)
const nCritExig = ref('')
const panels = ref([])
const parametre = ref({})
const isAddCompetence = ref(false)
const helpList = ref([true, false, true, false, true])
const Ncomp = ref({
  libelle: '',
  critere_exigences: [],
  famille_de_situations: []
})
const rncpPanelIdOpen = ref([])
const togglePanel = (id) => {
  const isAlreadyOpen = rncpPanelIdOpen.value.includes(id)

  if (isAlreadyOpen) {
    rncpPanelIdOpen.value = rncpPanelIdOpen.value.filter((item) => item !== id)
  } else {
    rncpPanelIdOpen.value = [...rncpPanelIdOpen.value, id]
  }
}

const competenceStore = useCompetenceStore()
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()
const parametreStore = useParametreStore()
const connectionStore = useConnectionStore()

const init = async () => {
  await competenceStore.fetchCompetences()
  competencesList.value = competenceStore.getCompetenceByVersion(versionId)
  version.value = await formationStore.fetchVersionById(versionId)
  const formation = await formationStore.fetchOneFormationFromId(version.value.formation_id)
  parametre.value = formation.composante.parametre

  let ficheRNCP = null
  console.log(competencesList.value)
  competencesList.value.forEach((comp) => {
    if (comp.rncp_bccs && comp.rncp_bccs.length > 0) {
      comp.rncp_bccs.forEach((bcc) => {
        ficheRNCP = bcc.numero_fiche
        return
      })
    }
  })
  console.log('Fiche RNCP liée trouvée :', ficheRNCP)
  if (ficheRNCP) {
    const response = await fetch(`${config.backend.url}/rncp/search?numeroFiche=${ficheRNCP}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`,
        'X-Active-Role': connectionStore.selectedRole ? connectionStore.selectedRole.name : '',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const ficheData = await response.json()
    currentFicheData.value = ficheData[0]
    importRNCPBlocs(ficheData[0])
    isMenuOpen.value = false
  }
}
init()

const updateVersion = () => {
  parcoursStore.updateVersion(version.value)
}

const deleteNCritEx = (compC) => {
  competenceStore.deleteCritereExigence(compC).then(() => {
    competencesList.value.forEach((comp) => {
      comp.critere_exigences = comp.critere_exigences.filter((compC2) => compC2.id !== compC.id)
    })
  })
}

const takeColor = () => {
  const usedColors = competencesList.value
    .map((c) => c.color_hexadecimal)
    .filter((color) => typeof color === 'string' && color.length > 0)
  // Pick a random color not in usedColors
  const unusedColors = colors.filter((color) => !usedColors.includes(color))
  const availableColor = unusedColors.length
    ? unusedColors[Math.floor(Math.random() * unusedColors.length)]
    : colors[Math.floor(Math.random() * colors.length)]
  return availableColor
}

const duplicateCompetence = (comp) => {
  comp.version_id = parseInt(versionId, 10)
  comp.color_hexadecimal = takeColor()
  competenceStore.duplicateCompetence(comp, formationStore.formationSelected.noms_des_niveaux)
}
const preAddCompetence = () => {
  let comp = {
    libelle: '',
    color_hexadecimal: takeColor(),
    critere_exigences: [],
    famille_de_situations: []
  }
  comp.version_id = versionId
  competenceStore.createCompetence(comp, formationStore.formationSelected.noms_des_niveaux)
  competenceStore.fetchCompetences()
}

const addSituationPro = (comp) => {
  const inputValue = vModelSituationPro.value[comp.id]
  if (inputValue && inputValue !== '') {
    const situation = {
      libelle: inputValue,
      competence: {
        connect: {
          id: comp.id
        }
      }
    }
    competenceStore.addFamilleDeSituation(situation).then((newFdi) => {
      comp.famille_de_situations.push(newFdi)
    })
    vModelSituationPro.value[comp.id] = ''
  }
}

const blocCheckedInComp = (comp) => {
  return comp.rncp_bccs && comp.rncp_bccs.length > 0
}

const deleteSituationPro = (fdi) => {
  competenceStore.deleteFamilleDeSituation(fdi).then(() => {
    competencesList.value.forEach((comp) => {
      comp.famille_de_situations = comp.famille_de_situations.filter((fdi2) => fdi2.id !== fdi.id)
    })
  })
}

const updateSituationPro = (fdi) => {
  competenceStore.updateFamilleDeSituation({
    id: fdi.id,
    libelle: fdi.libelle
  })
  showInputFdi.value = 0
}

const addNCritExig = (comp) => {
  if (comp.nCritExig !== '') {
    const critere_exigence = {
      libelle: comp.nCritExig,
      competence: {
        connect: {
          id: comp.id
        }
      }
    }
    competenceStore.addCritereExigence(critere_exigence).then((compC) => {
      comp.critere_exigences.push(compC)
    })
  }
  comp.nCritExig = ''
}

const updateCritEx = (critEx) => {
  competenceStore.updateCritereExigence({
    id: critEx.id,
    libelle: critEx.libelle
  })
  showInputCritEx.value = 0
}

const libChange = (comp) => {
  if (comp.libelle !== '') {
    if (comp.id) {
      competenceStore.updateCompetence(comp)
    } else {
      comp.version_id = versionId
      competenceStore
        .createCompetence(comp, formationStore.formationSelected.noms_des_niveaux)
        .then((nComp) => {
          comp.id = nComp.id
        })
    }
  }
  competenceStore.fetchCompetences()
}

const libChangeCompContext = (comp) => {
  if (comp.competence_contextualisee !== '') {
    if (comp.id) {
      competenceStore.updateCompetence(comp)
    } else {
      comp.version_id = versionId
      competenceStore.createCompetence(comp, formationStore.formationSelected.noms_des_niveaux)
    }
  }
  competenceStore.fetchCompetences()
}

const deleteCompetence = (comp) => {
  competenceStore.deleteCompetence(comp).then(() => {
    competencesList.value = competencesList.value.filter((comp2) => comp2.id !== comp.id)
  })
}

// Partie RNCP

const estRncpCheck = (comp, bccToCheck) => {
  return comp.rncp_bccs && comp.rncp_bccs.some((bcc) => bcc.code === bccToCheck.code)
}

const addBccRncp = async (competence, bcc, numeroFiche) => {
  bcc.numero_fiche = numeroFiche
  await competenceStore.linkBccRncpToCompetence(competence, bcc)
}
const isMenuOpen = ref(false)

const selectedFiche = ref(null)
const rncpResults = ref([])
const searchLoading = ref(false)
const currentFicheData = ref(null)
const showConfirmDelete = ref(false)
const searchInputText = ref('')

let searchTimer = null

const importRNCPBlocs = (fiche) => {
  if (!fiche?.blocsCompetences) return

  fiche.blocsCompetences.forEach((bloc) => {
    competencesList.value.push({
      id_rncp_source: fiche.numeroFiche,
      libelle: `[${fiche.numeroFiche}] ${bloc.libelle}`,
      color_hexadecimal: typeof takeColor === 'function' ? takeColor() : '#000000',
      competence_contextualisee: '',
      critere_exigences: [],
      famille_de_situations: []
    })
  })
}

const confirmCancelImport = async () => {
  if (currentFicheData.value) {
    const codeToRemove = currentFicheData.value.numeroFiche

    competencesList.value.map(async (comp) => {
      await competenceStore.deleteRncpOfCompetence(comp)
    })

    currentFicheData.value = null
    selectedFiche.value = null
    searchInputText.value = ''
    rncpResults.value = []
    showConfirmDelete.value = false
  }
}

// --- 2. LOGIQUE D'INTERFACE ---

const onSelectFiche = (fiche) => {
  if (fiche && typeof fiche === 'object') {
    currentFicheData.value = fiche
    console.log('Fiche sélectionnée :', fiche) // Debug
    // importRNCPBlocs(fiche)
    isMenuOpen.value = false
  }
}

const executeSearch = async (query) => {
  searchLoading.value = true
  try {
    const param = query.toUpperCase().startsWith('RNCP')
      ? `numeroFiche=${query}`
      : `intitule=${query}`

    const accessToken = Cookies.get('access_token')
    const response = await fetch(`${config.backend.url}/rncp/search?${param}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Active-Role': connectionStore.selectedRole ? connectionStore.selectedRole.name : '',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    rncpResults.value = data || []

    if (rncpResults.value.length > 0) isMenuOpen.value = true
  } catch (e) {
    console.error('Erreur API RNCP', e)
  } finally {
    searchLoading.value = false
  }
}

// --- 3. WATCHERS ---

watch(searchInputText, (newVal) => {
  if (!newVal || (selectedFiche.value && newVal === selectedFiche.value.intitule)) return
  if (newVal.length < 3) return

  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    executeSearch(newVal)
  }, 600)
})
const nextStep = () => {
  router.push({ name: 'apprentissagesCritiquesParcours' })
}

watch(
  () => competenceStore.competences,
  (newCompetences) => {
    delete competencesList.value
    competencesList.value = competenceStore.getCompetenceByVersion(versionId)
  }
)
</script>

<style scoped>
.ma-0 {
  margin: 0;
}
.mt-0 {
  margin-top: 0;
}
.pa-0 {
  padding: 0;
}
.pt-0 {
  padding-top: 0;
}
.pb-0 {
  padding-bottom: 0;
}

.formation-creation {
  padding: 20px;
}

.formation-creation h1 {
  color: #333;
}

.help-card {
  position: fixed;
  top: 30%;
  right: 50px;
  width: 600px;
  height: 280px;
  z-index: 1000;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(120%);
}

.slide-right-enter-from {
  transform: translateX(120%);
}

.slide-right-leave-from {
  transform: translateX(0px);
}
</style>
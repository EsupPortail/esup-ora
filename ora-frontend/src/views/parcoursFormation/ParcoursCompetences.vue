<template>
  <v-row>
    <v-col cols="12">
      <h3 style="font-weight: normal; display: flex; align-items: center; gap: 8px;">
        <v-icon left >mdi-bullseye</v-icon>
        {{ parametre.semantique_competence || 'Compétences' }} et
        {{ parametre.semantique_critere || "critères d'exigence" }}
      </h3>
    </v-col>
  </v-row>

  <v-expansion-panels> </v-expansion-panels>
  <v-row style="padding-left: 40px; padding-right: 40px">
    <v-col cols="12">
      <v-card
        v-for="(comp, index) in competencesList"
        :key="index"
        :style="{
          marginTop: '56px',
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
                <!-- <v-col cols="2">
                  <v-btn
                    icon="mdi-information"
                    variant="text"
                    @click="toggleHelp === index ? (toggleHelp = null) : (toggleHelp = index)"
                  >
                  </v-btn>
                  <transition name="slide-right">
                    <CaractereEvaluable
                      :toggleHelp="toggleHelp === index"
                      :competence="comp"
                      :caractereEvaluableTypes="caractereEvaluableStore.caractereEvaluableTypes"
                      @refreshCompetence="init"
                      @closeHelp="toggleHelp = null"
                    />
                  </transition>
                </v-col> -->
                <v-col cols="11" style="padding-left: 40px; padding-top: 20px;">
                  <v-row>
                    <v-col class="pt-0 pb-0" cols="12">
                      <v-text-field
                        @blur="libChange(comp)"
                        @keyup.enter="libChange(comp)"
                        v-model="comp.libelle"
                        label="Libelle"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="10">
                      <v-text-field
                        @blur="libChangeCompContext(comp)"
                        @keyup.enter="libChangeCompContext(comp)"
                        v-model="comp.competence_contextualisee"
                        :disabled="!comp.id"
                        label="Ajouter une compétence contextualisée"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn @click="libChangeCompContext(comp)" color="success" :disabled="!comp.id"
                        >Ajouter</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row
                    v-for="critExig in comp.critere_exigences"
                    style="margin-top: 10px; "
                  >
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
                      <v-icon size="small" @click="showInputCritEx = critExig.id"
                        >mdi-pencil</v-icon
                      >
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
                  <v-icon size="small" disabled>mdi-content-duplicate</v-icon>
                  <v-icon @click="deleteCompetence(comp)" color="error" size="small"
                    >mdi-trash-can</v-icon
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical :thickness="2" ></v-divider>
            <v-col cols="5" style="padding-left: 80px; padding-top: 80px;">
              <h3>Famille de situation</h3>
              <v-row
                    v-for="fdi in [...comp.famille_de_situations].sort((a, b) => a.libelle.localeCompare(b.libelle))"
                    style="margin-top: 10px; "
                  >
                    <v-col cols="10" style="padding-top: 0px; padding-bottom: 0px">
                      <div v-if="!(showInputFdi === fdi.id)">{{ fdi.libelle }}</div>
                        <div v-else>
                        <v-text-field
                          @blur="updateSituationPro(fdi)"
                          @keyup.enter="updateSituationPro(fdi)"
                          v-model="fdi.libelle"
                          label="Famille de situation"
                          variant="outlined"
                          density="compact"
                          style="margin-top: 10px; margin-bottom: 10px;"
                        ></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="2" style="padding-top: 0px; padding-bottom: 0px">
                      <v-icon size="small" @click="showInputFdi = fdi.id"
                        >mdi-pencil</v-icon
                      >
                      <v-icon color="error" @click="deleteSituationPro(fdi)" size="small"
                        >mdi-trash-can</v-icon
                      >
                    </v-col>
                  </v-row>
              <v-row style="margin-top: 10px;">
                <v-col cols="10">
                  <v-text-field
                    v-model="vModelSituationPro[comp.id]"
                    label="Ajouter une situation professionnelle"
                    variant="outlined"
                    @keyup.enter="addSituationPro(comp)"
                    density="compact"
                    :disabled="!comp.id"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn @click="addSituationPro(comp)" color="success" :disabled="!vModelSituationPro">
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
import SearchEngine from '@/components/SearchEngine.vue'
import InformationBubble from '@/components/InformationBubble.vue'
import UsersConnectedInfo from '@/components/UsersConnectedInfo.vue'
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'
import CaractereEvaluable from './competence/CaractereEvaluable.vue'
import CompetencesList from '@/views/parcoursFormation/CompetencesList.vue'
import router from '@/router/router'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useFormationStore } from '@/stores/formationStore'
import { useParametreStore } from '@/stores/parametreStore'
import { useCaractereEvaluableStore } from '@/stores/caractereEvaluableStore'

import { ref, watch } from 'vue'

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
  famille_de_situations: [],
})

const competenceStore = useCompetenceStore()
const caractereEvaluableStore = useCaractereEvaluableStore()
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()
const parametreStore = useParametreStore()

const init = async () => {
  await competenceStore.fetchCompetences()
  await caractereEvaluableStore.fetchCaractereEvaluableTypes()
  competencesList.value = competenceStore.getCompetenceByVersion(versionId)
  version.value = await formationStore.fetchVersionById(versionId)
  const formation = await formationStore.fetchOneFormationFromId(version.value.formation_id)
  parametre.value = formation.composante.parametre
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

const addCritEx = () => {
  console.log('addCritEx')
}

const preAddCompetence = () => {
  const usedColors = competencesList.value
    .map((c) => c.color_hexadecimal)
    .filter((color) => typeof color === 'string' && color.length > 0)
  // Pick a random color not in usedColors
  const unusedColors = colors.filter((color) => !usedColors.includes(color))
  const availableColor = unusedColors.length
    ? unusedColors[Math.floor(Math.random() * unusedColors.length)]
    : colors[Math.floor(Math.random() * colors.length)]
  competencesList.value.push({
    libelle: '',
    color_hexadecimal: availableColor,
    critere_exigences: [],
    famille_de_situations: [],
  })
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
      console.log('create competence', formationStore.formationSelected.noms_des_niveaux)
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

const nextStep = () => {
  router.push({ name: 'apprentissagesCritiquesParcours' })
}

watch(
  () => competenceStore.competences,
  (newCompetences) => {
    console.log('watch competences', newCompetences)
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
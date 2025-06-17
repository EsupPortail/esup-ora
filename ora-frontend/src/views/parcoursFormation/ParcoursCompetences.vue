<template>
    <v-row>
        <ArianeParcoursPath />
    </v-row>
    <v-row>
        <v-col offset="11" cols="1">
            <UsersConnectedInfo />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="9">
            <h2>{{ parametre.semantique_competence || 'Compétence' }} - {{ parametre.semantique_critere || "Critères d'exigence" }}</h2>
        </v-col>
        <v-col cols="3">
            <v-btn @click="nextStep" style="background-color: #1E88E5; color: white;">Etape suivante</v-btn>
        </v-col>
    </v-row>
    <v-row v-if="version">
        <v-col>
            Référentiel RNCP
        </v-col>
        <v-col cols="4" class="pb-0">
            <v-text-field 
                @keyup.enter="updateVersion"
                v-model="version.rncp"
                label="Référentiel RNCP"
                variant="outlined"
                density="compact"
            ></v-text-field>
        </v-col>
        <v-col>
            <v-btn @click="updateVersion" color="success" :disabled="!version.rncp">Associer</v-btn>
            <v-btn class="ml-2" color="success" disabled>Importer</v-btn>
        </v-col>
        <v-col cols="4"></v-col>
    </v-row>
    <v-row class="pb-0" v-if="version">
        <v-col>
            Référentiel Rome4
        </v-col>
        <v-col cols="4">
            <v-text-field
                @keyup.enter="updateVersion"
                v-model="version.rome4"
                label="Référentiel Rome 4"
                variant="outlined"
                density="compact"
            ></v-text-field>
        </v-col>
        <v-col>
            <v-btn @click="updateVersion" color="success" :disabled="!version.rome4">Associer</v-btn>
        </v-col>
        <v-col cols="4"></v-col>
    </v-row>
    <v-expansion-panels>
    </v-expansion-panels>
    <v-row>
        <v-col cols="10">
            <v-card>
                <v-card-text>
                    <v-expansion-panels v-model="panels" multiple>
                        <v-expansion-panel v-for="(comp, index) in competencesList" :key="index" >
                               <v-expansion-panel-title>
                                    {{ parametre.semantique_competence || 'Compétence' }} {{ index+1 }} : <span v-if="!panels.includes(index)">{{ comp.libelle }}</span>
                               </v-expansion-panel-title>
                               <v-expansion-panel-text>
                                <v-row>
                                    <v-col cols="2">
                                        <v-btn
                                            icon="mdi-information"
                                            variant="text"
                                            @click="(toggleHelp === index) ? toggleHelp = null : toggleHelp = index"
                                        >
                                        </v-btn>
                                        <transition name="slide-right">
                                            <CaractereEvaluable 
                                                :toggleHelp="(toggleHelp === index)"
                                                :competence="comp"
                                                :caractereEvaluableTypes="caractereEvaluableStore.caractereEvaluableTypes"
                                                @refreshCompetence="init"
                                                @closeHelp="toggleHelp = null"
                                            />
                                        </transition>
                                    </v-col>
                                    <v-col cols="8">
                                        <v-row>
                                            <v-col class="pt-0 pb-0" cols="8">
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
                                            <v-col class="pt-0 pb-0" cols="8">
                                                <v-text-field
                                                    @blur="libChangeCompContext(comp)"
                                                    @keyup.enter="libChangeCompContext(comp)"
                                                    v-model="comp.competence_contextualisee"
                                                    :disabled="!comp.id"
                                                    label="Compétence RNCP"
                                                    variant="outlined"
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row v-for="critExig in comp.critere_exigences" style="margin-top: 0px; min-height: 30px;">
                                            <v-col cols="8" style="padding-top: 0px; padding-bottom: 0px;">
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
                                            <v-col cols="4" style="padding-top: 0px; padding-bottom: 0px;">
                                                    <v-icon size="small" @click="showInputCritEx = critExig.id">mdi-pencil</v-icon>
                                                    <v-icon color=error @click="deleteNCritEx(critExig)" size="small">mdi-trash-can</v-icon>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="8">
                                                <v-text-field 
                                                    @keyup.enter="addNCritExig(comp)"
                                                    v-model="comp.nCritExig"
                                                    :label="'Ajouter un ' + (parametre.semantique_critere || 'Critères d\'exigence')"
                                                    variant="outlined"
                                                    density="compact"
                                                    :disabled="!comp.id"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-btn @click="addNCritExig(comp)" color="success" :disabled="!comp.nCritExig">Ajouter</v-btn>
                                            </v-col>
                                        </v-row>
                                        
                                    </v-col>
                                    <v-col cols="2" class="d-flex justify-end">
                                        <v-icon size="small" disabled>mdi-content-duplicate</v-icon>
                                        <v-icon @click="deleteCompetence(comp)" color=error size="small">mdi-trash-can</v-icon>
                                    </v-col>
                                </v-row>
                               </v-expansion-panel-text>
                            </v-expansion-panel>
                    </v-expansion-panels>
                    
                </v-card-text>
            </v-card>
            <v-row class="mt-2">
                <v-col cols="9">
                    <v-btn @click="preAddCompetence" color="success">Ajouter {{ parametre.semantique_competence || "Compétence" }}</v-btn>
                </v-col>
                <v-col>
                    <v-btn @click="nextStep" style="background-color: #1E88E5; color: white;">Etape suivante</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <v-row>
        <span>Test autocomplete RNCP</span>
        <SearchEngine :itemsList="[]" label="Rechercher une fiche RNCP" />
    </v-row>

</template>

<script setup>
import SearchEngine from '@/components/SearchEngine.vue';
import InformationBubble from '@/components/InformationBubble.vue';
import UsersConnectedInfo from '@/components/UsersConnectedInfo.vue';
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue';
import CaractereEvaluable from './competence/CaractereEvaluable.vue';
import CompetencesList from '@/views/parcoursFormation/CompetencesList.vue';
import router from '@/router/router'
import { useCompetenceStore } from '@/stores/competenceStore';
import { useParcoursStore } from '@/stores/parcoursStore';
import { useFormationStore } from '@/stores/formationStore';
import { useParametreStore } from '@/stores/parametreStore';
import { useCaractereEvaluableStore } from '@/stores/caractereEvaluableStore';

import { ref, watch } from 'vue';

const competencesList = ref(null);
const versionId = router.currentRoute.value.params.idVersion
const version = ref(null)
const toggleHelp = ref(null)
const showInputCritEx = ref(0)
const nCritExig = ref('')
const panels = ref([])
const parametre = ref({})
const isAddCompetence = ref(false)
const helpList = ref([true, false, true, false, true])
const Ncomp = ref({
    libelle: '',
    critere_exigences: []
})

const competenceStore = useCompetenceStore()
const caractereEvaluableStore = useCaractereEvaluableStore()
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()
const parametreStore = useParametreStore()

const init = async () => {
    await competenceStore.fetchCompetences()
    await caractereEvaluableStore.fetchCaractereEvaluableTypes()
    competencesList.value = competenceStore.getCompetenceByVersion(versionId);
    version.value = await formationStore.fetchVersionById(versionId)
    const formation = await formationStore.fetchOneFormationFromId(version.value.formation_id)
    parametre.value = formation.composante.parametre
}
init()

const updateVersion = () => {
    parcoursStore.updateVersion(version.value)
}

const deleteNCritEx = (compC) => {
    competenceStore.deleteCritereExigence(compC)
    .then(() => {
        competencesList.value.forEach((comp) => {
            comp.critere_exigences = comp.critere_exigences.filter((compC2) => compC2.id !== compC.id)
        })
    })
    
}

const addCritEx = () => {
    console.log('addCritEx')
}

const preAddCompetence = () => {
    competencesList.value.push({
        libelle: '',
        critere_exigences: []
    })
}

const addNCritExig = (comp) => {
    if(comp.nCritExig !== '') {
        const critere_exigence = {
            libelle: comp.nCritExig,
            competence: {
                connect: {
                    id: comp.id
                }
            }
        }
        competenceStore.addCritereExigence(critere_exigence)
        .then((compC) => {
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
    if(comp.libelle !== '') {
        if(comp.id) {
            competenceStore.updateCompetence(comp)
        } else {
            comp.version_id = versionId
            competenceStore.createCompetence(comp, formationStore.formationSelected.nombre_de_niveaux)
            .then((nComp) => {
                comp.id = nComp.id
            })
        }
    }
    competenceStore.fetchCompetences()
}

const libChangeCompContext = (comp) => {
    if(comp.competence_contextualisee !== '') {
        if(comp.id) {
            competenceStore.updateCompetence(comp)
        } else {
            comp.version_id = versionId
            competenceStore.createCompetence(comp)
        }
    }
    competenceStore.fetchCompetences()
}

const deleteCompetence = (comp) => {
    competenceStore.deleteCompetence(comp)
    .then(() => {
        competencesList.value = competencesList.value.filter((comp2) => comp2.id !== comp.id)
    })
}

const nextStep = () => {
    router.push({name: 'apprentissagesCritiquesParcours'})
}

watch(() => competenceStore.competences, (newCompetences) => {
    console.log('watch competences', newCompetences);
    delete competencesList.value;
    competencesList.value = competenceStore.getCompetenceByVersion(versionId);
});
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

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter, .slide-right-leave-to {
  transform: translateX(120%);
}

.slide-right-enter-from {
  transform: translateX(120%);
}

.slide-right-leave-from {
  transform: translateX(0px);
}
</style>
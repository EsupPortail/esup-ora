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
    <InformationBubble>
      <p>
        Indiquez les éléments constitutifs pour votre version de formation, ajoutez des
        enseignements, proposez un type d'évalution et passez à la suite !
      </p>
    </InformationBubble>
  </v-row>
  <v-row>
    <v-col cols="8">
      <h1>{{ parametre.semantique_ec || "Éléments Constitutifs" }}</h1>
    </v-col>
    <v-col cols="4" justify="end">
      <v-btn @click="nextStep" color="primary">Etape suivante</v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
      <v-select
        v-model="periodeSelected"
        :items="periodesInSelectList"
        item-title="title"
        item-value="id"
        @update:model-value="selectPeriodes"
        variant="outlined"
        density="compact"
        label="Sélectionner une période"
      />
    </v-col>
  </v-row>
  <template v-if="periodeSelected !== null">
    <v-row>
      <v-col cols="12">
        <v-card class="">
          <v-card-text>
            <v-list>
              <v-list-item
                style="margin-top: 0px; margin-bottom: 0px; min-height: 28px; padding-inline: 0px"
                v-for="(competence, index) in competencesListOfSelectedVersion"
                :key="index"
              >
                {{ parametre.semantique_competence || 'Compétence' }} {{ index + 1 }} : {{ competence.competence_contextualisee || competence.libelle }} 
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <ECAddEnseignement v-if="periodeLeft"
          :parcours="parcoursSelected"
          :version="versionSelected"
          :periode="periodeLeft"
          @refresh-enseignements="refreshEnseignements"
        />
      </v-col>
      <v-col cols="6">
        <ECAddEnseignement v-if="periodeRight"
          :parcours="parcoursSelected"
          :version="versionSelected"
          :periode="periodeRight"
          @refresh-enseignements="refreshEnseignements"
        />
      </v-col>
    </v-row>
    <v-row v-if="competencesListOfSelectedVersion.length > 0">
      <v-col>
        <TableauCompAppEns v-if="periodeLeft && periodeRight"
        :version="versionSelected"
        :parcours="parcoursSelected"
        :key="childKeyForRefresh"
        :periode1="periodeLeft"
        :periode2="periodeRight"
        :refreshComponent="refreshAsked"
        />
      </v-col>
    </v-row>
      
  </template>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import router from '@/router/router'

import UsersConnectedInfo from '@/components/UsersConnectedInfo.vue';

import TableauCompAppEns from '@/views/parcoursFormation/elementConstitutif/TableauCompAppEns.vue'
import ECAddEnseignement from '@/views/parcoursFormation/elementConstitutif/ECAddEnseignement.vue'
import InformationBubble from '@/components/InformationBubble.vue'
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'

import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useFormationStore } from '@/stores/formationStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useParametreStore } from '@/stores/parametreStore';

const competenceStore = useCompetenceStore()
const competencesListOfSelectedVersion = ref([])
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()
const parcoursSelected = parcoursStore.parcoursSelected
const versionSelected = parcoursStore.versionSelected
const periodeStore = usePeriodeStore()
const parametreStore = useParametreStore()

const periodes = ref([])
const periodesInSelectList = ref([])
const periodeLeft = ref(null)
const periodeRight = ref(null)
const periodeSelected = ref(null)
const refreshAsked = ref(false);
const parametre = ref({})
const childKeyForRefresh = ref(0);

const initParam = async () => {
    const v = parcoursStore.versionSelected;
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
    let title = (periodes.value[i+1]) ? periodes.value[i].libelle + ' - ' + periodes.value[i + 1].libelle : periodes.value[i].libelle
    let periodesObjects = (periodes.value[i+1]) ? [periodes.value[i], periodes.value[i + 1]] : [periodes.value[i]]
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

const fetchCompetence = () => {
  competenceStore.fetchCompetenceForSelectedVersion().then((data) => {
    competencesListOfSelectedVersion.value = data
  })
}

const init = async () => {
  await getDureeEnUnit()
  await fetchCompetence()
  parametre.value = formationStore.formationSelected.composante.parametre
}
init()

const nextStep = () => {
  router.push({ name: 'blocDeCompetences' })
}

const refreshEnseignements = async () => {
    refreshAsked.value = true;
    await nextTick();
    refreshAsked.value = false;    
}

const selectPeriodes = () => {
  periodeLeft.value = periodesInSelectList.value[periodeSelected.value].periodesObjects[0]
  periodeRight.value = periodesInSelectList.value[periodeSelected.value].periodesObjects[1]
  childKeyForRefresh.value + childKeyForRefresh.value++;
  refreshAsked.value = true;
  setTimeout(() => {
    refreshAsked.value = false;
  }, 3000);
}


// watch(() => competenceStore.competences, (newCompetences) => {
//     console.log('watch competences from apprentissages', newCompetences);
//     competencesListOfSelectedVersion.value = newCompetences;
// });
</script>

<style scoped>

</style>
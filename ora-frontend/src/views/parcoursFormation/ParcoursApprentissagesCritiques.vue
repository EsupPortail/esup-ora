<template>
  <v-row>
    <ArianeParcoursPath />
  </v-row>
  <v-row>
        <v-col offset="11" cols="1">
            <UsersConnectedInfo />
        </v-col>
    </v-row>

  <v-row :key="render">
    <v-col>
      <h2>{{ parcoursStore.parcoursSelected.libelle }}</h2>
    </v-col>
    <v-col offset="8">
      <v-btn @click="nextStep" color="primary">Etape suivante</v-btn>
    </v-col>
  </v-row>
  <v-row>
    <h3 style="margin-left: 16px">
      Sélectionner une {{ parametre.semantique_competence || 'Compétence' }} pour lui attribuer des
      {{ parametre.semantique_apprentissage || 'Apprentissages' }}
    </h3>
  </v-row>
  <v-row>
    <v-col cols="3">
      <v-select
        :label="parametre.semantique_competence || 'Compétence'"
        @update:modelValue="rerender"
        v-model="competenceStore.competenceSelected"
        :items="competenceStore.competences"
        density="compact"
        variant="outlined"
        :item-title="(item) => item.competence_contextualisee || item.libelle"
        item-value="id"
        return-object
      >
      </v-select>
    </v-col>
    <v-col v-if="competenceStore.competenceSelected">
      <h3>{{ competenceStore.competenceSelected.competence_contextualisee }}</h3>
      <v-list lines="one" title="">
        <v-list-item
          style="padding-top: 0px; padding-bottom: 0px; min-height: 20px"
          v-for="ce in competenceStore.competenceSelected.critere_exigences"
        >
          {{ ce.libelle }}
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
  <v-divider style="margin-top: 12px; margin-bottom: 22px" />
    <v-row v-for="arrayOf3Max in niveauRef">
      <v-col v-for="niveau in arrayOf3Max" cols="4">
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
    <ContexteEvaluation v-if="competenceStore.competenceSelected" :competence="competenceStore.competenceSelected" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import UsersConnectedInfo from '@/components/UsersConnectedInfo.vue';

import InformationBubble from '@/components/InformationBubble.vue';
import ContexteEvaluation from './apprentissages/ContexteEvaluation.vue';
import { useFormationStore } from '@/stores/formationStore';
import { useParcoursStore } from '@/stores/parcoursStore';
import { useApprentissageStore } from '@/stores/apprentissageStore';
import { useCompetenceStore } from '@/stores/competenceStore';
import NiveauApprentissage from '@/views/parcoursFormation/apprentissages/NiveauApprentissage.vue';
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue';
import router from '@/router/router'


const formationStore = useFormationStore();
const parcoursStore = useParcoursStore();
const apprentissageStore = useApprentissageStore()
const competenceStore = useCompetenceStore();

const parametre = ref({})
const heightEntete = ref(0);

const niveauRef = ref(null);

const init = async () => {
    await competenceStore.fetchCompetenceForSelectedVersion()
    parametre.value = formationStore.formationSelected.composante.parametre
    competenceStore.competenceSelected = competenceStore.competences[0]
    getNiveauSliced();
  }
init()

const fetchCompetence = async () => {
    await competenceStore.fetchCompetenceForSelectedVersion()
}

const render = ref(0)

const rerender = () => { 
  render.value = render.value + 1
}

const getNiveauSliced = () => {
    let sliced = []
    if( competenceStore.competenceSelected?.niveau ) {
        const tmp = competenceStore.competenceSelected?.niveau.sort((a, b) => a.id - b.id)
        for (let i = 0; i < tmp.length; i+=3) {
            sliced.push(tmp.slice(i, i+3))
        }
    }
    niveauRef.value = sliced;
    console.log(niveauRef.value)
}

const getNLines = computed(() => {
    let highestOrder = 1
    if (!competenceStore.competenceSelected?.niveau) {
        return 0
    }
    competenceStore.competenceSelected?.niveau.forEach((n) => {
        n.apprentissage_critique?.forEach((a) => {
            highestOrder = (a.ordre > highestOrder) ? a.ordre : highestOrder
        })
    })
    return highestOrder
})

const setHeight = (newVal) => {
    if( newVal > heightEntete.value ) {
        heightEntete.value = newVal;
    }
    // Force the update to children NiveauApprentissage components
    heightEntete.value = heightEntete.value;
}

const nextStep = () => {
    router.push({name: 'elementsConstitutifsParcours'})
}


const nLines = ref(getNLines.value);

const handleNLines = () => {
  setNLines();
}


const setNLines = async () => {
  await fetchCompetence();
  let highestRank = 1;
  const arraysSliced = niveauRef.value;
  arraysSliced.forEach((array) => {
    array.forEach((array) => {
      if (array.apprentissage_critique) {
          console.log(array.apprentissage_critique.length)
          console.log(array.apprentissage_critique)
          if (array.apprentissage_critique.length > highestRank) {
            highestRank = array.apprentissage_critique.length;
          }
      }
    });
  });
  console.log('highestRank', highestRank)
  nLines.value = highestRank;
};

watch(() => competenceStore.competences, (newCompetences) => {
    console.log('watch competences from apprentissages', newCompetences);
    getNiveauSliced();
});

watch(() => competenceStore.competenceSelected, (newCompetence) => {
  console.log('watch competenceSelected', newCompetence);
  getNiveauSliced();
  nLines.value = getNLines.value;
});

</script>

<style scoped>
.formation-creation {
    padding: 20px;
}

.formation-creation h1 {
    color: #333;
}
</style>
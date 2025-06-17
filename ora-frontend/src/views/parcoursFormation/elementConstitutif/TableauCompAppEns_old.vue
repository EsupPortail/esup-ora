<template>
  <div style="margin-top: 180px">
    <v-row style="">
      <v-col offset="3" cols="3" style="text-align: center">
        <span>{{ props.periode1.libelle }}</span>
      </v-col>
      <v-col cols="3">
        <span>{{ props.periode2.libelle }}</span>
      </v-col>
    </v-row>
    <v-row style="margin-top: 160px">
      <v-col offset="3" cols="9" style="text-align: left">
        <v-row style="margin: 0; padding:0; text-align: left;">
          <template v-for="(enseignement, indexE) in enseignementsListPeriode1" :key="indexE">
              <div class="containerVertical">
                <div>{{ enseignement.libelle }}</div>
              </div>
          <div class="separatorYear" v-if="indexE === enseignementsListPeriode1.length - 1">
            <div>
              <v-divider vertical class="rotatedDivider" :thickness="6" color="rgba(9, 29, 85, 0.957)" opacity="1" />
            </div>
          </div>
          </template>

          <div v-for="enseignement in enseignementsListPeriode2">
            <div class="containerVertical">
              <span>{{ enseignement.libelle }}</span>
            </div>
          </div>
        </v-row>
      </v-col>
    </v-row>
    <template v-for="(competence, indexC) in competencesList" :key="indexC">
      <template v-for="(niveau, indexN) in competence.niveau" :key="indexN">
        <template v-for="(ac, indexAC) in niveau.apprentissage_critique" :key="indexAC">
          <v-row v-if="indexN === 0 && indexAC === 0">
            <v-divider :thickness="6" />
            <div style="color: rgba(9, 29, 85, 0.957); font-weight: bold">
              <span>Compétence {{ indexC + 1 }} - {{ competence.competence_contextualisee || competence.libelle }}</span>
            </div>
          </v-row>
          <v-row
            v-if="indexAC === 0 && niveau.apprentissage_critique.length !== 0"
            style="margin-bottom: 10px"
          >
            <div>
              <span>{{ niveau.libelle }}</span>
              <span v-if="niveau.description !== ''"> : {{ niveau.description }}</span>
            </div>
          </v-row>
          <v-row style="margin-top: 0">
            <v-col
              cols="3"
              style="
                border-left: 20px solid rgba(9, 29, 85, 0.957);
                padding-top: 0;
                padding-bottom: 0;
              "
            >
              <div>
                <span> AC {{ indexAC + 1 }} {{ ac.libelle }}</span>
              </div>
            </v-col>
            <v-col
              cols="9"
              style="padding-left: 0; padding-right: 0; padding-top: 0; padding-bottom: 0"
            >
              <template v-for="(enseignement, indexE) in enseignementsListPeriode1" :key="indexE">
                <div style="width: 30px !important; max-height: 28px; display: inline-block; margin-right: 50px;">
                  <v-checkbox
                    style="width: 30px !important"
                    density="compact"
                    :model-value="isChecked(enseignement, ac)"
                    @click="handleCheck(ac, enseignement)"
                  />
                </div>
                <v-divider vertical :thickness="6"  v-if="indexE === enseignementsListPeriode1.length - 1" style="height: 100%; position: relative; margin-right: 20px;" color="rgba(9, 29, 85, 0.957)" opacity="1" />
              </template>
              <template v-for="enseignement in enseignementsListPeriode2">
                <div style="width: 30px !important; max-height: 28px; display: inline-block; margin-right: 50px;">
                  <v-checkbox
                    style="width: 30px !important"
                    density="compact"
                    :model-value="isChecked(enseignement, ac)"
                    @click="handleCheck(ac, enseignement)"
                  />
                </div>
              </template>
            </v-col>
          </v-row>
        </template>
      </template>
    </template>
  </div>
</template>
<script setup>
import { defineProps, ref, watch } from 'vue'

import { useCompetenceStore } from '@/stores/competenceStore'
import { useEnseignementStore } from '@/stores/enseignementStore'

const props = defineProps({
  version: Object,
  parcours: Object,
  periode1: Object,
  periode2: Object,
  refreshComponent: Boolean
})

const competencesList = ref([])

watch(
  () => props.refreshComponent,
  (newVal) => {
    if (newVal === true) {
      fetchEnseignementsOfTwoPeriodes()
    }
  }
)

const enseignementsStore = useEnseignementStore()
const enseignementsListPeriode1 = ref([])
const enseignementsListPeriode2 = ref([])
const fetchEnseignements = async (periode, tab) => {
  await enseignementsStore.fetchEnseignementsOfVersion(periode.id).then((d) => {
    tab.value = d.sort((a, b) => a.id - b.id)
  })
}
const fetchEnseignementsOfTwoPeriodes = async () => {
  await fetchEnseignements(props.periode1, enseignementsListPeriode1)
  await fetchEnseignements(props.periode2, enseignementsListPeriode2)
}
fetchEnseignementsOfTwoPeriodes()

const isChecked = (enseignement, ac) => {
  if (enseignement.apprentissages_critiques.some(apprentissage => apprentissage.id === ac.id)) {
    return true
  }
  return false;
}

const competenceStore = useCompetenceStore()
competenceStore.fetchCompetences().then(async () => {
  await competenceStore.fetchCompetenceForSelectedVersion(props.version.id).then((d) => {
    competencesList.value = d
  })
})

const handleCheck = async (ac, ens) => {
  await enseignementsStore.connectEnseignementToApprentissageCritique(ens, ac);
  fetchEnseignementsOfTwoPeriodes();
}
</script>
<style scoped>
.separatorYear {
  padding: 0;
  position: relative;
  width: 30px;
}

.rotatedDivider {
  height: 100px;
  /* margin-left: 20px; */
  transform: rotate(20deg);
}
.containerVertical {
  padding: 0;
  transform: rotate(-66deg);
  position: relative;
  height: 50px;
  bottom: -30px;
}
.columnVertical {
  writing-mode: vertical-lr;
  width: 30px;
}

.separatorVertical {
  content: '';
  position: relative;
  height: 100px;
  width: 100px;
  background-color: blue;
}
</style>
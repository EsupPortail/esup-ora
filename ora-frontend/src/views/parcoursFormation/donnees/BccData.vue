<template>
  <template v-for="(competence, index) in competences">
    <v-row>
      <v-col cols="2">
        <span>Compétence {{ index + 1 }} : {{ competence.competence.libelle }}</span>
      </v-col>
      <v-col offset="2" cols="4">
        <ProgressLinearData :current="competence.competence.cumulH" :max="180" />
      </v-col>
      <v-col cols="4">
        <ProgressLinearData
          :current="competence.competence.cumulC"
          color="purple-darken-2"
          bg-color="purple-lighten-1"
          :max="180"
        />
      </v-col>
    </v-row>
    <v-row v-for="(ac, indexAC) in competence.competence.acs">
      <v-col cols="4">
        <span>AC {{ indexAC + 1 }} : {{ ac.libelle }}</span>
      </v-col>
      <v-col offset="1" cols="3">
        <ProgressLinearData :current="ac.cumulH" :max="180" />
      </v-col>
      <v-col offset="1" cols="3">
        <ProgressLinearData
          :current="ac.cumulC"
          color="purple-darken-2"
          bg-color="purple-lighten-1"
          :max="180"
        />
      </v-col>
    </v-row>
  </template>
  <v-row v-for="bcc in bccsList">
    <v-col cols="4">
      <span>Bloc de connaissances et de compétences {{ bcc.id }} : {{ bcc.libelle }}</span>
    </v-col>

    <v-col offset="1" cols="3">
      <ProgressLinearData :current="bcc.credits" :max="180" />
    </v-col>

    <v-col offset="1" cols="3">
      <ProgressLinearData
        :current="bcc.credits"
        color="purple-darken-2"
        bg-color="purple-lighten-1"
        :max="180"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'

import { useCompetenceStore } from '@/stores/competenceStore'
import { useBccStore } from '@/stores/bccStore'

import ProgressLinearData from '@/components/ProgressLinearData.vue'

const props = defineProps({
  data: Object
})

const getCompetence = (idComp) => {
  return competenceStore.getOneCompetence(idComp)
}

const data = ref([])
const bccStore = useBccStore()
const competenceStore = useCompetenceStore()
const competences = ref([])
const initData = async () => {
  let result = []
  await competenceStore.fetchCompetenceForSelectedVersion(props.data.version_id).then(async (d) => {
    let competencesTmp = d
    let bccsTmp = []
    await bccStore.getBCCByVersionId(props.data.version_id).then((b) => {
      bccsTmp = b
    })
    competencesTmp.forEach((c) => {
      let ACofComp = []
      let cumulH = 0
      let cumulC = 0
      bccsTmp.forEach((b) => {
        if (b.competence_id === c.id) {
          b.element_constitutif.forEach((ec) => {
            let cumulCOfAC = 0
            let cumulHOfAC = 0
            cumulHOfAC =
              ec.volume_horaire_cm +
              ec.volume_horaire_td +
              ec.volume_horaire_tp +
              ec.volume_horaire_pt
            cumulCOfAC = b.credits
            b.apprentissage_critiques.forEach((ac) => {
              cumulH +=
                ec.volume_horaire_cm +
                ec.volume_horaire_td +
                ec.volume_horaire_tp +
                ec.volume_horaire_pt
              cumulC += b.credits
              ACofComp.push({ ...ac, cumulC: cumulCOfAC, cumulH: cumulHOfAC })
            })
          })
        }
      })
      result.push({
        competence: {
          ...c,
          cumulH: cumulH,
          cumulC: cumulC,
          acs: ACofComp
        }
      })
    })
    competences.value = result
  })
}

initData()

const bccsList = ref([])
const initAll = async () => {
  await bccStore.getBCCByVersionId(props.data.version_id).then((bccs) => {
    bccsList.value = bccs
  })
}
initAll()
</script>

<style scoped>
</style>
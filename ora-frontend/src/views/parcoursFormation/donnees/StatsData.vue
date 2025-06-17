<template>
  <v-card v-if="tabs.length !== 0">
    <v-card-title>
      <v-tabs v-model="tabSelected" bg-color="deep-purple-darken-4" center-active>
        <v-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </v-card-title>
    <v-card-text v-if="tabs[tabSelected]">
      <component :is="tabs[tabSelected]?.component" :data="tabs[tabSelected]?.props" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, shallowRef, watch, computed } from 'vue'

import CompetenceData from './CompetenceData.vue'
import BccData from './BccData.vue'

import { useParcoursStore } from '@/stores/parcoursStore'
import EnseignementsData from './EnseignementsData.vue'
import SaeData from './SaeData.vue'
import ThemeData from './ThemeData.vue'
import PlanningData from './PlanningData.vue'

const props = defineProps({
  formationId: Number,
  versionId: Number,
  globalData: Object
})

const parcoursStore = useParcoursStore()
const versionSelected = parcoursStore.versionSelected
const data = ref(null)
const tabSelected = ref(0)
const refGData = ref(props.globalData)
const tabs = shallowRef([])

const initData = async () => {
  tabs.value = [
    {
      title: 'Données par compétence',
      component: CompetenceData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    },
    {
      title: 'Données par BCC',
      component: BccData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    },
    {
      title: 'Données par enseignements',
      component: EnseignementsData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    },
    {
      title: 'Données par SAÉ',
      component: SaeData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    },
    {
      title: 'Données par thème',
      component: ThemeData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    },
    {
      title: 'Données par famille de situation',
      component: CompetenceData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    },
    {
      title: 'Planning',
      component: PlanningData,
      props: { globalData: refGData.value.competences, version_id: props.versionId }
    }
  ]
}

initData()
watch(
  () => tabs.value,
  (newTabs) => {
    if (newTabs.length > 0 && tabSelected.value >= newTabs.length) {
      tabSelected.value = 0
    }
  }
)
watch(
  () => props.globalData,
  (newGlobalData) => {
    refGData.value = newGlobalData
    initData()
    console.log('stats changed ')
    console.log(newGlobalData)
  },
  { deep: true }
)

// },
// {
//   title: 'Données par enseignements',
//   component: BccData,
//   props: { formationId: props.formationId, versionId: props.versionId }
// },
// {
//   title: 'Données par SAE',
//   component: BccData,
//   props: { formationId: props.formationId, versionId: props.versionId }
// },
// {
//   title: 'Données par thème',
//   component: BccData,
//   props: { formationId: props.formationId, versionId: props.versionId }
// },
// {
//   title: 'Données par famille de situation',
//   component: BccData,
//   props: { formationId: props.formationId, versionId: props.versionId }
// },
// {
//   title: 'Planning',
//   component: BccData,
//   props: { formationId: props.formationId, versionId: props.versionId }
// }
</script>

<style scoped>
</style>
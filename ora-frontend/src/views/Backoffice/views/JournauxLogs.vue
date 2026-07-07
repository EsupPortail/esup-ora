<template>
  <v-container>
    <h2>Indicateurs, visualisation et tableaux de bord</h2>
    <v-expansion-panels v-model="panels" multiple style="margin-top: 20px;">
      <v-expansion-panel v-for="(item, index) in items" :key="item.title">
        <v-expansion-panel-title>
          {{ item.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <component :is="item.component" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LogsListFiltered from '@/views/Backoffice/views/journaux-logs/LogsListFiltered.vue'

const route = useRoute()


const items = [
  { title: 'Liste des journaux d\'événements', component: LogsListFiltered },
]
const panels = ref([])

watch(
    () => route.query.sectionToOpen,
    (sectionToOpen) => {
        const index = items.findIndex(item => item.title === sectionToOpen)
        if (index !== -1) {
            panels.value = [index]
        }
    },
    { immediate: true }
)


</script>

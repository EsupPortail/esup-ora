<template>
    <template v-if="gData.length !== 0">
      <v-row v-for="(c, index) in gData" :key="index">
        <v-expansion-panels multiple>
          <!-- Expansion Panel for each skill (compétence) -->
          <v-expansion-panel>
            <v-expansion-panel-title>
              <h4>Compétence : {{ c.libelle }}</h4>
            </v-expansion-panel-title>
  
            <v-expansion-panel-text>
              <!-- Display BCCs if there are any -->
              <template v-if="c.bccs.length !== 0">
                <v-row v-for="(bcc, bccIndex) in c.bccs" :key="bccIndex">
                  <v-col offset="4" cols="4">
                    <span>BCC : {{ bcc.lib }}</span>
                  </v-col>
  
                  <v-col offset="2" cols="4">
                    <ProgressLinearData :current="bcc.cumulH" :max="180" />
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </template>
  </template>
  
  
  <script setup>
  import { ref, watchEffect, watch } from 'vue'
  import ProgressLinearData from '@/components/ProgressLinearData.vue'
  
  import { useCompetenceStore } from '@/stores/competenceStore'
  import { useBccStore } from '@/stores/bccStore'
  const props = defineProps({
    data: Object
  })
  
  const refGData = ref(null)
  
  const bccStore = useBccStore()
  const competenceStore = useCompetenceStore()
  const competences = ref([])
  const gData = ref([])
  
  watch(
    () => props.data,
    (newGlobalData) => {
    },
    { deep: true }
  )
  </script>
  
  <style scoped>
  </style>
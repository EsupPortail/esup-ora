<template>
  <v-container>
    <h2>Configuration</h2>
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

import CardEtablissement from '@/views/Backoffice/views/configuration/CardEtablissement.vue'
import CardComposantes from '@/views/Backoffice/views/configuration/CardComposantes.vue'
import CardTypeDiplome from '@/views/Backoffice/views/configuration/CardTypeDiplome.vue'
import CardTags from '@/views/Backoffice/views/configuration/CardTags.vue'
import CardEquivalentTD from '@/views/Backoffice/views/configuration/CardEquivalentTD.vue'
import CardParametreItems from '@/views/Backoffice/views/configuration/CardParametreItems.vue'

const route = useRoute()


const items = [
  { title: 'Types de diplômes', component: CardTypeDiplome },
  { title: 'Tags', component: CardTags },
  { title: 'Paramètres', component: CardParametreItems },
  { title: 'Établissements', component: CardEtablissement },
  { title: 'Composantes', component: CardComposantes },
  { title: 'Coût équivalent TD', component: CardEquivalentTD }
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

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

import UtilisateursList from '@/views/Backoffice/views/users-access/UtilisateursList.vue'
import ComposanteAttachment from '@/views/Backoffice/views/users-access/ComposanteAttachment.vue'
import FormationAttachment from '@/views/Backoffice/views/users-access/FormationAttachment.vue'

const route = useRoute()


const items = [
  { title: 'Gestion des utilisateurs', component: UtilisateursList },
  { title: 'Rattachement utilisateurs - composantes', component: ComposanteAttachment },
  { title: 'Association utilisateurs - formations', component: FormationAttachment },
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

<template>
  <v-container>
    <h2>Configuration</h2>
    <v-expansion-panels v-model="panels" multiple style="margin-top: 20px">
      <v-expansion-panel v-for="(item, index) in items" :key="item.title">
        <template v-if="canSeeAdminItems">
          <template
            v-if="
              item.title === 'Rattachement utilisateurs - composantes' ||
              item.title === 'Gestion des utilisateurs'
            "
          >
            <v-expansion-panel-title>
              {{ item.title }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <component :is="item.component" />
            </v-expansion-panel-text>
          </template>
        </template>

        <template v-if="isNotEnseignant && item.title === 'Association utilisateurs - formations'">
          <v-expansion-panel-title>
            {{ item.title }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <component :is="item.component" />
          </v-expansion-panel-text>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useConnectionStore } from '@/stores/connectionStore'

import UtilisateursList from '@/views/Backoffice/views/users-access/UtilisateursList.vue'
import ComposanteAttachment from '@/views/Backoffice/views/users-access/ComposanteAttachment.vue'
import FormationAttachment from '@/views/Backoffice/views/users-access/FormationAttachment.vue'

const route = useRoute()
const connectionStore = useConnectionStore()

const items = [
  { title: 'Gestion des utilisateurs', component: UtilisateursList },
  { title: 'Rattachement utilisateurs - composantes', component: ComposanteAttachment },
  { title: 'Association utilisateurs - formations', component: FormationAttachment }
]

const canSeeAdminItems = computed(() => {
  const role = connectionStore.selectedRole.name
  return [
    'administrateur_fonctionnel',
    'administrateur_technique',
    'directeur_composante',
    'observateur'
  ].includes(role)
})

const isNotEnseignant = computed(() => {
  return connectionStore.selectedRole.name !== 'enseignant'
})

const panels = ref([])

watch(
  () => route.query.sectionToOpen,
  (sectionToOpen) => {
    const index = items.findIndex((item) => item.title === sectionToOpen)
    if (index !== -1) {
      panels.value = [index]
    }
  },
  { immediate: true }
)
</script>

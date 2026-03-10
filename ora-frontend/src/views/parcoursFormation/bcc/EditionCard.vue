<template>
  <v-container style="border-radius: 10px; border: 1px solid #707070; padding-top: 0px;" class="elevation-4">
    <EnseignementEdition :data="data" v-if="data.type === 'enseignement'" @refreshTreeView="refreshTreeView" />
    <AMSEdition :data="data" v-else-if="data.type === 'AMS'" @refreshTreeView="refreshTreeView" />
    <PortfoliopEdition :data="data" v-else-if="data.type === 'Portfolio'" @refreshTreeView="$emit('refreshTreeView')"  />
    <StageEdition :data="data" v-else="data.type === 'Stage'" @refreshTreeView="refreshTreeView" />
  </v-container>
</template>

<script setup>
import { ref, watch, defineEmits, nextTick } from 'vue'

import EnseignementEdition from '@/views/parcoursFormation/bcc/editionType/EnseignementEdition.vue'
import AMSEdition from '@/views/parcoursFormation/bcc/editionType/AMSEdition.vue'
import PortfoliopEdition from '@/views/parcoursFormation/bcc/editionType/PortfolioEdition.vue'
import StageEdition from '@/views/parcoursFormation/bcc/editionType/StageEdition.vue'

const emit = defineEmits(['refreshTreeView'])

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  refreshTreeView: {
    type: Function,
    required: false
  },
  refKeyRefreshTreeView: {
    type: Number,
    required: false
  }
})

const refreshTreeView = async () => {
  await nextTick()
  emit('refreshTreeView')
}
const data = ref(props.data)

watch(
  () => props.data,
  (newVal) => {
    data.value = newVal
  },
  { deep: true }
)
</script>

<style scoped>
.edition-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  background: #fafbfc;
  max-width: 400px;
  margin: 32px auto;
}
</style>
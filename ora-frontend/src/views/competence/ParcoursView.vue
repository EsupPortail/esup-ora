<template>
  <v-container>
    <InformationBubble>
      <span>Ceci est une bulle d'informations</span>
    </InformationBubble>
    <SimpleTable style="margin-top: 6px;" :tableData="formations" :striped="true" titleTable="Liste des parcours" />
  </v-container>
</template>

<script setup>
import SimpleTable from '@/components/SimpleTable.vue';
import InformationBubble from '@/components/InformationBubble.vue';

import {formations} from '@/mocks/formations';

</script>

<style scoped>
</style>
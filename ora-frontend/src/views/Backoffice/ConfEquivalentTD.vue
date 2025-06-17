<template>
    <PageInDev />
    <v-container>
    <v-card class="pa-5" elevation="3">
      <v-card-title>Convertisseur CM ➜ TD ➜ TP</v-card-title>
      <v-card-text>
        <v-form>
          <!-- Heures de CM -->
          <v-text-field
            label="Heures de CM"
            v-model.number="cmHours"
            type="number"
            min="0"
            @input="convertCmToTd"
          ></v-text-field>

          <!-- Heures de TD (initialement égales à CM) -->
          <v-text-field
            label="Heures de TD"
            v-model.number="tdHours"
            type="number"
            min="0"
            readonly
          ></v-text-field>

          <!-- Heures de TP -->
          <v-text-field
            label="Heures de TP"
            v-model.number="tpHours"
            type="number"
            min="0"
            readonly
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import PageInDev from '@/components/PageInDev.vue'
const cmHours = ref(0)
const tdHours = ref(0)
const tpHours = ref(0)
const convertCmToTd = () => {
  tdHours.value = cmHours.value
  convertTdToTp()
}

const convertTdToTp = () => {
  tpHours.value = tdHours.value * 1.2
}
</script>

<style scoped>
.v-container {
  max-width: 400px;
  margin: auto;
}
</style>

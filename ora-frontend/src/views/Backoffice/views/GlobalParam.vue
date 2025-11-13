<template>
  <v-container>
    <v-expansion-panels v-model="panels" multiple style="margin-top: 20px">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row>
            <v-col>
              <h2>Paramètres globaux</h2>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-divider :thickness="4" color="#000000" class="my-4" style="border-style: dotted" />
          <v-row>
            <v-col cols="4">Nom de l'application</v-col>
            <v-col cols="4">ESUP ORA</v-col>
          </v-row>
          <v-row>
            <v-col cols="4">Version de l'application</v-col>
            <v-col cols="4">Core Version-{{ versionRef.APPLICATION_VERSION }}</v-col>
          </v-row>
          <v-divider :thickness="4" color="#000000" class="my-4" style="border-style: dotted" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const panels = ref([0])
const versionRef = ref({})

const initVersion = () => {
  const versions = {}
  for (const line of __APP_VERSION__.split('\n')) {
    const [key, value] = line.split(':').map((s) => s.trim())
    if (['APPLICATION_VERSION', 'SERVICE_VERSION', 'FRONTAL_VERSION'].includes(key)) {
      versions[key] = value.replace(/['"]+/g, '')
    }
  }
  versionRef.value = versions
}

initVersion()
</script>
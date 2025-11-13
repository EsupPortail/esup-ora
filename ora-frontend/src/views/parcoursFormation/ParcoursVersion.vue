<template>
  <v-row>
    <v-col cols="12">
      <v-card class="formation-creation">
        <v-form>
          <v-row>
            <v-col class="d-flex align-center">
              <span>Réalisation d'applications : conception, développement, validation</span>
            </v-col>
          </v-row>
          <v-list style="margin-top: 20px">
            <v-list-item v-for="(version, index) in versionsList" :key="index">
              <v-list-item-content>
                <span>Version : </span>
                <template v-if="libChangeVersion != version.id">
                <span>{{ version.libelle }}</span>
                    <v-icon size="small" @click="libChangeVersion = version.id"
                        >mdi-pencil</v-icon
                      >
                </template>
                <template v-else>
                  <v-text-field
                    @keyup.enter="changeLibelle(version)"
                    v-model="version.libelle"
                    label="Libelle"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
                <v-btn
                  @click="navigateTo(paths.parcoursVersion)"
                  style="background-color: #091d55f4; margin-left: 10px; color: white"
                  >Accéder à cette version</v-btn
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-text-field
            style="margin-top: 20px"
            v-model="newVersion"
            label="Renseignez le nom de votre nouvelle version"
          ></v-text-field>
          <v-row>
            <v-col cols="12" style="text-align: right">
              <v-btn @click="addVersion" style="background-color: green; color: white"
                >Créer une nouvelle version</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'

import { useFormationStore } from '@/stores/formationStore'

import { navigateTo } from '@/router/router'
import { paths } from '@/router/routesEnumeration'

const formationStore = useFormationStore()

const versionsList = ref([])
const newVersion = ref('')
const libChangeVersion = ref(false)

const changeLibelle = async (version) => {
  await formationStore.updateVersion(version)
  libChangeVersion.value = false
}

const addVersion = () => {
  if (newVersion.value) {
    versionsList.value.push(newVersion.value)
    newVersion.value = ''
  }
}

const createFormation = () => {
  // Logique pour créer une formation
  console.log(
    'Formation créée:',
    formationName.value,
    formationType.value,
    formationDescription.value,
    parcoursList.value
  )
}
</script>

<style scoped>
.formation-creation {
  padding: 20px;
}

.formation-creation h1 {
  color: #333;
}
</style>
<template>
  <v-row style="margin-top: 12px; margin-bottom: 12px">
    <h2>Les versions de la formation : {{ formation?.libelle }}</h2>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card class="formation-creation">
        <v-row>
          <v-col class="d-flex align-center">
            <span></span>
          </v-col>
        </v-row>
        <v-list style="margin-top: 20px">
          <v-list-item v-for="(version, index) in versionList" :key="index">
            <v-row>
            <v-col cols="2" style="padding: 20px;">
              <span>Version : </span>
            </v-col>
            <v-col cols="4" style="padding: 20px;">
              <template v-if="libChangeVersion != version.id">
                <span>{{ version.libelle }}</span>
                    <v-icon size="small" @click="libChangeVersion = version.id" style="padding-left: 16px;"
                        >mdi-pencil</v-icon
                      >
                </template>
                <template v-else>
                  <v-row style="margin: 0; padding: 0">
                    <v-col cols="10" style="margin: 0; padding: 0">
                      <v-text-field
                        @keyup.enter="changeLibelle(version)"
                        v-model="version.libelle"
                        label="Libelle"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" style="margin: 0; padding: 0; padding-left: 16px;">
                      <v-btn icon="mdi-check" size="small" @click="changeLibelle(version)"></v-btn>
                    </v-col>
                  </v-row>
                </template>
            </v-col>
            <v-col cols="4" style="padding: 20px;">
              <v-btn
                @click="selectVersion(version)"
                style="background-color: #1E88E5; margin-left: 10px; color: white"
                >Accéder à cette version</v-btn
              >
            </v-col>
    </v-row>
    <v-divider style="margin-top: 12px; margin-bottom: 12px;"/>
            </v-list-item>
        </v-list>
        <v-row style="margin-top: 16px">
          <v-col cols="11">
            <v-text-field
              @keyup.enter="addVersion"
              variant="outlined"
              density="compact"
              v-model="newVersion"
              label="Renseignez le nom de votre nouvelle version"
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn @click="addVersion" style="background-color: green; color: white"
              ><v-icon left>mdi-plus</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'
import InformationBubble from '@/components/InformationBubble.vue'
import { useParcoursStore } from '@/stores/parcoursStore'
import { navigateTo } from '@/router/router'
import router from '@/router/router'
import { paths } from '@/router/routesEnumeration'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useFormationStore } from '@/stores/formationStore'
import { ref } from 'vue'

const parcours = ref()
const formation = ref()
const versionList = ref([])

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const periodesStore = usePeriodeStore()

const newVersion = ref('')

const libChangeVersion = ref(false)

const changeLibelle = async (version) => {
  await formationStore.updateVersion(version)
  libChangeVersion.value = false
}

// const fetchingParcours = async () => {
//   await parcoursStore.fetchParcours()
//   parcours.value = parcoursStore.getOneParcours(router.currentRoute.value.params.idParcours)
//   versionList.value = parcours.value.versions
// }
// fetchingParcours()

const fetchingFormation = async () => {
  formation.value = await formationStore.fetchOneFormationFromId(
    formationStore.formationSelected.id

  )
  versionList.value = formation.value.version
}
fetchingFormation()

const addVersion = async () => {
  let idVersionCreated = null
  await formationStore.addVersion(formation.value.id, newVersion.value).then((d) => {
    idVersionCreated = d.id
  })
  await fetchingFormation()
  newVersion.value = ''

  // Add periodes to version / parcours
  let unit = formation.value.duree_unite
  let duration = formation.value.duree
  for (let i = 0; i < duration; i += 1) {
    await periodesStore.createPeriode(unit + ' ' + (i + 1), idVersionCreated)
  }
}

const selectVersion = (version) => {
  parcoursStore.versionSelected = version
  router.push({ name: 'parcours-competences', params: { idVersion: version.id } })
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
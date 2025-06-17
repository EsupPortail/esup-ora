<template>
  <v-row>
    <ArianeParcoursPath />
  </v-row>
  <v-row>
    <h2 style="margin-left: 16px;">Les versions de la formation : {{ formation?.libelle }}</h2>
  </v-row>
  <v-row>
    <v-col cols="8">
      <v-card class="formation-creation">
        <v-row>
          <v-col class="d-flex align-center">
            <span></span>
          </v-col>
        </v-row>
        <v-list style="margin-top: 20px">
          <v-list-item v-for="(version, index) in versionList" :key="index">
            <v-row>
            <v-col cols="2">
              <span>Version : </span>
            </v-col>
            <v-col cols="6">
              <span>{{ version.libelle }}</span>
            </v-col>
            <v-col cols="4">
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
    <v-col cols="4">
      <InformationBubble>
        <p>
          Ici vous pouvez créer autant de versions que vous souhaitez pour façonner un des parcours
          de votre formation !
        </p>
      </InformationBubble>
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

const parcoursStore = useParcoursStore()
const periodesStore = usePeriodeStore()
const formationStore = useFormationStore()

const newVersion = ref('')

// const fetchingParcours = async () => {
//   await parcoursStore.fetchParcours()
//   parcours.value = parcoursStore.getOneParcours(router.currentRoute.value.params.idParcours)
//   versionList.value = parcours.value.versions
// }
// fetchingParcours()

const fetchingFormation = async () => {
  formation.value = await formationStore.fetchOneFormationFromId(
    router.currentRoute.value.params.idFormation
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
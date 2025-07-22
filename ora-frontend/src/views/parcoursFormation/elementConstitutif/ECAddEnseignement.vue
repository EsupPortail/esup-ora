<template>
  <v-card class="">
    <v-card-title style="text-align: center">
      <span>
        <v-icon left>mdi-calendar-blank-outline</v-icon>
        {{ props.periode.libelle }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-row
        align="center"
        v-for="(enseignement, index) in enseignementsList"
        :key="index"
        style="height: 40px; margin-bottom: 10px; margin-top: 10px"
        class="d-flex align-center"
      >
        <v-col cols="6" style="padding-top: 0px; padding-bottom: 0px; height: 40px">
          <span v-if="idOfEnseignementLibelleIsEdited !== enseignement.id">
            {{ enseignement.libelle }}
          </span>
          <v-text-field
            v-else
            @blur="() => updateLibelleOfEnseignement(enseignement)"
            @keyup.enter="updateLibelleOfEnseignement(enseignement)"
            v-model="enseignementLibelleEdited"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col
          cols="2"
          offset="4"
          style="
            padding-top: 0px;
            padding-bottom: 0px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <v-btn
            icon="mdi-pencil"
            size="x-small"
            @click="startEditLibelleOfEnseignement(enseignement)"
          >
          </v-btn>
          <v-btn
            style="margin-left: 8px"
            icon="mdi-delete"
            size="x-small"
            @click="deleteEnseignement(enseignement)"
          >
          </v-btn>
        </v-col>
        <v-divider />
      </v-row>
      <v-row style="margin-top: 10px">
        <v-col style="text-align: center">
          <v-text-field
            class="mt-1"
            v-model="enseignementLibelleToAdd"
            label="Ajouter un enseignement"
            variant="outlined"
            density="compact"
            @keyup.enter="addEnseignement"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn icon="mdi-plus" color="success" @click="addEnseignement"> </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, computed, ref, watch } from 'vue'

import { useEnseignementStore } from '@/stores/enseignementStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useFormationStore } from '@/stores/formationStore'

const props = defineProps({
  periode: Object,
  version: Object,
  parcours: Object
})
const emit = defineEmits(['refresh-enseignements'])

const periodeStore = usePeriodeStore()
const enseignementLibelleToAdd = ref('')

const enseignementsStore = useEnseignementStore()
const enseignementsList = ref([])
const formationStore = useFormationStore()
// Get enseignements of parcours with version

const fetchEnseignements = () => {
  // console.log('fetchEnseignements', props.periode)
  enseignementsStore.fetchEnseignementsOfVersion(props.periode.id).then((d) => {
    enseignementsList.value = d.sort((a, b) => a.id - b.id)
  })
}
fetchEnseignements()
const addEnseignement = async () => {
  await enseignementsStore.createEnseignement(
    enseignementLibelleToAdd.value,
    props.periode.id,
    formationStore.formationSelected.id
  )
  enseignementLibelleToAdd.value = ''
  fetchEnseignements()
  emit('refresh-enseignements')
}

const handleCheckboxClick = async (type, enseignement) => {
  if (type === 'direct') {
    enseignement.est_evaluation_directe = !enseignement.est_evaluation_directe
    await enseignementsStore.updateEnseignement(enseignement)
    fetchEnseignements()
  } else if (type === 'indirect') {
    enseignement.est_evaluation_indirecte = !enseignement.est_evaluation_indirecte
    await enseignementsStore.updateEnseignement(enseignement)
    fetchEnseignements()
  }
}

const enseignementLibelleEdited = ref('')
const updateLibelleOfEnseignement = (enseignement) => {
  idOfEnseignementLibelleIsEdited.value = null
  const enseignementUpdated = { ...enseignement, libelle: enseignementLibelleEdited.value }
  enseignementsStore.updateEnseignement(enseignementUpdated)
  fetchEnseignements()
  emit('refresh-enseignements')
}
const startEditLibelleOfEnseignement = (enseignement) => {
  idOfEnseignementLibelleIsEdited.value = enseignement.id
  enseignementLibelleEdited.value = enseignement.libelle
}
const idOfEnseignementLibelleIsEdited = ref(null)
const deleteEnseignement = async (enseignement) => {
  // console.log(enseignement)
  await enseignementsStore.removeEnseignement(enseignement)
  fetchEnseignements()
  emit('refresh-enseignements')
}

// watch if periode change
watch(
  () => props.periode,
  () => {
    fetchEnseignements()
  }
)
// watch(() => enseignementsStore.enseignements, () => {
//   fetchEnseignements()
// })
</script>
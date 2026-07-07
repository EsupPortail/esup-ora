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
        :key="enseignement.id"
        class="d-flex align-center my-2"
        style="min-height: 40px"
      >
        <v-col cols="8" class="py-0 d-flex align-center" style="height: 40px">
          <span v-if="idOfEnseignementLibelleIsEdited !== enseignement.id">
            {{ enseignement.libelle }}
          </span>
          <v-text-field
            v-else
            style="max-width: 600px"
            @blur="() => updateLibelleOfEnseignement(enseignement)"
            @keyup.enter="updateLibelleOfEnseignement(enseignement)"
            v-model="enseignementLibelleEdited"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col
          cols="2"
          offset="2"
          class="py-0 d-flex align-center justify-center"
          style="height: 40px"
        >
          <v-btn
            icon="mdi-pencil"
            v-if="idOfEnseignementLibelleIsEdited !== enseignement.id"
            size="x-small"
            @click="startEditLibelleOfEnseignement(enseignement)"
          />
          <v-btn
            v-else
            icon="mdi-check"
            size="x-small"
            color="success"
            @click="updateLibelleOfEnseignement(enseignement)"
          />
          <v-btn
            class="ml-2"
            icon="mdi-delete"
            size="x-small"
            @click="deleteEnseignement(enseignement)"
          />
        </v-col>

        <!-- le divider doit occuper une colonne pleine largeur -->
        <v-col cols="12" class="py-0">
          <v-divider />
        </v-col>
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
import { useEcStore } from '@/stores/elementConstitutifStore'

const props = defineProps({
  periode: Object,
  version: Object,
  parcours: Object,
  title: String
})
const emit = defineEmits(['refresh-enseignements'])

const periodeStore = usePeriodeStore()
const enseignementLibelleToAdd = ref('')

const enseignementsStore = useEnseignementStore()
const enseignementsList = ref([])
const formationStore = useFormationStore()
const ecStore = useEcStore()
// Get enseignements of parcours with version

const fetchEnseignements = async () => {
  // console.log('fetchEnseignements', props.periode)
  enseignementsStore.fetchEnseignementsOfVersion(props.periode.id).then((d) => {
    enseignementsList.value = d.sort((a, b) => a.libelle.localeCompare(b.libelle))
  })
}
const addEnseignement = async () => {
  await enseignementsStore.createEnseignement(
    enseignementLibelleToAdd.value,
    props.periode.id,
    formationStore.formationSelected.id
  )
  enseignementLibelleToAdd.value = ''
  await fetchEnseignements()
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
const updateLibelleOfEnseignement = async (enseignement) => {
  idOfEnseignementLibelleIsEdited.value = null
  const enseignementUpdated = { ...enseignement, libelle: enseignementLibelleEdited.value }
  enseignementsStore.updateEnseignement(enseignementUpdated)
  await ecStore.fetchECs()
  const ecsWithThisEnseignement = ecStore.ecs.filter(
    (ec) => ec.enseignement_id === enseignement.id && ec.version?.id === props.version?.id
  )
  if (ecsWithThisEnseignement.length > 0) {
    ecsWithThisEnseignement[0].libelle = enseignementLibelleEdited.value
    ecStore.updateEC(ecsWithThisEnseignement[0])
  }

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
  // On regarde si il existe un ec qui a cet enseignement
  await ecStore.fetchECs()
  const ecsWithThisEnseignement = ecStore.ecs.filter(
    (ec) => ec.enseignement_id === enseignement.id && ec.version?.id === props.version?.id
  )
  console.log(ecStore.ecs)
  console.log('ecsWithThisEnseignement', ecsWithThisEnseignement)
  if (ecsWithThisEnseignement.length > 0) {
    ecStore.removeEC(ecsWithThisEnseignement[0])
  }

  await enseignementsStore.removeEnseignement(enseignement)
  fetchEnseignements()
  emit('refresh-enseignements')
}


const initData = async () => {
  await fetchEnseignements()
  await ecStore.fetchECs()
}
initData()
</script>
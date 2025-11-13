<template>
  <v-container>
    <v-row>
      <v-col cols="11">
        <h3 style="word-break: break-word; white-space: pre-line">
          <v-icon icon="mdi-book-open-variant-outline" />
          {{ data.libelle.replace(/(.{1,60})(\s+|$)/g, '$1\n') }}
        </h3>
      </v-col>
      <v-col cols="1">
        <v-btn
          icon="true"
          :color="data.est_mutualisable ? 'success' : 'transparent'"
          :disabled="data.est_mutualisable"
          @click="shareElement"
          size="small"
        >
          <v-icon size="16">mdi-share-variant</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px">
      <v-col cols="6" style="padding-bottom: 0px">
        <h3>
          <span>Compétence</span>
          <ul style="margin: 0; padding-left: 16px; font-size: 1rem">
            <li v-for="competence in competencesLinkedList" :key="competence.id">
              {{ competence.libelle }}
            </li>
          </ul>
        </h3>
      </v-col>
      <v-col cols="6">
        <h3>
          <span>Apprentissages:</span>
          <ul style="margin: 0; padding-left: 16px; font-size: 1rem">
            <li v-for="ac in acsLinkedList" :key="ac.id">{{ ac.libelle }}</li>
          </ul>
        </h3>
      </v-col>
    </v-row>
    <v-row style="margin-top: 16px">
      <v-col cols="6">
        <v-select
          v-model="data.parcours"
          :items="parcoursList"
          item-title="libelle"
          @blur="updateData"
          multiple
          @keyup.enter="updateData"
          item-value="id"
          label="Parcours"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-divider
    :thickness="4"
    class="my-4"
    style="border-style: dotted; border-color: #707070; margin: 0px !important"
  />
  <v-container>
    <v-row>
      <v-col cols="3" style="padding-top: 12px">
        <span>Volume horaire</span>
      </v-col>
      <v-col cols="2" style="padding-top: 6px">
        <v-text-field
          label="TP"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model.number="data.volume_horaire_tp"
        />
      </v-col>
      <v-col cols="2" style="padding-top: 6px">
        <v-text-field
          label="TD"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model="data.volume_horaire_td"
        />
      </v-col>
      <v-col cols="2" style="padding-top: 6px">
        <v-text-field
          label="CM"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model="data.volume_horaire_cm"
        />
      </v-col>
      <v-col cols="2" style="padding-top: 6px">
        <v-text-field
          label="CM/TD"
          type="number"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model="data.volume_horaire_cm_td"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="3" style="padding-top: 12px">
        <span>Crédit</span>
      </v-col>
      <v-col cols="2" style="padding-top: 6px">
        <v-text-field
          label="ECTS"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model="data.credits_ects"
        />
      </v-col>
      <v-col cols="2" class="d-flex" style="padding-top: 6px">
        <p style="display: inline-block; padding-top: 8px">Option:</p>
        <v-checkbox
          v-model="data.est_optionnel"
          label=""
          @update:model-value="updateData"
          density="compact"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-if="data.est_optionnel"
          v-model="data.ens_options"
          :items="ensOfUE.filter((e) => e.id !== data.id)"
          @blur="makeOptions"
          multiple
          @focus="beforeUpdate = [...data.ens_options]"
          item-title="libelle"
          item-value="id"
          label="Sélectionner des options"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="2" style="padding-top: 12px">
        <span>Modalité</span>
      </v-col>
      <v-col cols="6" style="padding-top: 6px">
        <v-radio-group
          inline
          style="display: inline-block"
          v-model="presentiel"
          @click="changeModalite('Présentiel')"
        >
          <v-radio label="Présentiel" value="Présentiel" />
        </v-radio-group>
        <v-radio-group
          inline
          style="display: inline-block"
          v-model="distanciel"
          @click="changeModalite('Distanciel')"
        >
          <v-radio label="Distanciel" value="Distanciel" />
        </v-radio-group>
        <v-radio-group
          inline
          style="display: inline-block"
          v-model="hybride"
          @click="changeModalite('Hybride')"
        >
          <v-radio label="Hybride" value="Hybride" />
        </v-radio-group>
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          v-model="data.nb_etudiant_max"
          @blur="updateData"
          @keyup.enter="updateData"
          label="Nombre étudiants"
          type="number"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="2" style="padding-top: 12px">
        <span>Évaluation</span>
      </v-col>
      <v-col cols="4">
        <v-radio-group v-model="modeEvaluation" @change="onChangeEvaluation" inline>
          <v-radio label="Isolée" value="isole" />
          <v-radio label="Associée" value="associe" />
        </v-radio-group>
      </v-col>

      <v-col cols="4" style="padding-top: 6px">
        <v-select
          :items="amsList"
          label="Sélectionner une AMS"
          v-model="data.ams_connected_id"
          item-title="libelle"
          item-value="id"
          variant="outlined"
          @blur="updateData"
          @keyup.enter="updateData"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="5" style="padding-top: 6px">
        <v-select
          label="TAGS"
          v-model="data.tags"
          :items="tagsList"
          item-title="libelle"
          multiple
          @blur="updateData"
          @keyup.enter="updateData"
          item-value="id"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="12" style="padding-top: 6px">
        <v-textarea
          label="Description"
          variant="outlined"
          density="compact"
          rows="3"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model="data.description"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, computed, defineEmits } from 'vue'

import { useFormationStore } from '@/stores/formationStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useTagStore } from '@/stores/tagStore'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useNiveauxApprentissagesStore } from '@/stores/niveauxApprentissagesStore'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  refreshTreeView: {
    type: Function,
    required: false
  }
})

const emit = defineEmits(['refreshTreeView'])

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const ecStore = useEcStore()
const competenceStore = useCompetenceStore()
const enseignementStore = useEnseignementStore()
const tagStore = useTagStore()

enseignementStore.fetchEnseignements()
competenceStore.fetchCompetences()

const data = ref(props.data)
const parcoursList = ref(formationStore.formationSelected.parcours)
const tagsList = ref([])
const amsList = ref(ecStore.ecs.filter((ec) => ec.type === 'AMS'))
const modeEvaluation = ref(data.value.est_isole ? 'isole' : data.value.est_assoce ? 'associe' : '')
const presentiel = ref(data.value.est_presentiel ? 'Présentiel' : '')
const distanciel = ref(data.value.est_distanciel ? 'Distanciel' : '')
const hybride = ref(data.value.est_hybride ? 'Hybride' : '')
const beforeUpdate = ref(null)

const ensOfUE = computed(() => {
  return ecStore.ecs.filter((ec) => {
    return parcoursStore.versionSelected.id === ec.version_id
  })
})

const updateData = async () => {
  await ecStore.updateEC(data.value)
}

const competencesLinkedList = ref([])
const acsLinkedList = ref([])

const initData = async () => {
  competencesLinkedList.value.length = 0
  acsLinkedList.value.length = 0
  const idAsNumber = parseInt(data.value.id, 10)
  tagsList.value = formationStore.formationSelected.composante.parametre.tags
  data.value = ecStore.ecs.find((ec) => ec.id === idAsNumber)
  modeEvaluation.value = data.value.est_isole ? 'isole' : data.value.est_assoce ? 'associe' : ''
  setModalite()
  const ensObject = await enseignementStore.enseignements.find(
    (ens) => ens.id === data.value.enseignement_id
  )
  ensObject.apprentissages_critiques.forEach((ac) => {
    if (!acsLinkedList.value.find((a) => a.id === ac.id)) {
      acsLinkedList.value.push(ac)
    }
    const competence = competenceStore.competences.find((c) => c.id === ac.niveau.competence_id)
    if (competence && !competencesLinkedList.value.find((c) => c.id === competence.id)) {
      competencesLinkedList.value.push(competence)
    }
  })
  console.log(data.value.parcours)
}

const setModalite = () => {
  presentiel.value = data.value.est_presentiel ? 'Présentiel' : ''
  distanciel.value = data.value.est_distanciel ? 'Distanciel' : ''
  hybride.value = data.value.est_hybride ? 'Hybride' : ''
}

const onChangeEvaluation = (value) => {
  if (value.target.value === 'isole') {
    data.value.est_isole = true
  } else if (value.target.value === 'associe') {
    data.value.est_assoce = true
  }

  modeEvaluation.value = value.target.value

  updateData()
}

const makeOptions = async () => {
  const clusterIds = [...data.value.ens_options, data.value.id]

  await ecStore.makeOptionECs(clusterIds, data.value)
  emit('refreshTreeView')
}

const shareElement = () => {
  data.value.est_mutualisable = true
  updateData()
}

const changeModalite = (value) => {
  if (value === 'Présentiel') {
    data.value.est_presentiel = !data.value.est_presentiel
    presentiel.value = data.value.est_presentiel ? 'Présentiel' : ''
  }
  if (value === 'Distanciel') {
    data.value.est_distanciel = !data.value.est_distanciel
    distanciel.value = data.value.est_distanciel ? 'Distanciel' : ''
  }
  if (value === 'Hybride') {
    data.value.est_hybride = !data.value.est_hybride
    hybride.value = data.value.est_hybride ? 'Hybride' : ''
  }

  updateData()
}

initData()

watch(
  () => ecStore.ecs.find((ec) => ec.id === props.data.id),
  (newVal) => {
    data.value = newVal
    modeEvaluation.value = data.value.est_isole ? 'isole' : data.value.est_assoce ? 'associe' : ''
    setModalite()

    initData()
    console.log(data.value)
  },
  { deep: true }
)

watch(
  () => props.data,
  async (newVal) => {
    data.value = newVal
    modeEvaluation.value = data.value.est_isole ? 'isole' : data.value.est_assoce ? 'associe' : ''
    setModalite()

    await initData()
    console.log(data.value)
  },
  { deep: true }
)
</script>
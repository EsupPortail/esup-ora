<template>
  <v-container>
    <v-row>
      <v-col cols="1" style="padding-bottom: 0px">
        <v-icon icon="mdi-thought-bubble-outline" />
      </v-col>
      <template v-if="libelleEdition">
        <v-col cols="5">
          <v-text-field
            v-model="data.libelle"
            variant="outlined"
            label="Libellé"
            density="compact"
            hide-details
            @blur="updateLibelle"
            @keyup.enter="updateLibelle"
          />
        </v-col>
        <v-col cols="1">
          <v-btn icon="true" size="small" @click="libelleEdition = false">
            <v-icon size="16">mdi-check</v-icon>
          </v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="5">
          <h3 style="word-break: break-word; white-space: pre-line">
            {{ data.libelle.replace(/(.{1,60})(\s+|$)/g, '$1\n') }}
          </h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon="true" size="small" @click="libelleEdition = true">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
        </v-col>
      </template>
      <v-col cols="1" offset="3">
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
      <v-col cols="1">
        <v-btn color="error" icon="true" size="small" @click="deleteElement()">
          <v-icon size="16">mdi-delete</v-icon>
        </v-btn>
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
    <!-- Volume horaire -->
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

    <!-- Crédit -->
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
          density="compact"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-if="data.est_optionnel"
          v-model="data.ens_options"
          :items="uesOfPeriode.filter((ue) => ue.id !== data.id)"
          @blur="makeOptions"
          multiple
          @focus="beforeUpdate = [...(data.ens_options ?? [])]"
          item-title="libelle"
          item-value="id"
          label="Sélectionner des options"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>

    <!-- Modalité -->
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="2" style="padding-top: 12px">
        <span>Modalité</span>
      </v-col>
      <v-col cols="6" style="padding-top: 6px">
        <v-row>
          <v-col cols="4">
            <v-checkbox
              v-model="presentiel"
              label="Présentiel"
              @update:model-value="changeModalite('Présentiel')"
              density="compact"
            />
          </v-col>
          <v-col cols="4">
            <v-checkbox
              v-model="distanciel"
              label="Distanciel"
              @update:model-value="changeModalite('Distanciel')"
              density="compact"
            />
          </v-col>
          <v-col cols="4">
            <v-checkbox
              v-model="hybride"
              label="Hybride"
              @update:model-value="changeModalite('Hybride')"
              density="compact"
            />
          </v-col>
        </v-row>
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

    <!-- Évaluation -->
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="2" style="padding-top: 12px">
        <span>Évaluation</span>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col cols="6">
            <v-checkbox
              v-model="isole"
              label="Isolée"
              density="compact"
              @update:model-value="onChangeEvaluation('isole')"
            />
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="associe"
              label="Associée"
              density="compact"
              @update:model-value="onChangeEvaluation('associe')"
            />
          </v-col>
        </v-row>
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

    <!-- Tags -->
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

    <!-- Description -->
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
import { ref, computed, watch } from 'vue'

import { useFormationStore } from '@/stores/formationStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useTagStore } from '@/stores/tagStore'

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
const periodeStore = usePeriodeStore()
const tagStore = useTagStore()

const parcoursList = ref(formationStore.formationSelected.parcours)
const tagsList = ref(formationStore.formationSelected.composante.parametre.tags)
const libelleEdition = ref(false)
const data = ref(props.data)
const beforeUpdate = ref(null)

const presentiel = ref(false)
const distanciel = ref(false)
const hybride = ref(false)
const isole = ref(false)
const associe = ref(false)

// AMS = autres UEs de la même période marquées comme telles
// (à adapter selon votre logique métier)
const amsList = computed(() => {
  return uesOfPeriode.value.filter((ue) => ue.id !== data.value.id)
})

const uesOfPeriode = computed(() => {
  const periode = periodeStore.periodes.find((p) =>
    p.unites_enseignement?.some((ue) => ue.id === data.value.id)
  )
  return periode?.unites_enseignement ?? []
})

const setModalite = () => {
  presentiel.value = data.value.est_presentiel ?? false
  distanciel.value = data.value.est_distanciel ?? false
  hybride.value = data.value.est_hybride ?? false
}

const initData = () => {
  const idAsNumber = parseInt(data.value.id, 10)
  data.value = periodeStore.getAllUEs.find((ue) => ue.id === idAsNumber)
  data.value.ens_options = data.value.ens_options ?? [] // ← sécuriser
  setModalite()
  isole.value = data.value.est_isole ?? false
  associe.value = data.value.est_assoce ?? false
}
initData()

const updateData = async () => {
  await periodeStore.updateUE(data.value)
  emit('refreshTreeView')
}

const updateLibelle = async () => {
  libelleEdition.value = false
  await updateData()
}

const shareElement = () => {
  data.value.est_mutualisable = true
  updateData()
}

const deleteElement = () => {
  // à brancher sur votre action store de suppression
}

const changeModalite = (value) => {
  if (value === 'Présentiel') data.value.est_presentiel = presentiel.value
  if (value === 'Distanciel') data.value.est_distanciel = distanciel.value
  if (value === 'Hybride') data.value.est_hybride = hybride.value
  updateData()
}

const onChangeEvaluation = (type) => {
  if (type === 'isole') data.value.est_isole = isole.value
  if (type === 'associe') data.value.est_assoce = associe.value
  updateData()
}

const makeOptions = async () => {
  // ens_options peut être un tableau d'ids ou d'objets selon Vuetify
  const options = (data.value.ens_options ?? []).map((o) => (typeof o === 'object' ? o.id : o))
  const clusterIds = [...options, data.value.id]
  await periodeStore.makeOptionUEs(clusterIds, data.value)
  emit('refreshTreeView')
}

watch(
  () => periodeStore.getAllUEs.find((ue) => ue.id === props.data.id),
  (newVal) => {
    if (newVal) {
      data.value = { ...newVal }
      setModalite()
      isole.value = data.value.est_isole ?? false
      associe.value = data.value.est_assoce ?? false
    }
  },
  { deep: true }
)

watch(
  () => props.data,
  (newVal) => {
    data.value = newVal
    initData()
  },
  { deep: true }
)
</script>
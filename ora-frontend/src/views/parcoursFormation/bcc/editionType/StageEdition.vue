<template>
  <v-container>
    <v-row>
      <v-col cols="1" style="padding-bottom: 0px">
        <v-icon icon="mdi-briefcase-check-outline" />
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
    <v-row style="margin-top: 20px">
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
      <v-col cols="2" style="padding-top: 12px">
        <span>Volume horaire</span>
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="Heures étudiant"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model.number="data.volume_horaire_etudiant"
        />
      </v-col>
      <v-col offset="1" cols="1" style="padding-top: 12px">
        <span>Crédits</span>
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="ECTS"
          type="number"
          v-model="data.credits_ects"
          @blur="updateData"
          @keyup.enter="updateData"
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
          @blur="updateData"
          @keyup.enter="updateData"
          density="compact"
          rows="3"
          v-model="data.description"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

import { useFormationStore } from '@/stores/formationStore'
import { useEcStore } from '@/stores/elementConstitutifStore'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const ecStore = useEcStore()
const formationStore = useFormationStore()

const emit = defineEmits(['refreshTreeView'])

const parcoursList = ref(formationStore.formationSelected.parcours)
const libelleEdition = ref(false)
const data = ref({ ...props.data })

const shareElement = () => {
  data.value.est_mutualisable = true
  updateData()
}

const updateData = async () => {
  await ecStore.updateEC(data.value)
  emit('refreshTreeView')
}
const deleteElement = async () => {
  await ecStore.removeEC(data.value)
  emit('refreshTreeView')
}

const updateLibelle = async () => {
  await updateData()
  await nextTick()
  emit('refreshTreeView')
  await nextTick()
}

const initData = async () => {
  const idAsNumber = parseInt(data.value.id, 10)
  data.value = ecStore.ecs.find((ec) => ec.id === idAsNumber)
}
initData()

watch(
  () => ecStore.ecs.find((ec) => ec.id === props.data.id),
  (newVal) => {
    if (newVal) {
      data.value = { ...newVal }
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
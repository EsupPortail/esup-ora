<template>
  <v-container v-if="etablissementSelectedRef !== null">
    <v-data-table
      :items="sortedItems"
      item-key="id"
      :headers="headers"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Liste des composantes disponibles pour l'établissement </v-toolbar-title>
          <v-select
            v-model="etablissementSelectedRef"
            :items="etablissementStore.etablissements"
            item-title="libelle"
            item-value="id"
            label="Établissement sélectionné"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 300px; margin-left: 16px"
            @update:modelValue="changeEtabSelected"
          />

          <v-divider class="mx-4" inset vertical />
          <v-checkbox
            v-model="showHistorises"
            label="Afficher les éléments historisés"
            density="compact"
            hide-details
            class="ml-4"
          />

          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:bottom>
        <v-btn color="primary" @click="addNewComposante">Ajouter une composante</v-btn>
      </template>
      <template v-slot:item="{ item }">
        <tr v-if="editEtabId === item.id">
          <v-text-field
            style="margin-top: 24px; margin-left: 12px; margin-right: 12px"
            v-model="item.libelle"
            label="Nom de la composante"
            variant="outlined"
            density="compact"
          />
          <td>
            <v-select
              v-model="item.parametre_id"
              :items="parametresStore.parametres"
              item-title="libelle"
              item-value="id"
              label="Paramètre"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            ></v-select>
          </td>
          <td>
            <v-btn color="success" small @click="saveEdition(item)"> Enregistrer</v-btn>
          </td>
        </tr>
        <tr v-else>
          <td>{{ item.libelle }}</td>
          <td>
            {{
              parametresStore.parametres.find((p) => p.id === item.parametre_id)?.libelle || 'Aucun'
            }}
          </td>
          <td>
            <v-btn color="primary" small @click="changeEdit(item.id)"> Modifier</v-btn>
            <v-btn
              v-if="!item.is_historized && (!item.formations || item.formations.length === 0)"
              style="margin-left: 8px"
              color="error"
              small
              @click="historize(item)"
            >
              Historiser</v-btn
            >
            <v-btn
              v-else-if="item.is_historized"
              style="margin-left: 8px"
              color="grey"
              small
              @click="historize(item)"
            >
              Restaurer</v-btn
            >
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'

import { useParametreStore } from '@/stores/parametreStore'
import { useEtablissementStore } from '@/stores/etablissementStore'
import { useComposanteStore } from '@/stores/composanteStore'

const parametresStore = useParametreStore()
const etablissementStore = useEtablissementStore()
const composantesStore = useComposanteStore()

const etablissementSelectedRef = ref(null)
const editEtabId = ref(null)
const composantesOfEtab = ref([])

const showHistorises = ref(false)

const sortedItems = computed(() => {
  let list = [...composantesOfEtab.value]

  if (!showHistorises.value) {
    list = list.filter(c => !c.is_historized);
  }
  if (!editEtabId.value) {
    list.sort((a, b) => a.libelle.localeCompare(b.libelle));
  } else {
    const editItem = list.find(c => c.id === editEtabId.value);
    console.log('Item en édition :', editItem);
    if (editItem) {
      list = [editItem, ...list.filter(c => c.id !== editEtabId.value)];
    }
  }
  return list;
});

const historize = async (item) => {
  item.is_historized = !item.is_historized
  await composantesStore.updateIsHistorized(item)
  await composantesStore
    .fetchComposanteByEtablissement(etablissementSelectedRef.value)
    .then((d) => {
      composantesOfEtab.value = [...d]
    })
}

const changeEdit = (id) => {
  editEtabId.value = id
}

const headers = [
  { title: 'Nom composante', value: 'name' },
  { title: 'Paramètre associé', value: 'parametre' }
]

const changeEtabSelected = async (etabId) => {
  console.log('Etab sélectionné :', etabId)
  await composantesStore.fetchComposanteByEtablissement(etabId)
}

const saveEdition = async (item) => {
  delete item.formations;
  await composantesStore.updateComposante(item)
  await initData()
  editEtabId.value = null
}

const addNewComposante = async () => {
  const newComposante = {
    libelle: 'Nouvelle composante',
    etablissement: { connect: { id: etablissementSelectedRef.value } }
  }
  await composantesStore.createComposante(newComposante).then((res) => {
    editEtabId.value = res.id
  })
  await composantesStore
    .fetchComposanteByEtablissement(etablissementSelectedRef.value)
    .then((d) => {
      composantesOfEtab.value = [...d]
    })
}

const initData = async () => {
  await etablissementStore.fetchEtablissements()
  await parametresStore.fetchParametres()
  await composantesStore
    .fetchComposanteByEtablissement(etablissementSelectedRef.value)
    .then((d) => {
      composantesOfEtab.value = [...d]
    })
  if (etablissementSelectedRef.value === null && etablissementStore.etablissements.length > 0) {
    etablissementSelectedRef.value = etablissementStore.etablissements[0]?.id
  }
}

initData()
watch(
  () => etablissementSelectedRef.value,
  () => {
    initData()
  }
)
</script>
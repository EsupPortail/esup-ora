<template>
  <v-container>
    <v-data-table
      :items="etablissementStore.etablissements"
      item-key="id"
      :headers="headers"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Liste des établissements disponibles</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:bottom>
        <v-btn color="primary" @click="addNewEtab">Ajouter un établissement</v-btn>
      </template>
      <template v-slot:item="{ item }">
        <tr v-if="editEtabId === item.id">
          <v-text-field
            v-model="item.libelle"
            label="Nom de l'établissement"
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
              parametresStore.parametres.find((p) => p.id === item.parametre_id)
                ?.libelle || 'Aucun'
            }}
          </td>
          <td>
            <v-btn color="primary" small @click="changeEdit(item.id)"> Modifier</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useParametreStore } from '@/stores/parametreStore'
import { useEtablissementStore } from '@/stores/etablissementStore'

const parametresStore = useParametreStore()
const etablissementStore = useEtablissementStore()

const editEtabId = ref(null)
const etablissements = ref([])

const deleteAllEtab = async () => {
  etablissementStore.etablissements.forEach(async (etab) => {
    await etablissementStore.deleteEtablissement(etab)
  })
  await initData()
}

const changeEdit = (id) => {
  editEtabId.value = id
}

const headers = [
  { title: 'Nom établissement', value: 'name' },
  { title: 'Paramètre associé', value: 'parametre' }
]

const saveEdition = async (item) => {

  await etablissementStore.updateEtablissement(item)
  await initData()
  editEtabId.value = null
}

const addNewEtab = () => {
  const newEtab = {
    libelle: 'Nouvel établissement'
  }
  etablissementStore.createEtablissement(newEtab).then((res) => {
    console.log(res)
    editEtabId.value = res.id
  })
}

const initData = async () => {
  await etablissementStore.fetchEtablissements()
  await parametresStore.fetchParametres()
}

initData()
watch(
  () => etablissementStore.etablissements,
  () => {
    // initData();
  }
)
</script>
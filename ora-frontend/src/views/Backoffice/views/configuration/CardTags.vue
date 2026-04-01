<template>
  <v-container>
    <v-data-table
      :items="[...tagStore.tags].sort((a, b) => a.id - b.id)"
      :headers="headers"
      item-key="id"
      :items-per-page="10"
      :sort-by="[{ key: 'id', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Tags disponibles</v-toolbar-title>
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
      <template v-slot:footer.prepend>
        <v-row>
          <v-col cols="2" offset="10" style="margin-bottom: 16px">
            <v-btn color="success" @click="createNewTag">Ajouter un tag</v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item="{ item }">
        <template v-if="showHistorises || !item.is_historized">
          <tr v-if="editTag === item.id">
            <td style="padding-top: 16px">
              <v-text-field
                v-model="item.libelle"
                label="Nom du tag"
                variant="outlined"
                density="compact"
              />
            </td>
            <td>
              <v-btn color="success" small @click="saveLibelle(item)"> Sauvegarder</v-btn>
            </td>
          </tr>
          <tr v-else>
            <td>{{ item.libelle }}</td>
            <td>
              <v-btn color="primary" small @click="changeEdit(item.id)"> Modifier ce tag</v-btn>
              <v-btn
                v-if="!item.is_historized && (!item.parametre || item.parametre.length === 0)"
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
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

import { useTagStore } from '@/stores/tagStore'

const tagStore = useTagStore()

const editTag = ref(null)
const showHistorises = ref(false)

const headers = [
  { title: 'Nom tag', value: 'name', sortable: false },
  { title: 'Actions', value: 'actions', sortable: false }
]

const changeEdit = (id) => {
  editTag.value = id
}

const historize = async (item) => {
  item.is_historized = !item.is_historized
  console.log(item)
  await saveLibelle(item)
}

const createNewTag = () => {
  const newTag = {
    libelle: 'Nouveau tag'
  }
  tagStore.createTag(newTag).then((res) => {
    editTag.value = res.id
  })
}

const saveLibelle = async (item) => {
  await tagStore.updateTag(item);
    editTag.value = null
}

const initData = async () => {
  await tagStore.fetchAllTags()
}

initData()
</script>
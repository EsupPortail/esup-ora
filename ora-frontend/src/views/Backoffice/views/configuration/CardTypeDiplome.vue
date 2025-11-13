<template>
  <v-container>
    <v-data-table
      :items="[...typeDiplomeStore.typeDiplomes].sort((a, b) => a.libelle.localeCompare(b.libelle))"
      :headers="headers"
      item-key="id"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <span> Types de diplômes disponibles </span>
          </v-toolbar-title>
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
        <v-row>
          <v-col cols="3" offset="8" style="margin-bottom: 16px">
            <v-btn color="success" @click="createNewTypeDiplome" style="margin-right: 16px"
              >Ajouter un type de diplôme</v-btn
            >
          </v-col>
        </v-row>
      </template>
      <template v-slot:item="{ item }">
        <template v-if="showHistorises || !item.is_historised">
          <tr v-if="editTD === item.id">
            <td style="padding-top: 16px">
              <v-text-field
                v-model="item.libelle"
                label="Nom du type de diplôme"
                variant="outlined"
                density="compact"
              />
            </td>
            <td style="padding-top: 16px">
              <v-text-field
                label="Heures"
                type="number"
                variant="outlined"
                density="compact"
                v-model.number="item.heures"
              />
            </td>

            <td style="padding-top: 16px">
              <v-text-field
                label="Crédits ECTS"
                type="number"
                variant="outlined"
                density="compact"
                v-model.number="item.credits"
              />
            </td>

            <td>
              <v-btn color="success" small @click="saveTD(item)"> Sauvegarder</v-btn>
            </td>
          </tr>
          <tr v-else>
            <td>{{ item.libelle }}</td>
            <td>{{ item.heures }}</td>
            <td>{{ item.credits }}</td>
            <td>
              <v-btn color="primary" small @click="changeEdit(item.id)"> Modifier</v-btn>
              <v-btn
                v-if="!item.is_historised && (!item.parametres || item.parametres.length === 0)"
                style="margin-left: 8px"
                color="error"
                small
                @click="historize(item)"
              >
                Historiser</v-btn
              >
              <v-btn
                v-else-if="item.is_historised"
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

import { useTypeDiplomeStore } from '@/stores/typeDiplomeStore'

const typeDiplomeStore = useTypeDiplomeStore()

const editTD = ref(null)
const showHistorises = ref(false)

const headers = [
  { title: 'Nom du type de diplôme', value: 'name' },
  { title: 'Heures', value: 'heures' },
  { title: 'Crédits ECTS', value: 'ects' },
  { title: 'Actions', value: 'actions', sortable: false }
]

const changeEdit = (id) => {
  editTD.value = id
}

const historize = async (item) => {
  item.is_historised = !item.is_historised
  await saveTD(item)
}

const createNewTypeDiplome = () => {
  const newTypeDiplome = {
    libelle: 'Nouveau type de diplôme'
  }
  typeDiplomeStore.createTypeDiplome(newTypeDiplome).then((res) => {
    editTD.value = res.id
  })
}

const saveTD = async (item) => {
  await typeDiplomeStore.updateTypeDiplome(item)
  editTD.value = null
}

const initData = async () => {
  await typeDiplomeStore.fetchTypeDiplomes()
}

initData()
</script>
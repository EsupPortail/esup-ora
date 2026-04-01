<template>
  <v-container>
    <v-data-table
      :items="[...parametresStore.parametres].sort((a, b) => a.libelle.localeCompare(b.libelle))"
      :headers="headers"
      item-key="id"
      class="elevation-1"
      :items-per-page="10"
      :sort-by="[{ key: 'id', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Paramètres disponibles</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:footer.prepend>
        <v-row>
          <v-col cols="2" offset="10" style="margin-bottom: 16px">
            <v-btn color="success" @click="createParametre"
              >Ajouter un paramètre</v-btn
            >
          </v-col>
        </v-row>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.libelle }}</td>
          <td>
            <v-btn color="primary" small @click="() => editParametre(item.id)"
              >Modifier ce paramètre</v-btn
            >
            <!-- <v-btn color="error" small>Supprimer ce paramètre</v-btn> -->
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-card style="margin-top: 40px" class="elevation-10" v-if="editionMode !== ''">
      <v-card-title v-if="editionMode === 'create'">Ajout d'un nouveau paramètre</v-card-title>
      <v-card-title v-else-if="editionMode === 'edit'">
        <span> Modification du paramètre </span>
        <span>
          {{ editionParametreRef.libelle }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="editionParametreRef.libelle"
          label="Nom du paramètre"
          variant="outlined"
          density="compact"
        />
        <v-textarea
          v-model="editionParametreRef.description"
          label="Description du paramètre"
          variant="outlined"
          density="compact"
        />
        <v-row>
          <v-col>
            <v-select
              label="Type de diplome"
              v-model="editionParametreRef.type_diplomes"
              :items="typeDiplomeStore.typeDiplomes"
              item-title="libelle"
              variant="outlined"
              density="compact"
              multiple
              return-object
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              variant="outlined"
              density="compact"
              label="Tags utilisables"
              :items="tagStore.tags"
              item-title="libelle"
              v-model="editionParametreRef.tags"
              chips
              return-object
              multiple
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <h4 style="padding: 16px">Les champs suivants sont limités à 25 caractères maximum.</h4>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              variant="outlined"
              density="compact"
              maxlength="25"
              label="Sémantique champs 'Compétence'"
              v-model="editionParametreRef.semantique_competence"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              maxlength="25"
              density="compact"
              label="Sémantique champs 'Apprentissages essentiels'"
              v-model="editionParametreRef.semantique_apprentissage"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              maxlength="25"
              density="compact"
              label="Sémantique champs 'Familles de situation'"
              v-model="editionParametreRef.semantique_famille"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              variant="outlined"
              density="compact"
              maxlength="25"
              label="Sémantique champs 'Critères d'évaluation'"
              v-model="editionParametreRef.semantique_critere"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              maxlength="25"
              density="compact"
              label="Sémantique champs 'BCC'"
              v-model="editionParametreRef.semantique_bcc"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              maxlength="25"
              density="compact"
              label="Sémantique champs 'Groupe d'EC (UE)'"
              v-model="editionParametreRef.semantique_ue"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-text-field
              variant="outlined"
              maxlength="25"
              density="compact"
              label="Sémantique champs 'Élément constitutif'"
              v-model="editionParametreRef.semantique_ec"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" offset="9">
            <v-btn color="error" @click="cancelEdition"> Annuler </v-btn>
            <v-btn color="success" @click="saveEdition" style="margin-left: 12px">
              Enregistrer
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useParametreStore } from '@/stores/parametreStore'
import { useTypeDiplomeStore } from '@/stores/typeDiplomeStore'
import { useTagStore } from '@/stores/tagStore'

const typeDiplomeStore = useTypeDiplomeStore()
const tagStore = useTagStore()
const parametresStore = useParametreStore()

const parametresAvailable = ref([])
const editionMode = ref('')
const editionParametreRef = ref(null)

const newParametreModel = ref({
  libelle: '',
  semantique_competence: 'Compétences',
  semantique_apprentissage: 'Apprentissages',
  semantique_famille: 'Familles de situation',
  semantique_critere: "Critères d'exigences",
  semantique_bcc: 'BCC',
  semantique_ue: 'UE',
  semantique_ec: 'Éléments constitutifs'
})

const headers = [
  { title: 'Nom', value: 'name' },
  { title: 'Actions', value: 'actions', sortable: false }
]

const cancelEdition = () => {
  editionMode.value = ''
  editionParametreRef.value = null
}

const createParametre = () => {
  editionMode.value = 'create'
  editionParametreRef.value = { ...newParametreModel.value, type_diplomes: [], tags: [] }
}

const editParametre = (id) => {
  editionMode.value = 'edit'
  const parametre = parametresStore.parametres.find((parametre) => parametre.id === id)
  editionParametreRef.value = parametre ? { ...parametre } : null
}

const saveEdition = () => {

  if (editionMode.value === 'create') {
    const tds = editionParametreRef.value.type_diplomes;
    const tags = editionParametreRef.value.tags;
    delete editionParametreRef.value.type_diplomes;
    delete editionParametreRef.value.tags;
    editionParametreRef.value.type_diplomes = { connect: tds.map((td) => ({
      id: td.id
    })) }
    editionParametreRef.value.tags = { connect: tags.map((tag) => ({
      id: tag.id
    })) }

    parametresStore.createParametre(editionParametreRef.value)
    cancelEdition()
    return
  }

  parametresStore.updateParametre(editionParametreRef.value)
  cancelEdition()
}

const initData = async () => {
  await parametresStore.fetchParametres()
  await typeDiplomeStore.fetchTypeDiplomes()
  await tagStore.fetchAllTags()
  console.log(parametresStore.parametres)
  parametresAvailable.value = parametresStore.parametres.map((parametre) => ({
    id: parametre.id,
    name: parametre.libelle,
    parametre: parametre.parametre
  }))
}

initData()
watch(
  () => parametresStore.parametres,
  () => {
    // initData();
  }
)
</script>
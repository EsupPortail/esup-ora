<template>
  <v-container>
    <v-data-table
      :items="
        infoBulleStore.informations_bulles.sort((a, b) =>
          a.screen_associated.localeCompare(b.screen_associated)
        )
      "
      item-key="id"
      :headers="headers"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            >Liste des bulles d'informations disponibles pour l'établissement
          </v-toolbar-title>
          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td style="padding-top: 8px; padding-bottom: 8px;">
            <span v-if="item.screen_associated === 'export'">Page Export (pdf,excel)</span>
            <span v-else-if="item.screen_associated === 'competences'">Page Compétences</span>
            <span v-else-if="item.screen_associated === 'apprentissages-critiques'"
              >Page Apprentissages critiques</span
            >
            <span v-else-if="item.screen_associated === 'maquette'">Page Maquette</span>
            <span v-else-if="item.screen_associated === 'elements-constitutifs'"
              >Page Éléments constitutifs</span
            >
            <span v-else-if="item.screen_associated === 'tableaux-de-bord'"
              >Page Tableaux de bord</span
            >
            <span v-else>{{ item.screen_associated }}</span>
          </td>
          <td style="padding-top: 8px; padding-bottom: 8px;">
            <span v-if="editInfoBulleId !== item.id">{{ item.contenu }}</span>
            <v-textarea
              v-else
              v-model="item.contenu"
              label="Contenu de la bulle d'information"
              variant="outlined"
              density="compact"
              rows="3"
              style="max-width: 1000px; padding-top: 20px;"
            />
          </td>
          
          <td style="padding-top: 8px; padding-bottom: 8px;">
            <v-btn v-if="editInfoBulleId !== item.id" icon @click="changeEdit(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-else color="success" small @click="saveEdition(item)"> Enregistrer</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useApplicationInformationsBullesStore } from '@/stores/informationsBullesStore'

const infoBulleStore = useApplicationInformationsBullesStore()

const editInfoBulleId = ref(null)

const changeEdit = (id) => {
  editInfoBulleId.value = id
}

const viewsList = ref([
  {
    screenName: 'export',
    defaultContent: 'Vous pouvez exporter l’ensemble des données saisies, soit au format Excel, soit au format PDF.'
  },
  {
    screenName: 'competences',
    defaultContent: 'Reprenez les blocs de compétences issus des fiches RNCP, puis, si nécessaire, adaptez-les au contexte de votre formation. Vous pouvez ensuite ajouter des critères d’exigence (formulés avec des verbes au gérondif) afin de faciliter l’élaboration des critères d’évaluation. Pensez également à préciser, pour chaque compétence, les familles de situations, c’est-à-dire les contextes dans lesquels vous évaluerez les compétences attendues.'
  },
  {
    screenName: 'apprentissages-critiques',
    defaultContent: 'Ajoutez les apprentissages par niveau et par compétence déjà renseignés. Astuce : vous pouvez réorganiser les apprentissages pour mieux visualiser la progression'
  },
  {
    screenName: 'maquette',
    defaultContent: 'Deux vues, deux approches : une vue par semestre, qui permet d’organiser la maquette de formation semestre par semestre, et une vue en BCC, qui permet de structurer la formation par blocs de connaissances et de compétences. Il est possible de basculer de l’une à l’autre pour une meilleure visualisation. Pour chaque élément, complétez les champs nécessaires afin d’alimenter le tableau de bord.'
  },
  {
    screenName: 'elements-constitutifs',
    defaultContent: 'Saisissez les enseignements par semestre, mois ou année (selon votre paramétrage), puis associez-les, dans la matrice, aux apprentissages renseignés au préalable.'
  },
  {
    screenName: 'tableaux-de-bord',
    defaultContent: 'Cette page permet de visualiser les données saisies lors de la complétion de l’offre de formation.'
  }
])

const headers = [
  { title: "Vue de l'application", value: 'screen_associated' },
  { title: 'Aperçu du contenu', value: 'contenu' },
  { title: 'Actions', value: 'actions', sortable: false }
]

const saveEdition = async (item) => {
  await infoBulleStore.updateApplicationInformationsBulle(item)
  await initData()
  editInfoBulleId.value = null
}

const initData = async () => {
  await infoBulleStore.fetchApplicationInformationsBulles()
  // Si première connexion (pas de bulles d'infos), on les crée avec le contenu par défaut
  if (infoBulleStore.informations_bulles.length !== viewsList.value.length) {
    for (const view of viewsList.value) {
      await infoBulleStore.createApplicationInformationsBulle({
        screen_associated: view.screenName,
        contenu: view.defaultContent
      })
    }
    await infoBulleStore.fetchApplicationInformationsBulles()
  }
  console.log(infoBulleStore.informations_bulles)
}

initData()
</script>
<template>
  <div v-if="!isCreated">
    <div v-for="competence in competencesList" :key="competence.id">
      <div style="display: flex; align-items: center">
        <v-checkbox
          :label="competence.libelle"
          :value="competence.id"
          density="compact"
          v-model="competencesChecked"
          @click="
            () => {
              const idx = competencesChecked.indexOf(competence.id)
              if (idx === -1) {
                competencesChecked.push(competence.id)
              } else {
                competencesChecked.splice(idx, 1)
              }
            }
          "
          style="margin-right: 8px"
        />
      </div>
    </div>
    <v-row>
      <v-col cols="5">
        <v-btn
          color="primary"
          @click="competencesChecked = competencesList.map((c) => c.id)"
          class="mb-4"
        >
          Sélectionner toutes les compétences
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn color="primary" @click="createPDF()" class="mb-4"> Générer le PDF </v-btn>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-btn color="primary" @click="downloadPDF()" class="mb-4"> Télécharger le PDF </v-btn>
  </div>
  <div v-if="isCreating">
    <v-overlay :model-value="true" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFormationStore } from '@/stores/formationStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import pdfMake from 'pdfmake/build/pdfmake.js'
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js'

pdfMake.vfs = pdfFonts.vfs

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const competenceStore = useCompetenceStore()

competenceStore.fetchCompetences()

const isCreating = ref(false)
const isCreated = ref(false)
const competencesList = ref([])
const competencesChecked = ref([])

const pdfDoc = ref(null)

const initData = () => {
  competencesList.value = competenceStore.competences.filter(
    (c) => c.version_id === parcoursStore.versionSelected.id
  )
  competencesChecked.value = competencesList.value.map((c) => c.id)
}

const createPDF = async () => {
  isCreating.value = true

  const competencesSelected = competencesList.value.filter((c) =>
    competencesChecked.value.includes(c.id)
  )

  const content = []

  content.push({
    table: {
      widths: ['*'],
      body: [
        [
          {
            text:
              'Formation : ' +
              formationStore.formationSelected.libelle +
              ' .\n Liste des compétences créées dans Esup-ORA.',
            fillColor: '#000000',
            color: '#ffffff',
            bold: true,
            fontSize: 14,
            margin: [5, 5, 5, 5]
          }
        ]
      ]
    },
    layout: 'noBorders',
    margin: [0, 10, 0, 10]
  })

  for (const competence of competencesSelected) {
    content.push({
      table: {
        widths: ['*'],
        body: [
          [
            {
              text:
                competence.libelle +
                (competence.competence_contextualisee
                  ? `\n\n Compétence contextualisée : ${competence.competence_contextualisee}`
                  : ''),
              fillColor: competence.color_hexadecimal,
              color: '#ffffff',
              bold: true,
              fontSize: 14,
              margin: [5, 5, 5, 5]
            }
          ]
        ]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 10]
    })

    // Critères
    if (competence.critere_exigences?.length) {
      content.push({
        text: "Critères d'exigence",
        style: 'subheader'
      })
      content.push({
        ul: competence.critere_exigences.map((c) => c.libelle)
      })
    }

    // Familles
    if (competence.famille_de_situations?.length) {
      content.push({
        text: 'Familles de situations',
        style: 'subheader',
        margin: [0, 10, 0, 0]
      })
      content.push({
        ul: competence.famille_de_situations.map((f) => f.libelle)
      })
    }
    // séparation visuelle
    content.push({ text: '', margin: [0, 0, 0, 10] })
  }

  const docDefinition = {
    content,
    styles: {
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 6, 0, 3]
      }
    }
  }

  pdfDoc.value = pdfMake.createPdf(docDefinition)

  setTimeout(() => {
    isCreating.value = false
    isCreated.value = true
  }, 1500)
}

const downloadPDF = () => {
  if (!pdfDoc.value) return
  pdfDoc.value.download('competences.pdf')
}

initData()
</script>

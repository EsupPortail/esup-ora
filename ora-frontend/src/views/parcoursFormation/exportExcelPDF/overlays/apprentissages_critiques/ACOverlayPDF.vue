
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
    // === Carte titre ===
    content.push({
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                { text: competence.libelle, fontSize: 14, bold: true, margin: [0, 0, 0, 4] },
                competence.competence_contextualisee
                  ? {
                      text: competence.competence_contextualisee,
                      fontSize: 11,
                      color: '#0000000',
                      margin: [0, 0, 0, 8]
                    }
                  : {}
              ],
              border: [false, false, false, false],
              margin: [12, 8, 12, 8]
            }
          ]
        ]
      },
          layout: {
            fillColor: () => competence.color_hexadecimal,
            hLineWidth: () => 0,
            vLineWidth: () => 0
          },
          margin: [0, 6, 0, 2]
    })

    // === Critères ===
    if (competence.critere_exigences?.length) {
      content.push({ text: "Critères d'exigence", style: 'subheader' })
      content.push({
        ul: competence.critere_exigences.map((c) => c.libelle),
        margin: [10, 0, 0, 8]
      })
    }

    // === Familles ===
    if (competence.famille_de_situations?.length) {
      content.push({ text: 'Familles de situations', style: 'subheader' })
      content.push({
        ul: competence.famille_de_situations.map((f) => f.libelle),
        margin: [10, 0, 0, 8]
      })
    }

    // === Niveaux + AC ===
    if (competence.niveau?.length) {
      content.push({ text: 'Apprentissages critiques par niveaux', style: 'subheader', margin: [0, 10, 0, 5] })

      const niveaux = competence.niveau.sort((a, b) => a.print_order - b.print_order)

      for (const niv of niveaux) {
        // Titre du niveau (bande colorée)
        content.push({
          table: {
            widths: ['*'],
            body: [[{ text: 'Niveau ' + niv.libelle, bold: true, color: '#fff', margin: [8, 4, 8, 4] }]]
          },
          layout: {
            fillColor: () => competence.color_hexadecimal,
            hLineWidth: () => 0,
            vLineWidth: () => 0
          },
          margin: [0, 6, 0, 2]
        })

        if (niv.apprentissage_critique?.length) {
          content.push({
            ol: niv.apprentissage_critique
              .sort((a, b) => a.ordre - b.ordre)
              .map((ac) => ac.libelle),
            margin: [15, 0, 0, 6]
          })
        }
      }
    }

    // Saut de page
    content.push({ text: '', pageBreak: 'after' })
  }

  const docDefinition = {
    content,
    styles: {
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 8, 0, 4],
        color: '#222'
      }
    }
  }

  pdfDoc.value = pdfMake.createPdf(docDefinition)

  setTimeout(() => {
    isCreating.value = false
    isCreated.value = true
  }, 1200)
}

const downloadPDF = () => {
  if (!pdfDoc.value) return
  pdfDoc.value.download('apprentissages_critiques.pdf')
}

initData()
</script>

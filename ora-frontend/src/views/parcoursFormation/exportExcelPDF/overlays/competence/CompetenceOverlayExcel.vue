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
        <v-btn color="primary" @click="createExcel()" class="mb-4">
          Générer le fichier Excel
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-btn color="primary" @click="downloadExcel()" class="mb-4">
      Télécharger le fichier Excel
    </v-btn>
  </div>
  <div v-if="isCreating">
    <v-overlay :model-value="true" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useParcoursStore } from '@/stores/parcoursStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const parcoursStore = useParcoursStore()
const competenceStore = useCompetenceStore()

competenceStore.fetchCompetences()

const isCreating = ref(false)
const isCreated = ref(false)
const competencesList = ref([])
const competencesChecked = ref([])

const excelBuffer = ref(null)

const initData = () => {
  competencesList.value = competenceStore.competences.filter(
    (c) => c.version_id === parcoursStore.versionSelected.id
  )
  competencesChecked.value = competencesList.value.map((c) => c.id)
}

const createExcel = async () => {
  isCreating.value = true

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Compétences')

  // === Entêtes ===
  sheet.addRow(['Nom de la compétence', "Critères d'exigence", 'Familles de situations'])
  const headerRow = sheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF000000' }
  }

  sheet.getColumn(1).width = 40
  sheet.getColumn(2).width = 40
  sheet.getColumn(3).width = 40

  const competencesSelected = competencesList.value.filter((c) =>
    competencesChecked.value.includes(c.id)
  )

  let currentRow = 2

  for (const competence of competencesSelected) {
    const libelle =
      competence.libelle +
      (competence.competence_contextualisee ? ` - ${competence.competence_contextualisee}` : '')

    const criteres = competence.critere_exigences?.map((c) => c.libelle) || []
    const familles = competence.famille_de_situations?.map((f) => f.libelle) || []

    const maxRows = Math.max(criteres.length, familles.length, 1)

    for (let i = 0; i < maxRows; i++) {
      const row = sheet.getRow(currentRow)

      // Colonne 1 : compétence (juste à la 1ère ligne du bloc)
      if (i === 0) {
        row.getCell(1).value = libelle
        row.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
        row.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: competence.color_hexadecimal.replace('#', 'FF') }
        }
      }

      // Colonne 2 : critère si dispo
      row.getCell(2).value = criteres[i] ?? ''

      // Colonne 3 : famille si dispo
      row.getCell(3).value = familles[i] ?? ''

      currentRow++
    }

    // Petite ligne vide entre les blocs
    currentRow++
  }
  excelBuffer.value = await workbook.xlsx.writeBuffer()
  setTimeout(() => {
    isCreating.value = false
    isCreated.value = true
  }, 1500)
}

const downloadExcel = () => {
  if (!excelBuffer.value) return
  saveAs(new Blob([excelBuffer.value]), 'competences.xlsx')
}

initData()
</script>
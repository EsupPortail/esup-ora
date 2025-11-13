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
  console.log(competencesList)
}

const createExcel = async () => {
  isCreating.value = true;

  const workbook = new ExcelJS.Workbook();

  const competencesSelected = competencesList.value.filter((c) =>
    competencesChecked.value.includes(c.id)
  );

  for (const competence of competencesSelected) {
    // === Feuille par compétence ===
    const sheet = workbook.addWorksheet(
      competence.libelle.substring(0, 31) // Excel limite à 31 caractères
    );

    // === Titre de la feuille ===
    sheet.addRow([`Compétence : ${competence.libelle}`]);
    sheet.getRow(1).font = { bold: true, size: 14 };
    sheet.addRow([]); // ligne vide

    // === Colonnes ===
    sheet.addRow(["Niveau", "Apprentissages critiques"]);
    const headerRow = sheet.getRow(sheet.rowCount);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };

    sheet.getColumn(1).width = 20;
    sheet.getColumn(2).width = 80;

    // === Trier les niveaux par print_order ===
    const niveaux = (competence.niveau || []).sort(
      (a, b) => a.print_order - b.print_order
    );

    for (const niveau of niveaux) {
      // Ligne titre du niveau
      const niveauRow = sheet.addRow([niveau.libelle]);
      niveauRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      niveauRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: competence.color_hexadecimal.replace("#", "FF") },
      };

      // Apprentissages critiques triés par ordre
      const apprentissages = (niveau.apprentissage_critique || []).sort(
        (a, b) => a.ordre - b.ordre
      );

      for (const app of apprentissages) {
        sheet.addRow(["", app.libelle || "(vide)"]);
      }

      sheet.addRow([]); // ligne vide entre niveaux
    }
  }

  // Stockage du buffer pour téléchargement ultérieur
  excelBuffer.value = await workbook.xlsx.writeBuffer()
  setTimeout(() => {
    isCreating.value = false
    isCreated.value = true
  }, 1500)
};

const downloadExcel = () => {
  if (!excelBuffer.value) return
  saveAs(new Blob([excelBuffer.value]), 'apprentissages_critiques.xlsx')
}

initData()
</script>
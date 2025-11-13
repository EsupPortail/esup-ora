<template>
  <div v-if="!isCreated">
    <div v-for="periode in periodesList" :key="periode.id">
      <div style="display: flex; align-items: center">
        <v-checkbox
          :label="periode.libelle"
          :value="periode.id"
          density="compact"
          v-model="periodesChecked"
          @click="
            () => {
              const idx = periodesChecked.indexOf(periode.id)
              if (idx === -1) {
                periodesChecked.push(periode.id)
              } else {
                periodesChecked.splice(idx, 1)
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
          @click="periodesChecked = periodesList.map((c) => c.id)"
          class="mb-4"
        >
          Sélectionner toutes les périodes
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
import { usePeriodeStore } from '@/stores/periodeStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { useApprentissageStore } from '@/stores/apprentissageStore'

const parcoursStore = useParcoursStore()
const periodesStore = usePeriodeStore()
const apprentissageStore = useApprentissageStore()
const competenceStore = useCompetenceStore()

periodesStore.fetchPeriodes();
competenceStore.fetchCompetences()

const isCreating = ref(false)
const isCreated = ref(false)
const periodesList = ref([])
const periodesChecked = ref([])

const excelBuffer = ref(null)

const initData = () => {
    periodesList.value = periodesStore.periodes;
    periodesChecked.value = periodesList.value.map((c) => c.id)
    console.log(periodesList)
}

const createExcel = async () => {
  isCreating.value = true;

  const workbook = new ExcelJS.Workbook();

  const periodesSelected = periodesList.value.filter((c) =>
    periodesChecked.value.includes(c.id)
  );

  periodesSelected.forEach((periode) => {
    // Crée une feuille avec le nom de la période
    const sheet = workbook.addWorksheet(periode.libelle || `Période ${periode.id}`);

    // Ajoute une colonne simple
    sheet.columns = [{ header: "Enseignements", key: "libelle", width: 50 }];

    // Ajoute les lignes : uniquement le libelle de chaque enseignement
    (periode.enseignements || []).forEach((ens) => {
      sheet.addRow({ libelle: ens.libelle });
    });
  });

  // Génère le buffer Excel
  excelBuffer.value = await workbook.xlsx.writeBuffer();

  setTimeout(() => {
    isCreating.value = false;
    isCreated.value = true;
  }, 1500);
};


const downloadExcel = () => {
  if (!excelBuffer.value) return
  saveAs(new Blob([excelBuffer.value]), 'elements_constitutifs.xlsx')
}

initData()
</script>
<template>
  <div v-if="!isCreated">
    <div v-for="periode in periodeStore.periodes" :key="periode.id">
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
          @click="periodesChecked = periodeStore.periodes.map((c) => c.id)"
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
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const parcoursStore = useParcoursStore()
const periodeStore = usePeriodeStore()
const ecStore = useEcStore()  
const competenceStore = useCompetenceStore()

competenceStore.fetchCompetences()

const isCreating = ref(false)
const isCreated = ref(false)
const competencesList = ref([])
const competencesChecked = ref([])
const periodesChecked = ref([])

const excelBuffer = ref(null)

const initData = async () => {
  await periodeStore.fetchPeriodes();
  await ecStore.fetchECs();
  console.log(ecStore.ecs)
  competencesList.value = competenceStore.competences.filter(
    (c) => c.version_id === parcoursStore.versionSelected.id
  )
  competencesChecked.value = competencesList.value.map((c) => c.id)
  console.log(competencesList)
}


const createExcel = async () => {
  isCreating.value = true;

  const workbook = new ExcelJS.Workbook();

  for (const periode of periodeStore.periodes.filter((p) => periodesChecked.value.includes(p.id))) {
    // === Feuille par période ===
    const sheet = workbook.addWorksheet(
      periode.libelle.substring(0, 31) // Excel limite à 31 caractères
    );

    // === Titre de la feuille ===
    sheet.addRow([`Période : ${periode.libelle}`]);
    sheet.getRow(1).font = { bold: true, size: 14 };
    sheet.addRow([]); // ligne vide

    // === En-têtes ===
    const headers = [
      "Libellé",
      "Type",
      "Unité d’enseignement",
      "Volume horaire TP",
      "Volume horaire TD",
      "Volume horaire CM",
      "Volume horaire PT",
      "Volume horaire Étudiant",
      "Volume horaire CM+TD",
      "Crédits ECTS",
      "Travail personnel",
      "Nb étudiants min",
      "Nb étudiants max",
      "Présentiel",
      "Est présentiel",
      "Est distanciel",
      "Est hybride",
      "Est optionnel",
      "Obligatoire",
      "Ouvert aux étudiants internationaux",
      "Connecté à",
      "Est isolé",
      "Est associé",
      "Description",
      "Commentaire",
    ];

    sheet.addRow(headers);
    const headerRow = sheet.getRow(sheet.rowCount);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };

    headers.forEach((_, i) => (sheet.getColumn(i + 1).width = 20));

    // === Récupération de tous les EC liés à la période ===
    let ecs = [];

    // EC directement liés à la période (racine)
    if (periode.linked_element_constitutif) {
      for (const ec of periode.linked_element_constitutif) {
        ecs.push({
          ...ec,
          ue_libelle: "(Aucune UE)",
        });
      }
    }

    // EC liés aux unités d’enseignement de la période
    for (const ue of periode.unites_enseignement || []) {
      for (const ec of ue.elements_constitutifs || []) {
        ecs.push({
          ...ec,
          ue_libelle: ue.libelle || "",
        });
      }
    }

    // Suppression des doublons
    ecs = ecs.filter(
      (value, index, self) => index === self.findIndex((e) => e.id === value.id)
    );

    // Tri par libellé
    ecs.sort((a, b) => a.libelle.localeCompare(b.libelle));

    // === Remplissage des lignes ===
    for (const ec of ecs) {
      sheet.addRow([
        ec.libelle || "",
        ec.type || "",
        ec.ue_libelle || "",
        ec.volume_horaire_tp || "",
        ec.volume_horaire_td || "",
        ec.volume_horaire_cm || "",
        ec.volume_horaire_pt || "",
        ec.volume_horaire_etudiant || "",
        ec.volume_horaire_cm_td || "",
        ec.credits_ects || "",
        ec.travail_personnel || "",
        ec.nb_etudiant_min || "",
        ec.nb_etudiant_max || "",
        ec.presentiel || "",
        ec.est_presentiel ? "Oui" : "Non",
        ec.est_distanciel ? "Oui" : "Non",
        ec.est_hybride ? "Oui" : "Non",
        ec.est_optionnel ? "Oui" : "Non",
        ec.obligatoire ? "Oui" : "Non",
        ec.est_ouvert_etudiants_internationaux ? "Oui" : "Non",
        (ec.connected_to || []).map((c) => c.libelle).join(", "),
        ec.est_isole ? "Oui" : "Non",
        ec.est_assoce ? "Oui" : "Non",
        ec.description || "",
        ec.commentaire || "",
      ]);
    }

    // Ligne vide à la fin
    sheet.addRow([]);
  }

  // === Génération du buffer pour téléchargement ===
  excelBuffer.value = await workbook.xlsx.writeBuffer();

  setTimeout(() => {
    isCreating.value = false;
    isCreated.value = true;
  }, 1500);
};


const downloadExcel = () => {
  if (!excelBuffer.value) return
  saveAs(new Blob([excelBuffer.value]), 'maquette.xlsx')
}

initData()
</script>
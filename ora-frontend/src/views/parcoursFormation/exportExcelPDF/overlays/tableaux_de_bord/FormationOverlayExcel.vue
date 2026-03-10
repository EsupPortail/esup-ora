<template>
  <div
  v-if="!isCreated"
    style="
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 620px;
      height: 620px;
      max-height: 620px;
    "
  >
    <v-row>
      <v-col cols="12" class="text-center">
        <h2>Export final au format Excel de l'ensemble de la formation</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <h3 style="display: inline-block">Exporter les compétences</h3>
        <div
          v-for="competence in competenceStore.competences.filter(
            (c) => c.version_id === parcoursStore.versionSelected.id
          )"
          :key="competence.id"
        >
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
      </v-col>
      <v-divider vertical :thickness="2" />
      <v-col offset="1" cols="5">
        <h3 style="display: inline-block">
          Exporter les apprentissages critiques des compétences suivantes :
        </h3>
        <div
          v-for="competence in competenceStore.competences.filter(
            (c) => c.version_id === parcoursStore.versionSelected.id
          )"
          :key="competence.id"
        >
          <div style="display: flex; align-items: center">
            <v-checkbox
              :label="competence.libelle"
              :value="competence.id"
              density="compact"
              v-model="competencesCheckedForAC"
              @click="
                () => {
                  const idx = competencesCheckedForAC.indexOf(competence.id)
                  if (idx === -1) {
                    competencesCheckedForAC.push(competence.id)
                  } else {
                    competencesCheckedForAC.splice(idx, 1)
                  }
                }
              "
              style="margin-right: 8px"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider :thickness="2" class="my-4" />
    <v-row>
      <v-col cols="5">
        <h3 style="display: inline-block">
          Exporter les enseignements des périodes suivantes :
        </h3>
 <div
      v-for="periode in periodeStore.periodes"
      :key="periode.id"
      style="display: flex; align-items: center; margin-bottom: 4px;"
    >
      <v-checkbox
        :label="periode.libelle"
        :value="periode.id"
        density="compact"
        v-model="periodesCheckedForEC"
        @change="onPeriodeMaquetteChange(periode.id)"
        style="margin-right: 8px"
      />
    </div>
          </v-col>
      <v-col offset="1" cols="5">
        <h3 style="display: inline-block">Exporter les éléments constitutifs de la maquette des périodes suivantes :</h3>
 <div
      v-for="periode in periodeStore.periodes"
      :key="periode.id"
      style="display: flex; align-items: center; margin-bottom: 4px;"
    >
      <v-checkbox
        :label="periode.libelle"
        :value="periode.id"
        density="compact"
        v-model="periodesCheckedForMaquette"
        @change="onPeriodeMaquetteChange(periode.id)"
        style="margin-right: 8px"
      />
    </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
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
import { useEcStore } from '@/stores/elementConstitutifStore'
import { usePeriodeStore } from '@/stores/periodeStore'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const parcoursStore = useParcoursStore()
const competenceStore = useCompetenceStore()
const periodeStore = usePeriodeStore()
const ecStore = useEcStore()

const competencesChecked = ref([])
const competencesCheckedForAC = ref([])

const competencesList = ref([])
const periodesCheckedForEC = ref([])
const periodesCheckedForMaquette = ref([])

const excelBuffer = ref(null)

const isCreating = ref(false)
const isCreated = ref(false)

const initData = async () => {
  await competenceStore.fetchCompetences()
  await periodeStore.fetchPeriodes()

  const competencesVersion = competenceStore.competences
    .filter(c => c.version_id === parcoursStore.versionSelected.id)
    .map(c => c.id)

  competencesChecked.value = [...competencesVersion]
  competencesCheckedForAC.value = [...competencesVersion]

  const allPeriodesId = periodeStore.periodes.map(p => p.id)

  periodesCheckedForEC.value = [...allPeriodesId]
  periodesCheckedForMaquette.value = [...allPeriodesId]
}

const downloadExcel = () => {
  if (!excelBuffer.value) return
  saveAs(new Blob([excelBuffer.value]), 'formation.xlsx')
}


const createExcel = async () => {
  isCreating.value = true;

  const workbook = new ExcelJS.Workbook();

  /* -------------------------------------------------------------------------- */
  /*                               1) COMPÉTENCES                               */
  /* -------------------------------------------------------------------------- */

  const sheetCompetences = workbook.addWorksheet("Compétences");

  sheetCompetences.addRow([
    "Nom de la compétence",
    "Critères d'exigence",
    "Familles de situations",
  ]);
  let header = sheetCompetences.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF000000" } };
  sheetCompetences.getColumn(1).width = 40;
  sheetCompetences.getColumn(2).width = 40;
  sheetCompetences.getColumn(3).width = 40;

  const selectedCompetences = competenceStore.competences
    .filter((c) => competencesChecked.value.includes(c.id));

  let rowIndex = 2;
  for (const c of selectedCompetences) {
    const libelle =
      c.libelle +
      (c.competence_contextualisee ? ` - ${c.competence_contextualisee}` : "");

    const criteres = c.critere_exigences?.map((x) => x.libelle) || [];
    const familles = c.famille_de_situations?.map((x) => x.libelle) || [];

    const maxRows = Math.max(criteres.length, familles.length, 1);

    for (let i = 0; i < maxRows; i++) {
      const row = sheetCompetences.getRow(rowIndex);

      if (i === 0) {
        row.getCell(1).value = libelle;
        row.getCell(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
        row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
        row.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: c.color_hexadecimal.replace("#", "FF") },
        };
      }

      row.getCell(2).value = criteres[i] || "";
      row.getCell(3).value = familles[i] || "";

      rowIndex++;
    }

    rowIndex++; // espace entre compétences
  }

  /* -------------------------------------------------------------------------- */
  /*                     2) APPRENTISSAGES CRITIQUES (AC)                      */
  /* -------------------------------------------------------------------------- */

  const sheetAC = workbook.addWorksheet("Apprentissages Critiques");

  const selectedForAC = competenceStore.competences
    .filter((c) => competencesCheckedForAC.value.includes(c.id));

  for (const competence of selectedForAC) {
    sheetAC.addRow([`Compétence : ${competence.libelle}`]);
    sheetAC.getRow(sheetAC.rowCount).font = { bold: true, size: 14 };
    sheetAC.addRow([]);

    sheetAC.addRow(["Niveau", "Apprentissages critiques"]);
    let headerRow = sheetAC.getRow(sheetAC.rowCount);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };

    sheetAC.getColumn(1).width = 20;
    sheetAC.getColumn(2).width = 80;

    const niveaux = (competence.niveau || []).sort(
      (a, b) => a.print_order - b.print_order
    );

    for (const niveau of niveaux) {
      const lvlRow = sheetAC.addRow([niveau.libelle]);
      lvlRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      lvlRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: competence.color_hexadecimal.replace("#", "FF") },
      };

      const apps = (niveau.apprentissage_critique || []).sort(
        (a, b) => a.ordre - b.ordre
      );

      for (const ac of apps) {
        sheetAC.addRow(["", ac.libelle || "(vide)"]);
      }

      sheetAC.addRow([]);
    }

    sheetAC.addRow([]);
  }

  /* -------------------------------------------------------------------------- */
  /*                     3) ENSEIGNEMENTS PAR PÉRIODE (EC)                      */
  /* -------------------------------------------------------------------------- */

  for (const periode of periodeStore.periodes.filter((p) =>
    periodesCheckedForEC.value.includes(p.id)
  )) {
    const sheet = workbook.addWorksheet(
      ("EC - " + periode.libelle).substring(0, 31)
    );

    sheet.columns = [{ header: "Enseignements", key: "libelle", width: 50 }];

    for (const ens of periode.enseignements || []) {
      sheet.addRow({ libelle: ens.libelle });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             4) MAQUETTE PAR PÉRIODE                         */
  /* -------------------------------------------------------------------------- */

  for (const periode of periodeStore.periodes.filter((p) =>
    periodesCheckedForMaquette.value.includes(p.id)
  )) {
    const sheet = workbook.addWorksheet(
      ("Maquette - " + periode.libelle).substring(0, 31)
    );

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
    let hdr = sheet.getRow(sheet.rowCount);
    hdr.font = { bold: true, color: { argb: "FFFFFFFF" } };
    hdr.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };
    headers.forEach((_, i) => (sheet.getColumn(i + 1).width = 20));

    let ecs = [];

    if (periode.linked_element_constitutif) {
      for (const ec of periode.linked_element_constitutif) {
        ecs.push({ ...ec, ue_libelle: "(Aucune UE)" });
      }
    }

    for (const ue of periode.unites_enseignement || []) {
      for (const ec of ue.elements_constitutifs || []) {
        ecs.push({ ...ec, ue_libelle: ue.libelle || "" });
      }
    }

    ecs = ecs.filter(
      (value, index, self) => index === self.findIndex((e) => e.id === value.id)
    );

    ecs.sort((a, b) => a.libelle.localeCompare(b.libelle));

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

    sheet.addRow([]);
  }

  /* -------------------------------------------------------------------------- */
  /*                         EXPORT ET FIN DE GÉNÉRATION                         */
  /* -------------------------------------------------------------------------- */

  excelBuffer.value = await workbook.xlsx.writeBuffer();

  setTimeout(() => {
    isCreating.value = false;
    isCreated.value = true;
  }, 1500);
};


initData()
</script>
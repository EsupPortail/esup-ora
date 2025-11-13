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
        <v-btn color="primary" @click="createPDF()" class="mb-4"> Générer le fichier PDF </v-btn>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-btn color="primary" @click="downloadPDF()" class="mb-4"> Télécharger le fichier PDF </v-btn>
  </div>
  <div v-if="isCreating">
    <v-overlay :model-value="true" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'

import { useParcoursStore } from '@/stores/parcoursStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useCompetenceStore } from '@/stores/competenceStore'

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
const pdfDoc = ref(null)

const initData = async () => {
  await periodeStore.fetchPeriodes()
  await ecStore.fetchECs()
  console.log(ecStore.ecs)
  competencesList.value = competenceStore.competences.filter(
    (c) => c.version_id === parcoursStore.versionSelected.id
  )
  competencesChecked.value = competencesList.value.map((c) => c.id)
}

const createPDF = async () => {
  if (!periodesChecked.value.length) return
  isCreating.value = true
  isCreated.value = false

  let periodesSelected = periodeStore.periodes.filter((p) => periodesChecked.value.includes(p.id))
  let content = []

  for (let periode of periodesSelected) {
    const leftColor = periode.color_hexadecimal || '#2E7D32' // barre gauche colorée

    // === Bloc titre de la période ===
    content.push({
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                {
                  text: periode.libelle || `Période ${periode.id}`,
                  fontSize: 14,
                  bold: true,
                  margin: [0, 0, 0, 6]
                },
                ...(periode.description || periode.resume || periode.notes
                  ? [
                      {
                        text: periode.description || periode.resume || periode.notes,
                        fontSize: 11,
                        color: '#555',
                        margin: [0, 0, 0, 4]
                      }
                    ]
                  : [])
              ],
              margin: [12, 8, 12, 8]
            }
          ]
        ]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (i) => (i === 0 ? 8 : 0),
        vLineColor: () => leftColor,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      },
      margin: [0, 12, 0, 10]
    })

    // === Titre de section ===
    content.push({ text: 'Éléments constitutifs', style: 'sectionHeader', margin: [0, 6, 0, 8] })

    // === Récupération de tous les EC (racine + UE) ===
    let ecs = []

    if (periode.linked_element_constitutif) {
      for (const ec of periode.linked_element_constitutif) {
        ecs.push({ ...ec, ue_libelle: '(Aucune UE)' })
      }
    }

    for (const ue of periode.unites_enseignement || []) {
      for (const ec of ue.elements_constitutifs || []) {
        ecs.push({ ...ec, ue_libelle: ue.libelle || '' })
      }
    }

    // Suppression doublons + tri
    ecs = ecs.filter((value, index, self) => index === self.findIndex((e) => e.id === value.id))
    ecs.sort((a, b) => a.libelle.localeCompare(b.libelle))

    if (!ecs.length) {
      content.push({
        text: 'Aucun élément constitutif trouvé pour cette période.',
        italics: true,
        margin: [8, 0, 0, 8]
      })
    } else {
      // === Découpage en deux tableaux ===
      const headersPart1 = [
        'Libellé', 'Type', 'Unité d’enseignement', 'Volume TP', 'Volume TD',
        'Volume CM', 'Volume PT', 'Volume Étudiant', 'Volume CM+TD',
        'Crédits ECTS', 'Travail personnel', 'Nb Étudiants min', 'Nb Étudiants max',
        'Présentiel', 'Est présentiel', 'Est distanciel'
      ]

      const headersPart2 = [
        'Libellé', 'Type', 'Est hybride', 'Est optionnel', 'Obligatoire',
        'Ouvert Intern.', 'Connecté à', 'Isolé', 'Associé', 'Description', 'Commentaire'
      ]

      const tableBody1 = [headersPart1.map(h => ({ text: h, bold: true, fillColor: '#f2f2f2' }))]
      const tableBody2 = [headersPart2.map(h => ({ text: h, bold: true, fillColor: '#f2f2f2' }))]

      for (const ec of ecs) {
        tableBody1.push([
          ec.libelle || '',
          ec.type || '',
          ec.ue_libelle || '',
          ec.volume_horaire_tp ?? '',
          ec.volume_horaire_td ?? '',
          ec.volume_horaire_cm ?? '',
          ec.volume_horaire_pt ?? '',
          ec.volume_horaire_etudiant ?? '',
          ec.volume_horaire_cm_td ?? '',
          ec.credits_ects ?? '',
          ec.travail_personnel ?? '',
          ec.nb_etudiant_min ?? '',
          ec.nb_etudiant_max ?? '',
          ec.presentiel ?? '',
          ec.est_presentiel ? 'Oui' : 'Non',
          ec.est_distanciel ? 'Oui' : 'Non'
        ])

        tableBody2.push([
          ec.libelle || '',
          ec.type || '',
          ec.est_hybride ? 'Oui' : 'Non',
          ec.est_optionnel ? 'Oui' : 'Non',
          ec.obligatoire ? 'Oui' : 'Non',
          ec.est_ouvert_etudiants_internationaux ? 'Oui' : 'Non',
          (ec.connected_to || []).map(c => c.libelle).join(', '),
          ec.est_isole ? 'Oui' : 'Non',
          ec.est_assoce ? 'Oui' : 'Non',
          ec.description || '',
          ec.commentaire || ''
        ])
      }

      // === Premier tableau ===
      content.push({
        table: { headerRows: 1, body: tableBody1, widths: [60,45,60,30,30,30,30,35,35,30,35,35,35,30,40,40] },
        layout: { hLineColor: ()=>'#ccc', vLineColor: ()=>'#ccc', hLineWidth: ()=>0.5, vLineWidth: ()=>0.5 },
        fontSize: 9,
        margin: [0,0,0,12]
      })

      // === Saut de page + second tableau ===
      content.push({ text: '', pageBreak: 'after' })
      content.push({ text: 'Éléments constitutifs (suite)', style: 'sectionHeader', margin: [0,0,0,8] })

      content.push({
        table: { headerRows: 1, body: tableBody2, widths: [60,45,40,40,35,40,60,30,30,100,100] },
        layout: { hLineColor: ()=>'#ccc', vLineColor: ()=>'#ccc', hLineWidth: ()=>0.5, vLineWidth: ()=>0.5 },
        fontSize: 9,
        margin: [0,0,0,12]
      })
    }

    // Saut de page entre périodes
    content.push({ text: '', margin: [0, 8, 0, 8], pageBreak: 'after' })
  }

  // === Définition du document PDF ===
  let docDefinition = {
    pageOrientation: 'landscape',
    content,
    styles: { sectionHeader: { fontSize: 12, bold: true, color: '#222' } },
    defaultStyle: { fontSize: 9 },
    pageMargins: [40, 40, 40, 40]
  }

  // === Création du document PDF ===
  try {
    pdfDoc.value = markRaw(pdfMake.createPdf(docDefinition))
    isCreating.value = false
    isCreated.value = true
  } catch (err) {
    console.error('Erreur génération PDF', err)
    isCreating.value = false
    isCreated.value = false
  }
}


const downloadPDF = () => {
  if (!pdfDoc.value) return
  pdfDoc.value.download('maquette.pdf')
}

initData()
</script>
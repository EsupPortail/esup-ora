<template>
  <div>
    <div v-if="!isCreated">
      <div v-for="periode in periodes" :key="periode.id" style="display:flex; align-items:center; margin-bottom:6px;">
        <v-checkbox
          :label="periode.libelle || ('Période ' + periode.id)"
          :value="periode.id"
          density="compact"
          v-model="periodesChecked"
          @click="toggleChecked(periode.id)"
          style="margin-right:8px"
        />
      </div>

      <v-row>
        <v-col cols="5">
          <v-btn
            color="primary"
            @click="selectAll"
            class="mb-4"
          >
            Sélectionner toutes les périodes
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn color="primary" @click="createPDF()" class="mb-4" :disabled="!periodesChecked.length">
            Générer le fichier PDF
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-btn color="primary" @click="downloadPDF()" class="mb-4">
        Télécharger le fichier PDF
      </v-btn>
    </div>

    <div v-if="isCreating">
      <v-overlay :model-value="true" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
      </v-overlay>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePeriodeStore } from '@/stores/periodeStore';
import { useParcoursStore } from '@/stores/parcoursStore' // existant dans ton projet
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.vfs;


const periodesStore = usePeriodeStore()
const parcoursStore = useParcoursStore()


const isCreating = ref(false)
const isCreated = ref(false)
const periodes = ref([])
const periodesChecked = ref([])
const pdfDoc = ref(null)


const initData = async () => {
    await periodesStore.fetchPeriodes();

    if (periodesStore.periodes && periodesStore.periodes.length) {
    periodes.value = periodesStore.periodes
  } else {
    if (parcoursStore?.periodes && parcoursStore.periodes.length) {
      periodes.value = parcoursStore.periodes
    } else if (parcoursStore?.versionSelected && parcoursStore.versionSelected.linked_periodes_maquette) {
      periodes.value = parcoursStore.versionSelected.linked_periodes_maquette
    } else {
      periodes.value = [] // vide si on ne trouve rien
    }
  }

  // par défaut tout coché si on a des périodes
  periodesChecked.value = periodes.value.map(p => p.id)
}

onMounted(initData)

// utilitaires tolérants pour récupérer champs d'objets potentiellement différents
function pickFirst(obj = {}, keys = []) {
  for (const k of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k]
      if (v !== undefined && v !== null && String(v).trim() !== '') return String(v)
    }
  }
  return ''
}

const toggleChecked = (id) => {
  const idx = periodesChecked.value.indexOf(id)
  if (idx === -1) periodesChecked.value.push(id)
  else periodesChecked.value.splice(idx, 1)
}

const selectAll = () => {
  periodesChecked.value = periodes.value.map(p => p.id)
}

const createPDF = async () => {
  if (!periodesChecked.value.length) return
  isCreating.value = true
  isCreated.value = false

  const periodesSelected = periodes.value.filter(p => periodesChecked.value.includes(p.id))
  const content = []
    console.log('Creating PDF for periodes', periodesStore.periodes)
  for (const periode of periodesSelected) {
    // bande gauche colorée : utilise periode.color_hexadecimal si présent
    const leftColor = periode.color_hexadecimal || '#2E7D32' // fallback

    // Carte titre de la période
    content.push({
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                { text: periode.libelle || `Période ${periode.id}`, fontSize: 14, bold: true, margin: [0, 0, 0, 6] },
                // description / dates / note si dispo
                ...(pickFirst(periode, ['description','resume','notes']) ? [{ text: pickFirst(periode, ['description','resume','notes']), fontSize: 11, color: '#555', margin: [0,0,0,4] }] : [])
              ],
              margin: [12, 8, 12, 8]
            }
          ]
        ]
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (i) => (i === 0 ? 8 : 0), // épaisseur de la barre gauche
        vLineColor: () => leftColor,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      },
      margin: [0, 12, 0, 10]
    })

    // Section Enseignements
    content.push({ text: 'Enseignements', style: 'sectionHeader', margin: [0, 4, 0, 6] })

    const enseignements = periode.enseignements || periode.enseignants || periode.elements || []

    if (!enseignements.length) {
      content.push({ text: 'Aucun enseignement trouvé pour cette période.', italics: true, margin: [8, 0, 0, 8] })
    } else {
      // Construire tableau : entêtes + lignes
      const tableBody = []
     tableBody.push([{ text: 'Intitulé enseignement', bold: true }, { text: 'Apprentissages critiques', bold: true }])
     
     for (const ens of enseignements) {
        const intitule = pickFirst(ens, ['intitule','libelle','titre','title','name']) || '(sans intitulé)'
 const acList = (ens.apprentissages_critiques || [])
          .map(ac => ac.libelle)
          .join('\n') || '—'
 
        tableBody.push([
          { text: intitule },
          { text: acList }
        ])
        tableBody.push([{ text: intitule }, { text: acList}])
      }

      content.push({
        table: {
          headerRows: 1,
          widths: ['40%', '60%'],
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex, node, columnIndex) => (rowIndex === 0 ? '#f2f2f2' : null)
        },
        margin: [0, 0, 0, 8]
      })
    }

    // petite séparation / saut de page
    content.push({ text: '', margin: [0, 6, 0, 6], pageBreak: 'after' })
  }

  const docDefinition = {
    content,
    styles: {
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: '#222'
      }
    },
    defaultStyle: {
      fontSize: 11
    },
    pageMargins: [40, 40, 40, 40]
  }

  // création du doc
  try {
    pdfDoc.value = pdfMake.createPdf(docDefinition)
    // on marque prêt
    isCreating.value = false
    isCreated.value = true
  } catch (err) {
    console.error('Erreur génération PDF', err)
    isCreating.value = false
    // laisser isCreated = false pour refaire une tentative
  }
}

const downloadPDF = () => {
  if (!pdfDoc.value) return
  pdfDoc.value.download('periodes_enseignements.pdf')
}
</script>

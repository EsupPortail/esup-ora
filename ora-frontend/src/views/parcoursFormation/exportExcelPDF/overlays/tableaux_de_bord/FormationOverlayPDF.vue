<template>
  <div v-if="!isCreated" style="overflow-y: auto; overflow-x: hidden; min-height: 400px">
    <!-- Titre -->
    <v-row>
      <v-col cols="12" class="text-center">
        <h2>Export du Référentiel de Compétences (PDF)</h2>
        <p class="text-grey-darken-1 text-body-2">Une page par compétence — Format A4 paysage</p>
      </v-col>
    </v-row>

    <!-- Sélection des compétences -->
    <v-row>
      <v-col cols="12">
        <h3 class="mb-2">Compétences à exporter</h3>

        <div
          v-for="competence in competencesVersion"
          :key="competence.id"
          style="display: flex; align-items: center; margin-bottom: 2px"
        >
          <v-checkbox
            :value="competence.id"
                      :label="
            competence.competence_contextualisee
              ? `${competence.libelle} - ${competence.competence_contextualisee}`
              : competence.libelle
          "

            density="compact"
            v-model="competencesChecked"
            hide-details
            style="margin-right: 6px; flex: none"
          />
          <!-- Badge couleur -->
          <span
            :style="{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: competence.color_hexadecimal || '#999',
              marginRight: '8px',
              flexShrink: 0
            }"
          />
          <span style="font-size: 14px">{{ competence.competence_contextualisee }}</span>
        </div>
      </v-col>
    </v-row>

    <!-- Actions rapides -->
    <v-row class="mt-2">
      <v-col cols="auto">
        <v-btn
          variant="outlined"
          size="small"
          @click="competencesChecked = competencesVersion.map((c) => c.id)"
        >
          Tout sélectionner
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" size="small" @click="competencesChecked = []">
          Tout désélectionner
        </v-btn>
      </v-col>
    </v-row>

    <!-- Générer -->
    <v-row class="mt-4">
      <v-col cols="auto">
        <v-btn color="primary" :disabled="!competencesChecked.length" @click="createPDF()">
          Générer le PDF
        </v-btn>
      </v-col>
    </v-row>
  </div>

  <!-- Téléchargement -->
  <div v-else style="text-align: center; padding: 32px">
    <v-btn color="success" size="large" @click="downloadPDF()" class="mb-4">
      Télécharger le Référentiel PDF
    </v-btn>
    <br />
    <v-btn variant="text" size="small" @click="reset()"> Recommencer </v-btn>
  </div>

  <!-- Overlay chargement -->
  <div v-if="isCreating">
    <v-overlay :model-value="true" contained class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate />
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useFormationStore } from '@/stores/formationStore'

const parcoursStore = useParcoursStore()
const competenceStore = useCompetenceStore()
const formationStore = useFormationStore()

const competencesChecked = ref([])
const isCreating = ref(false)
const isCreated = ref(false)
const pdfDoc = ref(null)

// ─── Données ──────────────────────────────────────────────────────────────────

const competencesVersion = computed(() =>
  competenceStore.competences.filter((c) => c.version_id === parcoursStore.versionSelected?.id)
)

const selectedCompetences = computed(() =>
  competencesVersion.value.filter((c) => competencesChecked.value.includes(c.id))
)

const formationLibelle = computed(
  () =>
    formationStore.formationSelected?.libelle ||
    parcoursStore.versionSelected?.formation?.libelle ||
    'Formation'
)

const versionLibelle = computed(() => parcoursStore.versionSelected?.libelle || '')

onMounted(async () => {
  await competenceStore.fetchCompetenceForSelectedVersion()
  competencesChecked.value = competencesVersion.value.map((c) => c.id)
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function reset() {
  isCreated.value = false
  pdfDoc.value = null
}

function downloadPDF() {
  if (!pdfDoc.value) return
  pdfDoc.value.download('referentiel-competences.pdf')
}

/**
 * Convertit une couleur hex (#RRGGBB) en format pdfMake (#RRGGBB déjà ok,
 * mais s'assure qu'elle est valide, sinon fallback gris).
 */
function safeColor(hex) {
  if (!hex) return '#888888'
  return hex.startsWith('#') ? hex : `#${hex}`
}

/**
 * Calcule une couleur de texte (blanc ou noir) lisible sur un fond donné.
 */
function contrastColor(hex) {
  if (!hex) return '#ffffff'
  const color = hex.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff'
}

// ─── Page 1 : vue synthétique (reproduit le slide 1 du PDF SVT) ──────────────
//
// Structure :
//   Header sombre (RÉFÉRENTIEL | NOM FORMATION | VERSION)
//   Sous-header colonnes : COMPÉTENCES | COMPOSANTES ESSENTIELLES | CONTEXTES
//   Une ligne par compétence :
//     - Colonne 1 : badge coloré  libelle + competence_contextualisee
//     - Colonne 2 : criteres_exigences  (bullet list)
//     - Colonne 3 : famille_de_situations (bullet list, bordure pointillée gauche)

function buildSummaryPage(competences) {
  // ── En-tête identique aux autres pages ─────────────────────────────────────
  const header = buildPageHeader()

  // ── Sous-header des 3 colonnes ─────────────────────────────────────────────
  const colHeaders = {
    table: {
      widths: [150, '*', 230],
      body: [
        [
          {
            text: 'COMPÉTENCES',
            bold: true,
            fontSize: 8,
            color: '#888888',
            margin: [10, 6, 10, 6]
          },
          {
            text: 'COMPOSANTES ESSENTIELLES',
            bold: true,
            fontSize: 8,
            color: '#888888',
            margin: [10, 6, 10, 6]
          },
          {
            text: 'CONTEXTES',
            bold: true,
            fontSize: 8,
            color: '#888888',
            margin: [10, 6, 10, 6]
          }
        ]
      ]
    },
    layout: {
      hLineWidth: (i) => (i === 0 || i === 1 ? 0.5 : 0),
      vLineWidth: (i) => (i === 1 || i === 2 ? 0.5 : 0),
      hLineColor: () => '#dddddd',
      vLineColor: () => '#dddddd',
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0,
      fillColor: () => '#f5f5f5'
    },
    margin: [0, 0, 0, 0]
  }

  // ── Corps : une ligne par compétence ──────────────────────────────────────
  const rows = competences.map((competence) => {
    const color = safeColor(competence.color_hexadecimal)
    const textColor = contrastColor(competence.color_hexadecimal)

    // Colonne 1 — badge compétence
    const labelStack = [
      {
        text: competence.libelle,
        bold: true,
        fontSize: 11,
        color: textColor,
        margin: [0, 0, 0, competence.competence_contextualisee ? 3 : 0]
      }
    ]
    if (competence.competence_contextualisee) {
      labelStack.push({
        text: competence.competence_contextualisee,
        fontSize: 9,
        color: textColor,
        italics: false
      })
    }

    // Colonne 2 — critères d'exigence (composantes essentielles)
    const criteres = (competence.critere_exigences || []).map((c) => ({
      text: `• ${c.libelle}`,
      fontSize: 8.5,
      margin: [0, 1, 0, 1]
    }))

    // Colonne 3 — familles de situations (contextes)
    // Bordure pointillée gauche simulée par une colonne intérieure
    const familles = (competence.famille_de_situations || []).map((f) => ({
      text: `• ${f.libelle}`,
      fontSize: 8.5,
      margin: [0, 1, 0, 1]
    }))

    return [
      // Col 1 : badge coloré
      {
        stack: labelStack,
        fillColor: color,
        alignment: 'center',
        margin: [8, 10, 8, 10]
      },
      // Col 2 : composantes essentielles
      {
        stack: criteres.length > 0 ? criteres : [{ text: '—', fontSize: 8.5, color: '#bbbbbb' }],
        margin: [10, 8, 10, 8]
      },
      // Col 3 : contextes (avec fond très légèrement teinté pour distinguer)
      {
        stack: familles.length > 0 ? familles : [{ text: '—', fontSize: 8.5, color: '#bbbbbb' }],
        margin: [10, 8, 10, 8],
        // Légère teinte pour rappeler la bordure pointillée du slide SVT
        fillColor: '#fafafa'
      }
    ]
  })

  const bodyTable = {
    table: {
      widths: [150, '*', 230],
      body: rows
    },
    layout: {
      // Ligne horizontale entre chaque compétence
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 0.8),
      vLineWidth: (i) => (i === 1 || i === 2 ? 0.5 : 0),
      hLineColor: (i) => (i === 0 ? '#dddddd' : '#ffffff'),
      vLineColor: () => '#dddddd',
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0
    },
    margin: [0, 0, 0, 0]
  }

  return [header, colHeaders, bodyTable]
}

// ─── En-tête commun réutilisable ──────────────────────────────────────────────

function buildPageHeader() {
  return {
    table: {
      widths: [160, '*', 140],
      body: [
        [
          {
            stack: [
              { text: 'RÉFÉRENTIEL', fontSize: 8, color: '#aaaaaa', bold: true },
              { text: 'DE COMPÉTENCES', fontSize: 8, color: '#aaaaaa', bold: true }
            ],
            margin: [10, 4, 0, 4]
          },
          {
            text: formationLibelle.value,
            fontSize: 14,
            bold: true,
            color: '#ffffff',
            alignment: 'center',
            margin: [0, 5, 0, 5]
          },
          {
            text: versionLibelle.value,
            fontSize: 9,
            color: '#cccccc',
            alignment: 'right',
            margin: [0, 6, 10, 6]
          }
        ]
      ]
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      fillColor: () => '#2c3e50',
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0
    },
    margin: [0, 0, 0, 0]
  }
}

// ─── Construction d'une page pdfMake par compétence ──────────────────────────

/**
 * Retourne un tableau de blocs pdfMake représentant une page complète
 * pour une compétence. Chaque compétence commence sur une nouvelle page
 * (sauf la première).
 */
function buildCompetencePage(competence) {
  const color = safeColor(competence.color_hexadecimal)
  const textColor = contrastColor(competence.color_hexadecimal)

  // ── Libellé compétence (éventuellement contextualisé) ─────────────────────
  const competenceStack = [
    {
      text: competence.libelle,
      fontSize: 13,
      bold: true,
      color: textColor
    }
  ]
  if (competence.competence_contextualisee) {
    competenceStack.push({
      text: competence.competence_contextualisee,
      fontSize: 9,
      color: textColor,
      italics: true,
      margin: [0, 3, 0, 0]
    })
  }

  // ── Composantes essentielles (critères d'exigence) ────────────────────────
  const criteres = (competence.critere_exigences || []).map((c) => ({
    text: `• ${c.libelle}`,
    margin: [0, 1, 0, 1],
    fontSize: 9
  }))

  const composantesContent =
    criteres.length > 0
      ? criteres
      : [{ text: '(Aucune composante renseignée)', italics: true, fontSize: 9, color: '#999' }]

  // ── Contextes (familles de situations) ────────────────────────────────────
  const familles = (competence.famille_de_situations || []).map((f) => ({
    text: `• ${f.libelle}`,
    margin: [0, 1, 0, 1],
    fontSize: 9
  }))

  const contextesContent =
    familles.length > 0
      ? familles
      : [{ text: '(Aucun contexte renseigné)', italics: true, fontSize: 9, color: '#999' }]

  // ── Niveaux + Apprentissages Critiques ────────────────────────────────────
  const niveaux = [...(competence.niveau || [])].sort((a, b) => a.print_order - b.print_order)

  const acTableBody = [
    // En-tête du tableau niveaux/AC
    [
      {
        text: 'NIVEAUX',
        bold: true,
        fontSize: 8,
        color: '#666666',
        fillColor: '#f5f5f5',
        margin: [6, 5, 6, 5]
      },
      {
        text: 'APPRENTISSAGES CRITIQUES',
        bold: true,
        fontSize: 8,
        color: '#666666',
        fillColor: '#f5f5f5',
        margin: [6, 5, 6, 5]
      }
    ]
  ]

  if (niveaux.length === 0) {
    acTableBody.push([
      {
        text: 'Aucun niveau renseigné',
        italics: true,
        fontSize: 9,
        color: '#999',
        margin: [6, 8, 6, 8]
      },
      { text: '', margin: [6, 8, 6, 8] }
    ])
  } else {
    for (const niveau of niveaux) {
      const acs = [...(niveau.apprentissage_critique || [])].sort((a, b) => a.ordre - b.ordre)

      // Colonne gauche : niveau
      const niveauCell = {
        stack: [
          // Badge coloré avec le libellé du niveau
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: niveau.libelle,
                    bold: true,
                    fontSize: 10,
                    color: textColor,
                    fillColor: color,
                    margin: [6, 4, 6, 4]
                  }
                ]
              ]
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 4]
          },
          // Description du niveau
          ...(niveau.description
            ? [
                {
                  text: niveau.description,
                  fontSize: 8.5,
                  color: '#555555',
                  italics: true,
                  margin: [2, 0, 2, 0]
                }
              ]
            : [])
        ],
        margin: [4, 6, 4, 6],
        fillColor: '#fafafa'
      }

      // Colonne droite : liste des ACs
      const acItems =
        acs.length > 0
          ? acs.map((ac) => ({
              text: `• ${ac.libelle || '(vide)'}`,
              fontSize: 9,
              margin: [0, 1.5, 0, 1.5]
            }))
          : [{ text: '(Aucun apprentissage critique)', italics: true, fontSize: 9, color: '#aaa' }]

      const acCell = {
        stack: acItems,
        margin: [6, 8, 6, 6]
      }

      acTableBody.push([niveauCell, acCell])
    }
  }

  // ── Assemblage de la page ─────────────────────────────────────────────────
  const page = [
    // Saut de page — la synthèse est toujours page 1, donc chaque compétence commence après
    { text: '', pageBreak: 'before' },

    // ── En-tête de page (réutilise le header commun) ─────────────────────────
    buildPageHeader(),

    // ── Bandeau : badge compétence | composantes | contextes ─────────────────
    {
      table: {
        widths: [130, '*', 175],
        body: [
          [
            // Badge compétence (fond coloré)
            {
              stack: competenceStack,
              fillColor: color,
              alignment: 'center',
              margin: [8, 10, 8, 10]
            },
            // Composantes essentielles
            {
              stack: [
                {
                  text: 'COMPOSANTES ESSENTIELLES',
                  fontSize: 7.5,
                  bold: true,
                  color: '#888888',
                  margin: [0, 0, 0, 4]
                },
                ...composantesContent
              ],
              margin: [10, 8, 10, 8]
            },
            // Contextes
            {
              stack: [
                {
                  text: 'CONTEXTES',
                  fontSize: 7.5,
                  bold: true,
                  color: '#888888',
                  margin: [0, 0, 0, 4]
                },
                ...contextesContent
              ],
              margin: [10, 8, 10, 8]
            }
          ]
        ]
      },
      layout: {
        hLineWidth: (i) => (i === 0 || i === 1 ? 0.5 : 0),
        vLineWidth: (i) => (i === 1 || i === 2 ? 0.5 : 0),
        hLineColor: () => '#dddddd',
        vLineColor: () => '#dddddd',
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      },
      margin: [0, 0, 0, 0]
    },

    // Ligne séparatrice
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 761,
          y2: 0,
          lineWidth: 1.5,
          lineColor: '#dddddd'
        }
      ],
      margin: [0, 0, 0, 0]
    },

    // ── Tableau Niveaux / ACs ─────────────────────────────────────────────────
    {
      table: {
        headerRows: 1,
        widths: [195, '*'],
        body: acTableBody
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.5 : 0.5),
        vLineWidth: (i) => (i === 0 || i === 2 ? 0 : 0.5),
        hLineColor: () => '#e0e0e0',
        vLineColor: () => '#e0e0e0',
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      },
      margin: [0, 0, 0, 0]
    }
  ]

  return page
}

// ─── Génération du PDF complet ────────────────────────────────────────────────

const createPDF = async () => {
  if (!selectedCompetences.value.length) return

  isCreating.value = true
  isCreated.value = false

  // Construit le contenu : une "page" pdfMake par compétence
  const content = []

  // Page 1 : synthèse globale (slide 1 du PDF SVT)
  const summaryBlocks = buildSummaryPage(selectedCompetences.value)
  content.push(...summaryBlocks)

  // Pages suivantes : une page de détail par compétence
  selectedCompetences.value.forEach((competence) => {
    const blocks = buildCompetencePage(competence)
    content.push(...blocks)
  })

  // Footer commun sur chaque page
  const docDefinition = {
    pageOrientation: 'landscape',
    pageSize: 'A4',
    pageMargins: [30, 30, 30, 30],
    content,
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: `Référentiel de compétences — ${formationLibelle.value}`,
          fontSize: 7,
          color: '#aaaaaa',
          margin: [30, 0, 0, 0]
        },
        {
          text: `${currentPage} / ${pageCount}`,
          fontSize: 7,
          color: '#aaaaaa',
          alignment: 'right',
          margin: [0, 0, 30, 0]
        }
      ]
    }),
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10
    }
  }

  try {
    pdfDoc.value = markRaw(pdfMake.createPdf(docDefinition))
    isCreated.value = true
  } catch (err) {
    console.error('Erreur génération PDF :', err)
  } finally {
    isCreating.value = false
  }
}
</script>
<template>
  <!-- <PageInDev /> -->
  <v-row>
    <v-col cols="8">
      <v-row align="center">
        <v-col cols="auto">
          <v-icon size="36">mdi-chart-box-outline</v-icon>
        </v-col>
        <v-col cols="auto">
          <h3 style="display: inline-block; vertical-align: middle; margin-left: 8px">Maquette</h3>
          <div style="display: inline-block; margin-left: 12px">
            <AideBulles pageAsked="maquette" />
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn-toggle v-model="selectedView" mandatory>
            <v-btn value="semestre">Vue en semestre</v-btn>
            <v-btn value="bcc">Vue en bloc de connaissances et de compétences</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-col>
    <v-col offset="2" cols="2">
      <ButtonExport pageAsked="Maquette" />
    </v-col>
  </v-row>
  <v-container
    style="
      border-radius: 15px;
      margin-top: 40px;
      padding: 26px 30px;
      width: 100%;
      background-color: #fcfcfc;
      max-width: none !important;
    "
  >
    <v-row>
      <v-col cols="6">
        <template v-if="selectedView === 'semestre'">
          <MaquetteTreeView
            :isSemestre="true"
            v-model:selectedData="refDataEditionCard"
            :ajouterEnseignement="ajouterEnseignementPeriode"
            :ajouterEcDansPeriode="ajouterEcDansPeriode"
            :updateUE="updateUE"
            :refKeyRefreshTreeView="refKeyRefreshTreeView"
          />
        </template>
        <template v-else-if="selectedView === 'bcc'">
          <MaquetteTreeView
            :isSemestre="false"
            v-model:selectedData="refDataEditionCard"
            :ajouterEnseignement="ajouterEnseignementPeriode"
            :ajouterEcDansPeriode="ajouterEcDansPeriode"
            :updateUE="updateUE"
            :refKeyRefreshTreeView="refKeyRefreshTreeView"
          />
        </template>
      </v-col>
      <v-col
        cols="6"
        style="position: sticky; top: 100px; align-self: flex-start; height: fit-content"
      >
        <EditionCard
          v-if="refDataEditionCard?.id"
          @refreshTreeView="refreshTreeView"
          :refKeyRefreshTreeView="refKeyRefreshTreeView"
          :data="refDataEditionCard"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

import { useFormationStore } from '@/stores/formationStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import EditionCard from '@/views/parcoursFormation/bcc/EditionCard.vue'
import MaquetteTreeView from '@/views/parcoursFormation/bcc/MaquetteTreeView.vue'
import BCC from '@/views/parcoursFormation/bcc/BCC.vue'
import PageInDev from '@/components/PageInDev.vue'
import ButtonExport from '@/views/parcoursFormation/exportExcelPDF/ButtonExport.vue'
import AideBulles from '@/components/AideBulles.vue'
import { useParcoursStore } from '@/stores/parcoursStore'

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const periodesStore = usePeriodeStore()
const ecStore = useEcStore()
const enseignementStore = useEnseignementStore()
const competenceStore = useCompetenceStore()

const refDataEditionCard = ref({})
const refKeyRefreshTreeView = ref(0)
const selectedView = ref('semestre')

const refreshTreeView = async () => {
  refKeyRefreshTreeView.value += 1
  await nextTick()
}

const updateUE = async (ueLibelle, ueId) => {
  periodesStore.updateUE(ueLibelle, ueId)
}

const ajouterPeriodeToCompetence = async (periodeId, competenceId) => {
  await competenceStore.linkCompetenceToPeriode(competenceId, periodeId)
}

const ajouterEnseignementPeriode = async (periodeId, enseignementId) => {
  try {
    await ecStore.createECEnseignementInPeriodeByLink(periodeId, enseignementId)
  } catch (error) {
    console.error('Error adding teaching to period:', error)
  }
}

const ajouterEcDansPeriode = async (periodeId, typeEc) => {
  if (typeEc === "Unité d'enseignement") {
    await periodesStore.addUEToPeriode(periodeId)
    return
  }
  const data = await ecStore.createECInPeriode(periodeId, typeEc)

  // Vérification du retour
  if (!data || typeof data !== 'object' || !data.id) {
    console.error('Échec de création de l’EC ou données invalides :', data)
    return
  }


  if (!refDataEditionCard.value) {
    console.error('Failed to create EC')
    return
  }
}

const exporter = () => {
  console.log('Exporter clicked')
}

const lockImportation = ref(false)
// identifiant d’exécution croissant
let refId = 0

const enseignementsImportation = async () => {
  // si un import est déjà en cours, on sort
  if (lockImportation.value) {
    console.log('Importation déjà en cours...')
    return
  }

  // on marque le début de notre exécution
  lockImportation.value = true
  const myId = ++refId
  console.log(`🟢 [${myId}] Début importation`)

  try {
    await nextTick()

    console.log('Importation des enseignements dans la maquette...')

    // récupère la liste d’enseignements attendus
    const expectedEnseignementsId = enseignementStore.enseignements
      .filter((e) => e.formation_id === formationStore.formationSelected.id)
      .map((e) => e.id)

    // on collecte les ids d’enseignements déjà présents dans la maquette
    const actualId = []

    periodesStore.periodes.forEach((p) => {
      p.linked_element_constitutif.forEach((ec) => {
        if (ec.type === 'enseignement') actualId.push(ec.enseignement_id)
      })
      p.element_constitutif.forEach((ec) => {
        if (ec.type === 'enseignement') actualId.push(ec.enseignement_id)
      })
      p.unites_enseignement.forEach((ue) => {
        ue.elements_constitutifs.forEach((ec) => {
          if (ec.type === 'enseignement') actualId.push(ec.enseignement_id)
        })
      })
    })

    // détecte les enseignements manquants
    const diff = expectedEnseignementsId.filter((x) => !actualId.includes(x))

    // ajoute les enseignements manquants
    for (const missingCurrentEnsId of diff) {
      // 💡 sécurité : si un autre import a repris le lock, on annule celui-ci
      if (myId !== refId) {
        console.log(`⛔ [${myId}] Annulé (nouvel import détecté)`)
        return
      }

      const linkedEns = enseignementStore.enseignements.find((e) => e.id === missingCurrentEnsId)
      if (linkedEns) {
        console.log(
          `➕ [${myId}] Ajout de l’enseignement ${missingCurrentEnsId} dans la période ${linkedEns.periode_id}`
        )
        await ajouterEnseignementPeriode(linkedEns.periode_id, missingCurrentEnsId)
      }
    }

    // rafraîchit la vue

    await refreshTreeView()
    console.log(`✅ [${myId}] Importation terminée`)
  } catch (err) {
    console.error(`❌ [${myId}] Erreur lors de l’importation`, err)
  } finally {
    // libère le lock seulement si c’est toujours le même import
    if (myId === refId) {
      lockImportation.value = false
      console.log(`🔓 [${myId}] Lock libéré`)
    } else {
      console.log(`⚠️ [${myId}] Lock déjà repris par un nouvel import`)
    }
  }
}

const initData = async () => {
  await periodesStore.fetchPeriodes()
  await enseignementStore.fetchEnseignements()
  await ecStore.fetchECs()
  await competenceStore.fetchCompetences()
}

watch(
  () => selectedView.value,
  () => {
    refDataEditionCard.value = null
  }
)
watch(
  () => refDataEditionCard.value,
  (newVal, oldVal) => {
    refDataEditionCard.value = newVal
  },
  { deep: true }
)

watch(
  () =>
    enseignementStore.enseignements.filter(
      (e) => e.formation_id === formationStore.formationSelected.id
    ),
  async (ens) => {
    await enseignementsImportation()
  },
  { immediate: true }
)

initData()
</script>

<template>
  <v-row>
    <InformationBubble>
      <p>
        Cliquez sur le tableau puis faites défiler vers la gauche ou la droite, le haut ou le bas avec les touches directionnelles du clavier.
      </p>
      <p>
        Vous pouvez également faire défiler le tableau avec les barres de défilement sur le côté droit et en bas du tableau.
      </p>
    </InformationBubble>
  </v-row>
  <v-row>
    <v-col>
      <div class="table-container scrollable-container">
        <!-- Utilisation de v-simple-table pour un rendu standard de table -->
        <v-table class="fixed-table">
          <thead>
            <tr>
              <th
                class="headerFlip"
                v-for="(header, index) in enseignementsHeaders"
                :key="header.value"
                :class="{'sticky-header': index === 0}"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <!-- Transition-group pour gérer l'animation d'expansion -->
          <transition-group name="expand-transition" tag="tbody">
            <template
              v-for="competence in competencesList"
              :key="'competence-' + competence.id"
            >
              <!-- Ligne de Compétence -->
              <tr>
                <td
                  class="line-title sticky-column first-column"
                  :colspan="enseignementsHeaders.length"
                  style="color: rgba(9, 29, 85, 0.957); font-weight: bold"
                >
                  {{ competence.competence_contextualisee || competence.libelle }}
                  <v-btn
                    icon
                    density="compact"
                    small
                    @click="addThisCompetenceToExpanded(competence.id)"
                  >
                    <v-icon small>
                      {{
                        isCompetenceExpanded(competence.id)
                          ? 'mdi-chevron-down'
                          : 'mdi-chevron-up'
                      }}
                    </v-icon>
                  </v-btn>
                </td>
              </tr>

              <!-- Bloc des Niveaux -->
              <template v-if="isCompetenceExpanded(competence.id)">
                <template
                    v-for="niveau in competence.niveau.sort((a, b) => a.id - b.id)"
                  :key="'niveau-' + niveau.id"
                >
                  <!-- Ligne de Niveau -->
                  <tr v-if="hasApprentissageCritique(competence)">
                    <td
                      class="line-title"
                      :colspan="enseignementsHeaders.length"
                      style="font-weight: bold"
                    >
                      {{ niveau.libelle }}
                      <v-btn
                        small
                        density="compact"
                        icon
                        @click="addThisNiveauToExpanded(niveau.id)"
                      >
                        <v-icon>
                          {{
                            isNiveauExpanded(niveau.id)
                              ? 'mdi-chevron-down'
                              : 'mdi-chevron-up'
                          }}
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>

                  <!-- Lignes d'Apprentissage Critique -->
                  <template v-if="isNiveauExpanded(niveau.id)">
                    <template
                      v-for="(ac, indexAC) in niveau.apprentissage_critique"
                      :key="'ac-' + (ac.id || indexAC)"
                    >
                      <tr>
                        <!-- Première colonne sticky pour l'apprentissage critique -->
                        <td class="sticky-column first-column"
                          style="border-left: 20px solid rgba(9, 29, 85, 0.957); padding-top: 0; padding-bottom: 0;"
                        >
                          {{ ac.libelle }}
                        </td>
                        <!-- Colonnes pour la liste des enseignements de la première période -->
                        <template
                          v-for="(enseignement, indexE) in enseignementsListPeriode1"
                          :key="'enseignement1-' + indexE"
                        >
                          <td class="checkbox-cell second-column">
                            <v-checkbox
                              density="compact"
                              :model-value="isChecked(enseignement, ac)"
                              @click="handleCheck(ac, enseignement)"
                            />
                          </td>
                        </template>
                        <!-- Colonnes pour la liste des enseignements de la deuxième période -->
                        <template
                          v-for="(enseignement, indexE) in enseignementsListPeriode2"
                          :key="'enseignement2-' + indexE"
                        >
                          <td class="checkbox-cell second-column">
                            <v-checkbox
                              density="compact"
                              :model-value="isChecked(enseignement, ac)"
                              @click="handleCheck(ac, enseignement)"
                            />
                          </td>
                        </template>
                      </tr>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </transition-group>
        </v-table>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import InformationBubble from '@/components/InformationBubble.vue'

const props = defineProps({
  version: Object,
  parcours: Object,
  periode1: Object,
  periode2: Object,
  refreshComponent: Boolean
})

const competencesList = ref([])

// Rechargement des enseignements si le composant est rafraîchi
watch(
  () => props.refreshComponent,
  (newVal) => {
    if (newVal === true) {
      fetchEnseignementsOfTwoPeriodes()
    }
  }
)

const enseignementsStore = useEnseignementStore()
const enseignementsListPeriode1 = ref([])
const enseignementsListPeriode2 = ref([])

// Utilisation de Set pour gérer l'état d'expansion/collapse
const allExpandedCompetences = ref(new Set())
const allExpandedNiveaux = ref(new Set())

// Fonction de basculement pour les compétences
const addThisCompetenceToExpanded = (id) => {
  if (allExpandedCompetences.value.has(id)) {
    allExpandedCompetences.value.delete(id)
  } else {
    allExpandedCompetences.value.add(id)
  }
}

// Fonction de basculement pour les niveaux
const addThisNiveauToExpanded = (id) => {
  if (allExpandedNiveaux.value.has(id)) {
    allExpandedNiveaux.value.delete(id)
  } else {
    allExpandedNiveaux.value.add(id)
  }
}

// Vérification d'expansion
const isCompetenceExpanded = (id) => {
  return !allExpandedCompetences.value.has(id)
}

const isNiveauExpanded = (id) => {
  return !allExpandedNiveaux.value.has(id)
}

const fetchEnseignements = async (periode, tab) => {
  await enseignementsStore.fetchEnseignementsOfVersion(periode.id).then((d) => {
    tab.value = d.sort((a, b) => a.id - b.id)
  })
}

const fetchEnseignementsOfTwoPeriodes = async () => {
  await fetchEnseignements(props.periode1, enseignementsListPeriode1)
  await fetchEnseignements(props.periode2, enseignementsListPeriode2)
}
fetchEnseignementsOfTwoPeriodes()

const enseignementsHeaders = computed(() => {
  const headers = [
    {
      title: ' ',
      sortable: false,
      value: 'competence'
    }
  ]
  enseignementsListPeriode1.value.forEach((enseignement) => {
    headers.push({
      title: enseignement.libelle,
      value: 'enseignement1-' + enseignement.id
    })
  })
  enseignementsListPeriode2.value.forEach((enseignement) => {
    headers.push({
      title: enseignement.libelle,
      value: 'enseignement2-' + enseignement.id
    })
  })
  return headers
})

const isChecked = (enseignement, ac) => {
  return enseignement.apprentissages_critiques.some(
    (apprentissage) => apprentissage.id === ac.id
  )
}

const competenceStore = useCompetenceStore()
competenceStore.fetchCompetences().then(async () => {
  await competenceStore.fetchCompetenceForSelectedVersion(props.version.id).then(
    (d) => {
      competencesList.value = d
      // Tri des niveaux selon l'ordre défini
      competencesList.value.forEach((competence) => {
        competence.niveau.sort((a, b) => {
          const levels = ['Débutant', 'Intermédiaire', 'Compétent']
          return levels.indexOf(a.libelle) - levels.indexOf(b.libelle)
        })
      })
    }
  )
})

const hasApprentissageCritique = (competence) => {
  return competence.niveau.some((niveau) =>
    niveau.apprentissage_critique.some((ac) => ac.libelle !== '')
  )
}

const handleCheck = async (ac, ens) => {
  await enseignementsStore.connectEnseignementToApprentissageCritique(ens, ac)
  fetchEnseignementsOfTwoPeriodes()
}
</script>

<style scoped>
.table-container {
  overflow-y: auto;
  position: relative;
  border: 1px solid #ccc;
  /* Suppression du padding en haut pour coller le thead */
  padding: 0 10px 10px 10px;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
  height: 750px;
}

.fixed-table {
  width: 100%;
  border-collapse: collapse;
}

/* En-têtes sticky améliorés */
.fixed-table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 2px solid #ccc;
  padding: 12px;
  z-index: 2;
  /* Ombre légère pour le header */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Centrer les headers sauf le premier */
.fixed-table thead th:not(:first-child) {
  text-align: center;
}

/* Sticky pour la première colonne dans l'en-tête */
.fixed-table thead th:first-child {
  left: 0;
  z-index: 3;
  /* Ombre pour séparer la colonne */
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

/* Sticky pour la première colonne dans le corps de table */
/* Ajout de padding supplémentaire pour "éclaircir" la colonne */
.fixed-table tbody td.first-column {
  position: sticky;
  left: 0;
  background-color: #fff;
  padding: 12px 20px; /* +20px pour augmenter le padding */
  border-right: 1px solid #ccc;
  z-index: 1;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

/* Ajout d'un padding à la deuxième colonne pour créer un espace */
.fixed-table tbody td.second-column {
  padding-left: 20px;
}

/* Centrage des cellules contenant les cases à cocher */
.checkbox-cell {
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

/* Pour forcer le centrage dans les headers correspondants aux cases à cocher */
.fixed-table thead th:nth-child(n+2) {
  text-align: center;
}

/* Style optionnel pour les lignes alternées */
.fixed-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Animation d'expansion */
.expand-transition-enter-active,
.expand-transition-leave-active {
  transition: all 0.3s ease;
}
.expand-transition-enter-from,
.expand-transition-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
.expand-transition-enter-to,
.expand-transition-leave-from {
  opacity: 1;
  transform: scaleY(1);
}

/* Supprimer la bordure par défaut de l'en-tête */
.headerFlip {
  border-bottom: none !important;
}

/* Augmenter l'espace des titres de chaque ligne */
.line-title {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>

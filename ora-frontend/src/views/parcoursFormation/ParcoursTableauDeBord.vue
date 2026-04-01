<template>
  <v-row style="margin-bottom: 8px">
    <v-col cols="8">
      <h3 style="font-weight: normal; display: inline-block; align-items: center; gap: 8px">
        <v-icon left>mdi-school-outline</v-icon>
        Tableaux de bord
      </h3>
      <div style="display: inline-block; margin-left: 12px">
        <AideBulles pageAsked="tableaux-de-bord" />
      </div>
    </v-col>
    <v-col offset="2" cols="2">
      <ButtonExport pageAsked="Formation" />
    </v-col>

  </v-row>
  <v-card>
    <v-card-title class="text-h6"> </v-card-title>

    <v-table style="table-layout: fixed; width: 100%">
      <thead>
        <tr>
          <th style="width: 20%; text-align: center"></th>
          <th style="width: 40%; text-align: center">Heures d'enseignement</th>
          <th style="width: 40%; text-align: center">Crédits</th>
        </tr>
      </thead>

      <tbody v-if="formationStore.formations.length > 0">
        <!-- Ligne globale -->
        <tr>
          <td>{{ formationStore.formations.find(f => f.id === formationStore.formationSelected.id).libelle }}</td>
          <td>
            <v-progress-linear
              :model-value="refGlobalDataList.data_formation.total_volume_horaire"
              :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.heures"
              color="#488123"
              height="20"
              rounded="sm"
            >
              <template v-slot:default>
                <span
                  >{{ refGlobalDataList.data_formation.total_volume_horaire }} h /
                  {{ formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.heures }} h</span
                >
              </template>
            </v-progress-linear>
          </td>
          <td>
            <v-progress-linear
              :model-value="refGlobalDataList.data_formation.total_ects"
              :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.credits"
              color="blue"
              height="20"
              rounded="sm"
            >
              <template v-slot:default>
                <span
                  >{{ refGlobalDataList.data_formation.total_ects }} ECTS /
                  {{ formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.credits }} ECTS</span
                >
              </template>
            </v-progress-linear>
          </td>
        </tr>

        <!-- Lignes parcours -->
        <tr v-for="parcours in refGlobalDataList.parcours" :key="parcours.id">
          <td style="text-align: center">{{ parcours.libelle }}</td>
          <td>
            <v-progress-linear
              :model-value="parcours.total_volume_horaire"
              :max="500"
              color="#488123"
              height="16"
              rounded="sm"
            >
              <template v-slot:default>
                <span
                  >{{ parcours.total_volume_horaire }}h /
                  {{ formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.heures }}h</span
                >
              </template>
            </v-progress-linear>
          </td>
          <td>
            <v-progress-linear
              :model-value="parcours.total_ects"
              :max="500"
              color="blue"
              height="16"
              rounded="sm"
            >
              <template v-slot:default>
                <span
                  >{{ parcours.total_ects }} /
                  {{ formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.credits }} ECTS</span
                >
              </template>
            </v-progress-linear>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-row style="padding: 16px;">
      <v-col cols="12">
    <ul style="list-style: none;">
      <li v-for="(competence, key) in refGlobalDataList.competences" :key="competence.id">
        <v-row>
          <v-col cols="5">
            <div :style="{ backgroundColor: competence.color_hexadecimal }" class="rounded pa-3">
              <span style="color: white">{{ competence.competence_contextualisee || competence.libelle }}</span>
            </div>
          </v-col>
          <v-col cols="7">
            <v-progress-linear
              :model-value="competence.totalH"
              height="8"
              :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.heures"
              color="green"
              rounded
            ></v-progress-linear>

            <v-progress-linear
              style="margin-top: 8px"
              :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.credits"
              :model-value="competence.totalC"
              height="8"
              color="blue"
              rounded
            />
          </v-col>
        </v-row>
      </li>
    </ul>

      </v-col>
    </v-row>
    <v-list two-line>
      <v-list-item
        v-for="(competence, key) in refGlobalDataList.competences"
        :key="competence.id"
        class="mb-4"
      >
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ competence.libelle }}
            <v-progress-linear
              :model-value="competence.totalH"
              height="8"
              :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.heures"
              color="green"
              rounded
            ></v-progress-linear>

            <v-progress-linear
              style="margin-top: 8px"
              :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.credits"
              :model-value="competence.totalC"
              height="8"
              color="blue"
              rounded
            />
          </v-list-item-title>

          <v-list dense>
            <v-list-item v-for="(ac, kAc) in competence.acs" :key="ac.id" class="py-2">
              <v-row align="center">
                <v-col cols="1">
                  <strong>AC {{ kAc + 1 }}</strong>
                </v-col>
                <v-col cols="5">{{ ac.libelle }}</v-col>
                <v-col cols="6">
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-space-between mb-1">
                      <span>{{ ac.totalh }} h</span>
                      <span>{{ ac.totalC }} ECTS</span>
                    </div>
                    <v-progress-linear
                      :model-value="ac.totalh"
                      height="8"
                      :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.heures"
                      color="blue"
                      rounded
                    ></v-progress-linear>

                    <v-progress-linear
                      style="margin-top: 8px"
                      :max="formationStore.formations.find(f => f.id === formationStore.formationSelected.id).type_diplome.credits"
                      :model-value="ac.totalC"
                      height="8"
                      color="green"
                      rounded
                    ></v-progress-linear>
                  </div>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

import { useFormationStore } from '@/stores/formationStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useApprentissageStore } from '@/stores/apprentissageStore'

import ButtonExport from '@/views/parcoursFormation/exportExcelPDF/ButtonExport.vue'
import AideBulles from '@/components/AideBulles.vue'
import { all } from 'axios'

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const elementsConstitutifsStore = useEcStore()
const competenceStore = useCompetenceStore()
const enseignementStore = useEnseignementStore()
const apprentissageCritiqueStore = useApprentissageStore()

const refGlobalDataList = ref({
  data_formation: {
    total_volume_horaire: 0,
    total_ects: 0
  },
  parcours: []
})

onMounted(async () => {
  await Promise.all([
    formationStore.fetchFormation(),
    parcoursStore.fetchParcours(),
    elementsConstitutifsStore.fetchECs(),
    competenceStore.fetchCompetences(),
    enseignementStore.fetchEnseignements(),
    apprentissageCritiqueStore.fetchNiveaux()
  ])
  await initData()
})
const computedMax = computed(() => {
  let maxH = 0
  let maxC = 0

  // parcourir toutes les compétences et leurs AC
  refGlobalDataList.value.competences?.forEach((comp) => {
    comp.acs?.forEach((ac) => {
      if (ac.totalh > maxH) maxH = ac.totalh
      if (ac.totalC > maxC) maxC = ac.totalC
    })
  })

  return { maxH, maxC }
})

const getPercentage = (value, max) => {
  if (max === 0) return 0
  return (value / max) * 100
}

const initData = async () => {
  refGlobalDataList.value = {
    data_formation: {
      total_volume_horaire: 0,
      total_ects: 0
    },
    parcours: []
  }

  refGlobalDataList.value.data_formation = {
    total_volume_horaire: 0,
    total_ects: 0
  }

  refGlobalDataList.value.parcours = [
    ...parcoursStore.parcours.filter(
      (p) => p.formation_id === parcoursStore.versionSelected.formation_id
    )
  ]

  // Calcul pour chaque parcours
  refGlobalDataList.value.parcours.forEach((parcours) => {
    parcours.total_volume_horaire = 0
    parcours.total_ects = 0
    elementsConstitutifsStore.ecs
      .filter(
        (ec) =>
          ec.version_id === parcoursStore.versionSelected.id &&
          ec.parcours.some((p) => p.id === parcours.id)
      )
      .forEach((ec) => {
        let totalToAdd = 0
        totalToAdd += ec.volume_horaire_tp
        totalToAdd += ec.volume_horaire_td
        totalToAdd += ec.volume_horaire_cm
        totalToAdd += ec.volume_horaire_pt
        totalToAdd += ec.volume_horaire_etudiant
        totalToAdd += ec.volume_horaire_cm_td
        parcours.total_ects += ec.credits_ects
        parcours.total_volume_horaire += totalToAdd

        const allParcoursIds = refGlobalDataList.value.parcours.map((p) => p.id).sort()
        const ecParcoursIds = ec.parcours.map((p) => p.id).sort()
        const isForAllParcours =
          allParcoursIds.length === ecParcoursIds.length &&
          allParcoursIds.every((id, idx) => id === ecParcoursIds[idx])
      })
  })

  // Calcul du point de vue global à la formation
  elementsConstitutifsStore.ecs.forEach((ec) => {
    const allParcoursIds = refGlobalDataList.value.parcours.map((p) => p.id).sort()
    const ecParcoursIds = ec.parcours.map((p) => p.id).sort()
    const isForAllParcours =
      allParcoursIds.length === ecParcoursIds.length &&
      allParcoursIds.every((id, idx) => id === ecParcoursIds[idx])
    if (ec.version_id === parcoursStore.versionSelected.id && isForAllParcours) {
      let totalToAdd = 0
      totalToAdd += ec.volume_horaire_tp
      totalToAdd += ec.volume_horaire_td
      totalToAdd += ec.volume_horaire_cm
      totalToAdd += ec.volume_horaire_pt
      totalToAdd += ec.volume_horaire_etudiant
      totalToAdd += ec.volume_horaire_cm_td
      refGlobalDataList.value.data_formation.total_volume_horaire += totalToAdd
      refGlobalDataList.value.data_formation.total_ects += ec.credits_ects
    }
  })

  // Calcul des compétences & des ACs
  refGlobalDataList.value.competences = competenceStore.competences.filter(
    (comp) => comp.version_id === parcoursStore.versionSelected.id
  )

  refGlobalDataList.value.competences.forEach((competence) => {
    competence.totalH = 0
    competence.totalC = 0
  })

  refGlobalDataList.value.competences.forEach((competence) => {
    // s'assurer que competence.niveaux existe
    competence.acs = competence.niveau.flatMap(
      (niveau) =>
        niveau.apprentissage_critique.map((ac) => ({
          id: ac.id,
          libelle: ac.libelle,
          totalh: 0,
          totalC: 0
        })) // récupérer juste l'ID
    )
    competence.acsWithEnseignements = {} // initialisation
  })

  elementsConstitutifsStore.ecs.forEach((ec) => {
    if (ec.type === 'enseignement') {
      const thisEnseignement = enseignementStore.enseignements.find(
        (ens) => ens.id === ec.enseignement_id
      )

      if (thisEnseignement && thisEnseignement.apprentissages_critiques) {
        thisEnseignement.apprentissages_critiques.forEach((ac) => {
          const acId = ac.id || ac
          refGlobalDataList.value.competences.forEach((competence) => {
            const acObj = competence.acs.find((a) => a.id === acId)
            if (acObj) {
              // Initialiser l'array si nécessaire
              if (!competence.acsWithEnseignements[acId]) {
                competence.acsWithEnseignements[acId] = []
              }

              // Ajouter l'enseignement
              competence.acsWithEnseignements[acId].push(thisEnseignement)

              // Calculer totalh
              let totalToAdd = 0
              totalToAdd += ec.volume_horaire_tp || 0
              totalToAdd += ec.volume_horaire_td || 0
              totalToAdd += ec.volume_horaire_cm || 0
              totalToAdd += ec.volume_horaire_pt || 0
              totalToAdd += ec.volume_horaire_etudiant || 0
              totalToAdd += ec.volume_horaire_cm_td || 0

              competence.totalH += totalToAdd || 0
              competence.totalC += ec.credits_ects || 0

              acObj.totalh += totalToAdd
              acObj.totalC += ec.credits_ects || 0
            }
          })
        })
      }
    }
  })
  console.log(refGlobalDataList.value)

  // Prévoir le calcul des options
}

const maxHours = ref(0)
const maxECTS = ref(0)
watch(
  refGlobalDataList,
  () => {
    const { maxH, maxC } = computedMax.value
    maxHours.value = maxH
    maxECTS.value = maxC
  },
  { immediate: true, deep: true }
)

watch(
  computedMax,
  (newVal) => {
    maxHours.value = newVal.maxH
    maxECTS.value = newVal.maxC
  },
  { immediate: true }
)
watch(
  () => elementsConstitutifsStore.ecs,
  async () => {
    await initData()
  },
  { deep: true }
)
</script>
<style scoped>
.v-list-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9f9f9;
}

.v-list-item-title {
  margin-bottom: 8px;
}

.v-progress-linear {
  transition: width 0.5s ease;
}
</style>
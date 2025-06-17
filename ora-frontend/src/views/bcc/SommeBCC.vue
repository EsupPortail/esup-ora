<template>
  <v-card style="border-radius: 16px">
    <v-card-title style="background-color: #2196F3 !important; padding: 20px; padding-left: 30px !important">
      <v-row align="center">
      <v-col cols="2">
        <span class="text-subtitle-1">BCC {{ bloc.id }}</span>
      </v-col>
      <v-col cols="9">
        <span class="text-subtitle-1">{{ bloc.libelle }}</span>
      </v-col>
      <v-col cols="1" style="padding: 0px">
        <v-btn icon @click="closeRecap()">
        <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition>
      <v-card-text
        v-if="isExpanded"
        style="padding-bottom: 20px; padding-top: 24px; padding-left: 32px; padding-right: 40px"
      >
        <v-row>
          <span>Total Crédit:</span>
          <div
            style="
              text-align: center;
              vertical-align: middle;
              width: 32px;
              height: 18px;
              margin-left: 14px;
              background-color: purple;
              color: white;
            "
          >
            <span>{{ totalCredits }}</span>
          </div>
        </v-row>
        <v-row>
          <span>Total heures encadrées:</span>
          <div
            style="
              text-align: center;
              vertical-align: middle;
              width: 32px;
              height: 18px;
              margin-left: 14px;
              background-color: green;
              color: white;
            "
          >
            <span>{{ totalHeuresEncadrees }}</span>
          </div>
        </v-row>
        <v-divider style="margin-top: 20px"></v-divider>
        <v-row style="margin-top: 12px">
          <v-col cols="3" style="padding-left: 0px">
            <span>Parcours :</span>
          </v-col>
          <v-col cols="9">
            <span>{{ bloc.est_tronc_commun ? 'Tronc commun' : 'Spécialité' }}</span>
            <span v-for="(parcours, indexP) in bloc.parcours">
              {{ indexP >= 0 ? ', ' : '' }}
              {{ parcours.libelle }}
            </span>
          </v-col>
        </v-row>
        <v-row style="margin-top: 12px">
          <v-col cols="3" style="padding-left: 0px">
            <span>Compétence :</span>
          </v-col>
          <v-col cols="9">
            <span v-if="bloc.competence">{{ bloc.competence.competence_contextualisee || bloc.competence.libelle }}</span>
          </v-col>
        </v-row>
        <v-row style="margin-top: 12px">
          <v-col cols="3" style="padding: 10px 0">
            <span>Apprentissages: </span>
          </v-col>
          <v-col cols="9">
            <div>
              <p v-for="item in bloc.apprentissage_critiques" :key="item.id">
                AC{{ item.id }} - {{ item.libelle }}
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row v-for="item in bloc.element_constitutif" class="ecVertical" style="padding: 0 0">
          <template v-if="item.type === 'Enseignement'">
            <v-col cols="2">
              <span>EC{{ bloc.id }}-{{ item.id }}</span>
            </v-col>
            <v-col cols="4">
              <span>{{ item.enseignement?.libelle }}</span>
            </v-col>
            <v-col cols="2">
              <span>Heures: </span>
            </v-col>
            <v-col cols="1" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.volume_horaire_tp }} TP</span>
            </v-col>
            <v-col cols="1" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.volume_horaire_td }} TD</span>
            </v-col>
          </template>
          <template v-else-if="item.type === 'SAE'">
            <v-col cols="2">
              <span>EC{{ bloc.id }}-{{ item.id }}</span>
            </v-col>
            <v-col cols="4">
              <span>{{ item.libelle }}</span>
            </v-col>
            <v-col cols="2">
              <span>Heures: </span>
            </v-col>
            <v-col cols="1" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.volume_horaire_tp }} TP</span>
            </v-col>
            <v-col cols="1" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.volume_horaire_td }} TD</span>
            </v-col>
            <v-col cols="1" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.volume_horaire_pt }} PT</span>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="2">
              <span>EC{{ bloc.id }}-{{ item.id }}</span>
            </v-col>
            <v-col cols="4">
              <span>{{ item.libelle }}</span>
            </v-col>
            <v-col cols="2">
              <span>Heures: </span>
            </v-col>
            <v-col cols="1" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.volume_horaire_etudiant || 0 }} TP</span>
            </v-col>
            <v-col cols="2" style="padding-left: 0; padding-right: 0;">
              <span>{{ item.credits_ects || 0 }} Crédits</span>
            </v-col>
          </template>
          <v-divider style="margin-top: 6px"></v-divider>
        </v-row>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

const isExpanded = ref(true)

const props = defineProps({
  bloc: Object,
  closeRecap: Function
})
const emit = defineEmits(['recapBccClose'])
const localExpanded = ref(props.recapBccExpanded)

function closeRecap() {
  emit('recapBccClose')
}
watch(
  () => props.recapBccExpanded,
  (newValue) => {
    localExpanded.value = newValue
  }
)

const totalCredits = computed(() => {
  let totalCredits = 0
  totalCredits += props.bloc.credits
  props.bloc.element_constitutif.forEach((eC) => {
    totalCredits += eC.credits_ects
  })
  return totalCredits
})

const totalHeuresEncadrees = computed(() => {
  let totalHeuresEncadrees = 0
  props.bloc.element_constitutif.forEach((eC) => {
    totalHeuresEncadrees += eC.volume_horaire_tp + eC.volume_horaire_td + eC.volume_horaire_pt + eC.volume_horaire_cm
  })
  return totalHeuresEncadrees
})
</script>

<style scoped>
.ecVertical  {
  align-items: center;
}
</style>

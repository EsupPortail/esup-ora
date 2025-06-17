<template>
  <PageInDev />
  <v-card class="scrollable" style="max-height: 760px; overflow-y: auto;">
    <v-card-title style="text-align: center; font-weight: bold;">
      <h1>Importer des {{ parametre.semantique_ec || 'éléments constitutifs' }} dans le {{ parametre.semantique_bcc || 'bcc' }} </h1>
      <h2>{{ nameBCC }}</h2>
      <div style="margin-top: 20px;">
        <SearchEngineMutualisation :itemsList="refECsList" @input-change="handleInputChange" />
      </div>
    </v-card-title>
    <v-card-text>
        <template v-for="(ec, index) in refECsList">
        <v-row>
            <v-col cols="3">
                <span v-if="ec.type === 'Enseignement'" style="border-radius: 16px; padding: 8px; color: white; background-color: purple;">Enseignement</span>
                <span v-if="ec.type === 'SAE'" style="border-radius: 16px; padding: 8px; color: white; background-color: red;">Saé</span>
                <span v-if="ec.type === 'Portfolio'" style="border-radius: 16px; padding: 8px; color: white; background-color: blue;">Portfolio</span>
                <span v-if="ec.type === 'Stage'" style="border-radius: 16px; padding: 8px; color: white; background-color: orange;">Stage</span>
            </v-col>
          <v-col cols="7"><h3>{{ parametre.semantique_ec || 'éléments constitutifs' }} : {{ ec.libelle }}</h3></v-col>
          <v-col cols="1">
            <v-btn icon @click="ec.isExpanded = !ec.isExpanded">
              <v-icon>{{ ec.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn icon :disabled="estDejaLink(ec)" @click="linkMutualiseToBCC(ec.id)">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-expand-transition>
              <v-card v-if="ec.isExpanded">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <div>{{ec.libelle}}</div>
                      <span>Volume Horaire</span>
                      <v-list>
                        <v-list-item v-if="ec.volume_horaire_cm !== 0">
                            <span>CM : {{ ec.volume_horaire_cm }}</span>
                        </v-list-item>
                        <v-list-item v-if="ec.volume_horaire_td !== 0">
                            <span>TD : {{ ec.volume_horaire_td }}</span>
                        </v-list-item>
                        <v-list-item v-if="ec.volume_horaire_tp !== 0">
                            <span>TP : {{ ec.volume_horaire_tp }}</span>
                        </v-list-item>
                        <v-list-item v-if="ec.volume_horaire_pt !== 0">
                            <span>PT : {{ ec.volume_horaire_pt }}</span>
                        </v-list-item>
                        <v-list-item v-if="ec.volume_horaire_etudiant !== 0">
                            <span>Étudiant : {{ ec.volume_horaire_etudiant }}</span>
                        </v-list-item>
                      </v-list>
                      <div>Type d'enseignement : {{ ec.obligatoire ? 'Obligatoire' : 'Facultatif'}}</div>
                      <div>Étudiants internationaux : {{ ec.est_ouvert_etudiants_internationaux ? 'Oui' : 'Non'}}</div>
                      <div>Format : 
                        <template v-if="ec.presentiel === 0">Distanciel</template>
                        <template v-else-if="ec.presentiel === 1">Présentiel</template>
                        <template v-else-if="ec.presentiel === 2">Hybride</template>
                      </div>
                      <div v-if="ec.description !== null">: {{ ec.description }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, ref } from 'vue'

import PageInDev from '@/components/PageInDev.vue'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useFormationStore } from '@/stores/formationStore'
import { useBccStore } from '@/stores/bccStore'
import SearchEngineMutualisation from '@/views/parcoursFormation/mutualisation/SearchEngineMutualisation.vue'

const props = defineProps({
  bccId: Number
})

const ecStore = useEcStore()
const bccStore = useBccStore()
const formationStore = useFormationStore()

const parametre = ref({})
const nameBCC = ref('')
const refECsList = ref([])
const refAlreadyLinkedECs = ref([])

const init = async () => {
  parametre.value = await formationStore.formationSelected.composante.parametre
  await ecStore.fetchAllMutualisedECs().then((ecsMutualised) => {
    refECsList.value = ecsMutualised
  })
  await bccStore.fetchBCCById( props.bccId ).then(d => {
    nameBCC.value = d.libelle
    refAlreadyLinkedECs.value = d.importation_mutualisation;
  });}

init()

const linkMutualiseToBCC = async (ecId) => {
  console.log(props.bccId)
  await bccStore.linkMutualiseToBCC(ecId, props.bccId);
  await bccStore.fetchBCCById( props.bccId ).then(d => {
    refAlreadyLinkedECs.value = d.importation_mutualisation;
  });
}

const estDejaLink = (ec) => {
  return refAlreadyLinkedECs.value.some(linkedEc => linkedEc.id === ec.id);
};
const handleInputChange = (filteredList) => {
  refECsList.value = filteredList
}
</script>


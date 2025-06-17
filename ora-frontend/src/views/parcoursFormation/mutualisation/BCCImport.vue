<template>
  <PageInDev />
  <v-card class="scrollable" style="max-height: 760px; overflow-y: auto">
    <v-card-title style="text-align: center; font-weight: bold;">
      <h1>Importer des {{ parametre.semantique_bcc || 'bloc de connaissances et de compétences' }} pour
      la formation</h1>
      <div style="margin-top: 20px;">
        <SearchEngineMutualisation :itemsList="refBCCsList" @input-change="handleInputChange" />

      </div>
    </v-card-title>
    <v-card-text>
      <template v-for="(bcc, index) in refBCCsList">
        <v-card style="margin-top: 20px;">
          <v-card-title>
            <v-row>
              <v-col cols="10">
                <h3>
                  {{ parametre.semantique_bcc || 'BCC' }} : {{ bcc.libelle }}
                </h3>
                </v-col>
              <v-col cols="1">
                <v-btn icon @click="bcc.isExpanded = !bcc.isExpanded">
                  <v-icon>{{ bcc.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1">
                <v-btn
                  icon
                  :disabled="estDejaLink(bcc)"
                  @click="linkMutualiseToBCCToVersion(bcc.id)"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-expand-transition>
                  <v-card v-if="bcc.isExpanded">
                    <v-card-text>
                      <h4>Informations générales du {{ parametre.semantique_bcc }}</h4>
                      <p>Type : {{ bcc.est_tronc_commun ? 'Tronc Commun' : 'De spécialité' }}</p>
                      <p>Nombre de crédits ECTS : {{ bcc.credits }}</p>
                      <h4>Nombre de liens vers la ou les {{ parametre.semantique_competence }}  : {{ bcc.competences.length }}</h4>
                      <h4>{{ parametre.semantique_competence }} connectées :</h4>
                      <v-list>
                        <v-list-item v-for="competence in bcc.competences" :key="competence.id" style="min-height: 20px !important;">
                            <v-list-item-title style="font-size: 14px; padding: 0px; margin: 0px;">{{ competence.libelle }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                      <h4>Nombre de liens vers les {{ parametre.semantique_apprentissage }} : {{ bcc.apprentissage_critiques.length }}</h4>
                      <h4>{{ parametre.semantique_apprentissage }} connectés :</h4>
                      <v-list>
                        <v-list-item v-for="apprentissage in bcc.apprentissage_critiques" :key="apprentissage.id"style="min-height: 20px !important;">
                            <v-list-item-title style="font-size: 14px; padding: 0px; margin: 0px;">{{ apprentissage.libelle }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                      <h4>{{parametre.semantique_ec}} présents :</h4>
                      <v-list v-if="bcc.groupe_ec.length > 0">
                        <v-list-item v-for="ec in bcc.element_constitutif" :key="ec.id" style="min-height: 20px !important;">
                            <v-list-item-title style="font-size: 14px; padding: 0px; margin: 0px;">
                              <h4>{{ ec.libelle }} => Type : {{  ec.type }}</h4>
                                <p>
                                CM : {{ ec.volume_horaire_cm || 'Non renseigné' }} | 
                                PT : {{ ec.volume_horaire_cpt || 'Non renseigné' }} | 
                                TD : {{ ec.volume_horaire_td || 'Non renseigné' }} | 
                                TP : {{ ec.volume_horaire_tp || 'Non renseigné' }} | 
                                Horaire étudiant : {{ ec.volume_horaire_horaire_etudiant || 'Non renseigné' }}
                                </p>
                                <p v-if="ec.credits_ects">Crédits ECTS : {{ ec.credits_ects }}</p>
                                <p v-if="ec.nb_etudiant_max">Nombre d'étudiants max : {{ ec.nb_etudiant_max }}</p>
                                <p v-if="ec.nb_etudiant_min">Nombre d'étudiants min : {{ ec.nb_etudiant_min }}</p>
                                <p v-if="ec.presentiel !== null">Présentiel : 
                                  {{ ec.presentiel === 0 ? 'Distanciel' : ec.presentiel === 1 ? 'Présentiel' : 'Hybride' }}
                                </p>
                                <p v-if="ec.obligatoire !== null">Obligatoire : {{ ec.obligatoire ? 'Obligatoire' : 'Optionnel' }}</p>
                            </v-list-item-title>
                        </v-list-item>
                      </v-list>
                      <span v-else>Aucun</span>
                      <h4>{{parametre.semantique_ue}} présents :</h4>
                      <v-list v-for="ue in bcc.groupe_ec" :key="ue.id" v-if="bcc.groupe_ec.length > 0">
                        <p>{{parametre.semantique_ue}} {{ ue.libelle }}</p>
                        <v-list-item v-for="ec in ue.element_constitutif" :key="ec.id" style="min-height: 20px !important;">
                            <v-list-item-title style="font-size: 14px; padding: 0px; margin: 0px;">
                              <h4>{{ ec.libelle }} => Type : {{  ec.type }}</h4>
                                <p>
                                CM : {{ ec.volume_horaire_cm || 'Non renseigné' }} | 
                                PT : {{ ec.volume_horaire_cpt || 'Non renseigné' }} | 
                                TD : {{ ec.volume_horaire_td || 'Non renseigné' }} | 
                                TP : {{ ec.volume_horaire_tp || 'Non renseigné' }} | 
                                Horaire étudiant : {{ ec.volume_horaire_horaire_etudiant || 'Non renseigné' }}
                                </p>
                                <p v-if="ec.credits_ects">Crédits ECTS : {{ ec.credits_ects }}</p>
                                <p v-if="ec.nb_etudiant_max">Nombre d'étudiants max : {{ ec.nb_etudiant_max }}</p>
                                <p v-if="ec.nb_etudiant_min">Nombre d'étudiants min : {{ ec.nb_etudiant_min }}</p>
                                <p v-if="ec.presentiel !== null">Présentiel : 
                                  {{ ec.presentiel === 0 ? 'Distanciel' : ec.presentiel === 1 ? 'Présentiel' : 'Hybride' }}
                                </p>
                                <p v-if="ec.obligatoire !== null">Obligatoire : {{ ec.obligatoire ? 'Obligatoire' : 'Optionnel' }}</p>
                            </v-list-item-title>
                        </v-list-item>
                      </v-list>
                      <span v-else>Aucun</span>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-card-text>
  </v-card>
</template>
  
  <script setup>
import { ref } from 'vue'

import PageInDev from '@/components/PageInDev.vue'
import { useFormationStore } from '@/stores/formationStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useBccStore } from '@/stores/bccStore'
import SearchEngineMutualisation from '@/views/parcoursFormation/mutualisation/SearchEngineMutualisation.vue'

const bccStore = useBccStore()
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()

const parametre = ref({})
const nameBCC = ref('')
const refBCCsList = ref([])
const refAlreadyLinkedBCCs = ref([])

const init = async () => {
  parametre.value = await formationStore.formationSelected.composante.parametre
  await bccStore.fetchAllMutualisedBCCs().then((bccMutualiseds) => {
    refBCCsList.value = bccMutualiseds.sort((a, b) => a.libelle.localeCompare(b.libelle))
  })
  await formationStore.fetchMutualisedBCCForVersion(parcoursStore.versionSelected.id).then((v) => {
    refAlreadyLinkedBCCs.value = v.importation_mutualisation_bcc
  })
}

init()

const linkMutualiseToBCCToVersion = async (bccId) => {
  await bccStore.linkMutualiseBCCToVersion(bccId)
  await bccStore.fetchBCCById(bccId).then((d) => {
    refAlreadyLinkedBCCs.value = d.importation_mutualisation
  })
}

const estDejaLink = (ec) => {
  return refAlreadyLinkedBCCs.value.some((linkedEc) => linkedEc.id === ec.id)
}

const handleInputChange = (filteredList) => {
  refBCCsList.value = filteredList
}
</script>
  
  
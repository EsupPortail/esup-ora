<template>
  <v-card
    style="
      margin-top: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
    "
  >
    <v-card-title>
      <v-row align="center">
        <v-col cols="2">
          <span class="text-subtitle-1"> EC {{ index }}</span>
          <span
            v-if="isImported"
            class="text-subtitle-2 rounded"
            style="margin-left:6px;"
          >
            <b class="myGreen" style="border-radius: 16px; padding: 6px">Importé</b>
          </span>
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-if="isExpanded && typeEC === 'SAE'"
            style="margin-top: 26px"
            variant="outlined"
            density="compact"
            @blur="updateEc"
            @keyup.enter="updateEc"
            label="Libellé"
            v-model="ec.libelle"
            :disabled="isImported || ec.est_mutualisable" 
          ></v-text-field>
          <span v-else class="text-subtitle-1">{{ ec.libelle }}</span>
        </v-col>
        <v-col cols="2">
          <span
            class="text-subtitle-2 rounded"
            style="border: 1px solid purple-light; border-radius: 32px"
          >
            <b
              :class="{
                purple: typeEC === 'Enseignement',
                orange: typeEC === 'SAE',
                myBlue: typeEC === 'Portfolio'
              }"
              style="border-radius: 16px; padding: 6px"
            >
              {{ typeEC }}
            </b>
          </span>
        </v-col>
        <v-col cols="1" class="text-right">
          <v-btn icon @click="isExpanded = !isExpanded">
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn icon>
            <v-icon>mdi-drag</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1" style="padding: 0px">
          <v-menu location="end">
            <template v-slot:activator="{ props }">
              <v-btn :loading="loaderDelete" icon v-bind="props">
                <template v-slot:loader>
                  <v-progress-circular
                    v-if="loaderDelete"
                    indeterminate
                    color="red"
                  ></v-progress-circular>
                </template>
                <template v-slot:default>
                  <v-icon>mdi-dots-vertical</v-icon>
                </template>
              </v-btn>
            </template>
            <v-list style="padding: 0px">
              <v-list-item style="padding: 0px">
                <v-btn icon @click="shareEc" :disabled="isImported || ec.est_mutualisable" :color="ec.est_mutualisable ? 'green' : ''">
                  <v-icon :color="ec.est_mutualisable ? 'white' : ''">mdi-share-variant</v-icon>
                </v-btn>
                <v-btn icon @click="" color="white" style="background-color: black">
                  <v-icon color="blue">mdi-content-copy</v-icon>
                </v-btn>

                <v-btn v-if="!isImported" icon @click="deleteThisEC" color="white" style="background-color: red">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
                <v-btn v-else icon @click="unlinkEc" color="white" style="background-color: red">
                  <v-icon color="red">mdi-upload</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <v-divider style="margin-top: 10px"></v-divider>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-if="isExpanded">
        <v-row v-if="typeEC == 'Enseignement'">
          <v-spacer />
          <v-col cols="8">
            <v-row>
              <v-col cols="2" style="padding-top: 22px; padding-left: 0px; padding-right: 0px">
                <span style="font-size: 14px">Volume horaire</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :disabled="isImported || ec.est_mutualisable" 
                  density="compact"
                  variant="outlined"
                  type="number"
                  label="TP"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                  v-model="ec.volume_horaire_tp"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  density="compact"
                  :disabled="isImported || ec.est_mutualisable" 
                  variant="outlined"
                  type="number"
                  label="TD"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                  v-model="ec.volume_horaire_td"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                  :disabled="isImported || ec.est_mutualisable" 
                  label="CM"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                  v-model="ec.volume_horaire_cm"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0px">
              <span style="padding-top: 12px"> Enseignement : </span>
              <v-radio-group     
              :disabled="isImported || ec.est_mutualisable"        
              inline v-model="ec.presentiel" @change="updateEc">
                <v-radio label="Présentiel" :value="1"></v-radio>
                <v-radio label="Distanciel" :value="0"></v-radio>
                <v-radio label="Hybrid" :value="2"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row style="margin-top: 0px">
              <span style="padding-top: 12px"> Enseignement : </span>
              <v-radio-group inline v-model="ec.obligatoire" @change="updateEc" :disabled="isImported || ec.est_mutualisable" >
                <v-radio label="Obligatoire" :value="true"></v-radio>
                <v-radio label="Optionnel" :value="false"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row style="margin-top: 0px">
              <span style="padding-top: 12px">
                Enseignement ouvert aux étudiants internationaux:
              </span>
              <v-radio-group
                inline
                v-model="ec.est_ouvert_etudiants_internationaux"
                @change="updateEc"
                 :disabled="isImported || ec.est_mutualisable" 
              >
                <v-radio label="Oui" :value="true"></v-radio>
                <v-radio label="Non" :value="false"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row>
              <v-select
                variant="outlined"
                density="compact"
                 :disabled="isImported || ec.est_mutualisable" 
                :items="tags"
                item-title="libelle"
                item-value="id"
                v-model="ec.tags"
                persistent-hint
                chips
                hint="Sélectionnez des tags"
                multiple
              >
              </v-select>
            </v-row>
            <v-row>
              <v-textarea
                style="margin-top: 20px"
                v-model="ec.description"
                @blur="updateEc"
                @keyup.enter="updateEc"
                no-resize
                 :disabled="isImported || ec.est_mutualisable" 
                rows="3"
                variant="outlined"
                density="compact"
                label="Description"
              ></v-textarea>
            </v-row>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row
          v-else-if="typeEC === 'Stage' || typeEC === 'Apprentissage' || typeEC === 'Portfolio'"
        >
          <v-col offset="2" cols="8">
            <v-row>
              <v-col cols="2" style="padding-top: 22px; padding-left: 12px; padding-right: 0px">
                <span style="font-size: 14px">Volume horaire</span>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  density="compact"
                   :disabled="isImported || ec.est_mutualisable" 
                  variant="outlined"
                  type="number"
                  label="Heures étudiant"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                  v-model="ec.volume_horaire_etudiant"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0px">
              <v-col cols="2" style="padding-top: 22px; padding-left: 12px; padding-right: 0px">
                <span style="font-size: 14px">Crédits</span>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                  label="ECTS"
                   :disabled="isImported || ec.est_mutualisable" 
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                  v-model="ec.credits_ects"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0px">
              <v-col>
                <v-textarea
                  v-model="ec.description"
                   :disabled="isImported || ec.est_mutualisable" 
                  variant="outlined"
                  rows="4"
                  label="Description"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-else-if="typeEC === 'SAE'">
          <v-spacer />
          <v-col cols="8" style="margin-top: 12px">
            <v-row>
              <v-row style="margin-top: 10px">
                <span style="font-weight: 600">Volume horaire :</span>
              </v-row>
              <v-divider style="margin-top: 10px" />
              <v-row style="margin-top: 10px">
                <v-col cols="3" style="padding-top: 22px">
                  <span style="font-size: 14px">Accompagnement :</span>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                     :disabled="isImported || ec.est_mutualisable" 
                    type="number"
                    label="TP"
                    @blur="updateEc"
                    @keyup.enter="updateEc"
                    v-model="ec.volume_horaire_tp"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                    label="TD"
                     :disabled="isImported || ec.est_mutualisable" 
                    @blur="updateEc"
                    @keyup.enter="updateEc"
                    v-model="ec.volume_horaire_td"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    type="number"
                     :disabled="isImported || ec.est_mutualisable" 
                    label="PT"
                    @blur="updateEc"
                    @keyup.enter="updateEc"
                    v-model="ec.volume_horaire_pt"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-row>
            <v-row style="margin-top: 0px">
              <v-col cols="3" style="padding-left: 0px; padding-top: 22px; padding-bottom: 0px">
                <span>Travail personnel :</span>
              </v-col>
              <v-col cols="3" style="padding-left: 6px; padding-bottom: 0px">
                <v-text-field
                  type="number"
                  variant="outlined"
                   :disabled="isImported || ec.est_mutualisable" 
                  label="TP"
                  density="compact"
                  v-model="ec.travail_personnel"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                  inline
                ></v-text-field>
              </v-col>
              <v-divider />
            </v-row>
            <v-row style="margin-top: 24px">
              <v-textarea
                v-model="ec.description"
                variant="outlined"
                rows="4"
                label="Description"
                 :disabled="isImported || ec.est_mutualisable" 
                @blur="updateEc"
                @keyup.enter="updateEc"
              >
              </v-textarea>
            </v-row>
            <v-row>
              <span>Sélectionner des contextes de situations professionnelles</span>
            </v-row>
            <v-row style="margin-top: 22px">
              <v-select
                variant="outlined"
                density="compact"
                 :disabled="isImported || ec.est_mutualisable" 
                :items="contextesEvaluations"
                item-title="libelle"
                item-value="id"
                label="Contextes"
                v-model="contexteSaeSelected"
                multiple
                @update:model-value="updateContexteSae"
              ></v-select>
            </v-row>
            <v-row style="margin-top: 12px">
              <v-col cols="2" style="padding-top: 22px; padding-left: 0px; padding-right: 0px">
                <span style="font-size: 13px">Groupe étudiants:</span>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                  label="minimum"
                  v-model="ec.nb_etudiant_min"
                   :disabled="isImported || ec.est_mutualisable" 
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  type="number"
                   :disabled="isImported || ec.est_mutualisable" 
                  label="maximum"
                  v-model="ec.nb_etudiant_max"
                  @blur="updateEc"
                  @keyup.enter="updateEc"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row style="margin-top: 6px">
              <v-textarea
                v-model="ec.commentaire"
                variant="outlined"
                rows="4"
                label="Commentaire"
                 :disabled="isImported || ec.est_mutualisable" 
                @blur="updateEc"
                @keyup.enter="updateEc"
              ></v-textarea>
            </v-row>
          </v-col>
          <v-spacer />
        </v-row>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
  
<script setup>
import { defineProps, watch, ref } from 'vue'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useTagStore } from '@/stores/tagStore'
import { useBccStore } from '@/stores/bccStore'
import { useFormationStore } from '@/stores/formationStore'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'

const emit = defineEmits(['removeItemEC'])

const ecStore = useEcStore()
const tagStore = useTagStore()
const bccStore = useBccStore()
const formationStore = useFormationStore()
const popUpStore = usePopUpStore()

const props = defineProps({
  ec: Object,
  tags: Array,
  index: Number,
  removeItemEC: Function,
  idBCC: Number,
  typeEC: String,
  isImported: Boolean,
  refreshBCC: Function
})

const loaderDelete = ref(false)
const hoverDeleteEc = ref(false)
const parametre = ref({})
const contextesEvaluations = ref([])
const contexteSaeSelected = ref(props.ec.contextes_evaluations)
const isExpanded = ref(false)
const newTag = ref('')

const getContextesEvaluations = async () => {
  const bcc = await bccStore.fetchBCCById(props.idBCC)
  contextesEvaluations.value = bcc.competences.flatMap(
    (competence) => competence.contexte_evaluation
  )
}

const init = async () => {
  await getContextesEvaluations()
  parametre.value = await formationStore.formationSelected.composante.parametre
}
init()

const shareEc = async () => {
  props.ec.est_mutualisable = !props.ec.est_mutualisable
  await updateEc()
  setTimeout(() => {
    let state = props.ec.est_mutualisable ? 'ouvert' : 'fermé'
    popUpStore.print({
      isVisible: true,
      message: 'Élément constitutif ' + props.ec.libelle + ' ' + state + ' à la mutualisation.',
      type: 'SUCCESS'
    })
  }, 2000)
}

const deleteThisEC = async () => {
  if (props.ec.est_mutualisable) {
    await bccStore.unlinkMutualiseECAtSource(props.ec.id, props.idBCC);
    props.refreshBCC();
  } else {
    loaderDelete.value = true
    emit('removeItemEC', props.ec)
    setTimeout(() => {
      loaderDelete.value = false
      popUpStore.print({
        isVisible: true,
        message: 'EC supprimé avec succès',
        type: 'SUCCESS'
      })
    }, 2000)
  }
}

const unlinkEc = async () => {
    await bccStore.unlinkMutualiseToBCC(props.ec.id, props.idBCC);
    props.refreshBCC();
}

const updateContexteSae = async () => {
  await ecStore.updateECContexteSae({
    id: props.ec.id,
    contexte_evaluation: contexteSaeSelected.value
  })
}

const addTag = async () => {
  const tag = await tagStore.createTag({ libelle: newTag.value })
  await ecStore.updateECTag({
    id: props.ec.id,
    tags: [tag.id],
    tagsToDisconnect: []
  })
  newTag.value = ''
}

const updateTag = async (tag) => {
  await ecStore.updateECTag({
    id: props.ec.id,
    tags: [tag.id],
    tagsToDisconnect: []
  })
}

const updateEc = () => {
  ecStore.updateEC(props.ec)
}
</script>

<style scoped>
.purple {
  background-color: #ab47bc;
  color: #212121;
}

.orange {
  background-color: #ef5350;
  color: #212121;
}

.myGreen {
  background-color: #a5d6a7;
  color: #212121;
}

.myBlue {
  background-color: #039be5;
  color: #212121;
}
</style>enseignement
<template>
  <v-card style="border-radius: 12px">
    <v-card-title>
      <v-row align="center">
        <v-col v-if="isImported" cols="1">
          <span class="text-subtitle-2 rounded" style="margin-left: 6px">
            <b class="myGreen" style="border-radius: 16px; padding: 6px">Importé</b>
          </span>
        </v-col>
        <v-col :cols="isImported ? '8' : '9'" style="padding-left: 12px">
          <v-text-field
            style="margin-top: 26px"
            variant="outlined"
            density="compact"
            @blur="updateBcc"
            @keyup.enter="updateBcc"
            label="Nom"
            v-model="data.libelle"
            :disabled="isImported"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col cols="3" style="padding: 0px">
              <v-btn icon @click="expandedBCC()">
                <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="3" style="padding: 0px">
              <v-btn icon @click="openRecap(data)" :color="recapIsOpen === data.id ? 'blue' : ''">
                <v-icon :color="recapIsOpen === data.id ? 'white' : ''">mdi-eye</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="3" style="padding: 0px">
              <v-btn
                icon
                :disabled="isImported"
                :loading="loadingShare"
                @click="shareBCC"
                :color="data.est_mutualisable && !loadingShare ? 'green' : ''"
              >
                <template v-slot:loader>
                  <v-progress-circular
                    v-if="loadingShare"
                    indeterminate
                    color="blue"
                  ></v-progress-circular>
                </template>
                <template v-slot:default>
                  <v-icon :color="data.est_mutualisable ? 'white' : ''">mdi-share-variant</v-icon>
                </template>
              </v-btn>
            </v-col>
            <v-col cols="3" style="padding: 0px">
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
                <v-list>
                  <v-list-item style="margin-top: 6px; padding: 10px">
                    <v-btn
                      v-if="!isImported"
                      icon
                      @click="deleteBCC"
                      color="white"
                      style="background-color: red"
                    >
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      icon
                      @click="unlinkBCC"
                      color="white"
                      style="background-color: red"
                    >
                      <v-icon color="red">mdi-upload</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-if="isExpanded">
        <v-row align="center">
          <v-spacer />
          <v-col cols="6">
            <v-form>
              <v-select
                :disabled="isImported"
                variant="outlined"
                density="compact"
                :items="parcoursBcc"
                item-title="libelle"
                item-value="id"
                label="Type"
                v-model="parcoursBccSelected"
                multiple
                @update:model-value="updateType"
              ></v-select>
              <v-select
                :disabled="isImported"
                variant="outlined"
                density="compact"
                :items="competences"
                :item-title="(item) => item.competence_contextualisee || item.libelle"
                item-value="id"
                @update:model-value="updateBccCompetence"
                :label="parametre?.semantique_competence || 'Compétence'"
                v-model="data.competences"
                multiple
              ></v-select>
            </v-form>
            <v-select
              variant="outlined"
              :disabled="isImported"
              :items="apprentissagesByCompetence(data.competences)"
              item-title="libelle"
              item-value="id"
              :label="parametre?.semantique_apprentissage || 'Apprentissages critiques'"
              v-model="data.apprentissage_critiques"
              @update:model-value="updateBccApprentissages"
              persistent-hint
              hint="Sélectionnez vos élèments"
              multiple
            />
            <v-text-field
              style="margin-top: 20px"
              :disabled="isImported"
              label="Crédit"
              variant="outlined"
              density="compact"
              @blur="updateBcc"
              @keyup.enter="updateBcc"
              type="number"
              v-model="data.credits"
            ></v-text-field>
          </v-col>
          <v-col cols="3" />
        </v-row>
        <v-textarea
          variant="outlined"
          :disabled="isImported"
          density="compact"
          v-model="data.description"
          @blur="updateBcc"
          @keyup.enter="updateBcc"
          label="Description"
          no-resize
          rows="2"
        ></v-textarea>
        <div style="margin-top: 20px" v-for="(gec, indexGec) in data.groupe_ec">
          <GroupeEC
            :gec="gec"
            :parametre="parametre"
            :index="indexGec + 1"
            :idBCC="data.id"
            :enseignementsList="enseignements"
            :typeEC="typeEC"
            @updateBcc="updateBcc"
            @removeItemEC="removeItemEC"
          />
        </div>
        <div style="margin-top: 20px" v-for="(ec, index) in refEcOrdererList" :key="ec.id">
          <div
            style="margin-top: 20px"
            :key="ec.id"
            draggable="true"
            @dragstart="onDragStart($event, ec)"
            @dragover.prevent
            @drop="onDrop($event, ec)"
          >
            <ElementConstitutif
              :ec="ec"
              :index="index + 1"
              @removeItemEC="removeItemEC"
              :tags="tags"
              :typeEC="ec.type"
              :refreshBCC="getMutualisesElements"
              :idBCC="data.id"
              :isImported="isImported ? true : refMutualisesElements.includes(ec)"
            />
          </div>
        </div>
        <v-row align="center">
          <v-col cols="3">
            <v-btn @click="createECGroup" color="green" :disabled="isImported">
              Créer un {{ parametre?.semantique_ue || "groupe d'EC" }}
              <v-icon left>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-select
              style="margin-top: 26px"
              variant="outlined"
              :disabled="isImported"
              density="compact"
              :items="enseignements"
              label="Enseignements"
              v-model="enseignementSelected"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-if="!item.raw.type" v-bind="props"></v-list-item>
                <v-list-subheader v-else>{{ props.title }}</v-list-subheader>
              </template>
            </v-select>
          </v-col>
          <v-col cols="1">
            <v-btn
              :loading="loaderAddEnseignement"
              @click="createEC()"
              :color="temoinError === false ? 'green' : 'red'"
              :disabled="temoinError || isImported"
            >
              <template v-slot:loader>
                <v-progress-circular
                  v-if="loaderAddEnseignement"
                  indeterminate
                  color="white"
                ></v-progress-circular>
              </template>
              <template v-slot:default>
                <v-icon v-if="temoinError === false" left>mdi-plus</v-icon>
                <v-icon v-else left>mdi-close</v-icon>
              </template>
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-select
              style="margin-top: 26px"
              variant="outlined"
              :disabled="isImported"
              density="compact"
              :items="typeEC"
              item-title="text"
              item-value="value"
              label="AMS/Portfolio"
              v-model="selectedTypeEC"
            />
          </v-col>
          <v-col cols="1">
            <v-btn
              :loading="loaderAddAMS"
              :disabled="isImported"
              @click="createSAEPortfolio()"
              color="green"
            >
              <template v-slot:loader>
                <v-progress-circular
                  v-if="loaderAddAMS"
                  indeterminate
                  color="white"
                ></v-progress-circular>
              </template>
              <template v-slot:default>
                <v-icon left>mdi-plus</v-icon>
              </template>
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn color="info" @click="emit('setStateOverlay', bloc.id)" :disabled="isImported">
              Importer
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref, computed, defineProps, watch, reactive, toRaw, nextTick } from 'vue'
import ElementConstitutif from './ElementConstitutif.vue'
import GroupeEC from './GroupeEC.vue'
import { useBccStore } from '@/stores/bccStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useApprentissageStore } from '@/stores/apprentissageStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'

const emit = defineEmits([
  'setStateOverlay',
  'updateBcc',
  'recapBccExpanded',
  'deleteItem',
  'addEcToBcc'
])

const props = defineProps({
  bloc: Object,
  tags: Array,
  parametre: Object,
  competences: Array,
  parcours: Array,
  apprentissages: Array,
  periodes: Array,
  removeItem: Function,
  recapBccExpanded: Number,
  blocSelectedId: Number,
  setStateOverlay: Function,
  saes: Array,
  myId: Number,
  isOverlayed: Boolean,
  refreshAskedId: Number,
  resetRefresh: Function,
  isImported: Boolean,
  resetBCCListRefresh: Function
})
const ecStore = useEcStore()
const bccStore = useBccStore()
const enseignementStore = useEnseignementStore()
const apprentissageStore = useApprentissageStore()
const parcoursStore = useParcoursStore()
const popUpStore = usePopUpStore()

const refMutualisesElements = ref([])
const getMutualisesElements = async () => {
  await bccStore.fetchBCCById(props.bloc.id).then((d) => {
    refMutualisesElements.value = d.importation_mutualisation
  })
}
getMutualisesElements()

const unlinkBCC = async () => {
  await bccStore.unlinkMutualiseBCCToVersion(props.bloc.id)
  props.resetBCCListRefresh()
}

watch(
  () => props.refreshAskedId,
  () => {
    if (props.refreshAskedId === props.bloc.id) {
      getMutualisesElements()
      props.resetRefresh()
    }
  },
  { immediate: true }
)

const draggedItem = ref(null)
const refEcOrdererList = computed(() => ecOrderedList.value)
// Liste triée
const ecOrderedList = computed(() => {
  return [...props.bloc.element_constitutif, ...refMutualisesElements.value] // Nouvelle référence pour éviter les bugs de proxy
    .map((ec, index) => {
      if (ec.render_order === null) {
        ec.render_order = index + 1
      }
      return ec
    })
    .sort((a, b) => a.render_order - b.render_order)
})

//Mutualiser

// Fonction Drag & Drop
const onDragStart = (event, item) => {
  draggedItem.value = item
}

const onDrop = async (event, targetItem) => {
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) return

  // Copie réactive pour forcer la mise à jour
  let elements = toRaw(props.bloc.element_constitutif)

  let draggedIndex = elements.findIndex((ec) => ec.id === draggedItem.value.id)
  let targetIndex = elements.findIndex((ec) => ec.id === targetItem.id)

  if (draggedIndex !== -1 && targetIndex !== -1) {
    // Échange des valeurs de `render_order`
    let tempOrder = elements[draggedIndex].render_order
    elements[draggedIndex].render_order = elements[targetIndex].render_order
    elements[targetIndex].render_order = tempOrder

    // Mettre à jour le store si nécessaire
    changeRenderOrderOfEC(elements[draggedIndex], elements[draggedIndex].render_order)
    changeRenderOrderOfEC(elements[targetIndex], elements[targetIndex].render_order)

    // 🔥 Met à jour la liste avec une nouvelle référence
    props.bloc.element_constitutif = [...elements]
  }

  draggedItem.value = null

  // ⚡️ Attendre le DOM avant d'appliquer le changement
  await nextTick()
}

// Mise à jour des ordres
const changeRenderOrderOfEC = (ec, order) => {
  ecStore.changeRenderOrderOfEC(ec, order)
}

const data = computed(() => props.bloc)
const localData = reactive({ ...props.bloc })
watch(
  () => props.bloc,
  (newBloc) => {
    Object.assign(localData, newBloc)
  }
)
const createECGroup = async () => {
  await ecStore.createGroupOfEC(data.value.id).then(() => {
    emit('updateBcc', data.value.id)
  })
}

const loadingShare = ref(false)
const shareBCC = async () => {
  loadingShare.value = true
  console.log(data.value.est_mutualisable)
  data.value.est_mutualisable = !data.value.est_mutualisable
  updateBcc(data.value)
  console.log(data.value)
  setTimeout(() => {
    loadingShare.value = false
    let state = data.value.est_mutualisable ? 'ouvert' : 'fermé'
    popUpStore.print({
      isVisible: true,
      message: 'BCC ' + data.value.libelle + ' ' + state + ' à la mutualisation.',
      type: 'SUCCESS'
    })
  }, 2000)
}

const selectedApprentissages = ref([...data.value.apprentissage_critiques])
const enseignementSelected = ref(null)
const ecList = ref({ enseignements: [], sae: [], portfolio: [] })
const typeEC = [
  {
    text: 'Saé',
    value: 'SAE'
  },
  {
    text: 'Stage',
    value: 'Stage'
  },
  {
    text: 'Apprentissage',
    value: 'Apprentissage'
  },
  {
    text: 'Portfolio',
    value: 'Portfolio'
  }
]
const selectedTypeEC = ref('')

const apprentissagesByCompetence = (competencesInput) => {
  const apprentissages = []
  competencesInput.forEach((competence) => {
    const filteredApprentissages = props.apprentissages.filter((apprentissage) => {
      return apprentissage.niveau.competence_id === competence.id
    })
    apprentissages.push(...filteredApprentissages)
  })
  return apprentissages.filter((apprentissage) => apprentissage.enseignements.length > 0)
}

const updateEnseignementList = () => {
  enseignementStore.fetchEnseignements().then((data) => {
    ecList.value.enseignements = data
  })
}

const enseignements = computed(() => {
  let enseignementsSelect = []
  props.periodes.forEach((periode) => {
    if (!enseignementsSelect.includes({ type: 'subheader', title: periode.libelle })) {
      enseignementsSelect.push({ type: 'subheader', title: periode.libelle })
    }
    periode.enseignements.forEach((enseignement) => {
      // Si l'enseignement appartient à l'un de nos apprentissages critiques sélectionné
      let isIn = false
      enseignement.apprentissages_critiques.forEach((ac) => {
        data.value.apprentissage_critiques.forEach((ap) => {
          if (ac.id === ap.id) {
            isIn = true
          }
        })
      })
      if (isIn) {
        enseignementsSelect.push({ title: enseignement.libelle, value: enseignement.id })
      }
    })
  })

  return enseignementsSelect
})

const updateBccApprentissages = async (value) => {
  const competencesAll = props.bloc.competences
  const apprentissages = []
  competencesAll.forEach((c) => {
    apprentissagesByCompetence([c]).forEach((a) => {
      apprentissages.push(a)
    })
  })
  const toConnect = value.filter((item) => !item.id)
  const toDisconnect = apprentissages
    .filter((item) => !value.includes(item.id))
    .map((item) => item.id)
  await bccStore
    .updateBccApprentissages({
      id: data.value.id,
      apprentissages: toConnect,
      apprentissagesToRemove: toDisconnect
    })
    .then((res) => {
      emit('updateBcc', data.value.id)
    })
}

const removeItemEC = async (ec) => {
  await ecStore.removeEC(ec)
  emit('updateBcc', data.value.id)
}

const updateBccCompetence = async (value) => {
  const competences = props.competences
  const competencesToConnect = value.filter((item) => !item.id)
  const competencesToDisconnect = competences
    .filter((item) => !value.includes(item.id))
    .map((item) => item.id)
  await bccStore.updateBccCompetence({
    id: data.value.id,
    competences: competencesToConnect,
    competencesToRemove: competencesToDisconnect
  })
  if (data.value.apprentissage_critiques.length > 0) {
    const apprentissagesToKeep = []
    competences.forEach((competence) => {
      if (value.includes(competence.id)) {
        const apprentissagesByCompetence = props.apprentissages.filter((apprentissage) => {
          return apprentissage.niveau.competence_id === competence.id
        })
        apprentissagesByCompetence.forEach((apprentissage) => {
          if (
            data.value.apprentissage_critiques.some(
              (apprentissageCritique) => apprentissageCritique.id === apprentissage.id
            )
          ) {
            apprentissagesToKeep.push(apprentissage.id)
          }
        })
      }
    })

    const apprentissagesToRemove = data.value.apprentissage_critiques.filter(
      (apprentissage) => !apprentissagesToKeep.includes(apprentissage.id)
    )
    const finalToRemove = apprentissagesToRemove.map((apprentissage) => apprentissage.id)
    const uniqueApprentissagesToKeep = [...new Set(apprentissagesToKeep)]
    const uniqueApprentissagesToRemove = [...new Set(finalToRemove)]

    await bccStore.updateBccApprentissages({
      id: data.value.id,
      apprentissages: uniqueApprentissagesToKeep,
      apprentissagesToRemove: uniqueApprentissagesToRemove
    })
  }
  emit('updateBcc', data.value.id)
}

const updateBcc = () => {
  bccStore.updateBcc(data.value).then(() => {
    emit('updateBcc', data.value.id)
  })
}

const temoinError = ref(false)
const createEC = () => {
  if (enseignementSelected.value === null) {
    temoinError.value = true
    popUpStore.print({
      isVisible: true,
      message: 'Veuillez sélectionner un enseignement pour ajouter un EC',
      type: 'ERROR'
    })
    setTimeout(() => {
      temoinError.value = false
    }, 2000)
  } else {
    loaderAddEnseignement.value = true
    const selectedEnseignement = enseignements.value.find(
      (enseignement) => enseignement.value === enseignementSelected.value
    )
    ecStore
      .createEC({
        bccId: props.bloc.id,
        type: 'Enseignement',
        enseignement: enseignementSelected.value,
        enseignementLib: selectedEnseignement.title
      })
      .then((data) => {
        emit('addEcToBcc', data)
      })
    setTimeout(() => {
      loaderAddEnseignement.value = false
    }, 2000)
  }
}

const createSAEPortfolio = () => {
  loaderAddAMS.value = true
  ecStore
    .createSAEPortfolio({
      bccId: props.bloc.id,
      type: selectedTypeEC.value || 'SAE'
    })
    .then((data) => {
      emit('addEcToBcc', data)
      setTimeout(() => {
        loaderAddAMS.value = false
      }, 2000)
    })
}

const createEnseignement = () => {
  enseignementStore.createEnseignement(props.myId).then(() => {
    updateEnseignementList()
    emit('updateBcc', data.value.id)
  })
}
const thisEnseignements = ref([])
const enseignementsOfThisBCC = async () => {}

const loaderAddEnseignement = ref(false)
const loaderAddAMS = ref(false)
const isExpanded = ref(false)
const openSubmenuSettings = ref(false)
const loaderDelete = ref(false)
const deleteBCC = () => {
  if (data.value.est_mutualisable) {
    popUpStore.print({
      isVisible: true,
      message: 'Vous ne pouvez pas supprimer un bloc de compétences mutualisé',
      type: 'ERROR'
    })
  } else {
    loaderDelete.value = true
    emit('deleteItem', data.value.id)
    setTimeout(() => {
      loaderDelete.value = false
      popUpStore.print({
        isVisible: true,
        message: 'BCC ' + data.libelle + ' supprimé avec succès',
        type: 'SUCCESS'
      })
    }, 2000)
  }
}

const ecOfThisBCC = ref([])
const recapIsOpen = ref(props.blocSelectedId)

watch(
  () => props.blocSelectedId,
  (newValue) => {
    recapIsOpen.value = newValue
  }
)

const localExpanded = ref(props.recapBccExpanded)
function openRecap(bloc) {
  recapIsOpen.value = bloc.id
  emit('recapBccExpanded', bloc)
}
watch(
  () => props.recapBccExpanded,
  (newValue) => {
    localExpanded.value = newValue
  }
)

const options = ['Tronc commun']
const competenceOptions = computed(() => {
  return ['Réaliser une solution', 'Optimiser le code', 'Autre compétence'] // Liste des compétences possibles
})

let troncCommunOption = [{ id: 0, libelle: 'Tronc commun' }]
const parcoursBcc = computed(() => {
  return [...troncCommunOption, ...props.parcours]
})

const parcoursBccSelected = computed(() => {
  let options = [...data.value.parcours]
  if (data.value.est_tronc_commun) {
    options.push(troncCommunOption[0])
  }
  return options
})

const expandedBCC = async () => {
  if (!isExpanded.value === true) {
    await enseignementsOfThisBCC()
  }
  isExpanded.value = !isExpanded.value
}

function updateType(value) {
  const toConnect = value.filter((item) => item > 0)
  const toDisconnect = parcoursBcc.value
    .filter((item) => !value.includes(item.id))
    .map((item) => item.id)
  bccStore
    .updateBccParcours({
      id: data.value.id,
      parcours: toConnect,
      parcoursToRemove: toDisconnect,
      est_tronc_commun: value.includes(0)
    })
    .then((res) => {
      emit('updateBcc', data.value.id)
    })
}
</script>

<style scoped>
.custom-text-field .v-input__control {
  min-height: 50px; /* Hauteur minimale du champ */
}

.custom-text-field .v-field__input {
  padding-top: 10px;
  padding-bottom: 10px;
  /* Ajustez le padding pour adapter le contenu sans toucher à l'outline */
}
.myGreen {
  background-color: #a5d6a7;
  color: #212121;
}
</style>

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
          <span class="text-subtitle-1"> {{ parametre?.semantique_ue || "Groupe d'EC" }} {{ index }}</span>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-if="isExpanded"
            style="margin-top: 26px"
            variant="outlined"
            density="compact"
            @blur="updateGEC"
            @keyup.enter="updateGEC"
            label="Libellé"
            v-model="refData.libelle"
          />
          <span v-else class="text-subtitle-1">{{ refData.libelle }}</span>
        </v-col>
        <v-col offset="1" cols="1" class="text-right">
          <v-btn icon @click="isExpanded = !isExpanded">
            <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn
            icon
            :disabled=true
          >
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1" style="padding: 0px">
              <v-menu location="end">
                <template v-slot:activator="{ props }">
                  <v-btn :loading="loaderDeleteGEC" icon v-bind="props">
                    <template v-slot:loader>
                    <v-progress-circular v-if="loaderDeleteGEC" indeterminate color="red"></v-progress-circular>
                </template>
                <template v-slot:default>

                <v-icon>mdi-dots-vertical</v-icon>
                </template>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item style="margin-top: 6px; padding: 10px;">
                        <v-btn icon @click="deleteGroupeEC">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-if="isExpanded">
        <div
          style="margin-top: 20px"
          v-for="(ec, indexEcInGec) in refEcGECOrderedList"
        >
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
            :index="indexEcInGec + 1"
            :typeEC="ec.type"
            @removeItemEC="delEc"
            :idBCC="props.idBCC"
          />
          </div>
        </div>
        <v-row align="center">
          <v-col>
            <v-select
              style="margin-top: 26px"
              variant="outlined"
              density="compact"
              :items="props.enseignementsList"
              label="Enseignements"
              v-model="enseignementSelected"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-if="!item.raw.type" v-bind="props"></v-list-item>
                <v-list-subheader v-else>{{ props.title }}</v-list-subheader>
              </template>
            </v-select>
          </v-col>
          <v-col>
            <v-btn
              :loading="loaderAddEnseignement"
              @click="createECInThis()"
              :color="temoinError === false ? 'green' : 'red'"
              :disabled="temoinError"
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
          <v-col>
            <v-select
              style="margin-top: 26px"
              variant="outlined"
              density="compact"
              :items="typeEC"
              item-title="text"
              item-value="value"
              label="AMS/Portfolio"
              v-model="selectedTypeEC"
            />
          </v-col>
          <v-col>
            <v-btn :loading="loaderAddAMS" @click="createSAEPortfolio()" color="green">
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
        </v-row>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { defineProps, ref, toRaw, nextTick, computed } from 'vue'

import ElementConstitutif from './ElementConstitutif.vue'

import { useEcStore } from '@/stores/elementConstitutifStore'
import { useBccStore } from '@/stores/bccStore'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'

const props = defineProps({
  gec: Object,
  index: Number,
  parametre: Object,
  idBCC: Number,
  enseignementsList: Array,
  typeEC: Array,
  updateBcc: Function,
  removeItemEC: Function
})
const bccStore = useBccStore()
const refDataComputed = computed(() => props.gec)
const refData = ref(refDataComputed.value)
const refreshThisGEC = async () => {
  await bccStore.fetchBCCById(props.idBCC).then(d => {
    refData.value = d.groupe_ec.find(gecTmp => gecTmp.id === props.gec.id)
  });
  refEcGECOrderedList.value = refData.value.element_constitutif
}
refreshThisGEC();

const emit = defineEmits(['updateBcc', 'removeItemEC']);
const ecStore = useEcStore()
const popUpStore = usePopUpStore()

const isExpanded = ref(false)
const enseignementSelected = ref(null)
const selectedTypeEC = ref(null)
const temoinError = ref(false)
const loaderAddEnseignement = ref(false)
const loaderAddAMS = ref(false)
const loaderDeleteGEC = ref(false)

const refEcGECOrderedList = ref(refData.value.element_constitutif)
const draggedItem = ref(null)


// Fonction Drag & Drop
const onDragStart = (event, item) => {
  draggedItem.value = item
}

const onDrop = async (event, targetItem) => {
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) return

  // Copie réactive pour forcer la mise à jour
  let elements = toRaw(props.gec.element_constitutif)

  let draggedIndex = elements.findIndex(ec => ec.id === draggedItem.value.id)
  let targetIndex = elements.findIndex(ec => ec.id === targetItem.id)

  if (draggedIndex !== -1 && targetIndex !== -1) {
    // Échange des valeurs de `render_order`
    let tempOrder = elements[draggedIndex].render_order
    elements[draggedIndex].render_order = elements[targetIndex].render_order
    elements[targetIndex].render_order = tempOrder

    // Mettre à jour le store si nécessaire
    changeRenderOrderOfEC(elements[draggedIndex], elements[draggedIndex].render_order)
    changeRenderOrderOfEC(elements[targetIndex], elements[targetIndex].render_order)

  }

  draggedItem.value = null

  // ⚡️ Attendre le DOM avant d'appliquer le changement
  await nextTick()
}

// Mise à jour des ordres
const changeRenderOrderOfEC = (ec, order) => {
  ecStore.changeRenderOrderOfEC(ec, order)
    // 🔥 Met à jour la liste avec une nouvelle référence
    refreshThisGEC();
}

const updateGEC = async () => {
  await ecStore.updateGroupeOfEc(props.gec)
  refreshThisGEC();
}

const delEc = async (ec) => {
  await ecStore.removeEC(ec)
    .then((data) => {
    emit('updateBcc', props.gec.bloc_de_competence_id)
    refreshThisGEC();
    })
}

const deleteGroupeEC = async () => {
    await ecStore.removeGroupeEC( props.gec )
    .then((data) => {
    emit('updateBcc', props.gec.bloc_de_competence_id)
    refreshThisGEC();
    })
}

const createSAEPortfolio = () => {
    loaderAddAMS.value = true
    ecStore
    .createSAEPortfolioInGroup({
      bccId: props.gec.bloc_de_competence_id,
      groupe: props.gec.id,
      type: selectedTypeEC.value || 'SAE'
    })
    .then((data) => {
      emit('updateBcc', props.gec.bloc_de_competence_id)
      refreshThisGEC();
      setTimeout(() => {
        loaderAddAMS.value = false
      }, 2000)
    })
}

const createECInThis = () => {
  if (enseignementSelected.value === null) {
    temoinError.value = true
    popUpStore.print({
      isVisible: true,
      message:
        'Veuillez sélectionner un enseignement pour ajouter un EC dans le groupe EC ' + props.index,
      type: 'ERROR'
    })
    setTimeout(() => {
      temoinError.value = false
    }, 2000)
  } else {
    loaderAddEnseignement.value = true
      const selectedEnseignement = props.enseignementsList.find(
        (enseignement) => enseignement.value === enseignementSelected.value
      );
      ecStore
      .createECInGroup({
        enseignementLib: selectedEnseignement.title,
        bccId: props.gec.bloc_de_competence_id,
        groupe: props.gec.id,
        type: 'Enseignement',
        enseignement: enseignementSelected.value
      })
      .then((data) => {
        emit('updateBcc', props.gec.bloc_de_competence_id)
        refreshThisGEC();
      })
    setTimeout(() => {
      loaderAddEnseignement.value = false
    }, 2000)
  }
}
</script>


<style scoped>
</style>
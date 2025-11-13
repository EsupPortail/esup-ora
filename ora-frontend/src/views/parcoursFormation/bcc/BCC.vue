<template>
<v-treeview
    :style="{ width: vcardEditionOpen ? '60%' : '100%' }"
    v-if="treeList.length > 0 && !loader"
    :hide-actions="!actionIcons"
    :indent-lines="indentLines"
    :key="treeKey"
    :hoverable="false"
    :items="treeList"
    selected-color="transparent"
    :separate-roots="separateRoots"
    density="compact"
    item-value="key"
    open-all
  >
    <template v-slot:prepend="{ item, isOpen }">
      <span
        v-if="item.type === 'enseignement'"
        :class="{ 'add-new-item': item.addNewEC || item.addNewUE || item.addNewEnseignement }"
      >
        <v-icon
          v-if="item.addNewEc || item.addNewEcInUE || item.addNewUE || item.addNewEnseignement"
          icon="mdi-plus"
        />
        <v-icon v-else icon="mdi-book-open-variant-outline"></v-icon>
      </span>
      <span v-else-if="item.type === 'periode'"></span>
      <span v-else>
        <v-icon :icon="iconToTypeEC[item.type]"></v-icon>
      </span>
    </template>
    <template v-slot:title="{ item }">
      <div
        v-if="item.addNewEC"
        class="text--secondary"
        @click.stop="ajouterEnseignement(item)"
        style="display: flex; align-items: center; gap: 8px"
      >
        <!-- <v-select
          v-model="refAddEcInPeriod"
          :items="typeAddEc"
          placeholder="Ajouter un élément constitutif"
          hide-details
          variant="outlined"
          density="compact"
          style="min-width: 320px; max-width: 320px"
        />
        <v-btn color="success" @click="ajouterEnseignement(item)" style="margin-left: 8px">
          Ajouter
        </v-btn> -->
      </div>
      <div
        v-else-if="item.addNewEcInUE"
        class="text--secondary"
        style="display: flex; align-items: center; gap: 8px"
      >
        <v-select
          v-model="refAddEc[item.ueId]"
          :items="typeAddEc"
          placeholder="Ajouter un EC dans l'UE"
          hide-details
          variant="outlined"
          density="compact"
          style="min-width: 320px; max-width: 320px"
        />
        <v-btn
          color="success"
          @click="ajouterEcDansUE(item.ueId, refAddEc[item.ueId]) && (refAddEc[item.ueId] = null)"
          style="margin-left: 8px"
        >
          Ajouter
        </v-btn>
      </div>
      <div
        v-else-if="item.addNewPeriode"
        class="text--secondary"
        style="display: flex; align-items: center; gap: 8px"
      >
        <v-icon>mdi-plus-circle-outline</v-icon>
        <v-select
          v-model="refAddPeriodeInCompetence[item.competenceId]"
          :items="periodeStore.periodes"
          variant="outlined"
          density="compact"
          label="Ajouter une période à la compétence"
          dense
          item-title="libelle"
          item-value="id"
          hide-details

          style="min-width: 380px; max-width: 380px; padding-top: 10px; padding-bottom: 10px;"/>
        <v-btn
          color="success"
          @click="ajouterPeriodeToCompetence(refAddPeriodeInCompetence[item.competenceId], item.competenceId) && (refAddPeriodeInCompetence[item.competenceId] = '')"
          style="margin-left: 8px"
        >
          Ajouter
        </v-btn>
      </div>
      <div
        v-else-if="item.addNewEnseignement"
        class="text--secondary"
        style="display: flex; align-items: center; gap: 8px"
      >
        <v-select
          v-model="refAddEnseignement[item.ueId]"
          :items="refEnsSelected"
          placeholder="Ajouter un enseignement dans l'UE"
          hide-details
          variant="outlined"
          density="compact"
          style="min-width: 320px; max-width: 320px"
          item-title="libelle"
          item-value="id"
          @update:menu="fetchEns(item)"
        />
        <v-btn
          color="success"
          @click="
            ajouterEnseignement(item.ueId, refAddEnseignement[item.ueId]) &&
              (refAddEnseignement[item.ueId] = null)
          "
          style="margin-left: 8px"
        >
          Ajouter
        </v-btn>
      </div>
      <div
        v-else-if="item.addNewUE"
        class="text--secondary"
        style="display: flex; align-items: center; gap: 8px"
      >
        <v-text-field
          v-model="libelleUniteToAdd[item.periodeId]"
          placeholder="Ajouter une unité d'enseignement (UE)"
          hide-details
          @keyup.enter="ajouterUniteEnseignement(item) && (libelleUniteToAdd[item.periodeId] = '')"
          variant="outlined"
          density="compact"
          style="min-width: 320px; max-width: 320px"
        />
        <v-btn
          color="success"
          
          @click="ajouterUniteEnseignement(item) && (libelleUniteToAdd[item.periodeId] = '')"
          style="margin-left: 8px"
        >
          Ajouter
        </v-btn>
      </div>
      <div
        v-else-if="
          item.type === 'enseignement' ||
          item.type === 'AMS' ||
          item.type === 'Portfolio' ||
          item.type === 'Stage' ||
          item.type === 'SAE'
        "
        @click.stop="selectItem(item)"
        draggable="true"
        @dragstart="onDragStart($event, item)"
        @dragend="onDragEnd(item)"
        @dragenter="onDragEnter(item)"
        @dragleave="onDragLeave(item)"
        @dragover.prevent
        @drop="onDrop($event, item)"
        :class="[
          'item-block',
          {
            'drop-zone': draggedItem !== null,
            dragging: draggedItem?.id === item.id,
            'drag-over': dragOverItem?.id === item.id
          }
        ]"
      >
        <span>
          {{ item.title.charAt(0).toUpperCase() + item.title.slice(1) }}
        </span>
        <v-icon style="margin-left: 6px" v-if="!item.addNew" icon="mdi-arrow-right" />
      </div>
      <div
        v-else-if="item.type === 'UE'"
        @dragover.prevent
        @drop="onDropOnUE($event, item)"
        :class="[
          'item-block',
          {
            'drop-zone': draggedItem !== null,
            dragging: draggedItem?.id === item.id,
            'drag-over': dragOverItem?.id === item.id
          }
        ]"
      >
        <span style="font-weight: bold">{{ item.title }}</span>
      </div>
      <div v-else>
        <span>{{ item.title.charAt(0).toUpperCase() + item.title.slice(1) }}</span>
      </div>
    </template>
  </v-treeview>
  <v-progress-circular v-else indeterminate color="primary" />
</template>


<script setup>
import { ref, defineEmits, shallowRef, nextTick, computed, watch, onMounted } from 'vue'

import { useEcStore } from '@/stores/elementConstitutifStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useParcoursStore } from '@/stores/parcoursStore'

const props = defineProps({
  selectedData: {
    type: Object,
    required: true
  },
  ajouterEnseignement: {
    type: Function,
    required: true
  },
  ajouterEcDansPeriode: {
    type: Function,
    required: true
  },
  updateUE: {
    type: Function,
    required: true
  },
  refKeyRefreshTreeView: {
    type: Number,
    required: false
  }
})

const emit = defineEmits(['update:selectedData', 'refKeyRefreshTreeView'])

const parcoursStore = useParcoursStore()
const elementsConstitutifsStore = useEcStore()
const periodeStore = usePeriodeStore()
const enseignementsStore = useEnseignementStore()
const competenceStore = useCompetenceStore()

const refreshTreeView = async () => {
  await nextTick()
  emit('refreshTreeView')
}

onMounted(async () => {
  await competenceStore.fetchCompetences()
  await elementsConstitutifsStore.fetchECs()
  await periodeStore.fetchPeriodes()
})

const openNodes = ref([])
const vcardEditionOpen = ref(false)
const elementsConstitutifsList = ref([])

const refMaj = ref(0)
const treeKey = computed(() => {
  //Changer ici les objets d'écoute pour refresh le treeview
  return JSON.stringify({
    periodeCount: periodeStore.periodes.length,
    ueCount: periodeStore.periodes.reduce(
      (acc, p) => acc + (p.unites_enseignement?.length || 0),
      0
    ),
    ecLinkedMaquetteCount: elementsConstitutifsStore.ecs.reduce(
      (acc, ec) => acc + (ec.linked_periodes_maquette?.length || 0),
      0
    ),
    ecCount: elementsConstitutifsStore.ecs.length,
    ecLabels: elementsConstitutifsStore.ecs.map((ec) => ({
      libelle: ec.libelle,
      render_order: ec.render_order
    })),
    ueLabels: periodeStore.periodes.flatMap((p) =>
      p.unites_enseignement
        ? p.unites_enseignement.map((ue) => ({
            libelle: ue.libelle,
            render_order: ue.render_order
          }))
        : []
    ),
    ueECLabels: periodeStore.periodes.flatMap((p) =>
      p.unites_enseignement
        ? p.unites_enseignement.flatMap((ue) =>
            ue.elements_constitutifs
              ? ue.elements_constitutifs.map((ec) => ({
                  libelle: ec.libelle,
                  render_order: ec.render_order
                }))
              : []
          )
        : []
    )
  })
})

const libelleUniteToAdd = ref([])

const loader = ref(false)
const inline = ref(true)
const separateRoots = shallowRef(false)
const actionIcons = shallowRef(true)
const prependIcons = shallowRef(true)
const indentLines = shallowRef(true)

const draggedItem = ref(null)
const dragOverItem = ref(null)

const refAddEc = ref([])
const refAddEcInPeriod = ref([])
const refAddPeriodeInCompetence = ref([])
const refAddEnseignement = ref([])
const typeAddEc = ref(['AMS', 'Portfolio', 'Stage', "Unité d'enseignement", 'Période'])
const iconToTypeEC = {
  AMS: 'mdi-thought-bubble-outline',
  UE: 'mdi-school-outline',
  Portfolio: 'mdi-folder-star-outline',
  Stage: 'mdi-briefcase-check-outline',
  Période: 'mdi-calendar-outline'
}

const isEditingLibelleUE = ref(null)
const editedLibelle = ref('')

const startEditing = (item) => {
  isEditingLibelleUE.value = item.id
  editedLibelle.value = item.title
}

const saveEditing = (item) => {
  item.title = editedLibelle.value
  isEditingLibelleUE.value = null
  props.updateUE(editedLibelle.value, item.ueId)
}

const refEnsSelected = ref([])

const flushEC = () => {
  let ueToDel = []
  periodeStore.periodes.forEach((periode) => {
    periodeStore.updatePeriode({
      id: periode.id,
      unites_enseignement: {
        deleteMany: [...periode.unites_enseignement.map((ue) => ({ id: ue.id }))]
      },
      linked_element_constitutif: {
        deleteMany: [...periode.linked_element_constitutif.map((p) => p.id)]
      }
    })
  })
  elementsConstitutifsStore.ecs.forEach((ec) => {
    elementsConstitutifsStore.removeEC(ec)
  })
}

const ajouterUniteEnseignement = async (treeItem) => {
  if (libelleUniteToAdd.value[treeItem.periodeId].trim() === '') {
    return
  }
  const p = periodeStore.periodes.find((p) => p.id === treeItem.periodeId)
  if (!p) {
    console.error("Période non trouvée pour l'ajout de l'unité d'enseignement")
    return
  }

  const ueOfThisPeriode =
    p.unites_enseignement.length > 1
      ? p.unites_enseignement.sort((a, b) => a.render_order - b.render_order)
      : p.unites_enseignement
  const renderOrder =
    ueOfThisPeriode.length > 0 ? ueOfThisPeriode[ueOfThisPeriode.length - 1].render_order + 1 : 0

  const toCreate = {
    libelle: libelleUniteToAdd.value[treeItem.periodeId],
    render_order: renderOrder
  }

  let idOfNewUE = null
  await periodeStore.updatePeriode({
    id: p.id,
    unites_enseignement: {
      create: [toCreate]
    }
  })
  periodeStore.periodes.forEach((periode) => {
    if (periode.id === p.id) {
      idOfNewUE = periode.unites_enseignement[periode.unites_enseignement.length > 1 ? 1 : 0].id
    }
  })

  // await addUEToTree(p.id, toCreate, idOfNewUE);
  libelleUniteToAdd.value[treeItem.periodeId] = ''
}

const treeList = computed(() => {
  console.log( competenceStore.getCompetenceByVersion())
  let periodesAlreadyConfiguredInSemestreView = []
  periodeStore.periodes.forEach((periode) => {
    if( periode.element_constitutif.length > 0 || periode.unites_enseignement.length > 0 ) {
      periodesAlreadyConfiguredInSemestreView.push(periode.id)
    } 
  })
  return competenceStore.competences.filter((comp) => comp.version_id === parcoursStore.versionSelected.id).map((comp) => ({
    id: 'competence-' + comp.id,
    key: 'competence-' + comp.id,
    title: comp.libelle,
    type: 'competence',
    children: [
    ...periodeStore.periodes
      .filter(
        (periode) =>
          periode.element_constitutif.length > 0 ||
          periode.unites_enseignement.length > 0
      )
      .map((periode) => ({
        id: 'periode-' + periode.id + '-comp-' + comp.id,
        key: 'periode-' + periode.id + '-comp-' + comp.id,
        title: periode.libelle,
        type: 'periode',
        competenceId: comp.id,
        children: [
          ...periode.unites_enseignement
            .slice()
            .sort((a, b) => a.render_order - b.render_order)
            .map((ue) => ({
              id: 'ue-' + ue.id + '-comp-' + comp.id,
              key: 'ue-' + ue.id + '-comp-' + comp.id,
              title: ue.libelle,
              render_order: ue.render_order,
              ueId: ue.id,
              competenceId: comp.id,
              type: 'UE',
              children: [
                ...elementsConstitutifsStore.ecs
                  .slice()
                  .filter((ec) => ec.unites_enseignement_id === ue.id)
                  .sort((a, b) => a.render_order - b.render_order)
                  .map((ec) => ({
                    id: 'ec-' + ec.id + '-comp-' + comp.id,
                    key: 'ec-' + ec.id + '-comp-' + comp.id,
                    title: ec.libelle,
                    render_order: ec.render_order,
                    ueId: ue.id,
                    ecId: ec.id,
                    competenceId: comp.id,
                    type: ec.type
                  })),
                {
                  id: 'ue-' + ue.id + '-998-new-ens-comp-' + comp.id,
                  key: 'ue-' + ue.id + '-998-new-ens-comp-' + comp.id,
                  title: "Ajouter un enseignement dans l'ue",
                  ueId: ue.id,
                  periodeId: periode.id,
                  competenceId: comp.id,
                  render_order: 998,
                  addNewEnseignement: true
                },
                {
                  id: 'ue-' + ue.id + '-999-new-ec-comp-' + comp.id,
                  key: 'ue-' + ue.id + '-999-new-ec-comp-' + comp.id,
                  title: "Ajouter un EC dans l'ue",
                  ueId: ue.id,
                  periodeId: periode.id,
                  competenceId: comp.id,
                  render_order: 999,
                  addNewEcInUE: true
                }
              ]
            })),
          {
            id: 'periode-' + periode.id + '-999-new-ue-comp-' + comp.id,
            key: 'periode-' + periode.id + '-999-new-ue-comp-' + comp.id,
            periodeId: periode.id,
            competenceId: comp.id,
            render_order: 999,
            addNewUE: true
          }
        ]
      })),
    {
      id: 'competence-' + comp.id + '-999-new-periode',
      key: 'competence-' + comp.id + '-999-new-periode',
      competenceId: comp.id,
      render_order: 999,
      addNewPeriode: true
    }
  ]
}))
})

const fetchEns = (item) => {
  refEnsSelected.value =
    periodeStore.periodes.find((p) => p.id === item.periodeId)?.enseignements || []
  refEnsSelected.value = refEnsSelected.value.filter(
    (ens) => ens.apprentissages_critiques && ens.apprentissages_critiques.length > 0
  )
}

// initData()
const selectItem = (item) => {
  emit('update:selectedData', {
    id: item.ecId,
    type: item.type,
    title: item.title
  })
}

const onDragStart = (event, item) => {
  draggedItem.value = item

  // Utiliser un canvas vide pour ne pas casser le drag
  const canvas = document.createElement('canvas')
  canvas.width = 0
  canvas.height = 0
  event.dataTransfer.setDragImage(canvas, 0, 0)

  event.dataTransfer.effectAllowed = 'move'
}

const onDragEnd = () => {
  draggedItem.value = null
  dragOverItem.value = null
}

const onDragEnter = (item) => {
  dragOverItem.value = item
}

const onDragLeave = (item) => {
  if (dragOverItem.value?.id === item.id) {
    dragOverItem.value = null
  }
}

const onDropOnUE = async (event, targetItem) => {
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) {
    draggedItem.value = null
    return
  }

  if( draggedItem.value.periodeId !== targetItem.periodeId ) {
      console.error("Impossible de changer l'ordre de deux EC dans des périodes différentes")
      draggedItem.value = null
      return
    }
  console.log(draggedItem.value, targetItem)
  if( draggedItem.value.type === "UE") {
    //Change render order of UEs
    const oldRO = draggedItem.value.render_order
    await periodeStore.changeRenderOrderOfUE(draggedItem.value.ueId, targetItem.render_order)
    await periodeStore.changeRenderOrderOfUE(targetItem.ueId, oldRO)


    draggedItem.value = null
    return
  }
  await elementsConstitutifsStore.changeUEOFEC(
    draggedItem.value.ecId,
    targetItem.ueId,
    draggedItem.value.ueId,
    draggedItem.value.periodeId 
  )
  draggedItem.value = null
  dragOverItem.value = null
  refMaj.value += 1
  await nextTick()
}

const onDrop = async (event, targetItem) => {
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) {
    draggedItem.value = null
    return
  }
if( draggedItem.value.periodeId !== targetItem.periodeId ) {
      console.error("Impossible de changer l'ordre de deux EC dans des périodes différentes")
      draggedItem.value = null
      return
    }

    if( draggedItem.value.ueId !== targetItem.ueId ) {
      console.error("Impossible de changer l'ordre de deux EC dans des UE différentes")
      draggedItem.value = null
      return
    }

  await changeRenderOrderOfEC(draggedItem.value.id, targetItem.render_order, draggedItem.value.type)
  await changeRenderOrderOfEC(targetItem.id, draggedItem.value.render_order, targetItem.type)
  console.log(
    `Dragging ${draggedItem.value.title} (id: ${draggedItem.value.id}, render_order: ${draggedItem.value.render_order}) to ${targetItem.title} (id: ${targetItem.id}, render_order: ${targetItem.render_order})`
  )

  draggedItem.value = null
  dragOverItem.value = null

  await nextTick()
}

const changeRenderOrderOfEC = (element, newOrder, type) => {
  if (type === 'enseignement') {
    console.log('hello')
    enseignementsStore.changeRenderOrder(element, newOrder)
  }
}

watch(
  () => props.refKeyRefreshTreeView,
  async () => {
    refMaj.value += 1
    console.log('refresh tree view from parent')
    await nextTick()
  }
)

// watch(() => elementsConstitutifsStore.ecs, async (nv) => {
//   refMaj.value += 1
//   await nextTick()
// }, { deep: true })

watch(
  () => treeList.value.map((t) => t.id),
  (ids) => {
    // Ouvre le premier noeud et tous ses enfants
    if (ids.length && treeList.value[0]?.children) {
      const childIds = treeList.value[0].children.map((child) => child.id)
      openNodes.value = [ids[0], ...childIds]
    } else {
      openNodes.value = ids.length ? [ids[0]] : []
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.item-block {
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  cursor: grab;
  user-select: none;
}

/* zone activée par le drag (drop possible) */
.drop-zone {
  border: 2px dashed #cbd5e1; /* gris élégant */
  border-radius: 10px;
  background: #f9fafb;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  transform: scale(0.99);
  transition: all 0.15s ease-in-out;
}

/* élément en cours de drag */
.dragging {
  opacity: 0.6;
  background: #1e293b; /* gris foncé élégant */
  color: #f8fafc;       /* texte clair */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transform: scale(1.02);
  cursor: grabbing;
}

/* élément survolé pendant un drag */
.drag-over {
  background: #ecfeff;       /* bleu clair très doux */
  border: 2px solid #06b6d4; /* cyan tailwind */
  box-shadow: 0 0 6px rgba(6, 182, 212, 0.4);
  transform: scale(1.01);
  transition: all 0.12s ease-in-out;
}

/* suppression des hover/default pour les items "ajout" */
.v-treeview-node__root.add-new-item,
.v-treeview-node__root.add-new-item:hover,
.v-treeview-node__root.add-new-item.v-treeview-node--selected,
.v-treeview-node__root.add-new-item.v-treeview-node--active {
  background: transparent !important;
  color: inherit !important;
  cursor: default;
  box-shadow: none !important;
}

</style>
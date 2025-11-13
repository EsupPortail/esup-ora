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
import { useCompetenceStore } from '@/stores/competenceStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useEnseignementStore } from '@/stores/enseignementStore'

const props = defineProps({
  selectedData: {
    type: Object,
    required: true
  },
  ajouterEnseignement: {
    type: Function,
    required: true
  },
  ajouterEcDansUE: {
    type: Function,
    required: true
  },
  ajouterPeriodeToCompetence: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:selectedData'])

const elementsConstitutifsStore = useEcStore()
const competenceStore = useCompetenceStore()
const periodeStore = usePeriodeStore()
const enseignementsStore = useEnseignementStore()

onMounted(async () => {
  await elementsConstitutifsStore.fetchECs()
  await periodeStore.fetchPeriodes()
  await competenceStore.fetchCompetences()
})

const openNodes = ref([])
const vcardEditionOpen = ref(false)
const elementsConstitutifsList = ref([])
const libelleBlocToAdd = ref([])

const refMaj = ref(0)
const treeKey = computed(() =>
  JSON.stringify(
    periodeStore.periodes.map((p) => ({
      id: p.id,
      maj: refMaj.value,
      ueCount: p.unites_enseignement?.length,
      ecCount: elementsConstitutifsStore.ecs?.length
    }))
  )
)

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
const refAddEnseignement = ref([])
const refAddPeriodeInCompetence = ref([])
const typeAddEc = ref(['AMS', 'Portfolio', 'Stage'])
const iconToTypeEC = {
  AMS: 'mdi-thought-bubble-outline',
  UE: 'mdi-school-outline',
  Portfolio: 'mdi-folder-star-outline',
  Stage: 'mdi-briefcase-check-outline'
}

const refEnsSelected = ref([])

const flushEC = () => {
  let ueToDel = []
  periodeStore.periodes.forEach((periode) => {
    periode.unites_enseignement.forEach((ue) => {
      ueToDel.push({ id: ue.id })
    })
    periodeStore.updatePeriode({
      id: periode.id,
      unites_enseignement: {
        deleteMany: ueToDel
      }
    })
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
  return competenceStore.getCompetenceByVersion().map((comp) => ({
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


  return periodeStore.periodes.map((periode) => ({
    id: 'periode-' + periode.id,
    key: 'periode-' + periode.id,
    title: periode.libelle,
    type: 'periode',
    children: [
      ...periode.unites_enseignement
        .slice()
        .sort((a, b) => a.render_order - b.render_order)
        .map((ue) => ({
          id: 'ue-' + ue.id,
          key: 'ue-' + ue.id,
          title: ue.libelle,
          render_order: ue.render_order,
          ueId: ue.id,
          type: 'UE',
          children: [
            ...elementsConstitutifsStore.ecs
              .slice()
              .filter((ec) => ec.unites_enseignement_id === ue.id)
              .sort((a, b) => a.render_order - b.render_order)
              .map((ec) => ({
                id: 'ec-' + ec.id,
                key: 'ec-' + ec.id,
                title: ec.libelle,
                render_order: ec.render_order,
                ueId: ue.id,
                ecId: ec.id,
                type: ec.type
              })),
            {
              id: 'ue-' + ue.id + '-998-new-ens',
              key: 'ue-' + ue.id + '-998-new-ens',
              title: "Ajouter un enseignement dans l'ue",
              ueId: ue.id,
              periodeId: periode.id,
              render_order: 998,
              addNewEnseignement: true
            },
            {
              id: 'ue-' + ue.id + '-999-new-ec',
              key: 'ue-' + ue.id + '-999-new-ec',
              title: "Ajouter un EC dans l'ue",
              ueId: ue.id,
              periodeId: periode.id,
              render_order: 999,
              addNewEcInUE: true
            }
          ]
        })),
      // {
      //   id: 'periode-' + periode.id + '-998-new-ec',
      //   key: 'periode-' + periode.id + '-998-new-ec',
      //   periodeId: periode.id,
      //   render_order: 998,
      //   addNewEC: true
      // },
      {
        id: 'periode-' + periode.id + '-999-new-ue',
        key: 'periode-' + periode.id + '-999-new-ue',
        periodeId: periode.id,
        render_order: 999,
        addNewUE: true
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
  await elementsConstitutifsStore.changeUEOFEC(
    draggedItem.value.ecId,
    targetItem.ueId,
    draggedItem.value.ueId
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

  changeRenderOrderOfEC(draggedItem.value.id, targetItem.render_order, draggedItem.value.type)
  changeRenderOrderOfEC(targetItem.id, draggedItem.value.render_order, targetItem.type)
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
  padding-top: 5px;
  transition: all 0.2s ease-in-out;
}

/* zone activée par le drag */
.drop-zone {
  border: 1.5px dashed #d1d5db;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* item en cours de drag */
.dragging {
  opacity: 0.3; /* transparent mais encore là */
  background-color: #374151;
  color: white;
  border-radius: 6px;
}

/* highlight quand on passe au-dessus */
.drag-over {
  background-color: #e0f2fe; /* bleu clair élégant */
  border: 1.5px solid #38bdf8; /* bleu cyan */
}
.v-treeview-node__root.add-new-item:hover,
/* Enlève le background hover et sélection pour les items "addNew" */
.v-treeview-node__root.add-new-item,
.v-treeview-node__root.add-new-item:hover,
.v-treeview-node__root.add-new-item.v-treeview-node--selected,
.v-treeview-node__root.add-new-item.v-treeview-node--active {
  background-color: transparent !important;
  color: inherit !important; /* garde la couleur du texte normale */
  cursor: default; /* enlève le pointeur */
}
</style>
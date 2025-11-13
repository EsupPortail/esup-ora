<template>
  <!-- <v-btn @click="flushEC" color="red"> flush ec </v-btn> -->
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
      <span v-else-if="item.addNewEcInUE">
        <v-icon icon="mdi-plus" />
      </span>
      <span v-else-if="item.addNewMutualisation">
        <v-icon icon="mdi-download" />
      </span>
      <span v-else>
        <v-icon :icon="iconToTypeEC[item.type]"></v-icon>
      </span>
      <span v-if="item.tag === 'importé'">
        <v-icon icon="mdi-download" />
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
          v-model="refAddEc[item.periodeId]"
          :items="typeAddEc"
          placeholder="Ajouter un élément"
          hide-details
          variant="outlined"
          density="compact"
          style="min-width: 260px; max-width: 260px"
        />
        <v-btn
          color="success"
          @click="
            ajouterEcDansPeriode(item.periodeId, refAddEc[item.periodeId]) &&
              (refAddEc[item.periodeId] = null)
          "
          style="margin-left: 8px"
        >
          Ajouter
        </v-btn>
      </div>
      <div
        v-else-if="item.addNewMutualisation"
        class="text--secondary"
        style="display: flex; align-items: center; gap: 8px"
      >
        <v-btn
          color="success"
          @click="startMutualisationImport(item.periodeId)"
          style="margin-left: 8px"
        >
          Importer un élément mutualisé
        </v-btn>
      </div>

      <div
        v-else-if="item.addNewEnseignement"
        class="text--secondary"
        style="display: flex; align-items: center; gap: 8px"
      >
        <v-select
          v-model="refAddEnseignement[item.periodeId]"
          :items="refEnsSelected"
          placeholder="Ajouter un enseignement"
          hide-details
          variant="outlined"
          density="compact"
          style="min-width: 260px; max-width: 260px"
          item-title="libelle"
          item-value="id"
          @update:menu="fetchEns(item)"
        />
        <v-btn
          color="success"
          @click="
            ajouterEnseignement(item.periodeId, refAddEnseignement[item.periodeId]) &&
              (refAddEnseignement[item.ueId] = null)
          "
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
          {
            'drop-zone': draggedItem !== null,
            dragging: draggedItem?.id === item.id
          }
        ]"
      >
        <template v-if="item.type === 'enseignement'">
          <span
            :style="item.tag === 'importé' ? 'color: #2e7d32; font-weight: 600;' : ''"
            class="d-inline-flex align-center gap-2"
          >
            {{ item.title.charAt(0).toUpperCase() + item.title.slice(1) }}
            <span v-if="item.tag === 'importé'" class="mutualisation-chip"> Importé </span>
          </span>
        </template>

        <template v-else-if="editingLibelleOfEC !== item.id">
          <v-row style="padding-top: 4px; padding-bottom: 4px">
            <v-col cols="10">
              <span
                :style="item.tag === 'importé' ? 'color: #2e7d32; font-weight: 600;' : ''"
                class="d-inline-flex align-center gap-2"
              >
                {{ item.title.charAt(0).toUpperCase() + item.title.slice(1) }}
                <span v-if="item.tag === 'importé'" class="mutualisation-chip"> Importé </span>
              </span>
            </v-col>
            <v-col cols="2">
              <v-btn icon="mdi-pencil" size="x-small" @click="startEditingEC(item)" />
              <v-icon style="margin-left: 6px" v-if="!item.addNew" icon="mdi-arrow-right" />
            </v-col>
          </v-row>
        </template>

        <template v-else>
          <!-- bloc édition inchangé -->
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="editedEC"
                density="compact"
                variant="outlined"
                hide-details
                autofocus
              />
            </v-col>
            <v-col cols="2">
              <v-btn icon="mdi-check" size="x-small" color="success" @click="saveEditingEC(item)" />
              <v-icon style="margin-left: 6px" v-if="!item.addNew" icon="mdi-arrow-right" />
            </v-col>
          </v-row>
        </template>
      </div>
      <div
        v-else-if="item.type === 'UE'"
        @click.stop="selectItem(item)"
        draggable="true"
        @dragstart="onDragStart($event, item)"
        @dragend="onDragEnd(item)"
        @dragenter="onDragEnter(item)"
        @dragleave="onDragLeave(item)"
        @dragover.prevent
        @drop="onDropOnUE($event, item)"
        :class="[
          'item-block',
          {
            'drop-zone': draggedItem !== null,
            'drag-over': dragOverItem?.id === item.id
          }
        ]"
      >
        <div class="d-flex align-center justify-space-between w-100">
          <template v-if="isEditingLibelleUE === item.id">
            <v-text-field
              v-model="editedLibelle"
              density="compact"
              variant="outlined"
              hide-details
              autofocus
              @keyup.enter="saveEditing(item)"
              @blur="saveEditing(item)"
            />
          </template>

          <template v-else>
            <span style="font-weight: bold">{{ item.title }}</span>
            <v-btn icon size="small" variant="text" @click="startEditing(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </div>
      </div>
      <div
        v-else
        @dragenter="onDragEnter(item)"
        @dragleave="onDragLeave(item)"
        @dragover.prevent
        @drop="onDropOnPeriod($event, item)"
        :class="[
          {
            'drop-zone': draggedItem !== null,
            dragging: draggedItem?.id === item.id
          }
        ]"
      >
        <span>{{ item.title.charAt(0).toUpperCase() + item.title.slice(1) }}</span>
      </div>
    </template>
  </v-treeview>
  <MutualisationOverlay
    v-if="periodeMutualisationImport !== null"
    :refKeyRefreshTreeView="refKeyRefreshTreeView"
    v-model:overlayShow="overlayShow"
    @update:overlayShow="overlayShow = $event"
    :periodeId="periodeMutualisationImport"
  />
</template>



<script setup>
import { ref, defineEmits, shallowRef, nextTick, computed, watch, onMounted } from 'vue'

import { useEcStore } from '@/stores/elementConstitutifStore'
import { usePeriodeStore } from '@/stores/periodeStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useFormationStore } from '@/stores/formationStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useCompetenceStore } from '@/stores/competenceStore'

import MutualisationOverlay from './MutualisationOverlay.vue'

const props = defineProps({
  isSemestre: {
    type: Boolean,
    required: true
  },
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

const formationStore = useFormationStore()
const parcoursStore = useParcoursStore()
const elementsConstitutifsStore = useEcStore()
const periodeStore = usePeriodeStore()
const competenceStore = useCompetenceStore()
const enseignementsStore = useEnseignementStore()

const periodeMutualisationImport = ref(null)
const overlayShow = ref(false)

const startMutualisationImport = (periodeId) => {
  console.log('start mutualisation import for periode id', periodeId)
  periodeMutualisationImport.value = periodeId
  overlayShow.value = true
}

const refreshTreeView = async () => {
  await nextTick()
  emit('refreshTreeView')
}

onMounted(async () => {
  await elementsConstitutifsStore.fetchECs()
  await periodeStore.fetchPeriodes()
  await competenceStore.fetchCompetenceForSelectedVersion()
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
    rootElementCount: periodeStore.periodes.reduce(
      (acc, p) => acc + (p.linked_element_constitutif ? p.linked_element_constitutif.length : 0),
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
    ),
    importedECLabels: periodeStore.periodes.flatMap((p) =>
      p.ec_imported_by_mutualisation
        ? p.ec_imported_by_mutualisation.map((imported) => ({
            id: imported.id,
            element_constitutif_id: imported.element_constitutif_id,
            render_order: imported.render_order
          }))
        : []
    ),

    // --- ✅ ECs importés par mutualisation dans les UEs ---
    ueImportedECLabels: periodeStore.periodes.flatMap((p) =>
      p.unites_enseignement
        ? p.unites_enseignement.flatMap((ue) =>
            ue.ecs_imported
              ? ue.ecs_imported.map((imported) => ({
                  id: imported.id,
                  element_constitutif_id: imported.element_constitutif_id,
                  render_order: imported.render_order
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
const refAddEnseignement = ref([])
const typeAddEc = ref(['AMS', 'Portfolio', 'Stage', "Unité d'enseignement"])
const iconToTypeEC = {
  AMS: 'mdi-thought-bubble-outline',
  UE: 'mdi-school-outline',
  Portfolio: 'mdi-folder-star-outline',
  Stage: 'mdi-briefcase-check-outline'
}

const isEditingLibelleUE = ref(null)
const editedLibelle = ref('')

const editingLibelleOfEC = ref('')
const editedEC = ref(null)
const startEditingEC = (item) => {
  console.log('edit ec', item)
  editingLibelleOfEC.value = item.id
  editedEC.value = item.title
}

const saveEditingEC = async (item) => {
  let currentEC = elementsConstitutifsStore.ecs.find((ec) => ec.id === item.ecId)
  currentEC.libelle = editedEC.value
  await elementsConstitutifsStore.updateEC(currentEC)
  editingLibelleOfEC.value = null
  editedEC.value = ''
}

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
  if (!periodeStore.periodes.length) return []
  console.log(periodeStore.periodes[0].ec_imported_by_mutualisation)
  console.log(periodeStore.periodes[0].unites_enseignement)
  // Cas SEMESTRE
  if (props.isSemestre) {
    return periodeStore.periodes.map((periode) => ({
      id: 'periode-' + periode.id,
      key: 'periode-' + periode.id,
      title: periode.libelle,
      idPeriod: periode.id,
      type: 'periode',
      children: [
        // --- 🧩 UEs ---
        ...periode.unites_enseignement
          .slice()
          .sort((a, b) => a.render_order - b.render_order)
          .map((ue) => ({
            id: 'ue-' + ue.id,
            key: 'ue-' + ue.id,
            title: ue.libelle,
            render_order: ue.render_order,
            ueId: ue.id,
            periodeId: periode.id,
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
                  periodeId: periode.id,
                  ecId: ec.id,
                  type: ec.type
                })),

              // --- ✅ ECs importés par mutualisation dans l’UE ---
              ...(ue.ecs_imported || [])
                .map((imported) => {
                  const ec = elementsConstitutifsStore.ecs.find(
                    (e) => e.id === imported.element_constitutif_id
                  )
                  if (!ec) return null
                  return {
                    id: `ue-${ue.id}-ec-imported-${ec.id}`,
                    key: `ue-${ue.id}-ec-imported-${ec.id}`,
                    title: ec.libelle,
                    render_order: imported.render_order ?? ec.render_order ?? 9999,
                    ueId: ue.id,
                    id_element_imported: imported.id,
                    periodeId: periode.id,
                    ecId: ec.id,
                    type: ec.type,
                    tag: 'importé' // 🟢 Affiche le label vert "Importée"
                  }
                })
                .sort((a, b) => a.render_order - b.render_order)
            ]
          })),

        // --- 🎓 ECs directement liés à la période ---
        ...elementsConstitutifsStore.ecs
          .slice()
          .filter((ec) => ec.linked_periodes_maquette.some((lp) => lp.id === periode.id))
          .sort((a, b) => a.render_order - b.render_order)
          .map((ec) => ({
            id: 'p-' + periode.id + '-ec-' + ec.id,
            key: 'p-' + periode.id + '-ec-' + ec.id,
            title: ec.libelle,
            render_order: ec.render_order,
            periodeId: periode.id,
            ecId: ec.id,
            type: ec.type
          })),

        // --- 🔄 ECs importés par mutualisation ---
        ...(periode.ec_imported_by_mutualisation || [])
          .map((imported) => {
            const ec = elementsConstitutifsStore.ecs.find(
              (e) => e.id === imported.element_constitutif_id
            )
            if (!ec) return null

            return {
              id: `p-${periode.id}-ec-imported-${ec.id}`,
              key: `p-${periode.id}-ec-imported-${ec.id}`,
              title: ec.libelle,
              render_order: imported.render_order ?? ec.render_order ?? 9999,
              periodeId: periode.id,
              id_element_imported: imported.id,
              ecId: ec.id,
              type: ec.type,
              tag: 'importé' // ✅ tag spécifique pour différencier
            }
          })
          .filter(Boolean)
          .sort((a, b) => a.render_order - b.render_order),

        // --- ➕ Boutons d’ajout ---
        {
          id: 'periode-' + periode.id + '-999-new-ec',
          key: 'periode-' + periode.id + '-999-new-ec',
          title: 'Ajouter un élément',
          periodeId: periode.id,
          render_order: 998,
          addNewEcInUE: true
        },
        {
          id: '-periode-' + periode.id + '-999-new-mutualisation',
          key: '-periode-' + periode.id + '-999-new-mutualisation',
          title: 'Importer une mutualisation',
          periodeId: periode.id,
          render_order: 999,
          addNewMutualisation: true
        }
      ]
    }))
  }

  // Cas BCC (non semestre)
  return competenceStore.competences
    .filter((comp) => comp.version_id === parcoursStore.versionSelected.id)
    .map((comp) => ({
      id: 'competence-' + comp.id,
      key: 'competence-' + comp.id,
      title: comp.libelle,
      type: 'competence',

      // à l’intérieur, tu réutilises la même logique que pour les périodes
      children: periodeStore.periodes.map((periode) => ({
        id: 'competence-' + comp.id + '-periode-' + periode.id,
        key: 'competence-' + comp.id + '-periode-' + periode.id,
        title: periode.libelle,
        idPeriod: periode.id,
        type: 'periode',
        children: [
          // UEs
          ...periode.unites_enseignement
            .slice()
            .sort((a, b) => a.render_order - b.render_order)
            .map((ue) => ({
              id: 'competence-' + comp.id + '-ue-' + ue.id,
              key: 'competence-' + comp.id + '-ue-' + ue.id,
              title: ue.libelle,
              render_order: ue.render_order,
              ueId: ue.id,
              periodeId: periode.id,
              competenceId: comp.id,
              type: 'UE',
              children: [
                ...elementsConstitutifsStore.ecs
                  .slice()
                  .filter((ec) => ec.unites_enseignement_id === ue.id)
                  .filter(ec => {
    if (ec.type !== 'enseignement') return true // garder tous les autres types
    if (!ec.enseignement_id) return false

    const enseignement = enseignementsStore.enseignements.find(e => e.id === ec.enseignement_id)
    if (!enseignement) return false

    const apprentissages = enseignement.apprentissages_critiques || []

    const resultNiveauxCompetences = apprentissages
      .map(ac => Number(ac.niveau?.competence_id))
      .filter(Boolean)

    return resultNiveauxCompetences.includes(Number(comp.id))
  })
                  .sort((a, b) => a.render_order - b.render_order)
                  .map((ec) => ({
                    id: 'competence-' + comp.id + '-ec-' + ec.id,
                    key: 'competence-' + comp.id + '-ec-' + ec.id,
                    title: ec.libelle,
                    render_order: ec.render_order,
                    ueId: ue.id,
                    periodeId: periode.id,
                    competenceId: comp.id,
                    ecId: ec.id,
                    type: ec.type
                  }))
              ]
            })),

          // ECs directement liés à la période
          ...elementsConstitutifsStore.ecs
            .slice()
            .filter((ec) => ec.linked_periodes_maquette.some((lp) => lp.id === periode.id))
.filter(ec => {
  if (ec.type !== 'enseignement') return true // garder tous les autres types
  if (!ec.enseignement_id) return false

  const enseignement = enseignementsStore.enseignements.find(e => e.id === ec.enseignement_id)
  if (!enseignement) return false

  const apprentissages = enseignement.apprentissages_critiques || []

  // debugger
  apprentissages.forEach(ac => {
    console.log('EC:', ec.libelle, 'AC:', ac.libelle, 'niveau.competence_id:', ac.niveau?.competence_id)
  })

  const resultNiveauxCompetences = apprentissages
    .map(ac => Number(ac.niveau?.competence_id)) // forcer le type Number
    .filter(Boolean)

  return resultNiveauxCompetences.includes(Number(comp.id))
})

            .sort((a, b) => a.render_order - b.render_order)
            .map((ec) => ({
              id: 'competence-' + comp.id + '-p-' + periode.id + '-ec-' + ec.id,
              key: 'competence-' + comp.id + '-p-' + periode.id + '-ec-' + ec.id,
              title: ec.libelle,
              render_order: ec.render_order,
              periodeId: periode.id,
              competenceId: comp.id,
              ecId: ec.id,
              type: ec.type
            })),

          // Bouton d’ajout
          {
            id: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-ec',
            key: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-ec',
            title: 'Ajouter un élément',
            periodeId: periode.id,
            competenceId: comp.id,
            render_order: 998,
            addNewEcInUE: true
          },
          {
            id: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-mutualisation',
            key: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-mutualisation',
            title: 'Importer une mutualisation',
            periodeId: periode.id,
            competenceId: comp.id,
            render_order: 999,
            addNewMutualisation: true
          }
        ]
      }))
    }))
})

const fetchEns = (item) => {
  refEnsSelected.value =
    periodeStore.periodes.find((p) => p.id === item.periodeId)?.enseignements || []
  refEnsSelected.value = refEnsSelected.value.filter(
    (ens) => ens.apprentissages_critiques && ens.apprentissages_critiques.length > 0
  )
}

const initData = async () => {
  await enseignementsStore.fetchEnseignements();
}

initData();

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

const onDropOnPeriod = async (event, targetItem) => {
  console.log('drop on period')
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) {
    console.log('error 1')
    draggedItem.value = null
    return
  }
  if (draggedItem.value.type === 'UE' || draggedItem.type === 'periode') {
    console.log('error 2')
    draggedItem.value = null
    return
  }

  if (draggedItem.value.tag === 'importé') {
    console.log(draggedItem.value)
    await elementsConstitutifsStore.importedOutOfUE(
      draggedItem.value.ueId,
      draggedItem.value.periodeId,
      draggedItem.value.id_element_imported
    )
    draggedItem.value = null
    return
  }

  console.log(draggedItem.value, targetItem)
  console.log('Move EC out of UE to period')
  console.log(draggedItem.value.id, draggedItem.value.ueId, targetItem.id)
  await elementsConstitutifsStore.ecOutOfUeToPeriod(
    draggedItem.value.ecId,
    draggedItem.value.ueId,
    targetItem.idPeriod
  )

  draggedItem.value = null
  dragOverItem.value = null
  refMaj.value += 1
  await nextTick()
}

const changeImportedElementOfUE = async (importedItem, targetUE) => {
  try {
    // Appel à ta logique spécifique pour les éléments importés
    await elementsConstitutifsStore.changeImportedElementOfUE(
      importedItem.id_element_imported,
      targetUE.ueId
    )
    console.log(
      `Élément importé ${importedItem.id_element_imported} déplacé vers UE ${targetUE.ueId}`
    )
  } catch (error) {
    console.error("Erreur lors du déplacement d'un élément importé :", error)
  }
}

const onDropOnUE = async (event, targetItem) => {
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) {
    draggedItem.value = null
    return
  }

  if (draggedItem.value.periodeId !== targetItem.periodeId) {
    console.error("Impossible de changer l'ordre de deux EC dans des périodes différentes")
    draggedItem.value = null
    return
  }
  console.log(draggedItem.value, targetItem)

  if (draggedItem.value.tag === 'importé') {
    await changeImportedElementOfUE(draggedItem.value, targetItem)
    draggedItem.value = null
    return
  }

  if (draggedItem.value.type === 'UE') {
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

  if (draggedItem.value.periodeId !== targetItem.periodeId) {
    console.error("Impossible de changer l'ordre de deux EC dans des périodes différentes")
    draggedItem.value = null
    return
  }

  if (draggedItem.value.ueId !== targetItem.ueId) {
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

const isCompetenceIsCurrentForThis = async (competenceId, enseignementId) => {
  const result = await enseignementsStore.fetchEnseignementFullToCompetenceById(enseignementId)
  if (!result.apprentissages_critiques || result.apprentissages_critiques.length === 0) return false

  const resultNiveauxCompetences = result.apprentissages_critiques
    .map(ac => ac.niveau?.competence_id)
    .filter(Boolean) // enlever les undefined

  return resultNiveauxCompetences.includes(competenceId)
}


watch(
  () => refMaj.value,
  async () => {
    console.log('refresh tree view from internal change')
  }
)

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
  color: #f8fafc; /* texte clair */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transform: scale(1.02);
  cursor: grabbing;
}

/* élément survolé pendant un drag */
.drag-over {
  background: #ecfeff; /* bleu clair très doux */
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

.mutualisation-chip {
  display: inline-flex;
  align-items: center;
  background-color: #2e7d32; /* vert foncé */
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 9999px; /* arrondi total pour effet "pill" */
  margin-left: 8px;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15); /* petite ombre douce */
}
.mutualisation-chip .v-icon {
  color: white !important;
}
</style>
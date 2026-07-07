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
    <template v-slot:prepend="{ item, isOpen }" >
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
        v-else-if="ecTypes.includes(item.type)"
        @click.stop="selectItem(item)"
        @dragenter="onDragEnter(item)"
        @dragleave="onDragLeave(item)"
        @dragover.prevent
        @drop="onDrop($event, item)"
        :class="[
          'tree-item',
          'ec-row',
          {
            'drop-target': isCompatibleTarget(item),
            'drag-over': isDragOver(item),
            dragging: draggedItem?.id === item.id
          }
        ]"
      >
        <span
          class="drag-handle"
          draggable="true"
          title="Glisser pour déplacer"
          @click.stop
          @dragstart="onDragStart($event, item)"
          @dragend="onDragEnd"
        >
          <v-icon icon="mdi-cursor-move" size="18" />
        </span>
        <div class="ec-content">
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
      </div>
      <div
        v-else-if="item.type === 'UE'"
        @click.stop="selectItem(item)"
        @dragenter="onDragEnter(item)"
        @dragleave="onDragLeave(item)"
        @dragover.prevent
        @drop="onDropOnUE($event, item)"
        :class="[
          'item-block',
          'tree-item',
          {
            'drop-target': isCompatibleTarget(item),
            'drag-over': isDragOver(item),
            dragging: draggedItem?.id === item.id
          }
        ]"
      >
        <div class="d-flex align-center w-100" style="gap: 6px">
          <span
            class="drag-handle"
            draggable="true"
            title="Glisser pour déplacer"
            @click.stop
            @dragstart="onDragStart($event, item)"
            @dragend="onDragEnd"
          >
            <v-icon icon="mdi-cursor-move" size="18" />
          </span>
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
      </div>
      <div
        v-else
        @dragenter="onDragEnter(item)"
        @dragleave="onDragLeave(item)"
        @dragover.prevent
        @drop="onDropOnPeriod($event, item)"
        :class="[
          'tree-item',
          'periode-item',
          {
            'drop-target': isCompatibleTarget(item),
            'drag-over': isDragOver(item)
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
  periodeMutualisationImport.value = periodeId
  overlayShow.value = true
}

const refreshTreeView = async () => {
  await nextTick()
  emit('refreshTreeView')
}

onMounted(async () => {
  await nextTick();
  await enseignementsStore.fetchEnseignements()
  await elementsConstitutifsStore.fetchECs()
  await competenceStore.fetchCompetenceForSelectedVersion()
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

// Tri commun : tous les items d'un même niveau confondus, par render_order
const byRenderOrder = (a, b) => (a.render_order ?? 9999) - (b.render_order ?? 9999)

// L'EC est-il rattaché à la compétence ? (via les apprentissages critiques
// de son enseignement). Les types autres qu'enseignement sont toujours gardés.
// keepIfUnknown : pour les EC importés d'une autre maquette, dont l'enseignement
// n'est pas forcément présent dans le store local, on choisit de les garder
// visibles plutôt que de les masquer silencieusement. Passer false pour inverser.
const ecMatchesCompetence = (ec, compId, keepIfUnknown = false) => {
  if (ec.type !== 'enseignement') return true // garder tous les autres types
  if (!ec.enseignement_id) return keepIfUnknown

  const enseignement = enseignementsStore.enseignements.find((e) => e.id === ec.enseignement_id)
  if (!enseignement) return keepIfUnknown

  const apprentissages = enseignement.apprentissages_critiques || []

  const resultNiveauxCompetences = apprentissages
    .map((ac) => Number(ac.niveau?.competence_id)) // forcer le type Number
    .filter(Boolean)

  return resultNiveauxCompetences.includes(Number(compId))
}

const treeList = computed(() => {
  if (!periodeStore.periodes.length) return []
  if (props.isSemestre) {
    return periodeStore.periodes.map((periode) => {
      // --- 🧩 UEs (leurs enfants : EC locaux + importés, triés ensemble) ---
      const ueNodes = periode.unites_enseignement.slice().map((ue) => {
        const ecNodes = elementsConstitutifsStore.ecs
          .slice()
          .filter((ec) => ec.unites_enseignement_id === ue.id)
          .map((ec) => ({
            id: 'ec-' + ec.id,
            key: 'ec-' + ec.id,
            title: ec.libelle,
            render_order: ec.render_order,
            ueId: ue.id,
            periodeId: periode.id,
            ecId: ec.id,
            type: ec.type
          }))

        // --- ✅ ECs importés par mutualisation dans l’UE ---
        const importedNodes = (ue.ecs_imported || [])
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
          .filter(Boolean)

        return {
          id: 'ue-' + ue.id,
          key: 'ue-' + ue.id,
          title: ue.libelle,
          render_order: ue.render_order,
          ueId: ue.id,
          periodeId: periode.id,
          type: 'UE',
          // locaux et importés confondus, un seul tri
          children: [...ecNodes, ...importedNodes].sort(byRenderOrder)
        }
      })

      // --- 🎓 ECs directement liés à la période ---
      const rootEcNodes = elementsConstitutifsStore.ecs
        .slice()
        .filter((ec) => ec.linked_periodes_maquette.some((lp) => lp.id === periode.id))
        .map((ec) => ({
          id: 'p-' + periode.id + '-ec-' + ec.id,
          key: 'p-' + periode.id + '-ec-' + ec.id,
          title: ec.libelle,
          render_order: ec.render_order,
          periodeId: periode.id,
          ecId: ec.id,
          type: ec.type
        }))

      // --- 🔄 ECs importés par mutualisation à la racine de la période ---
      const rootImportedNodes = (periode.ec_imported_by_mutualisation || [])
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

      return {
        id: 'periode-' + periode.id,
        key: 'periode-' + periode.id,
        title: periode.libelle,
        idPeriod: periode.id,
        type: 'periode',
        children: [
          // UEs, EC racine et EC importés tous confondus, un seul tri
          ...[...ueNodes, ...rootEcNodes, ...rootImportedNodes].sort(byRenderOrder),

          // --- ➕ Boutons d’ajout (toujours en fin de liste) ---
          {
            id: 'periode-' + periode.id + '-999-new-ec',
            key: 'periode-' + periode.id + '-999-new-ec',
            title: 'Ajouter un élément',
            type: "addEC",
            periodeId: periode.id,
            render_order: 998,
            addNewEcInUE: true
          },
          {
            id: '-periode-' + periode.id + '-999-new-mutualisation',
            key: '-periode-' + periode.id + '-999-new-mutualisation',
            title: 'Importer une mutualisation',
            type: "addImportMut",
            periodeId: periode.id,
            render_order: 999,
            addNewMutualisation: true
          }
        ]
      }
    })
  }

  // Cas BCC (non semestre)
  return competenceStore.competences
    .filter((comp) => comp.version_id === parcoursStore.versionSelected.id)
    .map((comp) => ({
      id: 'competence-' + comp.id,
      key: 'competence-' + comp.id,
      title: comp.competence_contextualisee || comp.libelle,
      type: 'competence',

      // à l’intérieur, tu réutilises la même logique que pour les périodes
      children: periodeStore.periodes.map((periode) => {
        // UEs (enfants : EC locaux + importés, filtrés par compétence, triés ensemble)
        const ueNodes = periode.unites_enseignement.slice().map((ue) => {
          const ecNodes = elementsConstitutifsStore.ecs
            .slice()
            .filter((ec) => ec.unites_enseignement_id === ue.id)
            .filter((ec) => ecMatchesCompetence(ec, comp.id))
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

          // ECs importés par mutualisation dans l’UE
          const importedNodes = (ue.ecs_imported || [])
            .map((imported) => {
              const ec = elementsConstitutifsStore.ecs.find(
                (e) => e.id === imported.element_constitutif_id
              )
              if (!ec) return null
              // EC externe : on garde si l'enseignement n'est pas résolvable localement
              if (!ecMatchesCompetence(ec, comp.id, true)) return null
              return {
                id: `competence-${comp.id}-ue-${ue.id}-ec-imported-${ec.id}`,
                key: `competence-${comp.id}-ue-${ue.id}-ec-imported-${ec.id}`,
                title: ec.libelle,
                render_order: imported.render_order ?? ec.render_order ?? 9999,
                ueId: ue.id,
                id_element_imported: imported.id,
                periodeId: periode.id,
                competenceId: comp.id,
                ecId: ec.id,
                type: ec.type,
                tag: 'importé'
              }
            })
            .filter(Boolean)

          return {
            id: 'competence-' + comp.id + '-ue-' + ue.id,
            key: 'competence-' + comp.id + '-ue-' + ue.id,
            title: ue.libelle,
            render_order: ue.render_order,
            ueId: ue.id,
            periodeId: periode.id,
            competenceId: comp.id,
            type: 'UE',
            // locaux et importés confondus, un seul tri
            children: [...ecNodes, ...importedNodes].sort(byRenderOrder)
          }
        })

        // ECs directement liés à la période
        const rootEcNodes = elementsConstitutifsStore.ecs
          .slice()
          .filter((ec) => ec.linked_periodes_maquette.some((lp) => lp.id === periode.id))
          .filter((ec) => ecMatchesCompetence(ec, comp.id))
          .map((ec) => ({
            id: 'competence-' + comp.id + '-p-' + periode.id + '-ec-' + ec.id,
            key: 'competence-' + comp.id + '-p-' + periode.id + '-ec-' + ec.id,
            title: ec.libelle,
            render_order: ec.render_order,
            periodeId: periode.id,
            competenceId: comp.id,
            ecId: ec.id,
            type: ec.type
          }))

        // ECs importés par mutualisation à la racine de la période
        const rootImportedNodes = (periode.ec_imported_by_mutualisation || [])
          .map((imported) => {
            const ec = elementsConstitutifsStore.ecs.find(
              (e) => e.id === imported.element_constitutif_id
            )
            if (!ec) return null
            // EC externe : on garde si l'enseignement n'est pas résolvable localement
            if (!ecMatchesCompetence(ec, comp.id, true)) return null
            return {
              id: `competence-${comp.id}-p-${periode.id}-ec-imported-${ec.id}`,
              key: `competence-${comp.id}-p-${periode.id}-ec-imported-${ec.id}`,
              title: ec.libelle,
              render_order: imported.render_order ?? ec.render_order ?? 9999,
              periodeId: periode.id,
              id_element_imported: imported.id,
              competenceId: comp.id,
              ecId: ec.id,
              type: ec.type,
              tag: 'importé'
            }
          })
          .filter(Boolean)

        return {
          id: 'competence-' + comp.id + '-periode-' + periode.id,
          key: 'competence-' + comp.id + '-periode-' + periode.id,
          title: periode.libelle,
          idPeriod: periode.id,
          type: 'periode',
          children: [
            // UEs, EC racine et EC importés tous confondus, un seul tri
            ...[...ueNodes, ...rootEcNodes, ...rootImportedNodes].sort(byRenderOrder),

            // Boutons d’ajout (toujours en fin de liste)
            {
              id: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-ec',
              key: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-ec',
              title: 'Ajouter un élément',
              periodeId: periode.id,
              competenceId: comp.id,
              render_order: 998,
              type: "addPeriode",
              addNewEcInUE: true
            },
            {
              id: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-mutualisation',
              key: 'competence-' + comp.id + '-periode-' + periode.id + '-999-new-mutualisation',
              title: 'Importer une mutualisation',
              periodeId: periode.id,
              type: "addImportMutBcc",
              competenceId: comp.id,
              render_order: 999,
              addNewMutualisation: true
            }
          ]
        }
      })
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
  await nextTick();
}

initData()

// initData()
const selectItem = (item) => {
  if (item.type === 'UE') {
    emit('update:selectedData', {
      id: item.ueId,
      is_imported: item.id_element_imported ? true : false,
      type: item.type,
      title: item.title
    })
  } else {
    emit('update:selectedData', {
      id: item.ecId,
      is_imported: item.id_element_imported ? true : false,
      type: item.type,
      title: item.title
    })
  }
}

// --- Drag & Drop : helpers ---

const ecTypes = ['enseignement', 'AMS', 'Portfolio', 'Stage', 'SAE']

// Deux EC sont dans le même conteneur s'ils partagent la même UE,
// ou s'ils sont tous les deux à la racine de la même période
const isSameContainer = (a, b) => a.periodeId === b.periodeId && a.ueId === b.ueId

// Une cible est compatible si le drop a réellement un sens métier.
// C'est ce qui pilote à la fois le visuel (drop-target / drag-over)
// ET l'autorisation effective du drop dans les handlers.
const isCompatibleTarget = (target) => {
  const d = draggedItem.value
  if (!d || d.id === target.id) return false

  // UE déplacée : interversion uniquement avec une autre UE de la même période
  if (d.type === 'UE') {
    return target.type === 'UE' && target.periodeId === d.periodeId
  }

  // EC (enseignement, AMS, Portfolio, Stage, SAE), importé ou non
  if (target.type === 'periode') {
    // sortir d'une UE vers la racine de la période
    return d.ueId !== undefined && d.ueId !== null
  }
  if (target.type === 'UE') {
    // déplacer l'EC dans une autre UE de la même période
    return target.periodeId === d.periodeId && target.ueId !== d.ueId
  }
  // EC ↔ EC : interversion d'ordre, uniquement dans le même conteneur
  return ecTypes.includes(target.type) && isSameContainer(d, target)
}

const isDragOver = (item) => {
  return dragOverItem.value?.id === item.id && isCompatibleTarget(item)
}

const onDragStart = (event, item) => {
  draggedItem.value = item

  // Ghost personnalisé : une "pill" avec l'icône implicite du libellé,
  // attachée au curseur pendant tout le drag
  const ghost = document.createElement('div')
  ghost.className = 'tree-drag-ghost'
  ghost.textContent = item.title.charAt(0).toUpperCase() + item.title.slice(1)
  document.body.appendChild(ghost)
  event.dataTransfer.setDragImage(ghost, 16, 22)

  // Le ghost doit exister au moment du setDragImage,
  // on le retire juste après que le navigateur en ait fait sa capture
  requestAnimationFrame(() => {
    if (ghost.parentNode) ghost.parentNode.removeChild(ghost)
  })

  event.dataTransfer.effectAllowed = 'move'
}

// Compteur d'enter/leave par item : le dragleave natif se déclenche
// quand on survole un enfant de la cible, ce qui fait scintiller le
// highlight. Le compteur ne retire le drag-over qu'à la vraie sortie.
const dragCounters = ref({})

const resetDragState = () => {
  draggedItem.value = null
  dragOverItem.value = null
  dragCounters.value = {}
}

const onDragEnd = () => {
  resetDragState()
}

const onDragEnter = (item) => {
  if (!isCompatibleTarget(item)) return
  dragCounters.value[item.id] = (dragCounters.value[item.id] || 0) + 1
  dragOverItem.value = item
}

const onDragLeave = (item) => {
  if (!dragCounters.value[item.id]) return
  dragCounters.value[item.id] -= 1
  if (dragCounters.value[item.id] <= 0 && dragOverItem.value?.id === item.id) {
    dragOverItem.value = null
  }
}

const onDropOnPeriod = async (event, targetItem) => {
  if (!draggedItem.value || !isCompatibleTarget(targetItem)) {
    resetDragState()
    return
  }
  const dragged = draggedItem.value

  if (dragged.tag === 'importé') {
    await elementsConstitutifsStore.importedOutOfUE(
      dragged.ueId,
      dragged.periodeId,
      dragged.id_element_imported
    )
  } else {
    await elementsConstitutifsStore.ecOutOfUeToPeriod(
      dragged.ecId,
      dragged.ueId,
      targetItem.idPeriod
    )
  }

  resetDragState()
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
  } catch (error) {
    console.error("Erreur lors du déplacement d'un élément importé :", error)
  }
}

const onDropOnUE = async (event, targetItem) => {
  if (!draggedItem.value || !isCompatibleTarget(targetItem)) {
    resetDragState()
    return
  }
  const dragged = draggedItem.value

  // UE ↔ UE : interversion de l'ordre d'affichage (rangement des blocs)
  if (dragged.type === 'UE') {
    const oldRO = dragged.render_order
    await periodeStore.changeRenderOrderOfUE(dragged.ueId, targetItem.render_order)
    await periodeStore.changeRenderOrderOfUE(targetItem.ueId, oldRO)
    resetDragState()
    refMaj.value += 1
    await nextTick()
    return
  }

  // EC importé déplacé vers une autre UE
  if (dragged.tag === 'importé') {
    await changeImportedElementOfUE(dragged, targetItem)
    resetDragState()
    refMaj.value += 1
    await nextTick()
    return
  }

  // EC classique déplacé vers une autre UE
  await elementsConstitutifsStore.changeUEOFEC(
    dragged.ecId,
    targetItem.ueId,
    dragged.ueId,
    dragged.periodeId
  )
  resetDragState()
  refMaj.value += 1
  await nextTick()
}

const onDrop = async (event, targetItem) => {
  if (!draggedItem.value || !isCompatibleTarget(targetItem)) {
    resetDragState()
    return
  }
  const dragged = draggedItem.value

  // Interversion de l'ordre d'affichage : valable pour tous les types
  // d'EC (enseignement, AMS, Portfolio, Stage, SAE), importés ou non.
  // Chaque côté met à jour son propre support de render_order.
  const draggedOrder = dragged.render_order
  const targetOrder = targetItem.render_order

  await setRenderOrderOfItem(dragged, targetOrder)
  await setRenderOrderOfItem(targetItem, draggedOrder)

  resetDragState()
  refMaj.value += 1
  await nextTick()
}

// Met à jour l'ordre d'affichage d'un item, quel que soit son type
const setRenderOrderOfItem = async (item, newOrder) => {
  // Élément mutualisé : l'ordre est porté par l'enregistrement d'import,
  // pas par l'EC source (qui appartient à une autre maquette)
  if (item.tag === 'importé') {
    await elementsConstitutifsStore.changeRenderOrderOfImported(item.id_element_imported, newOrder)
    return
  }

  // Enseignement : on conserve le mécanisme existant
  if (item.type === 'enseignement') {
    await enseignementsStore.changeRenderOrder(item.id, newOrder)
    return
  }

  // AMS, Portfolio, Stage, SAE : mise à jour directe de l'EC
  const ec = elementsConstitutifsStore.ecs.find((e) => e.id === item.ecId)
  if (ec) {
    await elementsConstitutifsStore.updateEC({ ...ec, render_order: newOrder })
  }
}

const isCompetenceIsCurrentForThis = async (competenceId, enseignementId) => {
  const result = await enseignementsStore.fetchEnseignementFullToCompetenceById(enseignementId)
  if (!result.apprentissages_critiques || result.apprentissages_critiques.length === 0) return false

  const resultNiveauxCompetences = result.apprentissages_critiques
    .map((ac) => ac.niveau?.competence_id)
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

<!-- Style global : le ghost est attaché à <body>, hors de la portée du scoped -->
<style>
.tree-drag-ghost {
  position: fixed;
  top: -1000px;
  left: -1000px;
  z-index: 9999;
  pointer-events: none;

  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  padding: 8px 16px 8px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);

  background: #1e293b;
  color: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;

  box-shadow:
    0 8px 20px rgba(15, 23, 42, 0.35),
    0 2px 6px rgba(15, 23, 42, 0.25);
}

.tree-drag-ghost::before {
  content: '⠿';
  font-size: 14px;
  opacity: 0.55;
}
</style>

<style scoped>
/* ---------- Base des items ---------- */
.tree-item {
  position: relative;
  padding: 4px 10px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease,
    transform 0.18s ease;
}

.item-block {
  padding: 6px 10px;
  user-select: none;
}

/* ---------- Ligne EC : poignée + contenu ---------- */
.ec-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ec-content {
  flex: 1 1 auto;
  min-width: 0;
}

/* ---------- Poignée de drag (bouton 4 flèches) ---------- */
/* Seule la poignée est draggable : plus de drags accidentels
   quand on clique sur un libellé ou un bouton d'édition */
.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  color: #94a3b8;
  cursor: grab;
  opacity: 0.45;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.tree-item:hover .drag-handle {
  opacity: 1;
}

.drag-handle:hover {
  background: rgba(148, 163, 184, 0.18);
  color: #475569;
}

.drag-handle:active {
  cursor: grabbing;
}

/* ---------- Élément en cours de drag : effet "fantôme" ---------- */
/* L'original reste à sa place, estompé, pour qu'on visualise d'où il part */
.dragging {
  opacity: 0.35;
  filter: grayscale(0.6);
  border: 1.5px dashed #94a3b8;
  border-radius: 10px;
  background: #f8fafc;
  box-shadow: none;
  transform: scale(0.99);
}

/* ---------- Cibles de drop valides (drag en cours) ---------- */
/* Indication très discrète : on évite l'effet "sapin de Noël" */
.drop-target:not(.dragging) {
  outline: 1.5px dashed rgba(148, 163, 184, 0.35);
  outline-offset: -1.5px;
  border-radius: 10px;
}

/* ---------- Cible survolée : feedback fort et net ---------- */
.drag-over:not(.dragging) {
  outline: none;
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.12), rgba(6, 182, 212, 0.04));
  border-left: 3px solid #06b6d4;
  box-shadow:
    0 0 0 1.5px rgba(6, 182, 212, 0.45),
    0 4px 14px rgba(6, 182, 212, 0.18);
  transform: translateX(2px);
  animation: dropPulse 1.2s ease-in-out infinite;
}

@keyframes dropPulse {
  0%,
  100% {
    box-shadow:
      0 0 0 1.5px rgba(6, 182, 212, 0.45),
      0 4px 14px rgba(6, 182, 212, 0.18);
  }
  50% {
    box-shadow:
      0 0 0 1.5px rgba(6, 182, 212, 0.7),
      0 4px 18px rgba(6, 182, 212, 0.3);
  }
}

/* Périodes : cible de "sortie d'UE", on la signale un peu plus */
.periode-item.drop-target:not(.drag-over) {
  background: rgba(148, 163, 184, 0.06);
}

/* Accessibilité : pas d'animation si l'utilisateur la refuse */
@media (prefers-reduced-motion: reduce) {
  .tree-item {
    transition: none;
  }
  .drag-over:not(.dragging) {
    animation: none;
    transform: none;
  }
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
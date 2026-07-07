<template>
  <v-row no-gutters class="align-end">
    <v-col>
      <div class="headers-zone">
        <div class="headers-strip">
          <div
            v-for="ens in enseignementsP1List"
            :key="'header-p1-' + ens.id"
            class="header-cell"
          >
            <span class="header-tilt">{{ ens.libelle }}</span>
          </div>
        </div>
        <div v-if="enseignementsP2List.length" class="headers-strip">
          <div
            v-for="ens in enseignementsP2List"
            :key="'header-p2-' + ens.id"
            class="header-cell"
          >
            <span class="header-tilt">{{ ens.libelle }}</span>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>

  <v-container fluid style="padding-top: 0px">
    <div class="tree-scroll">
      <v-treeview
        v-if="treesList.length > 0"
        :hide-actions="!actionIcons"
        :indent-lines="indentLines"
        :items="treesList"
        :separate-roots="separateRoots"
        density="compact"
        item-value="id"
        selected-color="transparent"
        :hoverable="false"
        :item-disabled="isLeafDisabled"
        open-on-click
        v-model:opened="opened"

      >
        <template v-if="prependIcons" v-slot:prepend="{ item, isOpen }">
          <v-progress-circular
            color="primary"
            indeterminate
            v-if="item.idCompetence !== undefined && isLoading"
          ></v-progress-circular>

          <v-icon :icon="item.icon"></v-icon>
        </template>

        <template v-slot:title="{ item }">
          <div
            class="tree-row"
            :style="item.color ? { backgroundColor: item.color, color: 'white' } : {}"
          >
            <div class="tree-title">
              <template v-if="!item.children && item.title.length > 16">
                <span v-for="(line, idx) in item.title.match(/.{1,28}/g)" :key="idx">
                  {{ line }}<br />
                </span>
              </template>
              <template v-else>{{ item.title }}</template>
            </div>

            <div v-if="!item.children" class="cells-zone">
              <div class="cells-strip">
                <div
                  v-for="ens in enseignementsP1List"
                  :key="`${item.idAc}-${ens.id}`"
                  class="radio-cell"
                >
                  <v-progress-circular
                    v-if="isLoadingRadioButton(item.idAc, ens.id)"
                    indeterminate
                    size="16"
                    width="2"
                  />
                  <v-radio
                    v-else
                    :model-value="getRadioValue(item.idAc, ens.id)"
                    :value="item.idAc"
                    density="compact"
                    hide-details
                    @click="onRadioClick(item.idAc, ens.id)"
                  />
                </div>
              </div>
              <div v-if="enseignementsP2List.length" class="cells-strip">
                <div
                  v-for="ens in enseignementsP2List"
                  :key="`${item.idAc}-p2-${ens.id}`"
                  class="radio-cell"
                >
                  <v-progress-circular
                    v-if="isLoadingRadioButton(item.idAc, ens.id)"
                    indeterminate
                    size="16"
                    width="2"
                  />
                  <v-radio
                    v-else
                    :model-value="getRadioValue(item.idAc, ens.id)"
                    :value="item.idAc"
                    density="compact"
                    hide-details
                    @click="onRadioClick(item.idAc, ens.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-treeview>
    </div>
  </v-container>
</template>

<script setup>
import {
  computed,
  defineProps,
  ref,
  shallowRef,
  watch,
  defineEmits,
  nextTick
} from 'vue'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useApprentissageStore } from '@/stores/apprentissageStore'
import { usePeriodeStore } from '@/stores/periodeStore'

const props = defineProps({
  niveauxSelected: Array,
  competencesSelected: Array,
  periodes: Array,
  keyForRefresh: Number,
  refreshComponent: Boolean,
  refreshTreeView: Function
})

const competenceStore = useCompetenceStore()
const enseignementsStore = useEnseignementStore()
const niveauxAppStore = useApprentissageStore()
const periodesStore = usePeriodeStore()

competenceStore.fetchCompetences()

const competencesList = ref([])
const niveauxList = ref([])
const enseignementsP1List = ref([])
const enseignementsP2List = ref([])

const emit = defineEmits(['refreshTreeView'])

const enseignmentsLinkedList = computed(() => {
  return enseignementsStore.enseignements.filter(
    (e) =>
      enseignementsP1List.value.some((p1) => p1.id === e.id) ||
      enseignementsP2List.value.some((p2) => p2.id === e.id)
  )
})

const refMaj = ref(0)

const treeKey = computed(() => {
  // Changer ici les objets d'écoute pour refresh le treeview
  return JSON.stringify({
    enseignementsStoreCount: enseignmentsLinkedList.value.length,
    competencesCount: competencesList.value.length,
    enseignementsLinkedList: enseignmentsLinkedList.value.map((e) => e.libelle),
    competencesLibelles: competencesList.value.map((c) => c.libelle),
    refMaj: refMaj.value
  })
})

const treesList = ref([])

const separateRoots = shallowRef(false)
const actionIcons = shallowRef(true)
const prependIcons = shallowRef(true)
const indentLines = shallowRef(true)

const ensAcIsChecked = ref([])
const isLoading = ref(false)

const opened = ref([])

const isLeafDisabled = (item) => {
  return item.children
}

const initData = async () => {
  isLoading.value = true
  competencesList.value = competenceStore.competences.filter((c) =>
    props.competencesSelected.some((selectedId) => selectedId === c.id)
  )

  let niveauWithName = []
  competencesList.value[0]?.niveau.forEach((n) => {
    niveauWithName.push(n)
  })
  niveauWithName.filter((n) => props.niveauxSelected.some((selectedId) => selectedId === n.id))

  competenceStore.competences
    .filter((c) => props.competencesSelected.includes(c.id))
    .forEach((competence) => {
      let tree = {
        id: 'comp-' + competence.id,
        idCompetence: competence.id,
        title: competence.competence_contextualisee || competence.libelle,
        color: competence.color_hexadecimal,
        icon: 'mdi-bullseye',
        children: []
      }
      competence.niveau = competence.niveau.filter((niveau) =>
        niveauWithName.some((n) => n.libelle === niveau.libelle)
      )
      // Trier les niveaux par id croissant
      competence.niveau
        .sort((a, b) => a.id - b.id)
        .forEach((niveau) => {
          let children = {
            id: 'niveau-' + niveau.id,
            idNiveau: niveau.id,
            title: niveau.libelle,
            icon: 'mdi-chart-line-variant',
            children: []
          }
          let apps = []
          niveau.apprentissage_critique.forEach((ac) => {
            apps.push({
              id: 'ac-' + ac.id,
              idAc: ac.id,
              title: ac.libelle,
              icon: 'mdi-book-open-variant-outline'
            })
          })
          if (apps.length > 0) {
            children.children.push(...apps)
          }
          tree.children.push(children)
        })

      if (!treesList.value.some((t) => t.id === tree.id)) {
        treesList.value.push(tree)
      }
    })
  treesList.value.sort((a, b) => a.title.localeCompare(b.title))

  enseignementsP1List.value = await enseignementsStore.fetchEnseignementsOfVersion(
    props.periodes[0]
  )
  if (props.periodes.length > 1) {
    enseignementsP2List.value = await enseignementsStore.fetchEnseignementsOfVersion(
      props.periodes[1]
    )
  } else {
    enseignementsP2List.value = []
  }
  initIsSelected()
  await nextTick()
  syncOpened()
  isLoading.value = false
}

const syncOpened = () => {
  const newIds = []

  const collectIds = (nodes) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length) {
        newIds.push(node.id)
        collectIds(node.children)
      }
    })
  }

  collectIds(treesList.value)

  newIds.forEach((id) => {
    if (!opened.value.includes(id)) {
      opened.value.push(id)
    }
  })
}

const getRadioValue = (acid, ensid) => {
  return isChecked(acid, ensid) ? acid : null
}

const loadingRadios = ref([])

const isLoadingRadioButton = (idAc, ensId) => {
  return loadingRadios.value.some((r) => r.idAc === idAc && r.ensId === ensId)
}

const onRadioClick = async (acid, ensid) => {
  loadingRadios.value.push({ idAc: acid, ensId: ensid })

  const alreadySelected = isChecked(acid, ensid)

  try {
    if (alreadySelected) {
      // Décocher
      await enseignementsStore.disconnectEnseignementToApprentissageCritique(ensid, acid)
      updateLocalState(ensid, acid, false)
    } else {
      // Cocher
      await enseignementsStore.connectEnseignementToApprentissageCritique(ensid, acid)
      updateLocalState(ensid, acid, true)
    }
  } catch (err) {
    console.error(alreadySelected ? 'Erreur décochage:' : 'Erreur cochage:', err)
  } finally {
    // Retirer l'item du tableau loadingRadios après l'opération
    loadingRadios.value = loadingRadios.value.filter(
      (r) => !(r.idAc === acid && r.ensId === ensid)
    )
  }
}

const updateLocalState = (ensid, acid, checked) => {
  // Cherche dans P1, sinon dans P2
  let ens = enseignementsP1List.value.find((e) => e.id === ensid)
  if (!ens) {
    ens = enseignementsP2List.value.find((e) => e.id === ensid)
  }
  if (!ens) return

  if (!Array.isArray(ens.apprentissages_critiques)) ens.apprentissages_critiques = []

  if (checked) {
    // Ajouter si pas déjà présent
    if (
      !ens.apprentissages_critiques.some((ac) =>
        typeof ac === 'object' ? ac.id === acid : ac === acid
      )
    ) {
      ens.apprentissages_critiques.push({ id: acid })
    }
  } else {
    // Retirer
    ens.apprentissages_critiques = ens.apprentissages_critiques.filter((ac) =>
      typeof ac === 'object' ? ac.id !== acid : ac !== acid
    )
  }

  // Mise à jour de la variable de tracking locale
  if (checked) {
    if (!ensAcIsChecked.value.some((sel) => sel.acid === acid && sel.ensid === ensid)) {
      ensAcIsChecked.value.push({ acid, ensid })
    }
  } else {
    const index = ensAcIsChecked.value.findIndex(
      (sel) => sel.acid === acid && sel.ensid === ensid
    )
    if (index !== -1) {
      ensAcIsChecked.value.splice(index, 1)
    }
  }
}

const isChecked = (acid, ensid) => {
  return ensAcIsChecked.value.some((sel) => sel.acid === acid && sel.ensid === ensid)
}

const initIsSelected = () => {
  ensAcIsChecked.value = []

  enseignementsP1List.value.forEach((ens) => {
    ;(ens.apprentissages_critiques || []).forEach((ac) => {
      if (ac && typeof ac.id === 'number') {
        ensAcIsChecked.value.push({ acid: ac.id, ensid: ens.id })
      }
    })
  })

  if (props.periodes.length > 1) {
    enseignementsP2List.value.forEach((ens) => {
      ;(ens.apprentissages_critiques || []).forEach((ac) => {
        if (ac && typeof ac.id === 'number') {
          ensAcIsChecked.value.push({ acid: ac.id, ensid: ens.id })
        }
      })
    })
  }
}

watch(
  () => props.keyForRefresh,
  async () => {
    await nextTick()

    treesList.value = []
    competencesList.value = []
    niveauxList.value = []

    await initData()
  }
)

watch(
  () =>
    periodesStore.periodes
      .filter((p) => props.periodes.includes(p.id))
      .map((p) => p.enseignements),
  async () => {
    await nextTick()

    treesList.value = []
    competencesList.value = []
    niveauxList.value = []

    await initData()
  },
  { deep: true }
)
</script>

<style scoped>
.headers-zone,
.cells-zone {
  --cell-width: 33px;
  --strip-gap: 40px; /* écart entre le bloc P1 et le bloc P2 */

  display: flex;
  justify-content: flex-start;
  gap: var(--strip-gap);
}

/* Les headers doivent compenser : indentation du tree (feuille niveau 3)
   + icône prepend + largeur de la colonne titre.
   C'est LA valeur à ajuster une fois pour caler l'alignement. */
.headers-zone {
  --left-offset: 400px;
  padding-left: var(--left-offset);
}

/* Les radios démarrent juste après la colonne titre, avec une petite marge */
.cells-zone {
  margin-left: 12px;
}

/* Conteneur scrollable : gutter stable pour que l'apparition
   de la scrollbar ne décale pas le contenu par rapport aux headers */
.tree-scroll {
  height: 600px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

/* Ligne d'un item du tree */
.tree-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
}

.tree-title {
  flex: 0 0 220px;
  font-size: 13px;
  line-height: 1.2;
}

/* Bandes de cellules (headers et radios) */
.headers-strip,
.cells-strip {
  display: flex;
  align-items: flex-end;
}

.header-cell,
.radio-cell {
  width: 33px;
  min-width: 33px;
  max-width: 33px;
}

.header-cell {
  position: relative;
  height: 160px;
}

.radio-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Neutralise les marges internes de v-radio pour un centrage exact */
.radio-cell :deep(.v-selection-control) {
  justify-content: center;
  min-height: unset;
}

.radio-cell :deep(.v-selection-control__wrapper) {
  margin: 0;
}

/* Titres inclinés à 45° */
.header-tilt {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: rotate(-45deg);
  transform-origin: bottom left;
  white-space: nowrap;
  line-height: 1;
  font-size: 12px;
}
</style>
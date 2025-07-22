<template>
  <v-row style="margin-top: 100px;">
    <v-col cols="2"></v-col>
    <v-col cols="4" class="d-flex flex-row" style="padding-left:140px;">
      <div
        v-for="ens in enseignementsP1List"
        :key="'header-p1-' + ens.id"
        style="transform: rotate(-45deg); font-size: 12px; margin-right: 16px; white-space: nowrap;"
      >
        {{ ens.libelle }}
      </div>
    </v-col>
    <v-col cols="4" class="d-flex flex-row" style="padding-left:80px;">
      <div
        v-for="ens in enseignementsP2List"
        :key="'header-p2-' + ens.id"
        style="transform: rotate(-45deg); font-size: 12px; margin-right: 16px; white-space: nowrap;"
      >
        {{ ens.libelle }}
      </div>
    </v-col>
  </v-row>
  <v-container fluid>
    <v-treeview
      v-if="treesList.length > 0"
      :hide-actions="!actionIcons"
      :indent-lines="indentLines"
      :items="treesList"
      :separate-roots="separateRoots"
      density="compact"
      item-value="id"
      :item-disabled="isLeafDisabled"
      open-all
      open-on-click
    >
      <template v-if="prependIcons" v-slot:prepend="{ item, isOpen }">
        <v-icon :icon="item.icon"></v-icon>
      </template>
      <template v-slot:title="{ item }">
        <v-row>
            <v-col
            cols="2"
            :style="!item.children ? 'padding-top: 36px;' : ''"
            >
            <span v-if="item.title.length <= 30">{{ item.title }}</span>
            <span v-else>
              <span v-for="(line, idx) in item.title.match(/.{1,30}/g)" :key="idx">
                {{ line }}<br>
              </span>
            </span>
            </v-col>
          <v-col cols="4">
            <v-radio-group style="display: inline-block; vertical-align: middle; padding-top: 20px;" v-if="!item.children" v-for="ens in enseignementsP1List" :key="'item.id' + '-' + ens.id">
              <v-radio
                :model-value="ens.apprentissage_critique_id"
                @change="handleCheck(ens.apprentissage_critique_id, ens.id)"
                density="compact"
                hide-details
              ></v-radio>

            </v-radio-group>
          </v-col>
          <v-col cols="4">
            <v-radio-group style="display: inline-block; vertical-align: middle; padding-top: 20px;" v-if="!item.children" v-for="ens in enseignementsP2List" :key="'item.id' + '-' + ens.id">
              <v-radio
                :model-value="ens.apprentissage_critique_id"
                @change="handleCheck(ens.apprentissage_critique_id, ens.id)"
                density="compact"
                hide-details
              ></v-radio>

            </v-radio-group>
          </v-col>

        </v-row>
      </template>
    </v-treeview>
  </v-container>
</template>

<script setup>
import { computed, defineProps, ref, watch, shallowRef, nextTick } from 'vue'
import { useCompetenceStore } from '@/stores/competenceStore'
import { useEnseignementStore } from '@/stores/enseignementStore'
import { useApprentissageStore } from '@/stores/apprentissageStore'
import { usePeriodeStore } from '@/stores/periodeStore'

const props = defineProps({
  niveauxSelected: Array,
  competencesSelected: Array,
  periodes: Array,
  keyForRefresh: Number,
  refreshComponent: Boolean
})

const competenceStore = useCompetenceStore()
const enseignementsStore = useEnseignementStore()
const niveauxAppStore = useApprentissageStore()
const periodesStore = usePeriodeStore()

const competencesList = ref([])
const niveauxList = ref([])
const enseignementsP1List = ref([])
const enseignementsP2List = ref([])

const treesList = ref([])

const inline = ref(true)
const separateRoots = shallowRef(false)
const actionIcons = shallowRef(true)
const prependIcons = shallowRef(true)
const indentLines = shallowRef(true)

const isLeafDisabled = (item) => {
  return item.children;
}

const initData = async () => {
  for (const competenceId of props.competencesSelected) {
    const data = await competenceStore.fetchOneCompetence(competenceId)
    if (!competencesList.value.some((c) => c.id === data.id)) {
      competencesList.value.push(data)
    }
  }
  console.log(competencesList.value)
  let niveauWithName = []
  for (const niveauId of props.niveauxSelected) {
    const data = await niveauxAppStore.fetchNiveauById(niveauId)
    niveauWithName.push(data)
  }

  console.log(competencesList.value[0])
  competencesList.value.forEach((competence) => {
    let tree = {
      id: competence.id,
      title: competence.libelle,
      icon: 'mdi-bullseye',
      children: []
    }
    console.log(niveauWithName)
    competence.niveau = competence.niveau.filter((niveau) =>
      niveauWithName.some((n) => n.libelle === niveau.libelle)
    )
    console.log(competence)
    competence.niveau.sort((a, b) => a.libelle.localeCompare(b.libelle))
    competence.niveau.forEach((niveau) => {
      let children = {
        id: niveau.id,
        title: niveau.libelle,
        icon: 'mdi-chart-line-variant',
        children: []
      }
      let apps = []
      niveau.apprentissage_critique.forEach((ac) => {
        apps.push({
          id: ac.id,
          title: ac.libelle,
          icon: 'mdi-school-outline'
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
  enseignementsP1List.value = await enseignementsStore.fetchEnseignementsOfVersion(
    props.periodes[0]
  )
  enseignementsP2List.value = await enseignementsStore.fetchEnseignementsOfVersion(
    props.periodes[1]
  )
}

const handleCheck = async (ac, ens) => {
  await enseignementsStore.connectEnseignementToApprentissageCritique(ens, ac)
  fetchEnseignementsOfTwoPeriodes()
}

watch(
  () => props.keyForRefresh,
  async (newVal) => {
    await nextTick() // ← 🔁 Attendre la mise à jour des props
    console.log('[REFRESH] compétences sélectionnées:', props.competencesSelected)
    console.log('[REFRESH] niveaux sélectionnés:', props.niveauxSelected)

    treesList.value = []
    competencesList.value = []
    niveauxList.value = []

    await initData()
  }
)
</script>

<style scoped>
</style>

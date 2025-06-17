<template>
  <SimpleDatatable
    :items="etablissementStore.etablissements"
    :headers="headers"
    :selectList="{ parametre: parametreStore.parametres }"
    :loading="etablissementStore.loading"
    @createItemEvent="createEtablissement"
    @updateItemEvent="updateEtablissement"
    @deleteItemEvent="etablissementStore.deleteEtablissement"
    @refreshEvent="init"
  />
</template>

<script setup>
import SimpleDatatable from '@/components/SimpleDatatable.vue'
import { useEtablissementStore } from '@/stores/etablissementStore'
import { useParametreStore } from '@/stores/parametreStore'
import { ref } from 'vue'

const etablissementStore = useEtablissementStore()
const parametreStore = useParametreStore()

const headers = [
  { title: 'Nom', key: 'libelle' },
  { title: 'Parametre', key: 'parametre', type: 'select', select: { title: 'libelle', key: 'id' } },
  { title: 'Actions', key: 'actions' }
]

const init = async () => {
  await etablissementStore.fetchEtablissements()
  await parametreStore.fetchParametres()
}
init()

const createEtablissement = async (newEtablissement) => {
  let etabToAdd = {
    libelle: newEtablissement.libelle,
    parametre: newEtablissement.parametre
  }
  await etablissementStore.createEtablissement(etabToAdd).then(async (result) => {
    console.log(result)
    let etabToUpdate = {
      id: result.id,
      libelle: result.libelle,
      parametre: result.parametre_id
    }
    await updateEtablissement(etabToUpdate)
  })
  init();
}

const updateEtablissement = async (etablissement) => {
  console.log(etablissement)
  let etabToUpdate = {
    id: etablissement.id,
    libelle: etablissement.libelle,
    parametre: { connect: { id: etablissement.parametre } }
  }
  await etablissementStore.updateEtablissement(etabToUpdate)
  etablissementStore.fetchEtablissements()
  init();
}
</script>

<style scoped>
</style>
<template>
  <v-row>
    <v-col>
      <v-select
        label="Etablissement"
        :items="etablissementStore.etablissements"
        item-title="libelle"
        item-value="id"
        v-model="selectedEtablissement"
      >
      </v-select>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <SimpleDatatable
        :headers="headers"
        :items="
          composanteStore
            .getComposantesByEtablissement(
              etablissementStore.etablissements.find((e) => e.id === selectedEtablissement)
            )
            ?.sort((a, b) => a.libelle.localeCompare(b.libelle))
        "
        :selectList="{ parametre: parametreStore.parametres }"
        :loading="composanteStore.loading"
        @createItemEvent="createComposante"
        @deleteItemEvent="composanteStore.deleteComposante"
        @updateItemEvent="updateComposante"
        @refreshEvent="init"
      />
    </v-col>
  </v-row>
  <SnackBar :loading="composanteStore.loading" :error="composanteStore.error" />
</template>

<script lang="js" setup>
import { ref, watch } from 'vue'
import SnackBar from '@/components/SnackBarError.vue'
import SimpleDatatable from '@/components/SimpleDatatable.vue'
import { useComposanteStore } from '@/stores/composanteStore'
import { useParametreStore } from '@/stores/parametreStore'
import { useEtablissementStore } from '@/stores/etablissementStore'

const composanteStore = useComposanteStore()
const etablissementStore = useEtablissementStore()
const parametreStore = useParametreStore()

const selectedEtablissement = ref(0)

const init = async () => {
  await etablissementStore.fetchEtablissements()
  await parametreStore.fetchParametres()
  selectedEtablissement.value = etablissementStore.etablissements[0].id
  await composanteStore.fetchComposanteByEtablissement(selectedEtablissement.value)
}
init()

const entity = 'Composante'
const headers = [
  { title: 'Nom', key: 'libelle' },
  { title: 'Parametre', key: 'parametre', type: 'select', select: { title: 'libelle', key: 'id' } },
  { title: 'Actions', key: 'actions', width: '150px' }
]

const createComposante = async (composante) => {
  composante.etablissement_id = selectedEtablissement.value
  await composanteStore.createComposante(composante).then(async (result) => {
    console.log(result)
    let composanteToUpdate = {
      id: result.id,
      libelle: result.libelle,
      parametre: result.parametre_id
    }
    await updateComposante(composanteToUpdate)
  })
}

const updateComposante = async (composante) => {
  console.log(composante)
  let composanteToUpdate = {
      id: composante.id, 
      libelle: composante.libelle,
      parametre: { 
        connect: { 
          id: composante.parametre
        }
      }
    }

  await composanteStore.updateComposante(composanteToUpdate)
  init();
}

watch(selectedEtablissement, (newValue) => {
  composanteStore.fetchComposanteByEtablissement(newValue)
})
</script>

<template>
    <SimpleDatatable
       :items="typeDiplomeStore.typeDiplomes"
       :headers="headers"
       :loading="typeDiplomeStore.loading"
       @createItemEvent="typeDiplomeStore.createTypeDiplome"
       @updateItemEvent="typeDiplomeStore.updateTypeDiplome"
       @deleteItemEvent="typeDiplomeStore.deleteTypeDiplome"
       @refreshEvent="init"
    />
</template>

<script setup>
import SimpleDatatable from '@/components/SimpleDatatable.vue';
import { useTypeDiplomeStore } from '@/stores/typeDiplomeStore';
import { ref } from 'vue'

const typeDiplomeStore = useTypeDiplomeStore()

const headers = [
   { title: 'Nom', key: 'libelle', width: '40%', type: 'text' },
   { title: 'Heures', key: 'heures', width: '20%', type: 'number' },
   { title: 'Crédits', key: 'credits', width: '20%', type: 'number' },
    { title: 'Actions', key: 'actions', width: '20%' }
]

const init = async () => {
   await typeDiplomeStore.fetchTypeDiplomes()
}
init()

</script>

<style scoped>
</style>
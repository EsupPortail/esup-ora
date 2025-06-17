<template>
    <SimpleDatatable
       :items="tagStore.tags"
       :headers="headers"
       :loading="tagStore.loading"
       @createItemEvent="tagStore.createTag"
       @updateItemEvent="tagStore.updateTag"
       @deleteItemEvent="tagStore.deleteTag"
       @refreshEvent="init"
    />
</template>

<script setup>
import SimpleDatatable from '@/components/SimpleDatatable.vue';
import { useTagStore } from '@/stores/tagStore';
import { ref } from 'vue'

const tagStore = useTagStore();

const headers = [
   { title: 'Nom', key: 'libelle' },
    { title: 'Actions', key: 'actions' }
]

const init = async () => {
   await tagStore.fetchAllTags();
}
init()

</script>

<style scoped>
</style>
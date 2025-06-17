<template>
    <v-row>
        <v-col>


        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue'

const newCompetence = ref({
    libelle: '',
})
const props = defineProps({
    competences: Array,
})

</script>

<style scoped>
</style>
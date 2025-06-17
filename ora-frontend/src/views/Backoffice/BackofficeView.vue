<template>
    <v-row justify-center align-center d-flex dense >
        <v-col>
            <v-tabs
            bg-color="deep-purple-darken-4"
            v-model="tab"
            align-tabs="title"
            center-active
            >
                <v-tab to="/backoffice/etablissement">Etablissements</v-tab>
                <v-tab to="/backoffice/composante">Composantes</v-tab>
                <v-tab to="/backoffice/parametre">Parametres</v-tab>
                <v-tab to="/backoffice/tags">Tags</v-tab>
                <v-tab to="/backoffice/type_diplomes">Types de diplomes</v-tab>
                <v-tab to="/backoffice/conf_cout_td">Coût équivalent TD</v-tab>
            </v-tabs>
            <router-view></router-view>
        </v-col>
    </v-row>
</template>
<script setup>
import { onMounted, computed, ref, toRef } from 'vue'
import SnackBar from '@/components/SnackBarError.vue'
import { useEtablissementStore } from '@/stores/etablissementStore'
import ComposanteView from './ComposanteView.vue'
import ParametreView from './ParametreView.vue'

const etablissementStore = useEtablissementStore()

const tab = ref(0)

etablissementStore.fetchEtablissements()

const etablissementItem = ref({
        store: etablissementStore,
        entity: 'Etablissement',
        headers: [
            { title: 'Nom', key: 'libelle'},
            { title: 'Actions', key: 'actions', align: 'right', width: '150px'}
        ],
        entities: []
    })

const items = [
    etablissementItem,
    {
        store: etablissementStore,
        entity: 'Composante',
        headers: [
            { title: 'Yoh', key: 'yoh'}
        ],
        entities: []
    },
    {
        store: etablissementStore,
        entity: 'Parametre',
        headers: [
            { title: 'Hey', key: 'hey'}
        ],
        entities: []
    }
]

</script>

<style scoped>



</style>
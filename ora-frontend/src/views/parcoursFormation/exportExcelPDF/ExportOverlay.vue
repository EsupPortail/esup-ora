<template>
    <v-overlay v-model="overlay">
        <div
            style="
                width: 60vw;
                margin-left: 20vw;
                margin-right: 20vw;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
            "
        >
            <v-card class="pa-4" style="width: 100%; padding-top: 0px !important; padding-left: 0px !important; padding-right: 0px !important;" rounded="xl">

                <v-card-title class="d-flex justify-space-between align-center" style="padding-left: 40px; padding-right: 20px; background-color: #14275C; color: #fff; text-align: center;">
                    Exporter les données de la page&nbsp;
                    <span v-if="pageAsked === 'AC'">
                        Apprentissages critiques
                    </span>
                    <span v-else>
                        {{ pageAsked }}
                    </span>&nbsp;au format {{ typeExport }}
                    <v-btn
                        icon
                        color="red"
                        class="ml-auto"
                        style="background-color: red; color: white; border-radius: 50%;"
                        @click="$emit('update:overlayShow', false)"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text style="padding: 40px; padding-top: 20px; padding-bottom: 20px;">
                    <CompetenceOverlayExcel v-if="typeExport === 'excel' && pageAsked === 'Competences'" />
                    <CompetenceOverlayPDF v-else-if="typeExport === 'pdf' && pageAsked === 'Competences'" />
                    <ACOverlayExcel v-else-if="typeExport === 'excel' && pageAsked === 'AC'" />
                    <ACOverlayPDF v-else-if="typeExport === 'pdf' && pageAsked === 'AC'" />
                    <ECOverlayExcel v-else-if="typeExport === 'excel' && pageAsked === 'EC'" />
                    <ECOverlayPDF v-else-if="typeExport === 'pdf' && pageAsked === 'EC'" />
                    <MaquetteOverlayExcel v-else-if="typeExport === 'excel' && pageAsked === 'Maquette'" />
                    <MaquetteOverlayPDF v-else-if="typeExport === 'pdf' && pageAsked === 'Maquette'" />
                    <FormationOverlayExcel v-else-if="typeExport === 'excel' && pageAsked === 'Formation'" />
                    <FormationOverlayPDF v-else-if="typeExport === 'pdf' && pageAsked === 'Formation'" />
                </v-card-text>
            </v-card>
        </div>
    </v-overlay>
</template>


<script setup>
import { ref, watch } from 'vue'

import CompetenceOverlayExcel from './overlays/competence/CompetenceOverlayExcel.vue'
import CompetenceOverlayPDF from './overlays/competence/CompetenceOverlayPDF.vue'
import ACOverlayExcel from './overlays/apprentissages_critiques/ACOverlayExcel.vue'
import ACOverlayPDF from './overlays/apprentissages_critiques/ACOverlayPDF.vue'
import ECOverlayExcel from './overlays/elements_constitutifs/ECOverlayExcel.vue'
import ECOverlayPDF from './overlays/elements_constitutifs/ECOverlayPDF.vue'
import MaquetteOverlayExcel from './overlays/maquette/MaquetteOverlayExcel.vue'
import MaquetteOverlayPDF from './overlays/maquette/MaquetteOverlayPDF.vue'

const props = defineProps({
    overlayShow: {
        type: Boolean,
        required: true
    },
    typeExport: {
        type: String,
        required: false,
        default: 'excel'
    },
    pageAsked: {
        type: String,
        required: false,
        default: 'undefined'
    }
})

const emit = defineEmits(['update:overlayShow'])
const overlay = ref(false)

watch(
    () => props.overlayShow,
    (val) => {
        overlay.value = val
    },
    { immediate: true }
)



</script>
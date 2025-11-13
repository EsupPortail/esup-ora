<template>
    <v-btn color="#000000">
        <v-icon left>mdi-export</v-icon>
        Exporter
        <v-menu activator="parent">
            <v-list>
                <v-list-item @click="handleExport('excel')">
                    <v-list-item-title>Excel</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleExport('pdf')">
                    <v-list-item-title>PDF</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
    <ExportOverlay v-model:overlayShow="overlayShow" @update:overlayShow="overlayShow = $event" :pageAsked="pageAsked" :typeExport="typeExport" />
</template>

<script setup>
import { ref } from 'vue';
import ExportOverlay from './ExportOverlay.vue';

const props = defineProps({
    pageAsked: {
        type: String,
        required: false,
        default: 'undefined'
    }
})

const pageAsked = ref(props.pageAsked);
const typeExport = ref('excel');
const overlayShow = ref(false);

const handleExport = (type) => {
    typeExport.value = type;
    overlayShow.value = true;
}
</script>
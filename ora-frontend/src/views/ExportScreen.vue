<template>
    <v-row>
      <ArianeParcoursPath />
    </v-row>
    <v-container class="text-center my-5">
        <v-card class="pa-5" elevation="3">
            <v-card-title class="text-h5 font-weight-bold">
                Exporter votre offre de formation
            </v-card-title>
            <v-card-actions class="justify-center">
                <v-btn color="success" class="ma-2" @click="exportToExcel">
                    Exporter en Excel
                </v-btn>
                <v-btn color="primary" class="ma-2" @click="exportToPDF">
                    Exporter en PDF
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'
import axios from 'axios';
import { backendRoutes } from '@/environment/backendRoutes';
import {config} from '@/environment/environment';

const exportToPDF = async () => {
    try {
        const response = await axios.post(
            `${config.backend.url}${backendRoutes.exportPdf}`,
            {
                formationID: 'yourFormationID', // Replace with actual formation ID
                versionID: 'yourVersionID' // Replace with actual version ID
            },
            { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'formation.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting to PDF:', error);
    }
};

const exportToExcel = async () => {
    try {
        const response = await axios.post(
            `${config.backend.url}${backendRoutes.exportExcel}`,
            {
                formationID: 'yourFormationID', // Replace with actual formation ID
                versionID: 'yourVersionID' // Replace with actual version ID
            },
            { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'formation.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};

</script>

<style scoped>
.v-card {
    max-width: 500px;
    margin: auto;
}
</style>
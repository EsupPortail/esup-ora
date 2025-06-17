<template>
    <v-data-table
        :items="formattedRoles"
        :headers="headers"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Rôles</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </template>
        <template v-slot:item.displayName="{ item }">
            <span>{{ item.displayName }}</span>
        </template>
        <template v-slot:item.description="{ item }">
            <span>{{ item.description }}</span>
        </template>
    </v-data-table>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    roles: {
        type: Array,
        required: true,
        default: () => []
    }
})

const headers = ref([
    { title: 'Nom du rôle', key: 'displayName', align: 'start' },
    { title: 'Description', key: 'description', align: 'start' }
])

const formattedRoles = ref([])
watch(
    () => props.roles,
    (newRoles) => {
        formattedRoles.value = newRoles.map(role => ({
            displayName: role.displayName,
            description: role.description || 'N/A'
        }))
    },
    { immediate: true }
)
</script>

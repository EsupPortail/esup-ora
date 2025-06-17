<template>
    <v-data-table
        :items="formattedUsers"
        :headers="headers"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Utilisateurs</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </template>
        <template v-slot:item.fullName="{ item }">
            <span>{{ item.fullName }}</span>
        </template>
        <template v-slot:item.email="{ item }">
            <span>{{ item.email }}</span>
        </template>
        <template v-slot:item.fromShibboleth="{ item }">
            <span>{{ item.fromShibboleth ? 'Oui' : 'Non' }}</span>
        </template>
        <template v-slot:item.role="{ item }">
            <v-select
                :items="existantRoles"
                item-title="displayName"
                item-value="id"
                v-model="item.roleId"
                @update:model-value="(roleId) => giveRoleToUser(item.id, roleId)"
                variant="outlined"
                density="compact"
                hide-details
                :style="{ width: `${item.role.length + 5}ch` }"
            ></v-select>
        </template>
    </v-data-table>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

import { config } from '@/environment/environment'
import { useConnectionStore } from '@/stores/connectionStore'

const props = defineProps({
    users: Array,
    roles: Array,
})

const connectionStore = useConnectionStore()

// En-têtes du tableau
const headers = ref([
    { title: "Nom d'utilisateur", key: "username" },
    { title: "Nom usuel", key: "fullName" },
    { title: "Email", key: "email" },
    { title: "Depuis la fédération d'identité", key: "fromShibboleth" },
    { title: "Rôle", key: "role" },
])

// Liste des rôles disponibles
const existantRoles = ref(props.roles)

watch(
    () => props.roles,
    (newRoles) => {
        existantRoles.value = newRoles
    },
    { immediate: true }
)

// Utilisateurs formatés pour le tableau
const formattedUsers = computed(() =>
    props.users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        fromShibboleth: user.fromShibboleth,
        role: user.roles?.[0]?.displayName || "Aucun",
        roleId: user.roles?.[0]?.id || null,
    }))
)

// Fonction pour attribuer un rôle à un utilisateur
const giveRoleToUser = async (userId, roleId) => {
    try {
        await axios.post(
            `${config.backend.url}/admin/changeRole`,
            { userId, roleId },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${connectionStore.token.access_token}`,
                },
            }
        )
    } catch (error) {
    }
}
</script>

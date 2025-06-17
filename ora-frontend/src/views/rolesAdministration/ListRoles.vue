<template>
    <div>
        <h1>Liste des rôles</h1>
        <v-data-table :items="roles" :headers="headers">
            <template v-slot:item.name="{ item }">
                <span>{{ item.name }}</span>
            </template>
            <template v-slot:item.users="{ item }">
                <span>{{ countUsers(item.id) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn color="red" text @click="deleteRole(item.id)">Supprimer</v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script setup>
import { mockUpRoles } from './mockUpRoles.js';
import { mockUpUsers } from '../usersAdministration/mockUpUsers.js';

import {usePopUpStore} from '@/stores/popUp/PopUpStoreImplementation';

const popUpStore = usePopUpStore();
const roles = mockUpRoles.roles;
const users = mockUpUsers;

const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Nom', value: 'name' },
    { text: 'Utilisateurs', value: 'users' },
    { text: 'Actions', value: 'actions' },
];

function countUsers(roleId) {
    if (users) {
        return users.filter(user => user.role.id === roleId).length;
    }
    return 0;
}

function deleteRole(roleId) {
    const roleIndex = roles.findIndex(role => role.id === roleId);
    if (roleIndex !== -1) {
        roles.splice(roleIndex, 1);
    }
    popUpStore.print({
        isVisible: true,
        message: "Opération sur la ressource non autorisée. Accès à la ressource suppression d'un rôle",
        type: 'ERROR'
    });
}
</script>

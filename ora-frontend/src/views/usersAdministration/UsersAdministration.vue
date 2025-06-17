<template>
    <v-card title="Gestion des rôles des utilisateurs" flat>
        <v-data-table :headers="headers" :items="users" :items-per-page="50" class="text-center">
            <template v-slot:item.username="{ item }">
                <span>{{ item.username }}</span>
            </template>
            <template v-slot:item.role="{ item }">
                <v-select v-model="item.role.name" :items="roles.map(role => role.name)" multiple outlined></v-select>
            </template>
        </v-data-table>
    </v-card>
</template>

<script setup>
import {mockUpUsers} from './mockUpUsers.js';
import {mockUpRoles} from '../rolesAdministration/mockUpRoles.js';

const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Username', value: 'username' },
    { text: 'Name', value: 'name' },
    { text: 'Affectation de rôle', value: 'role' }
];
const users = mockUpUsers;
const roles = mockUpRoles.roles;
</script>
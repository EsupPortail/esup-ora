<template>
  <v-container class="pa-5">
    <v-card class="mx-auto" max-width="400">
      <v-card-title>
        <v-avatar color="primary" size="40" class="me-3">
          <v-icon icon="mdi-account-circle" />
        </v-avatar>
        Informations Utilisateur
      </v-card-title>

      <v-card-subtitle class="pb-4">Détails du profil</v-card-subtitle>

      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Nom</v-list-item-title>
              <v-list-item-subtitle>{{ user.lastName }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Prénom</v-list-item-title>
              <v-list-item-subtitle>{{ user.firstName }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Rôle applicatif</v-list-item-title>
              <v-list-item-subtitle>{{ user.role }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import {useAuthenticationStore} from '../stores/accessSecurity/AuthenticationStoreImplementation';

const store = useAuthenticationStore();

const user = ref({
  email: store.authenticationData.userInformations.email,
  firstName: store.authenticationData.userInformations.firstname,
  lastName: store.authenticationData.userInformations.lastname,
  role: store.authenticationData.userInformations.role
});

// Méthodes fictives pour illustrer des actions
const editUser = () => {
};

const deleteUser = () => {
};
</script>

<style scoped>
.v-card-title {
  align-items: center;
}
</style>

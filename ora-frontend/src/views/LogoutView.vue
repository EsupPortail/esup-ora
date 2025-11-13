<template>
  <v-container>
    <p>Déconnexion effectuée avec succès.</p>
    <p>
      Merci de votre visite
      <span>{{ previousUsername }}</span>
    </p>
  </v-container>
</template>

<script setup>
import { useAuthenticationStore } from '../stores/accessSecurity/AuthenticationStoreImplementation'

import { navigateTo } from '@/router/router';
import { paths } from '@/router/routesEnumeration';

const store = useAuthenticationStore()

const previousUsername = store.authenticationData.userInformations.username;

setTimeout(() => {
    store.logout();
}, 2000);

setTimeout(() => {
    navigateTo(paths.login);
}, 3000);
</script>

<style scoped>
</style>

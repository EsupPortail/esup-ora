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
import { navigateTo } from '@/router/router';
import { paths } from '@/router/routesEnumeration';
import { useAuthenticationStore } from '../stores/accessSecurity/AuthenticationStoreImplementation'

const store = useAuthenticationStore()
const previousUsername = store.authenticationData.userInformations.username;

console.log('Déconnexion demandée.');
setTimeout(() => {
    store.logout();
}, 2000);

setTimeout(() => {
    navigateTo(paths.login);
}, 3000);
</script>

<style scoped>
</style>

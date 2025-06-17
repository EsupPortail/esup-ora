<template>
  <v-row style="margin-top: 70px; padding-top: 20px; padding-left: 60px; padding-right: 40px;">
    <v-col cols="12">
        <v-row justify="center">
            <v-col :cols="connectionStore.isAuthenticated ? 12 : 6" :class="connectionStore.isAuthenticated ? 'text-center' : ''">
            <h1 style="margin-top: 40px;">Un outil d'aide à la conception</h1>
            <h1>d'une offre de formation</h1>
            <h1>en approche par compétences</h1>
          </v-col>
          <v-col cols="6">
            <LoginView v-if="!connectionStore.isAuthenticated" />
          </v-col>
        </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import LoginView from './LoginView.vue'
import { useAuthenticationStore } from '../stores/accessSecurity/AuthenticationStoreImplementation'
const store = useAuthenticationStore()
import { useConnectionStore } from '@/stores/connectionStore'

const connectionStore = useConnectionStore();

</script>

<style scoped>
h1 {
  font-size: 2.5em;
  font-weight: 700;
  color: #091D55F4;
}
</style>
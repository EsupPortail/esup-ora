<template>
  <v-app-bar style="background-color: #091d55f4; color: white">
    <v-btn @click="$emit('toggleDrawer')">
      <v-icon icon="mdi-menu" />
    </v-btn>
    <v-toolbar-title style="cursor: pointer">
      <span  @click="navigateTo(paths.root)" style="text-transform: uppercase">esup-ora</span>
      <!-- <span style="margin-left: 16px">- {{ routeName }}</span> -->
    </v-toolbar-title>
    <div v-if="connection.isAuthenticated === true">
      <span style="margin-right: 72px;">{{ user.etablissementSelected?.libelle }}</span>
      <span>&nbsp;</span>
      <span>{{ user.givenname }}</span>
      <span>&nbsp;</span>
      <span>{{ user.sn }}</span>
      <span>,</span>
      <span style="padding: 8px">{{ user.roles }}</span>
      <v-btn @click="navigateTo(paths.logout)" text> Déconnexion </v-btn>
    </div>
    <div v-else>
      <v-btn @click="navigateTo(paths.login)" text> S'identifier </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

import { useConnectionStore } from '@/stores/connectionStore';

import { navigateTo } from '@/router/router'
import { paths } from '@/router/routesEnumeration'

import { useRoute } from 'vue-router'

const route = useRoute();
const routeName = ref(route.meta.titlePage || 'Application')

const connection = useConnectionStore();
const user = connection.user;

const changeTitlePageOnRouteChange = () => {
  routeName.value = route.meta.titlePage || 'Application'
}

watch(() => route.meta.titlePage, changeTitlePageOnRouteChange)
watch(() => route.name, changeTitlePageOnRouteChange)

</script>
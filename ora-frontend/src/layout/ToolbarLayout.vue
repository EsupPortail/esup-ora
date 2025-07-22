<template>
  <v-app-bar
    class=".r-view"
    style="background-color: #091d55f4; background-color: white; padding-left: 40px; color: #12255b;"
  >
    <v-row>
      <v-col cols="2" class="d-flex align-center">
    <v-toolbar-title style="cursor: pointer">
      <span
        @click="navigateTo(paths.root)"
        style="text-transform: uppercase; font-weight: bold; font-size: 30px"
        >esup-ora</span
      >
      <!-- <span style="margin-left: 16px">- {{ routeName }}</span> -->
    </v-toolbar-title>
  </v-col>
    <v-col :cols="connection.isAuthenticated === true ? 4 : 2" :offset="connection.isAuthenticated === true ? 6 : 8">
    <div v-if="connection.isAuthenticated === true" style="margin-right: 20px">
      <v-row align="center" no-gutters style="height: 56px; min-width: 400px">
        <v-col
          cols="4"
          class="d-flex align-center justify-center"
          style="height: 100%; min-width: 160px;"
        >
          <v-icon size="24" color="#12255B" icon="mdi-bell-ring" />
          <span style="margin-left: 8px; color: #12255B; padding-top: 3px;">Notifications (0)</span>
        </v-col>
        <v-col
          cols="3"
          class="d-flex align-center justify-center"
          style="height: 60%; min-width: 60px; border-left: 1px solid #12255B; border-right: 1px solid #12255B"
        >
          <UsersConnectedInfo />
        </v-col>
        <v-col
          cols="3"
          class="d-flex align-center justify-center"
          style="height: 100%; min-width: 180px"
        >
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" text>
                <v-icon
                  size="24"
                  color="#919191"
                  icon="mdi-account-outline"
                  style="vertical-align: middle; margin-right: 8px"
                />
                <span style="padding-right: 10px; text-transform: capitalize; color: #12255b">{{
                  user.givenname
                }}</span>
                <span style="text-transform: uppercase; color: #12255b">{{ user.sn }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <span style="font-weight: bold">{{ user.givenname }} {{ user.sn }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span>{{ user.roles }}</span>
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="navigateTo(paths.logout)">
                <v-list-item-title>Déconnexion</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </div>
    <div v-else>
      <v-btn @click="navigateTo(paths.login)" text> S'identifier </v-btn>
    </div>
    </v-col>
    </v-row>
  </v-app-bar>
</template>
    <!-- <v-btn @click="$emit('toggleDrawer')">
      <v-icon icon="mdi-menu" />
    </v-btn> -->


<script setup>
import { ref, watch, computed, onMounted } from 'vue'

import UsersConnectedInfo from '@/components/UsersConnectedInfo.vue'
import { useConnectionStore } from '@/stores/connectionStore'

import { navigateTo } from '@/router/router'
import { paths } from '@/router/routesEnumeration'

import { useRoute } from 'vue-router'

const route = useRoute()
const routeName = ref(route.meta.titlePage || 'Application')

const connection = useConnectionStore()
const user = connection.user

const changeTitlePageOnRouteChange = () => {
  routeName.value = route.meta.titlePage || 'Application'
}

watch(() => route.meta.titlePage, changeTitlePageOnRouteChange)
watch(() => route.name, changeTitlePageOnRouteChange)
</script>

<style scoped>
.r-view {
  min-height: calc(100vh - 64px);
}
</style>
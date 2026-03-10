<template>
  <v-container class="fill-height" fluid>
    <v-row align="left" justify="left">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="10" rounded="lg" class="pa-4" v-if="user">
          <v-list-item class="mb-4">
            <template v-slot:prepend>
              <v-avatar color="primary" size="64">
                <span class="text-h5 white--text">
                  {{ user.givenname[0].toUpperCase() }}{{ user.sn[0].toUpperCase() }}
                </span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-h5 font-weight-bold">
              {{ user.givenname }} {{ user.sn }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.eppn }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-card-text>
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey">Email</div>
              <div class="text-body-1 font-weight-medium">
                <v-icon start icon="mdi-email-outline" size="small"></v-icon>
                {{ user.email }}
              </div>
            </div>

            <div class="text-subtitle-2 text-grey mb-2">Rôles attribués</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="role in user.role"
                :key="role.id"
                :color="connectionStore.selectedRole.name === role.name ? 'primary' : 'secondary'"
                variant="flat"
                class="ma-1"
                size="small"
              >
                {{ role.displayName }}
                <v-tooltip activator="parent" location="top">
                  {{ role.description }}
                </v-tooltip>
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

import axios from 'axios'
import { config } from '@/environment/environment'

import { useConnectionStore } from '@/stores/connectionStore'

const connectionStore = useConnectionStore()

const user = ref(null)

const init = async () => {
  axios.defaults.withCredentials = true
  const response = await axios.get(config.backend.url + '/auth/me', {
    withCredentials: true,
    headers: {
      Authorization: 'Bearer ' + connectionStore.token.access_token
    }
  })
  user.value = response.data.data;
}
init();
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
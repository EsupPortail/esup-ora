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
            <div class="text-subtitle-2 text-grey mb-3">
              <v-icon icon="mdi-domain" size="small" class="mr-1"></v-icon>
              Composantes auxquelles vous êtes rattaché(e)
            </div>

            <v-list lines="two" class="bg-transparent pa-0">
              <v-list-item v-for="composante in myComposantes" :key="composante.id" class="px-0">
                <template v-slot:prepend>
                  <v-avatar color="primary-lighten-4" size="40">
                    <v-icon icon="mdi-office-building-marker" color="primary"></v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-body-2">
                  {{ composante.libelle }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption">
                  {{ composante.etablissement.libelle }} •
                  <span class="text-primary"
                    >{{ composante.utilisateurs_rattaches.length }} collègues</span
                  >
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    variant="text"
                    icon="mdi-information-outline"
                    size="small"
                    color="grey-darken-1"
                  >
                    <v-tooltip activator="parent" location="right">
                      Paramètres : {{ composante.parametre.libelle }}
                    </v-tooltip>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <v-alert
              v-if="!myComposantes?.length"
              type="info"
              variant="tonal"
              density="compact"
              class="text-caption"
            >
              Aucune composante rattachée.
            </v-alert>
          </v-card-text>
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
import { useUserAccessStore } from '@/stores/usersAccessStore'
import { useComposanteStore } from '@/stores/composanteStore'

const connectionStore = useConnectionStore()
const userAccessStore = useUserAccessStore()
const composanteStore = useComposanteStore()

const user = ref(null)
const myComposantes = ref([])

const init = async () => {
  await composanteStore.fetchComposantes()
  axios.defaults.withCredentials = true
  const response = await axios.get(config.backend.url + '/auth/me', {
    withCredentials: true,
    headers: {
      Authorization: 'Bearer ' + connectionStore.token.access_token
    }
  })
  user.value = response.data.data

  const me = userAccessStore.users.find((u) => u.username === connectionStore.user.eppn)
  const myComposanteIds = composanteStore.composantes
    .filter((c) => c.utilisateurs_rattaches?.includes(me.id))
    .map((c) => c.id)
  myComposantes.value = composanteStore.composantes.filter((c) => myComposanteIds.includes(c.id))
  console.log(myComposantes.value)
}

init()
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
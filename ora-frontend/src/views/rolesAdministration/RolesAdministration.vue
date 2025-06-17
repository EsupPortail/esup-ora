<template>
  <v-row>
    <v-col cols="12">
      <InformationBubble>
        <p>
          Voici la liste des utilisateurs d'Esup-ORA. Vous pouvez leur attribuer un rôle spécifique
          via la colonne prévue à cet effet. De plus, un indicateur vous permet de savoir si
          l'utilisateur provient de la fédération d'identité Shibboleth.
        </p>
        <p>Le changement de rôle sera appliqué à la reconnexion de l'utilisateur.</p>
        <p></p>
        <p>Pour des raisons de sécurité, merci de faire attention à l'attribution des rôles.</p>
      </InformationBubble>
    </v-col>
  </v-row>
  <v-card flat>
    <v-tabs bg-color="deep-purple-darken-4" v-model="tab" align-tabs="title" center-active>
      <v-tab value="utilisateurs">Utilisateurs</v-tab>
      <v-tab value="role">Rôles</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="utilisateurs">
        <v-card>
          <TabUsers :users="users" :roles="roles" @fetchUsers="fetchUsers" />
        </v-card>
      </v-tabs-window-item>
      <v-tabs-window-item value="role">
        <v-card>
          <TabRole :roles="roles" />
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'

import { config } from '@/environment/environment'
import { useConnectionStore } from '@/stores/connectionStore'
import InformationBubble from '@/components/InformationBubble.vue'
import TabUsers from '@/views/rolesAdministration/tabs/TabUsers.vue'
import TabRole from '@/views/rolesAdministration/tabs/TabRole.vue'

const tab = ref('privilege')

const connectionStore = useConnectionStore()
const roles = ref([])
const fetchRoles = async () => {
  await axios
    .get(config.backend.url + '/admin/roles', {
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + connectionStore.token.access_token
      }
    })
    .then((value) => {
      roles.value = value.data.data
    })
}
fetchRoles()

const users = ref([])
const fetchUsers = async () => {
  await axios
    .get(config.backend.url + '/admin/users', {
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + connectionStore.token.access_token
      }
    })
    .then((value) => {
      users.value = value.data.data
    })
}
fetchUsers()
</script>

<style scoped>
</style>
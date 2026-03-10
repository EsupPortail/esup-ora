<template>
  <v-row style="margin-top: 24px">
    <v-col cols="8" offset="2">
      <div class="pa-4 border-sm elevation-5" rounded="lg">
        <h2>Ajouter un utilisateur local</h2>
        <!-- Formulaire d'ajout d'utilisateur local -->
        <v-form style="margin-top: 16px">
          <v-text-field
            v-model="newUser.username"
            label="Nom d'utilisateur"
            density="compact"
            variant="outlined"
            :error="formsInError.includes('username')"
            required
          />
          <v-text-field
            v-model="newUser.email"
            label="Email"
            :error="formsInError.includes('email')"
            density="compact"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="newUser.password"
            label="Mot de passe"
            type="new-password"
            :error="formsInError.includes('password')"
            density="compact"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="newUser.passwordConfirmation"
            label="Confirmer le mot de passe"
            :error="formsInError.includes('password')"
            type="new-password"
            density="compact"
            variant="outlined"
            required
          />
          <v-btn color="primary" @click="addLocalUser">Ajouter l'utilisateur</v-btn>
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

import axios from 'axios'
import { config } from '@/environment/environment'

import { useConnectionStore } from '@/stores/connectionStore'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'
import { useUserAccessStore } from '@/stores/usersAccessStore'

const emit = defineEmits(['refreshList'])

const connectionStore = useConnectionStore()
const popUpStore = usePopUpStore()
const userAccessStore = useUserAccessStore()

const formsInError = ref([])

const newUser = ref({
  username: '',
  email: '',
  password: '',
  roleId: null
})

const addLocalUser = async () => {
  if (
    !newUser.value.username &&
    !newUser.value.email &&
    !newUser.value.password &&
    !newUser.value.passwordConfirmation
  ) {
    formsInError.value.push('password')
    formsInError.value.push('username')
    formsInError.value.push('email')
    popUpStore.print({
      isVisible: true,
      message: 'Veuillez remplir tous les champs du formulaire.',
      type: 'ERROR'
    })
    return
  }
  if (
    newUser.value.password !== newUser.value.passwordConfirmation ||
    !newUser.value.password ||
    !newUser.value.passwordConfirmation
  ) {
    formsInError.value.push('password')
    popUpStore.print({
      isVisible: true,
      message: 'Les mots de passe ne correspondent pas.',
      type: 'ERROR'
    })
  }

  let usernameExists = userAccessStore.users.find(
    (user) => user.username === newUser.value.username
  )
  if (usernameExists) {
    formsInError.value.push('username')
    popUpStore.print({
      isVisible: true,
      message: "Le nom d'utilisateur existe déjà.",
      type: 'ERROR'
    })
  }
  let emailExists = userAccessStore.users.find((user) => user.email === newUser.value.email)
  if (emailExists) {
    formsInError.value.push('email')
    popUpStore.print({
      isVisible: true,
      message: 'Un utilisateur avec cet email existe déjà.',
      type: 'ERROR'
    })
  }

  await axios.post(
    `${config.backend.url}/admin/addUser`,
    {
      username: newUser.value.username,
      email: newUser.value.email,
      password: newUser.value.password
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${connectionStore.token.access_token}`
      }
    }
  ).then(() => {
    emit('refreshList');
  })
}

const initData = async () => {
  await userAccessStore.fetchUsers()
}
initData()
</script>
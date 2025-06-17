<template>
  <v-container>
    <v-card class="mx-auto" max-width="500">
      <v-tabs v-model="currentTab" background-color="primary" dark>
        <v-tab>Connexion Universitaire</v-tab>
        <v-tab>Connexion locale</v-tab>
      </v-tabs>

      <v-card-text v-if="currentTab === 0">
        <v-row>
          <v-col cols="12" style="text-align: center">
            <v-btn href="/Shibboleth.sso/Login" type="submit" color="primary"
              >Se connecter avec l'Université</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else style="padding-top: 2px;">
        <v-form @submit.prevent="login" style="padding-left: 4px; padding-right: 4px">
          <v-row style="margin-top: 4px; margin-bottom: 0px">
            <v-col style="padding: 6px 10px 0px 10px !important;" cols="12">
              <v-text-field
                v-model="localCredentials.username"
                label="Nom d'utilisateur"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row style="margin-top: 0px">
            <v-col style="padding: 0px 10px 0px 10px !important" cols="12">
              <v-text-field
                v-model="localCredentials.password"
                :type="showPassword ? 'text' : 'password'"
                label="Mot de passe"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                @click:append="togglePassword"
                autocomplete="current-password"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row style="margin-top: 0px;">
            <v-col col="6" offset="2">
                <v-btn type="submit" color="primary" :loading="loadingLogin" :style="{ width: loadingLogin || resultError ? '282px' : '' }">
                <template v-slot:loader>
                  <v-progress-circular
                    v-if="loadingLogin"
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                </template>
                <template v-slot:default>
                  <v-icon v-if="successLogin" color="white">mdi-check</v-icon>
                  <v-icon v-else-if="resultError" color="white">mdi-alert</v-icon>
                  <span v-else>Se connecter à l'application</span>
                </template>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-alert v-if="loginError" type="error" dismissible>{{ errorMessage }}</v-alert>
        <v-alert v-if="successLogin" type="success" dismissible>{{ this.errorMessage }}</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { postApiRequest } from '../helpers/api/post'
import { backendRoutes } from '../environment/backendRoutes'
import { config } from '../environment/environment'
import { useAuthenticationStore } from '../stores/accessSecurity/AuthenticationStoreImplementation'
import { paths } from '../router/routesEnumeration'
import { navigateTo } from '../router/router'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'
import { computed } from 'vue'
import { useConnectionStore } from '@/stores/connectionStore'

export default {
  data() {
    return {
      currentTab: 0,
      localCredentials: {
        username: '',
        password: ''
      },
      showPassword: false,
      loginError: false,
      successLogin: false,
      loadingLogin: false,
      resultError: false,
      errorMessage: '',
      connectionStore: useConnectionStore(),
      store: useAuthenticationStore(),
      authenticationData: undefined,
      popUpStore: usePopUpStore()
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    resetElements() {
      this.errorMessage = ''
      this.successLogin = false
      this.loginError = false
    },
    async login() {
      this.loadingLogin = true
      this.resetElements()

      if (!this.localCredentials.username || !this.localCredentials.password) {
        this.popUpStore.print({
          isVisible: true,
          message: 'Veuillez renseigner des identifiants de connexion',
          type: 'ERROR'
        })
        this.resultError = true
      } else {
        await this.connectionStore.localLogin(
          this.localCredentials.username,
          this.localCredentials.password
        )
        this.resultError = true
      }
      setTimeout(() => {
        this.loadingLogin = false
        setTimeout(() => {
          this.resultError = false
        }, 2000)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.mx-auto {
  margin: 0 auto;
}

.v-card {
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>

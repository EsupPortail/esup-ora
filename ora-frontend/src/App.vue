<template>
  <v-layout class="rounded rounded-md">
    <DrawerMenuLayout v-model="drawer" />

    <ToolbarLayout @toggleDrawer="toggleDrawer" />

    <v-main ref="content" class="align-center justify-center">
      <v-container
        :style="{
          width: '100%',
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '100px',
          maxWidth: width + 'px'
        }"
        class="r-view align-center justify-center"
      >
        <PopUpInformation
          v-if="popUpStore.popUpData && popUpStore.popUpData.isVisible"
          class="popup-information"
          :message="popUpStore.popUpData.message"
          :type="popUpStore.popUpData.type"
        />
        <router-view />
      </v-container>
      <FooterLayout />
    </v-main>
  </v-layout>
</template>

<script setup>
import ToolbarLayout from '@/layout/ToolbarLayout.vue'
import FooterLayout from '@/layout/FooterLayout.vue'
import DrawerMenuLayout from '@/layout/DrawerMenuLayout.vue'
import { useAppStore } from '@/stores/appStore'
import PopUpInformation from '@/helpers/PopUpInformation.vue'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'
import axios from 'axios'
import { useFormationStore } from '@/stores/formationStore'
import { ref, onMounted, nextTick } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useConnectionStore } from './stores/connectionStore'
import { config as env } from './environment/environment'
import { useSocketStore } from './stores/socketStore'
const appStore = useAppStore()
const connectionStore = useConnectionStore()
const formationStore = useFormationStore();
const socketStore = useSocketStore()
axios.interceptors.request.use(
  async (config) => {
    try {
      if (!connectionStore.token) {
        return config
      }

      if (config.url.includes('/auth/me') || config.url.includes('/auth/logout')) {
        return config
      }

      const response = await axios.get(`${env.backend.url}/auth/me`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${connectionStore.token.access_token}`
        }
      })

      if (response.status === 401) {
        connectionStore.logout()
      } else {
        config.headers.Authorization = `Bearer ${connectionStore.token.access_token}`
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
      connectionStore.logout()
    }

    if (['post', 'put', 'delete'].includes(config.method)) {
      if( formationStore.formationSelected) {
        config.data = {
          ...config.data,
          metadata : {
            formationId: formationStore.formationSelected
          }
        }
      }
    }

    if( socketStore.isConnected === false && localStorage.getItem('roomId') !== null ) {
      console.log('Reloading socket');
      await socketStore.connect(localStorage.getItem('roomId'), connectionStore.user.givenname, connectionStore.user.sn)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const drawer = ref(false)
const content = ref(null)
const popUpStore = usePopUpStore()
const { width, height } = useElementSize(content)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<style scoped>
.r-view {
  /* Pour que le footer reste en bas en cas de page vide */
  min-height: calc(100vh - 60px - 64px);
}

.popup-information {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);

  opacity: 1;
}
</style>
<template>
  <v-layout>
    <ToolbarLayout @toggleDrawer="toggleDrawer" />
    <DrawerMenuLayout :drawer="drawer" />
    <v-main
      ref="content"
      class="align-center justify-center"
      style="background: #f1f1f1 0% 0% no-repeat padding-box; opacity: 1"
    >
      <ArianeParcoursPath v-if="$route.meta.showAriane === true" />
      <v-container
        :style="{
          width: '100%',
          paddingLeft: '30px',
          paddingRight: '30px',
          maxWidth: width + 'px'
        }"
        class="r-view align-center justify-center"
      >
        <router-view />
<PopUpInformation />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Cookies from 'js-cookie'

import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'
import { useFormationStore } from '@/stores/formationStore'
import { useElementSize } from '@vueuse/core'
import { useSocketStore } from './stores/socketStore'
import { useConnectionStore } from './stores/connectionStore'

import ToolbarLayout from '@/layout/ToolbarLayout.vue'
import DrawerMenuLayout from '@/layout/DrawerMenuLayout.vue'
import PopUpInformation from '@/helpers/PopUpInformation.vue'
import ArianeParcoursPath from '@/components/ArianeParcoursPath.vue'

const connectionStore = useConnectionStore()
const formationStore = useFormationStore()
const socketStore = useSocketStore()
const route = useRoute()

const drawer = ref(false)
const content = ref(null)
const { width } = useElementSize(content)

onMounted(async () => {
  if (route.path === '/authentication-return') return
  
  await nextTick()
  
  const token = Cookies.get('access_token')
  const userExists = !!connectionStore.user?.givenname

  if (!token && userExists) {
    console.warn('Session expirée (cookie manquant)')
    connectionStore.logout()
  }
})

axios.interceptors.request.use(async (config) => {
  const excludedUrls = ['/auth/logout', '/auth/local'];
  if (excludedUrls.some(url => config.url.includes(url))) {
    return config;
  }

  const accessToken = Cookies.get('access_token')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    if (connectionStore.selectedRole) {
      config.headers['X-Active-Role'] = connectionStore.selectedRole.name
    }
  }

  const isMutation = ['post', 'put', 'delete'].includes(config.method?.toLowerCase())
  if (isMutation && formationStore.formationSelected) {
    config.data = {
      ...config.data,
      metadata: { formationId: formationStore.formationSelected }
    }
  }

  if (!socketStore.isConnected && localStorage.getItem('roomId') && connectionStore.user?.givenname) {
    socketStore.connect(
      localStorage.getItem('roomId'),
      connectionStore.user.givenname,
      connectionStore.user.sn
    )
  }

  return config
}, (error) => Promise.reject(error))

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 403) {
      console.log("Intercepteur : Traitement de la 403");
      const popUpStore = usePopUpStore()

      popUpStore.print({
        message: "Action refusée : Vous n'avez pas les droits nécessaires.",
        type: 'ERROR' 
      });
    }

    if (status === 419 || (error.response?.data?.message?.includes('token expired'))) {
      connectionStore.logout();
    }

    return Promise.reject(error);
  }
);
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<style scoped>
.r-view {
  min-height: calc(100vh - 64px);
}

.popup-information {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}
</style>
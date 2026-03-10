<template>
  <h1>
    <v-icon>mdi-file-document-outline</v-icon>
    <span>Administration</span>
  </h1>

  <v-row style="margin-top: 20px">
    <template v-for="category in categories" :key="category.name">
      <v-col cols="12" md="3" class="d-flex">
        <v-card v-if="amIGranted(category.grants)" class="mb-4 flex-grow-1 d-flex flex-column" style="height: 100%">
          <v-card-title>
            <v-icon left class="me-2">{{ category.icon || 'mdi-folder' }}</v-icon>
            <span>{{ category.name }}</span>
          </v-card-title>

          <v-card-text class="flex-grow-1">
            <v-list dense>
              <template v-for="child in category.children" :key="child.title">
                <v-list-item
                  v-if="amIGranted(child.grants)"
                  @click="goToChild(child, category.path)"
                >
                  <v-list-item-title>{{ child.title }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { navigationBackOffice } from '@/router/navigationBackOffice.js'

import { useConnectionStore } from '@/stores/connectionStore'
import { useUserAccessStore } from '@/stores/usersAccessStore'

const alreadyLoaded = ref(false)
const connectionStore = useConnectionStore()
const userStore = useUserAccessStore()
const me = ref(null)

const router = useRouter()

const categories = computed(() => {
  return Object.entries(navigationBackOffice)
    .map(([key, value]) => {
      const filteredChildren = (value.children || []).filter(child =>
        amIGranted(child.grants || [])
      )

      const grantedCategory =
        amIGranted(value.grants || []) ||
        filteredChildren.length > 0

      if (!grantedCategory) return null

      return {
        name: value.name,
        icon: value.icon,
        path: value.path,
        grants: value.grants || [],
        children: filteredChildren
      }
    })
    .filter(Boolean)   // supprime les null
})


const amIGranted = (grants) => {
  if (!grants || grants.length === 0) return true;

  const selectedRole = connectionStore.selectedRole;
  
  if (!connectionStore.isAuthenticated || !selectedRole) {
    return false;
  }
  return grants.includes(selectedRole.name);
}

const goToChild = (child, path) => {
  router.push({
    path: path,
    query: { sectionToOpen: child.title }
  })
}

const initData = async () => {
  if (!connectionStore.isAuthenticated) return
  await userStore.fetchUsers()
  me.value = userStore.users.find((user) => user.email === connectionStore.user?.email)
}
initData()

watch(
  () => connectionStore.isAuthenticated,
  async (isAuth) => {
    if (isAuth && !alreadyLoaded.value) {
      await initData()
      alreadyLoaded.value = true
    }
  }
)
</script>

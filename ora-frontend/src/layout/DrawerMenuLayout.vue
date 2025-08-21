<template>
  <v-navigation-drawer
   v-if="connectionStore.isAuthenticated"
    color="white"
    v-model="drawer"
    :rail="rail"
    style="height: calc(100vh - 64px); padding-top: 10px;"
    permanent
    app
  >
    <v-list-item
      icon
      @click="rail = !rail"
      :prepend-icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
      rounded="false"
    />

    <v-divider />

    <v-list density="compact" nav>
      <template v-for="(item, key) in rawMenu" :key="key">
        <template v-if="Array.isArray(item)">
          <v-divider class="my-2" />
          <v-list-item
            v-for="(child, childKey) in item"
            :key="childKey"
            :title="child.title"
            :prepend-icon="child.icon"
            @click="navigate(child.path)"
          />
        </template>
        <template v-else>
          <v-list-item
            :title="key"
            :prepend-icon="item.icon"
            @click="navigate(item.path)"
          />
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import rawMenu from '@/router/navigation'
import { connect } from 'socket.io-client'
import { useConnectionStore } from '@/stores/connectionStore'

const connectionStore = useConnectionStore()
const drawer = ref(true)
const rail = ref(true)
const router = useRouter()
const props = defineProps({
  drawer: Boolean
})

const navigate = (path) => {
  if (path) {
    router.push(path)
  }
}
</script>

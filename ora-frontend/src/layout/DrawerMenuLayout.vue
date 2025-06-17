<template>
  <v-navigation-drawer 
    color="grey-darken-2"
    name="drawer"
    v-model="drawer"
    style="height: 100vh;"
  >
    <v-list-item title="Menu"></v-list-item>
    <v-divider></v-divider>
    <v-list>
      <DrawerMenuLayoutElements
        v-for="(item, index) in menu"
        :item="item"
        :index="index"
        :key="index"
      />
    </v-list>
    <!-- <div class="d-flex justify-center align-center avatarORA" @click="navigateTo(paths.userInfos)">
      <v-avatar class="hover-blue" size="80">
        <v-icon size="60">mdi-account</v-icon>
      </v-avatar>
    </div> -->
  </v-navigation-drawer>
</template>
<script setup>
import { ref, computed } from 'vue'
import DrawerMenuLayoutElements from './DrawerMenuLayoutElements.vue'
import menu from '@/router/navigation'
import { navigateTo } from '@/router/router.js'
import { paths } from '@/router/routesEnumeration.js'
const drawer = defineModel()

</script>
<style scoped>
.hover-blue {
  background-color: white;
  transition: background-color 0.3s;
}

.avatarORA {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0px;
}

.hover-blue:hover {
  background-color: #007bff;
}
</style>
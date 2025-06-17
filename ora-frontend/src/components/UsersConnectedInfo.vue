<template>
  <v-menu open-on-hover location="bottom" transition="fade-transition">
    <template #activator="{ props }">
      <div class="users-connected-info" v-bind="props">
        <v-icon class="icon" color="primary">mdi-account</v-icon>
        <span class="count">
          {{ userCount }}
        </span>
      </div>
    </template>

    <v-list>
      <v-list-item v-for="(user, index) in users" :key="index">
        <v-list-item-title>{{ user.firstname }} {{ user.lastname }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
  
  <script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

import { useSocketStore } from '@/stores/socketStore'
import { useFormationStore } from '@/stores/formationStore';

const formationStore = useFormationStore()
const socketStore = useSocketStore()

const userCount = ref(0);
const users = ref([])

onMounted( async () => {
  await nextTick()
  console.log('compouting default value')
  await socketStore.getRoomUserCount(localStorage.getItem('roomId'));
  userCount.value = socketStore.nbUsersInRoom
  users.value = socketStore.usersInRoom
})
watch(
  () => socketStore.nbUsersInRoom,
  (newValue) => {
    console.log('new value')
    userCount.value = newValue
    users.value = socketStore.usersInRoom
  },
  { immediate: true }
)
</script>
  
  <style scoped>
.users-connected-info {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer; /* Change le curseur */
}

.icon {
  margin-right: 5px;
  font-size: 24px;
}

.count {
  font-weight: bold;
}
</style>
  
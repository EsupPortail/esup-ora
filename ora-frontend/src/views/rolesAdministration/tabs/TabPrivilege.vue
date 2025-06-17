<template>
  <p>Hello</p>
  <!-- <v-data-table
      :headers="headers"
      :items="transformedData"
      class="text-center rotated-headers-table"
      fixed-header
      height="600px"
    >
      <template v-slot:[`item.access`]="{ item }">
        <span>{{ item.access }}</span>
      </template>
      <template
        v-for="(role, index) in mockUpRoles.roles"
        v-slot:[`item.${role.name}`]="{ item }"
        :key="role.name"
      >
        <v-chip
          :color="item.roles[index].hasAccess ? 'success' : 'error'"
          text-color="white"
          label
          @click="toggleAccess(item, index)"
        >
          <v-icon v-if="item.roles[index].hasAccess">mdi-check</v-icon>
          <v-icon v-else>mdi-close</v-icon>
        </v-chip>
      </template>
      <template v-slot:body>
        <tr
          v-for="(item, index) in transformedData"
          :key="item.id"
          :class="{ dragging: isDragging && draggedItemIndex === index }"
          draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent
          @drop="onDrop($event, index)"
        >
          <td>{{ item.access }}</td>
          <td v-for="(role, idx) in mockUpRoles.roles" :key="role.name">
            <v-chip
              :color="item.roles[idx].hasAccess ? 'success' : 'error'"
              text-color="white"
              label
              @click="toggleAccess(item, idx)"
            >
              <v-icon v-if="item.roles[idx].hasAccess">mdi-check</v-icon>
              <v-icon v-else>mdi-close</v-icon>
            </v-chip>
          </td>
        </tr>
      </template>
    </v-data-table> -->
</template>

<script setup>
import { ref } from 'vue'

import { usePrivilegeStore } from '@/stores/privilege-and-roles/privilegeStore.ts'
import { useRolesStore } from '@/stores/privilege-and-roles/rolesStore.ts'

let draggedItemIndex = ref(null)
let isDragging = ref(false)

// const transformDataForTable = (backendData, roles) => {
//   return backendData.map((item) => ({
//     id: item.id,
//     access: item.libelle,
//     roles: roles.map((role) => ({
//       name: role.name,
//       hasAccess: false
//     }))
//   }))
// }

// const headers = [
//   { text: 'Accès', value: 'access' },
//   ...mockUpRoles.roles.map((role) => ({ title: role.name, value: role.name }))
// ]

const privilegeStore = usePrivilegeStore()
privilegeStore.fetchPrivileges()
console.log(privilegeStore.getPrivileges)
const privilegeItems = ref({
  store: privilegeStore,
  entity: 'privilege',
  headers: [
    { title: 'Nom', key: 'libelle' },
    { title: 'Actions', key: 'actions', align: 'right', width: '150px' }
  ],
  entities: []
})

const rolesStore = useRolesStore()
rolesStore.fetchRoles()
console.log( rolesStore.getRoles)


// let items = transformDataForTable( privilegeStore.get, )

// const toggleAccess = (item, index) => {
//   item.roles[index].hasAccess = !item.roles[index].hasAccess
//   transformedData.value = [...transformedData.value]
// }

// const onDragStart = (event, index) => {
//   draggedItemIndex.value = index
//   isDragging.value = true
// }

// const onDrop = (event, dropIndex) => {
//   const draggedIndex = draggedItemIndex.value

//   if (draggedIndex !== null && draggedIndex !== dropIndex) {
//     const draggedItem = transformedData.value[draggedIndex]
//     transformedData.value.splice(draggedIndex, 1)
//     transformedData.value.splice(dropIndex, 0, draggedItem)
//   }

//   draggedItemIndex.value = null
//   isDragging.value = false
// }
</script>

<style scoped>
.dragging {
  background-color: #e0f7fa;
  opacity: 1;
}
</style>

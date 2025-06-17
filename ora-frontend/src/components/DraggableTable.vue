<template>
  <v-container>
    <v-data-table :headers="headers" class="elevation-1" :items="items" item-value="name">
      <template v-slot:body>
        <tr
          v-for="(item, index) in items"
          :key="item.id"
          :class="{ dragging: isDragging && draggedItemIndex === index }"
          draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent
          @drop="onDrop($event, index)"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.job }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const headers = [
  { text: 'Nom', value: 'name' },
  { text: 'Âge', value: 'age' },
  { text: 'Métier', value: 'job' }
]

let items = ref([
  { id: 0, name: 'Alice', age: 25, job: 'Designer' },
  { id: 1, name: 'Bob', age: 30, job: 'Ingénieur' },
  { id: 2, name: 'Charlie', age: 35, job: 'Chef de projet' }
])

let draggedItemIndex = ref(null)
let isDragging = ref(false)

const onDragStart = (event, index) => {
  draggedItemIndex.value = index
  isDragging.value = true
}

const onDrop = (event, dropIndex) => {
  const draggedIndex = draggedItemIndex.value

  if (draggedIndex !== null && draggedIndex !== dropIndex) {
    const draggedItem = items.value[draggedIndex]
    items.value.splice(draggedIndex, 1)
    items.value.splice(dropIndex, 0, draggedItem)
  }

  draggedItemIndex.value = null
  isDragging.value = false
  console.log('Nouvel ordre:', items.value)
}
</script>

<style scoped>
.dragging {
  background-color: #e0f7fa; 
  opacity: 1; 
}
</style>

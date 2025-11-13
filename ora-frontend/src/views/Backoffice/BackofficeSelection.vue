<template>
  <h1>
    <v-icon>mdi-file-document-outline</v-icon>
    <span>Administration</span>
  </h1>

  <v-row style="margin-top: 20px">
    <v-col
      v-for="category in categories"
      :key="category.name"
      cols="12"
      md="3"
      class="d-flex"
    >
      <v-card class="mb-4 flex-grow-1 d-flex flex-column" style="height: 100%">
        <v-card-title>
          <v-icon left class="me-2">{{ category.icon || 'mdi-folder' }}</v-icon>
          <span>{{ category.name }}</span>
        </v-card-title>

        <v-card-text class="flex-grow-1">
          <v-list dense>
            <v-list-item
              v-for="child in category.children"
              :key="child.title"
              @click="goToChild(child, category.path)"
            >
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { navigationBackOffice } from '@/router/navigationBackOffice.js'

const router = useRouter()

const categories = computed(() => {
  return Object.entries(navigationBackOffice).map(([key, value]) => ({
    name: value.name,
    icon: value.icon,
    path: value.path,
    children: value.children || []
  }))
})


const goToChild = (child, path) => {
  router.push({
    path: path,
    query: { sectionToOpen: child.title }
  })
}
</script>

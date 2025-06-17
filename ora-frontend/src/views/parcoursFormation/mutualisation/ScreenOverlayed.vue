<template>
  <v-card>
    <v-data-table :headers="headers" :items="items" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Data Table</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Age', value: 'age' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      items: [
        { name: 'John Doe', age: 30 },
        { name: 'Jane Smith', age: 25 },
        { name: 'Paul Brown', age: 27 }
      ]
    }
  },
  methods: {
    editItem(item) {
      console.log('Edit', item)
    },
    deleteItem(item) {
      console.log('Delete', item)
    }
  }
}
</script>

<style scoped>
</style>
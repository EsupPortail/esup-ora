<template>
  <v-container>
    <v-autocomplete
      density="compact"
      variant="outlined"
      v-model="selectedItems"
      :items="itemsList"
      :label="label"
      clearable
      multiple
      chips
      @update:modelValue="onSearch"
      :item-title="renderFieldLink"
    ></v-autocomplete>
  </v-container>
</template>
  
<script setup>
import { ref } from 'vue'

const props = defineProps({
  itemsList: {
    type: Array,
    required: true,
    default: () => []
  },
  label: {
    type: String,
    required: true
  }
});

const selectedItems = ref([])

// Fonction qui affiche "FirstName Lastname - Email"
const renderFieldLink = (item) => {
  if (!item) return '';
  return `${item.firstName ?? ''} ${item.lastName ?? ''} - ${item.email ?? ''}`;
};

const onSearch = () => {
  console.log('Sélection actuelle:', selectedItems.value);
};
</script>

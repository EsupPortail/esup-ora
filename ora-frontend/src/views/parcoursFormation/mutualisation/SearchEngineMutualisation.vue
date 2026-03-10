<template>
    <div>
      <v-text-field
        v-model="input"
        label="Recherche d'un élément par son libellé"
        variant="outlined"
        density="compact"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    itemsList: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['input-change'])
  
  const input = ref('')
  
  function getRelevanceScore(libelle, query) {
    const str = libelle.toLowerCase()
    const q = query.toLowerCase()
    if (str === q) return 100
    if (str.startsWith(q)) return 75
    if (str.includes(q)) return 50
    return 0
  }
  
  watch(input, (val) => {
    const sorted = [...props.itemsList]
      .map(item => ({
        ...item,
        _score: getRelevanceScore(item.libelle, val)
      }))
      .sort((a, b) => b._score - a._score)
      .map(({ _score, ...item }) => item)
  
    emit('input-change', sorted)
  })
  </script>
  
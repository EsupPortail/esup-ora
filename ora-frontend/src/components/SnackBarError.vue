<template>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="error"
      location="top"
    >
      <b>Une erreur est survenue</b>
      <p>{{ text }}</p>

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup>
import { watch, ref } from 'vue';

const snackbar = ref(false)
const text = ref("")
const timeout = ref(4000)

const props = defineProps({
  error: Object | Boolean,
})

watch(() => props.error.time, (value, oldValue) => {
  snackbar.value = true
  text.value = props.error.message ?? "An error occured"
})

</script>
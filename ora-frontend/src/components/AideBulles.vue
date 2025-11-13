<template>
    <v-btn
      class="rounded-circle"
      color="#12255B"
      width="40"
      height="40"
      elevation="0"
      @click="changeStateInformationCard(!toggleInformationCard)"
      icon
      aria-label="Information"
    >
      <span class="text-white font-bold" style="text-transform: lowercase; font-size: 22px;">i</span>
    </v-btn>

    <v-slide-x-reverse-transition class="slow-transition">
      <v-card
        v-if="toggleInformationCard"
        class="help-card"
        style="width: 600px; height: 300px; position: absolute; z-index: 999; right: 44px; top: 200px;"
      >
        <v-card-title style="background-color: #14275C; color: #fff; text-align: center;">
          Informations
        </v-card-title>
        <v-card-text class="pa-4" style="font-size: 1rem;">
        <p style="height:160px; overflow-y:auto;">
            {{ infoBulleStore.informations_bulles.find(bulle => bulle.screen_associated === props.pageAsked)?.contenu || "Aucune information disponible pour cette page." }}
        </p>
        <div class="d-flex justify-end">
            <v-btn color="info" @click="changeStateInformationCard(false)">
              Fermer
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-slide-x-reverse-transition>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'

import { useApplicationInformationsBullesStore } from '@/stores/informationsBullesStore'

const props = defineProps({
    pageAsked: String,
    backgroundColor: {
        type: String    },
    color: {
        type: String
    }
})

const infoBulleStore = useApplicationInformationsBullesStore()

const toggleInformationCard = ref(false)
const changeStateInformationCard = (newState) => {
  toggleInformationCard.value = newState
}
console.log(props.pageAsked)

const initData = async () => {
  await infoBulleStore.fetchApplicationInformationsBulles()
}

initData();

</script>
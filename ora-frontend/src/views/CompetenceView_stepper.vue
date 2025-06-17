<template>
  <v-container>
    <v-stepper
      v-model="e1"
      alt-labels
      non-linear
    >
      <v-stepper-header class="elevation-0">
        <template v-for="item in pathsEnum">
          <v-stepper-item 
            :step="item.step" 
            :title="item.title"
            editable
            :rules="[() => false]"
            :value="item.step"
            :ripple="true"
            @click="routerTo(item.href)" 
          >
          </v-stepper-item>
        </template>
    </v-stepper-header>
    
    <v-stepper-window>
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-stepper-window>
      
    </v-stepper>
  </v-container>
</template>


<script setup>
import { ref } from 'vue'
import { paths } from '../core/routing/routesEnumeration.js'
import { useRouter } from 'vue-router';

const e1 = ref(1)
const router = useRouter();

const routerTo = (path) => {
  router.push({name: path}).catch(err => {})
}

const pathsEnum = ref([
  {title: "Formation number XXXX", href: 'parcours', step: 1 },
  {title: "Version number 1", href: 'version', step: 2 },
  {title: "Bloc de compétences et de connaissances", href: paths.competences, step: 3 },
  {title: "Apprentissages critiques (compétences)", href: paths.apprentissagesCritiques, step: 4 },
  {title: "Ressources / enseignements", href: paths.typesRessourcesPedagogiques, step: 5 },
  {title: "Évaluation compétences", href: paths.composantesEssentielles, step: 6 }
])
</script>

<style scoped>
.slide-enter-active, .slide-leave-active, .slide-enter-to-active, .slide-leave-to-active {
  transition: transform 0.2s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateX(100%);
}
.slide-enter-to /* New state for when the enter transition is complete */ {
  transform: translateX(0);
}
.slide-enter-from /* New state for the start of the enter transition */ {
  transform: translateX(-100%);
}
</style>
<template>
  <v-app-bar class=".r-view" elevation="6" style="height: 50px !important;">
  <v-sheet
    width="100%"
    class="d-flex justify-center align-center"
    style="height: 50px !important;"
  >
      <v-breadcrumbs
      style="padding: 0px;"
      :items="arianeRoutes"
      divider=""
      >
        <template v-slot:item="{item}">
            <ArianeParcoursPathItem :item="item"></ArianeParcoursPathItem>
        </template>
      </v-breadcrumbs>
  </v-sheet>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import ArianeParcoursPathItem from '@/components/ArianeParcoursPathItem.vue'
import { routes } from '@/router/routesEnumeration.js'

const arianeRoutes = routes.filter((r) => {
  return (r.meta.ariane)
})
.sort((a, b) => a.meta.ariane.order - b.meta.ariane.order)

// const pathsEnum = ref([
//   {title: "Versions", href: paths.versionList, disabled: false, order: 1},
//   {title: "Compétences", href: paths.competencesParcours, disabled: false, order: 2 },
//   {title: "Apprentissages", href: paths.apprentissagesCritiquesParcours, disabled: false, order: 3 },
//   {title: "Éléments constitutifs", href: paths.elementsConstitutifsParcours, disabled: false, order: 4 },
//   {title: "BCC", href: paths.blocDeCompetences, disabled: false, order: 5 },
//   {title: "Données globales", href: paths.globalData, disabled: false, order: 6 }
// ])
</script>

<style scoped>
.r-view {
  min-height: calc(100vh - 50px);
}
</style>
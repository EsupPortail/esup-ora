<template>
  <v-sheet
    width="100%"
    class="d-flex justify-center align-center"
    style="height: 50px;"
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
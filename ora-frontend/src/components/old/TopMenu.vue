<template>
  <el-menu
    class="el-menu-demo mainTopMenu"
    mode="horizontal"
  >

    <template v-for="(item, name, index) in menu" :key="`item-${index}`">
      <template v-if="!isMenuItem(item)">
        <el-menu-item @mouseover="handleOpenBubble(index)" @click="handleOpenBubble(index)">{{ name }}</el-menu-item>
        <div class="bubbleElement" v-show="openedElement === index" >
          <BubbleElement
            :elements="item"
            :opened="openedElement === index" 
            :close="setOpenedElement"
          />
        </div>
      </template>

      <el-menu-item
        v-else
        :index="name"
        @click.native="navigateTo(item)"
      >
        {{ name }}
      </el-menu-item>
    </template>
  </el-menu>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { menu } from '../../router/navigation.js'
import BubbleElement from './BubbleElement.vue'

const router = useRouter()
const activeIndex = ref('1')
const openedElement = ref('-1');

const setOpenedElement = () => {
  openedElement.value = -1;
}

const handleOpenBubble = ( indexToOpen) => {
  openedElement.value = indexToOpen
}

const handleSelect = (key, keyPath) => {
  // Mise à jour de l'indice actif
  activeIndex.value = key
}

const navigateTo = (path) => {
  // Exécute la navigation
  router.push(path)
}

const generateUniqueKey = (key) => {
  // Génère une clé unique pour chaque élément
  return `${key}_${Math.random().toString(36).substr(2, 9)}`
}

const isMenuItem = (item) => {
  // Détermine si l'élément est un lien de menu
  return typeof item === 'string'
}

const isOpen = (index) => {
  // Détermine si le sous-menu doit être ouvert
  return index === activeIndex.value.split('_')[0]
}
</script>

<style scoped>
.bubbleElement {
  position: absolute;
  left: 0;
  top: 100%; /* Positionnez juste en dessous du menu */
  width: 800px; /* Assurez-vous qu'il s'étend sur toute la largeur */
  z-index: 1000; /* Assurez-vous qu'il s'affiche par-dessus les autres éléments */
}

.containerLogo {
  border: 3px solid #fff; /* Couleur de bordure blanche */
  border-radius: 50%; /* Forme circulaire */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Ombrage doux */
  overflow: hidden; 
}

.containerLogo img {
  width: 80px; /* ou la taille que vous souhaitez */
  height: auto; /* doit être égal à la largeur pour être un cercle */
  border-radius: 50%; /* rend les coins complètement arrondis, créant un cercle */
  object-fit: cover; 
   transform: scale(1.1);
}

.mainTopMenu {
  /* Ajustez l'ombrage et le fond pour le menu principal */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8; /* Couleur de fond légèrement grise */
  padding: 0 20px; /* Ajoutez un peu de padding autour du menu */
  height: auto;
}

/* Style pour le menu item lors du survol */
.el-menu-item:hover {
  background-color: #fff; /* Blanc lors du survol */
  border-radius: 4px; /* Bordures légèrement arrondies */
  transition: background-color 0.2s; /* Transition douce lors du survol */
}

</style>
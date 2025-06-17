<template>
  <div class="bubble-menu" v-show="opened" @mouseleave="close">
    <el-container class="containerBoth">
      <el-aside class="containerLeft">
        <div :style="highlightStyle" class="highlight-background"></div>
        <el-menu default-active="2" class="el-menu-vertical-demo bubbleLeftMenu">
          <template v-for="(subItem, subName, subIndex) in elements" :key="`subItem-${subIndex}`">
            <el-menu-item
              @mouseover="handleMouseOver(subIndex, $event)"
              @click="handleOpenSubmenu(subIndex)"
              @mouseenter="handleOpenSubmenu(subIndex)"
              :class="{ 'is-selected': isSelected(subIndex) }"
            >
              {{ subName }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-aside class="containerRight" :key="`aside-${idOpened}`">
        <template v-for="(subItem, subName, subIndex) in elements" :key="`subItem-${subIndex}`">
          <el-menu v-show="idOpened === subIndex" class="menuRight">
            <template v-for="(item, name) in subItem" :key="name">
              <el-menu-item :index="subIndex" @click.native="navigateTo(item)">
                {{ name }}
              </el-menu-item>
            </template>
          </el-menu>
        </template>
      </el-aside>
    </el-container>
  </div>
</template>


<script setup>
import { ref, defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

const { elements, opened, close } = defineProps(['elements', 'opened', 'close'])
const idOpened = ref(0)
const router = useRouter()
const hoveredIndex = ref(null)
const hoveredRect = ref({ top: 0, height: 0 })
const selectedItemIndex = ref(null) // Réactif pour l'index du menu-item sélectionné

const handleOpenSubmenu = (index) => {
  idOpened.value = index
  selectedItemIndex.value = index
  idOpened.value = index
}
const handleMouseOver = (index, event) => {
  hoveredIndex.value = index
  const rect = event.target.getBoundingClientRect()
  const containerRect = event.currentTarget.closest('.containerLeft').getBoundingClientRect()
  hoveredRect.value = {
    top: rect.top - containerRect.top, // Ajuste top pour être relatif au containerLeft
    height: rect.height
  }
}
const isSelected = (index) => {
  return selectedItemIndex.value === index // Renvoie true si l'index correspond à l'élément sélectionné
}
const navigateTo = (path) => {
  // Exécute la navigation
  router.push(path)
}

const highlightStyle = computed(() => {
  if (hoveredIndex.value !== null) {
    return {
      position: 'absolute',
      top: `${hoveredRect.value.top}px`,
      left: '0',
      right: '0',
      height: `${hoveredRect.value.height}px`,
      backgroundColor: 'white',
      transition: 'all 0.4s ease'
      // Ajoutez ici d'autres styles pour ressembler à votre capture d'écran
    }
  }
  return {}
})
</script>

<style scoped>

.bubble-menu {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
}

.bubbleLeftMenu .el-menu-item.is-selected::after {
  content: '➤'; /* Vous pouvez mettre le contenu que vous souhaitez ici, comme un symbole ou une image */
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%; /* Si vous voulez un indicateur circulaire */
}

.containerLeft {
  position: relative;
  background-color: #f8f8f8; /* Fond gris pour le conteneur gauche */
  width: 300px;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 2;
}

.containerRight {
  background-color: #fff; /* Fond blanc pour le conteneur droit */
  width: 500px;
  padding-top: 10px;
  position: relative;
  padding-bottom: 10px;
  margin-left: -1px; /* Pour que l'ombre de highlight-background semble se connecter ici */
  z-index: 0;
}
.containerRight::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 100%; /* Aligner le pseudo-élément avec le côté droit du containerRight */
  border-style: solid;
  border-width: 0 20px 0 0; /* Ajuster la largeur du bord pour correspondre à l'épaisseur du highlight */
  border-color: transparent #f8f8f8 transparent transparent; /* Utiliser la couleur de fond de containerLeft */
  border-radius: 0 10px 10px 0; /* Arrondi pour correspondre au `highlight-background` */
  /* Ajuster le box-shadow pour qu'il corresponde à l'ombre portée de highlight-background */
  box-shadow: inset 0px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 1; /* Assurez-vous que le pseudo-élément est au-dessus du highlight-background */
}

.highlight-background {
  /* Initialisation du style de la div de surbrillance */
  position: absolute;
  width: 100%; /* Assurez-vous qu'elle s'étend sur toute la largeur du containerLeft */
  transition: top 0.3s ease, height 0.3s ease; /* Transition fluide lors du changement de bouton */
  background-color: white; /* Couleur de fond du bloc de surbrillance */
  z-index: 0; /* Assurez-vous que cela ne passe pas au-dessus des autres éléments cliquables */
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1); /* Ombre à droite qui se fond dans containerRight */
  border-radius: 0 10px 10px 0; /* Arrondi à droite pour s'adapter à l'arrondi de containerRight */
  z-index: 1;
}
.bubbleLeftMenu,
.menuRight {
  background-color: transparent !important; /* Assure que les menus sont transparents */
}

.bubble-menu .el-menu-item {
  background-color: transparent !important; /* Maintient les éléments de menu transparents */
  position: relative;
  overflow: hidden;
  z-index: 10;
}
.bubble-menu .el-menu-item:hover {
  color: black !important;
}

/* Styles pour l'animation et l'icône de survol */
.bubbleLeftMenu .el-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  z-index: -1;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 2s;
}

/* .bubbleLeftMenu .el-menu-item:hover::before { transform: scaleY(1); } */

/* Autres styles inchangés */
.icon-text {
  font-size: 24px;
}

.item-description {
  color: #333;
  font-size: 14px;
  transition: opacity 0.3s;
  visibility: hidden;
  opacity: 0;
}

.menu-item:hover .item-description {
  visibility: visible;
  opacity: 1;
}
</style>

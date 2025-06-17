<template>
  <div class="information-bubble">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.information-bubble {
  position: relative; /* Positionnement relatif */
  width: 100%; /* Prend toute la largeur du parent */
  font-size: 14px;
  background-color: white; /* Couleur de fond très claire */
  border: 2px solid #0D47A1; /* Bordure bleue claire */
  border-left: 12px solid #0D47A1; /* Bordure gauche plus épaisse */
  border-radius: 8px; /* Coins légèrement arrondis */
  padding: 16px; /* Espace intérieur pour le contenu */
  margin: 10px 0; /* Marge pour séparation du contenu environnant */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12); /* Léger ombrage pour un effet de profondeur */
}
</style>

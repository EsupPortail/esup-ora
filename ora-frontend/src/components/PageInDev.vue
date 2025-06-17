<template>
  <div class="information-bubble">
    <h2>Page en développement.</h2>
    <h3>
      Cette page est en cours de développement et ne sera peut être pas la même fonctionnellement
    </h3>
    <h3>Cette page peut également ne pas fonctionner actuellement.</h3>
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
  border: 2px solid #FFD666 ; /* Bordure bleue claire */
  border-left: 12px solid #FFD666 ; /* Bordure gauche plus épaisse */
  border-radius: 8px; /* Coins légèrement arrondis */
  padding: 16px; /* Espace intérieur pour le contenu */
  margin: 10px 0; /* Marge pour séparation du contenu environnant */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12); /* Léger ombrage pour un effet de profondeur */
}
</style>
  
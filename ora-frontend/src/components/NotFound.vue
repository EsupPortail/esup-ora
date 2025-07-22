<template>
  <v-row class="fill-height">
    <v-col offset="3" cols="6">
      <div class="not-found-card">
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle">Page non trouvée</h2>
        <p class="not-found-message">
          La ressource demandée est introuvable.<br />
          Veuillez vérifier l'URL ou retourner à la page d'accueil.
        </p>
        <v-btn style="color: white" class="not-found-btn" @click="goHome" rounded>
          Retour à l'accueil
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ path: '/home' })
}
</script>

<style scoped>
.not-found-container {
  background: transparent;
  min-height: 100vh;
  padding: 0;
}
.not-found-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(180, 180, 180, 0.1);
  padding: 40px 28px 28px 28px;
  text-align: center;
  position: relative;
}
.not-found-title {
  font-size: 4rem;
  font-weight: bold;
  color: #b5b5b5;
  margin: 0;
  letter-spacing: 4px;
}
.not-found-subtitle {
  font-size: 1.5rem;
  color: #888;
  margin: 12px 0 18px 0;
  font-weight: 600;
}
.not-found-message {
  color: #666;
  font-size: 1rem;
  margin-bottom: 28px;
}
.not-found-btn {
  background: #b5ead7;
  color: #222 !important;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(180, 180, 180, 0.08);
  transition: background 0.2s;
}
.not-found-btn:hover {
  background: #ffdac1;
}
</style>

<template>
  <v-row class="fill-height">
    <v-col offset="3" cols="6">
      <div class="forbidden-card">
        <h1 class="forbidden-title">403</h1>
        <h2 class="forbidden-subtitle">Accès refusé</h2>
        <p class="forbidden-message">
          Vous n’avez pas les permissions nécessaires pour accéder à cette page.<br />
          Si vous pensez qu’il s’agit d’une erreur, contactez un administrateur.
        </p>
        <v-btn style="color: white" class="forbidden-btn" @click="goHome" rounded>
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
.forbidden-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(255, 150, 150, 0.1);
  padding: 40px 28px 28px 28px;
  text-align: center;
  position: relative;
}

.forbidden-title {
  font-size: 4rem;
  font-weight: bold;
  color: #f2a5a5; /* rouge pastel */
  margin: 0;
  letter-spacing: 4px;
}

.forbidden-subtitle {
  font-size: 1.5rem;
  color: #d97c7c;
  margin: 12px 0 18px 0;
  font-weight: 600;
}

.forbidden-message {
  color: #b86565;
  font-size: 1rem;
  margin-bottom: 28px;
}

.forbidden-btn {
  background: #f2a5a5; /* bouton rouge pastel */
  color: white !important;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(245, 150, 150, 0.15);
  transition: background 0.2s;
}

.forbidden-btn:hover {
  background: #ffb8b8; /* rouge plus doux au survol */
}
</style>

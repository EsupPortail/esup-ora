<template>
  <div class="charts-wrapper" style="display: flex; gap: 40px; flex-wrap: wrap;">
    
    <!-- 🎯 DONUT CHART FORMATIONS -->
    <div>
      <apexchart 
        type="donut"
        width="380"
        :options="formationChartOptions"
        :series="formationSeries"
      />
    </div>

    <!-- 📊 BAR CHART USERS BY ROLE -->
    <div>
      <apexchart 
        type="bar"
        height="380"
        :options="userRoleChartOptions"
        :series="userRoleSeries"
      />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useUserAccessStore } from '@/stores/usersAccessStore'
import { useFormationStore } from '@/stores/formationStore'

const userAccessStore = useUserAccessStore()
const formationStore = useFormationStore()

/* ============================================================
    🔹 1. DONUT CHART — FORMATIONS (En cours / Terminées)
   ============================================================ */

const formationSeries = ref([])

const formationChartOptions = ref({
  labels: ['Formations en cours', 'Formations finalisées'],

  legend: { position: 'bottom' },

  colors: [
    '#1E88E5', // jaune = en cours
    '#43A047'  // vert = terminées
  ],

  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Formations',
            fontSize: '18px',
            fontWeight: 600,
            color: '#333',
            formatter: () => formationStore.formations.length
          }
        }
      }
    }
  },

  chart: {
    animations: {
      enabled: true,
      easing: 'easeout',
      speed: 1400,
      animateGradually: { enabled: true, delay: 150 },
      dynamicAnimation: { enabled: true, speed: 350 }
    }
  }
})

/* ============================================================
    🔹 2. BAR CHART — UTILISATEURS PAR RÔLE
   ============================================================ */

const userRoleSeries = ref([])

const userRoleChartOptions = ref({
  chart: { toolbar: { show: false } },

  xaxis: { 
    categories: [
      'enseignant',
      'agent_scolarite',
      'administrateur_technique',
      'administrateur_fonctionnel',
      'ingenieur_pedagogique',
      'observateur'
    ]
  },

  plotOptions: {
    bar: {
      borderRadius: 6,
      horizontal: false,
      columnWidth: '55%'
    }
  },

  dataLabels: { enabled: false },

  colors: ['#1E88E5'] // bleu
})

/* ============================================================
    🔧 INIT — CHARGEMENT DES DONNÉES
   ============================================================ */

const initData = async () => {
  await userAccessStore.fetchUsers()
  await formationStore.fetchFormation()

  /* ------- DONUT CHART DATA -------- */
  const formations = formationStore.formations

  const nbInProgress = formations.filter(f => f.state === 'En cours').length
  const nbEnded = formations.filter(f => f.state === 'Terminée').length

  formationSeries.value = [nbInProgress, nbEnded]

  /* ------- BAR CHART DATA -------- */

  const roles = [
  { "role_name": "enseignant", "count": 0 },
  { "role_name": "agent_scolarite", "count": 0 },
  { "role_name": "administrateur_technique", "count": 0 },
  { "role_name": "administrateur_fonctionnel", "count": 0 },
  { "role_name": "ingenieur_pedagogique", "count": 0 },
  { "role_name": "observateur", "count": 0 }
]

    userAccessStore.users.forEach(user => {
  user.roles.forEach(roleObj => {
    const role = roles.find(r => r.role_name === roleObj.name)
    if (role) {
      role.count += 1
    }
  })
})


  userRoleSeries.value = [
    {
      name: 'Utilisateurs',
      data: roles.map(role => role.count)
    }
  ]
}

initData()
</script>

<style>
.charts-wrapper {
  margin-top: 20px;
}
</style>

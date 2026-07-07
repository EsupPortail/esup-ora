<template>
  <v-container fluid>

    <!-- ══════════════════════════════════════
         KPI CARDS
    ══════════════════════════════════════ -->
    <v-row dense class="mb-4">
      <v-col cols="6" md="3">
        <v-card flat border>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Total requêtes</div>
            <div class="text-h5 font-weight-medium">{{ kpis.total.toLocaleString() }}</div>
            <div class="text-caption text-medium-emphasis">7 derniers jours</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card flat border>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Taux de succès</div>
            <div class="text-h5 font-weight-medium text-success">{{ kpis.successRate }}%</div>
            <div class="text-caption text-medium-emphasis">2xx / total</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card flat border>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Erreurs serveur</div>
            <div class="text-h5 font-weight-medium text-error">{{ kpis.serverErrorRate }}%</div>
            <div class="text-caption text-medium-emphasis">5xx</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card flat border>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Accès refusés</div>
            <div class="text-h5 font-weight-medium text-warning">{{ kpis.authErrorRate }}%</div>
            <div class="text-caption text-medium-emphasis">401 / 403</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ══════════════════════════════════════
         CHARTS ROW
    ══════════════════════════════════════ -->
    <v-row dense class="mb-4">

      <!-- Donut codes retour -->
      <v-col cols="12" md="4">
        <v-card flat border height="100%">
          <v-card-title class="text-body-2 font-weight-medium pa-4 pb-0">
            Répartition des codes retour
          </v-card-title>
          <v-card-text>
            <apexchart
              type="donut"
              :options="statusDonutOptions"
              :series="statusDonutSeries"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Bar chart formations modifiées -->


      <!-- Timeseries -->
      <v-col cols="12" md="8">
        <v-card flat border>
          <v-card-title class="text-body-2 font-weight-medium pa-4 pb-0">
            Pics de modifications dans le temps
          </v-card-title>
          <v-card-text>
            <apexchart
              type="area"
              height="260"
              :options="timeseriesOptions"
              :series="timeseriesSeries"
            />
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <!-- ══════════════════════════════════════
         TABLEAU JOURNAUX D'ACTIVITÉ
    ══════════════════════════════════════ -->
    <v-card title="Journaux d'activité (Logs)" flat border>

      <template v-slot:text>
        <v-row dense class="mb-4">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              prepend-inner-icon="mdi-magnify"
              label="Rechercher (IP, Endpoint...)"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2">
            <v-autocomplete
              v-model="filters.user"
              :items="userList"
              label="Utilisateur"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Code Status"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-select>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-model="filters.startDate"
              label="Du (Date/Heure)"
              type="datetime-local"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-model="filters.endDate"
              label="Au (Date/Heure)"
              type="datetime-local"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="1" class="d-flex align-center">
            <v-btn
              icon="mdi-filter-off"
              variant="tonal"
              color="grey"
              size="small"
              @click="resetFilters"
              title="Réinitialiser les filtres"
            ></v-btn>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="filteredLogs"
        :loading="logStore.loading"
        hover
      >
        <template v-slot:item.createdAt="{ value }">
          {{ new Date(value).toLocaleString() }}
        </template>

        <template v-slot:item.method="{ value }">
          <v-chip :color="getMethodColor(value)" size="small" variant="flat" label class="font-weight-bold">
            {{ value }}
          </v-chip>
        </template>

        <template v-slot:item.statusCode="{ value }">
          <v-chip :color="getStatusColor(value)" size="small" variant="outlined">
            {{ value }}
          </v-chip>
        </template>

        <template v-slot:item.payload="{ item }">
          <v-btn
            icon="mdi-eye"
            size="x-small"
            variant="text"
            @click="showPayload(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- ══════════════════════════════════════
         DIALOG PAYLOAD
    ══════════════════════════════════════ -->
    <v-dialog v-model="dialog" width="600">
      <v-card v-if="selectedLog" :title="'Détails de l\'action : ' + selectedLog.action">
        <v-card-text>
          <div class="text-caption mb-2">Payload JSON :</div>
          <pre class="bg-grey-lighten-4 pa-4 rounded">{{ JSON.stringify(selectedLog.payload, null, 2) }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="dialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLogStore } from '@/stores/logStore'

const logStore = useLogStore()

/* ============================================================
   🔧 HELPERS
   ============================================================ */

const STATUS_LABELS = {
  200: 'Succès (200)',
  201: 'Créé (201)',
  204: 'Sans contenu (204)',
  400: 'Requête invalide (400)',
  401: 'Non autorisé (401)',
  403: 'Interdit (403)',
  404: 'Introuvable (404)',
  500: 'Erreur serveur (500)',
}

const STATUS_COLORS = {
  200: '#43A047',
  201: '#66BB6A',
  204: '#A5D6A7',
  400: '#FFA726',
  401: '#EF6C00',
  403: '#E64A19',
  404: '#8D6E63',
  500: '#E53935',
}

function groupByDate(logs) {
  return logs.reduce((acc, log) => {
    const day = new Date(log.createdAt).toISOString().slice(0, 10)
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})
}

function extractFormationName(log) {
  const match = log.endpoint?.match(/\/formations\/([^/]+)/)
  return match ? `Formation #${match[1]}` : (log.action ?? 'Inconnu')
}

/* ============================================================
   📊 KPIs
   ============================================================ */

const kpis = computed(() => {
  const logs = logStore.logs
  const total = logs.length
  if (!total) return { total: 0, successRate: 0, serverErrorRate: 0, authErrorRate: 0 }

  const success      = logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length
  const serverErrors = logs.filter(l => l.statusCode >= 500).length
  const authErrors   = logs.filter(l => l.statusCode === 401 || l.statusCode === 403).length

  return {
    total,
    successRate:     Math.round((success      / total) * 100),
    serverErrorRate: Math.round((serverErrors  / total) * 100),
    authErrorRate:   Math.round((authErrors    / total) * 100),
  }
})

/* ============================================================
   🍩 1. DONUT — Codes retour
   ============================================================ */

const statusDonutSeries = computed(() => {
  const counts = {}
  logStore.logs.forEach(log => {
    counts[log.statusCode] = (counts[log.statusCode] || 0) + 1
  })
  return Object.values(counts)
})

const statusDonutOptions = computed(() => {
  const counts = {}
  logStore.logs.forEach(log => {
    counts[log.statusCode] = (counts[log.statusCode] || 0) + 1
  })
  const codes = Object.keys(counts).map(Number)

  return {
    labels:  codes.map(c => STATUS_LABELS[c] || `Code ${c}`),
    colors:  codes.map(c => STATUS_COLORS[c] || '#90A4AE'),
    legend:  { position: 'bottom', fontSize: '12px' },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Requêtes',
              fontSize: '14px',
              fontWeight: 600,
              color: '#555',
              formatter: () => logStore.logs.length,
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: val => `${Math.round(val)}%`,
    },
    chart: { animations: { enabled: true, speed: 1000 } },
    tooltip: { y: { formatter: val => `${val} requête(s)` } },
  }
})

/* ============================================================
   📊 2. BAR CHART — Formations les plus modifiées
   ============================================================ */

const TOP_N = 8

const formationBarCategories = computed(() => {
  const modifLogs = logStore.logs.filter(l => l.method === 'PUT' || l.method === 'DELETE')
  const counts = {}
  modifLogs.forEach(log => {
    const name = extractFormationName(log)
    counts[name] = (counts[name] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N)
    .map(([name]) => name)
})

const formationBarSeries = computed(() => {
  const modifLogs = logStore.logs.filter(l => l.method === 'PUT' || l.method === 'DELETE')
  const putCounts = {}
  const deleteCounts = {}

  modifLogs.forEach(log => {
    const name = extractFormationName(log)
    if (log.method === 'PUT')    putCounts[name]    = (putCounts[name]    || 0) + 1
    else                         deleteCounts[name] = (deleteCounts[name] || 0) + 1
  })

  const categories = formationBarCategories.value

  return [
    { name: 'Mises à jour (PUT)',    data: categories.map(n => putCounts[n]    || 0) },
    { name: 'Suppressions (DELETE)', data: categories.map(n => deleteCounts[n] || 0) },
  ]
})

const formationBarOptions = computed(() => ({
  chart:   { toolbar: { show: false } },
  colors:  ['#1E88E5', '#E53935'],
  xaxis:   { categories: formationBarCategories.value },
  plotOptions: {
    bar: { borderRadius: 5, horizontal: true, barHeight: '60%' }
  },
  dataLabels: { enabled: false },
  legend:     { position: 'top', fontSize: '12px' },
  tooltip:    { y: { formatter: val => `${val} opération(s)` } },
}))

/* ============================================================
   📈 3. TIMESERIES — Pics de modifications
   ============================================================ */

const timeseriesSeries = computed(() => {
  const putLogs    = logStore.logs.filter(l => l.method === 'PUT')
  const deleteLogs = logStore.logs.filter(l => l.method === 'DELETE')

  const putByDay    = groupByDate(putLogs)
  const deleteByDay = groupByDate(deleteLogs)

  const allDates = [...new Set([
    ...Object.keys(putByDay),
    ...Object.keys(deleteByDay)
  ])].sort()

  return [
    { name: 'Mises à jour (PUT)',    data: allDates.map(d => ({ x: d, y: putByDay[d]    || 0 })) },
    { name: 'Suppressions (DELETE)', data: allDates.map(d => ({ x: d, y: deleteByDay[d] || 0 })) },
  ]
})

const timeseriesOptions = ref({
  chart:  { toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#1E88E5', '#E53935'],
  stroke: { curve: 'smooth', width: 2, dashArray: [0, 4] },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] }
  },
  xaxis: {
    type: 'datetime',
    labels: { datetimeUTC: false, format: 'dd/MM' },
  },
  yaxis:       { labels: { formatter: val => Math.round(val) } },
  legend:      { position: 'top', fontSize: '12px' },
  tooltip:     { x: { format: 'dd/MM/yyyy' }, y: { formatter: val => `${val} opération(s)` } },
  dataLabels:  { enabled: false },
  markers:     { size: 3 },
})

/* ============================================================
   📋 TABLEAU — Filtres
   ============================================================ */

const dialog     = ref(false)
const selectedLog = ref(null)

const filters = ref({
  search:    '',
  user:      null,
  status:    null,
  startDate: '',
  endDate:   '',
})

const statusOptions = [200, 201, 204, 400, 401, 403, 404, 500]

const headers = [
  { title: 'Date',        key: 'createdAt',  sortable: true  },
  { title: 'Utilisateur', key: 'userEmail'                   },
  { title: 'Action',      key: 'action'                      },
  { title: 'Méthode',     key: 'method'                      },
  { title: 'Endpoint',    key: 'endpoint'                    },
  { title: 'Status',      key: 'statusCode'                  },
  { title: 'IP',          key: 'ipAddress'                   },
  { title: 'Data',        key: 'payload',    sortable: false  },
]

const userList = computed(() => {
  const users = logStore.logs.map(log => log.userEmail).filter(Boolean)
  return [...new Set(users)].sort()
})

const filteredLogs = computed(() => {
  return logStore.logs.filter(log => {
    const searchLow = filters.value.search?.toLowerCase() || ''
    const matchSearch = !searchLow ||
      log.endpoint?.toLowerCase().includes(searchLow) ||
      log.ipAddress?.includes(searchLow) ||
      log.action?.toLowerCase().includes(searchLow)

    const matchUser   = !filters.value.user   || log.userEmail  === filters.value.user
    const matchStatus = !filters.value.status || log.statusCode === filters.value.status

    const logDate = new Date(log.createdAt).getTime()
    const start   = filters.value.startDate ? new Date(filters.value.startDate).getTime() : null
    const end     = filters.value.endDate   ? new Date(filters.value.endDate).getTime()   : null

    return matchSearch && matchUser && matchStatus &&
           (!start || logDate >= start) &&
           (!end   || logDate <= end)
  })
})

const resetFilters = () => {
  filters.value = { search: '', user: null, status: null, startDate: '', endDate: '' }
}

const showPayload = (item) => {
  selectedLog.value = item
  dialog.value = true
}

const getMethodColor = (method) => {
  const colors = { POST: 'success', PUT: 'warning', DELETE: 'error', GET: 'info' }
  return colors[method] || 'grey'
}

const getStatusColor = (code) => {
  if (code >= 200 && code < 300) return 'success'
  if (code >= 400 && code < 500) return 'orange'
  if (code >= 500) return 'red'
  return 'grey'
}

/* ============================================================
   🔄 INIT
   ============================================================ */

onMounted(async () => {
  await logStore.fetchLogs()
})
</script>

<style scoped>
pre {
  font-size: 0.8rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

input[type="datetime-local"] {
  min-height: 20px;
}
</style>
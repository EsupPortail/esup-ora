<template>
  <v-container fluid class="pa-6">

    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center gap-3">
        <h1 class="text-h5 font-weight-medium">Clients API</h1>
        <v-chip size="small" variant="tonal" color="grey">
          {{ clients.length }} client{{ clients.length > 1 ? 's' : '' }}
        </v-chip>
      </div>
      <v-btn prepend-icon="mdi-plus" color="success" variant="outlined" @click="openAddModal">
        Ajouter un client
      </v-btn>
    </div>

    <v-card variant="outlined" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="clients"
        :items-per-page="10"
        :loading="loading"
        no-data-text="Aucun client API enregistré"
        loading-text="Chargement des clients..."
      >
        <template #item.clientId="{ item }">
          <code class="text-caption">
            <span class="text-medium-emphasis">distant-access-ora-</span>{{ item.suffix }}
          </code>
        </template>

        <template #item.routes="{ item }">
          <div class="d-flex flex-wrap gap-1 py-1">
            <template v-if="clientEndpointStore.byClientId(item.clientId).length">
              <v-chip
                v-for="link in clientEndpointStore.byClientId(item.clientId)"
                :key="link.id"
                size="x-small"
                variant="tonal"
                :color="link.read_only ? 'info' : 'warning'"
              >
                {{ link.endpoint }}
                <v-tooltip activator="parent" location="top">
                  {{ link.read_only ? 'Lecture seule' : 'Lecture + Écriture' }}
                </v-tooltip>
                <template #append>
                  <span class="ml-1 font-weight-bold" style="font-size: 9px; opacity: .8;">
                    {{ link.read_only ? 'r' : 'rw' }}
                  </span>
                </template>
              </v-chip>
            </template>
            <span v-else class="text-caption text-medium-emphasis">—</span>
          </div>
        </template>

        <template #item.active="{ item }">
          <v-chip
            :color="item.active ? 'success' : 'default'"
            size="small"
            variant="tonal"
            :prepend-icon="item.active ? 'mdi-check-circle-outline' : 'mdi-minus-circle-outline'"
          >
            {{ item.active ? 'Actif' : 'Inactif' }}
          </v-chip>
        </template>

        <template #item.createdAt="{ item }">
          <span class="text-caption text-medium-emphasis">
            {{ formatDate(item.createdAt) }}
          </span>
        </template>

        <template #item.actions="{ item, index }">
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            size="small"
            color="error"
            @click="confirmDelete(index)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Modal ajout client -->
    <v-dialog v-model="showModal" max-width="520" @click:outside="closeModal">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-6 text-h6 font-weight-medium">
          Nouveau client API
        </v-card-title>

        <v-card-text class="px-6 pb-2">

          <v-label class="text-caption font-weight-medium mb-1 d-block">
            Nom du client
          </v-label>
          <v-text-field
            v-model="form.name"
            variant="outlined"
            density="compact"
            placeholder="mon-service"
            :error-messages="nameError"
            hide-details="auto"
          >
            <template #prepend-inner>
              <span class="text-caption text-medium-emphasis" style="white-space: nowrap;">
                distant-access-ora-
              </span>
            </template>
          </v-text-field>

          <v-label class="text-caption font-weight-medium mt-5 mb-2 d-block">
            Accès aux routes
          </v-label>

          <div v-if="loadingRoutes" class="d-flex align-center gap-2 py-3">
            <v-progress-circular indeterminate size="16" width="2" color="primary" />
            <span class="text-caption text-medium-emphasis">Chargement des routes…</span>
          </div>

          <div v-else-if="availableRoutes.length === 0" class="text-caption text-medium-emphasis py-2">
            Aucune route disponible.
          </div>

          <template v-else>
            <v-card
              v-for="route in availableRoutes"
              :key="route"
              variant="outlined"
              rounded="lg"
              class="mb-2"
              :color="form.routePerms[route]?.enabled ? 'primary' : undefined"
            >
              <v-list-item :subtitle="route" class="py-2">
                <template #prepend>
                  <v-checkbox-btn
                    :model-value="form.routePerms[route]?.enabled"
                    color="primary"
                    @update:model-value="toggleRoute(route, $event)"
                  />
                </template>

                <template #append>
                  <div v-if="form.routePerms[route]?.enabled" class="d-flex align-center gap-4 pr-1">
                    <div class="d-flex align-center gap-1">
                      <v-checkbox-btn
                        :model-value="form.routePerms[route]?.read"
                        color="info"
                        density="compact"
                        @update:model-value="form.routePerms[route].read = $event"
                      />
                      <span class="text-caption">Lecture</span>
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-checkbox-btn
                        :model-value="form.routePerms[route]?.write"
                        color="warning"
                        density="compact"
                        @update:model-value="form.routePerms[route].write = $event"
                      />
                      <span class="text-caption">Écriture</span>
                    </div>
                  </div>
                  <span v-else class="text-caption text-disabled pr-2">Désactivée</span>
                </template>
              </v-list-item>
            </v-card>

            <v-alert
              v-if="routeError"
              type="error"
              density="compact"
              variant="tonal"
              class="mt-2 text-caption"
            >
              {{ routeError }}
            </v-alert>
          </template>

        </v-card-text>

        <v-card-actions class="px-6 pb-5 pt-4">
          <v-spacer />
          <v-btn variant="text" @click="closeModal">Annuler</v-btn>
          <v-btn
            variant="flat"
            color="primary"
            :loading="loadingAdd"
            @click="addClient"
          >
            Créer le client
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog secret — affiché une seule fois après création -->
    <v-dialog v-model="showSecretDialog" max-width="480" persistent>
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-6 text-h6 font-weight-medium d-flex align-center gap-2">
          <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
          Client créé avec succès
        </v-card-title>

        <v-card-text class="px-6 pb-2">
          <v-alert type="warning" variant="tonal" density="compact" class="mb-4 text-caption">
            Ce secret ne sera affiché qu'une seule fois. Copiez-le maintenant avant de fermer.
          </v-alert>

          <v-label class="text-caption font-weight-medium mb-1 d-block">Client ID</v-label>
          <code class="text-caption d-block mb-4 text-medium-emphasis">{{ createdClientId }}</code>

          <v-label class="text-caption font-weight-medium mb-1 d-block">Secret</v-label>
          <div class="d-flex align-center gap-2">
            <v-text-field
              :model-value="createdSecret"
              :type="showSecret ? 'text' : 'password'"
              variant="outlined"
              density="compact"
              readonly
              hide-details
              class="flex-grow-1"
            >
              <template #append-inner>
                <v-icon
                  :icon="showSecret ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  size="18"
                  style="cursor: pointer"
                  @click="showSecret = !showSecret"
                />
              </template>
            </v-text-field>
            <v-btn
              :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
              :color="copied ? 'success' : 'default'"
              variant="tonal"
              size="small"
              @click="copySecret"
            />
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-5 pt-4">
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="closeSecretDialog">
            J'ai copié le secret
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog confirmation suppression -->
    <v-dialog v-model="showDeleteDialog" max-width="360">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-6 text-h6 font-weight-medium">
          Supprimer le client ?
        </v-card-title>
        <v-card-text class="px-6 text-body-2 text-medium-emphasis">
          Le client
          <code>distant-access-ora-{{ clients[pendingDeleteIndex]?.suffix }}</code>
          sera supprimé définitivement de Keycloak ainsi que tous ses accès aux routes.
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false">Annuler</v-btn>
          <v-btn variant="flat" color="error" :loading="loadingDelete" @click="deleteClient">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { config } from '@/environment/environment'
import { useConnectionStore } from '@/stores/connectionStore'
import { useClientEndpointStore } from '@/stores/accessEndpointsStore.ts'

const connectionStore     = useConnectionStore()
const clientEndpointStore = useClientEndpointStore()

const headers = [
  { title: 'Client ID', key: 'clientId',  sortable: true  },
  { title: 'Routes',    key: 'routes',     sortable: false },
  { title: 'Statut',    key: 'active',     sortable: false },
  { title: 'Créé le',  key: 'createdAt',  sortable: true  },
  { title: '',          key: 'actions',    sortable: false, align: 'end' },
]

const clients            = ref([])
const loading            = ref(false)
const loadingAdd         = ref(false)
const loadingDelete      = ref(false)
const loadingRoutes      = ref(false)
const showModal          = ref(false)
const showDeleteDialog   = ref(false)
const showSecretDialog   = ref(false)
const showSecret         = ref(false)
const copied             = ref(false)
const createdClientId    = ref('')
const createdSecret      = ref('')
const pendingDeleteIndex = ref(null)
const nameError          = ref('')
const routeError         = ref('')
const availableRoutes    = ref([])
const snackbar           = ref({ show: false, message: '', color: 'success' })
const form               = ref({ name: '', routePerms: {} })

const getApiHeaders = () => ({
  Authorization: `Bearer ${connectionStore.token?.access_token}`,
  'X-Active-Role': connectionStore.selectedRole,
})

function notify(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}

function mapClient(raw) {
  return {
    id:        raw.id,
    clientId:  raw.clientId,
    suffix:    raw.clientId.replace('distant-access-ora-', ''),
    name:      raw.name,
    active:    raw.enabled ?? true,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  }
}

function initRoutePerms(routes) {
  const perms = {}
  routes.forEach(r => { perms[r] = { enabled: false, read: true, write: false } })
  return perms
}

function toggleRoute(route, value) {
  form.value.routePerms[route].enabled = value
  if (value) form.value.routePerms[route].read = true
}

async function copySecret() {
  await navigator.clipboard.writeText(createdSecret.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function closeSecretDialog() {
  showSecretDialog.value = false
  createdSecret.value    = ''
  createdClientId.value  = ''
  showSecret.value       = false
  copied.value           = false
}

async function fetchClients() {
  loading.value = true
  try {
    const { data } = await axios.get(
      `${config.backend.url}/admin/clients`,
      { headers: getApiHeaders() }
    )
    clients.value = data.data.clients.map(mapClient)
  } catch {
    notify('Impossible de charger les clients.', 'error')
  } finally {
    loading.value = false
  }
}

async function fetchOpenEndpoints() {
  loadingRoutes.value = true
  try {
    const { data } = await axios.get(
      `${config.backend.url}/admin/open-endpoints`,
      { headers: getApiHeaders() }
    )
    availableRoutes.value = data.routes ?? []
    form.value.routePerms = initRoutePerms(availableRoutes.value)
  } catch {
    notify('Impossible de charger les routes.', 'error')
  } finally {
    loadingRoutes.value = false
  }
}

async function openAddModal() {
  showModal.value = true
  await fetchOpenEndpoints()
}

function closeModal() {
  showModal.value  = false
  nameError.value  = ''
  routeError.value = ''
  form.value       = { name: '', routePerms: {} }
}

async function addClient() {
  nameError.value  = ''
  routeError.value = ''

  const suffix = form.value.name.trim().replace(/\s+/g, '-').toLowerCase()
  if (!suffix) { nameError.value = 'Le nom est requis.'; return }

  const clientId = `distant-access-ora-${suffix}`
  if (clients.value.find(c => c.clientId === clientId)) {
    nameError.value = 'Ce client existe déjà.'
    return
  }

  const routeAccess = Object.entries(form.value.routePerms)
    .filter(([, perm]) => perm.enabled && (perm.read || perm.write))
    .map(([endpoint, perm]) => ({ endpoint, read_only: !perm.write }))

  if (routeAccess.length === 0) {
    routeError.value = 'Veuillez sélectionner au moins une route avec une permission.'
    return
  }

  loadingAdd.value = true
  try {
    const { data } = await axios.post(
      `${config.backend.url}/admin/addClient`,
      { clientName: suffix, routes: routeAccess },
      { headers: getApiHeaders() }
    )

    await Promise.all(
      routeAccess.map(r => clientEndpointStore.createLink({ client_id: clientId, ...r }))
    )

    await fetchClients()
    closeModal()

    // Affichage unique du secret
    createdClientId.value = data.data.clientId
    createdSecret.value   = data.data.secret
    showSecretDialog.value = true
  } catch {
    notify('Erreur lors de la création du client.', 'error')
  } finally {
    loadingAdd.value = false
  }
}

function confirmDelete(index) {
  pendingDeleteIndex.value = index
  showDeleteDialog.value   = true
}

async function deleteClient() {
  const client = clients.value[pendingDeleteIndex.value]
  loadingDelete.value = true
  try {
    await axios.delete(
      `${config.backend.url}/admin/delete-client`,
      { headers: getApiHeaders(), data: { clientId: client.clientId } }
    )
    clientEndpointStore.deleteByClientId(client.clientId)
    clients.value.splice(pendingDeleteIndex.value, 1)
    notify('Client supprimé.')
  } catch {
    notify('Erreur lors de la suppression.', 'error')
  } finally {
    loadingDelete.value      = false
    showDeleteDialog.value   = false
    pendingDeleteIndex.value = null
  }
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

onMounted(async () => {
  await Promise.all([
    fetchClients(),
    clientEndpointStore.fetchLinks(),
  ])
})
</script>
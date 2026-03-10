<template>
  <div>
    <v-row>
      <v-col offset="8" cols="4" class="text-right">
          <v-icon start icon="mdi-account-shield"></v-icon>
          Vous aggissez en tant que : <b>{{ connectionStore.selectedRole?.displayName || 'Aucun rôle' }}</b>
      </v-col>
    </v-row>

    <h3>Liste des rôles disponibles :</h3>
    <v-row>
      <v-col cols="6">
        <v-list density="compact">
          <v-list-item><b>Observateur</b> : lecture seule</v-list-item>
          <v-list-item><b>Enseignant</b> : gestion de ses formations</v-list-item>
          <v-list-item><b>Agent de scolarité</b> : gestion rattachements</v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
        <v-list density="compact">
          <v-list-item><b>Ingénieur pédago.</b> : gestion composante</v-list-item>
          <v-list-item><b>Admin fonctionnel</b> : gestion globale application</v-list-item>
          <v-list-item><b>Admin technique</b> : gestion technique</v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>

  <div style="margin-top: 20px">
    <v-text-field
      v-model="search"
      label="Rechercher un utilisateur"
      prepend-icon="mdi-magnify"
      class="mb-4"
      clearable
      variant="outlined"
      density="compact"
    />

    <v-data-table
      :items="dataTable"
      :headers="headers"
      :search="search"
      :sort-by="[{ key: 'email', order: 'asc' }]"
      :custom-filter="filterUsers"
      item-value="username"
      class="elevation-1"
    >
      <template #item.role="{ item }">
        <div v-if="editingRoleId !== item.id" class="d-flex align-center">
          <v-chip-group>
            <v-chip v-for="r in item.roles" :key="r" size="small" variant="outlined">
              {{ r }}
            </v-chip>
          </v-chip-group>
          
          <v-icon
            v-if="canEditUser(item)"
            size="18"
            class="ml-2 cursor-pointer"
            @click="startEditRole(item)"
          >
            mdi-pencil
          </v-icon>
        </div>

        <div v-else style="min-width: 260px; padding: 10px">
          <v-row dense>
            <v-col v-for="role in filteredRolesForEditing" :key="role.id" cols="6" class="pa-0">
              <v-checkbox
                v-model="editedRoles"
                :label="role.displayName"
                :value="role"
                :disabled="isRoleDisabled(role)"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
          <v-btn
            size="small"
            color="success"
            block
            class="mt-2"
            :disabled="!isRoleSelectionValid"
            @click="saveRoles(item.id)"
          >
            Valider
          </v-btn>
          <v-btn size="small" variant="text" block @click="editingRoleId = null">Annuler</v-btn>
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="connectionStore.selectedRole === 'administrateur_technique' && !item.fromShibboleth"
          icon="mdi-delete"
          variant="text"
          color="error"
          density="comfortable"
          @click="openDeleteConfirm(item)"
        >
          <v-icon size="20">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">Supprimer compte local</v-tooltip>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isDeleteDialogOpen" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-trash-can"
        :text="`Voulez-vous supprimer définitivement l'utilisateur ${userToDelete?.fullName} ?`"
        title="Confirmation"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn text="Annuler" color="info" @click="isDeleteDialogOpen = false" />
          <v-btn
            color="error"
            variant="elevated"
            text="Supprimer"
            :loading="isDeleting"
            @click="confirmDeleteUser"
          />
        </template>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="!isAddingLocalUser && canAddUser"
      color="primary"
      class="mt-4"
      @click="isAddingLocalUser = true"
    >
      Ajouter un compte local
    </v-btn>

    <addUserForm v-if="isAddingLocalUser" class="mt-4" @refreshList="refreshUserList" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { config } from '@/environment/environment'
import { useConnectionStore } from '@/stores/connectionStore'
import { useUserAccessStore } from '@/stores/usersAccessStore'
import AddUserForm from '@/views/Backoffice/views/users-access/AddUserForm.vue'

const connectionStore = useConnectionStore()
const userAccessStore = useUserAccessStore()

const isAddingLocalUser = ref(false)
const dataTable = ref([])
const search = ref('')
const editingRoleId = ref(null)
const editedRoles = ref([])

const isDeleteDialogOpen = ref(false)
const userToDelete = ref(null)
const isDeleting = ref(false)

const headers = ref([
  { title: "Nom d'utilisateur", key: 'username', sortable: true },
  { title: 'Nom usuel', key: 'fullName', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Fédération', key: 'fromShibboleth', sortable: true },
  { title: 'Rôle(s)', key: 'role', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
])

const rolesAvailable = ref([
  { id: null, weight: 1, name: 'enseignant', displayName: 'Enseignant' },
  { id: null, weight: 2, name: 'ingenieur_pedagogique', displayName: 'Ingénieur pédagogique' },
  { id: null, weight: 3, name: 'agent_scolarite', displayName: 'Agent de scolarité' },
  { id: null, weight: 4, name: 'observateur', displayName: 'Observateur' },
  { id: null, weight: 5, name: 'administrateur_fonctionnel', displayName: 'Administrateur fonctionnel' },
  { id: null, weight: 6, name: 'administrateur_technique', displayName: 'Administrateur technique' }
])

// --- COMPUTED ---

const canAddUser = computed(() => {
  // On récupère le nom technique (slug) du rôle
  const roleName = typeof connectionStore.selectedRole === 'object' 
    ? connectionStore.selectedRole?.name 
    : connectionStore.selectedRole;

  return roleName === 'administrateur_fonctionnel' || roleName === 'administrateur_technique'
})

const maxAssignableWeight = computed(() => {
  // Même logique ici pour extraire le nom
  const roleName = typeof connectionStore.selectedRole === 'object' 
    ? connectionStore.selectedRole?.name 
    : connectionStore.selectedRole;

  if (!roleName) return 0
  
  const myRoleData = rolesAvailable.value.find(r => r.name === roleName)
  if (!myRoleData) return 0

  if (roleName === 'administrateur_technique') return 100
  if (roleName === 'administrateur_fonctionnel') return 5 
  
  return myRoleData.weight - 1
})

const filteredRolesForEditing = computed(() => {
  return rolesAvailable.value.filter((r) => r.weight <= maxAssignableWeight.value)
})

const isRoleSelectionValid = computed(() => {
  if (editedRoles.value.length === 0) return false
  // On limite à 2 rôles max, dont un doit être observateur si cumul
  if (editedRoles.value.length > 2) return false
  const nonObserverRoles = editedRoles.value.filter((r) => r.name !== 'observateur')
  return nonObserverRoles.length <= 1
})

// --- METHODS ---

// Helper pour injecter les headers requis par ton nouveau backend Prisma v7
const getApiHeaders = () => ({
  Authorization: `Bearer ${connectionStore.token?.access_token}`,
  'X-Active-Role': connectionStore.selectedRole
})

const canEditUser = (item) => {
  // On ne peut éditer que si le poids max du rôle de l'utilisateur est inférieur à notre capacité d'assignation
  return item.roleWeight <= maxAssignableWeight.value
}

const filterUsers = (value, query, item) => {
  if (!query) return true
  const s = query.toLowerCase()
  const user = item.raw
  return (
    user.username?.toLowerCase().includes(s) ||
    user.fullName?.toLowerCase().includes(s) ||
    user.email?.toLowerCase().includes(s)
  )
}

const openDeleteConfirm = (item) => {
  userToDelete.value = item
  isDeleteDialogOpen.value = true
}

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return
  isDeleting.value = true
  try {
    await axios.post(
      `${config.backend.url}/admin/delete-user`,
      { 'user-id': userToDelete.value.id },
      { headers: getApiHeaders() }
    )
    dataTable.value = dataTable.value.filter((u) => u.id !== userToDelete.value.id)
    isDeleteDialogOpen.value = false
  } catch (error) {
    console.error('Erreur suppression :', error)
  } finally {
    isDeleting.value = false
  }
}

const startEditRole = (item) => {
  editingRoleId.value = item.id
  editedRoles.value = rolesAvailable.value.filter((role) => item.roleIds.includes(role.id))
}

const isRoleDisabled = (role) => {
  if (editedRoles.value.includes(role)) return false
  if (editedRoles.value.length >= 2) return true
  const hasNonObserver = editedRoles.value.some((r) => r.name !== 'observateur')
  if (hasNonObserver && role.name !== 'observateur') return true
  return false
}

const saveRoles = async (userId) => {
  const user = dataTable.value.find((u) => u.id === userId)
  if (!user) return
  
  const currentRoleIds = user.roleIds || []
  const newRoleIds = editedRoles.value.map((r) => r.id)
  
  const toAdd = newRoleIds.filter((id) => !currentRoleIds.includes(id))
  const toRemove = currentRoleIds.filter((id) => !newRoleIds.includes(id))

  try {
    for (const roleId of toAdd) {
       await axios.post(`${config.backend.url}/admin/addRole`, { userId, roleId }, { headers: getApiHeaders() })
    }
    for (const roleId of toRemove) {
       await axios.post(`${config.backend.url}/admin/removeRole`, { userId, roleId }, { headers: getApiHeaders() })
    }
    await refreshUserList()
    editingRoleId.value = null
  } catch (e) {
    console.error("Erreur lors de la mise à jour des rôles", e)
  }
}

const refreshUserList = async () => {
  await initData()
  isAddingLocalUser.value = false
}

const initData = async () => {
  try {
    await userAccessStore.fetchUsers()
    await userAccessStore.fetchRoles()
    
    const roleOptions = userAccessStore.roles || []

    // Synchronisation des IDs de la BDD avec notre config locale
    rolesAvailable.value = rolesAvailable.value.map((role) => {
      const match = roleOptions.find((r) => r.name === role.name)
      return { ...role, id: match ? match.id : null }
    })

    dataTable.value = userAccessStore.users.map((u) => {
      const highestRole = u.roles.reduce((max, r) => {
        const match = rolesAvailable.value.find((ar) => ar.name === r.name)
        return match && match.weight > max.weight ? match : max
      }, { weight: 0 })

      return {
        id: u.id,
        username: u.username,
        fullName: `${u.firstName} ${u.lastName}`,
        email: u.email,
        fromShibboleth: u.fromShibboleth,
        roles: u.roles.map(r => r.displayName),
        roleIds: u.roles.map(r => r.id),
        roleWeight: highestRole.weight
      }
    })
  } catch (err) {
    console.error("Erreur initData", err)
  }
}

onMounted(() => {
  initData()
})
</script>
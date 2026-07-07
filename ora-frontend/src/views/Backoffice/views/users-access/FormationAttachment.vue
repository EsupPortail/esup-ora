<template>
  <div style="margin-top: 20px">
    <v-text-field
      v-model="search"
      label="Rechercher une formation"
      prepend-icon="mdi-magnify"
      class="mb-4"
      clearable
      variant="outlined"
      density="compact"
    />

    <v-data-table
      :items="filteredFormations"
      :headers="headers"
      item-value="id"
      item-key="id"
      class="elevation-1"
      show-expand
      :expanded="expanded"
      @update:expanded="(val) => (expanded = val)"
    >
      <template #item.name="{ item }">
        <div class="d-flex align-center">
          <span>{{ item.name }}</span>
        </div>
      </template>

      <template #item.usersAttached="{ item }">
        <span>{{ item.users?.length || 0 }} utilisateur(s)</span>
      </template>

      <template #item.action="{ item }">
        <v-icon
          size="20"
          class="cursor-pointer"
          @click="toggleExpand(item)"
          title="Afficher utilisateurs"
        >
          mdi-account-multiple-plus
        </v-icon>
      </template>

      <template #expanded-row="{ item }">
        <v-card elevation="10" style="margin-top: 24px; padding: 16px; margin-left: 24px">
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-h6">Rattachement d'utilisateurs à la formation '{{ item.name }}'</h3>
          </div>
          <v-text-field
            v-model="searchUser"
            label="Rechercher un utilisateur pour le rattachement"
            prepend-icon="mdi-magnify"
            class="mb-4"
            clearable
            variant="outlined"
            density="compact"
          />

          <v-data-table
            :items="filteredUsers"
            :headers="userHeaders"
            density="compact"
            hide-default-footer
          >
            <template #item.attach="{ item: user }">
              <div class="d-flex justify-center">
                <v-checkbox
                  density="compact"
                  :model-value="isAttached(item.id, user.id)"
                  @update:model-value="(val) => onToggleAttach(item.id, user.id, val)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { useConnectionStore } from '@/stores/connectionStore'
import { useFormationStore } from '@/stores/formationStore'
import { useComposanteStore } from '@/stores/composanteStore'
import { useUserAccessStore } from '@/stores/usersAccessStore'

const connectionStore = useConnectionStore()
const formationStore = useFormationStore()
const composanteStore = useComposanteStore()
const userAccessStore = useUserAccessStore()

const headers = ref([
  { title: 'Nom de la formation', key: 'name', sortable: true },
  { title: 'Créateur', key: 'owner', sortable: true },
  { title: 'Utilisateurs rattachés', key: 'usersAttached', sortable: false },
  { title: 'Action', key: 'action', sortable: false }
])

const userHeaders = ref([
  { title: 'Prénom', key: 'firstName', sortable: true },
  { title: 'Nom', key: 'lastName', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Est rattaché à la formation', key: 'attach', sortable: false, align: 'center' }
])

const expanded = ref([])
const search = ref('')
const searchUser = ref('')
const dataTable = ref([])
const isUserAttached = ref({})

// Filtre le tableau principal sur nom de formation OU nom/prénom/email des utilisateurs rattachés
const filteredFormations = computed(() => {
  if (!search.value) return dataTable.value
  const s = search.value.toLowerCase()

  return dataTable.value.filter((f) => {
    if (f.name.toLowerCase().includes(s)) return true
    if (String(f.owner || '').toLowerCase().includes(s)) return true

    return f.users.some(
      (u) =>
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
    )
  })
})

// Filtre la liste des utilisateurs dans le panneau d'expansion
const filteredUsers = computed(() => {
  if (!searchUser.value) return userAccessStore.users
  const s = searchUser.value.toLowerCase()

  return (userAccessStore.users || []).filter(
    (u) =>
      String(u.firstName || '').toLowerCase().includes(s) ||
      String(u.lastName || '').toLowerCase().includes(s) ||
      String(u.email || '').toLowerCase().includes(s)
  )
})

const toggleExpand = (item) => {
  const i = expanded.value.indexOf(item.id)
  if (i === -1) expanded.value.push(item.id)
  else expanded.value.splice(i, 1)
}

const isAttached = (formationId, userId) => {
  const formation = formationStore.formations.find((f) => f.id === formationId)
  if (!formation || !Array.isArray(formation.utilisateurs_rattaches)) return false
  return formation.utilisateurs_rattaches.includes(String(userId))
}

const onToggleAttach = (formationId, userId, val) => {
  const formation = formationStore.formations.find((f) => f.id === formationId)
  if (!formation) return

  if (!Array.isArray(formation.utilisateurs_rattaches)) {
    formation.utilisateurs_rattaches = []
  }

  const idAsString = String(userId)

  if (val) {
    if (!formation.utilisateurs_rattaches.includes(idAsString)) {
      formation.utilisateurs_rattaches.push(idAsString)
    }
  } else {
    formation.utilisateurs_rattaches = formation.utilisateurs_rattaches.filter(
      (id) => id !== idAsString
    )
  }

  saveAllAttachments(formationId)
}

const saveAllAttachments = async (formationId) => {
  const formation = formationStore.formations.find((f) => f.id === formationId)
  if (!formation) return

  await formationStore.updateUserAttachment(formation)
}

const initData = async () => {
  try {
    await formationStore.fetchFormation()
    await userAccessStore.fetchUsers()
    await composanteStore.fetchComposantes()
    await userAccessStore.fetchRoles()
  } catch (e) {
    console.error('Erreur fetch stores', e)
  }

  const role = connectionStore.selectedRole?.name || null
  const me = userAccessStore.users.find((u) => u.username === connectionStore.user.eppn)
  const myComposanteIds = composanteStore.composantes
    .filter((c) => c.utilisateurs_rattaches?.includes(me.id))
    .map((c) => c.id)

  dataTable.value = (formationStore.formations || [])
    .filter((f) => {
      if (
        role === 'administrateur_technique' ||
        role === 'administrateur_fonctionnel' ||
        role === 'observateur'
      )
        return true

      if (me.id === f.owner_user_id) return true

      if (
        (role === 'agent_scolarite' ||
          role === 'ingenieur_pedagogique' ||
          role === 'directeur_composante') &&
        myComposanteIds.length > 0 &&
        myComposanteIds.includes(f.composante_id)
      )
        return true

      return f.utilisateurs_rattaches?.includes(me.id)
    })
    .map((f) => {
      const attachedUsers = f.utilisateurs_rattaches || []

      const users = attachedUsers
        .map((userId) => (userAccessStore.users || []).find((u) => u.id === userId))
        .filter(Boolean)
        .map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email
        }))

      const ownerUser = (userAccessStore.users || []).find((u) => u.id === f.owner_user_id)
      const owner = ownerUser ? ownerUser.username : 'Erreur utilisateur inconnu'

      return {
        id: f.id,
        owner,
        name: f.libelle,
        users
      }
    })

  // Init isUserAttached
  dataTable.value.forEach((f) => {
    isUserAttached.value[f.id] = {}
    ;(userAccessStore.users || []).forEach((user) => {
      isUserAttached.value[f.id][user.id] = !!f.users.some((u) => u.id === user.id)
    })
  })
}

initData()
</script>
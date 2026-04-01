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
      :items="dataTable"
      :headers="headers"
      :search="search"
      :custom-filter="filterUsers"
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
            <h3 class="text-h6">Rattachement d'utilisateurs à la formation '{{ item.name }}''</h3>
          </div>
          <v-text-field
            v-model="search"
            label="Rechercher un utilisateur pour le rattachement"
            prepend-icon="mdi-magnify"
            class="mb-4"
            clearable
            variant="outlined"
            density="compact"
          />

          <v-data-table
            :items="userAccessStore.users"
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
const panels = ref([])

const filteredComposantes = computed(() => {
  if (!search.value) return dataTable.value
  const s = search.value.toLowerCase()

  return dataTable.value.filter((comp) => {
    if (comp.name.toLowerCase().includes(s)) return true

    return comp.users.some(
      (u) =>
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
    )
  })
})

const filterUsers = (_value, searchText, item) => {
  if (!searchText) return true
  const s = searchText.toLowerCase()

  if (
    String(item.name || '')
      .toLowerCase()
      .includes(s)
  )
    return true

  if (Array.isArray(item.users)) {
    for (const u of item.users) {
      if (
        String(u.firstName || '')
          .toLowerCase()
          .includes(s) ||
        String(u.lastName || '')
          .toLowerCase()
          .includes(s) ||
        String(u.email || '')
          .toLowerCase()
          .includes(s)
      ) {
        return true
      }
    }
  }
  return false
}

const toggleExpand = (item) => {
  const i = expanded.value.indexOf(item.id)
  if (i === -1) expanded.value.push(item.id)
  else expanded.value.splice(i, 1)
}

const isAttached = (formationId, userId) => {
  const formation = formationStore.formations.find(f => f.id === formationId)
  if (!formation || !Array.isArray(formation.utilisateurs_rattaches)) return false
  return formation.utilisateurs_rattaches.includes(String(userId))
}


const onToggleAttach = (formationId, userId, val) => {
  const formation = formationStore.formations.find(f => f.id === formationId)
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
      id => id !== idAsString
    )
  }

  saveAllAttachments(formationId)
}

const saveAllAttachments = async (formationId) => {
  const formation = formationStore.formations.find(f => f.id === formationId)
  if (!formation) return

  await formationStore.updateUserAttachment(formation)
}



const refreshAttachmentState = (composanteId) => {
  const comp = dataTable.value.find((c) => c.id === composanteId)
  if (!comp) return
  if (!isUserAttached.value[composanteId]) isUserAttached.value[composanteId] = {}

  userAccessStore.users.forEach((user) => {
    isUserAttached.value[composanteId][user.id] = !!comp.users.some((u) => u.id === user.id)
  })
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
          role === 'agent_scolarite' &&
          myComposanteIds.length > 0 &&
          myComposanteIds.includes(f.composante_id)
        )
          return true
        
        if (
          role === 'ingenieur_pedagogique' &&
          myComposanteIds.length > 0 &&
          myComposanteIds.includes(f.composante_id)
        )
          return true
        
          if (
          role === 'directeur_composante' &&
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

        console.log(userAccessStore.users)
        let owner = (userAccessStore.users || []).find((u) => u.id === f.owner_user_id);
        if( !owner ) {
          owner = 'Erreur utilisateur inconnu';
        } else {
          owner = owner.username
        }
      return {
        id: f.id,
        owner: owner,
        name: f.libelle,
        users
      }
    })

  // init isUserAttached
  dataTable.value.forEach((f) => {
    isUserAttached.value[f.id] = {}
    ;(userAccessStore.users || []).forEach((user) => {
      isUserAttached.value[f.id][user.id] = !!f.users.some((u) => u.id === user.id)
    })
  })

  console.log('dataTable initialisé:', dataTable.value)
}

initData()


initData()
</script>

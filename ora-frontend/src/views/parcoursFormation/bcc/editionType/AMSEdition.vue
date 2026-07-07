<template>
  <v-container>
    <v-row>
      <v-col cols="1" style="padding-bottom: 0px">
        <v-icon icon="mdi-thought-bubble-outline" />
      </v-col>
      <template v-if="libelleEdition">
        <v-col cols="5">
          <v-text-field
            v-model="data.libelle"
            variant="outlined"
            label="Libellé"
            density="compact"
            :disabled="isImportedMutualisation"
            hide-details
            @blur="updateLibelle"
            @keyup.enter="updateLibelle"
          />
        </v-col>
        <v-col cols="1">
          <v-btn icon="true" size="small" @click="libelleEdition = false">
            <v-icon size="16">mdi-check</v-icon>
          </v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="5">
          <h3 style="word-break: break-word; white-space: pre-line">
            {{ data.libelle.replace(/(.{1,60})(\s+|$)/g, '$1\n') }}
          </h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon="true" size="small" @click="libelleEdition = true">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
        </v-col>
      </template>
      <v-col cols="1">
        <v-btn
          icon="true"
          :color="data.est_mutualisable ? 'success' : 'transparent'"
          :disabled="data.est_mutualisable || isImportedMutualisation"
          @click="shareElement"
          size="small"
        >
          <v-icon size="16">mdi-share-variant</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-tooltip :text="isSubscribedPush ? 'Abonné aux notifications push' : 'Désabonné des notifications push'" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              icon="true"
              :color="isSubscribedPush ? 'blue' : 'red'"
              size="small"
              @click="togglePushNotification"
            >
              <v-icon size="16" color="white">mdi-bell</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="1">
        <v-tooltip :text="isSubscribedEmail ? 'Abonné aux notifications par email' : 'Désabonné des notifications par email'" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              icon="true"
              :color="isSubscribedEmail ? 'blue' : 'red'"
              size="small"
              @click="toggleEmailNotification"
            >
              <v-icon size="16" color="white">mdi-email</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="1">
        <v-btn color="error" icon="true" size="small" @click="deleteElement()">
          <v-icon size="16">mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row style="margin-top: 16px">
      <v-col cols="6">
        <v-select
          v-model="data.parcours"
          :items="parcoursList"
          item-title="libelle"
          :disabled="isImportedMutualisation"
          @blur="updateData"
          multiple
          @keyup.enter="updateData"
          item-value="id"
          label="Parcours"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-divider
    :thickness="4"
    class="my-4"
    style="border-style: dotted; border-color: #707070; margin: 0px !important"
  />
  <v-container>
    <v-row>
      <v-col cols="3" style="padding-top: 12px">
        <span>Accompagnement :</span>
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="TP"
          :disabled="isImportedMutualisation"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model.number="data.volume_horaire_tp"
        />
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="TD"
          type="number"
          variant="outlined"
          density="compact"
          :disabled="isImportedMutualisation"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model="data.volume_horaire_td"
        />
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="PT"
          type="number"
          variant="outlined"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          :disabled="isImportedMutualisation"
          v-model="data.volume_horaire_cm"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" style="padding-top: 12px">
        <span>Travail personnel :</span>
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="Heures"
          type="number"
          variant="outlined"
          :disabled="isImportedMutualisation"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model.number="data.travail_personnel"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="12" style="padding-top: 6px">
        <v-textarea
          v-model="data.description"
          @blur="updateData"
          :disabled="isImportedMutualisation"
          @keyup.enter="updateData"
          label="Description"
          variant="outlined"
          density="compact"
          rows="3"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" style="padding-top: 12px">
        <span>Groupe étudiants :</span>
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="Minimum"
          type="number"
          variant="outlined"
          :disabled="isImportedMutualisation"
          density="compact"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model.number="data.nb_etudiant_min"
        />
      </v-col>
      <v-col cols="3" style="padding-top: 6px">
        <v-text-field
          label="Maximum"
          type="number"
          variant="outlined"
          density="compact"
          :disabled="isImportedMutualisation"
          @blur="updateData"
          @keyup.enter="updateData"
          v-model.number="data.nb_etudiant_max"
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: 0px; margin-bottom: 0px">
      <v-col cols="12" style="padding-top: 6px">
        <v-textarea
          label="Commentaires"
          variant="outlined"
          density="compact"
          :disabled="isImportedMutualisation"
          rows="3"
          v-model="data.commentaire"
          @blur="updateData"
          @keyup.enter="updateData"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useUserAccessStore } from '@/stores/usersAccessStore'
import { useConnectionStore } from '@/stores/connectionStore'
import { useFormationStore } from '@/stores/formationStore'
import { useEcStore } from '@/stores/elementConstitutifStore'
import { useUnsubscribedNotificationsStore } from '@/stores/notificationsStore'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  refreshTreeView: {
    type: Function,
    required: false
  }
})

const connectionStore = useConnectionStore()
const userAccessStore = useUserAccessStore()
const formationStore = useFormationStore()
const ecStore = useEcStore()
const notificationsStore = useUnsubscribedNotificationsStore()

const emit = defineEmits(['refreshTreeView'])

const parcoursList = ref(formationStore.formationSelected.parcours)
const libelleEdition = ref(false)
const data = ref(props.data)
const isImportedMutualisation = ref(false)
const isSubscribedPush = ref(true)
const isSubscribedEmail = ref(true)

const deleteElement = async () => {
  await ecStore.removeEC(data.value)
  emit('refreshTreeView')
}

const shareElement = () => {
  data.value.est_mutualisable = true
  updateData()
}

const syncNotification = () => {
  // 1. Source de vérité unique pour l'ID utilisateur : connectionStore.userId
  const currentUserId = userAccessStore.users.find((u) => u.email === connectionStore.user?.email)?.id

  const unsubscriber = notificationsStore.getUnsubscribers.find(
    (u) => u.objet_type === 'ec' && u.objet_id === data.value.id && u.id_user === currentUserId
  )

  // Les deux abonnés → plus besoin de ligne en BDD, on supprime
  if (isSubscribedPush.value && isSubscribedEmail.value) {
    if (unsubscriber) {
      notificationsStore.deleteUnsubscriber(unsubscriber)
    }
    return
  }
  
  if (unsubscriber) {
    // Mise à jour de l'existant
    notificationsStore.updateUnsubscriber({
      ...unsubscriber,
      by_push: isSubscribedPush.value,
      by_email: isSubscribedEmail.value
    })
  } else {
    // Création : On utilise directement currentUserId (l'UUID Keycloak visible dans le curl)
    console.log(currentUserId)
    notificationsStore.createUnsubscriber({
      id_user: currentUserId, 
      objet_type: 'ec',
      objet_id: data.value.id,
      email: connectionStore.user?.email || '',
      by_push: isSubscribedPush.value,
      by_email: isSubscribedEmail.value
    })
  }
}

const togglePushNotification = () => {
  isSubscribedPush.value = !isSubscribedPush.value
  syncNotification()
}

const toggleEmailNotification = () => {
  isSubscribedEmail.value = !isSubscribedEmail.value
  syncNotification()
}

const updateData = async () => {
  await ecStore.updateEC(data.value)
  emit('refreshTreeView')
}

const updateLibelle = async () => {
  await updateData()
  emit('refreshTreeView')
}

const initData = async () => {
  const idAsNumber = parseInt(data.value.id, 10)
  data.value = ecStore.ecs.find((ec) => ec.id === idAsNumber)
  isImportedMutualisation.value = props.data.is_imported

  notificationsStore.fetchUnsubscriber().then(() => {
    const unsubscriber = notificationsStore.getUnsubscribers.find(
      (u) => u.objet_type === 'ec' && u.objet_id === data.value.id && u.id_user === connectionStore.userId
    )
    if (unsubscriber) {
      isSubscribedPush.value = unsubscriber.by_push
      isSubscribedEmail.value = unsubscriber.by_email
    } else {
      isSubscribedPush.value = true
      isSubscribedEmail.value = true
    }
  })
}
initData()

watch(
  () => ecStore.ecs.find((ec) => ec.id === props.data.id),
  (newVal) => {
    if (newVal) {
      data.value = { ...newVal }
    }
  },
  { deep: true }
)

watch(
  () => props.data,
  (newVal) => {
    data.value = newVal
    initData()
  },
  { deep: true }
)
</script>
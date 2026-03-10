<template>
  <v-row style="margin-top: 12px">
    <v-col cols="3">
      <h2>
        <v-icon style="vertical-align: middle; margin-right: 8px">mdi-home-outline</v-icon>
        Accueil
      </h2>
    </v-col>
    <v-col cols="9" class="d-flex justify-end">
      <span style="color: #878787; font-size: 20px"
        >Un outil d'aide à la conception d'une offre de formation en approche par compétences</span
      >
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="2">
              <h3 style="color: #12255b; font-weight: normal">Liste des formations</h3>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="search"
                label="Rechercher une formation"
                prepend-icon="mdi-magnify"
                class="mb-4"
                clearable
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <div style="overflow-y: auto; max-height: 600px; padding-right: 18px">
          <v-table style="color: #878787" class="formation-table">
            <thead>
              <tr>
                <th>Composante</th>
                <th>Formation</th>
                <th>Version</th>
                <th style="text-align: center">Parcours</th>
                <th style="text-align: center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="formation in sortedFormations"
                :key="formation.id"
              >
                <td>{{ composanteStore.getComposanteLibelleById(formation.composante_id) }}</td>
                <td class="toSelect" @click="toFormation(formation)">
                  {{ formation.libelle }}
                </td>
                <td>
                  <v-chip-group>
                    <v-chip
                      v-for="version in formation.version"
                      :key="version.id"
                      color="primary"
                      @click="toVersion(formation, version)"
                    >
                      {{ version.libelle }}
                    </v-chip>
                  </v-chip-group>
                </td>
                <td>
                  <v-table class="parcours-table" style="color: #878787">
                    <tbody>
                      <tr v-for="parcours in formation.parcours" :key="parcours.id">
                        <td>{{ parcours.libelle }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
                <td style="vertical-align: middle; text-align: center">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        style="color: #000000"
                        icon="mdi-dots-vertical"
                        variant="text"
                        v-bind="props"
                      ></v-btn>
                    </template>

                    <v-list>
                      <v-list-item link @click="showUpdateFormation(formation)">
                        <v-list-item-title> Modifier </v-list-item-title>
                        <template v-slot:append>
                          <v-icon icon="mdi-pencil"></v-icon>
                        </template>
                      </v-list-item>
                      <v-list-item link @click="dupplicateFormation(formation)">
                        <v-list-item-title>Duppliquer</v-list-item-title>
                        <template v-slot:append>
                          <v-icon icon="mdi-content-copy"></v-icon>
                        </template>
                      </v-list-item>
                      <v-dialog v-model="confirmDelete" width="auto">
                        <template v-slot:activator="{ props: activatorProps }">
                          <v-list-item link v-bind="activatorProps">
                            <v-list-item-title>Supprimer</v-list-item-title>
                            <template v-slot:append>
                              <v-icon icon="mdi-delete"></v-icon>
                            </template>
                          </v-list-item>
                        </template>
                        <v-card
                          max-width="400"
                          prepend-icon="mdi-trash-can"
                          :text="`Êtes-vous sûr de vouloir supprimer la formation ${formation.libelle} ?`"
                          title="Confirmation"
                        >
                          <template v-slot:actions>
                            <v-btn
                              color="error"
                              variant="elevated"
                              text="Supprimer"
                              @click="deleteFormation(formation)"
                            ></v-btn>
                            <v-btn
                              text="Annuler"
                              color="info"
                              @click="confirmDelete = false"
                            ></v-btn>
                          </template>
                        </v-card>
                      </v-dialog>
                    </v-list>
                  </v-menu>
                  <v-chip
                    class="ma-2"
                    :style="{
                      backgroundColor: formation.state === 'Terminé' ? '#E2F1B8' : '#B8C2F1',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      opacity: 1
                    }"
                  >
                    <span style="color: black">{{ formation.state }}</span>
                  </v-chip>
                  <v-btn
                    icon="mdi-arrow-right-circle"
                    variant="text"
                    style="color: #000000"
                    @click="toFormation(formation)"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
            <template v-slot:item.action="{ item }">
              <v-btn color="info" @click="navigateTo(paths.FORMATION_DETAIL, { id: item.id })">
                Détails
              </v-btn>
            </template>
          </v-table>

        </div>
          <v-btn
            @click="toggleFormationCard"
            :color="showFormationCard ? 'error' : 'success'"
            :text="showFormationCard ? 'Annuler' : 'Ajouter une formation'"
            :prepend-icon="showFormationCard ? '' : 'mdi-plus'"
          >
          </v-btn>
        </v-card-text>
      </v-card>
      <v-expand-transition>
        <v-card style="margin-top: 12px" v-show="showFormationCard" class="formation-creation">
          <h3>Création d'une nouvelle formation</h3>
          <v-form>
            <div class="dividerForm" style="border-top: 1px dashed #707070" />

            <v-row class="uniformRow">
              <v-col cols="4" class="d-flex align-center">
                <span>Saisir le nom de la formation</span>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  :error="refMissingValues.includes('libelle_formation')"
                  density="compact"
                  variant="outlined"
                  v-model="currentFormation.libelle"
                  hide-details
                  label="Libellé de la formation"
                />
              </v-col>
            </v-row>
            <v-row class="uniformRow">
              <v-col cols="4" class="d-flex align-center">
                <span>Sélectionner la composante</span>
              </v-col>
              <v-col cols="6">
                <v-select
                  density="compact"
                  :error="refMissingValues.includes('composante_formation')"
                  variant="outlined"
                  :items="composantesOrderedByEtablissement"
                  v-model="currentFormation.composante_id"
                  item-title="libelle"
                  item-value="value"
                  item-props="props"
                  label="Composante"
                >
                  <template #item="{ item, props }">
                    <v-list-subheader v-if="item.isHeader">
                      <h2 class="font-semibold text-gray-700">
                        {{ item.title }}
                      </h2>
                    </v-list-subheader>
                    <v-list-item v-else v-bind="props" class="pl-6">
                      <v-list-item-title>{{ item.libelle }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row class="uniformRow">
              <v-col cols="4" class="d-flex align-center">
                <span>Sélectionner le type de diplôme</span>
              </v-col>
              <v-col cols="6">
                <v-select
                  density="compact"
                  variant="outlined"
                  :error="refMissingValues.includes('type_diplome_formation')"
                  :items="
                    composanteStore.composantes.find((c) => c.id === currentFormation.composante_id)
                      ?.parametre?.type_diplomes || []
                  "
                  v-model="currentFormation.type_diplome_id"
                  item-title="libelle"
                  item-value="id"
                  @update:model-value="changeCreditAndHours"
                  label="Diplôme"
                  solo
                ></v-select>
              </v-col>
            </v-row>
            <div class="dividerForm" style="border-top: 1px dashed #707070; margin-top: 22px" />
            <v-row style="padding-top: 10px; margin-top: 20px">
              <v-col cols="2" style="flex: 0 0 0 0 !important">
                <span>Saisir le(s) parcours :</span>
              </v-col>
              <v-col cols="8">
                <template
                  style="padding: 0"
                  v-for="(parcours, index) in currentFormation.parcours.sort((a, b) =>
                    a.libelle.localeCompare(b.libelle)
                  )"
                  :key="index"
                >
                  <v-row>
                    <v-col offset="1" cols="6" style="padding-bottom: 0px; padding-top: 0px">
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        v-model="currentFormation.parcours[index].libelle"
                        label="Parcours"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3" style="padding-bottom: 0px; padding-top: 0px">
                      <v-text-field
                        density="compact"
                        variant="outlined"
                        v-model.number="currentFormation.parcours[index].effectif_theorique"
                        label="Effectif théorique"
                        type="number"
                      />
                    </v-col>
                    <v-col cols="2" style="padding-bottom: 0px; padding-top: 0px">
                      <v-btn
                        color="error"
                        variant="elevated"
                        text="Supprimer"
                        @click="deleteParcours(currentFormation.parcours[index])"
                      ></v-btn>
                    </v-col>
                  </v-row>
                </template>
                <v-row style="margin-top: 0px">
                  <v-col cols="9">
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      v-model="newParcours"
                      label="Saisir un parcours"
                      @keyup.enter="addParcours"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-btn @click="addParcours" style="background-color: green; color: white"
                      ><v-icon left>mdi-plus</v-icon>Ajouter un parcours</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <template v-if="currentFormation.parcours.length > 0">
                <v-col cols="auto">
                  <span>Total de l'effectif théorique :</span>
                </v-col>
                <v-col cols="auto">
                  <strong style="padding-left: 12px">
                    {{
                      currentFormation.parcours.reduce(
                        (total, parcours) => total + (parcours.effectif_theorique || 0),
                        0
                      )
                    }}
                  </strong>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="auto">
                  <span>Effectif théorique de la formation</span>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    v-model.number="currentFormation.total_effectif_theorique"
                    label="Effectif théorique"
                    type="number"
                  />
                </v-col>
              </template>
            </v-row>
            <div class="dividerForm" style="border-top: 1px dashed #707070" />

            <v-row style="padding: 6px 0">
              <h4 style="padding-left: 10px">
                Les valeurs désactivées (non sélectionnables) sont appliquées depuis les paramètres
                globaux.
              </h4>
            </v-row>
            <v-row class="align-center">
              <v-col cols="4">
                <span style="padding-left: 10px">Régime</span>
                <div style="display: flex; align-items: center; gap: 16px">
                  <v-checkbox
                    v-model="currentFormation.is_regime_fc"
                    label="FC"
                    class="rounded-checkbox"
                    hide-details
                    inline
                  />
                  <v-checkbox
                    v-model="currentFormation.is_regime_fi"
                    label="FI"
                    class="rounded-checkbox"
                    hide-details
                    inline
                  />
                  <v-checkbox
                    v-model="currentFormation.is_regime_fa"
                    label="FA"
                    class="rounded-checkbox"
                    hide-details
                    inline
                  />
                </div>
              </v-col>
              <v-col cols="4">
                <span style="padding-left: 10px">Type de période de la formation</span>
                <v-radio-group
                  v-model="currentFormation.duree_unite"
                  :disabled="formMode === 'update'"
                  inline
                  :error="refMissingValues.includes('duree_unite_formation')"
                >
                  <v-radio label="Semestre" value="semestre"></v-radio>
                  <v-radio label="Année" value="annee"></v-radio>
                  <v-radio label="Mois" value="mois"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  density="compact"
                  :error="refMissingValues.includes('duree_formation')"
                  variant="outlined"
                  v-model.number="currentFormation.duree"
                  label="Nombre de périodes de formation"
                  :disabled="formMode === 'update'"
                  type="number"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  disabled
                  density="compact"
                  variant="outlined"
                  v-model="currentFormation.nb_heures_enseignement"
                  label="Nombre d'heures d'enseignement"
                  type="number"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  disabled
                  v-model="currentFormation.nb_credits"
                  label="Nombre de crédits"
                  type="number"
                />
              </v-col>
            </v-row>
            <div class="dividerForm" style="border-top: 1px dashed #707070" />
            <v-row>
              <v-col cols="12">
                <h4 style="padding-left: 10px">
                  Paramétrer les niveaux pour catégoriser les compétences
                </h4>
                <h4 style="padding-left: 10px">
                  Attention, les libellés ne seront plus modifiables :
                </h4>
              </v-col>
            </v-row>
            <v-row
              v-for="(niveau, index) in currentFormation.noms_des_niveaux"
              :key="index"
              class="align-center"
              style="margin-bottom: 8px"
            >
              <v-col
                cols="5"
                class="d-flex align-center"
                style="padding-top: 0px; padding-bottom: 0px"
              >
                <v-text-field
                  density="compact"
                  :disabled="formMode === 'update'"
                  variant="outlined"
                  :error="refMissingValues.includes(`niveau_${index + 1}_formation`)"
                  v-model="currentFormation.noms_des_niveaux[index]"
                  :label="`Libellé du niveau ${index + 1}`"
                  style="flex: 1"
                />
              </v-col>
              <v-col cols="1" class="d-flex align-center" style="padding-top: 0px">
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  @click="currentFormation.noms_des_niveaux.splice(index, 1)"
                  style="margin-left: 8px"
                  :disabled="formMode === 'update'"
                ></v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" style="padding-top: 0px; padding-bottom: 0px">
                <v-btn
                  :style="{
                    backgroundColor:
                      currentFormation.noms_des_niveaux.length === 0 ? 'red' : 'green',
                    color: 'white'
                  }"
                  variant="outlined"
                  prepend-icon="mdi-plus"
                  @click="currentFormation.noms_des_niveaux.push('')"
                  :disabled="formMode === 'update'"
                >
                  Ajouter un niveau
                </v-btn>
              </v-col>
            </v-row>
            <div
              class="dividerForm"
              style="border-top: 1px dashed #707070; margin-top: 36px !important"
            />
            <v-row>
              <v-col cols="6">
                <SearchEngine
                  :itemsList="users"
                  label="Ajouter des utilisateurs pour contribuer à cette formation"
                  renderField="email"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-col cols="12" style="text-align: right">
              <v-btn
                @click="formMode === 'create' ? createFormation() : updateFormation()"
                color="success"
                prepend-icon="mdi-content-save"
                :text="formMode === 'create' ? 'Ajouter' : 'Modifier'"
              ></v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script setup>
import { effect, ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import router from '@/router/router'
import { config } from '@/environment/environment'
import { navigateTo } from '@/router/router'
import { paths } from '@/router/routesEnumeration'

import { useConnectionStore } from '@/stores/connectionStore'
import { useFormationStore } from '@/stores/formationStore'
import { useComposanteStore } from '@/stores/composanteStore'
import { useTypeDiplomeStore } from '@/stores/typeDiplomeStore'
import { useEtablissementStore } from '@/stores/etablissementStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useSocketStore } from '@/stores/socketStore'
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation'

import SearchEngine from '@/components/SearchEngine.vue'
import { useUserAccessStore } from '@/stores/usersAccessStore'

const userAccessStore = useUserAccessStore()
const connectionStore = useConnectionStore()
const formationStore = useFormationStore()
const composanteStore = useComposanteStore()

const parcoursStore = useParcoursStore()
const etablissementStore = useEtablissementStore()
const socketStore = useSocketStore()
const popUpStore = usePopUpStore()

const search = ref('')

const refMissingValues = ref([])
const showMissingValuesError = () => {
  popUpStore.print({
    isVisible: true,
    message:
      "Des valeurs sont manquantes lors de la création d'une formation.\nVeuillez remplir les champs manquants (en rouge).",
    type: 'ERROR'
  })
}

onMounted(async () => {
  await nextTick()
  await init()
})

const users = ref([])
const fetchUsers = async () => {
  await axios
    .get(config.backend.url + '/admin/users', {
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + connectionStore.token.access_token
      }
    })
    .then((value) => {
      users.value = value.data.data.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }))
    })
    .catch((error) => {
      console.error('Error fetching users:', error)
    })
}

const init = async () => {
  await userAccessStore.fetchUsers()
  await etablissementStore.fetchEtablissements()
  await composanteStore.fetchComposantes()
  await formationStore.fetchFormation()

  await typeDiplomeStore.fetchTypeDiplomes()
  await parcoursStore.fetchParcours()
  await fetchUsers()
}
const formMode = ref('create')
const currentFormation = ref({
  libelle: '',
  state: '',
  nb_heures_enseignement: null,
  nb_credits: null,
  type_diplome: {
    heures: 0,
    credits: 0
  },
  duree: null,
  duree_unite: null,
  noms_des_niveaux: [],
  composante_id: null,
  nombre_de_niveaux: null,
  regime: null,
  parcours: []
})
const formationDuration = ref(null)
const dureeType = ref('')
const parcoursList = ref([])
const newParcours = ref('')
const confirmDelete = ref(false)
const showFormationCard = ref(false)

const composantesOrderedByEtablissement = computed(() => {
  const map = new Map()

  composanteStore.composantes
    .filter((c) => !c.is_historized)
    .forEach((c) => {
      const etabId = c.etablissement.id
      const etabLibelle = c.etablissement.libelle

      if (!map.has(etabId)) {
        map.set(etabId, { title: etabLibelle, children: [] })
      }

      map.get(etabId).children.push({
        libelle: c.libelle,
        value: c.id,
        isHeader: false
      })
    })

  const groups = Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title))

  return groups.flatMap((g) => {
    const sortedChildren = g.children.sort((x, y) => x.libelle.localeCompare(y.libelle))
    return [
      {
        libelle: g.title,
        isHeader: true,
        props: { disabled: true }
      },
      ...sortedChildren
    ]
  })
})

const toggleFormationCard = () => {
  showFormationCard.value = !showFormationCard.value
  if (showFormationCard.value) {
    currentFormation.value = {
      libelle: '',
      state: '',
      nb_heures_enseignement: null,
      nb_credits: null,
      type_diplome: {
        heures: 0,
        credits: 0
      },
      duree: null,
      duree_unite: null,
      noms_des_niveaux: [],
      type_diplome_id: null,
      composante_id: null,
      is_regime_fa: false,
      is_regime_fi: false,
      is_regime_fc: false,
      nombre_de_niveaux: null,
      parcours: []
    }
    formMode.value = 'create'
  } else {
    formMode.value = 'update'
  }
}

const showUpdateFormation = (formation) => {
  currentFormation.value = formationStore.formations.find((f) => f.id === formation.id)
  showFormationCard.value = true
  formMode.value = 'update'
}

const addParcours = () => {
  if (newParcours.value) {
    currentFormation.value.parcours.push({
      libelle: newParcours.value,
      effectif_theorique: 0
    })
    if (currentFormation.value.parcours.length > 0) {
      currentFormation.value.total_effectif_theorique = null
    }
    newParcours.value = ''
  }
}

const deleteParcours = (parcours) => {
  currentFormation.value.parcours = currentFormation.value.parcours.filter(
    (p) => p.libelle !== parcours.libelle
  )
}

const toFormation = (formation) => {
  if (formationStore.formationSelected.id !== localStorage.getItem('roomId')) {
    socketStore.disconnect(
      localStorage.getItem('roomId'),
      connectionStore.user.givenname,
      connectionStore.user.sn
    )
  }
  formationStore.formationSelected = formation
  socketStore.connect(formation.id, connectionStore.user.givenname, connectionStore.user.sn)
  router.push({ name: 'version-list', params: { idFormation: formation.id } })
}

const toVersion = (formation, version) => {
  formationStore.formationSelected = formation
  parcoursStore.versionSelected = version
  socketStore.disconnect(
    localStorage.getItem('roomId'),
    connectionStore.user.givenname,
    connectionStore.user.sn
  )
  socketStore.connect(
    formationStore.formationSelected.id,
    connectionStore.user.givenname,
    connectionStore.user.sn
  )
  router.push({
    name: 'parcours-competences',
    params: { idVersion: version.id }
  })
}

const deleteFormation = (formation) => {
  // Logique pour supprimer une formation
  formationStore.deleteFormation(formation)
  confirmDelete.value = false
  showFormationCard.value = false
}

const updateFormation = async () => {
  if (!analyzeMissingValues()) {
    showMissingValuesError()
    return
  }

  // Logique pour modifier une formation
  const oldFormation = await formationStore
    .fetchOneFormationFromId(currentFormation.value.id)
    .then((d) => {
      return d
    })

  const parcoursToDelete = oldFormation.parcours.filter(
    (oldParcours) =>
      !currentFormation.value.parcours.some(
        (currentParcours) => currentParcours.id === oldParcours.id
      )
  )
  parcoursToDelete.forEach((p) => {
    parcoursStore.deleteParcours(p)
  })

  const parcoursToUpdate = currentFormation.value.parcours.filter((currentParcours) =>
    oldFormation.parcours.some(
      (oldParcours) =>
        oldParcours.id === currentParcours.id &&
        (oldParcours.libelle !== currentParcours.libelle ||
          oldParcours.effectif_theorique !== currentParcours.effectif_theorique)
    )
  )

  parcoursToUpdate.forEach((parcours) => {
    parcoursStore.updateParcours(parcours)
  })

  const parcoursToCreate = currentFormation.value.parcours.filter(
    (currentParcours) =>
      !oldFormation.parcours.some((oldParcours) => oldParcours.libelle === currentParcours.libelle)
  )

  let formationToUpdateForCreationParcours = {
    ...currentFormation.value,
    parcours: {
      createMany: {
        data: parcoursToCreate.map((p) => ({
          libelle: p.libelle,
          effectif_theorique: p.effectif_theorique
        }))
      }
    }
  }

  await formationStore.updateFormation(formationToUpdateForCreationParcours)
  currentFormation.value.parcours
  await formationStore.fetchOneFormationFromId(currentFormation.value.id).then((d) => {
    currentFormation.value.parcours = d.parcours
  })
  const formationToUpdate = {
    id: currentFormation.value.id,
    libelle: currentFormation.value.libelle,
    state: currentFormation.value.state,
    nb_heures_enseignement: currentFormation.value.nb_heures_enseignement,
    nb_credits: currentFormation.value.nb_credits,
    duree: currentFormation.value.duree,
    noms_des_niveaux: currentFormation.value.noms_des_niveaux,
    is_regime_fa: currentFormation.value.is_regime_fa,
    is_regime_fi: currentFormation.value.is_regime_fi,
    is_regime_fc: currentFormation.value.is_regime_fc,
    duree_unite: currentFormation.value.duree_unite,
    nombre_de_niveaux: currentFormation.value.nombre_de_niveaux,
    regime: currentFormation.value.regime,
    composante: {
      connect: {
        id: currentFormation.value.composante_id
      }
    },
    type_diplome_to_connect: currentFormation.value.type_diplome_id
    // parcours: {
    //     createMany: {
    //         data: parcoursData.parcoursToCreate
    //     }
    // }
  }
  formationStore.updateFormation(formationToUpdate)

  currentFormation.value.parcours.forEach((p) => {
    parcoursStore.updateParcours(p)
  })

  toggleFormationCard()
  // Update versions et periodes
}

const getParcoursData = async (parcours) => {
  const bddParcours = await parcoursStore.fetchParcoursByFormationId(currentFormation.value.id)

  const parcoursToDelete = currentFormation.value.parcours.filter(
    (p) => !bddParcours.find((bddP) => bddP.id === p.id)
  )
  const parcoursToCreate = currentFormation.value.parcours.filter((p) => !p.id)
  const parcoursToUpdate = currentFormation.value.parcours.filter((p) => p.id)

  return {
    parcoursToCreate: parcoursToCreate,
    parcoursToUpdate: parcoursToUpdate,
    parcoursToDelete: parcoursToDelete
  }
}

const analyzeMissingValues = () => {
  refMissingValues.value = []
  if (currentFormation.value.libelle === '') {
    refMissingValues.value.push('libelle_formation')
  }

  if (currentFormation.value.composante_id === null) {
    refMissingValues.value.push('composante_formation')
  }

  if (currentFormation.value.type_diplome_id === null) {
    refMissingValues.value.push('type_diplome_formation')
  }

  if (currentFormation.value.duree === null) {
    refMissingValues.value.push('duree_formation')
  }

  if (currentFormation.value.duree_unite === null) {
    refMissingValues.value.push('duree_unite_formation')
  }

  if (currentFormation.value.noms_des_niveaux.length === 0) {
    refMissingValues.value.push('niveaux_formation')
  } else {
    for (let i = 0; i < currentFormation.value.noms_des_niveaux.length; i++) {
      if (currentFormation.value.noms_des_niveaux[i] === '') {
        refMissingValues.value.push(`niveau_${i + 1}_formation`)
      }
    }
  }

  return refMissingValues.value.length === 0
}

const createFormation = () => {
  if (!analyzeMissingValues()) {
    showMissingValuesError()
    return
  }
  // Logique pour créer une formation
  const me = userAccessStore.users.find((u) => u.username === connectionStore.user.eppn)
  const formationToCreate = {
    owner_user_id: me.id,
    libelle: currentFormation.value.libelle,
    total_effectif_theorique: currentFormation.value.total_effectif_theorique,
    nb_heures_enseignement: currentFormation.value.nb_heures_enseignement,
    nb_credits: typesDiplomes.value.find((t) => t.id === currentFormation.value.type_diplome_id)
      .credits,
    duree: currentFormation.value.duree,
    duree_unite: currentFormation.value.duree_unite,
    is_regime_fa: currentFormation.value.is_regime_fa,
    noms_des_niveaux: currentFormation.value.noms_des_niveaux,
    is_regime_fi: currentFormation.value.is_regime_fi,
    is_regime_fc: currentFormation.value.is_regime_fc,
    noms_des_niveaux: currentFormation.value.noms_des_niveaux
      ? [...currentFormation.value.noms_des_niveaux]
      : [],
    composante: {
      connect: {
        id: currentFormation.value.composante_id
      }
    },
    type_diplome: {
      connect: {
        id: currentFormation.value.type_diplome_id
      }
    },
    parcours: {
      createMany: {
        data: currentFormation.value.parcours
      }
    }
  }
  formationStore.createFormation(formationToCreate).then(() => {
    formationStore.fetchFormation()
    showFormationCard.value = false
  })
}

const dupplicateFormation = (formation) => {
  let newFormation = { ...formation }
  currentFormation.value = newFormation
  currentFormation.value.libelle = `${newFormation.libelle} - Copie`
  currentFormation.value.parcours = newFormation.parcours.map((p) => {
    return {
      libelle: p.libelle,
      description: p.description
    }
  })
  currentFormation.value.id = null
  createFormation()
}

const typeDiplomeStore = useTypeDiplomeStore()
const typesDiplomes = ref([])
const getTypeDiplome = async () => {
  await typeDiplomeStore.fetchTypeDiplomes().then((d) => {
    typesDiplomes.value = d
  })
}
getTypeDiplome()

const changeCreditAndHours = () => {
  currentFormation.value.nb_credits = typesDiplomes.value.find(
    (t) => t.id === currentFormation.value.type_diplome_id
  ).credits
  currentFormation.value.nb_heures_enseignement = typesDiplomes.value.find(
    (t) => t.id === currentFormation.value.type_diplome_id
  ).heures
}

const sortedFormations = computed(() => {
  const role = connectionStore.selectedRole?.name || null
  console.log(role)

  const me = userAccessStore.users.find(
    (u) => u.username === connectionStore.user.eppn
  )

  const myComposanteIds = composanteStore.composantes
  .filter((c) => c.utilisateurs_rattaches?.includes(me.id))
  .map((c) => c.id);

  return formationStore.getFormations
    .filter((f) => {
      if( role === 'administrateur_technique' || role === 'administrateur_fonctionnel' || role === 'observateur') return true;
      if (me.id === f.owner_user_id) return true;

      if( role === 'agent_scolarite' && myComposanteIds.length > 0 && myComposanteIds.includes(f.composante_id)) return true;

      return f.utilisateurs_rattaches?.includes(me.id)
    })
    // 🔍 TRI PAR PERTINENCE
    .slice()
    .sort((a, b) => {
      const scoreA = matchScore(a.libelle, search.value)
      const scoreB = matchScore(b.libelle, search.value)

      if (scoreA !== scoreB) {
        return scoreB - scoreA // score le plus élevé d'abord
      }

      // fallback : tri alphabétique
      return a.libelle.localeCompare(b.libelle)
    })
})

const matchScore = (libelle, search) => {
  if (!search) return 0

  const l = libelle.toLowerCase()
  const s = search.toLowerCase()

  if (l === s) return 100
  if (l.startsWith(s)) return 75
  if (l.includes(s)) return 50

  return 0
}


</script>

<style scoped>
.formation-table tr td {
  border-top: 1px dashed #707070;
  border-bottom: none !important;
}

.formation-table tr th {
  border-top: none !important;
  border-bottom: none !important;
}

.parcours-table tr:first-child td {
  border-top: none !important;
  border-bottom: none !important;
}

.formation-table tr {
  border-top: none !important;
  border-bottom: none !important;
}

.dividerForm {
  margin-top: 12px;
  margin-bottom: 12px;
}

.toSelect:hover {
  cursor: pointer;
  background-color: aliceblue;
}

.formation-creation {
  padding: 20px;
}

.uniformRow {
  min-height: 60px !important;
  height: 60px !important;
  max-height: 60px !important;
  margin-top: 5px !important;
}

.formation-creation h1 {
  color: #333;
}
</style>
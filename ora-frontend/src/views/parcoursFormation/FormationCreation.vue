<template>
  <v-row>
    <v-col cols="8">
      <v-card>
        <v-card-title>
          <h2>Liste des formations</h2>
        </v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>Composante</th>
                <th>Formation</th>
                <th>Version</th>
                <th>Parcours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="formation in formationStore.getFormations" :key="formation.id">
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
                  <v-table>
                    <tbody>
                      <tr v-for="parcours in formation.parcours" :key="parcours.id">
                        <td>{{ parcours.libelle }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
                <td>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
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
                  <v-btn
                    icon="mdi-arrow-right-circle"
                    variant="text"
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

          <v-btn
            @click="toggleFormationCard"
            :color="showFormationCard ? 'error' : 'success'"
            :text="showFormationCard ? 'Annuler' : 'Ajouter une formation'"
          >
          </v-btn>
        </v-card-text>
      </v-card>
      <v-expand-transition>
        <v-card style="margin-top: 12px" v-show="showFormationCard" class="formation-creation">
          <h3>Création d'une nouvelle formation</h3>
          <v-form>
            <v-divider class="dividerForm" />
            <v-row class="uniformRow">
              <v-col cols="4" class="d-flex align-center">
                <span>Saisir le nom de la formation</span>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  v-model="currentFormation.libelle"
                  hide-details
                  label="Libellé"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="uniformRow">
              <v-col cols="4" class="d-flex align-center">
                <span>Sélectionner la composante</span>
              </v-col>
              <v-col cols="6">
                <v-select
                  density="compact"
                  variant="outlined"
                  :items="composanteStore.getComposantes"
                  v-model="currentFormation.composante_id"
                  item-title="libelle"
                  item-value="id"
                  label="Composante"
                >
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
                  :items="typesDiplomes"
                  v-model="currentFormation.type_diplome_id"
                  item-title="libelle"
                  item-value="id"
                  @update:model-value="changeCreditAndHours"
                  label="Diplôme"
                  solo
                ></v-select>
              </v-col>
            </v-row>
            <v-divider style="margin-top: 22px" class="dividerForm" />
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
                  <v-col cols="11">
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      v-model="newParcours"
                      label="Saisir un parcours"
                      @keyup.enter="addParcours"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-btn @click="addParcours" style="background-color: green; color: white"
                      ><v-icon left>mdi-plus</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="dividerForm" />

            <v-row style="padding: 6px 0">
              <h4 style="padding-left: 10px">
                Les valeurs désactivées (non sélectionnables) sont appliquées depuis les paramètres
                globaux.
              </h4>
            </v-row>
            <v-row class="align-center">
              <v-col cols="4">
                <span style="padding-left: 10px">Régime</span>
                <v-radio-group v-model="currentFormation.regime" inline>
                  <v-radio label="FC" value="fc"></v-radio>
                  <v-radio label="FI" value="fi"></v-radio>
                  <v-radio label="FA" value="fa"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="4">
                <span style="padding-left: 10px">Durée de la formation</span>
                <v-radio-group
                  v-model="currentFormation.duree_unite"
                  :disabled="formMode === 'update'"
                  inline
                >
                  <v-radio label="Semestre" value="semestre"></v-radio>
                  <v-radio label="Année" value="annee"></v-radio>
                  <v-radio label="Mois" value="mois"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  v-model.number="currentFormation.duree"
                  label="Durée"
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
                  v-model.number="currentFormation.nb_heures_enseignement"
                  label="Nombre d'heures d'enseignement"
                  type="number"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  disabled
                  v-model.number="currentFormation.nb_credits"
                  label="Nombre de crédits"
                  type="number"
                />
              </v-col>
            </v-row>
            <v-divider class="dividerForm" />
            <v-row>
              <v-col>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  :disabled="formMode === 'update'"
                  v-model.number="currentFormation.nombre_de_niveaux"
                  label="Nombre de niveaux pour catégoriser les compétences"
                  type="number"
                />
              </v-col>
            </v-row>
            <v-divider class="dividerForm" />
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
    <v-col cols="4">
      <InformationBubble>
        <!-- <p>
          Si vous souhaitez des informations pour créer votre offre de formation en approche par
          compétences, veuillez cliquer ici.
        </p> -->
        <p>
          Ce point d'entrée de l'application vous permet de créer des formations et des parcours
          pour pouvoir passer à la suite.
        </p>
        <p>
          Des paramètres globaux à l'établissement, la composante peuvent être appliqués rendant
          certains champs non modifiables.
        </p>
      </InformationBubble>
    </v-col>
  </v-row>
</template>

<script setup>
import axios from 'axios'

import { config } from '@/environment/environment'
import { useConnectionStore } from '@/stores/connectionStore'
import SearchEngine from '@/components/SearchEngine.vue'
import { useFormationStore } from '@/stores/formationStore'
import { useTypeFormationStore } from '@/stores/typeFormationStore'
import { useComposanteStore } from '@/stores/composanteStore'
import { useDiplomeStore } from '@/stores/diplomeStore'
import { useParcoursStore } from '@/stores/parcoursStore'
import { useEtablissementStore } from '@/stores/etablissementStore'
import { useSocketStore } from '@/stores/socketStore'
import InformationBubble from '@/components/InformationBubble.vue'

import { navigateTo } from '@/router/router'
import { paths } from '@/router/routesEnumeration'
import { effect, ref, computed } from 'vue'
import router from '@/router/router'
import ParcoursVersion from './ParcoursVersion.vue'
import { useTypeDiplomeStore } from '@/stores/typeDiplomeStore'

const connectionStore = useConnectionStore()
const formationStore = useFormationStore()
const composanteStore = useComposanteStore()
const typeFormationStore = useTypeFormationStore()
const diplomeStore = useDiplomeStore()
const parcoursStore = useParcoursStore()
const etablissementStore = useEtablissementStore()


const socketStore = useSocketStore();


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
}

const init = async () => {
  await etablissementStore.fetchEtablissements()
  await composanteStore.fetchComposanteByEtablissement(etablissementStore.etablissementSelected.id)
  await formationStore.fetchFormation()
  await typeFormationStore.fetchTypeFormation()
  await diplomeStore.fetchDiplome()
  await parcoursStore.fetchParcours()
  await fetchUsers()
}
init()

const formMode = ref('create')
const currentFormation = ref({
  libelle: '',
  nb_heures_enseignement: null,
  nb_credits: null,
  duree: null,
  duree_unite: null,
  type_diplome_id: null,
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

const toggleFormationCard = () => {
  showFormationCard.value = !showFormationCard.value
  if (showFormationCard.value) {
    currentFormation.value = {
      libelle: '',
      nb_heures_enseignement: null,
      nb_credits: null,
      duree: null,
      duree_unite: null,
      type_diplome_id: null,
      composante_id: null,
      nombre_de_niveaux: null,
      regime: null,
      parcours: []
    }
    formMode.value = 'create'
  } else {
    formMode.value = 'update'
  }
}

const showUpdateFormation = (formation) => {
  currentFormation.value = formation
  showFormationCard.value = true
  formMode.value = 'update'
}

const addParcours = () => {
  if (newParcours.value) {
    currentFormation.value.parcours.push({
      libelle: newParcours.value,
      effectif_theorique: 0
    })
    newParcours.value = ''
  }
}

const deleteParcours = (parcours) => {
  currentFormation.value.parcours = currentFormation.value.parcours.filter(
    (p) => p.libelle !== parcours.libelle
  )
}

const toFormation = (formation) => {
  if( formationStore.formationSelected.id !== localStorage.getItem('roomId') ) {
    console.log('disconnecting old room')
    socketStore.disconnect(localStorage.getItem('roomId'), connectionStore.user.givenname, connectionStore.user.sn);
  }
  formationStore.formationSelected = formation
  socketStore.connect( formation.id, connectionStore.user.givenname, connectionStore.user.sn );
  router.push({ name: 'version-list', params: { idFormation: formation.id } })
}

const toVersion = (formation, version) => {
  formationStore.formationSelected = formation
  parcoursStore.versionSelected = version
  console.log(formation)
  console.log('toVersion', formationStore.formationSelected.id)
  console.log(localStorage.getItem('roomId'))
  socketStore.disconnect(localStorage.getItem('roomId'), connectionStore.user.givenname, connectionStore.user.sn);
  console.log('ask websocket connection')
  socketStore.connect( formationStore.formationSelected.id, connectionStore.user.givenname, connectionStore.user.sn );
  console.log('clear')
  router.push({ name: 'parcours-competences', params: { idVersion: version.id, idFormation: formationStore.formationSelected.id } })
}

const deleteFormation = (formation) => {
  // Logique pour supprimer une formation
  formationStore.deleteFormation(formation)
  confirmDelete.value = false
  showFormationCard.value = false
}

const updateFormation = async () => {
  // Logique pour modifier une formation
  const oldFormation = await formationStore.fetchOneFormationFromId
    (currentFormation.value.id).then( d => {
    return d;
  })

  const parcoursToDelete = oldFormation.parcours.filter(
    (oldParcours) =>
      !currentFormation.value.parcours.some(
        (currentParcours) => currentParcours.id === oldParcours.id
      )
  );
  parcoursToDelete.forEach( p => {
    parcoursStore.deleteParcours(p)
  })

  const parcoursToUpdate = currentFormation.value.parcours.filter((currentParcours) =>
    oldFormation.parcours.some(
      (oldParcours) =>
        oldParcours.id === currentParcours.id &&
        (oldParcours.libelle !== currentParcours.libelle ||
          oldParcours.effectif_theorique !== currentParcours.effectif_theorique)
    )
  );

  parcoursToUpdate.forEach((parcours) => {
    parcoursStore.updateParcours(parcours);
  });
  
  const parcoursToCreate = currentFormation.value.parcours.filter(
    (currentParcours) =>
      !oldFormation.parcours.some(
        (oldParcours) => oldParcours.libelle === currentParcours.libelle
      )
  );

  const formationToUpdateForCreationParcours = {
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

  await formationStore.updateFormation(formationToUpdateForCreationParcours);
  currentFormation.value.parcours;
  await formationStore.fetchOneFormationFromId
    (currentFormation.value.id).then( d => {
      currentFormation.value.parcours = d.parcours;
    })

  const formationToUpdate = {
    id: currentFormation.value.id,
    libelle: currentFormation.value.libelle,
    nb_heures_enseignement: currentFormation.value.nb_heures_enseignement,
    nb_credits: currentFormation.value.nb_credits,
    duree: currentFormation.value.duree,
    duree_unite: currentFormation.value.duree_unite,
    nombre_de_niveaux: currentFormation.value.nombre_de_niveaux,
    regime: currentFormation.value.regime,
    composante: {
      connect: {
        id: currentFormation.value.composante_id
      }
    },
    type_diplome: {
      connect: {
        id: currentFormation.value.type_diplome_id
      }
    }    // ,
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

  console.log('toggled')
  toggleFormationCard()
  console.log('toggled')
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

const createFormation = () => {
  // Logique pour créer une formation
  const formationToCreate = {
    libelle: currentFormation.value.libelle,
    nb_heures_enseignement: currentFormation.value.nb_heures_enseignement,
    nb_credits: typesDiplomes.value.find(
      (t) => t.id === currentFormation.value.type_diplome_id
    ).credits,
    duree: currentFormation.value.duree,
    duree_unite: currentFormation.value.duree_unite,
    nombre_de_niveaux: currentFormation.value.nombre_de_niveaux,
    regime: currentFormation.value.regime,
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
  // for(let parcours of parcoursList.value) {
  //     formationToCreate.parcours.createMany.data.push(
  //         {
  //             libelle: parcours
  //         }
  //     )
  // }
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

const changeCreditAndHours = () => {
  currentFormation.value.nb_credits = typesDiplomes.value.find(
    (t) => t.id === currentFormation.value.type_diplome_id
  ).credits
  currentFormation.value.nb_heures_enseignement = typesDiplomes.value.find(
    (t) => t.id === currentFormation.value.type_diplome_id
  ).heures
  console.log(currentFormation.value);
}
</script>

<style scoped>
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
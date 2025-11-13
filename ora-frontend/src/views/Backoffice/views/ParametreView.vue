<template>
  <v-row>
    <v-col cols="3" class="d-flex align-center">
      <h3 style="padding-left: 16px">Sélectionner un paramètre à personnaliser :</h3>
    </v-col>
    <v-col cols="3">
      <v-select
        style="margin-top: 30px"
        variant="outlined"
        density="compact"
        label="Paramètres"
        :items="parametreStore.getParametres"
        item-title="libelle"
        item-value="id"
        v-model="parametreSelectedId"
      >
      </v-select>
    </v-col>
  </v-row>
  <v-row style="margin-top: 0">
    <v-col>
      <v-btn
        v-show="!isAdd && !parametreSelected"
        color="success"
        variant="elevated"
        @click="newParametre"
      >
        Nouveau
      </v-btn>
    </v-col>
  </v-row>
  <template v-if="parametreSelectedId !== null">
  <v-card v-if="isAdd || parametreSelected">
    <v-card-title v-if="parametreSelectedId === -1">Création d'un nouveau paramètre</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="parametreSelected.libelle"
            label="Libellé"
          ></v-text-field>
        </v-col>
      </v-row>
      <template v-if="isAdd === false">


      <v-row>
        <v-col>
          <v-textarea
            variant="outlined"
            density="compact"
            label="Description"
            v-model="parametreSelected.description"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            label="Type de diplome"
            v-model="parametreSelected.type_diplomes"
            :items="typeDiplomeStore.typeDiplomes"
            item-title="libelle"
            variant="outlined"
            density="compact"
            multiple
            return-object
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            variant="outlined"
            density="compact"
            label="Tags utilisables"
            :items="tagStore.tags"
            item-title="libelle"
            v-model="parametreSelected.tags"
            chips
            return-object
            multiple
          ></v-select>
        </v-col>
        <!-- <v-col cols="2">
                    <v-text-field
                        label="Heures attendues"
                        v-model="heuresAttendues"
                        variant="outlined"
                        readonly
                    ></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field
                        label="ECTS"
                        v-model="ects"
                        variant="outlined"
                        readonly
                    ></v-text-field>
                </v-col>-->
      </v-row>
      <v-row>
        <h4 style="padding: 16px">Les champs suivants sont limités à 25 caractères maximum.</h4>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            variant="outlined"
            density="compact"
            maxlength="25"
            label="Sémantique champs 'Compétence'"
            v-model="parametreSelected.semantique_competence"
            :color="elementsFalse.includes('semantique_competence') ? 'red' : ''"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            variant="outlined"
            maxlength="25"
            density="compact"
            label="Sémantique champs 'Apprentissages essentiels'"
            v-model="parametreSelected.semantique_apprentissage"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            variant="outlined"
            maxlength="25"
            density="compact"
            label="Sémantique champs 'Familles de situation'"
            v-model="parametreSelected.semantique_famille"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            variant="outlined"
            density="compact"
            maxlength="25"
            label="Sémantique champs 'Critères d'évaluation'"
            v-model="parametreSelected.semantique_critere"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            variant="outlined"
            maxlength="25"
            density="compact"
            label="Sémantique champs 'BCC'"
            v-model="parametreSelected.semantique_bcc"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            variant="outlined"
            maxlength="25"
            density="compact"
            label="Sémantique champs 'Groupe d'EC (UE)'"
            v-model="parametreSelected.semantique_ue"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-text-field
            variant="outlined"
            maxlength="25"
            density="compact"
            label="Sémantique champs 'Élément constitutif'"
            v-model="parametreSelected.semantique_ec"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
</v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="3" justify="space-between">
          <v-btn v-if="parametreSelectedId !== -1" color="success" variant="elevated" @click="register"> Enregistrer </v-btn>
          <v-btn v-else color="success" variant="elevated" @click="register">Création du paramètre </v-btn>
          <v-btn style="margin-left: 10px" color="info" variant="elevated" @click="cancel">
            Annuler
          </v-btn>
        </v-col>
        <v-col cols="3" offset="6">
          <v-btn  style="float: right" color="error" variant="elevated" @click="remove">
            Supprimer
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
  </template>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useParametreStore } from '@/stores/parametreStore'
import { useTypeDiplomeStore } from '@/stores/typeDiplomeStore'
import { useTagStore } from '@/stores/tagStore'

const parametreStore = useParametreStore()
const typeDiplomeStore = useTypeDiplomeStore()
const tagStore = useTagStore()

const parametreSelectedId = ref(null)
const newParametreModel = ref({
  libelle: '',
  semantique_competence: 'Compétences',
  semantique_apprentissage: 'Apprentissages',
  semantique_famille: 'Familles de situation',
  semantique_critere: "Critères d'exigences",
  semantique_bcc: 'BCC',
  semantique_ue: 'UE',
  semantique_ec: 'Éléments constitutifs'
})
const isAdd = ref(false)
const panels = ref([])

const typeDiplome = ref(null)
const elementsFalse = ref([])

const init = async () => {
  await parametreStore.fetchParametres()
  await typeDiplomeStore.fetchTypeDiplomes()
  await tagStore.fetchAllTags()
}
init()

const register = async () => {
  if (isAdd.value) {

    if( newParametreModel.value.libelle === '' ) {
        return;
    }

    const paramToCreate = {
      libelle: newParametreModel.value.libelle,
    }
    const p = await parametreStore.createParametre(paramToCreate)
    if (p.id) {
      parametreSelectedId.value = p.id
      newParametreModel.value.libelle = '';
      isAdd.value = false
    }
  } else {
    console.log('Update ', parametreSelectedId.value, parametreSelected.value)
    const paramToUpdate = {
      id: parametreSelectedId.value,
      libelle: parametreSelected.value.libelle,
      description: parametreSelected.value.description,
      semantique_competence: parametreSelected.value.semantique_competence,
      semantique_apprentissage: parametreSelected.value.semantique_apprentissage,
      semantique_famille: parametreSelected.value.semantique_famille,
      semantique_critere: parametreSelected.value.semantique_critere,
      semantique_bcc: parametreSelected.value.semantique_bcc,
      semantique_ue: parametreSelected.value.semantique_ue,
      semantique_ec: parametreSelected.value.semantique_ec,
      type_diplomes: {
        set: parametreSelected.value.type_diplomes.map((t) => ({ id: t.id }))
      },
      tags: {
        set: parametreSelected.value.tags.map((t) => ({ id: t.id }))
      }
    }
    parametreSelectedId.value = null;
    console.log('Update ', paramToUpdate)
    await parametreStore.updateParametre(paramToUpdate)
  }
  await parametreStore.fetchParametres()
}

const cancel = () => {
  isAdd.value = false
  parametreSelectedId.value = null
}

const remove = async () => {
  parametreStore.deleteParametre({
    id: parametreSelectedId.value
  })
  await parametreStore.fetchParametres()
  parametreSelectedId.value = null
}

const newParametre = () => {
  parametreSelectedId.value = -1
  isAdd.value = true
}

const parametreSelected = computed(() => {
  if (!parametreSelectedId.value && !isAdd.value) return null
  if (isAdd.value) return newParametreModel.value
  return parametreStore.getParametres.find((p) => p.id === parametreSelectedId.value)
})

const heuresAttendues = computed(() => {
  return parametreSelected.value && parametreSelected.value.type_diplome
    ? parametreSelected.value.type_diplome.heures
    : ''
})

const ects = computed(() => {
  return parametreSelected.value && parametreSelected.value.type_diplome
    ? parametreSelected.value.type_diplome.credits
    : ''
})
</script>
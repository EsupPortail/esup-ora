<template>
    <v-row>
        <v-col>
            <v-select
                label="Paramètres"
                :items="parametreStore.getParametres"
                item-title="libelle"
                item-value="id"
                v-model="parametreSelectedId"
            >
            </v-select>
            <v-btn 
                color="success"
                variant="elevated"
                @click="newParametre"
            >
                Ajouter
            </v-btn>
        </v-col>
    </v-row>
    <v-card v-if="isAdd || parametreSelected">
        <v-card-title>
            <v-expansion-panels v-model="panels" multiple>
                <v-expansion-panel
                    title="Etablissement"
                    text="dadada"
                >
                    <v-expansion-panel-content>
                        <v-text-field
                            v-model="parametreSelected.etablissement"
                            label="Etablissement"
                        ></v-text-field>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            
            <v-textarea label="Description" v-model="parametreSelected.description"></v-textarea>
            
            <v-text-field
                label="Sémantique champs 'Compétence'"
                v-model="parametreSelected.semantique_competence"
            ></v-text-field>
            <v-text-field
                label="Sémantique champs 'Apprentissages essentiels'"
                v-model="parametreSelected.semantique_apprentissage"
            ></v-text-field>
            <v-text-field
                label="Sémantique champs 'Familles de situation'"
                v-model="parametreSelected.semantique_famille"
            ></v-text-field>
            <v-text-field
                label="Sémantique champs 'Critères d'évaluation'"
                v-model="parametreSelected.semantique_crtiere"
            ></v-text-field>
            <v-text-field
                label="Sémantique champs 'BCC'"
                v-model="parametreSelected.semantique_bcc"
            ></v-text-field>
            <v-text-field
                label="Sémantique champs 'Groupe d'EC (UE)'"
                v-model="parametreSelected.semantique_ue"
            ></v-text-field>
            {{ parametreSelected }}
        </v-card-title>
        <v-card-text v-for="pElem in parametreStore.getParametreElements">
            <div v-for="paramValue in parametreSelected.parametre_values">
                <v-text-field
                    v-if="paramValue.parametre_element_id === pElem.id && pElem.type === 'text'"
                    v-model="paramValue.value"
                    :label="pElem.libelle"
                ></v-text-field>
                <v-text-field
                    v-else-if="paramValue.parametre_element_id === pElem.id && pElem.type === 'number'"
                    v-model="paramValue.value"
                    :label="pElem.libelle"
                ></v-text-field>
            </div>
        </v-card-text>
        <v-card-actions v-if="isAdd">
            <v-btn
                color="success"
                variant="elevated"
                @click="register"
            >
                Enregistrer
            </v-btn>
            <v-btn
                color="error"
                variant="elevated"
                @click="isAdd = false"
            >
                Annuler
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useParametreStore } from '@/stores/parametreStore';

const parametreStore = useParametreStore()
parametreStore.fetchParametre()
const parametreSelectedId = ref(null)
const newParametreModel = ref({ libelle: '' , parametre_values: {} })
const isAdd = ref(false)
const panels = ref([])

const register = () => {
    parametreStore.createParametreWithElement(newParametreModel.value)
}

const newParametre = () => {
    parametreSelectedId.value = null
    isAdd.value = true
    parametreSelected = {
        libelle: ''
    }
}

const parametreSelected = computed(() => {
    if (!parametreSelectedId.value) return null
    return parametreStore.getParametres.find(p => p.id === parametreSelectedId.value)
})

</script>
<template>
    <v-card v-if="toggleHelp" class="help-card">
        <v-card-title style="background-color: #14275C; color: #fff; text-align: center;">
            Caractère évaluable
        </v-card-title>
        <v-card-text class="pa-4" style="font-size: 1rem">
            <div v-for="caracEvalType in caractereEvaluableTypes">
                <v-icon 
                    :icon="isChecked(caracEvalType.id) ? 'mdi-square' : 'mdi-square-outline'"
                    color="#14275C"
                    @click="checkCaracEval(caracEvalType.id)"
                ></v-icon> 
                    {{ caracEvalType.libelle }} {{ caracEvalType.id }}
            </div>
            <div class="d-flex justify-end">
                <v-btn color="info" @click="$emit('closeHelp')">
                    Fermer
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useCaractereEvaluableStore } from '@/stores/caractereEvaluableStore';

const emit = defineEmits(['refreshCompetence', 'closeHelp'])

const caractereEvaluableStore = useCaractereEvaluableStore()

const props = defineProps({
    competence: Object,
    caractereEvaluableTypes: Array,
    toggleHelp: Boolean
})

const isChecked = (caracEvalTypeId) => {
    return props.competence.caractere_evaluables.some((caracEval) => {
        return ((caracEval.caractere_evaluable_type_id === caracEvalTypeId) && (caracEval.active))
    })
}

const checkCaracEval = async (caracEvalTypeId) => {
    const caracEval = props.competence.caractere_evaluables.find((caracEval) => caracEval.caractere_evaluable_type_id === caracEvalTypeId)
    if(caracEval) {
        caracEval.active = !caracEval.active
        await caractereEvaluableStore.updateCaractereEvaluable(caracEval)
    } else {
        await caractereEvaluableStore.createCaractereEvaluable({
            competence_id: props.competence.id,
            caractere_evaluable_type_id: caracEvalTypeId,
            active: true
        })
    }
    emit('refreshCompetence')
}

</script>

<style scoped>
</style>
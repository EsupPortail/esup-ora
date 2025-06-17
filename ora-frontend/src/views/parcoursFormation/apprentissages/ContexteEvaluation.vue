<template>
    <v-row>
        <v-col>
            <h1>Situations professionnelles ou contexte d'évaluation</h1>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="6">
            <v-data-table hide-default-footer>
                <template v-slot:body>
                    <tr v-for="contextEval, index in competence.contexte_evaluation" 
                        style="padding-top: 10px; padding-bottom: 10px;"
                        :key="index"
                        draggable="true"
                        @dragstart="onDragStart($event, contextEval)"
                        @dragover.prevent
                        @drop="onDrop($event, contextEval)">
                        <td v-if="inputUpdate !== contextEval.id">
                            {{ contextEval.libelle }}
                        </td>
                        <td v-else>
                            <v-text-field
                                variant="outlined"
                                density="compact"
                                v-model="contextEval.libelle"
                                @blur="updateContextEval(contextEval)"
                                @keyup.enter="updateContextEval(contextEval)"
                            ></v-text-field>
                        </td>
                        <td>
                            <v-btn 
                                :icon="(inputUpdate) ? 'mdi-check' : 'mdi-pencil'"
                                :color="(inputUpdate) ? 'success' : ''"
                                size="x-small"
                                @click="(inputUpdate) ? updateContextEval(contextEval) : inputUpdate = contextEval.id"
                            ></v-btn>                            
                            <v-btn icon="mdi-arrow-all" size="x-small" style="margin-left: 6px;"></v-btn>
                            <v-btn color="" icon="mdi-delete" size="x-small" style="margin-left: 6px;" @click="deleteContextEval(contextEval)"></v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <v-text-field
                                class="mt-3"
                                variant="outlined"
                                density="compact"
                                v-model="newContextEval"
                                @keyup.enter="addContextEval"
                            ></v-text-field>
                        </td>
                        <td>
                            <v-btn
                                icon="mdi-plus"
                                color="success"
                                @click="addContextEval"
                            >
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue'
import { useCompetenceStore } from '@/stores/competenceStore';

const competenceStore = useCompetenceStore()

const props = defineProps({
    competence: Object
})
const newContextEval = ref('')
const inputUpdate = ref(null)
const draggedContextEval = ref(null)

const addContextEval = async () => {
    const ordre = props.competence.contexte_evaluation.length + 1
    const contextEval = await competenceStore.addContexteEvaluation(props.competence.id, {libelle: newContextEval.value, ordre: ordre})
    props.competence.contexte_evaluation.push(contextEval)
    newContextEval.value = ''
}

const deleteContextEval = async (contextEval) => {
    await competenceStore.deleteContexteEvaluation(contextEval)
    props.competence.contexte_evaluation = props.competence.contexte_evaluation.filter(ce => ce.id !== contextEval.id)
    await normalizeOrdre()
}

const updateContextEval = async (contextEval) => {
    await competenceStore.updateContexteEvaluation(contextEval)
    inputUpdate.value = null
}

const onDragStart = (event, contextEval) => {
    draggedContextEval.value = contextEval
}

const onDrop = async (event, contextEval) => {
    if (draggedContextEval.value && contextEval.id !== draggedContextEval.value.id) {
        const ordre = contextEval.ordre
        contextEval.ordre = draggedContextEval.value.ordre
        draggedContextEval.value.ordre = ordre
        await competenceStore.updateContexteEvaluation(contextEval)
        await competenceStore.updateContexteEvaluation(draggedContextEval.value)
        props.competence.contexte_evaluation.sort((a, b) => a.ordre - b.ordre)
    }
}

// Check if all ordre are in order with no gaps, if not, normalize them
const normalizeOrdre = async () => {
    const contextEvals = props.competence.contexte_evaluation
    for (let i = 0; i < contextEvals.length; i++) {
        if (contextEvals[i].ordre !== i + 1) {
            contextEvals[i].ordre = i + 1
            await competenceStore.updateContexteEvaluation(contextEvals[i])
        }
    }
}

const contextEvals = [
    {
        id: 1,
        libelle: 'Elaborer une application informatique',
    },
    {
        id: 2,
        libelle: 'Faire évoluer une application',
    },
    {
        id: 3,
        libelle: 'Maintenir en conditions opérationnelles une application informatique',
    }
]

</script>

<style scoped>
</style>
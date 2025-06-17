<template>
    <v-breadcrumbs-item
        :to="to()"
        :active="isActive()"
        class="text-subtitle-2 crumb-item"
        active-class="activeAriane"
        :disabled="!isEnable()"
        exact
      >
        <v-btn class="ma-2 btnAriane " rounded>
            {{ getLabel() }}
        </v-btn>
      </v-breadcrumbs-item>
</template>

<script setup>
import { watch, defineProps } from 'vue'
import { useParcoursStore } from '@/stores/parcoursStore';
import { useFormationStore } from '@/stores/formationStore';
import { useRoute } from 'vue-router';

const route = useRoute()
const parcoursStore = useParcoursStore()
const formationStore = useFormationStore()

const props = defineProps({
    item: Object
})

const isActive = () => {
    return route.name === props.item.name
}

const isEnable = () => {
    // return route.meta.ariane.order >= props.item.meta.ariane.order
    return true
}

const to = () => {
    const to = {
        name: props.item.name
    }
    if (props.item.meta.ariane.param) {
        to.params = getParams(props.item.meta.ariane.param)
        if(to.params === null) {
            return null
        }
    }
    return to
}

watch(() => route, () => {
    saveParams()
})

const getParams = (param) => {
    switch (param) {
        case 'idVersion':
            return { idVersion: parcoursStore.versionSelected.id }
            break;
        case 'idParcours':
            return { idParcours: parcoursStore.parcoursSelected.id }
            break;
        case 'idFormation':
            return { idFormation: formationStore.formationSelected.id }
            break;
        default:
            return null
            break;
    }
}
const getLabel = () => {
    const parametre = formationStore.formationSelected.composante.parametre
    let label = props.item.meta.ariane.label
    switch (props.item.meta.ariane.code) {
        case 'competence':
            label = parametre.semantique_competence || label;
            break;
        case 'apprentissageCritiques':
            label = parametre.semantique_apprentissage || label;
            break;
        case 'bcc':
            label = parametre.semantique_bcc || label;
            break;
        case 'elementsConstitutifs':
            label = parametre.semantique_ec || label;
            break;
        default:
            break;
    }

    return label
}

</script>

<style scoped>

.activeAriane .btnAriane {
    color: rgb(var(--v-theme-on-primary));
    background-color: rgba(9, 29, 85, 0.957);
}

</style>
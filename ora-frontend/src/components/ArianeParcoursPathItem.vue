<template>
    <v-breadcrumbs-item
        :to="to()"
        divider=""
        :active="isActive()"
        class="text-subtitle-2 crumb-item d-flex align-center no-underline"
        active-class="activeAriane"
        :disabled="!isEnable()"
        exact
        :style="'text-decoration: none; ' + props.item.meta.ariane.order !== 1 ? 'margin-left: 60px;' : ''"
    >
        <v-icon
            v-if="item.meta.ariane.icon"
            class="mr-2"
            style="color: #091D55F4; font-size: 24px; align-self: center; margin-right: 0px;"
        >
            {{ item.meta.ariane.icon }}
        </v-icon>
        <span
            class="ma-2"
            :style="`font-size: 18px; color: #091D55F4; align-self: center; padding-bottom: 6px;${isActive() ? ' border-bottom: 2px solid #12255B' : ''}`"
        >
            {{ getLabel() }}
        </span>
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

<style>

.activeAriane .btnAriane {
    color: rgb(var(--v-theme-on-primary));
    background-color: rgba(9, 29, 85, 0.957);
}

.no-underline-hover {
  text-decoration: none !important;
}

.no-underline-hover:hover {
  text-decoration: none !important;
}

v-breadcrumbs-item a {
  text-decoration: none !important;
}

.v-breadcrumbs-item a:hover {
  text-decoration: none !important;
}
</style>
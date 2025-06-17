<template>
    <div v-if="label">
        {{ label }}
    </div>
    <v-row>
        <v-col v-if="leftLabel" cols="1" no-gutters style="text-align: right">
            <strong>{{ leftLabel }}</strong>
        </v-col>
        <v-col :cols="(leftLabel) ? 10 : 11">
            <v-progress-linear
            :model-value="(props.current/props.max)*100"
            :color="color"
            :bg-color="bgColor"
            height="25"
        >
            <template v-slot:default="{ value }">
                <v-row no-gutters>
                    <v-col offset="11">
                        {{ props.max }}
                    </v-col>
                </v-row>
                    
            </template>
        </v-progress-linear>
        </v-col>
        <v-col no-gutters style="padding-left: 0;">
            <strong>{{ current }}</strong>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    label: {
        type: String,
        default: null
    },
    leftLabel: {
        type: String,
        default: null
    },
    current: {
        type: Number,
        default: 50
    },
    max: {
        type: Number,
        default: 100
    },
    color: {
        type: String,
        default: 'green-darken-1'
    },
    bgColor: {
        type: String,
        default: 'green-lighten-2'
    }
})

</script>

<style scoped>
</style>
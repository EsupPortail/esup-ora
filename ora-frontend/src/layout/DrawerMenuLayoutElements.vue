<template>

    <v-list-item
        v-if="isString(item)"
        :to="item"
        :key="item"
        :title="index"
        link
    ></v-list-item>

    <v-list-group
        v-else
        :value="index"
    >
        <template v-slot:activator="{ props }">
            <v-list-item
                :title="index"
                v-bind="props"
            ></v-list-item>
        </template>

        <DrawerMenuLayoutElements
            v-for="(subItem, subIndex) in item"
            :item="subItem"
            :index="subIndex"
            :key="subIndex"
        />
    </v-list-group>

</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(
    {
        item: [String, Object],
        index: String
    }
)

const isString = (varToCheck) => typeof varToCheck === 'string'

</script>
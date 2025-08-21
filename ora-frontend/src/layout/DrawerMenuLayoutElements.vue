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
                :title="isExpandedReactiv ? index : ''"
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
        index: String,
        isExpanded: {
            type: Boolean,
            default: false
        }
    }
)
const isExpandedReactiv = ref(props.isExpanded)
console.log(props.isExpanded)
const isString = (varToCheck) => typeof varToCheck === 'string'
import { watch } from 'vue'

watch(
    () => props.isExpanded,
    (newVal, oldVal) => {
        isExpandedReactiv.value = newVal
    }
)
</script>
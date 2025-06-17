<template>
    <v-data-table 
        :items="items"
        :headers="headers"
        :loading="loading"
        item-value="id"
        hover
    >

        <template v-slot:top>
            <v-toolbar>
                <v-toolbar-title>
                    <v-btn
                        color="success"
                        variant="elevated"
                        @click="isAdd = true"
                    >
                        Nouveau
                    </v-btn>
                    <v-btn
                        @click="$emit('refreshEvent', entity)"
                        class="ms-2"
                        color="grey"
                        icon="mdi-refresh"
                    >
                    </v-btn>
                </v-toolbar-title>
            </v-toolbar>
        </template>

        <template v-slot:item="{ item }">
            <tr v-if="item.id !== itemToEdit.id">
                
                <template
                    v-for="field in headers"
                    :key="field.key"
                >
                    <td v-if="field.type === 'select'">
                        {{ item[field.key]?.[field.select.title] || item[field.key]?.libelle }}
                    </td>
                    <td v-else-if="field.key !== 'actions'">
                        {{ item[field.key] }}
                    </td>
                </template>

                <td>
                    <v-btn
                        size="small"
                        color="primary"
                        variant="text"
                        icon="mdi-pencil"
                        @click="editItem(item)"
                    ></v-btn>
                    <v-dialog max-width="400" activator="#delete-item-target">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn
                            v-bind="activatorProps"
                            size="small"
                            color="red"
                            icon="mdi-delete"
                            variant="text"
                            ></v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <v-card>
                                <v-card-title>Suppression</v-card-title>
                                <v-card-text>
                                    Voulez-vous vraiment supprimer {{ item.libelle }} ?<br>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn @click="isActive.value = false">Annuler</v-btn>
                                    <v-btn color="error" variant="flat" @click="$emit('deleteItemEvent', item); isActive.value = false">Confirmer</v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-dialog>
                </td>
            </tr>
            <tr v-else>
                
                <template
                    v-for="field in headers"
                    :key="field.key"
                >
                    <td v-if="field.key !== 'actions'">
                        <v-select
                            v-if="field.type === 'select'"
                            :items="selectList[field.key]"
                            v-model="itemToEdit[field.key]"
                            :item-title="field.select.title || 'libelle'"
                            :item-value="field.select.key || 'id'"
                            :label="field.title"
                        ></v-select>

                        <v-text-field
                            v-else
                            v-model="itemToEdit[field.key]"
                            :label="field.title"
                            :type="field.type || 'text'"
                            @keyup.enter="updateItem"
                        ></v-text-field>
                    </td>
                </template>
                
                <td>
                    <v-btn
                        color="success"
                        variant="text"
                        icon="mdi-check-circle"
                        @click="updateItem"
                    ></v-btn>
                    <v-btn
                        color="red"
                        variant="text"
                        icon="mdi-close"
                        @click="itemToEdit = {}"
                    ></v-btn>
                    
                </td>
            </tr>
        </template>

        <template v-if="isAdd" v-slot:body.prepend>
            <tr>
                
                <td 
                    v-for="field in headers"
                    :key="field.key"
                >
                    

                    <v-btn v-if="field.key === 'actions'"
                        @click="createItem"
                        color="success"
                    >
                    <v-icon left>mdi-plus</v-icon>
                    </v-btn>

                    <v-select
                        v-else-if="field.type === 'select'"
                        :items="selectList[field.key]"
                        v-model="itemToAdd[field.key]"
                        :item-title="field.select.title || 'libelle'"
                        :item-value="field.select.key || 'id'"
                        :label="field.title"
                    ></v-select>

                    <v-text-field v-else
                        v-model="itemToAdd[field.key]"
                        :label="field.title"
                        :type="field.type || 'text'"
                        @keyup.enter="createItem"
                    ></v-text-field>
                </td>
                
            </tr>
        </template>
    </v-data-table>
    <!-- {{ selectList[0] }} -->
    <!-- {{ headers }} -->
</template>

<script setup>
import DynamicInput from './DynamicInput.vue'
import { defineProps, ref } from 'vue'

const isAdd = ref(false)
const itemToEdit = ref({id:null})

const props = defineProps({
    items: Array,
    headers: Array,
    selectList: Object,
    entity: String,
    loading: Boolean
})
const emit = defineEmits(['createItemEvent', 'deleteItemEvent', 'updateItemEvent', 'refreshEvent'])

const itemToAdd = ref({})

const editItem = (item) => {
    itemToEdit.value = { ...item }
}
const createItem = () => {
    console.log('create', itemToAdd.value)
    // check if value must be a number with field.type === 'number' and parse it
    let itemToCreate = parseItem(itemToAdd.value)
    emit('createItemEvent', itemToCreate);
    isAdd.value = false;
    itemToAdd.value = {};
}

const updateItem = () => {
    let itemToUpdate = parseItem(itemToEdit.value)
    emit('updateItemEvent', itemToUpdate);
    itemToEdit.value = {}
}

const parseItem = (item) => {
    for (const field of props.headers) {
        if (field.type === 'number') {
            item[field.key] = parseInt(item[field.key])
        }
    }
    return item
}

</script>

<style scoped>
</style>

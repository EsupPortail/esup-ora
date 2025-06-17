<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>{{ state.connected }}</h1>
            </div>
        </div>
        <div class="row">
            <table>
                <thead>
                    <tr>
                        <th>
                            Niveaux de développement
                        </th>
                        <th>
                            Apprentissages critiques
                        </th>
                        <th>
                            <table>
                                <tr>
                                    <template v-for="domaine in data.domaineRessources" :key="domaine.code">
                                        <td class="columnDomain">
                                            <div class="domain">
                                                {{ domaine.libelle }}
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </table>
                        </th>
                    </tr>
                </thead>
                <template v-for="aC in data.apprentissageCritiques" :key="aC.code">
                    <tr>
                        <td>
                            {{ aC.idNiveau }}
                        </td>
                        <td>
                            {{ aC.libelle }}
                        </td>
                        <td>
                            <table>
                                <tr>
                                    <template v-for="domaine in data.domaineRessources" :key="domaine.code">
                                        <td>
                                            <div class="square" :class="isSelected(domaine.code, aC.code) ? 'squareSelected' : ''"
                                            @click="addDomaineRessourceSelection(domaine.code, aC.code)"></div>

                                        </td>
                                    </template>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </template>
                <tr>
                </tr>
            </table>
        </div>
        <h3>Éléments sélectionnés</h3>
        <template v-for="tS in tableSelection" :key="tS">
            <p>{{ tS }}</p>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { data } from '@/mocks/data.js';

const tableSelection = ref(state.tableSelection);



const isSelected = (domaine, apprentissage) => {
    return tableSelection.value.includes(domaine+ "-" + apprentissage);
}


const addDomaineRessourceSelection = (domaine, apprentissage) => {
    if (!tableSelection.value.includes(domaine+ "-" + apprentissage)) {
        tableSelection.value.push(domaine+ "-" + apprentissage)
    } else {
        tableSelection.value = tableSelection.value.filter(item => item != (domaine+ "-" + apprentissage));
    }
}
// État sélectionné

</script>

<style>

.square {
    width: 30px;
    height: 30px;
    background-color: gray;
}

.squareSelected {
    background-color: yellow !important;
}

.columnDomain {
    writing-mode: vertical-lr;
    width: 30px;
}

.domain {
    transform: rotate(180deg);
    text-align: left;
    /*transform: rotate(180deg);
    margin-right: 10px; */
}
</style>
<template>
    <v-footer height="80" inset class="bg-blue-darken-4 footer">
        <v-container>
            <v-row justify="center" no-gutters>
                <v-col class="text-center" cols="12">
                        <v-img
                            class="inline mr-4"
                            :width="width"
                            :src="unicaenImg"
                        ></v-img>
                        <v-img
                            class="inline"
                            :width="width"
                            :src="republiqueImg"
                        ></v-img>
                </v-col>
            </v-row>
        </v-container>
        
    </v-footer>
</template>

<script setup>
import republiqueImg from '@/assets/republique-francaise-logo.svg'
import unicaenImg from '@/assets/unicaen-logo-blanc.svg'

const width = 60

</script>

<style scoped>
.footer {
    position: fixed;
    z-index: 10;
    bottom: 0;
    width: 100%;
}

.inline {
    display: inline-block;
}
</style>

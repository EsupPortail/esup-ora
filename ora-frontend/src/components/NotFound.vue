<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="8">
                <v-alert style="min-height: 50vh;" type="warning">
                    <h1 class="text-center">404</h1>
                    <h2 class="text-center">Page Not Found</h2>
                    <p class="text-center">The page you are looking for does not exist.</p>
                    <v-btn color="primary" block @click="goBack">Go Back</v-btn>
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>
        
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
    router.go(-1);
};
</script>

<style scoped>
</style>
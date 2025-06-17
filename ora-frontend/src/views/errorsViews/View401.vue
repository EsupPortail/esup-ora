<template>
    <p>Test</p>
</template>


<script>

import {getApiRequest} from '../../helpers/api/get.js';
import {config} from '../../environment/environment';
import {backendRoutes} from '../../environment/backendRoutes';

export default {

    data() {
    },
    created() {
        this.doFirstCallAPI();
    },
    methods: {
        async doFirstCallAPI() {
            const routeTestGuardian = config.backend.url + backendRoutes.testGuardian;
            let result = null;
            console.log(routeTestGuardian)
            console.log('Starting test guardian request');
            let response = await getApiRequest( routeTestGuardian );
            
        }
    }
}
</script>
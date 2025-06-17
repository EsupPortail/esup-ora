<template>
  <div>
    <SimpleTable />
  </div>
</template>


<script>

import SimpleTable from '../../core/sharedComponents/Table/SimpleTable.vue';
import {getApiRequest} from '../helpers/api/get.js';
import {config} from '../environment/environment.js';
import {backendRoutes} from '../environment/backendRoutes.js';

export default {

    data() {
        dataTable: []
    },
    created() {
        this.doFirstCallAPI();
    },
    methods: {
        async doFirstCallAPI() {
            console.log( config.backend.url );
            console.log( backendRoutes.composantes );
            const routeCompetences = config.backend.url + backendRoutes.composantes;
            let result = null;
            getApiRequest( routeCompetences )
                .then( );
        }
    }
}
</script>
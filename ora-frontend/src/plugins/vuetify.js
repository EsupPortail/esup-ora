import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'


// Importation de FontAwesome | TODO : Est-ce qu'on en a besoin ? On peut utiliser mdi nativement
// import { aliases, fa } from 'vuetify/iconsets/fa-svg'
// import { library } from '@fortawesome/fontawesome-svg-core';
// import {fas }  from '@fortawesome/free-solid-svg-icons';
// import {far }  from '@fortawesome/free-regular-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// library.add( faCheck );
// library.add( faBars );
// End fontawesome



import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    defaults: {
        global: {
        },
        VBtn: { variant: 'elevated' },
    },
})

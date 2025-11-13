import { createApp } from 'vue'

import App from './App.vue'

import InlineSvgPlugin from 'vue-inline-svg';
import pinia from './plugins/pinia.js';
import vuetify from './plugins/vuetify.js';

import router from './router/router.js'

const app = createApp(App)

app.use(pinia);
app.use(vuetify);
app.use(router);

app.component('inline-svg', InlineSvgPlugin);

app.mount('#app');
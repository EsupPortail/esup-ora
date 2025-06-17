import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from './axios';

import { crudStorePlugin } from './crudStorePlugin.js';

const pinia = createPinia();

pinia.use(({ store }) => {
    store.$http = axios;
});
pinia.use(crudStorePlugin);
pinia.use(piniaPluginPersistedstate);

export default pinia
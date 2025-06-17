import { ref, type Ref } from 'vue';
import * as Types from './AuthenticationObject';
import { defineStore } from 'pinia';

export const useAuthenticationStore = defineStore('auhenticationData', {
    state: () => ({
        authenticationData: ref<Types.AuthenticationObject | null>(null)
    }),
    actions: {
        login(access: Types.AuthenticationObject) {
            return new Promise((resolve) => {
                this.authenticationData = access;
                resolve(access);
            })
        },
        logout() {
            this.authenticationData = null;
        }
    }
});

import { ref, type Ref } from 'vue';
import * as Types from './PopUpObject';
import { defineStore } from 'pinia';

export const usePopUpStore = defineStore('popupData', {
    state: () => ({
        popUpData: null as Types.PopUpObject | null
    }),
    actions: {
        print(popUpInformations: Types.PopUpObject) {
            return new Promise((resolve) => {
                this.popUpData = popUpInformations;
                resolve(popUpInformations);
            })
        },
        close() {
            this.popUpData = null;
        }
    }
});

import { defineStore } from 'pinia';
import * as Types from './PopUpObject';

export const usePopUpStore = defineStore('popupData', {
    state: () => ({
        popUpData: {
            isVisible: false,
            message: '',
            type: 'INFO'
        } as Types.PopUpObject
    }),
    actions: {
        print(popUpInformations: Types.PopUpObject) {
            this.popUpData = { ...popUpInformations, isVisible: true };
        },
        close() {
            this.popUpData.isVisible = false;
        }
    }
});
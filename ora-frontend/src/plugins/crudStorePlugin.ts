import type { PiniaPluginContext } from 'pinia';
import axios, { type AxiosResponse } from 'axios';
import { config } from '../environment/environment';
import type { Ref } from 'vue';
import { ref } from 'vue';

const backUrl = config.backend.url;

function constructUrl(...args: string[]) {
    const urlStrings = [backUrl, ...args];
    return urlStrings.join('/');
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        /**
         * 
         * @param entity Nom de l'entité à récupérer
         * @param getParams Paramètres de la requête GET
         * @returns 
        */
        getCollection: (entity: string, ...getParams: any) => Promise<any>,
        get: (entity: string, id: string, ...getParams: any) => Promise<any>,
        create: (entity: string, data: any) => Promise<any>,
        update: (entity: string, data: any) => Promise<any>,
        delete: (entity: string, data: any) => Promise<any>,
    }
    export interface PiniaCustomStateProperties<S> {
        loading: boolean,
        error: Boolean | Object,
    }
}

export function crudStorePlugin(context: PiniaPluginContext) {

    context.store.$state.loading = false
    context.store.$state.error = false

    context.store.get = async (entity: string, id: string, getParams: any = {}) => {
        return new Promise((resolve, reject) => {
            context.store.$state.loading = true;
            axios.get(constructUrl(entity, id), { params: getParams })
            .then((res: AxiosResponse) => {
                resolve(res.data);
            })
            .catch((err) => {
                context.store.$state.error = {
                    message: err.message,
                    time: new Date()
                }
                reject(err);
            })
            .finally(() => {
                context.store.$state.loading = false;
            })
        })
    }

    context.store.getCollection = async (entity: string, getParams: any = {}) => {
        return new Promise((resolve, reject) => {
            context.store.$state.loading = true;
            axios.get(constructUrl(entity), { params: getParams })
            .then((res: AxiosResponse) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.error(err)
                context.store.$state.error = {
                    message: err.message,
                    time: new Date()
                }
                reject(err);
            })
            .finally(() => {
                context.store.$state.loading = false;
            })
        })
    }

    context.store.create = async (entity: string, data: any) => {
        return new Promise((resolve, reject) => {
            context.store.$state.loading = true;
            axios.post(constructUrl(entity), data)
            .then((res: AxiosResponse) => {
                resolve(res.data);
            })
            .catch((err) => {
                context.store.$state.error = {
                    message: err.message,
                    time: new Date()
                }
                reject(err);
            })
            .finally(() => {
                context.store.$state.loading = false;
            })
        })
    }

    context.store.update = async (entity: string, data: any) => {
        return new Promise((resolve, reject) => {
            context.store.$state.loading = true;
            axios.put(constructUrl(entity, data.id), data)
            .then((res: AxiosResponse) => {
                resolve(res.data);
            })
            .catch((err) => {
                context.store.$state.error = {
                    message: err.message,
                    time: new Date()
                }
                reject(err);
            })
            .finally(() => {
                context.store.$state.loading = false;
            })
        })
    }

    context.store.delete = async (entity: string, data: any) => {
        return new Promise((resolve, reject) => {
            context.store.$state.loading = true;
            axios.delete(constructUrl(entity, data.id))
            .then((res: AxiosResponse) => {
                resolve(res.data);
            })
            .catch((err) => {
                context.store.$state.error = {
                    message: err.message,
                    time: new Date()
                }
                reject(err);
            })
            .finally(() => {
                context.store.$state.loading = false;
            })
        })
    }
}
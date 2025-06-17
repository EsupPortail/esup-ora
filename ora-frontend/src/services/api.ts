import axios from 'axios'

// A recup d'une conf
const baseUrl = "http://localhost:1111/api"

function getEntity(entity: string, id: number) {
    return axios.get(baseUrl + '/' + entity + '/' + id);
}

function getEntities(entity: string) {
    return axios.get(baseUrl + '/' + entity)
}

function addEntity(entity: string, data: any) {
    return axios.post(baseUrl + '/' + entity, data)
}

export {
    getEntities,
    getEntity,
    addEntity
}
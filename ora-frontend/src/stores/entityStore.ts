import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useEntityStore = defineStore('entity', () => {
    const entities: any = []

    const getEntity = computed(() => (entity: string, id: number) => {
        return entities.hasOwnProperty(entity) ? entities[entity][id] : null
    })
    const getEntities = computed(() => (entity: string) => {
        return entities.hasOwnProperty(entity) ? entities[entity] : []
    })
    const setEntities = (entity: string, data: any) => {
        entities[entity] = data
    }
    const addEntity = (entity: string, data: any) => {
        if (!entities.hasOwnProperty(entity)) {
            entities[entity] = []
        }
        entities[entity].push(data)
    }

    return {
        getEntity,
        getEntities,
        setEntities,
        addEntity
    }
})

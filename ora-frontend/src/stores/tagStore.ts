import { defineStore } from 'pinia'

import { useParcoursStore } from './parcoursStore'

export const useTagStore = defineStore('tags', {
    state: () => ({
        entity: 'tags',
        tags: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {

    },
    actions: {
        fetchAllTags(){
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity, { include: { parametre: true}})
                .then((res) => {
                    this.tags = res.data
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        createTag(tag: any){
            return new Promise((resolve, reject) => {
                this.create(this.entity, tag)
                .then((res) => {
                    this.tags.push(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        updateTag(tag: any){
            return new Promise((resolve, reject) => {
                const { parametre, ...cleanTag } = tag

                this.update(this.entity, cleanTag)
                .then(async (res) => {
                    await this.fetchAllTags()
                    const updated = res.data
                    resolve(updated)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        },
        deleteTag(tag: any){
            return new Promise((resolve, reject) => {
                this.delete(this.entity, tag)
                .then((res) => {
                    this.tags = this.tags.filter((e) => e.id !== tag.id)
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    }
})

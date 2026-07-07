import { defineStore } from 'pinia'

export const useUnsubscribedNotificationsStore = defineStore('unsubscribedNotifications', {
    state: () => ({
        entity: 'user_unsubscribed_notifications',
        unsubscribers: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getUnsubscribers(state): any {
            return state.unsubscribers
        }
    },
    actions: {
        createUnsubscriber(unsubscriber: any) {
            this.create(this.entity, unsubscriber)
                .then((res) => {
                    this.unsubscribers.push(res.data)
                })
                .catch((err) => {
                })
        },
        updateUnsubscriber(unsubscriber: any) {
            this.update(this.entity, unsubscriber)
                .then((res) => {
                    const updated = res.data
                    this.unsubscribers = this.unsubscribers.map((e) => {
                        if (e.id === updated.id) {
                            return updated
                        }
                        return e
                    })
                })
                .catch((err) => {
                })
        },
        deleteUnsubscriber(unsubscriber: any) {
            this.delete(this.entity, unsubscriber.id)
                .then((res) => {
                    this.unsubscribers = this.unsubscribers.filter((e) => e.id !== unsubscriber.id)
                })
                .catch((err) => {
                })
        },
        fetchUnsubscriber() {
            return new Promise((resolve, reject) => {

                this.getCollection(this.entity)
                    .then((res) => {
                        this.unsubscribers = res.data
                        resolve(true)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    }
})

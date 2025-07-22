import { defineStore } from 'pinia'

export const useNiveauxApprentissagesStore = defineStore('niveau', {
    state: () => ({
        entity: 'niveau',
        bccs: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getAllCompetence(state): any {
            return state.bccs
        }
    },
    actions: {
        fetchNiveauById( niveauId: string ) {
            return new Promise((resolve, reject) => {
                this.get('niveau', niveauId, {
                    include: {
                        apprentissage_critique: true,
                        parcours: true
                    }
                }
            )
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    }
})

import { defineStore } from 'pinia'

export const useComposanteStore = defineStore('composante', {
    state: () => ({
        entity: 'composante',
        composantes: [] as any[],
        loading: false as boolean,
        error: false as Boolean | Object
    }),
    getters: {
        getComposantes(state): any {
            return state.composantes
        },
        getComposanteById: (state) => (id: number) => {
            return state.composantes.find((e) => e.id === id)
        },
        getParameterByComposanteId: (state) => (id: number) => {
            const comp = state.composantes.find((e) => e.id === id)
            if(comp?.parametre) {
                return comp.parametre
            }else if(comp?.etablissement?.parametre) {
                return comp.etablissement.parametre
            }
            return null
        },
        getComposanteByLibelle(libelle) {
            return this.composantes.find(composante => composante.libelle === libelle);
        },
        getComposantesByEtablissement: (state) => (etablissement: any) => {
            if(!etablissement) {
                return []
            }
            let composantes = state.composantes.filter((e) => e.etablissement_id === etablissement.id)
            // if composantes.parametre is empty, add the one from etablissementId
            composantes.forEach((e) => {
                if (!e.parametre) {
                    e.parametre = etablissement.parametre
                }
            })
            return composantes
        },
        getComposanteLibelleById: (state) => (id: number) => {
            return state.composantes.find((e) => e.id === id)?.libelle
        }
    },
    actions: {
        createComposante(composante: any) {
            return new Promise((resolve, reject) => {
                composante.parametre_id = composante.parametre;
                delete composante.parametre;
                this.create(this.entity, composante)
                .then((res) => {
                    this.composantes.push(res.data)
                    const thisComposante = this.composantes.find(composante => composante.libelle === res.data.libelle);
                    resolve(res.data)
                })
                .catch( (err) => {
                    reject(err)
                })
            })
        },
        updateComposante(composante: any) {
            if (typeof composante.parametre.connect.id !== 'number' ) {
                const id_to_take = composante.parametre.connect.id.id;
                delete composante.parametre.connect.id;
                composante.parametre.connect.id = id_to_take;
            }
            this.update(this.entity, composante)
            .then((res) => {
                const updated = res.data
                this.composantes = this.composantes.map((e) => {
                    if (e.id === updated.id) {
                        return updated
                    }
                    return e
                })
            })
            .catch((err) => {
            })
        },
        deleteComposante(composante: any) {
            this.delete(this.entity, composante)
            .then((res) => {
                this.composantes = this.composantes.filter((e) => e.id !== composante.id)
            })
            .catch((err) => {
            })
        },
        async fetchComposanteByEtablissement(etablissementId: number) {
            return new Promise((resolve, reject) => {
                this.getCollection(this.entity,
                    {
                        'etablissement_id': `${etablissementId}`,
                        include: {
                            parametre: {
                                include: {
                                    type_diplomes: true,
                                }
                            },
                            etablissement: true,
                        }
                    }
                )
                .then((res) => {
                    this.composantes = res.data;
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err);

                })
            });
        }
    }
})

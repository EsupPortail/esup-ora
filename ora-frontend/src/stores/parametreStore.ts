import { defineStore } from 'pinia'

export const useParametreStore = defineStore('parametre', {
  state: () => ({
    entity: 'parametre',
    parametres: [] as any[],
    parametreElements: [] as any[],
    loading: false as boolean,
    error: false as Boolean | Object
  }),
  getters: {
    getParametres(state): any {
      return state.parametres
    },
    getParametreElements(state): any {
      return state.parametreElements
    },
    getParametreByFormation: (state) => (formationId: number) => {
      return state.parametres.filter((e) => e.formation_id === formationId)
    }
  },
  actions: {
    createParametre(parametre: any) {
      return new Promise((resolve, reject) => {
        this.create(this.entity, parametre)
          .then((res) => {
            this.parametres.push(res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    createParametreWithElement(parametre: any) {
      this.create('parametreWithElement', parametre)
        .then((res) => {
          this.parametres.push(res.data)
        })
        .catch((err) => {})
    },
    updateParametre(parametre: any) {
      return new Promise((resolve, reject) => {
        const oldMe = this.parametres.find((e) => e.id === parametre.id)

        const oldTDs = oldMe.type_diplomes.map((td: any) => td.id)
        const newTDs = parametre.type_diplomes.map((td: any) => td.id)
        const oldTags = oldMe.tags.map((tag: any) => tag.id)
        const newTags = parametre.tags.map((tag: any) => tag.id)

        // On enlève les champs type_diplomes et tags du parametre avant de spread
        const { type_diplomes, tags, ...rest } = parametre

        const payload = {
          ...rest,
          type_diplomes: {
            connect: newTDs.filter((id: any) => !oldTDs.includes(id)).map((id: any) => ({ id })),
            disconnect: oldTDs.filter((id: any) => !newTDs.includes(id)).map((id: any) => ({ id }))
          },
          tags: {
            connect: newTags.filter((id: any) => !oldTags.includes(id)).map((id: any) => ({ id })),
            disconnect: oldTags
              .filter((id: any) => !newTags.includes(id))
              .map((id: any) => ({ id }))
          }
        }

        this.update(this.entity, payload)
          .then((res) => {
            this.fetchParametres();
            resolve('true')
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteParametre(parametre: any) {
      this.delete(this.entity, parametre)
        .then((res) => {
          this.parametres = this.parametres.filter((e) => e.id !== parametre.id)
        })
        .catch((err) => {})
    },
    fetchParametres() {
      return new Promise((resolve, reject) => {
        this.getCollection(this.entity, {
          include: {
            type_diplomes: true,
            tags: true
          }
        })
          .then((res) => {
            this.parametres = res.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})

// stores/useSocketStore.ts
import { config } from '@/environment/environment'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'

import { useFormationStore } from './formationStore'
import { useCompetenceStore } from './competenceStore'
import { useApprentissageStore } from './apprentissageStore'
import { useEnseignementStore } from './enseignementStore'

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as Socket | null,
    isConnected: false,
    nbUsersInRoom: 0,
    usersInRoom: [] as Array<any>
  }),
  getters: {},
  actions: {
    async connect(formationId: string, firstname: string, lastName: string) {
      //   const socketUrl = `ws://${config.backend.socket}`
      this.socket = io(config.backend.protocole + '://' + config.backend.socket, {
        path: config.backend.pathSocket + '/',
        transports: ['websocket']
      })

      this.socket?.emit('connect-to-formation', {
        formationId: formationId,
        firstname: firstname,
        lastname: lastName
      })
      console.log(localStorage.getItem('roomId'))
      console.log(formationId)
      localStorage.setItem('roomId', formationId)
      console.log('User connected to room:', formationId)
      console.log(localStorage.getItem('roomId'))
      await this.getRoomUserCount(localStorage.getItem('roomId') as string).then((result: any) => {
        console.log(result)
        this.nbUsersInRoom = result.count
        this.usersInRoom = result.usersConnected
      })
      this.isConnected = true

      this.socket?.on('room-notification', async (data) => {
        await this.getRoomUserCount(localStorage.getItem('roomId') as string).then(
          (result: any) => {
            console.log(result)
            this.nbUsersInRoom = result.count
            this.usersInRoom = result.usersConnected
          }
        )
      })
      this.socket?.on('user-left', ({ firstname, lastname }) => {
        console.log(`User left: ${firstname} ${lastname}`)

        // Rafraîchir la liste
        const roomId = localStorage.getItem('roomId') as string
        if (!roomId) return

        this.getRoomUserCount(roomId).then((result: any) => {
          this.nbUsersInRoom = result.count
          this.usersInRoom = result.usersConnected
        })
      })
      this.socket?.on('need-refresh', (data) => {
        console.log(data);
        if( data.datamodel_element === 'competence') {
          console.log('receive need-refresh for competence')
          const competenceStore = useCompetenceStore()
          competenceStore.fetchCompetenceForSelectedVersion()
        } else if (data.datamodel_element === 'apprentissage_critique') {
          const apprentissageStore = useApprentissageStore();
          apprentissageStore.fetchElementsApprentissageByVersion();
        } else if( data.datamodel_element === 'enseignement') {
          const enseignementStore = useEnseignementStore()
          enseignementStore.fetchEnseignements()
        }
      })
    },
    notifyChange(element: string) {
      console.log(this.socket)
      if (this.socket === null) return -1
      console.log('contacting hote on... ', element)
      
      this.socket.emit('notify-change-on-datamodel', { elementToNotify: element })
    },
    getRoomUserCount(formationId: string) {
      return new Promise((resolve, reject) => {
        if (this.socket === null) return -1
        this.socket.emit('get-users-count', { formationId: formationId }, (result: JSON) => {
          resolve(result)
        })
      })
    },
    disconnect(formationId: string, firstname: string, lastName: string) {
      this.socket?.emit('disconnect-to-formation', {
        formationId: formationId,
        firstname: firstname,
        lastname: lastName
      })
      localStorage.removeItem('roomId')
      this.isConnected = false
      this.socket = null
    }
  }

  //   function disconnect() {
  //     if (socket.value) {
  //       socket.value.disconnect();
  //       socket.value = null;
  //       isConnected.value = false;
  //     }
  //   }

  //   function emitApiCall(formationId: string) {
  //     socket.value?.emit("api-call", formationId);
  //   }

  //   return {
  //     socket,
  //     isConnected,
  //     connect,
  //     disconnect,
  //     emitApiCall,
  //   };
})

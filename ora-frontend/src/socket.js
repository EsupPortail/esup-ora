import { reactive } from "vue";
import { io } from "socket.io-client";
import { config } from "./environment/environment";

// TODO : Implement the socket in pinia store

export const state = reactive({
  connected: false,
  tableSelection: [],
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = config.backend.socket || undefined;

export let socket = undefined;
if( URL !== undefined ) {
  socket = io(URL);
  socket.on("connect", () => {
    state.connected = true;
  });
  
  socket.on("disconnect", () => {
    state.connected = false;
  });
  
  socket.on("bar", (...args) => {
    state.barEvents.push(args);
  });
}


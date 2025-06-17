import { Router } from "express";
import { websocketController } from "../controllers/websocket.controller";

class WebsocketRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/getNbUsersConnectedInARoom", websocketController.getUsersConnected);
    // this.router.post("/connection", authentificationController.authLocalAccount);
  }
} 
  
export default new WebsocketRoutes().router;

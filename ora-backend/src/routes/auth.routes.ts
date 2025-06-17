import { Router } from "express";
import { authentificationController } from "../controllers/authentification.controller";

class AuthRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/shibboleth", authentificationController.authShibboleth);
    this.router.post("/local", authentificationController.authLocalAccount);
    this.router.get("/logout", authentificationController.logout);
    this.router.get("/me", authentificationController.getMyInfo);
  } 
} 
  
export default new AuthRoutes().router;

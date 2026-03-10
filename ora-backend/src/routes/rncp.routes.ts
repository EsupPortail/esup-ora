import { Router } from "express";
import { rncpController } from "../controllers/rncp.controller";

class RncpRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/search", rncpController.searchRncp);
  } 
} 
  
export default new RncpRoutes().router;
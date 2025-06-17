import { Router } from "express";
import { administrationController } from "../controllers/administration.controller";

class AdministrationRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/users", administrationController.getUsers);
    this.router.get("/roles", administrationController.getExistantsRoles);
    this.router.post("/changeRole", administrationController.changeRoleOfUser);
  } 
}

export default new AdministrationRoutes().router;

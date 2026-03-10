import { Router } from "express";
import { administrationController } from "../controllers/administration.controller";

class AdministrationRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/users", administrationController.getUsers);
    this.router.post("/addUser", administrationController.addUser);
    this.router.post("/delete-user", administrationController.deleteUser);
    this.router.get("/roles", administrationController.getExistantsRoles);
    this.router.post("/changeRole", administrationController.changeRoleOfUser);
    this.router.post("/addRole", administrationController.addRoleToUser);
    this.router.post("/removeRole", administrationController.removeRoleFromUser);
  } 
}

export default new AdministrationRoutes().router;

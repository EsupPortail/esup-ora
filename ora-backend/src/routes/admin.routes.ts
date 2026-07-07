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
    this.router.post("/addClient", administrationController.addClient);
    this.router.get('/clients', administrationController.getClients);
    this.router.get('/open-endpoints', administrationController.getOpenEndpoints);  
    this.router.delete('/delete-client', administrationController.deleteClient);
  } 
} 

export default new AdministrationRoutes().router;

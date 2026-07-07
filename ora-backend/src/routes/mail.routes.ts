import { Router } from "express";
import { mailController } from "../controllers/mail.controller";

class MailRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/notify-mutualisation", mailController.notifyMutualisation);
  }
}

export default new MailRoutes().router;
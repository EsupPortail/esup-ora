import { Router } from "express";
import { welcome } from "../controllers/base.controller";
import { entityController } from "../controllers/entity.controller";
class BaseRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/", welcome);

    // handle all CRUD routes for prisma entities
    this.router.post('/parametreWithElement', entityController.parametreWithElement)
    this.router.use(entityController.handleRoute)
  }
}

export default new BaseRoutes().router;
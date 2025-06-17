import { Router } from "express";
import { exportController } from "../controllers/export.controller";

class ExportRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/getFormationAsPDF", exportController.getExportByPDF);
    this.router.get("/getFormationAsExcel", exportController.getExportByExcel);
  } 
} 
  
export default new ExportRoutes().router;

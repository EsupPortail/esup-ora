import { Application, Request, Response } from "express";
import baseRoutes from "./base.routes";
import authRoutes from "./auth.routes";
import exportRoutes from "./export.routes";
import adminRoutes from "./admin.routes";
import websocketRoutes from "./websocket.routes";
import { logger } from "../configs/logger";
import { time } from "console";

export default class Routes {

    constructor(app: Application) {
 
        // Log each request to the console by method and path | Development only
        if(process.env.NODE_ENV === "development") {
            app.use((req: Request, res: Response, next: any) => {
                logger.info(`${req.method} ${req.path} ${JSON.stringify(req.query)}`);
                next();
            });
        }
        
        // Base routes of API
        app.use("/api", baseRoutes);
 
        // Auth routes
        app.use("/api/auth", authRoutes);

        app.use("/api/export", exportRoutes);

        app.use("/api/websocket", websocketRoutes);

        // Administration routes
        app.use("/api/admin", adminRoutes);

        // 404
        app.use(this.NotFoundRoute)
        // 5XX
        app.use(this.errorHandler)
    }

    private NotFoundRoute(req : Request, res : Response) {
        res.status(404).json({ message: "Route not found" });
    }

    private errorHandler(err: any, req: Request, res: Response, next: any) {
        logger.error(err.stack);
        res.status(500).json({
            timestamp: time(),
            message: err.message,
            error: err 
        });
    }

}
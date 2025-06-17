import loadEnv from "./middlewares/loader";
loadEnv()

import fs from "fs";
import express, { Application } from "express";
import http from "http";
import https from "https";
import {logger} from "./configs/logger";
import Server from "./app";
// import { Server as SocketIOServer } from 'socket.io';
import { SocketService } from "./services/socket.service";

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 1111;
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';

const certPath = '/certs-ora-backend';
const keyFile = `${certPath}/tls.key`;
const certFile = `${certPath}/tls.crt`;
const ssl = (fs.existsSync(keyFile) && fs.existsSync(certFile));

const options = (ssl) ? {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile)
}: {};

const server = (ssl) ? https.createServer(options, app) : http.createServer(app);

if( ssl ) {
    logger.info('SSL is activated.');
}

//Init du singleton SocketService
SocketService.initInstance(server);

if( process.env.NODE_ENV !== 'test' ) {
    logger.info('Starting server...');
    if (process.env.NODE_ENV === 'production') {
        server.listen(PORT, BACKEND_HOST, () => {
            logger.info(`Server is running on port ${BACKEND_HOST}:${PORT}`);
        });
    } else if( process.env.NODE_ENV === 'development' ) {
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${BACKEND_HOST}:${PORT}`);
        });
    };
}
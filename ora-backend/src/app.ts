import express, { Application } from 'express';
import cors, { CorsOptions } from "cors";
import cookieParser from 'cookie-parser';
import { logger } from './configs/logger';


import Routes from './routes/index'; 
import { interceptorHTTP } from './middlewares/interceptor.middleware';
import { interceptorNotification } from './middlewares/notify.middleware';
import { guardian } from './middlewares/guardian.middleware';
import { isAuthorized } from './middlewares/access-grants.middleware';

import pg from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import { createProxyMiddleware } from 'http-proxy-middleware';


class Server {

    constructor(app: Application) {
        this.config(app);
        new Routes(app);
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            credentials: true,
            allowedHeaders: ['Authorization', 'Content-Type'],
        };

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        const { Pool } = pg;
        let pgPool: pg.Pool;
        try {
            pgPool = new Pool({
                user: process.env.ORA_DATABASE_USER,
                password: process.env.ORA_DATABASE_PSWD,
                database: process.env.ORA_DATABASE_SECURITY_NAME,
                host: process.env.DATABASE_HOST,
                port: Number(process.env.DATABASE_PORT),
            });
            logger.info('Connexion PostgreSQL réussie');
        } catch (error) {
            logger.error('Erreur de connexion à PostgreSQL :', error);
        }

        app.use(session({
            store: new (connectPgSimple(session))({
                pool: pgPool,
                tableName: 'user_sessions',
                createTableIfMissing: true
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
            },
        }));
        logger.info('Session middleware initialized');

        logger.info('Interceptor middleware initialized');
        app.use(interceptorNotification);
        logger.info('Notification middleware initialized');

        app.use((req, res, next) => {
            if (req.url.startsWith('/api')) {
                guardian(true, req, res, next);
            } else {
                guardian(false, req, res, next);
            }
        });
        logger.info('Guardian frontend/backend middleware initialized');

        app.use(async (req, res, next) => {
            try {
                if (req.url.startsWith('/api')) {
                    const authorized = await isAuthorized(true, req, res, next);
                    if (authorized === 200) {
                        return next();
                    } else {
                        return res.status(403).json({
                            'code': authorized,
                            'response': 'HTTP Request Error : Access not granted. Insufficient privileges.',
                            'data': {
                                'type': 'insufficient_privileges'
                            }
                        });
                    }
                }
                return createProxyMiddleware({
                    target: process.env.ALLOW_ORIGIN,
                    timeout: 5000,
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: (path, req) => path
                })(req, res, next);
            } catch (error) {
                logger.error('Error in authorization middleware:', error);
                return res.status(500).json({
                    'code': 500,
                    'response': 'Internal Server Error',
                    'data': {
                        'type': 'internal_server_error'
                    }
                });
            }
        });

        logger.info('Proxy middleware initialized');
    }

}

export default Server;

import winston from 'winston';

const timezoned = (): string => {
    return new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
    });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: timezoned
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'warn' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({ format: timezoned}),
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export { logger };
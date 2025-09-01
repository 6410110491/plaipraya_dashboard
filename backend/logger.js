const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const { PostgresTransport } = require('@innova2/winston-pg');

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()} ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' }),

        new PostgresTransport({
            connectionString: process.env.DATABASE_URL,
            tableName: 'winston_logs',
            meta: true
        })
    ],
});

module.exports = logger;

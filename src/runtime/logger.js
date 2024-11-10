
import winston from 'winston';

class Logger {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'combined.log' })
            ]
        });
    }

    /**
     * Initializes the logger.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async init() {
        // Any asynchronous initialization if needed
        return Promise.resolve();
    }

    /**
     * Logs a message at the info level.
     * @function
     * @param {string} message - The message to log.
     */
    info(message) {
        this.logger.info(message);
    }

    /**
     * Logs a message at the error level.
     * @function
     * @param {string} message - The message to log.
     */
    error(message) {
        this.logger.error(message);
    }
}

export default Logger;
// main.js

import Transport from './src/runtime/transports/transport.js';
import Logger from './src/runtime/logger.js';
import EventEmitter from './src/runtime/events.js';

/**
 * Initializes and runs the main runtime process.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const runtime = async () => {
    const logger = new Logger();
    await logger.init();
    logger.info('Logger initialized.');

    const eventEmitter = new EventEmitter();

    const transport = new Transport();
    await transport.init();
    logger.info('Transport initialized.');

    setInterval(() => {
        transport.acquireSendData();
        logger.info('Data acquired and sent.');
        eventEmitter.emit('dataSent');
    }, 5000);

    eventEmitter.on('dataSent', () => {
        logger.info('Event: dataSent');
    });
};

/**
 * Entry point of the application.
 * Catches and logs any errors thrown during the execution of the runtime.
 * @function
 * @returns {void}
 */
runtime().catch((error) => {
    const logger = new Logger();
    logger.error(`Runtime error: ${error.message}`);
    console.error(error);
});
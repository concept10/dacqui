// main.js

import Transport from './transports/transport.js';

/**
 * Initializes and runs the main runtime process.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const runtime = async () => {
    
    
    const logger = new Logger();
    await logger.init();

    const transport = new Transport();
    await transport.init();

    setInterval(() => {
        transport.acquireSendData();
    }, 5000);
};

/**
 * Entry point of the application.
 * Catches and logs any errors thrown during the execution of the runtime.
 * @function
 * @returns {void}
 */
main().catch(console.error);

import dacqui from './dacqui.js';
import transportConfig from './config.js';

class Transport {
    constructor() {
        this.runtime = new dacqui(transportConfig);
    }

    async init() {
        await this.runtime.init();
    }

    acquireSendData() {
        this.runtime.acquireSendData();
    }
}

export default Transport;
// events.js

const EventEmitter = require('events');

class RuntimeEvents extends EventEmitter {
    constructor() {
        super();
        this.on('newListener', (event, listener) => {
        console.log(`New listener: ${event}`);
        });
    }
}

// Enumerate event names
const EVENTS = {
  INITIALIZED: 'initialized',
  DATA_SENT: 'dataSent',
  NEW_LISTENER: 'newListener',

};

module.exports = { RuntimeEvents, EVENTS };
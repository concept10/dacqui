// events.js

import { EventEmitter } from 'events';

const EVENTS = {
    INITIALIZED: 'initialized',
    DATA_SENT: 'dataSent',
    NEW_LISTENER: 'newListener',
    DATA_RECEIVED: 'dataReceived',
    ERROR: 'error',
    CONNECTION_ESTABLISHED: 'connectionEstablished',
    CONNECTION_CLOSED: 'connectionClosed',
};

class RuntimeEvents extends EventEmitter {
    constructor() {
        super();
        this.on(EVENTS.NEW_LISTENER, (event, listener) => {
            console.log(`New listener: ${event}`);
        });
    }

    initialize() {
        this.emit(EVENTS.INITIALIZED);
    }

    sendData(data) {
        this.emit(EVENTS.DATA_SENT, data);
    }

    receiveData(data) {
        this.emit(EVENTS.DATA_RECEIVED, data);
    }

    handleError(error) {
        this.emit(EVENTS.ERROR, error);
    }

    establishConnection() {
        this.emit(EVENTS.CONNECTION_ESTABLISHED);
    }

    closeConnection() {
        this.emit(EVENTS.CONNECTION_CLOSED);
    }
}

export { RuntimeEvents, EVENTS };
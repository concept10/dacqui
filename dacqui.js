// dacqui.js

import { RuntimeEvents, EVENTS } from './src/runtime/events';
import TransportFactory from './src/runtime/transports/transportFactory';

class Dacqui extends RuntimeEvents {
  constructor(transportConfig) {
    super();
    this.transport = TransportFactory.createTransport(transportConfig);
  }

  async init() {
    await this.transport.init();
    this.emit(EVENTS.INITIALIZED);
  }

  acquireSendData() {
    const sensorData = {
      timestamp: new Date(),
      value: Math.random() * 100,
    };

    this.transport.sendData(sensorData);
    this.emit(EVENTS.DATA_SENT, sensorData);
  }
}

export default Dacqui;

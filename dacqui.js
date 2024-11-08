// dataAcquisitionRuntime.js
const EventEmitter = require('events');
const TransportFactory = require('./transportFactory');

class dacqui extends EventEmitter {
  constructor(transportConfig) {
    super();
    this.transport = TransportFactory.createTransport(transportConfig);
  }

  async init() {
    await this.transport.init();
    this.emit('initialized');
  }

  acquireSendData() {
    // Simulate asynchronous data polling from devices
    const sensorData = {
      timestamp: new Date(),
      value: Math.random() * 100,
    };

    // Send acquired data using the configured transport
    this.transport.sendData(sensorData);
    this.emit('dataSent', sensorData);
  }
}

module.exports = dacqui;

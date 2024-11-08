// dataAcquisitionRuntime.js
const TransportFactory = require('./transportFactory');

class daqui {
  constructor(transportConfig) {
    this.transport = TransportFactory.createTransport(transportConfig);
  }

  async init() {
    await this.transport.init();
  }

  acquireSendData() {
    // Simulate asynchronous data polling from devices
    const sensorData = {
      timestamp: new Date(),
      value: Math.random() * 100,
    };

    // Send acquired data using the configured transport
    this.transport.sendData(sensorData);
  }
}

module.exports = dacqui;

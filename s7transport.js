// transports/s7Transport.js

const net = require('net');
const EventEmitter = require('events');

class S7Transport extends EventEmitter {
  constructor(host, port) {
    super();
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log('Connected to PLC');
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('Connection error:', err);
        reject(err);
      });
    });
  }

  sendConnectionRequest() {
    const connectionRequest = Buffer.from([
      0x03, 0x00, 0x00, 0x16, 0x11, 0xE0, 0x00, 0x00, 0x00, 0x01, 0x00, 0xC1, 0x02, 0x01, 0x00, 0xC2, 0x02, 0x01, 0x02, 0xC0, 0x01, 0x09
    ]);

    return new Promise((resolve, reject) => {
      this.client.write(connectionRequest);

      this.client.once('data', (data) => {
        console.log('Connection response:', data);
        resolve(data);
      });

      this.client.once('error', (err) => {
        console.error('Connection request error:', err);
        reject(err);
      });
    });
  }

  async establishSession() {
    await this.connect();
    const response = await this.sendConnectionRequest();

    if (response[5] !== 0xD0) {
      throw new Error('Failed to establish session');
    }

    console.log('Session established');
  }

  sendReadRequest(area, dbNumber, start, amount) {
    const readRequest = Buffer.from([
      0x03, 0x00, 0x00, 0x1F, 0x02, 0xF0, 0x80, 0x32, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x0E, 0x00, 0x04, 0x01, 0x12, 0x0A, 0x10, 0x02, 0x00, 0x01, 0x00, 0x00, area, dbNumber, start, amount
    ]);

    return new Promise((resolve, reject) => {
      this.client.write(readRequest);

      this.client.once('data', (data) => {
        console.log('Read response:', data);
        resolve(data);
      });

      this.client.once('error', (err) => {
        console.error('Read request error:', err);
        reject(err);
      });
    });
  }

  sendWriteRequest(area, dbNumber, start, amount, value) {
    const writeRequest = Buffer.from([
      0x03, 0x00, 0x00, 0x21, 0x02, 0xF0, 0x80, 0x32, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x10, 0x00, 0x05, 0x01, 0x12, 0x0A, 0x10, 0x02, 0x00, 0x01, 0x00, 0x00, area, dbNumber, start, amount, value
    ]);

    return new Promise((resolve, reject) => {
      this.client.write(writeRequest);

      this.client.once('data', (data) => {
        console.log('Write response:', data);
        resolve(data);
      });

      this.client.once('error', (err) => {
        console.error('Write request error:', err);
        reject(err);
      });
    });
  }

  async readData(area, dbNumber, start, amount) {
    await this.establishSession();
    const response = await this.sendReadRequest(area, dbNumber, start, amount);

    if (response[21] !== 0xFF) {
      throw new Error('Read failed');
    }

    const data = response.slice(25);
    console.log('Read data:', data);
    return data;
  }

  async writeData(area, dbNumber, start, amount, value) {
    await this.establishSession();
    const response = await this.sendWriteRequest(area, dbNumber, start, amount, value);

    if (response[21] !== 0xFF) {
      throw new Error('Write failed');
    }

    console.log('Write successful');
  }
}

module.exports = S7Transport;
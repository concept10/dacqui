// transports/s7Transport.js

const net = require('net');
const EventEmitter = require('events');

/**
 * Class representing an S7 Transport for Siemens PLC communication.
 * @extends EventEmitter
 */
class S7Transport extends EventEmitter {
  /**
   * Create an S7Transport.
   * @param {string} host - The PLC host address.
   * @param {number} port - The PLC port number.
   */
  constructor(host, port) {
    super();
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
  }

  /**
   * Connect to the PLC.
   * @returns {Promise<void>} Resolves when connected.
   */
  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log('Connected to PLC');
        this.emit('connected');
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('Connection error:', err);
        this.emit('error', err);
        reject(err);
      });
    });
  }

  /**
   * Send a connection request to the PLC.
   * @returns {Promise<Buffer>} Resolves with the connection response.
   */
  sendConnectionRequest() {
    const connectionRequest = Buffer.from([
      0x03, 0x00, 0x00, 0x16, 0x11, 0xE0, 0x00, 0x00, 0x00, 0x01, 0x00, 0xC1, 0x02, 0x01, 0x00, 0xC2, 0x02, 0x01, 0x02, 0xC0, 0x01, 0x09
    ]);

    return new Promise((resolve, reject) => {
      this.client.write(connectionRequest);

      this.client.once('data', (data) => {
        console.log('Connection response:', data);
        this.emit('connectionResponse', data);
        resolve(data);
      });

      this.client.once('error', (err) => {
        console.error('Connection request error:', err);
        this.emit('error', err);
        reject(err);
      });
    });
  }

  /**
   * Establish a session with the PLC.
   * @returns {Promise<void>} Resolves when the session is established.
   */
  async establishSession() {
    await this.connect();
    const response = await this.sendConnectionRequest();

    if (response[5] !== 0xD0) {
      const error = new Error('Failed to establish session');
      this.emit('error', error);
      throw error;
    }

    console.log('Session established');
    this.emit('sessionEstablished');
  }

  /**
   * Send a read request to the PLC.
   * @param {number} area - The memory area to read from.
   * @param {number} dbNumber - The DB number.
   * @param {number} start - The start address.
   * @param {number} amount - The number of bits to read.
   * @returns {Promise<Buffer>} Resolves with the read data.
   */
  sendReadRequest(area, dbNumber, start, amount) {
    const readRequest = Buffer.from([
      0x03, 0x00, 0x00, 0x1F, 0x02, 0xF0, 0x80, 0x32, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x0E, 0x00, 0x04, 0x01, 0x12, 0x0A, 0x10, 0x02, 0x00, 0x01, 0x00, 0x00, area, dbNumber, start, amount
    ]);

    return new Promise((resolve, reject) => {
      this.client.write(readRequest);

      this.client.once('data', (data) => {
        console.log('Read response:', data);
        this.emit('readResponse', data);
        resolve(data);
      });

      this.client.once('error', (err) => {
        console.error('Read request error:', err);
        this.emit('error', err);
        reject(err);
      });
    });
  }

  /**
   * Send a write request to the PLC.
   * @param {number} area - The memory area to write to.
   * @param {number} dbNumber - The DB number.
   * @param {number} start - The start address.
   * @param {number} amount - The number of bits to write.
   * @param {number} value - The value to write.
   * @returns {Promise<Buffer>} Resolves with the write response.
   */
  sendWriteRequest(area, dbNumber, start, amount, value) {
    const writeRequest = Buffer.from([
      0x03, 0x00, 0x00, 0x21, 0x02, 0xF0, 0x80, 0x32, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x10, 0x00, 0x05, 0x01, 0x12, 0x0A, 0x10, 0x02, 0x00, 0x01, 0x00, 0x00, area, dbNumber, start, amount, value
    ]);

    return new Promise((resolve, reject) => {
      this.client.write(writeRequest);

      this.client.once('data', (data) => {
        console.log('Write response:', data);
        this.emit('writeResponse', data);
        resolve(data);
      });

      this.client.once('error', (err) => {
        console.error('Write request error:', err);
        this.emit('error', err);
        reject(err);
      });
    });
  }

  /**
   * Read data from the PLC.
   * @param {number} area - The memory area to read from.
   * @param {number} dbNumber - The DB number.
   * @param {number} start - The start address.
   * @param {number} amount - The number of bits to read.
   * @returns {Promise<Buffer>} Resolves with the read data.
   */
  async readData(area, dbNumber, start, amount) {
    await this.establishSession();
    const response = await this.sendReadRequest(area, dbNumber, start, amount);

    if (response[21] !== 0xFF) {
      const error = new Error('Read failed');
      this.emit('error', error);
      throw error;
    }

    const data = response.slice(25);
    console.log('Read data:', data);
    this.emit('dataRead', data);
    return data;
  }

  /**
   * Write data to the PLC.
   * @param {number} area - The memory area to write to.
   * @param {number} dbNumber - The DB number.
   * @param {number} start - The start address.
   * @param {number} amount - The number of bits to write.
   * @param {number} value - The value to write.
   * @returns {Promise<void>} Resolves when the write is successful.
   */
  async writeData(area, dbNumber, start, amount, value) {
    await this.establishSession();
    const response = await this.sendWriteRequest(area, dbNumber, start, amount, value);

    if (response[21] !== 0xFF) {
      const error = new Error('Write failed');
      this.emit('error', error);
      throw error;
    }

    console.log('Write successful');
    this.emit('dataWritten');
  }
}

module.exports = S7Transport;
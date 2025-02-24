// SPDX-License-Identifier: MIT
// OUTLAW-DMA, LLC
//
// This is called wrap and expose all data from Siemens S7 PLCs.


const S7Transport = require('./s7transport');
const dgram = require('dgram');

class S7Wrap {
  constructor() {
    this.plcs = [];
  }

  /**
   * Discover all S7 PLCs on the network.
   * @returns {Promise<void>} Resolves when discovery is complete.
   */
  async discoverPLCs() {
    const socket = dgram.createSocket('udp4');
    const discoveryMessage = Buffer.from([/* Discovery message bytes */]);

    return new Promise((resolve, reject) => {
      socket.on('message', (msg, rinfo) => {
        console.log(`Discovered PLC at ${rinfo.address}:${rinfo.port}`);
        this.plcs.push({ host: rinfo.address, port: rinfo.port });
      });

      socket.on('error', (err) => {
        console.error('Discovery error:', err);
        reject(err);
      });

      socket.send(discoveryMessage, 0, discoveryMessage.length, 48899, '255.255.255.255', (err) => {
        if (err) {
          console.error('Send error:', err);
          reject(err);
        } else {
          console.log('Discovery message sent');
        }
      });

      setTimeout(() => {
        socket.close();
        resolve();
      }, 5000); // Wait for 5 seconds to receive responses
    });
  }

  /**
   * Get all known blocks from a specific PLC.
   * @param {string} host - The PLC host address.
   * @param {number} port - The PLC port number.
   * @returns {Promise<Array>} Resolves with an array of known blocks.
   */
  async getKnownBlocks(host, port) {
    const transport = new S7Transport(host, port);
    await transport.establishSession();

    // Example implementation to get known blocks
    const blocks = await transport.sendReadRequest(/* parameters to read blocks */);
    console.log('Known blocks:', blocks);
    return blocks;
  }

  /**
   * Connect to a specific PLC and read data from a block.
   * @param {string} host - The PLC host address.
   * @param {number} port - The PLC port number.
   * @param {number} area - The memory area to read from.
   * @param {number} dbNumber - The DB number.
   * @param {number} start - The start address.
   * @param {number} amount - The number of bits to read.
   * @returns {Promise<Buffer>} Resolves with the read data.
   */
  async readDataFromBlock(host, port, area, dbNumber, start, amount) {
    const transport = new S7Transport(host, port);
    const data = await transport.readData(area, dbNumber, start, amount);
    return data;
  }

  /**
   * Connect to a specific PLC and write data to a block.
   * @param {string} host - The PLC host address.
   * @param {number} port - The PLC port number.
   * @param {number} area - The memory area to write to.
   * @param {number} dbNumber - The DB number.
   * @param {number} start - The start address.
   * @param {number} amount - The number of bits to write.
   * @param {number} value - The value to write.
   * @returns {Promise<void>} Resolves when the write is successful.
   */
  async writeDataToBlock(host, port, area, dbNumber, start, amount, value) {
    const transport = new S7Transport(host, port);
    await transport.writeData(area, dbNumber, start, amount, value);
  }

  /**
   * Read SZL data from a specific PLC.
   * @param {string} host - The PLC host address.
   * @param {number} port - The PLC port number.
   * @param {number} szlId - The SZL ID.
   * @param {number} szlIndex - The SZL index.
   * @returns {Promise<Buffer>} Resolves with the SZL data.
   */
  async readSZLData(host, port, szlId, szlIndex) {
    const transport = new S7Transport(host, port);
    await transport.establishSession();
    const data = await transport.sendSZLRequest(szlId, szlIndex);
    return data;
  }
}

module.exports = S7Wrap;
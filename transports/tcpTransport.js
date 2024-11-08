// transports/tcpTransport.js
const net = require('net');

class TcpTransport {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
  }

  init() {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log(`Connected to TCP server at ${this.host}:${this.port}`);
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('TCP connection error:', err);
        reject(err);
      });
    });
  }

  sendData(data) {
    const message = JSON.stringify(data);
    this.client.write(message);
    console.log('Data sent via TCP:', message);
  }
}

module.exports = TcpTransport;

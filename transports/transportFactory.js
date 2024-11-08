// transportFactory.js

const TcpTransport = require('./tcpTransport');
// const UdpTransport = require('./transports/udpTransport');
// const UnixSocketTransport = require('./transports/unixSocketTransport');

class TransportFactory {
  static createTransport(config) {
    const { type } = config;

    switch (type) {
      case 'tcp':
        return new TcpTransport(config.host, config.port);
      case 'udp':
        return new UdpTransport(config.host, config.port);
      case 'unix':
        return new UnixSocketTransport(config.path);
      default:
        throw new Error('Unknown transport type');
    }
  }
}

module.exports = TransportFactory;

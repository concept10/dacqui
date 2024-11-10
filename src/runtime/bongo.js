const DeviceFactory = require('./device');
const io = require('socket.io')(3000);
const fs = require('fs');
const path = require('path');

class Runtime {
    constructor() {
        this.logger = console;
        this.events = {};
        this.plugins = { manager: {} };
        this.project = { getDeviceProperty: () => {} };
        this.settings = { appDir: __dirname };
    }
}

class Bongo {
    constructor() {
        this.runtime = new Runtime();
        this.devices = [];
        this.deviceTypes = this.getDeviceTypes();
    }

    getDeviceTypes() {
        const devicesDir = path.join(__dirname, 'devices');
        return fs.readdirSync(devicesDir).filter(file => {
            const filePath = path.join(devicesDir, file, 'package.json');
            if (fs.existsSync(filePath)) {
                const packageJson = require(filePath);
                return packageJson.bongoDevice === true;
            }
            return false;
        });
    }

    createDevices() {
        this.deviceTypes.forEach(type => {
            const deviceData = {
                id: `device_${type}`,
                name: `Example Device ${type}`,
                type: type,
                polling: 3000,
                sharedDevices: []
            };

            const device = DeviceFactory.create(deviceData, this.runtime);
            if (device) {
                this.devices.push(device);
                device.start();
            } else {
                console.error(`Failed to create device (${type}).`);
            }
        });
    }

    startPolling() {
        setInterval(() => {
            this.devices.forEach(device => {
                const values = device.getValues();
                const status = device.getStatus();
                io.emit('deviceData', { id: device.id, values, status });
            });
        }, 5000);
    }

    stopDevices() {
        this.devices.forEach(device => {
            device.stop().then(() => {
                console.log(`Device (${device.id}) stopped.`);
            });
        });
    }
}

const bongo = new Bongo();
bongo.createDevices();
bongo.startPolling();

process.on('SIGINT', () => {
    bongo.stopDevices();
    process.exit();
});
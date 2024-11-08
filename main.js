// main.js

const dacqui = require('./daquiRuntime');
const transportConfig = {
    type: 'tcp',
    host: '127.0.0.1',
    port: '1986',
};

const runtime = new daqui(transportConfig);

(async () => {
  await runtime.init();

  setInterval(() => {
    runtime.acquireSendData();
}, 5000); // 
})();

post();


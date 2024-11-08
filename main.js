// main.js

const dacqui = require('./dacqui.js');
const transportConfig = {
    type: 'tcp',
    host: '127.0.0.1',
    port: '1986',
};

const runtime = new dacqui(transportConfig);

(async () => {
  await runtime.init();

  setInterval(() => {
    runtime.acquireSendData();
}, 5000); // 
})();

// post();


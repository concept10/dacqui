// main.js
(async () => {
  await runtime.init();

  setInterval(() => {
    runtime.acquireSendData();
}, 5000); // 
})();

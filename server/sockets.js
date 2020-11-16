const WebSocket = require("ws");

WebSocket.Server.prototype.broadcast = function(message) {
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(typeof message === 'object' ? JSON.stringify(message) : message);
    }
  });
};

const wss = new WebSocket.Server({ port: 5050 });

module.exports = wss;

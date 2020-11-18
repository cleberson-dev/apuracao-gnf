import WebSocket from "ws";

const PORT = 5050;

WebSocket.Server.prototype.broadcast = function(message) {
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(typeof message === 'object' ? JSON.stringify(message) : message);
    }
  });
};

const wss = new WebSocket.Server({ port: PORT });
wss.on('listening', () => console.log(`Web Socket Server listening on port ${PORT}`))

export default wss;

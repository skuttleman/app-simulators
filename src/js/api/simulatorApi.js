const { compose, silent } = require('fun-util');

const API = {
  resetSimulators: () => null,
  sockets: []
};

const registerReset = reset => {
  API.resetSimulators = compose(API.resetSimulators, reset);
};

const registerSocket = socket => API.sockets.push(socket);

const resetSimulators = () => API.resetSimulators();

const sendSocket = message => {
  const msg = typeof message === 'string' ? message : JSON.stringify(message);
  API.sockets
    .map(compose(silent, socket => socket.send.bind(socket)))
    .forEach(send => send(msg));
};

module.exports = {
  registerReset,
  registerSocket,
  resetSimulators,
  sendSocket
};

const {
  INITIALIZE, RESET_MESSAGES, STORE_MESSAGE
} = require('../store/actionTypes');
const { buildResettableRoutes, respond } = require('./buildSimulator');
const { createServer } = require('http');
const { createStore } = require('redux');
const { silent } = require('fun-util');
const socketReducer = require('../store/socketReducer');
const uuid = require('uuid/v1');
const ws = require('express-ws');

const buildSocketSimulator = (config, app) => {
  const server = createServer(app);
  app.wsServer = ws(app, server);
  app.resetSocketSims = buildResettableRoutes(buildSimulator, config, app);
  return server;
};

const buildSimulator = (app, path, settings) => {
  const { dispatch, getState } = createStore(socketReducer);
  const reset = () => dispatch({ type: INITIALIZE, settings });
  reset();

  setMainRoute({ app, path, settings, getState, dispatch });

  app.get(`/api/messages${path}`, respond(() => {
    return getState().messages;
  }));

  app.delete(`/api/messages${path}`, respond(() => {
    dispatch({ type: RESET_MESSAGES });
  }));

  app.get(`/api/clients${path}`, respond(() => {
    const clients = Array.from(app.wsServer.getWss().clients).map(({ id }) => id);
    return clients;
  }));

  app.post(`/api/send${path}`, respond(({ body }) => {
    send(app.wsServer.getWss().clients, body);
  }));

  app.post(`/api/send${path}`, respond(({ body, query: { to } }) => {
    send(app.wsServer.getWss().clients, body, ({ id }) => id === to);
  }));

  return reset;
};

const send = (clients, body, filter = () => true) => {
  const message = typeof body === 'string' ? body : JSON.stringify(body);
  Array.from(clients)
    .filter(filter)
    .forEach(client => client.send(message));
};

const setMainRoute = ({ app, path, settings, getState, dispatch }) => {
  const { echo, onmessage, onclose, onerror, onopen } = settings;
  const clients = app.wsServer.getWss().clients;
  app.wsServer.getWss().on('connection', socket => socket.id = uuid());
  app.ws(path, (socket, request) => {
    socket.on('open', handle(onopen, socket, clients))
      .on('close', handle(onclose, socket, clients))
      .on('error', handle(onerror, socket, clients))
      .on('message', handleMessage({ dispatch, echo, onmessage, socket, clients }));
  });
};

const handle = (handler, socket, clients) => event => {
  if (typeof handler === 'function') {
    handler(socket, event, socketDo(clients));
  }
};

const handleMessage = ({ dispatch, echo, onmessage, socket, clients }) => msg => {
  const message = silent(JSON.parse)(msg);
  dispatch({ type: STORE_MESSAGE, message, from: socket.id });
  if (echo) {
    socket.send(msg);
  }
  handle(onmessage, socket, clients)(message);
};

const socketDo = clients => (data, socketId) => {
  send(clients, data, id => !socketId || id === socketId);
};

module.exports = buildSocketSimulator;

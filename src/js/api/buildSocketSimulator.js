const {
  INITIALIZE, RESET_MESSAGES, STORE_MESSAGE
} = require('../config/actionTypes');
const { buildResettableRoutes, respond } = require('./buildSimulator');
const { compose, concat, filter, groupBy, map, silent, thread, through } = require('fun-util');
const { createServer } = require('http');
const { createStore } = require('redux');
const { registerReset, registerSocket, sendSocket } = require('./simulatorApi');
const { simulators } = require('../config/urls/simulators');
const { clients, messages, sockets } = require('../config/urls/api');
const socketReducer = require('./store/socketReducer');
const uuid = require('uuid/v4');
const ws = require('express-ws');
const WebSocket = require('ws');

const buildSocketSimulator = (config, app) => {
  const server = createServer(app);
  app.wsServer = ws(app, server);
  const reset = buildResettableRoutes(buildSimulator(config), config, app);
  registerReset(reset);

  app.ws(sockets(), registerSocket);
  app.ws('*', ws => ws.close());

  return server;
};

const buildSimulator = config => (app, path, settings) => {
  const { dispatch, getState } = createStore(socketReducer);
  const reset = () => dispatch({ type: INITIALIZE, settings });
  reset();

  setMainRoute({ app, path, settings, getState, dispatch, config });

  app.get(messages(path), respond(() => {
    return getState().messages;
  }));

  app.delete(messages(path), respond(() => {
    dispatch({ type: RESET_MESSAGES });
  }));

  app.get(clients(path), respond(() => {
    return getClientIds(app.wsServer.getWss().clients, path);
  }));

  app.post(messages(path), respond(({ body, query: { to } }) => {
    send(app.wsServer.getWss().clients, path, body, to);
  }));

  return reset;
};

const send = (clients, path, body, filterId) => {
  const message = typeof body === 'string' ? body : JSON.stringify(body);
  filterClientsByPath(clients, path)
    .filter(({ id }) => !filterId || id === filterId)
    .forEach(client => client.send(message));
};

const setMainRoute = ({ app, path, settings, getState, dispatch, config }) => {
  const { echo, onmessage, onclose, onerror, onopen } = settings;
  const clients = app.wsServer.getWss().clients;
  onConnection = [addCloseHandler(clients, config), updateApiSockets(clients, config), assignId]
    .map(through);
  app.wsServer.getWss().on('connection', compose(...onConnection));

  app.ws(simulators(path), (socket, request) => socket
    .on('open', handle(onopen, socket, clients, path))
    .on('close', handle(onclose, socket, clients, path))
    .on('error', handle(onerror, socket, clients, path))
    .on('message', handleMessage({ dispatch, echo, onmessage, socket, clients, path })));
};

const assignId = socket => socket.id = uuid();

const updateApiSockets = (clients, config) => thread(
  () => clients,
  Array.from,
  clients => groupBy(clients, ({ upgradeReq }) => upgradeReq.url.replace('/.websocket', '')),
  clients => map(config, (_, path) => clients[simulators(path)] || []),
  clients => filter(clients, (_, url) => url !== sockets()),
  clients => map(clients, mapToClientIds),
  sendSocket);

const addCloseHandler = (clients, config) => socket => {
  socket.on('close', updateApiSockets(clients, config));
};

const handle = (handler, socket, clients, path) => event => {
  if (typeof handler === 'function') {
    handler(socket, event, socketDo(clients, path));
  }
};

const handleMessage = ({ dispatch, echo, onmessage, socket, clients, path }) => msg => {
  const message = silent(JSON.parse)(msg);
  dispatch({ type: STORE_MESSAGE, message, from: socket.id });
  if (echo) {
    socket.send(msg);
  }
  handle(onmessage, socket, clients, path)(message);
  // sendSocket({ from: socket.id, path, message });
};

const socketDo = (clients, path) => (data, socketId) => {
  send(clients, path, data, socketId);
};

const filterClientsByPath = (clients, path) => {
  return Array.from(clients)
    .filter(({ upgradeReq }) => {
      const url = upgradeReq.url.replace('/.websocket', '');
      return url === path || url === simulators(path);
    });
};

const getClientIds = (clients, path) => {
  return mapToClientIds(filterClientsByPath(clients, path));
};

const mapToClientIds = clients => {
  return Array.from(clients).map(({ id }) => id);
};

module.exports = buildSocketSimulator;

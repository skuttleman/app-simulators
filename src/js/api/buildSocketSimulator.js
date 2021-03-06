const {
  INITIALIZE, RESET_MESSAGES, STORE_MESSAGE
} = require('../config/actionTypes');
const { buildResettableRoutes, respond } = require('./buildSimulator');
const { clients, messages, sockets } = require('../config/urls/api');
const { compose, groupBy, map, partial, silent, thread, through } = require('fun-util');
const { createServer } = require('http');
const { createStore } = require('redux');
const { registerReset, registerSocket, sendSocket } = require('./simulatorApi');
const { simulators } = require('../config/urls/simulators');
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
  app.ws('*', (ws, { url }) => ws.close(1000, `Unconfigured WebSocket URL: ${dropUrlEnd(url)}`));

  return server;
};

const buildSimulator = config => (path, settings, app) => {
  const { dispatch, getState } = createStore(socketReducer);
  const reset = () => dispatch({ type: INITIALIZE, settings });
  reset();

  setMainRoute({ app, path, settings, getState, dispatch, config });

  app.get(messages(path), respond(() => getState().messages));

  app.post(messages(path), respond(({ body, query: { to } }) => {
    send(getClients(app), path, body.message, to);
  }));

  app.delete(messages(path), respond(() => {
    dispatch({ type: RESET_MESSAGES });
  }));

  app.get(clients(path), respond(() => {
    return getClientIds(getClients(app), path);
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
  const { echo, onmessage, onclose, onopen } = settings;
  const clients = getClients(app);
  onConnection = [
      logConnect,
      addOpenHandler(onopen, clients, path),
      addCloseHandler(clients, config),
      updateApiSockets(clients, config),
      assignId
    ].map(through);
  app.wsServer.getWss().on('connection', compose(...onConnection));
  app.ws(simulators(path), socket => socket
    .on('close', handle(onclose, socket, clients, path))
    .on('close', partial(logDisconnect, socket))
    .on('message', handleMessage({ dispatch, echo, onmessage, socket, clients, path })));
};

const logConnect = socket => console.log('WebSocket connected:', socket.id);

const logDisconnect = socket => console.log('WebSocket disconnected:', socket.id);

const assignId = socket => socket.id = uuid();

const addOpenHandler = (onopen, clients, path) => socket => {
  handle(onopen, socket, clients, path)(socket.id);
};

const updateApiSockets = (clients, config) => thread(
  () => clients,
  Array.from,
  clients => groupBy(clients, ({ upgradeReq }) => dropUrlEnd(upgradeReq.url)),
  clients => map(config, (_, path) => clients[simulators(path)] || []),
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
};

const socketDo = (clients, path) => (data, socketId) => {
  send(clients, path, data, socketId);
};

const getClientIds = (clients, path) => {
  return mapToClientIds(filterClientsByPath(clients, path));
};

const filterClientsByPath = (clients, path) => {
  return Array.from(clients)
    .filter(({ upgradeReq }) => {
      const url = dropUrlEnd(upgradeReq.url);
      return url === path || url === simulators(path);
    });
};

const mapToClientIds = clients => {
  return Array.from(clients).map(({ id }) => id);
};

const getClients = app => app.wsServer.getWss().clients;

const dropUrlEnd = url => url.replace('/.websocket', '');

module.exports = buildSocketSimulator;

const clients = path => `/api/clients${path}`;

const messages = (path, to) => `/api/messages${path}${to ? `?to=${to}` : ''}`;

const requests = (method, path) => `/api/requests/${method.toLowerCase()}${path}`;

const resetAll = () => '/api/reset-all';

const response = (method, path) => `/api/response/${method.toLowerCase()}${path}`;

const simulators = () => '/api/simulators';

const sockets = () => '/api/sockets';

module.exports = {
  clients,
  messages,
  requests,
  resetAll,
  response,
  simulators,
  sockets
};
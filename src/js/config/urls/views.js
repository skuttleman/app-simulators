const messages = path => `/sims/messages?path=${path}`;

const requests = (method, path) => `/sims/requests?path=${path}&method=${method}`;

const update = (method, path) => `/sims/update?path=${path}&method=${method}`;

module.exports = {
  messages,
  requests,
  update
};

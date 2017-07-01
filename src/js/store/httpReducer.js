const { combineReducers } = require('redux');
const { concat, filter } = require('fun-util');

const DEFAULT_SETTINGS = {
  method: 'get',
  delay: 0,
  response: null,
  status: 200,
  name: '',
  description: '',
  group: ''
};

const transformSettings = (...settings) => {
  const merged = concat(...settings);
  return concat(merged, {
    method: merged.method.toLowerCase(),
    respond: respond(merged.response)
  });
};

const respond = body => {
  if (typeof body !== 'function') {
    return (_, response) => response.send(body);
  }
  return (request, response) => {
    const result = body(request, response);
    if (result !== undefined) {
      Promise.resolve(result).then(value => response.send(value));
    }
  };
};

const requests = (state = [], { type, request }) => {
  switch (type) {
    case 'INITIALIZE':
    case 'CLEAR_REQUESTS':
      return [];
    case 'STORE_REQUEST':
      const { query, body, url, params } = request;
      const timestamp = new Date;
      return state.concat({ query, body, url, params, timestamp });
    default:
      return state;
  }
}

const settings = (state = DEFAULT_SETTINGS, { type, settings, response, status, delay }) => {
  switch (type) {
    case 'INITIALIZE':
    case 'RESET_RESPONSE':
      return transformSettings(DEFAULT_SETTINGS, settings);
    case 'SET_RESPONSE':
      return transformSettings(state, filter({ response, status, delay }, value => value !== undefined));
    default:
      return state;
  }
};

const httpReducer = combineReducers({
  requests,
  settings
});

module.exports = httpReducer;
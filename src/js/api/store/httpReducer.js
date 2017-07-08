const {
  INITIALIZE, CLEAR_REQUESTS, RESET_RESPONSE, SET_RESPONSE, STORE_REQUEST
} = require('../../config/actionTypes');
const { DEFAULT_HTTP_SIMULATOR_SETTINGS: DEFAULT } = require('../../config/consts');
const { combineReducers } = require('redux');
const { concat, filter, identity } = require('fun-util');

const isDefined = value => value !== undefined;

const initialSettings = (...settings) => {
  const merged = concat(...settings);
  return {
    ...merged,
    method: merged.method.toLowerCase(),
    respond: request => respond(merged)(request)
      .then(result => filter(result, isDefined))
      .then(result => concat(merged, result))
  };
};

const updateSettings = (...settings) => {
  const merged = concat(...settings);
  return {
    ...merged,
    method: merged.method.toLowerCase(),
    respond: request => merged.respond(request)
      .then(result => concat(result, merged))
  };
};

const respond = ({ body, status, delay, headers, respond }) => {
  const response = { body, status, delay, headers };
  return request => Promise.resolve().then(() => respond ? respond(request) : response).catch(identity);
};

const requests = (state = [], { type, request }) => {
  switch (type) {
    case INITIALIZE:
    case CLEAR_REQUESTS:
      return [];
    case STORE_REQUEST:
      const { query, body, url, params } = request;
      const timestamp = new Date;
      return state.concat({ query, body, url, params, timestamp });
    default:
      return state;
  }
};

const settings = (state = DEFAULT, { type, settings, body, status, delay, headers }) => {
  switch (type) {
    case INITIALIZE:
    case RESET_RESPONSE:
      return initialSettings(DEFAULT, settings, { body: settings.response });
    case SET_RESPONSE:
      const update = filter({ body, status, delay, headers }, isDefined);
      return updateSettings(state, update);
    default:
      return state;
  }
};

const httpReducer = combineReducers({
  requests,
  settings
});

module.exports = httpReducer;
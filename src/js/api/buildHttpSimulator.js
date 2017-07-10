const {
  CLEAR_REQUESTS, INITIALIZE, RESET_RESPONSE, SET_RESPONSE, STORE_REQUEST
} = require('../config/actionTypes');
const { DEFAULT_HTTP_SIMULATOR_SETTINGS } = require('../config/consts');
const { buildResettableRoutes, respond } = require('./buildSimulator');
const { createStore } = require('redux');
const httpReducer = require('./store/httpReducer');
const { registerReset } = require('./simulatorApi');
const { requests, response } = require('../config/urls/api');
const { resolveThrough, sleep } = require('fun-util');
const { simulators } = require('../config/urls/simulators');

const buildHttpSimulator = (config, app) => {
  const reset = buildResettableRoutes(buildSimulator, config, app);
  registerReset(reset);
};

const buildSimulator = (path, settings, app) => {
  const { dispatch, getState } = createStore(httpReducer);
  const reset = () => dispatch({ type: INITIALIZE, settings });
  reset();
  const { settings: { method } } = getState();

  setMainRoute({ app, method, path, getState, dispatch });

  app.get(requests(method, path), respond(() => getState().requests));

  app.delete(requests(method, path), respond(() => {
    dispatch({ type: CLEAR_REQUESTS });
  }));

  app.get(response(method, path), respond(() => {
    const { settings: { respond } } = getState();
    return respond(null)
      .catch(() => ({}))
      .then(({ body = null, delay, headers, status }) => ({ body, delay, headers, status }));
  }));

  app.put(response(method, path), respond(({ body }) => {
    dispatch({ type: SET_RESPONSE, ...body });
  }));

  app.delete(response(method, path), respond(() => {
    dispatch({ type: RESET_RESPONSE, settings });
  }));

  return reset;
};

const setMainRoute = ({ app, method, path, getState, dispatch }) => {
  app[method](simulators(path), (request, response) => {
    const { settings: { respond } } = getState();
    dispatch({ type: STORE_REQUEST, request });
    respond(request)
      .then(result => sleep(result.delay * 1000).then(() => result))
      .then(({ body, status, headers }) => response
        .status(status)
        .set(headers)
        .send(body))
      .catch(() => response.end());
  });
};

module.exports = buildHttpSimulator;

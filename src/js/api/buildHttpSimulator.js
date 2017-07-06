const {
  CLEAR_REQUESTS, INITIALIZE, RESET_RESPONSE, SET_RESPONSE, STORE_REQUEST
} = require('../config/actionTypes');
const { DEFAULT_HTTP_SIMULATOR_SETTINGS } = require('../config/consts');
const { buildResettableRoutes, respond } = require('./buildSimulator');
const { createStore } = require('redux');
const httpReducer = require('./store/httpReducer');
const { registerReset } = require('./simulatorApi');
const { requests, response } = require('../config/urls/api');
const { sleep } = require('fun-util');
const { simulators } = require('../config/urls/simulators');

const buildHttpSimulator = (config, app) => {
  const reset = buildResettableRoutes(buildSimulator, config, app);
  registerReset(reset);

  return app;
};

const buildSimulator = (app, path, settings) => {
  const { dispatch, getState } = createStore(httpReducer);
  const reset = () => dispatch({ type: INITIALIZE, settings });
  reset();
  const { settings: { method } } = getState();

  setMainRoute({ app, method, path, getState, dispatch });

  app.get(requests(method, path), respond(() => getState().requests));

  app.delete(requests(method, path), respond(() => {
    dispatch({ type: CLEAR_REQUESTS });
  }));

  app.put(response(method, path), respond(({ body: { response, status, delay } }) => {
    dispatch({ type: SET_RESPONSE, response, status, delay });
  }));

  app.delete(response(method, path), respond(() => {
    dispatch({ type: RESET_RESPONSE, settings });
  }));

  return reset;
};

const setMainRoute = ({ app, method, path, getState, dispatch }) => {
  app[method](simulators(path), (request, response) => {
    const { settings: { delay, status, respond, headers } } = getState();
    dispatch({ type: STORE_REQUEST, request });
    response.status(status).set(headers);
    sleep(delay * 1000).then(() => respond(request, response));
  });
};

module.exports = buildHttpSimulator;

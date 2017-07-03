const {
  CLEAR_REQUESTS, INITIALIZE, RESET_RESPONSE, SET_RESPONSE, STORE_REQUEST
} = require('../store/actionTypes');
const { buildResettableRoutes, respond } = require('./buildSimulator');
const { compose, reduce, sleep } = require('fun-util');
const { createStore } = require('redux');
const httpReducer = require('../store/httpReducer');

const buildHttpSimulator = (config, app) => {
  app.resetHttpSims = buildResettableRoutes(buildSimulator, config, app);

  return app;
};

const buildSimulator = (app, path, settings) => {
  const { dispatch, getState } = createStore(httpReducer);
  const reset = () => dispatch({ type: INITIALIZE, settings });
  reset();
  const { settings: { method } } = getState();

  setMainRoute({ app, method, path, getState, dispatch });

  app.get(`/api/requests/${method}${path}`, respond(() => {
    return getState().requests;
  }));

  app.delete(`/api/requests/${method}${path}`, respond(() => {
    dispatch({ type: CLEAR_REQUESTS });
  }));

  app.put(`/api/response/${method}${path}`, respond(({ body: { response, status, delay } }) => {
    dispatch({ type: SET_RESPONSE, response, status, delay });
  }));

  app.delete(`/api/response/${method}${path}`, respond(() => {
    dispatch({ type: RESET_RESPONSE, settings });
  }));

  return reset;
};

const setMainRoute = ({ app, method, path, getState, dispatch }) => {
  app[method](path, (request, response) => {
    const { settings: { delay, status, respond, headers } } = getState();
    dispatch({ type: STORE_REQUEST, request });
    response.status(status).set(headers);
    sleep(delay * 1000).then(() => respond(request, response));
  });
};

module.exports = buildHttpSimulator;

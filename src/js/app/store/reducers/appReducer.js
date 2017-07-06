import {
  RECEIVE_SOCKET_MESSAGE, SET_ACTIVE_SOCKET_CONNECTIONS,
  SET_MESSAGE_LIST, SET_REQUEST_LIST, SET_SIMULATOR_LIST
} from '../../../config/actionTypes';
const { combineReducers } = require('redux');
const { routerReducer: routing } = require('react-router-redux');

const simulator = key => (state = {}, { type, groupedSimulators = {} }) => {
  switch (type) {
    case SET_SIMULATOR_LIST:
      return groupedSimulators[key] || {};
    default:
      return state;
  }
};

const groupedSimulators = combineReducers({
  http: simulator('http'),
  socket: simulator('socket')
});

const simulators = (state = [], { type, simulators }) => {
  switch (type) {
    case SET_SIMULATOR_LIST:
      return simulators;
    default:
      return state;
  }
};

const connectedSockets = (state = {}, { type, sockets }) => {
  switch (type) {
    case SET_ACTIVE_SOCKET_CONNECTIONS:
      return sockets;
    default:
      return state;
  }
};

const socketMessages = (state = [], { type, from, message, path }) => {
  switch (type) {
    case RECEIVE_SOCKET_MESSAGE:
      return state.concat({ from, message, path });
    default:
      return state;
  }
};

const requests = (state = [], { type, requests }) => {
  switch (type) {
    case SET_REQUEST_LIST:
      return requests;
    default:
      return state;
  }
};

const messages = (state = [], { type, messages }) => {
  switch (type) {
    case SET_MESSAGE_LIST:
      return messages;
    default:
      return state;
  }
};

module.exports = combineReducers({
  connectedSockets,
  groupedSimulators,
  messages,
  requests,
  routing,
  simulators,
  socketMessages
});

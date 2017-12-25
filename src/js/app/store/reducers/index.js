import { combineReducers } from 'redux';
import connectedSockets from './connectedSockets';
import groupedSimulators from './groupedSimulators';
import messages from './messages';
import modal from './modal';
import requests from './requests';
import response from './response';
import { routerReducer as routing } from 'react-router-redux';
import simulators from './simulators';
import socketMessages from './socketMessages';

module.exports = combineReducers({
  connectedSockets,
  groupedSimulators,
  messages,
  modal,
  requests,
  response,
  routing,
  simulators,
  socketMessages
});

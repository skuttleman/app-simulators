import { SET_SIMULATOR_LIST } from '../../../config/actionTypes';
import { combineReducers } from 'redux';

const simulator = key => (state = {}, { type, groupedSimulators = {} }) => {
  switch (type) {
    case SET_SIMULATOR_LIST:
      return groupedSimulators[key] || {};
    default:
      return state;
  }
};

export default combineReducers({
  http: simulator('http'),
  socket: simulator('socket')
});

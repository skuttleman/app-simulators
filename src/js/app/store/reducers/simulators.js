import { SET_SIMULATOR_LIST } from '../../../config/actionTypes';

export default (state = [], { type, simulators }) => {
  switch (type) {
    case SET_SIMULATOR_LIST:
      return simulators;
    default:
      return state;
  }
};

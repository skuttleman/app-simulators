import http from '../utils/http';
import { SET_SIMULATOR_LIST } from '../../config/actionTypes';
import { simulators } from '../../config/urls/api';

export const fetchSimulators = () => http.get(simulators());

export const setSimulatorList = simulators => ({
  type: SET_SIMULATOR_LIST,
  simulators
});

export default () => (dispatch, getState) => {
  return fetchSimulators()
    .then(setSimulatorList)
    .then(dispatch);
};
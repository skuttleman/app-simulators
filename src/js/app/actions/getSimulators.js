import http from '../utils/http';
import { SET_SIMULATOR_LIST } from '../../config/actionTypes';

export const fetchSimulators = () => http.get('/api/simulators');

export default () => dispatch => {
  return fetchSimulators().then(simulators => {
    console.log(simulators);
    dispatch({ type: SET_SIMULATOR_LIST, simulators });
  });
};
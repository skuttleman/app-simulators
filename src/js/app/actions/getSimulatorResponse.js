import { SET_RESPONSE } from '../../config/actionTypes';
import http from '../utils/http';
import { simulators } from '../../config/urls/simulators';

export const fetchSimulatorResponse = (method, path) => {
  try {
    return http[method.toLowerCase()](simulators(path));
  } catch (err) {
    return Promise.reject(err);
  }
};

export const setResponse = response => ({
  type: SET_RESPONSE,
  response
});

export default (method, path) => dispatch => {
  return fetchSimulatorResponse(method, path)
    .then(setResponse)
    .then(dispatch);
};

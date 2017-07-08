import { SET_RESPONSE } from '../../config/actionTypes';
import http from '../utils/http';
import { response } from '../../config/urls/api';

export const fetchSimulatorResponse = (method, path) => {
  try {
    return http.get(response(method, path));
  } catch (err) {
    return Promise.reject(err);
  }
};

export const setResponse = response => ({
  type: SET_RESPONSE,
  ...response
});

export default (method, path) => dispatch => {
  return fetchSimulatorResponse(method, path)
    .then(setResponse)
    .then(dispatch);
};

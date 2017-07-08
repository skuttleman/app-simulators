import http from '../utils/http';
import { response } from '../../config/urls/api';

export const updateResponse = (method, path, body) => http.put(response(method, path), body);

export default (method, path, body) => dispatch => {
  return updateResponse(method, path, body);
};
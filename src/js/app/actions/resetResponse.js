import http from '../utils/http';
import { response } from '../../config/urls/api';

export const deleteResponse = (method, path) => http.delete(response(method, path));

export default (method, path) => dispatch => {
  return deleteResponse(method, path);
};
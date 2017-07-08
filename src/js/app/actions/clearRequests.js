import http from '../utils/http';
import { requests } from '../../config/urls/api';

export const deleteRequests = (method, path) => http.delete(requests(method, path));

export default (method, path) => dispatch => {
  return deleteRequests(method, path);
};
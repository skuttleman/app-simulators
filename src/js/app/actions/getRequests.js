import http from '../utils/http';
import { SET_REQUEST_LIST } from '../../config/actionTypes';
import { requests } from '../../config/urls/api';

export const fetchRequests = (method, path) => http.get(requests(method, path));

export const setRequestList = requests => ({
  type: SET_REQUEST_LIST,
  requests
});

export default (method, path) => dispatch => {
  return fetchRequests(method, path)
    .then(setRequestList)
    .then(dispatch);
};
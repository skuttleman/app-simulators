import http from '../utils/http';
import { messages } from '../../config/urls/api';

export default (path, message, to) => dispatch => {
  return http.post(messages(path, to), { message });
};

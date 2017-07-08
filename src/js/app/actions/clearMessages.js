import http from '../utils/http';
import { messages } from '../../config/urls/api';

export const deleteMessages = path => http.delete(messages(path));

export default path => dispatch => {
  return deleteMessages(path);
};
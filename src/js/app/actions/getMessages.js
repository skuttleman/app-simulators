import http from '../utils/http';
import { SET_MESSAGE_LIST } from '../../config/actionTypes';
import { messages } from '../../config/urls/api';

export const fetchMessages = path => http.get(messages(path));

export const setMessageList = messages => ({
  type: SET_MESSAGE_LIST,
  messages
});

export default path => dispatch => {
  return fetchMessages(path)
    .then(setMessageList)
    .then(dispatch);
};
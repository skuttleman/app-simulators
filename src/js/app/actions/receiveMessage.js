import { RECEIVE_SOCKET_MESSAGE } from '../../config/actionTypes';

export default message => ({
  type: RECEIVE_SOCKET_MESSAGE,
  ...message
});
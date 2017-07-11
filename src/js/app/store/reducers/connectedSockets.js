import { SET_ACTIVE_SOCKET_CONNECTIONS } from '../../../config/actionTypes';

export default (state = {}, { type, sockets }) => {
  switch (type) {
    case SET_ACTIVE_SOCKET_CONNECTIONS:
      return sockets;
    default:
      return state;
  }
};

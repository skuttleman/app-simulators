import { SET_ACTIVE_SOCKET_CONNECTIONS } from '../../config/actionTypes';

export default sockets => ({
  type: SET_ACTIVE_SOCKET_CONNECTIONS,
  sockets
});
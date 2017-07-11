import { RECEIVE_SOCKET_MESSAGE } from '../../../config/actionTypes';

export default (state = [], { type, from, message, path }) => {
  switch (type) {
    case RECEIVE_SOCKET_MESSAGE:
      return state.concat({ from, message, path });
    default:
      return state;
  }
};

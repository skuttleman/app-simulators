import { SET_MESSAGE_LIST } from '../../../config/actionTypes';

export default (state = [], { type, messages }) => {
  switch (type) {
    case SET_MESSAGE_LIST:
      return messages;
    default:
      return state;
  }
};

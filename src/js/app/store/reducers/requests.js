import { SET_REQUEST_LIST } from '../../../config/actionTypes';

export default (state = [], { type, requests }) => {
  switch (type) {
    case SET_REQUEST_LIST:
      return requests;
    default:
      return state;
  }
};

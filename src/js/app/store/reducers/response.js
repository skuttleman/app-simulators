import { SET_RESPONSE } from '../../../config/actionTypes';
import { combineReducers } from 'redux';

const reduce = (key, initial) => (state = initial, { type, [key]: value }) => {
  switch (type) {
    case SET_RESPONSE:
      return value === undefined ? state : value;
    default:
      return state;
  }
};

export default combineReducers({
  body: reduce('body', null),
  delay: reduce('delay', 0),
  headers: reduce('headers', {}),
  status: reduce('status', 200)
});

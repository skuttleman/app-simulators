import { HIDE_MODAL, SHOW_MODAL, TOGGLE_MODAL_JSON, UPDATE_MODAL_VALUE } from '../../../config/actionTypes';
import { combineReducers } from 'redux';

const jsonEditor = (state = false, { type }) => {
  switch (type) {
    case TOGGLE_MODAL_JSON:
      return !state;
    default:
      return state;
  }
};

const onPrimary = (state = null, { type, modal }) => {
  switch (type) {
    case HIDE_MODAL:
    return null;
    case SHOW_MODAL:
    return modal.onPrimary;
    default:
    return state;
  }
};

const title = (state = '', { type, modal }) => {
  switch (type) {
    case HIDE_MODAL:
      return '';
    case SHOW_MODAL:
      return modal.title || '';
    default:
      return state;
  }
};

const value = (state = '', { type, value }) => {
  switch (type) {
    case HIDE_MODAL:
      return '';
    case UPDATE_MODAL_VALUE:
      return value || '';
    default:
      return state;
  }
};

const visible = (state = false, { type }) => {
  switch (type) {
    case HIDE_MODAL:
      return false;
    case SHOW_MODAL:
      return true;
    default:
      return state;
  }
};

export default combineReducers({
  jsonEditor,
  onPrimary,
  title,
  value,
  visible
});

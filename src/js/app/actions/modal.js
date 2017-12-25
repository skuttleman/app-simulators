import http from '../utils/http';
import { HIDE_MODAL, SHOW_MODAL, TOGGLE_MODAL_JSON, UPDATE_MODAL_VALUE } from '../../config/actionTypes';
import { messages } from '../../config/urls/api';

export const showModal = modal => ({
  type: SHOW_MODAL,
  modal
});

export const hideModal = () => ({
  type: HIDE_MODAL
});

export const updateModalValue = value => ({
  type: UPDATE_MODAL_VALUE,
  value
});

export const toggleModalJSON = () => ({
  type: TOGGLE_MODAL_JSON
});

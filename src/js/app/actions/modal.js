import http from '../utils/http';
import { HIDE_MODAL, SHOW_MODAL } from '../../config/actionTypes';
import { messages } from '../../config/urls/api';

export const showModal = modal => ({
  type: SHOW_MODAL,
  modal
});

export const hideModal = () => ({
  type: HIDE_MODAL
});

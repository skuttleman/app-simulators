import { HIDE_MODAL, SHOW_MODAL } from '../../../config/actionTypes';

export default (state = { visible: false }, { type, modal }) => {
  switch (type) {
    case HIDE_MODAL:
      return { visible: false };
    case SHOW_MODAL:
      return {
        ...modal,
        visible: true
      };
    default:
      return state;
  }
};

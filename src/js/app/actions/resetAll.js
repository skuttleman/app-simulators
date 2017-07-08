import http from '../utils/http';
import { resetAll } from '../../config/urls/api';

export const deleteAll = () => http.delete(resetAll());

export default () => dispatch => {
  return deleteAll();
};
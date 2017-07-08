import axios from 'axios';
import { HTTP_METHODS } from '../../config/consts';

export default HTTP_METHODS.reduce((http, method) => {
  const go = (...args) => axios[method](...args)
    .catch(({ response }) => response);
  return {
    ...http,
    [method]: (...args) => go(...args).then(({ data }) => data),
    [method.toUpperCase()]: go
  };
}, { });

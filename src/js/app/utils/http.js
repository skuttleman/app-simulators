import axios from 'axios';
import { HTTP_METHODS } from '../../config/consts';

export default HTTP_METHODS.reduce((http, method) => {
  return {
    ...http,
    [method]: (...args) => axios[method](...args)
      .catch(({ response }) => response)
      .then(({ data }) => data)
  };
}, {});
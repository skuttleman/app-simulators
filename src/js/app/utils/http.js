import { HTTP_METHODS } from '../../config/consts';
import axios from 'axios';
import { filter, type } from 'fun-util';

export default HTTP_METHODS.reduce((http, method) => {
  return {
    ...http,
    [method]: (...args) => axios[method](...args)
      .catch(({ response }) => response)
      .then(({ data }) => data)
  };
}, { });

import logger from './loggerMiddleware';
import thunk from 'redux-thunk';
import transducers from '../transducers';

export default [
  thunk,
  logger,
  ...transducers
];
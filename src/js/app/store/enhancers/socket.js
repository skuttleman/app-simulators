import { ifn, silent, thread } from 'fun-util';
import setActiveConnections from '../../actions/setActiveConnections';
import { sockets } from '../../../config/urls/api';

const connectSocket = dispatch => {
  new WebSocket(`ws://${window.location.host}${sockets()}`)
    .onmessage = thread(
      ({ data }) => data,
      silent(JSON.parse),
      setActiveConnections,
      dispatch);
};

export default createStore => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloadedState, enhancer);
  connectSocket(store.dispatch);

  return store;
};
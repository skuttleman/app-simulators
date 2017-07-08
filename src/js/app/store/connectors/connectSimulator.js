import { connect } from 'react-redux';

export default connect(({ dispatch, connectedSockets }, { path }) => ({
  dispatch,
  sockets: connectedSockets[path] || []
}));
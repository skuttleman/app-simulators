import { connect } from 'react-redux';
import { find, reduce, thread } from 'fun-util';

export default connect(({ dispatch, path, simulators }) => ({
  dispatch,
  simulator: simulators.find(simulator => simulator.path === path)
}));
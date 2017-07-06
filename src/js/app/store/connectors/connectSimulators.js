import { connect } from 'react-redux';
import { reduce } from 'fun-util';

export default type => connect(({ dispatch, groupedSimulators }) => {
  return {
    dispatch,
    simulators: groupedSimulators[type] || []
  };
});
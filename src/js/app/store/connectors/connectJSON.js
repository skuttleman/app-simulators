import { connect } from 'react-redux';
import { pretty } from '../../utils/json';

export default key => connect(state => ({
  ...state,
  [key]: pretty(state[key])
}));
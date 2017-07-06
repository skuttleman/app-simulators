import { connect } from 'react-redux';

export default key => connect(state => ({
  ...state,
  [key]: JSON.stringify(state[key], null, 2)
}));
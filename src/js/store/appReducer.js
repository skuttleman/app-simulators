const { combineReducers } = require('redux');
const { routerReducer: routing } = require('react-router-redux');

const reducer = (state = [], action) => {
  return state.concat(state.length);
};

module.exports = combineReducers({
  reducer,
  routing
});

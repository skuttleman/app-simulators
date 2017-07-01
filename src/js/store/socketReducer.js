const { combineReducers } = require('redux');

const messages = (state = [], { type, message, from }) => {
  switch (type) {
    case 'INITIALIZE':
    case 'RESET_MESSAGES':
      return [];
    case 'STORE_MESSAGE':
      const timestamp = new Date;
      return state.concat({ message, timestamp, from });
    default:
      return state;
  }
};

const socketReducer = combineReducers({
  messages
});

module.exports = socketReducer;
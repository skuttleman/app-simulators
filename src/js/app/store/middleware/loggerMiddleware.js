export default ({ getState }) => next => action => {
  console.log('Dispatched action:', action);
  let nextAction = next(action);
  console.log('State after dispatching:', getState());
  return nextAction;
};

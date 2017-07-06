export default (TYPE, transformAction) => ({ dispatch }) => next => action => {
  switch (action.type) {
    case TYPE:
      return next(transformAction(action));
    default:
      return next(action);
  }
};

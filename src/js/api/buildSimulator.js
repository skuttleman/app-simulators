const { compose, reduce } = require('fun-util');

const noop = () => null;

const buildResettableRoutes = (builder, config, app) => {
  return reduce(config, (reset, settings, path) => {
    return compose(reset, reduce([].concat(settings), (reset, routeSettings) => {
      return compose(reset, builder(app, path, routeSettings));
    }, noop));
  }, noop);
};

const respond = handler => (request, response) => {
  const result = handler(request, response);
  response.status(200);
  return result ? response.send(result) : response.end();
};

module.exports = {
  buildResettableRoutes,
  respond
};
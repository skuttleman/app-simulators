const { compose, reduce } = require('fun-util');

const noop = () => null;

const buildResettableRoutes = (builder, config, app) => {
  return reduce(config, (reset, settings, path) => {
    return compose(reset, reduce([].concat(settings), (reset, routeSettings) => {
      return compose(reset, builder(path, routeSettings, app));
    }, noop));
  }, noop);
};

const respond = handler => (request, response) => {
  return Promise.resolve(handler(request, response))
    .then(result => response.status(200).send(result));
};

module.exports = {
  buildResettableRoutes,
  respond
};
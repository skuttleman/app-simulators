const { DEFAULT_HTTP_SIMULATOR_SETTINGS } = require('../config/consts');
const bodyParser = require('body-parser');
const { concat, reduce, type } = require('fun-util');
const cors = require('cors');
const { respond } = require('./buildSimulator');

const mapSim = (sim, path) => {
  const { method, name, group, description } = concat(DEFAULT_HTTP_SIMULATOR_SETTINGS, sim);
  return { path, method: method.toUpperCase(), name, group, description, socket: !!sim.socket };
};

const getSimList = config => {
  return reduce(config, (simulators, sim, path) => {
    if (type(sim) === 'array') {
      return simulators.concat(sim.map(sim => mapSim(sim, path)));
    }
    return simulators.concat(mapSim(sim, path));
  }, []);
};

const setupMiddleware = (app, config) => {
  const simulators = getSimList(config);
  app.use(cors());
  app.use(bodyParser.json());

  app.delete('/api/reset-all', respond(() => {
    app.resetHttpSims();
    app.resetSocketSims();
  }));

  app.get('/api/simulators', respond(() => simulators));

  return app;
};

module.exports = setupMiddleware;
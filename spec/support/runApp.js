const { PORT, SIMULATORS } = require('./consts');
const createSimulators = require('../../src/js/simulator');
const { readFixture } = createSimulators;

const runApp = (done, simulators = SIMULATORS) => {
  return createSimulators({ simulators, noLogger: true }).listen(PORT, done);
};

module.exports = runApp;

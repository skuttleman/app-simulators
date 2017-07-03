const { PORT, SIMULATORS } = require('./consts');
const makeSimulator = require('../../src/js/simulator');
const { readFixture } = makeSimulator;

const runApp = (done, sims = SIMULATORS) => makeSimulator(sims).listen(PORT, done);

module.exports = runApp;

const buildHttpSimulator = require('./api/buildHttpSimulator');
const buildSocketSimulator = require('./api/buildSocketSimulator');
const express = require('express');
const { groupBy, silent, thread } = require('fun-util');
const { readFileSync } = require('fs');
const setupMiddleware = require('./api/setupMiddleware');
const setupStatic = require('./api/setupStatic');

const createSimulators = config => {
  const { socket = {}, http = {} } = groupBy(config.simulators, ({ socket }) => socket ? 'socket' : 'http');
  const app = express();
  setupMiddleware(config, app);
  buildHttpSimulator(http, app);
  const server = buildSocketSimulator(socket, app);
  setupStatic(app);

  return server;
};

const readFixture = thread(
  readFileSync,
  String,
  silent(JSON.parse)
);

module.exports = createSimulators;
module.exports.readFixture = readFixture;

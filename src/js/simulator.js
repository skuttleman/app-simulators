const buildHttpSimulator = require('./api/buildHttpSimulator');
const buildSocketSimulator = require('./api/buildSocketSimulator');
const { groupBy, silent, thread } = require('fun-util');
const express = require('express');
const { readFileSync } = require('fs');
const setupMiddleware = require('./api/setupMiddleware');
const setupStatic = require('./api/setupStatic');

const simulator = config => {
  const { socket = {}, http = {} } = groupBy(config, ({ socket }) => socket ? 'socket' : 'http');
  const app = express();
  setupMiddleware(app, config);
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

module.exports = simulator;
module.exports.readFixture = readFixture;

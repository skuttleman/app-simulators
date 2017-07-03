const buildHttpSimulator = require('./api/buildHttpSimulator');
const buildSocketSimulator = require('./api/buildSocketSimulator');
const express = require('express');
const { groupBy, partial, silent, thread } = require('fun-util');
const { readFileSync } = require('fs');
const setupMiddleware = require('./api/setupMiddleware');

const simulator = config => {
  const { socket, http } = groupBy(config, ({ socket }) => socket ? 'socket' : 'http');
  return thread(
    express,
    setupMiddleware,
    partial(buildHttpSimulator, http),
    partial(buildSocketSimulator, socket)
  )();
};

const readFixture = thread(
  readFileSync,
  String,
  silent(JSON.parse)
);

module.exports = simulator;
module.exports.readFixture = readFixture;

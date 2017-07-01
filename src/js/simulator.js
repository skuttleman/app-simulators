const buildHttpSimulator = require('./tool/buildHttpSimulator');
const buildSocketSimulator = require('./tool/buildSocketSimulator');
const express = require('express');
const { groupBy, partial, thread } = require('fun-util');
const setupMiddleware = require('./tool/setupMiddleware');

const simulator = config => {
  const { socket, http } = groupBy(config, ({ socket }) => socket ? 'socket' : 'http');
  return thread(
    express,
    setupMiddleware,
    partial(buildHttpSimulator, http),
    partial(buildSocketSimulator, socket)
  )();
};

module.exports = simulator;

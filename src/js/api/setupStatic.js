const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { respond } = require('./buildSimulator');

const setupStatic = app => {
  app.use(express.static('build'));
  app.get('*', (_, response) => {
    response.sendFile('/Users/skuttleman/Documents/dev/js-app-simulator/build/index.html');
  });

  return app;
};

module.exports = setupStatic;
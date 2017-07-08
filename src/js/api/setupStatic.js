const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { respond } = require('./buildSimulator');

const setupStatic = app => {
  app.use(express.static('build'));
  app.get('*', (_, response) => {
    response.sendFile('/Users/skuttleman/Documents/dev/js-app-simulator/build/index.html');
  });

  app.use('/', (error, request, response, next) => {
    console.log('an error occurred', error)
    response.status(error.status || 500).send({ error: 'unknown error' });
  });

  return app;
};

module.exports = setupStatic;
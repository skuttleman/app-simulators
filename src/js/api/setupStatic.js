const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { join } = require('path');
const { respond } = require('./buildSimulator');

const setupStatic = app => {
  app.use(express.static(join(__dirname, '../../../build')));
  app.get('*', (_, response) => {
    response.sendFile(join(__dirname, '../../../build/index.html'));
  });

  app.use('/', (error, request, response, next) => {
    console.log('an error occurred', error)
    response.status(error.status || 500).send({ error: 'unknown error' });
  });

  return app;
};

module.exports = setupStatic;
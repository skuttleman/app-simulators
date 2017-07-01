const bodyParser = require('body-parser');
const cors = require('cors');
const { respond } = require('./buildSimulator');

const setupMiddleware = app => {
  app.use(cors());
  app.use(bodyParser.json());

  app.delete('/api/reset-all', respond(() => {
    app.resetHttpSims();
    app.resetSocketSims();
  }));

  return app;
};

module.exports = setupMiddleware;
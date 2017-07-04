const { HTTP_METHODS } = require('../../src/js/config/consts');
const { PORT } = require('../support/consts');
const axios = require('axios');

const sims = HTTP_METHODS.reduce((sims, method) => {
  return {
    ...sims,
    [method](url, ...args) {
      return axios[method](`http://localhost:${PORT}${url}`, ...args)
        .catch(({ response }) => response);
    }
  };
}, {});

const resetSims = () => sims.delete('/api/reset-all');

module.exports = {
  resetSims,
  sims
};
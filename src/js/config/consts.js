const DEFAULT_HTTP_SIMULATOR_SETTINGS = {
  method: 'get',
  delay: 0,
  status: 200,
  headers: {},
  name: '',
  description: '',
  group: ''
};

const HTTP_METHODS = ['get', 'put', 'patch', 'post', 'delete'];

module.exports = {
  DEFAULT_HTTP_SIMULATOR_SETTINGS,
  HTTP_METHODS
};
const { PORT = 8000 } = process.env;
const createSimulators = require('./simulator');

createSimulators({
  simulators: {
    '/echo': {
      method: 'Patch',
      respond: ({ body }) => body || {}
    },
    '/test/a/:param': {
      response: { a: 'test' },
      group: 'Test Group'
    },
    '/socket': {
      socket: true,
      echo: true
    },
    '/socket2': {
      socket: true
    },
    '/crud': [{
      method: 'post',
      description: 'create'
    }, {
      description: 'read'
    }, {
      method: 'put',
      description: 'update'
    }, {
      method: 'delete',
      description: 'delete'
    }]
  }
}).listen(PORT, () => console.log('Example app is listening on port', PORT));

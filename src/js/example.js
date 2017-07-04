const simulator = require('./simulator');
const { PORT = 8000 } = process.env;

simulator({
  '/echo': {
    method: 'Patch',
    response: ({ body }) => body
  },
  '/test': {
    response: { a: 'test' }
  },
  '/socket': {
    socket: true,
    echo: true
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
}).listen(PORT, () => console.log('Example app is listening on port', PORT));

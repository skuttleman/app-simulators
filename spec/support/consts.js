const SIMULATORS = {
  '/test': {
    response: { some: 'response' },
    name: 'Test',
    group: 'all by myself'
  },
  '/some-path': {
    status: 201,
    method: 'post',
    response: { data: 'some-path' },
    description: 'A post example'
  },
  '/headers': {
    status: 203,
    method: 'delete',
    headers: {
      'X-Custom-Header': 'some header',
      'Proxy-Authenticate': 'Monkey'
    },
    group: 'special',
    description: 'Custom response headers example'
  },
  '/delay': {
    delay: 0.5,
    group: 'special',
    description: 'This endpoint waits before responding'
  },
  '/smart/path': {
    method: 'put',
    respond: ({ body }) => ({ status: 418, body }),
    group: 'special',
    name: 'Smart response'
  },
  '/path/:withParam': {
    response: { a: 'ok' }
  },
  '/multi-method': [{
    response: { method: 'get' },
    status: 207
  },
  {
    response: { method: 'put' },
    method: 'put',
    status: 207
  },
  {
    response: { method: 'patch' },
    method: 'patch',
    status: 207
  },
  {
    response: { method: 'post' },
    method: 'post',
    status: 207
  },
  {
    response: { method: 'delete' },
    method: 'delete',
    status: 207
  }]
};
const PORT = 8000;

module.exports = {
  SIMULATORS,
  PORT
};
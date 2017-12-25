const { PORT } = require('../../support/consts');
const { resetSims, sims } = require('../../helpers/simulatorHelpers');
const runApp = require('../../support/runApp');
const { silent, sleep } = require('fun-util');
const WebSocket = require('ws');

describe('Socket API', () => {
  let server, socket, messageReceived;

  describe('onmessage', () => {
    beforeEach(done => {
      messageReceived = new Promise(resolve => {
        server = runApp(() => {
          socket = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
          socket.onopen = done;
        }, {
            '/socket': {
              socket: true,
              onmessage: (ws, message) => resolve({ message, ws })
            }
          });
      });
    });

    it('calls onmessage with socket connection', done => {
      socket.send('some message');
      messageReceived.then(({ ws }) => {
        return new Promise(resolve => {
          ws.send('response data');
          socket.onmessage = ({ data }) => {
            expect(data).toEqual('response data');
            resolve();
          };
        });
      }).then(done);
    });

    it('calls onmessage with message data', done => {
      socket.send('some message');
      messageReceived.then(({ message }) => {
        expect(message).toEqual('some message');
      }).then(done);
    });

    it('parses the message data if it is JSON', done => {
      socket.send(JSON.stringify({ message: 'some message' }));
      messageReceived.then(({ message }) => {
        expect(message).toEqual({ message: 'some message' });
      }).then(done);
    });

    afterEach(done => {
      socket.close();
      server.close(done);
    });
  });

  describe('onmessage with callback', () => {
    beforeEach(done => {
      messageReceived = new Promise(resolve => {
        server = runApp(() => {
          socket = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
          socket.onopen = done;
        }, {
            '/socket': {
              socket: true,
              onmessage: (_, message, cb) => resolve({ cb, message })
            }
          });
      });
    });

    it('broadcasts message with callback', done => {
      new Promise(resolve => {
        socket.onmessage = ({ data }) => resolve(data);
        socket.send('callback message');
        messageReceived.then(({ cb, message }) => cb({ callback: message }));
      }).then(JSON.parse)
        .then(message => expect(message).toEqual({ callback: 'callback message' }))
        .then(done);
    });

    afterEach(done => {
      socket.close();
      server.close(done);
    });
  });

  describe('messages', () => {
    beforeAll(done => {
      server = runApp(done, {
        '/socket': {
          socket: true,
          echo: true
        }
      });
    });

    beforeEach(done => {
      resetSims()
        .then(() => {
          socket = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
          socket.onopen = () => {
            socket.send('any message');
            socket.onmessage = done;
          };
        });
    });

    it('echos message', done => {
      new Promise(resolve => {
        socket.send('echo message');
        socket.onmessage = ({ data }) => resolve(data);
      }).then(message => {
        expect(message).toEqual('echo message');
      }).then(done);
    });

    it('sends a message', done => {
      sims.post('/api/messages/socket', { message: { message: 'message' } });
      new Promise(resolve => {
        socket.onmessage = ({ data }) => resolve(data);
      }).then(JSON.parse)
        .then(message => {
          expect(message).toEqual({ message: 'message' });
        }).then(done);
    });

    it('resets messages', done => {
      socket.send('some message');
      resetSims()
        .then(() => sims.get('/api/messages/socket'))
        .then(({ data }) => expect(data).toEqual([]))
        .then(done);
    });

    describe('with multiple socket connections', () => {
      let socket2, ids;

      beforeEach(done => {
        socket2 = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
        socket2.onopen = () => {
          socket.send('any message2');
          socket.onmessage = () => {
            sims.get('/api/clients/socket')
              .then(({ data }) => ids = data)
              .then(done);
          };
        };
      });

      it('broadcasts a message to all clients', done => {
        sims.post('/api/messages/socket', { message: { message: 'message' } });
        Promise.all([
          new Promise(resolve => socket.onmessage = ({ data }) => resolve(data)),
          new Promise(resolve => socket2.onmessage = ({ data }) => resolve(data)),
        ]).then(messages => messages.map(message => JSON.parse(message)))
          .then(([message1, message2]) => {
            expect(message1).toEqual({ message: 'message' });
            expect(message2).toEqual({ message: 'message' });
          }).then(done);
      });

      it('sends a message to a specific client', done => {
        const socket1Spy = jasmine.createSpy('socket1Spy');
        const socket2Spy = jasmine.createSpy('socket2Spy');
        socket.onmessage = ({ data }) => socket1Spy(JSON.parse(data));
        socket2.onmessage = ({ data }) => socket2Spy(JSON.parse(data));

        Promise.all([
          sims.post(`/api/messages/socket?to=${ids[0]}`, { message: { message: 'message1' } }),
          sims.post(`/api/messages/socket?to=${ids[1]}`, { message: { message: 'message2' } })
        ]).then(() => sleep(200))
          .then(() => {
            expect(socket1Spy).toHaveBeenCalledTimes(1);
            expect(socket1Spy).toHaveBeenCalledWith({ message: 'message1' });
            expect(socket2Spy).toHaveBeenCalledTimes(1);
            expect(socket2Spy).toHaveBeenCalledWith({ message: 'message2' });
          }).then(done);
      });

      afterEach(() => {
        socket2.close();
      });
    });

    it('stores messages received', done => {
      sims.get('/api/messages/socket')
        .then(({ data }) => {
          expect(data.length).toEqual(1);
          expect(data[0].message).toEqual('any message');
          expect(data[0].timestamp).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/);
        }).then(done);
    });

    it('clears messages', done => {
      sims.delete('/api/messages/socket')
        .then(() => sims.get('/api/messages/socket'))
        .then(({ data }) => expect(data).toEqual([]))
        .then(done);
    });

    afterEach(() => {
      socket.close();
    });

    afterAll(done => {
      server.close(done);
    });
  });

  describe('/api/sockets', () => {
    let socket2, onmessage;

    beforeAll(done => {
      onmessage = jasmine.createSpy('onmessage');
      server = runApp(() => {
        socket = new WebSocket(`ws://localhost:${PORT}/api/sockets`);
        socket.onmessage = onmessage;
        socket.onopen = done;
      }, {
          '/socket': {
            socket: true
          }
        });
    });

    beforeEach(done => {
      socket2 = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
      socket2.onopen = done;
    });

    it('gets a notice when a socket is connected', done => {
      onmessage.and.callFake(({ data }) => {
        const message = JSON.parse(data);
        if (message['/socket'].length) {
          expect(message['/socket'].length).toEqual(1);
          expect(message['/socket'][0]).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/)
          done();
        }
      });
    });

    it('gets a notice when a socket is disconnected', done => {
      socket2.close();
      onmessage.and.callFake(({ data }) => {
        const message = JSON.parse(data);
        if (!message['/socket'].length) {
          expect(message['/socket']).toEqual([]);
          done();
        }
      });
    });

    afterEach(() => {
      socket2.close();
    });

    afterAll(done => {
      socket.close();
      server.close(done);
    });
  });

  describe('unknown socket endpoint', () => {
    beforeEach(done => {
      server = runApp(() => {
        socket = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
        socket.onopen = done;
      }, {});
    });

    it('disconnects the socket', done => {
      socket.onclose = ({ reason }) => {
        expect(reason).toEqual('Unconfigured WebSocket URL: /simulators/socket');
        done();
      };
    });

    afterEach(done => {
      socket.close();
      server.close(done);
    });
  });

  describe('multiple websocket simulators', () => {
    let socket1, socket2;
    const connect = path => new Promise(resolve => {
      let socket = new WebSocket(`ws://localhost:${PORT}/simulators${path}`);
      socket.onopen = () => resolve(socket);
    });

    beforeAll(done => {
      server = runApp(() => Promise.all([
        connect('/socket1').then(socket => socket1 = socket),
        connect('/socket2').then(socket => socket2 = socket)
      ]).then(done), {
          '/socket1': {
            socket: true
          },
          '/socket2': {
            socket: true
          }
        });
    });

    it('only broadcasts to a socket connected to /socket1', done => {
      const messages1 = [], messages2 = [];
      socket1.onmessage = ({ data }) => messages1.push(JSON.parse(data));
      socket2.onmessage = ({ data }) => messages2.push(JSON.parse(data));

      sims.post('/api/messages/socket1', { message: { some: 'message' }})
        .then(() => {
          expect(messages1).toEqual([{ some: 'message' }]);
          expect(messages2).toEqual([]);
        }).then(done);
    });

    it('only broadcasts to a socket connected to /socket2', done => {
      const messages1 = [], messages2 = [];
      socket1.onmessage = ({ data }) => messages1.push(JSON.parse(data));
      socket2.onmessage = ({ data }) => messages2.push(JSON.parse(data));

      sims.post('/api/messages/socket2', { message: { some: 'message' } })
        .then(() => {
          expect(messages1).toEqual([]);
          expect(messages2).toEqual([{ some: 'message' }]);
        }).then(done);
    });

    it('only sends ids for sockets connected to the requested socket url', done => {
      Promise.all([
        sims.get('/api/clients/socket1'),
        sims.get('/api/clients/socket2')
      ]).then(([{ data: ids1 }, { data: ids2 }]) => {
        expect(ids1.length).toEqual(1);
        expect(ids1[0]).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
        expect(ids2.length).toEqual(1);
        expect(ids2[0]).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
      }).then(done);
    })

    afterAll(done => {
      socket1.close();
      socket2.close();
      server.close(done);
    });
  });

  describe('socket callbacks', () => {
    let onopen, onclose;

    beforeEach(done => {
      onopen = jasmine.createSpy('onopen');
      onclose = jasmine.createSpy('onclose');
      server = runApp(() => {
        socket = new WebSocket(`ws://localhost:${PORT}/simulators/socket`);
        socket.onopen = done;
      }, {
          '/socket': {
            socket: true,
            onopen,
            onclose
          }
        });
    });

    it('calls onopen handler', done => {
      sleep(0).then(() => {
        expect(onopen.calls.count()).toEqual(1);
        expect(onopen.calls.argsFor(0)[0]).toEqual(jasmine.any(WebSocket));
        expect(onopen.calls.argsFor(0)[1]).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
        expect(onopen.calls.argsFor(0)[2]).toEqual(jasmine.any(Function));
      }).then(done);
    });

    it('uses onopen callback to send a message', done => {
      sleep(0).then(() => {
        const callback = onopen.calls.argsFor(0)[2];
        callback('callback message');
        socket.onmessage = ({ data }) => {
          expect(data).toEqual('callback message');
          done();
        };
      });
    });

    describe('onclose', () => {
      beforeEach(done => {
        onclose.and.callFake(done);
        socket.close(1001);
      });

      it('calls onclose handler', () => {
        expect(onclose.calls.count()).toEqual(1);
        expect(onclose.calls.argsFor(0)[0]).toEqual(jasmine.any(WebSocket));
        expect(onclose.calls.argsFor(0)[1]).toEqual(1001);
        expect(onclose.calls.argsFor(0)[2]).toEqual(jasmine.any(Function));
      });
    });

    afterEach(done => {
      socket.close();
      server.close(done);
    });
  });
});

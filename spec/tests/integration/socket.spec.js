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
            socket = new WebSocket(`ws://localhost:${PORT}/socket`);
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

    afterEach(() => {
      socket.close();
      server.close();
    });
  });

  describe('onmessage with callback', () => {
    beforeEach(done => {
      messageReceived = new Promise(resolve => {
        server = runApp(() => {
            socket = new WebSocket(`ws://localhost:${PORT}/socket`);
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
          socket.send('callback message');
          messageReceived.then(({ cb, message }) => cb({ callback: message }));
          socket.onmessage = ({ data }) => resolve(data);
        }).then(JSON.parse)
        .then(message => expect(message).toEqual({ callback: 'callback message' }))
        .then(done);
    });

    afterEach(() => {
      socket.close();
      server.close();
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
          socket = new WebSocket(`ws://localhost:${PORT}/socket`);
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
      sims.post('/api/send/socket', { message: 'message' });
      new Promise(resolve => {
          socket.onmessage = ({ data }) => resolve(data);
        }).then(JSON.parse)
        .then(message => {
          expect(message).toEqual({ message: 'message' });
        }).then(done);
    });

    describe('with multiple socket connections', () => {
      let socket2, ids;

      beforeEach(done => {
        socket2 = new WebSocket(`ws://localhost:${PORT}/socket`);
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
        sims.post('/api/send/socket', { message: 'message' });
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
          sims.post(`/api/send/socket?to=${ids[0]}`, { message: 'message1' }),
          sims.post(`/api/send/socket?to=${ids[1]}`, { message: 'message2' })
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

    afterAll(() => {
      server.close();
    });
  });
});

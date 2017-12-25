const { forEach, sleep } = require('fun-util');
const runApp = require('../../support/runApp');
const selenium = require('selenium-webdriver');

const SIMULATORS = {
  '/test': {
    name: 'Test Path',
    group: 'Group 1',
    description: 'Test Description'
  },
  '/crud': [{
    method: 'post',
    name: 'Create',
    group: 'Group 1',
    description: 'Create Description'
  }, {
    method: 'get',
    name: 'Read',
    group: 'Group 2',
    description: 'Create Description'
  }, {
    method: 'put',
    name: 'Update',
  }, {
    method: 'delete',
    description: 'Delete Description'
  }],
  '/socket1': {
    name: 'Socket 1',
    group: 'Group 1',
    socket: true
  },
  '/socket2': {
    name: 'Socket 2',
    socket: true
  }
};

describe('UI Spec', () => {
  forEach(['chrome', 'firefox'], driverName => {
    describe(`With driver: ${driverName}`, () => {
      let driver, server;

      beforeAll(done => {
        server = runApp(() => {
          driver = new selenium.Builder()
            .withCapabilities(selenium.Capabilities[driverName]())
            .build();
          done();
        }, SIMULATORS);
      });

      describe('Main page', () => {
        beforeEach(done => {
          driver.get('http://localhost:8000').then(done);
        });

        it('has a title', done => {
          driver.findElement({ tagName: 'h1' })
            .then(h1 => h1.getAttribute('innerText'))
            .then(text => expect(text).toEqual('Simulators'))
            .then(done);
        });

        describe('HTTP Simulators', () => {
          it('has a section for HTTP Simulators', done => {
            driver.findElements({ tagName: 'h2' })
              .then(h2 => h2[0].getAttribute('innerText'))
              .then(text => expect(text).toEqual('HTTP Simulators'))
              .then(done);
          });

          it('has a listing for the /test simulator', done => {
            driver.findElement({ tagName: 'tr', innerText: /\/test/gi })
              .then(tr => tr || Promise.reject('Element not found'))
              .then(done, fail);
          });
        });

        describe('WebSocket Simulators', () => {
          it('has a section for WebSocket Simulators', done => {
            driver.findElements({ tagName: 'h2' })
              .then(h2 => h2[1].getAttribute('innerText'))
              .then(text => expect(text).toEqual('WebSocket Simulators'))
              .then(done);
          });
        });
      });

      afterAll(done => {
        driver.quit().then(() => server.close(done));
      });
    });
  });
});

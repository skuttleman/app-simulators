const { BROWSERS } = require('../../../support/consts');
const { DriverAPI, getInnerText, selectElement, withDriver, within } = require('../../../support/selenium');
const { compose, first, forEach, rest, sleep } = require('fun-util');
const runApp = require('../../../support/runApp');

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

forEach(BROWSERS, browser => {
  describe(`With browser: ${browser.toUpperCase()}`, () => {
    let driver, server;

    beforeAll(done => {
      server = runApp(() => {
        driver = DriverAPI.factory(browser);
        driver.visitHome().then(done);
      }, SIMULATORS);
    });

    describe('UI/Layout Spec', () => {
      describe('Main page', () => {
        beforeEach(done => {
          driver.visitHome().then(done);
        });

        it('has a title', done => {
          withDriver(driver)
            .then(selectElement('h1'))
            .then(getInnerText)
            .then(text => expect(text).toEqual('Simulators'))
            .then(done, fail);
        });

        describe('HTTP Simulators', () => {
          it('has a section for HTTP Simulators', done => {
            withDriver(driver)
              .then(within('.http-sims'))
              .then(selectElement('h2'))
              .then(getInnerText)
              .then(text => expect(text).toEqual('HTTP Simulators'))
              .then(done, fail);
          });

          forEach({ test: ['get'], crud: ['get', 'put', 'post', 'delete'] }, (methods, path) => {
            forEach(methods, method => {
              it(`has a /${path} simulator for method: ${method.toUpperCase()}`, done => {
                withDriver(driver)
                  .then(within(`.http-sim.method-${method}.url--${path}`))
                  .then(selectElement('.url'))
                  .then(getInnerText)
                  .then(innerText => {
                    expect(innerText).toContain(`${method.toUpperCase()}:`);
                    expect(innerText).toContain(`/simulators/${path}`);
                  }).then(done, fail);
              });
            });
          });
        });

        describe('WebSocket Simulators', () => {
          it('has a section for WebSocket Simulators', done => {
            withDriver(driver)
              .then(within('.ws-sims'))
              .then(selectElement('h2'))
              .then(getInnerText)
              .then(text => expect(text).toEqual('WebSocket Simulators'))
              .then(done, fail);
          });

          forEach(['socket1', 'socket2'], path => {
            it(`has a /${path} socket simulator`, done => {
              withDriver(driver)
                .then(within(`.ws-sim.url--${path}`))
                .then(selectElement('.url'))
                .then(getInnerText)
                .then(innerText => {
                  expect(innerText).toContain(`/simulators/${path}`);
                }).then(done, fail);
            });
          });
        });
      });
    });

    afterAll(done => {
      driver.quit().then(() => server.close(done));
    });
  });
});

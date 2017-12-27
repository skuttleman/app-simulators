const { BROWSERS } = require('../../../support/consts');
const { DriverAPI, getCurrentUrl, getInnerText, selectElement, withDriver, within } = require('../../../support/selenium');
const { forEach, sleep } = require('fun-util');
const { resetSims, sims } = require('../../../helpers/simulatorHelpers');
const runApp = require('../../../support/runApp');

const SIMULATORS = {
  '/route': {
    description: 'Test Description',
    response: { route: 'response' },
    method: 'post'
  },
  '/another/route': {
    description: 'Create Description',
    response: { another: 'response' },
    method: 'post'
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

    describe('UI/Http Simulator Spec', () => {
      forEach(['/route', '/another/route'], path => {
        describe(`requests page for ${path}`, () => {
          beforeEach(done => {
            const className = path.split('/').join('--');

            driver.visitHome()
              .then(() => sleep(1000))
              .then(() => sims.post(`/simulators${path}`, { some: 'data' }))
              .then(() => driver)
              .then(within(`.http-sim.method-post.url${className}`))
              .then(selectElement('.view-requests'))
              .then(element => element.click())
              .then(done);
          });

          it(`has a requests page`, done => {
            withDriver(driver)
              .then(selectElement('h1'))
              .then(getInnerText)
              .then(text => expect(text).toEqual('Requests'))
              .then(() => driver)
              .then(getCurrentUrl)
              .then(url => expect(url).toBeAUrlWithParts({ path: '/sims/requests', query: { path, method: 'POST' } }))
              .then(done, fail);
          });

          it('displays the request on the page', done => {
            withDriver(driver)
              .then(selectElement('.json > *'))
              .then(getInnerText)
              .then(JSON.parse)
              .then(([{ body, url }]) => {
                expect(body).toEqual({ some: 'data' });
                expect(url).toEqual(`/simulators${path}`);
              }).then(done, fail);
          });

          afterEach(done => {
            resetSims().then(done);
          });
        });
      });
    });

    afterAll(done => {
      driver.quit().then(() => server.close(done));
    });
  });
});

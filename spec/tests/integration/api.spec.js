const { DEFAULT_HTTP_SIMULATOR_SETTINGS } = require('../../../src/js/config/consts');
const { SIMULATORS } = require('../../support/consts');
const { concat, forEach, map, reduce, sleep } = require('fun-util');
const { resetSims, sims } = require('../../helpers/simulatorHelpers');
const runApp = require('../../support/runApp');

const MAPPED_SIMS = map(SIMULATORS, sim => {
  return [].concat(sim)
    .filter(({ socket }) => !socket)
    .map(sim => concat(DEFAULT_HTTP_SIMULATOR_SETTINGS, sim))
    .map(sim => ({ ...sim, method: (sim.method || 'get').toLowerCase() }));
});

describe('Simulator API', () => {
  let server, request;

  beforeAll(done => {
    server = runApp(done);
  });

  forEach(MAPPED_SIMS, (simulators, path) => {
    forEach(simulators, ({ method, response, delay, headers, status }) => {
      describe(`${method.toUpperCase()}: ${path}`, () => {
        beforeEach(done => {
          resetSims()
            .then(() => sims.put(`/api/response/${method}${path}`, { delay: 0 }))
            .then(() => request = sims[method](`/simulators${path}`, {}))
            .then(done);
        });

        describe('request', () => {
          it('stores a request', done => {
            sims.get(`/api/requests/${method}${path}`)
              .then(({ data }) => {
                expect(data.length).toEqual(1);
                expect(data[0].url).toEqual(`/simulators${path}`);
                expect(data[0].timestamp).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/);
              }).then(done);
          });

          it('stores multiple requests in ascending order', done => {
            request
              .then(() => sims[method](`/simulators${path}?order=middle`, {}))
              .then(() => sims[method](`/simulators${path}?order=last`, {}))
              .then(() => sims.get(`/api/requests/${method}${path}`))
              .then(({ data }) => {
                expect(data.length).toEqual(3);
                expect(data[0].query).toEqual({});
                expect(data[1].query).toEqual({ order: 'middle' });
                expect(data[2].query).toEqual({ order: 'last' });
              }).then(done);
          });

          it('resets the requests', done => {
            request
              .then(() => sims[method](`/simulators${path}`, {}))
              .then(() => sims.delete(`/api/requests/${method}${path}`))
              .then(() => sims.get(`/api/requests/${method}${path}`))
              .then(({ data }) => expect(data).toEqual([]))
              .then(done);
          });

          it('only resets the requests', done => {
            sims.put(`/api/response/${method}${path}`, { body: { updated: 'response' } })
              .then(() => sims.delete(`/api/requests/${method}${path}`))
              .then(() => sims[method](`/simulators${path}`, {}))
              .then(({ data }) => expect(data).toEqual({ updated: 'response' }))
              .then(done);
          });
        });

        describe('response', () => {
          it('updates the response body', done => {
            sims.put(`/api/response/${method}${path}`, { body: { updated: 'response' } })
              .then(() => sims[method](`/simulators${path}`, {}))
              .then(({ data }) => expect(data).toEqual({ updated: 'response' }))
              .then(done);
          });

          it('updates the response status', done => {
            sims.put(`/api/response/${method}${path}`, { status: 400, body: '' })
              .then(() => sims[method](`/simulators${path}`, {}))
              .then(({ status }) => expect(status).toEqual(400))
              .then(done);
          });

          it('updates the response delay', done => {
            let before;
            sims.put(`/api/response/${method}${path}`, { delay: 0.15 })
              .then(() => {
                before = new Date;
                return sims[method](`/simulators${path}`, {});
              }).then(() => expect(new Date() - before).not.toBeLessThan(150))
              .then(done);
          });

          it('resets the response', done => {
            let before;
            sims.put(`/api/response/${method}${path}`, { body: { updated: 'response' }, status: 400, delay: 0.1 })
              .then(() => sims.delete(`/api/response/${method}${path}`))
              .then(() => {
                before = new Date;
                return sims[method](`/simulators${path}`, {});
              }).then(({ data, status }) => {
                if (path != '/delay') {
                  expect(new Date() - before).toBeLessThan(100);
                }
                expect(status).not.toEqual(400);
                expect(data).not.toEqual({ updated: 'response' });
              }).then(done);
          });

          it('only resets the response', done => {
            sims.put(`/api/response/${method}${path}`, { body: { updated: 'response' }, status: 400, delay: 0.1 })
              .then(() => sims[method](`/simulators${path}`, {}))
              .then(() => sims.delete(`/api/response/${method}${path}`))
              .then(() => sims.get(`/api/requests/${method}${path}`))
              .then(({ data }) => expect(data).not.toEqual([]))
              .then(done);
          });

          it('gets the response details', done => {
            sims.get(`/api/response/${method}${path}`)
              .then(({ data }) => {
                const expectedBody = response === undefined ? null : response;
                expect(data.body).toEqual(expectedBody);
                expect(data.delay).toEqual(0);
                expect(data.headers).toEqual(headers);
                expect(data.status).toEqual(status);
              }).then(done);
          });
        });
      });
    });
  });

  describe('/api/reset-all', () => {
    beforeAll(done => {
      Promise.all(reduce(MAPPED_SIMS, (promises, simulators, path) => {
        return promises.concat(Promise.all(simulators.map(({ method }) => {
          return Promise.all([
            sims.put(`/api/response/${method}${path}`, { body: { some: 'updated response' }, status: 401 }),
            sims[method](`/simulators${path}`, {})
          ]);
        })));
      }, [])).then(done);
    });

    beforeEach(done => {
      sims.delete('/api/reset-all').then(done);
    });

    forEach(MAPPED_SIMS, (simulators, path) => {
      forEach(simulators, ({ method }) => {
        describe(`${method.toUpperCase()}: ${path}`, () => {
          it('has no stored requests', done => {
            sims.get(`/api/requests/${method}${path}`)
              .then(({ data }) => expect(data).toEqual([]))
              .then(done);
          });

          it('does not have the updated response', done => {
            sims[method](`/simulators${path}`, {})
              .then(({ data, status }) => expect(data).not.toEqual({ some: 'updated response' }))
              .then(done);
          });

          it('does not have the updated status', done => {
            sims[method](`/simulators${path}`, {})
              .then(({ data, status }) => expect(status).not.toEqual(401))
              .then(done);
          });
        });
      });
    });
  });

  afterAll(() => {
    server.close();
  });
});
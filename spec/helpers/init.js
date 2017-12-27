const Reporter = require('jasmine-spec-reporter');
const jasmineEnv = jasmine.getEnv();
const toBeAUrlWithParts = require('./customMatchers/toBeAUrlWithParts');

jasmineEnv.clearReporters();

jasmineEnv.addReporter(new Reporter({
  displayStacktrace: 'summary'
}));

beforeAll(() => {
  jasmine.addMatchers({
    toBeAUrlWithParts
  });
});
const { Builder, Capabilities, By } = require('selenium-webdriver');

class DriverAPI {
  constructor(driver, context = '') {
    this.driver = driver;
    this.context = context.trim();
  }

  static factory(browser) {
    const driver = new Builder()
      .withCapabilities(Capabilities[browser]())
      .build();

    return new DriverAPI(driver);
  }

  findElements(css) {
    const selector = `${this.context} ${css}`.trim();
    if (this.driver instanceof DriverAPI) {
      return this.driver.findElements(selector);
    }
    return this.driver.findElements(By.css(selector));
  }

  findElement(css) {
    return this.findElements(css)
      .then(results => {
        if (results.length === 1) {
          return results[0];
        }
        throw new Error('Expected exactly one element for css', css);
      });
  }

  quit() {
    return this.driver.quit();
  }

  get(url) {
    return this.driver.get(url);
  }
}

const getInnerText = element => element.getAttribute('innerText');

const selectElement = css => driver => driver.findElement(css);

const withDriver = driver => Promise.resolve(driver);

const within = css => driver => new DriverAPI(driver, css);

module.exports = {
  DriverAPI,
  selectElement,
  getInnerText,
  withDriver,
  within
};
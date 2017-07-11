const outbound = require('express-outbound');
const express = require('express');

const or = (value1, value2) => value1 || value2;

const match = (string, patterns) => {
  return patterns
    .map(pattern => string.match(pattern))
    .reduce(or);
};

const requestIsStaticAsset = (accept, url) => {
  return match(String(accept), [/text\/html/, /text\/css/, /text\/javascript/]) ||
    match(String(url), [/\.js$/, /\.css$/, /\.html$/]);
};

const logger = () => {
  const route = outbound.Router(express);

  route.use('/simulators', ({ url, method, headers: { accept = '' } }, response, next) => {
    if (!requestIsStaticAsset(accept, url)) {
      return next(body => {
        console.log(`${method} ${url}: ${response.statusCode}`);
        response.send(body);
      });
    }
    next();
  });

  return route;
};

module.exports = logger;

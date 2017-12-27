const { deepEqual, reduce } = require('fun-util');

const splitQuery = query => {
  return reduce(query.split('&'), (query, kv) => {
    const [key, value] = kv.split('=');
    return {
      ...query,
      [key]: value
    };
  }, {});
};

const parseUrl = url => {
  const match = /(https?):\/\/([^:^\/]*):?(\d+)?(\/[^?]*)(\?[^#]+)?(\#.*)?/;
  const [_, protocol, domain, port, path, query, anchor] = url.match(match);
  const parsed = { protocol, domain, path };
  if (port) parsed.port = Number(port);
  if (query) parsed.query = splitQuery(query.slice(1));
  if (anchor) parsed.anchor = anchor;
  return parsed;
};

const matchUrl = (parsed, match, key) => {
  if (typeof parsed[key] === 'string') {
    return parsed[key].match(match);
  }
  return deepEqual(parsed[key], match);
};

const buildMessages = parsed => (messages, match, key) => {
  if (typeof parsed[key] === 'object') {
    return messages.concat(reduce(match, buildMessages(parsed[key]), []));
  } else if ((typeof parsed[key] === 'string' && !parsed[key].match(match)) || parsed[key] !== match) {
    return messages.concat(`${parsed[key]} does not match ${match}`);
  }
  return messages;
};

const toBeAUrlWithParts = () => {
  return {
    compare(url, expected) {
      const parsed = parseUrl(url);
      const messages = reduce(expected, buildMessages(parsed), []);
      return {
        pass: !messages.length,
        message: `The following url parts did not match: ${messages.join(', and')}`
      };
    }
  };
};

module.exports = toBeAUrlWithParts;

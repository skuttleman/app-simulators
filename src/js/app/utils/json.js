import { silent, type } from 'fun-util';

const stringify = data => JSON.stringify(data, null, 2);

export const pretty = data => type(data) === 'string' ? data : stringify(data);

export const isValid = string => {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }
  return true;
};

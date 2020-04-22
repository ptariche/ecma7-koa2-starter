'use strict';

const BCRYPT  = require('bcrypt');
const AXIOS   = require('axios');

// ENVIRONMENT VARIABLES
const SALT    = process.env.SALT || 'faekkkeee00$';

if (!SALT) {
  console.error('A SALT environment variable is required');
  process.exit(0);
}

class Request {
  static async get (uri) {
    return await AXIOS.get(uri);
  };

  static async post (uri) {
    return await AXIOS.post(uri);
  };
};

let helpers     = {};
helpers.bcrypt  = {};
helpers.request = Request;

helpers.chain = async (_functions) => {
  let _this  = null;
  let result = null;
  for (let i = 0; i < _functions.length; i++) {
    let _function = _functions[i];
    result = _this ? await _this[_function]() : await _function();
    _this = result;
  }

  return result;
};

helpers.bcrypt.genSalt = (rounds, ignore) => {
  return new Promise( (resolve, reject) => {
    BCRYPT.genSalt(rounds, ignore, (err, salt) => {
      if (err) return reject(err);
      return resolve(salt);
    });
  });
};

helpers.bcrypt.hash = (data, salt) => {
  return new Promise( (resolve, reject) => {
    BCRYPT.hash(data, (salt ? salt : SALT), (err, hash) => {
      if (err) return reject(err);
      return resolve(hash);
    });
  });
};

helpers.bcrypt.compare = (data, hash) => {
  return new Promise( (resolve, reject) => {
    BCRYPT.compare(data, hash,  (err, matched) => {
      if (err) return reject(err);
      return resolve(matched);
    });
  });
};

module.exports = helpers;

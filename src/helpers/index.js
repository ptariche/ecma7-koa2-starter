'use strict';

const THENIFY = require('thenify');
const BCRYPT  = require('bcrypt');

// ENVIRONMENT VARIABLES
const SALT    = process.env.SALT || 'faekkkeee00$';

if (!SALT) {
  console.error('A SALT environment variable is required');
  process.exit(0);
}

let helpers    = {};
helpers.bcrypt = {};

helpers.chain = async (_functions) => {
  let _this  = null;
  let result = null;
  for (let i = 0; i < _functions.length; i++) {
    let _function = _functions[i];
    result = _this ? await _this[_function]() : await _function();
    _this = result;
  };

  return result;
};

helpers.thenify = (func, context) => {
  return context ? THENIFY(func).bind(context) : THENIFY(func);
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

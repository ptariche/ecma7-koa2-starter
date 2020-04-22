'use strict';

// NODE MODULES
const QUERY   = require('couchbase').N1qlQuery;
const UUID    = require('node-uuid');

// HELPERS
const THENIFY = require('../helpers/').thenify;

class User {
  constructor(db, user) {
    this.db             = db             || null;
    this.user           = {};
    this.user.email     = user.email     || null;
    this.user.firstName = user.firstName || null;
    this.user.lastName  = user.lastName  || null;
    this.user.password  = user.password  || null;
  };

  async create () {
    return await this.db.bucket.insertAsync(UUID.v1() + '-' + UUID.v4(), this.user, {expiry: 0});
  };

  async find (lookup) {
    return await this.db.bucket.getAsync(lookup, {});
  };

  async update (lookup, insert) {
    return await this.db.bucket.replaceAsync(lookup, insert);
  };

  async remove (lookup) {
    return await this.db.bucket.removeAsync(lookup, {});
  };

};

module.exports = User;

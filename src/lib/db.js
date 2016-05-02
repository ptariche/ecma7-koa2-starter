'use strict';

const EVENT_EMITER = require('events').EventEmitter;
let couchbase      = require('couchbase-promises');

class Db extends EVENT_EMITER {
  constructor(couchbaseUri, couchbaseBuck, password) {
    super();
    this.cluster = new couchbase.Cluster(couchbaseUri, password);
    this.bucket  = this.cluster.openBucket(this.couchbaseBuck, (err) => {
      if (err) this.emit('error', err);
    });
    this.on('error', this.error);
  };

  setCluster(couchbaseUri, password) {
    this.cluster = new couchbase.Cluster(couchbaseUri, password);
    return this;
  };

  setBucket(couchbaseBuck) {
    this.bucket  = this.cluster.openBucket(couchbaseBuck, (err) => {
      if (err) this.emit('error', err);
    });
    return this;
  };

  error(err) {
    throw err;
    process.exit(0);
  };
};

module.exports = Db;

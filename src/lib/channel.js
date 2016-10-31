'use strict';

const CO           = require('co');
const SLEEP        = require('co-sleep');
const EVENT_EMITER = require('events').EventEmitter;
let Channels       = require('channel');

class Channel extends EVENT_EMITER {
  constructor(channelCapicity, workerCapicity) {
    super();
    this.on('error', this.error);

    this.channels = new Channels( channelCapicity || 0 );
    this.workers  = this.startWorkers( ( workerCapicity || 3) );
    this.fn       = {};
    this.queue    = false;
  };

  setWorkerContext(fn) {
    if (this.queue) {
      return this;
    } else {
      this.fn = fn;
      return this;
    }
  };

  startWorkers(capicity) {
    let ctx = this;
    for (var i = 0; i < capicity; i++) {
      CO( ctx.worker.bind(ctx), i ).catch(ctx.error);
    }
  };

  async worker(i) {
    let ctx = this;
    while (1) {
      const V = ( await ctx.channels.recv() || [] );
      if (ctx.fn && V && V[0] && V[1]) {
        let result = await ctx.fn[V[0]](V[1]);
        console.log('[%d]: fn: %s %s ', i, V[0], V[1]);
        ctx.queue = true;
      } else {
        ctx.queue = false;
        break;
      }
    }
  };

  setChannelCapicity(capicity) {
    this.closeChannel();
    this.channels = new Channels(capicity);
    return this;
  };

  closeChannel() {
    this.channels.close();
    return this;
  };

  error(err) {
    throw err;
  };
};

module.exports = Channel;

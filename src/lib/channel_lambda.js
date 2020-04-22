'use strict';

class ChannelLambda {
  static build (ctx) {
    ctx.state.channel.fn['request.get']  = require('./../helpers/').request.get;
    ctx.state.channel.fn['request.post'] = require('./../helpers/').request.post;
    return ctx.state.channel.fn;
  };
};

module.exports = ChannelLambda.build;

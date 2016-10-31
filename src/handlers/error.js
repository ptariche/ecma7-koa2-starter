'use strict';

module.exports = async (ctx, next) => {
  ctx.state.channel.channels.send(['request.get', 'http://yahoo.com']);
  ctx.state.channel.channels.send(['request.post', 'http://github.com']);

  ctx.status = 404;
  ctx.body   = {
    code: ctx.status,
    data: {
      error: 'Endpoint not found'
    }
  };
  return ctx.body;
};

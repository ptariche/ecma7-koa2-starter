'use strict';

module.exports = async (ctx, next) => {
  ctx.status = 404;
  ctx.body   = { code: ctx.status, data: { error: 'Endpoint not found'} };
  return ctx.body;
};

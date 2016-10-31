'use strict';

const CHAIN        = require('./../../helpers/index').chain;
let UserController = require('./../../controllers/user');

module.exports.post = async (ctx, next) => {
  return ctx.body = await CHAIN([ () => {
    return new UserController(ctx, next);
  }, 'logic', 'response']);
};

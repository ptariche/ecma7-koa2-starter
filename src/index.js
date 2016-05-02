'use strict';

// BABEL REGISTER FOR ASYNC/AWAIT ECMA 7
require('babel-register');

// NODE MODULES
const KOA            = require('koa');
const CORS           = require('kcors');
const BODY_PARSER    = require('koa-bodyparser');
const LOGGER         = require('koa-logger');
const RESPONSE_TIME  = require('koa-response-time');
const ROUTER         = require('koa-router');
const CONVERT        = require('koa-convert');
const SESSION        = require('koa-generic-session');

// ENVIRONMENT VARIABLES
const SECRET         = process.env.SECRET           || 'faekkkeee00$';
const PORT           = process.env.PORT             || 3000;
const COUCHBASE_URI  = process.env.COUCHBASE_URI    || 'couchbase://127.0.0.1';
const COUCHBASE_BUCK = process.env.COUCHBASE_BUCKET || 'default';
const PASSWORD       = process.env.PASSWORD         || 'superfakepassword';

// DATABASE POOL
const DB             = require('./lib/db');
const DB_INSTANCE    = new DB(COUCHBASE_URI, COUCHBASE_BUCK, PASSWORD);

// APP
const APP = new KOA();

// ALLOW PROXY REQUESTS
APP.proxy = true;

// RESPONSE TIME & LOGGING
APP.use(CORS());
APP.use(RESPONSE_TIME());
APP.use(LOGGER());

// SESSION
APP.keys = [SECRET];
APP.use(CONVERT(SESSION()));

// BODY PARSER
APP.use(BODY_PARSER({
  onerror: (err, ctx) => {
    ctx.throw('Error parsing the body information', 422);
  }
}));

// PASS DATABASE INSTANCE TO CTX CONTEXT
APP.use(async (ctx, next) => {
  ctx.state.db = DB_INSTANCE;
  await next();
});

// HANDLERS
// CONTROLLER HANDLERS
let userHandler    = require('./handlers/controllers/user');

// ERROR HANDLER
let errorHandler   = require('./handlers/error');

// ROUTER
let route = ROUTER();

route.post('/user/create', userHandler.post);

route.all('*', errorHandler);

APP.use(route.routes());
APP.use(route.allowedMethods());
APP.listen(PORT);

module.exports = APP;

console.log('Server listening on port: ', PORT);

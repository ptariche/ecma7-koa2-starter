'use strict';

// NODE MODULES
const DEBUG         = require('debug')('koa2Example:userController');
const EVENT_EMITER  = require('events').EventEmitter;
const IS            = require('is_js');

// MODELS
const USER          = require('../models/user');

class User extends EVENT_EMITER {
  constructor(ctx, next) {
    super();

    this.db              = ctx.state.db || null;
    this.ctx             = ctx;
    this.next            = next;

    this._error          = false;
    this._errors         = [];

    this._state          = {};

    this.respond         = {};
    this.respond.status  = null;
    this.respond.body    = null;
    /** CHANGE BUCKET
    ctx.state.db.setBucket('users');
    **/
    this.on('error', this.error);
  };

  error(problem) {
    try {
      this._errors.push(problem.error);
      this._error         = true;
      this.respond.status =  problem.status        || 500;
      this.respond.body   = { errors: this._errors || 'An internal server error has occured'};
    } catch (err) {
      throw err;
    }
  };

  model(user) {
    return new USER(this.db, {email: user.email, firstName: user.firstName, lastName: user.lastName, password: user.password});
  };

  setState (user) {
    this._state            = this.state     || {};
    this._state.email      = user.email     || null;
    this._state.firstName  = user.firstName || null;
    this._state.lastName   = user.lastName  || null;
    this._state.password   = user.password  || null;

    return this;
  };

  async create (user) {
    return await this.model(this._state).create();
  };

  async hygiene() {

    let user       = {};

    let body       = ( this.ctx.request && this.ctx.request.body )           ? this.ctx.request.body : this.emit('error', { status: 412, error: 'A body must be posted'})         || null;
    user.email     = ( body && body.email && IS.email(body.email) )          ? body.email            : this.emit('error', { status: 412, error: 'A valid email is required'})     || null;
    user.firstName = ( body && body.firstName && IS.string(body.firstName) ) ? body.firstName        : this.emit('error', { status: 412, error: 'A valid firstName is required'}) || null;
    user.lastName  = ( body && body.lastName && IS.string(body.lastName) )   ? body.lastName         : this.emit('error', { status: 412, error: 'A valid lastName is required'})  || null;

    if (!this._error) this.setState(user);

    return this;
  };

  async logic() {
    await this.hygiene();
    if (!this._error) {

      let user   = { email: this._state.email, firstName: this._state.firstName, lastName: this._state.lastName, password: this._state.password };
      user       = await this.create(user);

      if (user.cas) {
        this.respond.body   = { user: { created: true} };
        this.respond.status = 200;
      } else {
        this.respond.body   = { user: { created: false} };
        this.respond.status = 200;
      }

      return await Promise.resolve(this);
    } else {
      return this;
    }
  };

  response() {
    this.ctx.status = this.respond.status || 500;
    this.ctx.body   = { code: this.ctx.status, data: this.respond.body }   || { code: this.ctx.status, data: { error: 'An internal error has occured' } };
    return this.ctx.body;
  };

};

module.exports = User;

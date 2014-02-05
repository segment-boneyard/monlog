
/**
 * Module dependencies.
 */

var responseTime = require('koa-response-time');
var assert = require('http-assert');
var logger = require('koa-logger');
var monquery = require('monquery');
var route = require('koa-route');
var json = require('koa-json');
var parse = require('co-body');
var koa = require('koa');
var logs = require('./db');

/**
 * Application.
 */

var app = module.exports = koa();

// middleware

app.use(logger());
app.use(json());
app.use(responseTime());

// routes

app.use(route.get('/', search));
app.use(route.post('/', create));

/**
 * GET to query logs with monquery.
 *
 * Query:
 *
 *  - `limit` response limit [20]
 *  - `fields` response fields
 */

function *search() {
  var body = yield text(this);
  var query = body ? monquery(body) : {};
  this.body = yield logs.find(query, options(this));
}

/**
 * POST to create a log.
 */

function *create() {
  var body = yield parse(this);

  assert(body.timestamp, 400, '.timestamp required');
  assert(body.hostname, 400, '.hostname required');
  assert(body.message, 400, '.message required');
  assert(body.level, 400, '.level required');
  assert(body.type, 400, '.type required');

  yield logs.insert(body, { safe: false });

  this.status = 201;
}

/**
 * Search response options.
 */

function options(ctx) {
  return {
    limit: limit(ctx),
    fields: fields(ctx)
  }
}

/**
 * Return limit.
 */

function limit(ctx) {
  return ctx.query.limit || 20;
}

/**
 * Return fields.
 */

function fields(ctx) {
  if (ctx.query.fields) return ctx.query.fields.split(',');
}

/**
 * Buffer request.
 */

function text(ctx) {
  return function(fn){
    var buf = '';
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', function(d){ buf += d });
    ctx.req.on('end', function(){
      fn(null, buf);
    });
  }
}

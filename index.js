
/**
 * Module dependencies.
 */

var responseTime = require('koa-response-time');
var assert = require('http-assert');
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

app.use(json());
app.use(responseTime());

// routes

app.use(route.get('/stats', stats));
app.use(route.get('/', search));
app.use(route.post('/', create));

// rate ticker

var rate = 0;
setInterval(function(){
  console.log('%s - rate: %d', new Date().toUTCString(), rate);
  rate = 0;
}, 5000);

/**
 * GET stats.
 */

function *stats() {
  this.body = yield {
    count: logs.count({})
  };
}

/**
 * GET to query logs with monquery.
 *
 * Query:
 *
 *  - `limit` response limit [20]
 *  - `fields` response fields
 */

function *search() {
  var body = this.query.query;
  var query = body ? monquery(body) : {};
  console.log('%s - query: %j -> %j', new Date().toUTCString(), body, query);
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

  rate++;
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

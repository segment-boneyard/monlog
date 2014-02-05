
/**
 * Module dependencies.
 */

var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/monlog');

/**
 * Collection.
 */

var logs = module.exports = wrap(db.get('logs'));

/**
 * Indexes.
 */

logs.index('timestamp');
logs.index('hostname timestamp');
logs.index('level timestamp');
logs.index('type timestamp');

/**
 * Module dependencies.
 */

var request = require('superagent');

setInterval(function(){
  console.log('... sending');

  request
  .post('http://localhost:3000')
  .send({
    timestamp: Date.now(),
    hostname: 'api-1',
    type: 'login',
    level: 'info',
    message: {
      user: {
        name: {
          first: 'Tobi',
          last: 'Ferret'
        }
      }
    }
  }).end();
}, 500);
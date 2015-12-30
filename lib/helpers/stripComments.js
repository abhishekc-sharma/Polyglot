const es = require('event-stream');
/*  */
module.exports['/*'] = function() {
  return es.replace(/\/\*[\s\S]*?\*\//gm, '');
};

module.exports['//'] = function() {
  return es.replace(/\/\/.*$/gm, '');
};

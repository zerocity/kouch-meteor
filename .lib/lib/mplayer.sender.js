var cp = require('child_process');
var n = cp.fork(__dirname + '/mplayer.server.js');

console.log(__dirname + '/mplayer.server.js');

n.on('message', function(m) {
  console.log('PARENT got message:', m);
});

n.send({ hello: 'world' });
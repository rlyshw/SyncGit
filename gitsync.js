var http = require('http');

var helpMsg = "\nUsage:  node gitsync -s secret [-b branch] [-p port] [-r route]\n"+
            "    webhooksecret - the secret of the associated webhook\n"+
            "    [branch] - (default 'master') the branch you will be syncing with\n"+
            "    [port] - (default 3021) port that the webhook should listen on.\n"+
            "    [route] - (default /nodedevhook) the route endpoint of the webhook";
var secret;
var branch;
var port;
var route;


process.argv.forEach(function(arg, i){
  var param = process.argv[i+1];
  if(arg.match(/^-s/)){
    secret = param;
  }
  if(arg.match(/^-b/)){
    branch = param;
  }
  if(arg.match(/^-p/)){
    port = param;
  }
  if(arg.match(/^-r/)){
    route = param;
  }
});

branch = branch || "master";
port = port || "3021";
route = route || "/nodedevhook";

if(!secret){
  console.log("\nSecret value is required\n",helpMsg);
  return;
} else if (secret==="help"||secret==="-h"||secret.match(/^--/)) {
  console.log(helpMsg);
  return;
}
var handler = require('github-webhook-handler')({path: route, secret: secret});

var git = require("gitty");
var repo = git("./");

http.createServer(function(req, res) {
  handler(req, res, function(err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(port, '0.0.0.0');
console.log("\nListening on port",port,"at",route,"for PUSH events on the",branch,"branch...\n");
handler.on('error', function(err){
  console.error("Error:", err.message);
});

handler.on('ping', function(event){
  console.log(event.payload.zen);
});

handler.on('push', function(event){
  repo.pull('origin', branch, function(err, succ){
    if(err) return console.log(err);
    console.log(succ);
  });
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
});

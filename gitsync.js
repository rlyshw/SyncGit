var http = require('http');

var secret = process.argv[2];
var branch = process.argv[3] || 'master';
var port = process.argv[4] || "3021";
var endpoint = process.argv[5] || "/nodedevhook"
var helpMsg = "\nUsage:  node gitsync mywebhooksecret [branch] [port] [endpoint]\n"+
            "    webhooksecret - the secret of the github webhook associated with this environment\n"+
            "    [branch] - (default 'master') the branch you will be syncing with\n"+
            "    [port] - (default 3021) port that the webhook should listen on.\n"+
            "    [endpoint] - (default /nodedevhook) the route endpoint that webhook will post to";
if(!secret){
  console.log("\nSecret value is required\n",helpMsg);
  return;
} else if (secret==="help"||secret==="-h"||secret.match(/^--/)) {
  console.log(helpMsg);
  return;
}
var handler = require('github-webhook-handler')({path: endpoint, secret: secret});

var git = require("gitty");
var repo = git("./");

http.createServer(function(req, res) {
  handler(req, res, function(err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(port, '0.0.0.0');
console.log("\nListening on port",port,"at",endpoint,"for PUSH events on the",branch,"branch...");
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

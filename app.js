var http = require("http");
var exec = require('child_process').exec;
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/', secret: 'secret' });
 
http.createServer(function(req, res) {
        handler(req, res, function (err) {
                res.statusCode = 404
                res.end('no such location')
        });
}).listen(3033);
 
handler.on('push', function (event) {
        var comps = event.payload.ref.split('/');
        console.log("test",event.payload);
//console.log("------------");return;
	var data = event.payload;
	var repo_name = data.repository.name;
	
	if(comps[2] != 'master') {
              console.log('Received a push on %s and no build has is triggered', comps[2]);
              return;
        }
        console.log('Received a push on production, build started...');
exec('sh ./script.sh', {cwd: '/home/bitnami/apps/'+repo_name+''},function(error, stdout, stderr) {
//        exec('./../'+repo_name+'/script.sh', function(error, stdout, stderr) {
                console.log(error,stderr,stdout);
                if(error != null) {
                        console.log('Error during the execution of redeploy: ' + stderr);
                }
        });
});

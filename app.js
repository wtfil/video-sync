/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    static = path.join(__dirname, 'public'),
    jsBuilder = require('./lib/builder'),
    socket = require('./lib/socket'),
    app = express(),
    server = http.createServer(app);


socket.listen(server);

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(jsBuilder(static));
app.use(express.static(static));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/room/:id', routes.index);
app.get('/video', routes.getVideo);
app.post('/video', routes.setVideo);

server
    .listen(3000, function(){
        console.log('Express server listening on port 3000');
    })
    .on('error', function () {
        console.error('\n    Port in use\n    Run "killall -9 node" to kill another node app');
    });

/**
 * Module dependencies.
 */
/*global require */
/*jshint laxcomma:true */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , expressUglify = require('express-uglify')
  , httpProxy = require('http-proxy')
  , url = require('url')
  , proxy
  , app;

app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.compress());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // Minify and compile less to css
  app.use(require('less-middleware')({ 
      src: __dirname + '/public', 
      compress:true, 
      optimization:2 
  }));
  // Minify JavaScript
  app.use(expressUglify.middleware({
    src: __dirname + '/public',
    logLevel:'info'
  }));
  app.use(express['static'](path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

proxy = new httpProxy.RoutingProxy();

// My attempt to use node http-proxy, may or may not work
// Seems to work when trying to proxy to a web site, so ok
app.all('/proxy', function (req, res) {
    var buffer,
        url_,
        _query,
        _query_url,
        full_url,
        clean_url;

    /*
    * Apparently need this buffer because
    * express turns a POST body response
    * into an object.
    **/
    buffer = httpProxy.buffer(req);
    url_ = req.url.split('?')[1];
    _query = req.url.split('?')[2];
    _query_url = '';
    if (typeof _query !== 'undefined') {
        _query_url = '?' + _query;
    }
    full_url = url_ + _query_url;
    req.url = full_url;
    clean_url = url.parse(url_);
    // I was testing with a normal http.request, which should work too
    /*
    var opts = {
        host: clean_url.host,
        path:clean_url.path + url_req ? '?'+url_req : '',
        method: req.method,
        headers: {
            HOST: clean_url.host
        }
    };
    var r = http.request(opts, function (response) {
        console.log('status: ', response.statusCode);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            res.write(chunk);
        });
        response.on('close', function () {
            res.writeHead(response.statusCode);
            res.end();
        });
    });
    return r.end();
    */
    proxy.proxyRequest(req, res, {
        host: clean_url.host,
        port: 80,
        buffer: buffer
    });

});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

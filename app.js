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
  app.use(require('connect-restreamer')());
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
        clean_url;

    /*
    * Apparently need this buffer because
    * express turns a POST body response
    * into an object.
    **/
    buffer = httpProxy.buffer(req);
    url_ = req.url.split("?")[1];
    req.url = url_;
    clean_url = url.parse(url_);
    proxy.proxyRequest(req, res, {
        host: clean_url.host,
        port:80,
        buffer: buffer
    });

});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global require process __dirname console*/
/*jshint laxcomma:true */
(function() {
    'use strict';


    var express = require('express'),
        routes = require('./routes'),
        http = require('http'),
        path = require('path'),
        expressUglify = require('express-uglify'),
        httpProxy = require('http-proxy'),
        url = require('url'),
        fs = require('fs'),
        deploy_url = 'http://localhost:' + (process.env.PORT || 3000) + '/',
        proxy,
        app,
        getConfig,
        readJsonFileSync;

    app = express();

    readJsonFileSync = function (path, encoding) {
        if (typeof encoding == 'undefined') encoding = 'utf8';
        var file = fs.readFileSync(path, encoding);
        return JSON.parse(file);
    };

    getConfig = function (file) {
        var filepath = __dirname + '/' + file;
        return readJsonFileSync(filepath);
    };

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
        /*
        app.use(expressUglify.middleware({
            src: __dirname + '/public',
            logLevel:'info'
        }));
        */
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

        proxy.proxyRequest(req, res, {
            host: clean_url.host,
            port: 80,
            buffer: buffer
        });

    });

    app.get('/config', function (req, res) {
        // Ideally, this could come from a db source
        var json = getConfig('config.json');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(json));
    });

    if(process.env.SUBDOMAIN){
        deploy_url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
    }

    http.createServer(app).listen(app.get('port'), function(){
        console.log('The http server has started at: ' + deploy_url);
    });

})();


/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global define require console esri location */
(function() {
    'use strict';

    require({
        async: true,
        parseOnLoad: true,
        aliases: [["text", "dojo/text"]],
        packages: [
            {
            name: "views",
            location: location.pathname.replace(/\/[^\/]+$/, "") + "javascripts/views"
        }, {
            name: "helpers",
            location: location.pathname.replace(/\/[^\/]+$/, "") + "javascripts/helpers"
        }, {
            name: "widgets",
            location: location.pathname.replace(/\/[^\/]+$/, "") + "javascripts/widgets"
        }
        ]
    });

    require(['dojo/ready', 'views/ViewManager', 'helpers/shim', 'dojo/domReady!'], function(ready, VM) {
        ready(function () {
            // Read the config from a url
            esri.request({
                url: '/config',
                handlesAs: 'json'
            }).then(function(config) {

                if ('proxy' in config) {
                    esri.config.defaults.io.proxyUrl = config.proxy.url;
                    esri.config.defaults.io.alwaysUseProxy = config.proxy.alwaysUseProxy;
                }

                var vm = new VM(config);
                vm.render();

            }, function(error) {
                console.log('an error occured loading config file', error);
            });
        });
    });

}).call(this);

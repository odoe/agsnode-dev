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
        name: "moment",
        location: location.pathname.replace(/\/[^\/]+$/, "") + "javascripts/libs/moment",
        main: "moment.min"
      }, {
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

  require(['views/ViewManager', 'helpers/shim', 'dojo/domReady!'], function(VM) {

      esri.config.defaults.io.proxyUrl = "/proxy";
      // Read the config from a url
      var request = esri.request({
          url: '/config',
          handlesAs: 'json'
      });

      request.then(function(response) {
          //App.initialize(response);
          var vm = new VM(response);
          vm.render();
      }, function(error) {
          console.log('an error occured loading config file', error);
      });

  });

}).call(this);

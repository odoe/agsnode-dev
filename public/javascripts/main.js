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
      }, {
        name: "app",
        location: location.pathname.replace(/\/[^\/]+$/, "") + "javascripts",
        main: "app"
      }
    ]
  });

  require(['app', 'helpers/shim', 'dojo/domReady!'], function(App) {

      esri.config.defaults.io.proxyUrl = "/proxy";
      // Read the config.json file
      // Ideally, this should probably
      // be from a REST endpoint.
      // I've toyed with MongoDB to store
      // this information
      var request = esri.request({
          url: 'config.json',
          handlesAs: 'json'
      });

      request.then(function(response) {
          delete response._ssl;
          App.initialize(response);
      }, function(error) {
          console.log('an error occured loading config file', error);
      });

  });

}).call(this);

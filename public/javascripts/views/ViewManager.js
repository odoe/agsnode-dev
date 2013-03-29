/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global console define require esri document*/
(function() {
    'use strict';

    define([
           'require',
           'views/map/MapView'
    ], function(require, MapView) {

        /**
        * Load the geocoder widget
        * @param {Object} data
        */
        function geocodeLoader(widget, data) {
            require(['esri/dijit/Geocoder'], function () {
                var options = widget.options;
                options.map = data.map;
                return new esri.dijit.Geocoder(options, 'geocoderSearch').startup();
            });
        }

        /**
        * Helper function to decide what widgets to load
        * @param {string} widgetName
        * @param {Object} data
        */
        function widgetLoader(widget, data){
            widget.options = widget.options || {};
            // esri widgets
            if (widget.name === 'geocoder') {
                geocodeLoader(widget, data);
            }
            // Testing a Widget Factory pattern
            if (widget.path) {
                require([widget.path], function(Widget) {
                    if (widget.requireOperational) {
                        widget.options.operational = data.operational;
                    }
                    if (widget.requireMap) {
                        widget.options.map = data.map;
                    }
                    Widget.create(widget.options);
                });
            }
        }

        /**
        * ViewManager Controller that handles what widgets are added to application
        * @constructor
        */
        var VM = function(config) {
            this._config = config;
            if ('appName' in this._config) {
                document.getElementById('app-name').innerHTML = this._config.appName;
            }
            if ('title' in this._config) {
                document.title = this._config.title;
            }
        };

        /**
        * Render function that will start viewable items
        * @return {ViewManager} Returns itself
        */
        VM.prototype.render = function() {
            var mapView = new MapView(this._config),
            widgets = this._config.widgets;

            mapView.on('mapIsReady',function(result) {
                var len = widgets.length;
                // Check the config for widgets
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        widgetLoader(widgets[i], result);
                    }
                }
            });

            mapView.render();

            return this;
        };

        return VM;
    });
}).call(this);

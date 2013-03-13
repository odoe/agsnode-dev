/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global console define require esri document*/
(function() {
    'use strict';

    define([
        'views/map/MapView'
        ], function(MapView) {

            var basemapLoader,
                legendLoader,
                widgetLoader,
                geocodeLoader,
                VM;

            /**
            * Loads the basemap widget
            * @param {Object} data
            */
            basemapLoader = function(widget, data) {

                require([
                    'esri/dijit/BasemapGallery',
                    'widgets/basemaps/BasemapMenuWidget'
                    ], function (BasemapGallery, BasemapMenuWidget) {

                    var bmg = new BasemapGallery({
                        showArcGISBasemaps: true,
                        map: data.map
                    });

                    bmg.on('load', function() {
                        bmg.select(bmg.basemaps[bmg.basemaps.length-1].id);
                        var basemaps = new BasemapMenuWidget();
                        basemaps.startup(data.bmg);
                    });


                });

            };

            /**
             * Loads the legend widget
             * @param {Object} data
             */
            legendLoader = function(widget, data) {

                require(['widgets/legendtoc/LegendMenuWidget'], function (LegendMenuWidget) {
                    var legendMenu = new LegendMenuWidget();
                    legendMenu.startup(data.operational);
                });

            };

            /**
            * Load the geocoder widget
            * @param {Object} data
            */
            geocodeLoader = function (widget, data) {

                require(['esri/dijit/Geocoder'], function () {

                    var options = widget.options;
                    options.map = data.map;
                    return new esri.dijit.Geocoder(options, 'geocoderSearch').startup();

                });

            };

            /**
             * Helper function to decide what widgets to load
             * @param {string} widgetName
             * @param {Object} data
            */
            widgetLoader = function(widget, data){
                if (widget.name === 'basemap') {
                    basemapLoader(widget, data);
                }
                if (widget.name === 'legend' && data.operational.length > 0) {
                    legendLoader(widget, data);
                }
                if (widget.name === 'geocoder') {
                    geocodeLoader(widget, data);
                }
            };

            /**
            * ViewManager Controller that handles what widgets are added to application
            * @constructor
            */
            VM = function(config) {
                this._config = config;
                if (!!this._config.appName) {
                    document.getElementById('app-name').innerHTML = this._config.appName;
                }
            };

            /**
            * Render function that will start viewable items
            * @return {ViewManager} Returns itself
            */
            VM.prototype.render = function() {

                var mapView,
                    _widgets;

                mapView = new MapView(this._config);

                _widgets = this._config.widgets;
                mapView.on('mapIsReady',function(result) {

                    var i,
                        len;
                    // Check the config for widgets
                    if (_widgets.length > 0) {
                        for (i = 0, len = _widgets.length; i < len; i++) {
                            widgetLoader(_widgets[i], result);
                        }
                    }

                });

                mapView.render();

                return this;

            };

            return VM;

        });

}).call(this);

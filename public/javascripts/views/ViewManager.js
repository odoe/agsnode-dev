/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global console define require esri document*/
(function() {
    'use strict';

    define([
        'views/map/MapView'
        ], function(MapView) {

            /**
             * Loads the basemap widget
             * @param {Object} data
             */
            function basemapLoader(widget, data) {
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
            }

            /**
             * Loads the legend widget
             * @param {Object} data
             */
            function legendLoader(widget, data) {
                require(['widgets/legendtoc/LegendMenuWidget'], function (LegendMenuWidget) {
                    var legendMenu = new LegendMenuWidget();
                    legendMenu.startup(data.operational);
                });
            }

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
                if (widget.name === 'basemap') {
                    basemapLoader(widget, data);
                }
                if (widget.name === 'legend' && data.operational.length > 0) {
                    legendLoader(widget, data);
                }
                if (widget.name === 'geocoder') {
                    geocodeLoader(widget, data);
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

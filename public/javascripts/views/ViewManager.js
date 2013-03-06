/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global console define require*/
(function() {
    'use strict';

    define([
        'dojo/query',
        'views/map/MapView'
        ], function(query, MapView) {

            var basemapLoader,
                legendLoader,
                widgetLoader,
                VM;

            /**
            * Loads the basemap widget
            * @param {Object} data
            */
            basemapLoader = function(data) {

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
            legendLoader = function(data) {

                require(['widgets/legendtoc/LegendMenuWidget'], function (LegendMenuWidget) {
                    var legendMenu = new LegendMenuWidget();
                    legendMenu.startup(data.operational);
                });

            };

            /**
             * Helper function to decide what widgets to load
             * @param {string} widgetName
             * @param {Object} data
             */
            widgetLoader = function(widgetName, data){
                if (widgetName === 'basemap') {
                    basemapLoader(data);
                }
                if (widgetName === 'legend' && data.operational.length > 0) {
                    legendLoader(data);
                }
            };

            /**
             * ViewManager Controller that handles what widgets are added to application
             * @constructor
             */
            VM = function(config) {
                this._config = config;
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
                            console.log(result);
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

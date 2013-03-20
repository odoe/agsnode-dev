/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global console window define require esri */
(function() {
    'use strict';

    define('views/map/MapView',[
        'dojo/_base/declare',
        'dojo/_base/connect',
        'dojo/Evented',
        'helpers/popuphelper',
        'helpers/layerLoader'
        ], function(declare, connect, Evented, popup, LayerLoader) {

            /**
             * Loads the IdentifyHelper for application
             * @param {Array} layers
             * @param {esri.Map} map
             */
            var
                identifyLoader = function (layers, map) {

                    require(['helpers/identifyHelper'], function (IdentifyHelper) {

                        var _identifyLayers = [],
                            i = 0,
                            len = layers.length,
                            idHelper = new IdentifyHelper();

                        for (; i < len; i++) {
                            if (!!layers[i].canIdentify) {
                                _identifyLayers[_identifyLayers.length] = layers[i];
                            }
                        }

                        idHelper.identifyHandler(map, _identifyLayers);

                    });

                },
                _mapView = {};

            /**
            * Map View Controller
            * @constructor
            */
            _mapView.constructor = function (config) {
                this._config = config;
                this.map = null;
            };

            /**
            * Will start the map and load layers.
            * @return {MapView} returns itself.
            */
            _mapView.render = function () {
                var mapOptions = this._config.mapOptions || {},
                    loadedLayers = new LayerLoader(this._config.layers),
                    _operational = loadedLayers.operational,
                    _layersToAdd = loadedLayers.layersToAdd,
                    handle,
                    layersHandler = function(scope) {

                        connect.disconnect(handle);

                        return function(results) {

                            if (_layersToAdd[0] && _layersToAdd[0].loaded) {
                                identifyLoader(_layersToAdd, scope.map);
                            }

                            scope.emit('mapIsReady', {
                                map: scope.map,
                                operational: _operational
                            });
                        };

                    };

                mapOptions.infoWindow = popup.create(); // Be sure to add the infoWindow to the options
                this.map = new esri.Map('map', mapOptions);
                handle = connect.connect(this.map, 'onLayersAddResult', layersHandler(this));
                this.map.addLayers(_layersToAdd);

                return this;
            };

            /**
            * Map View Controller
            * @constructor
            */
            return declare([Evented], _mapView);

    });

}).call(this);


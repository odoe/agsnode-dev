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
        var mapView = {};
        /**
        * Loads the IdentifyHelper for application
        * @param {Array} layers
        * @param {esri.Map} map
        */
        function identifyLoader(layers, map) {
            require(['helpers/identifyHelper'], function (IdentifyHelper) {
                var _identifyLayers = [],
                idHelper = new IdentifyHelper();
                for (var i = 0; i < layers.length; i++) {
                    if (layers[i].canIdentify) {
                        _identifyLayers[_identifyLayers.length] = layers[i];
                    }
                }
                idHelper.identifyHandler(map, _identifyLayers);
            });
        }

        /**
        * Map View Controller
        * @constructor
        */
        mapView.constructor = function (config) {
            this._config = config;
            this.map = null;
        };

        /**
        * Will start the map and load layers.
        * @return {MapView} returns itself.
        */
        mapView.render = function () {
            var mapOptions = this._config.mapOptions || {},
            loadedLayers = new LayerLoader(this._config.layers),
            _operational = loadedLayers.operational,
            _layersToAdd = loadedLayers.layersToAdd,
            handle;

            function layersHandler(scope) {
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
            }

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
        return declare([Evented], mapView);
    });
}).call(this);


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
        'helpers/popupHelper',
        'helpers/layerLoader'
        ], function(declare, connect, Evented, popup, LayerLoader) {

            /**
            * Loads the IdentifyHelper for application
            * @param {Array} layers
            * @param {esri.Map} map
            */
            var identifyLoader = function (layers, map) {

                require(['helpers/IdentifyHelper'], function (IdentifyHelper) {

                    var _identifyLayers = [];
                    for (var j = 0, len = layers.length; j < len; j++) {
                        if (!!layers[j].canIdentify) {
                            _identifyLayers[_identifyLayers.length] = layers[j];
                        }
                    }

                    var idHelper = new IdentifyHelper();
                    idHelper.identifyHandler(map, _identifyLayers);

                });

            };

            /**
             * Map View Controller
             * @constructor
             */
            var MapView = declare([Evented], {

                constructor: function(config) {
                                 this._config = config;
                             },

                map: null,

                /**
                 * Will start the map and load layers.
                 * @return {MapView} returns itself.
                 */
                render: function () {

                    var mapOptions,
                        loader,
                        _operational,
                        _layersToAdd,
                        layersHandler,
                        handle;

                    mapOptions = {};
                    if (!!this._config.mapOptions) {
                        mapOptions = this._config.mapOptions;
                    }

                    mapOptions.infoWindow = popup.create(); // Be sure to add the infoWindow to the options
                    this.map = new esri.Map('map', mapOptions);

                    // A helper to parse the config layers into map layers
                    loader = new LayerLoader();
                    loader.loadLayers(this._config.layers);
                    _operational = loader.operational;
                    _layersToAdd = loader.layersToAdd;

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

                    handle = connect.connect(this.map, 'onLayersAddResult', layersHandler(this));

                    this.map.addLayers(_layersToAdd);

                    return this;
                }
            });

            return MapView;

        });

}).call(this);


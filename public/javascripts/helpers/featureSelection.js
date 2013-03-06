/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global window document console define require esri*/
(function() {
    'use strict';

    define(['dojo/_base/declare',
        'dojo/_base/connect',
        'dojo/Evented',
        'dijit/ProgressBar',
        'dojo/_base/window',
        'esri/tasks/query'], function(declare, connect, Evented, ProgressBar, win) {

            var _featureSelection = {};

            _featureSelection.constructor = function(featureLayer) {
                this.featureLayer = featureLayer;
                connect.connect(this.featureLayer, 'selectionComplete', function (features) {
                    this._map.setExtent(esri.graphicsExtent(features));
                });
            };

            _featureSelection.selectByObjectIds = function(objectIds) {
                var query,
                    pBar,
                    deferred,
                    _this;

                query = new esri.tasks.Query();
                query.outFields = ['*'];
                query.objectIds = objectIds;
                pBar = new ProgressBar({
                    style: 'width: 300px; margin: auto',
                    indeterminate: true
                }).placeAt(win.body());

                deferred = this.featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
                _this = this;

                deferred.then(function(features) {

                    _this.emit('featuresSelected', features);
                    pBar.destroy();
                }, function(error) {
                    pBar.destroy();
                });
            };

            var FeatureSelection = declare([Evented], _featureSelection);
            return FeatureSelection;

        });

}).call(this);

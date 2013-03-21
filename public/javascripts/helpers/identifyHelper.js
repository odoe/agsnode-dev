/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global window document console define require esri */
(function() {
    'use strict';

    define([
        'dojo/on',
        'dojo/_base/Deferred',
        'dojo/DeferredList',
        'helpers/templateBuilder',
        'esri/tasks/identify'
        ], function(on, Deferred, DeferredList, templateBuilder) {

            var IdentifyHelper = function () {
                this.handler = {}; // A pausable handler for the identify tool
                return this;
            };
            /**
             * Utility method to build the infotemplate for a
             * graphic feature displaying all attributes in a table format.
             * @param {esri.tasks.IdentifyResult} result
             */
            function templateMaker(result) {
                var feature = result.feature;
                // assign the layerName to actual graphic
                // to display in the InfoTemplate
                feature.attributes.layerName = result.layerName;
                feature.layerName = result.layerName;
                return templateBuilder.buildInfoTemplate(feature);
            }

            /**
             * Map layers to create an array of IdentifyTasks
             * @param {Array} layers
             * @return {Array}
             */
            function tasksMap(layers) {
                for (var i = 0, len = layers.length, _tasks = []; i < len; i++) {
                    var task = new esri.tasks.IdentifyTask(layers[i].url);
                    task.identifyLayers = layers[i].identifyLayers; 
                    _tasks[_tasks.length] = task;
                }
                return _tasks;
            }

            /**
             * Map tasks to create an Array of Deffered objects
             * @param {Array} items
             * @return {Array}
             */
            function deferredFactory(count) {
                for (var i = 0, _deferreds = []; i < count; i++) {
                    _deferreds[_deferreds.length] = new Deferred();
                }
                return _deferreds;
            }

            // Deferred responses are an array of the results array
            // - Each result array will return true/false in position array[0]
            // - So response[0][0] would be true or false
            function cleanResponse(res) {
                for (var i = 0, len = res.length, results = []; i < len; i++) {
                    if (res[i][0]) {
                        results = results.concat(res[i][1]);
                    }
                }
                return results;
            }

            /**
             * Handles the identify functions of a map 'onClick' event
             * @param {esri.Map} map
             * @param {Array} layers
             */
            IdentifyHelper.prototype.identifyHandler = function (map, layers) {
                var idParams = new esri.tasks.IdentifyParameters(),
                    tasks = tasksMap(layers);

                this.map = map;

                idParams.tolerance = 3;
                idParams.returnGeometry = true;
                idParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;

                /**
                 * Callback method to handle deferred response.
                 * @return {Array} Array of mapped features.
                 */
                function onDeferred(r) {
                    var results = cleanResponse(r);

                    for (var i = 0, len = results.length; i < len; i++) {
                        results[i] = templateMaker(results[i]);
                    }
                    // if no features, keep infoWindow hidden
                    if (results.length === 0) {
                        map.infoWindow.clearFeatures();
                        map.infoWindow.hide();
                    } else {
                        map.infoWindow.setFeatures(results);
                        map.infoWindow.show(idParams.geometry);
                    }
                    return results;
                }

                function onMapClick(e) {
                    var deferredTasks = deferredFactory(tasks.length),
                        defListTasks = new DeferredList(deferredTasks);

                    defListTasks.then(onDeferred);
                    idParams.geometry = e.mapPoint;
                    idParams.mapExtent = map.extent;
                    idParams.width = map.width;
                    idParams.height = map.height;
                    // use the identify layers described in config
                    for (var i = 0, len = tasks.length; i < len; i++) {
                        try {
                            idParams.layerIds = tasks[i].identifyLayers;
                            tasks[i].execute(idParams, deferredTasks[i].callback, deferredTasks[i].errback);
                        } catch(err) {
                            console.log(err);
                            deferredTasks[i].errback(err);
                        }
                    }
                }

                this.handler = on.pausable(this.map, 'click', onMapClick);
                return this;
            };

            return IdentifyHelper;

        });

}).call(this);

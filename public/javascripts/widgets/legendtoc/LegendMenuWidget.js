/**
 * @author odoe@odoe.net (Rene Rubalcava)
 */
/*global define esri */
(function() {
    'use strict';

    define([
        'dojo/_base/declare',
        'dojo/query',
        'dojo/Evented',
        'dijit/Menu',
        'dijit/MenuBar',
        'dijit/PopupMenuBarItem',
        'widgets/legendtoc/LegendMenuItem',
        'widgets/legendtoc/LegendCheckedMenuItem',
        'widgets/legendtoc/CheckedPopupMenuItem',
        'helpers/ArrayUtil'
        ], function(declare, query, Evented, Menu, MenuBar, PopupMenuBarItem, LegendMenuItem, LegendCheckedMenuItem, CheckedPopupMenuItem, arrayUtil) {

            /**
             * Build a dijit.Menu of Legend items in a Layer item
             * @type Function
             * @param {esri.layers.Layer} layer
             * @param {esri.layers.LayerInfo} info
             * @param {Array} legend
             * @return {dijit.Menu}
             * @private
             */
            var _buildLegendMenu = function(layer, info, legend) {

                var legendMenu = new Menu({});
                var _id = info.layerId || info.id;
                for (var i = 0, len = legend.length; i < len; i++) {

                    var item = legend[i];
                    legendMenu.addChild(new LegendMenuItem({
                        label: item.label.length > 0 ? item.label : '...',
                        legendUrl: [layer.url, '/', _id, '/images/', item.url].join('')
                    }));

                }

                return legendMenu;

            };

            /**
             * Response handler for esri.request to Legend REST Url
             * @type Function
             * @param {esri.layers.Layer} layer
             * @param {dijit.Menu} lyrMenu
             * @return {dijit.Menu}
             * @private
             */
            var _legendResponseHandler = function(layer, lyrMenu) {


                var _onChecked = function(checked) {

                    var visible = layer.visibleLayers;
                    var _id = this.info.layerId || this.info.id;
                    var index = arrayUtil.indexof(visible, _id);//visible.indexOf(this.info.id);
                    if (index > -1) {
                        visible.splice(index, 1);
                    } else {
                        visible[visible.length] = _id;
                    }

                    // This section handles layers that have a parentLayerId (part of a grouped layer)
                    var parentId = this.info.parentLayerId;
                    index = arrayUtil.indexof(visible, parentId);
                    if (!checked && parentId > -1 && index > -1) {
                        visible.splice(index, 1);
                    } else if (checked && parentId > -1 && index > -1) {
                        visible[visible.length] = parentId;
                    }

                    // This section checks if a layer has subLayers and turns them off
                    if (this.info.subLayerIds) {
                        var subIds = this.info.subLayerIds;
                        var hasParent = true;
                        for (var i = 0, len = subIds.length; i < len; i++) {
                            var _subId = subIds[i];
                            index = arrayUtil.indexof(visible, _subId);
                            if (index > -1) {
                                visible.splice(index, 1);
                                hasParent = false;
                            } else {
                                visible[visible.length] = _subId;
                                hasParent = true;
                            }
                        }
                        if (!hasParent) {
                            index = arrayUtil.indexof(visible, this.info.id);
                            if (index > -1) {
                                visible.splice(index, 1);
                            }
                        }
                    }

                    layer.setVisibleLayers(visible.length > 0 ? visible : [-1]);

                };

                // return the promise function
                return function(response, io) {

                    var lyrs = response.layers;

                    var _subIds = [];

                    var fromLayersResponse = function (_id) {
                        for (var x = 0, len = lyrs.length; x < len; x++) {
                            var obj = lyrs[x];
                            if (obj.layerId === _id) return obj;
                        }
                        return null;
                    };

                    for (var i = 0, len = layer.layerInfos.length; i < len; i++) {
                        var info = layer.layerInfos[i];
                        // url to legend symbology
                        var url = '';
                        var _info;

                        var responseLayer = fromLayersResponse(info.id);

                        if (layer.layerInfos[i].subLayerIds) { // handle grouped layers. Group layers suck.
                            var _subLayers = layer.layerInfos[i].subLayerIds;
                            var groupMenu = new Menu({});

                            for (var j = 0, _len = _subLayers.length; j < _len; j++) {
                                var subInfo = layer.layerInfos[_subLayers[j]];
                                _subIds[_subIds.length] = _subLayers[j];

                                _info = fromLayersResponse(subInfo.id);
                                if (_info) {
                                    url = [layer.url, '/', subInfo.id, '/images/', _info.legend[0].url].join('');
                                    groupMenu.addChild(new LegendCheckedMenuItem({
                                        label: _info.layerName,
                                        info: subInfo,
                                        legendUrl: url,
                                        checked: arrayUtil.indexof(layer.visibleLayers, _info.layerId) > -1,//visible.indexOf(info.id) > -1,
                                        onChange: _onChecked
                                    }));                                }
                            }

                            lyrMenu.addChild(new CheckedPopupMenuItem({
                                label: info.name,
                                info: info,
                                popup: groupMenu,
                                checked: arrayUtil.indexof(layer.visibleLayers, info.id) > -1,//visible.indexOf(info.id) > -1,
                                onChange: _onChecked
                            }));

                        } else if(responseLayer && responseLayer.legend.length > 1 && _subIds.indexOf(info.id) < 0) {
                            _info = fromLayersResponse(info.id);
                            // make a regular menu and normal menu items to legend
                            if (_info) {
                                var legendMenu = _buildLegendMenu(layer, info, _info.legend, lyrMenu);
                                lyrMenu.addChild(new CheckedPopupMenuItem({
                                    label: _info.layerName,
                                    info: info,
                                    popup: legendMenu,
                                    checked: arrayUtil.indexof(layer.visibleLayers, _info.layerId) > -1,//visible.indexOf(info.id) > -1,
                                    onChange: _onChecked
                                }));
                            }
                        } else if (_subIds.indexOf(info.id) < 0) {
                            // make a checked menu item
                            _info = fromLayersResponse(info.id);
                            if (_info) {
                                url = [layer.url, '/', info.id, '/images/', _info.legend[0].url].join('');
                                lyrMenu.addChild(new LegendCheckedMenuItem({
                                    label: _info.layerName,
                                    info: _info,
                                    legendUrl: url,
                                    checked: arrayUtil.indexof(layer.visibleLayers, _info.layerId) > -1,//visible.indexOf(info.id) > -1,
                                    onChange: _onChecked
                                }));
                            }
                        }
                    }

                };

            };

            /**
             * LegendMenuWidget that can display given layers in a pure Dojo menu
             * with Checkboxes
             * @constructor
             */
            var LegendMenuWidget = declare([Evented], { // TODO - use Evented to send off visibility events

                /**
                 * Startup function for Widget
                 * @param {Array} layers
                 */
                startup: function(layers) {

                             var _tocMenu = new Menu({});

                             var _onServiceChecked = function(checked) {
                                 this.layer.setVisibility(checked);
                             };

                             for (var i = 0, len = layers.length; i < len; i++) {
                                 var layer = layers[i];
                                 var lyrMenu = new Menu({});

                                 // use esri.request to get Legend Information for current layer
                                 var request = esri.request({
                                     url: layer.url + '/legend',
                                     content: {
                                         f: 'json'
                                     },
                                     callbackParamName: 'callback'
                                 });

                                 request.then(_legendResponseHandler(layer, lyrMenu));

                                 var serviceMenu = new CheckedPopupMenuItem({
                                     label: layer.title,
                                     layer: layer,
                                     checked: layer.visible,
                                     popup: lyrMenu,
                                     onChange: _onServiceChecked
                                 });

                                 _tocMenu.addChild(serviceMenu);
                             }

                             var _menuBar = new MenuBar({}); // root of the menu bar
                             _menuBar.addChild(new PopupMenuBarItem({
                                 label: '<span class="icon-globe icon-white"></span> Layers',
                                 popup: _tocMenu
                             }));

                             _menuBar.placeAt(query('.toc-menu')[0]); // root of the menu bar
                             _menuBar.startup();

                             return this;

                         }
            });

            return LegendMenuWidget;

        });

}).call(this);


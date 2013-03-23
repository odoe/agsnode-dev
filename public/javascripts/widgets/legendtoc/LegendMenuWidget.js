/**
 * @author odoe@odoe.net (Rene Rubalcava)
 */
/*global define esri console document*/
(function() {
    'use strict';

    define([
        'dojo/_base/declare',
        'dojo/Evented',
        'dijit/Menu',
        'dijit/MenuBar',
        'dijit/PopupMenuBarItem',
        'widgets/legendtoc/LegendMenuItem',
        'widgets/legendtoc/LegendCheckedMenuItem',
        'widgets/legendtoc/CheckedPopupMenuItem',
        'helpers/ArrayUtil'
        ], function(declare, Evented, Menu, MenuBar, PopupMenuBarItem, LegendMenuItem, LegendCheckedMenuItem, CheckedPopupMenuItem, arrayUtil) {

            /**
             * Build a dijit.Menu of Legend items in a Layer item
             * @type Function
             * @param {esri.layers.Layer} layer
             * @param {esri.layers.LayerInfo} info
             * @param {Array} legend
             * @return {dijit.Menu}
             * @private
             */
            function buildLegendMenu(layer, info, legend) {
                var legendMenu = new Menu({}),
                    _id = info.layerId || info.id,
                    i = 0,
                    len = legend.length;
                for (; i < len; i++) {
                    var item = legend[i];
                    legendMenu.addChild(new LegendMenuItem({
                        label: item.label.length > 0 ? item.label : '...',
                        legendUrl: 'data:image/png;base64,' + item.imageData
                    }));
                }
                return legendMenu;
            }

            // This section handles layers that have a parentLayerId (part of a grouped layer)
            function handleGroupedLayers(checked, info, visible) {
                var parentId = info.parentLayerId,
                    index = arrayUtil.indexof(visible, parentId);
                if (!checked && parentId > -1 && index > -1) {
                    visible.splice(index, 1);
                } else if (checked && parentId > -1 && index > -1) {
                    visible[visible.length] = parentId;
                }
                return visible;
            }

            function handleSubLayers(info, visible) {
                var subIds = info.subLayerIds,
                    hasParent = true,
                    i = 0,
                    len = subIds.length,
                    index;
                for (; i < len; i++) {
                    index = arrayUtil.indexof(visible, subIds[i]);
                    hasParent = index < 0;
                    if (!hasParent) {
                        visible.splice(index, 1);
                    } else {
                        visible[visible.length] = subIds[i];
                    }
                }
                if (!hasParent) {
                    index = arrayUtil.indexof(visible, info.id);
                    if (index > -1) {
                        visible.splice(index, 1);
                    }
                }
                return visible;
            }

            /**
             * Response handler for esri.request to Legend REST Url
             * @type Function
             * @param {esri.layers.Layer} layer
             * @param {dijit.Menu} lyrMenu
             * @return {dijit.Menu}
             * @private
            */
            function legendResponseHandler(layer, lyrMenu) {
                var onChecked = function(checked) {
                    var visible = layer.visibleLayers,
                        _id = this.info.layerId || this.info.id,
                        index = arrayUtil.indexof(visible, _id);
                    if (index > -1) {
                        visible.splice(index, 1);
                    } else {
                        visible[visible.length] = _id;
                    }

                    visible = handleGroupedLayers(checked, this.info, visible);

                    console.log('before subs', visible);

                    // This section checks if a layer has subLayers and turns them off
                    if (this.info.subLayerIds) {
                        visible = handleSubLayers(this.info, visible);
                    }

                     console.log(visible);

                    layer.setVisibleLayers(visible.length > 0 ? visible : [-1]);
                };

                // return the promise function
                return function(response, io) {
                    var lyrs = response.layers,
                        subIds = [];

                    function fromLayersResponse(_id) {
                        for (var x = 0, len = lyrs.length; x < len; x++) {
                            if (lyrs[x].layerId === _id) return lyrs[x];
                        }
                        return null;
                    }

                    function addLegendMenuItem(layer, subLayers, subInfo, grpMenu) {
                        var info = fromLayersResponse(subInfo.id);
                        if (info) {
                            grpMenu.addChild(new LegendCheckedMenuItem({
                                label: info.layerName,
                                info: subInfo,
                                legendUrl: 'data:image/png;base64,' + info.legend[0].imageData,
                                checked: arrayUtil.indexof(layer.visibleLayers, info.layerId) > -1,
                                onChange: onChecked
                            }));
                        }
                        return grpMenu;
                    }

                    function buildGroupMenu(lyr, subLayers) {
                        var groupMenu = new Menu({}),
                            i = 0,
                            len = subLayers.length;
                        for (; i < len; i++) {
                            var subInfo = layer.layerInfos[subLayers[i]];
                            subIds[subIds.length] = subLayers[i];
                            groupMenu = addLegendMenuItem(layer, subLayers, subInfo, groupMenu);
                        }
                        return groupMenu;
                    }

                    for (var i = 0, len = layer.layerInfos.length; i < len; i++) {
                        var info = layer.layerInfos[i],
                            sub_info,
                            responseLayer = fromLayersResponse(info.id);

                        if (layer.layerInfos[i].subLayerIds) { // handle grouped layers. Group layers suck.
                            var subLayers = layer.layerInfos[i].subLayerIds,
                                groupMenu = buildGroupMenu(layer, subLayers);

                            lyrMenu.addChild(new CheckedPopupMenuItem({
                                label: info.name,
                                info: info,
                                popup: groupMenu,
                                checked: arrayUtil.indexof(layer.visibleLayers, info.id) > -1,
                                onChange: onChecked
                            }));

                        } else if(responseLayer && responseLayer.legend.length > 1 && subIds.indexOf(info.id) < 0) {
                            sub_info = fromLayersResponse(info.id);
                            // make a regular menu and normal menu items to legend
                            if (sub_info) {
                                var legendMenu = buildLegendMenu(layer, info, sub_info.legend, lyrMenu);
                                lyrMenu.addChild(new CheckedPopupMenuItem({
                                    label: sub_info.layerName,
                                    info: info,
                                    popup: legendMenu,
                                    checked: arrayUtil.indexof(layer.visibleLayers, sub_info.layerId) > -1,
                                    onChange: onChecked
                                }));
                            }
                        } else if (subIds.indexOf(info.id) < 0) {
                            // make a checked menu item
                            sub_info = fromLayersResponse(info.id);
                            if (sub_info) {
                                lyrMenu.addChild(new LegendCheckedMenuItem({
                                    label: sub_info.layerName,
                                    info: sub_info,
                                    legendUrl: 'data:image/png;base64,' + sub_info.legend[0].imageData,
                                    checked: arrayUtil.indexof(layer.visibleLayers, sub_info.layerId) > -1,
                                    onChange: onChecked
                                }));
                            }
                        }
                    }

                };

            }

            function addLegend(menubar) {
                var node = document.createElement('li');
                node.classList.add('toc-menu');
                document.getElementById('tools-menus').appendChild(node);
                menubar.placeAt(node).startup(); // root of the menu bar
            }

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
                startup: function(options) {
                    var tocMenu = new Menu({}),
                    menuBar = new MenuBar({}), // root of the menu bar
                    layers = options.operational,
                    onServiceChecked = function(checked) {
                        this.layer.setVisibility(checked);
                    },
                    i = 0,
                    len = layers.length;

                    for (; i < len; i++) {
                        var layer = layers[i],
                        lyrMenu = new Menu({}),
                        serviceMenu = new CheckedPopupMenuItem({
                            label: layer.title,
                            layer: layer,
                            checked: layer.visible,
                            popup: lyrMenu,
                            onChange: onServiceChecked
                        });

                        // use esri.request to get Legend Information for current layer
                        esri.request({
                            url: layer.url + '/legend',
                            content: {
                                f: 'json'
                            },
                            callbackParamName: 'callback'
                        }).then(legendResponseHandler(layer, lyrMenu));

                        tocMenu.addChild(serviceMenu);
                    }

                    menuBar.addChild(new PopupMenuBarItem({
                        label: '<span class="icon-globe icon-white"></span> Layers',
                        popup: tocMenu
                    }));
                    addLegend(menuBar);

                    return this;
                }
            });

            // widget factory
            return {
                create: function(options) {
                    return new LegendMenuWidget().startup(options);
                }
            };

        });

}).call(this);

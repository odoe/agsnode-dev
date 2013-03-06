/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global define esri */
(function() {
  'use strict';

  define(['dojo/dom-construct', 'dojo/_base/Color', 'esri/symbol', 'esri/dijit/Popup'], function(domConstruct, Color) {
    return {

      /**
      * Creates a popup to be used in the Map
      * @return {esri.dijit.Popup}
      */
      create: function() {

        var fillSymbol,
            lineSymbol,
            popup,
            slsFillColor,
            slsLineColor;

        slsLineColor = new Color([255, 0, 0]);
        slsFillColor = new Color([255, 255, 0, 0.25]);
        lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, slsLineColor, 1);
        fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol, slsFillColor);
        popup = new esri.dijit.Popup({
          fillSymbol: fillSymbol
        }, domConstruct.create('div'));
        return popup;

      }
    };
  });

}).call(this);

/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global define esri */
(function() {
  'use strict';

  define(['dojo/_base/Color'], function(Color) {
    return {

      /**
      * Creates a simple marker symbol
      * @return {esri.symbol.SimpleMarkerSymbol}
      */
      simpleMarker: function() {
        return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 1]));
      },

      /**
      * Creates a simple line symbol
      * @return {esri.symbol.SimpleLineSymbol}
      */
      lineSymbol: function() {
        return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([124, 252, 0]), 3);
      },

      /**
      * Creates a simple fill symbol
      * @return {esri.symbol.SimpleFillSymbol}
      */
      polygonSymbol: function() {
        return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([153, 50, 204]), 2), new Color([255, 255, 0, 0.25]));
      },

      /**
      * Creates a simple fill symbol for selected features
      * @return {esri.symbol.SimpleFillSymbol}
      */
      selectedPolygonSymbol: function() {
        return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 1), new Color([0, 191, 255, 0.25]));
      },

      /**
      * Creates a simple fill symbol for selected features
      * @return {esri.symbol.SimpleFillSymbol}
      */
      selectedLineSymbol: function() {
        return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3);
      }
    };
  });

}).call(this);

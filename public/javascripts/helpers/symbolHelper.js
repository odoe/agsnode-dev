/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global define esri */
(function() {
  'use strict';

  define(['dojo/_base/Color', 'esri/symbol'], function(Color, Symbol) {
    return {

      /**
      * Creates a simple marker symbol
      * @return {Symbol.SimpleMarkerSymbol}
      */
      simpleMarker: function() {
        return new Symbol.SimpleMarkerSymbol(Symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 1]));
      },

      /**
      * Creates a simple line symbol
      * @return {Symbol.SimpleLineSymbol}
      */
      lineSymbol: function() {
        return new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, new Color([124, 252, 0]), 3);
      },

      /**
      * Creates a simple fill symbol
      * @return {Symbol.SimpleFillSymbol}
      */
      polygonSymbol: function() {
        return new Symbol.SimpleFillSymbol(Symbol.SimpleFillSymbol.STYLE_SOLID, new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, new Color([153, 50, 204]), 2), new Color([255, 255, 0, 0.25]));
      },

      /**
      * Creates a simple fill symbol for selected polygon features
      * @return {Symbol.SimpleFillSymbol}
      */
      selectedPolygonSymbol: function() {
        return new Symbol.SimpleFillSymbol(Symbol.SimpleFillSymbol.STYLE_SOLID, new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 1), new Color([0, 191, 255, 0.25]));
      },

      /**
      * Creates a simple fill symbol for selected line features
      * @return {Symbol.SimpleLineSymbol}
      */
      selectedLineSymbol: function() {
        return new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3);
      }
    };
  });

}).call(this);

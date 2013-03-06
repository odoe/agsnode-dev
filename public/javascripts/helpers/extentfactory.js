/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global define esri */
(function() {
  'use strict';

  define(function() {
    return {
      /**
      * Returns the extents of Los Angeles County
      * @return {esri.geometry.Extent}
      */
      losAngeles: function() {
        return new esri.geometry.Extent({
          xmin: -13286420.39,
          ymin: 3993285.76,
          xmax: -13025954.7,
          ymax: 4136625.11,
          spatialReference: {
            wkid: 102113
          }
        });
      },
      demo: function() {
        return new esri.geometry.Extent({
          xmin: -13154714.5196626,
          ymin: 4020932.14934935,
          xmax: -13152321.7329975,
          ymax: 4022801.26265936,
          spatialReference: {
            wkid: 102113
          }
        });
      }
    };
  });

}).call(this);

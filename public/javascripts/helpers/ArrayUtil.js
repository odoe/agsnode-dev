/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global window document console define require */
(function() {
  'use strict';

  define(function() {

    return {

      /**
       * Checks to see if an object with a given field
       * already exists in Target array.
       * @param {Array} array
       * @param {Object} obj
       * @param {String} field
       * @return {Boolean} Does object exist in Target array.
       */
      exists: function(array, obj, field) {

                if (!field) {
                  throw new Error('Must provide a valid field name to search for.');
                }
                for (var i = array.length - 1; i >= 0; i--) {
                  if (obj[field] === array[i][field]) return true;
                }
                return false;

              },

        /**
         * Finds the index of a given value in a target Array.
         * Reference: http://jsperf.com/js-for-loop-vs-array-indexof/10
         * @param {Array} array
         * @param {Object} v
         * @return {Number} Index of given value in Target Array.
         */
        indexof: function(array, v) {

                   var i = array.length, a;
                   while(i--) {
                     a = array[i];
                     if (a === v) return i;
                   }

                   return -1;

                 }

    };

  });

}).call(this);

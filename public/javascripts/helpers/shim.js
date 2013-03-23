/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global window document console define require */
(function() {
    'use strict';

    define([], function() {

        // This checks if Array.indexof is available
        // if not, it creates it.
        // Needed in some array functions
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(elt /*, from*/) {
                var len = this.length;

                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.round(from);
                if (from < 0) from += len;

                for (; from < len; from++) {
                    if (from in this && this[from] === elt) return from;
                }
                return -1;
            };
        }

        Object.keys = Object.keys || (function () {
            var _hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
            DontEnums = [
                'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
                'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
            ],
            DontEnumsLength = DontEnums.length;
            return function (o) {
                if (typeof o != "object" && typeof o != "function" || o === null) throw new TypeError("Object.keys called on a non-object");
                var result = [];
                for (var name in o) {
                    if (_hasOwnProperty.call(o, name)) result.push(name);
                }
                if (hasDontEnumBug) {
                    for (var i = 0; i < DontEnumsLength; i++) {
                        if (_hasOwnProperty.call(o, DontEnums[i])) result.push(DontEnums[i]);
                    }
                }
                return result;
            };
        })();

    });

}).call(this);

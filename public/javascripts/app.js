/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global define */
(function() {
    'use strict';

    define(['views/ViewManager'], function(VM) {
        var initialize;
        initialize = function(config) {
            var vm = new VM(config);
            vm.render();
        };

        // pass the init function as an object
        return {
            initialize: initialize
        };
    });

}).call(this);

/**
 * @author odoe@odoe.net (Rene Rubalcava)
 */
/*global window document console define require */
(function() {
    'use strict';

    define([
        'dojo/_base/declare',
        'dijit/CheckedMenuItem',
        'text!widgets/legendtoc/templates/LegendCheckedMenuItem.html',
        'dijit/hccss'
        ], function(declare, CheckedMenuItem, template) {

            /**
             * Extends dijit.CheckedMenuItem.
             * Requires a customized template html file.
             * @constructor
             */
            var LegendCheckedMenuItem = declare([CheckedMenuItem], {
                templateString: template,
                legendUrl: ''
            });

            return LegendCheckedMenuItem;

        });

}).call(this);



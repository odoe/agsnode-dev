/**
 * @author odoe@odoe.net (Rene Rubalcava)
 */
/*global window document console define require */
(function() {
    'use strict';

    define([
        'dojo/_base/declare',
        'dijit/CheckedMenuItem',
        'dijit/PopupMenuItem',
        'text!widgets/legendtoc/templates/CheckedPopupMenuItem.html',
        'dijit/hccss'
        ], function(declare, CheckedMenuItem, PopupMenuItem, template) {

            /**
             * Mixin of dijit.CheckedMenuItem and dijit.PopupMenuItem.
             * Requires a customized template html file.
             * @constructor
             */
            var CheckedPopupMenuItem = declare([CheckedMenuItem, PopupMenuItem], {
                templateString: template
            });

            return CheckedPopupMenuItem;

        });

}).call(this);


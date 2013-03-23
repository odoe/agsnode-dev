/**
 * @author odoe@odoe.net (Rene Rubalcava)
*/
/*global window document console define require */
(function() {
    'use strict';

    define([
           'dojo/_base/declare',
           'dijit/MenuItem',
           'text!widgets/legendtoc/templates/LegendMenuItem.html',
           'dijit/hccss'
    ], function(declare, MenuItem, template) {

        //http://bugs.dojotoolkit.org/ticket/16177

        /**
        * Extends dijit.MenuItem for use in LegendToc
        * @constructor
        */
        var LegendMenuItem = declare([MenuItem], {
            templateString: template,
            legendUrl: ''
        });

        return LegendMenuItem;

    });

}).call(this);


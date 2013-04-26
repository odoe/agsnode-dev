/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global window document console define require esri */
(function() {
    'use strict';

    define(['esri/InfoTemplate'], function(InfoTemplate) {

        var _builder = {};

        /**
        * Utility method to build the infotemplate for a
        * graphic feature displaying all attributes in a table format.
        * @param {esri.Graphic} feature Graphic to set infoTemplate.
        * @return {esri.Graphic} Graphic with infoTemplate set.
        */
        _builder.buildInfoTemplate = function(feature, options) {


            var content = [],
                urlField = options ? options.urlField : '',
                urlPrefix = options ? options.urlPrefix : '';
            // get the dom element for my infotemplate as a string
            content[content.length] = '<table cellspacing="0" class="table table-striped table-condensed attr-info">';
            if (feature.layerName) {
                content[content.length] = '<tr><td class="fieldName">SOURCE: </td><td class="fieldName">' + feature.layerName + '</td></tr>';
            }
            /**
            * Iterate over attributes to get field names.
            * Ignore certain fields not needing to be displayed
            * Order matters, so loop forward over keys.
            **/
            var keys = Object.keys(feature.attributes),
                i = 0,
                len = keys.length;

            for (; i < len; i++) {
                var _key = keys[i].toLowerCase(),
                name;
                if (!(_key.indexOf('shape') > -1 || _key === 'layername'|| _key === 'objectid' || _key === 'fid')) {
                    name = keys[i];
                    if (name.toLowerCase() !== urlField) {
                        content[content.length]= '<tr><td class="fieldName">' + name + '</td><td>${' + name + '}</td></tr>';
                    } else {
                        content[content.length] = '<tr><td class="fieldName">' + name + '</td><td><a href="' + urlPrefix + '${' + name + '}">${' + name + '}</a></td></tr>';
                    }
                }
            }
            content[content.length] = '</table>';
            // now set the template
            feature.setInfoTemplate( new InfoTemplate('', content.join('')) );

            return feature;

        };

        return _builder;

    });

}).call(this);

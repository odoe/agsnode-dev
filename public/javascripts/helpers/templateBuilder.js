/**
* @author rrubalcava@odoe.net (Rene Rubalcava)
*/
/*global window document console define require esri */
(function() {
    'use strict';

    define([], function() {

        var _builder = {};

        /**
        * Utility method to build the infotemplate for a
        * graphic feature displaying all attributes in a table format.
        * @param {esri.Graphic} feature Graphic to set infoTemplate.
        * @return {esri.Graphic} Graphic with infoTemplate set.
        */
        _builder.buildInfoTemplate = function(feature) {

            var content,
                template;
            // get the dom element for my infotemplate as a string
            content = [];
            //var content = '<table cellspacing="0" class="table table-striped table-condensed attr-info">';
            content[content.length] = '<table cellspacing="0" class="table table-striped table-condensed attr-info">';
            if (feature.layerName) {
                content[content.length] = '<tr><td class="fieldName">SOURCE: </td><td class="fieldName">' + feature.layerName + '</td></tr>';
            }
            /**
            * Iterate over attributes to get field names.
            * Ignore certain fields not needing to be displayed
            * Order matters, so loop forward over keys.
            **/
            var keys,
            i,
            len;

            keys = Object.keys(feature.attributes);

            for (i = 0, len = keys.length; i < len; i++) {
                var _key,
                name;
                _key = keys[i].toLowerCase();
                if (!(_key.indexOf('shape') > -1 || _key === 'layername'|| _key === 'objectid' || _key === 'fid')) {
                    name = keys[i];
                    content[content.length]= '<tr><td class="fieldName">' + name + '</td><td>${' + name + '}</td></tr>';
                }
            }
            content[content.length] = '</table>';

            // now set the template
            template = new esri.InfoTemplate('', content.join(''));
            feature.setInfoTemplate(template);

            return feature;

        };

        return _builder;

    });

}).call(this);


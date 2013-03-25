
/*
 * GET home page.
 */

exports.index = function(req, res){
    var version = '3.4'; // just update the latest version of API here
    res.render('index', { 
        title: 'ArcGIS Developer Application',
        styles: ['//serverapi.arcgisonline.com/jsapi/arcgis/' + version + '/js/dojo/dijit/themes/nihilo/nihilo.css',
                '//serverapi.arcgisonline.com/jsapi/arcgis/' + version + '/js/esri/css/esri.css',
                '//serverapi.arcgisonline.com/jsapi/arcgis/' + version + '/js/dojo/dojo/resources/dojo.css',
                '//serverapi.arcgisonline.com/jsapi/arcgis/' + version + '/js/dgrid/css/dgrid.css',
                '//serverapi.arcgisonline.com/jsapi/arcgis/' + version + '/js/esri/dijit/css/Popup.css',
                '/stylesheets/bootstrap.min.css',
                '/stylesheets/main.css'],
        scripts: ['//serverapi.arcgisonline.com/jsapi/arcgis/?v=' + version + 'compact',
                    'javascripts/main.js'
        ]
    });
};

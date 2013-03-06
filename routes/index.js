
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { 
        title: 'ArcGIS Developer Application',
        scripts: ['http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.3',
                    'javascripts/main.js'
        ]
    });
};

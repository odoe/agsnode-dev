# ArcGIS JavaScript Development Environment in Node
This is a development environment I've put together to use [Node.js](http://nodejs.org/) to develop [ArcGIS JavaScript](http://help.arcgis.com/en/webapi/javascript/arcgis/) applications.

# Demo
You can view a demo of the application [here](http://agsnode.nodejitsu.com/).
Easily deployed to [Nodejitsu](https://www.nodejitsu.com/) via command
line.

# Caveat
This is all experimental, as I have not tried to use this in production
yet. But I'm excited to try it. I have some ideas on node modules I can
try and use with this.

I still need to get my mocha tests implemented, which would be easy to
run.

### How to Use
To install, clone the repository, navigate to the folder.

### Install required modules
```
npm install
```

### Run the application

```
node app
```

### Edit public/config.json

``` js
{
  "appName": "AGS Node App",
  "layers": [
  {
    "type": "dynamic",
      "url": "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer",
      "id": "censusLayer",
      "title": "Census",
      "visible": true,
      "opacity": 0.5,
      "visibleLayers": [1,2,3,4,5],
      "operational": true,
      "identifyCapability": {
        "canIdentify": true,
        "identifyLayers": [1]
      }
  }
  ],
    "widgets": [
      {
        "name": "geocoder",
        "options": {
          "autoComplete":true,
          "arcgisGeocoder": {
            "name":"Esri World Search",
            "suffix":" Redlands, CA"
          }
        }
      }
    ],
    "mapOptions": {
      "basemap": "gray",
      "autoResize": true,
      "center": [-118.20959546463835,34.28548773859569],
      "zoom": 10
    }
}
```
### You can configure external css and the version of the API in routes/index.js
```
exports.index = function(req, res){
    var version = '3.3'; // just update the latest version of API here.
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
```
### Working Proxy
I made an attempt to try and use [http-proxy](https://github.com/nodejitsu/node-http-proxy) for my proxy. In testing, I had some success. Will it work in all cases? I don't know, but would love some input if you are better at this than I am.
The proxy appears to now be working. Needs further options for tokens
and white lists, but happy so far.

### Widgets
Included widgets are "legend" and "basemap" that you can add top the
widgets array in the config.json file. These have not been fully tested
in this environment. I have been having some issues with the "legend"
widget with the latest AGS JS API update using Dojo 1.8.

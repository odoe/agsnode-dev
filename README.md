# ArcGIS JavaScript Development Environment in Node
This is a development environment I've put together to use [Node.js](http://nodejs.org/) to develop [ArcGIS JavaScript](http://help.arcgis.com/en/webapi/javascript/arcgis/) applications.

This ia all experimental, as I have not tried to use this in production
yet. But I'm excited to try it. I have some ideas on node modules I can
try and use with this.

I made an attempt to try and use [http-proxy](https://github.com/nodejitsu/node-http-proxy) for my proxy. In testing, I had sone success. Will it work in all cases? I don't know, but would love some input if you are better at this than I am.

I still need to get my mocha tests implemented, which would be easy to
run.

To install, clone the repository, navigatge to the folder.

### Install required modules
```
npm install
```

### Run the application

```
node app
```

### Edit config.json public/config.json

``` js
{
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

Included widgets are "legend" and "basemap" that you can add top the
widgets array in the config.json file. These have not been fully tested
in this environment, but should work. "basemap" may need some work.

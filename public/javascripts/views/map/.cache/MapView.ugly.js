(function(){"use strict";define("views/map/MapView",["dojo/_base/declare","dojo/_base/connect","dojo/Evented","helpers/popupHelper","helpers/layerLoader"],function(e,t,n,r,i){var s=function(e,t){require(["helpers/IdentifyHelper"],function(n){var r=[];for(var i=0,s=e.length;i<s;i++)!e[i].canIdentify||(r[r.length]=e[i]);var o=new n;o.identifyHandler(t,r)})},o=e([n],{constructor:function(e){this._config=e},map:null,render:function(){var e,n,o,u,a,f;return e={},!this._config.mapOptions||(e=this._config.mapOptions),e.infoWindow=r.create(),this.map=new esri.Map("map",e),n=new i,n.loadLayers(this._config.layers),o=n.operational,u=n.layersToAdd,a=function(e){return t.disconnect(f),function(t){u[0]&&u[0].loaded&&s(u,e.map),e.emit("mapIsReady",{map:e.map,operational:o})}},f=t.connect(this.map,"onLayersAddResult",a(this)),this.map.addLayers(u),this}});return o})}).call(this)
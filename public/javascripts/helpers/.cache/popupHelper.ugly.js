(function(){"use strict";define(["dojo/dom-construct","dojo/_base/Color","esri/symbol","esri/dijit/Popup"],function(e,t){return{create:function(){var n,r,i,s,o;return o=new t([255,0,0]),s=new t([255,255,0,.25]),r=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,o,1),n=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,r,s),i=new esri.dijit.Popup({fillSymbol:n},e.create("div")),i}}})}).call(this)
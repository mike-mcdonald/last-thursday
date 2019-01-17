webpackJsonp([1],{"/KFX":function(e,t,a){"use strict";var s=a("Dd8w"),n=a.n(s),r=a("NYxO"),i=a("M4fF"),o={name:"Search",data:function(){return{searchValue:""}},computed:n()({},Object(r.d)(["error"])),methods:n()({update:i.debounce(function(e){this.searchValue&&this.suggest(this.searchValue)},1e3),cancelEdit:function(e){this.searchValue=""}},Object(r.b)(["suggest"]))},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"addressSearchBar"}},[a("div",{staticClass:"input-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.searchValue,expression:"searchValue"}],staticClass:"form-control",attrs:{type:"text",id:"addressSearch",placeholder:"Search for a location..."},domProps:{value:e.searchValue},on:{keypress:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?(t.preventDefault(),t.stopPropagation(),e.update(t)):null},keyup:function(t){return"button"in t||!e._k(t.keyCode,"esc",27,t.key,"Escape")?e.cancelEdit(t):null},input:function(t){t.target.composing||(e.searchValue=t.target.value)}}}),e._v(" "),a("span",{staticClass:"input-group-btn"},[a("button",{staticClass:"btn btn-primary",attrs:{type:"button"},on:{click:e.update}},[e._v("Search")])])])])},staticRenderFns:[]};var l=a("VU/8")(o,c,!1,function(e){a("wr5E")},null,null);t.a=l.exports},0:function(e,t,a){a("j1ja"),e.exports=a("OZ/X")},"0iPh":function(e,t){e.exports=jQuery},"3GDu":function(e,t,a){"use strict";var s=a("Dd8w"),n=a.n(s),r=a("d7EF"),i=a.n(r),o=a("NYxO"),c=a("Meid"),l={name:"Map",components:{},created:function(){var e=this;c.loadModules(["esri/Map","esri/views/MapView","esri/widgets/Locate","esri/geometry/Extent"]).then(function(t){var a=i()(t,4),s=a[0],n=a[1],r=a[2],o=a[3],c=new s({basemap:e.settings.basemap||"streets-vector"}),l=(new o(e.extent),new n({container:e.settings.mapid,map:c,zoom:e.settings.zoom.start||10,center:[e.settings.center.lon,e.settings.center.lat]}));if(e.setMapView(l),e.widget){var u=new r({view:l});l.ui.add(u,{position:"top-left"})}if(e.settings.value)for(var d in e.settings.value)if(e.settings.value.hasOwnProperty(d)){var p=e.settings.value[d];e.addWkt(p.wkt)}})},computed:n()({style:function(){return{width:this.settings.width,height:this.settings.height}}},Object(o.d)({widget:"widget",settings:"settings",extent:"extent",value:"value",mapView:function(e){return e.map.mapView}})),methods:n()({},Object(o.b)(["addWkt","setMapView"]))},u={render:function(){var e=this.$createElement;return(this._self._c||e)("div",{staticClass:"portland-geofield-map-app",style:this.style,attrs:{id:this.settings.mapid}},[this._t("default")],2)},staticRenderFns:[]};var d=a("VU/8")(l,u,!1,function(e){a("qncE")},null,null);t.a=d.exports},E3s9:function(e,t){},IcnI:function(e,t,a){"use strict";var s=a("7+uW"),n=a("NYxO"),r=a("Meid"),i=a("Zrlr"),o=a.n(i),c=a("wxAW"),l=a.n(c),u=a("mtWM"),d=a.n(u),p=function(){function e(t){o()(this,e),this.apiKey=t}return l()(e,[{key:"suggestAddress",value:function(e,t,a,s){var n=new URLSearchParams;for(var r in n.append("query",e),n.append("api_key",this.apiKey),t)t.hasOwnProperty(r)&&n.append(r,t[r]);return d.a.post("https://www.portlandmaps.com/api/suggest/",n).then(function(t){t.data&&"success"===t.data.status&&t.data.candidates?t.data.candidates[0]?a({location:t.data.candidates[0].location,spatialReference:t.data.spatialReference}):s('Portlandmaps.com could not suggest a location for "'+e+'"'):t.data&&"error"===t.data.status?s("Portlandmaps.com responded with an error."):s("Did not receive a valid response from portlandmaps.com.")}).catch(function(e){s("Portlandmaps.com responded with an error.")})}}]),e}(),f=a("d7EF"),m=a.n(f),h=a("rvVx"),g=a("ellH"),v=a.n(g),y=a("39EV"),w=a.n(y);function b(e){var t,a,s,n,r=0,i=0,o=[];s=e.match(/((\+|\-)[^\+\-]+)/g),n=parseInt(s[0],32);for(var c=1;c<s.length;c+=2)r=t=parseInt(s[c],32)+r,i=a=parseInt(s[c+1],32)+i,o.push([t/n,a/n]);return o}function F(e){return function(e,t){for(var a=0;a<e.length;a++)if(e[a]!==t[a])return!1;return!0}(e[0],e[e.length-1])||e.push(e[0]),e}function k(e){var t={};for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a]);return t}function M(e){for(var t,a=0,s=0,n=e.length,r=e[s];s<n-1;s++)a+=((t=e[s+1])[0]-r[0])*(t[1]+r[1]),r=t;return a>=0}function V(e){var t=[],a=e.slice(0),s=F(a.shift().slice(0));if(s.length>=4){M(s)||s.reverse(),t.push(s);for(var n=0;n<a.length;n++){var r=F(a[n].slice(0));r.length>=4&&(M(r)&&r.reverse(),t.push(r))}}return t}function _(e,t){var a=w.a.Tools.arraysIntersectArrays(e,t),s=w.a.Tools.coordinatesContainPoint(e,t[0]);return!(a||!s)}var x={parse:function e(t,a){var s={};return(a=a||{}).idAttribute=a.idAttribute||void 0,!t.spatialReference||3857!==t.spatialReference.wkid&&102100!==t.spatialReference.wkid||(s.crs=w.a.MercatorCRS),"number"==typeof t.x&&"number"==typeof t.y&&(s.type="Point",s.coordinates=[t.x,t.y],(t.z||t.m)&&s.coordinates.push(t.z),t.m&&s.coordinates.push(t.m)),t.points&&(s.type="MultiPoint",s.coordinates=t.points.slice(0)),t.paths&&(1===t.paths.length?(s.type="LineString",s.coordinates=t.paths[0].slice(0)):(s.type="MultiLineString",s.coordinates=t.paths.slice(0))),t.rings&&(s=function(e){for(var t,a,s,n=[],r=[],i=0;i<e.length;i++){var o=F(e[i].slice(0));if(!(o.length<4))if(M(o)){var c=[o];n.push(c)}else r.push(o)}for(var l=[];r.length;){s=r.pop();var u=!1;for(t=n.length-1;t>=0;t--)if(_(a=n[t][0],s)){n[t].push(s),u=!0;break}u||l.push(s)}for(;l.length;){s=l.pop();var d=!1;for(t=n.length-1;t>=0;t--)if(a=n[t][0],w.a.Tools.arraysIntersectArrays(a,s)){n[t].push(s),d=!0;break}d||n.push([s.reverse()])}return 1===n.length?{type:"Polygon",coordinates:n[0]}:{type:"MultiPolygon",coordinates:n}}(t.rings.slice(0))),(t.compressedGeometry||t.geometry||t.attributes)&&(s.type="Feature",t.compressedGeometry&&(t.geometry={paths:[b(t.compressedGeometry)]}),s.geometry=t.geometry?e(t.geometry):null,s.properties=t.attributes?k(t.attributes):null,t.attributes&&(s.id=t.attributes[a.idAttribute]||t.attributes.OBJECTID||t.attributes.FID)),new w.a.Primitive(s)},convert:function e(t,a){var s,n=(a=a||{}).idAttribute||"OBJECTID";s=a.sr?{wkid:a.sr}:t&&t.crs&&"urn:ogc:def:crs:OGC:1.3:CRS84"!=t.crs.properties.name?null:{wkid:4326};var r,i={};switch(t.type){case"Point":i.type="point",i.x=t.coordinates[0],i.y=t.coordinates[1],t.coordinates[2]&&(i.z=t.coordinates[2]),t.coordinates[3]&&(i.m=t.coordinates[3]),i.spatialReference=s;break;case"MultiPoint":i.type="multipoint",i.points=t.coordinates.slice(0),i.spatialReference=s;break;case"LineString":i.type="polyline",i.paths=[t.coordinates.slice(0)],i.spatialReference=s;break;case"MultiLineString":i.type="polyline",i.paths=t.coordinates.slice(0),i.spatialReference=s;break;case"Polygon":i.type="polygon",i.rings=V(t.coordinates.slice(0)),i.spatialReference=s;break;case"MultiPolygon":i.rings=function(e){for(var t=[],a=0;a<e.length;a++)for(var s=V(e[a]),n=s.length-1;n>=0;n--){var r=s[n].slice(0);t.push(r)}return t}(t.coordinates.slice(0)),i.spatialReference=s;break;case"Feature":t.geometry&&(i.geometry=e(t.geometry,a)),i.attributes=t.properties?k(t.properties):{},t.id&&(i.attributes[n]=t.id);break;case"FeatureCollection":for(i=[],r=0;r<t.features.length;r++)i.push(e(t.features[r],a));break;case"GeometryCollection":for(i=[],r=0;r<t.geometries.length;r++)i.push(e(t.geometries[r],a))}return i},parseCompressedGeometry:function(e){return new w.a.LineString(b(e))}},E=function(e){if(e){var t=v.a.parse(e);return x.convert(t)}},O=function(e){if(e){var t=x.parse(e);return v.a.convert(t)}},D={},R={};r.loadModules(["esri/geometry/Point","esri/Graphic"]).then(function(e){var t=m()(e,2),a=t[0],s=t[1];D=a,R=s});var S={state:{mapView:{},values:[],center:{},zoom:{start:12,focus:16}},getters:{},actions:{setMapView:function(e,t){(0,e.commit)("setMapView",{mapView:t})},addWkt:function(e,t){e.commit;(0,e.dispatch)("addGeometry",E(t))},addGeometry:function(e,t){var a=e.commit,s=e.state,n=new R({geometry:t,symbol:h.a[t.type]});s.mapView.when(function(){a("addGraphic",{graphic:n})}),a("clearActiveButton")},clearGraphics:function(e){(0,e.commit)("clearGraphics")},center:function(e,t){var a=e.commit,s=t.location,n=t.spatialReference;a("center",{point:new D({x:s.x,y:s.y,spatialReference:n})}),a("focus")}},mutations:{setMapView:function(e,t){var a=t.mapView;e.mapView=a},addGraphic:function(e,t){var a=t.graphic;e.mapView.graphics.add(a),e.mapView.goTo({target:a,zoom:e.zoom.focus})},clearGraphics:function(e){e.mapView.graphics.removeAll()},center:function(e,t){var a=t.point;e.mapView.goTo({center:a,zoom:e.zoom.focus})},focus:function(e){e.mapView.zoom=e.zoom.focus}}},C={state:{sketchViewModel:{},activeButton:""},getters:{},actions:{setSketchViewModel:function(e,t){(0,e.commit)("setSketchViewModel",{sketchViewModel:t})},draw:function(e,t){var a=e.commit;e.state,a("setActiveButton",{type:t}),a("clearGraphics"),a("setMessage",{message:{id:"MAP_HELP",text:"point"===t?"Drawing started... Click to place a point.":'Drawing started... Double-click or press "c" to end drawing.',type:"info"}}),a("startDraw",{type:t})}},mutations:{setSketchViewModel:function(e,t){var a=t.sketchViewModel;e.sketchViewModel=a},startDraw:function(e,t){var a=t.type;e.sketchViewModel.create(a)},setActiveButton:function(e,t){var a=t.type;e.activeButton=a},clearActiveButton:function(e){e.activeButton=""}}},A=new p("28D3F96A84990C0554495C07309117EF"),P={state:{},getters:{},actions:{suggest:function(e,t){var a=e.commit,s=e.dispatch;a("clearMessages"),A.suggestAddress(t,{},function(e){s("center",{location:e.location,spatialReference:e.spatialReference})},function(e){a("setMessage",{message:{id:"PORTLANDMAPS_REQUEST_ERROR",text:e,type:"danger"}})})}},mutations:{}},G=a("mvHQ"),B=a.n(G),z=function(){function e(){o()(this,e)}return l()(e,[{key:"getAddress",value:function(e,t){var a="https://www.portlandmaps.com/arcgis/rest/services/Public/Address_Geocoding_PDX/GeocodeServer/reverseGeocode?location="+t+","+e+"&f=json";return d.a.get(encodeURI(a))}},{key:"geocodeAddress",value:function(e){var t={records:[{attributes:{OBJECTID:1,Street:e.street,City:e.city,State:e.state,Zip:e.zip}}]},a=GEOCODE_ADDRESS_URL+"?addresses="+B()(t)+"&f=json";return d.a.get(encodeURI(a))}}]),e}(),j=a("0iPh"),I=a.n(j),U={Street:"address-line1",City:"locality",State:"administrative-area",ZIP:"postal-code"},T={OREGON:"OR"},L=function(){function e(t){var a=this;o()(this,e);var s=".field--type-address.field--name-"+t.replace(/_/g,"-");this.addressField=I()(s),this.address={},I()(document).ajaxComplete(function(e,s,n){n.extraData&&n.extraData._drupal_ajax&&n.extraData._triggering_element_name===t+"[0][address][country_code]"&&a.fillFields()})}return l()(e,[{key:"fillFields",value:function(){for(var e in U)if(U.hasOwnProperty(e)){var t=U[e];"State"===e&&(this.address[e]=T[this.address[e]]||this.address[e]),this.addressField.find("."+t).val(this.address[e]).change()}}},{key:"set",value:function(e){this.address=e,this.addressField.find(".country.form-select").length?this.addressField.find(".country.form-select").val("US").trigger("change"):this.fillFields()}}]),e}(),N=function(){function e(t){o()(this,e),this.valueField=document.getElementById(t)}return l()(e,[{key:"set",value:function(e){this.valueField.value=O(e)}},{key:"clear",value:function(){this.valueField.value=NULL}},{key:"get",value:function(){return this.valueField.value}}]),e}(),W={state:{addressField:"field_facility_address",valueField:"edit-field-geometry-0-value-wkt"},getters:{},actions:{setAddressField:function(e,t){var a=e.commit,s=(e.state,e.dispatch);(new z).getAddress(t.y,t.x).then(function(e){!e||e.data.error?s("setMessage",{id:"GEOCODESERVER_GEOCODE_ERROR",text:"Unable to geocode an address for the geometry.",type:"danger"}):e.data.address&&a("setAddressField",{address:e.data.address})})},setValueField:function(e,t){var a=e.commit;e.state,e.dispatch;a("setValueField",{geometry:t})}},mutations:{setAddressField:function(e,t){var a=t.address;new L(e.addressField).set(a)},clearValueField:function(e){new N(e.valueField).clear()},setValueField:function(e,t){var a=t.geometry;new N(e.valueField).set(a)}}};s.a.use(n.a);new p("28D3F96A84990C0554495C07309117EF"),t.a=new n.a.Store({modules:{map:S,drawbar:C,search:P,field:W},state:{messages:[],widget:!1,settings:{wktid:"",mapid:"",width:"100%",height:"50vh",center:{lon:-13656529.895,lat:5703070.921},zoom:{start:12,focus:16},value:{}}},getters:{mapid:function(e){return e.settings.mapid+"-app"}},actions:{initialize:function(){},setMessage:function(e,t){(0,e.commit)("setMessage",{message:t})},clearMessages:function(e){(0,e.commit)("clearMessages")}},mutations:{setMessage:function(e,t){var a=t.message;e.messages=[a]},clearMessages:function(e){e.messages=[]}}})},"OZ/X":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("7+uW"),n=a("Dd8w"),r=a.n(n),i=a("NYxO"),o=a("3GDu"),c=a("mqSb"),l=a("Ty8c"),u=a("/KFX"),d={name:"Widget",components:{Map:o.a,Messages:c.a,Drawbar:l.a,Search:u.a},computed:r()({},Object(i.c)(["mapid"])),methods:{}},p={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:this.mapid}},[t("Messages"),this._v(" "),t("Map",[t("Drawbar"),this._v(" "),t("Search")],1)],1)},staticRenderFns:[]};var f=a("VU/8")(d,p,!1,function(e){a("m4Wr")},null,null).exports,m=a("IcnI");!function(e,t,a){t.behaviors.esri={attach:function(t,a){a.esri_geofield_map&&e(t).find(".esri-geofield-map").once("esri_processed").each(function(t,n){var r=e(n).attr("id"),i=a.esri_geofield_map[r];new s.a({el:"#"+r,store:m.a,components:{Widget:f},template:"<Widget/>"});m.a.state.settings=i,m.a.state.widget=!0,m.a.state.field.addressField=i.addressField,m.a.state.field.valueField=i.wktid})}}}(jQuery,Drupal,drupalSettings)},Ty8c:function(e,t,a){"use strict";var s=a("Dd8w"),n=a.n(s),r=a("d7EF"),i=a.n(r),o=a("NYxO"),c=a("Meid"),l={point:"esri-icon-blank-map-pin",multipoint:"esri-icon-handle-horizontal",line:"",polyline:"esri-icon-polyline",polygon:"esri-icon-polygon"},u={name:"DrawButton",props:["type"],computed:n()({icon:function(){return l[this.type]},title:function(){return"Draw "+this.type},active:function(){return this.type===this.activeButton}},Object(o.d)({activeButton:function(e){return e.drawbar.activeButton}})),methods:n()({},Object(o.b)(["draw"]))},d={render:function(){var e=this,t=e.$createElement;return(e._self._c||t)("button",{class:[{"action-button":!0,active:e.active},e.icon,e.type],attrs:{name:e.type,type:"button",title:e.title},on:{click:function(t){e.draw(e.type,t)}}})},staticRenderFns:[]};var p=a("VU/8")(u,d,!1,function(e){a("E3s9")},null,null).exports,f=a("rvVx"),m={name:"Drawbar",components:{DrawButton:p},created:function(){var e=this;c.loadModules(["esri/widgets/Sketch/SketchViewModel"]).then(function(t){var a=new(0,i()(t,1)[0])({view:e.mapView,pointSymbol:f.a.point,polylineSymbol:f.a.polyline,polygonSymbol:f.a.polygon});a.on("draw-complete",function(t){e.clearMessages();var a=t.geometry;e.addGeometry(a);var s={};s=a.extent?{x:a.extent.center.x,y:a.extent.center.y}:{x:a.x,y:a.y},e.setAddressField(s),c.loadModules(["esri/geometry/support/webMercatorUtils"]).then(function(t){var s=i()(t,1)[0];e.setValueField(s.webMercatorToGeographic(a))})}),e.setSketchViewModel(a)})},computed:n()({},Object(o.d)({sketchViewModel:function(e){return e.drawbar.sketchViewModel},mapView:function(e){return e.map.mapView}})),methods:n()({},Object(o.b)(["clearGraphics","setSketchViewModel","addGeometry","setAddressField","setValueField","clearMessages"]))},h={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"topbar"},[t("DrawButton",{attrs:{type:"point"}}),this._v(" "),t("DrawButton",{attrs:{type:"multipoint"}}),this._v(" "),t("DrawButton",{attrs:{type:"polyline"}}),this._v(" "),t("DrawButton",{attrs:{type:"polygon"}}),this._v(" "),t("button",{staticClass:"action-button esri-icon-trash reset",attrs:{name:"reset",type:"button",title:"Clear graphics"},on:{click:this.clearGraphics}})],1)},staticRenderFns:[]};var g=a("VU/8")(m,h,!1,function(e){a("kNrg")},null,null);t.a=g.exports},go3O:function(e,t){},kNrg:function(e,t){},m4Wr:function(e,t){},mqSb:function(e,t,a){"use strict";var s=a("Dd8w"),n=a.n(s),r=a("NYxO"),i={render:function(){var e=this.$createElement;return(this._self._c||e)("div",{class:[this.alertClass,this.typeClass],attrs:{role:"alert"}},[this._v("\n  "+this._s(this.message)+"\n")])},staticRenderFns:[]};var o={name:"Messages",components:{Message:a("VU/8")({name:"Message",props:["message","type"],data:function(){return{alertClass:"alert"}},computed:{typeClass:function(){return"alert-"+this.type}}},i,!1,function(e){a("zr/O")},null,null).exports},computed:n()({},Object(r.d)(["messages"]))},c={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"messages"}},this._l(this.messages,function(e){return t("Message",{key:e.id,attrs:{message:e.text,type:e.type}})}))},staticRenderFns:[]};var l=a("VU/8")(o,c,!1,function(e){a("go3O")},null,null);t.a=l.exports},qncE:function(e,t){},rvVx:function(e,t,a){"use strict";t.a={point:{type:"simple-marker",color:"#8A2BE2",size:"14px",outline:{color:"#FFFFFF",width:3}},multipoint:{type:"simple-marker",color:"#8A2BE2",size:"14px",outline:{color:"#FFFFFF",width:3}},polyline:{type:"simple-line",color:"#8A2BE2",width:3},polygon:{type:"simple-fill",color:"#FFFFFF",style:"solid",outline:{color:"#8A2BE2",width:2}}}},wr5E:function(e,t){},"zr/O":function(e,t){}},[0]);
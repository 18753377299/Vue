// 测距测面积的方法
var AreaTool = null, myDis = null;
var MeasureStyle = {
    strokeColor: "#FF8040",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fillColor: "#FF8040",
    fillOpacity: 0.2
}

var MeasureLabel = new SuperMap.Strategy.GeoText();
MeasureLabel.style = {
    labelAlign: "lt",
    labelXOffset: 3,
    labelYOffset: 0,
    fontColor: "#333333",
    fontWeight: "normal",
    fontSize: "13px",
    fill: true,
    fillColor: "#FFFFFF",
    fillOpacity: 1,
    stroke: true,
    strokeWidth: 1,
    strokeColor: "#FF0000",
    radius: "0px",
    lineHeight: "20px"
};
var measureLayer =new SuperMap.Layer.Vector("measureLayer");
var textLayer = new SuperMap.Layer.Vector("textLayer", { strategies: [MeasureLabel] });
var markerLayer = new SuperMap.Layer.Markers("markerLayer");
var MeasureUrl = null;

var EARTH_RADIUS = 6378137;
function rad(d) {
    return d * Math.PI / 180.0;
}
function GetDistance(lng1, lat1, lng2, lat2) {
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}
// 距离量算
function Init_AreaTool(bs) {
    if (AreaTool == null || myDis == null) {
        var mapname = FXZT_Json[0].mapname;
        var dsname = FXZT_Json[0].dsname;
        MeasureUrl = mapurl + "/iserver/services/map-" + dsname + "/rest/maps/" + mapname;
        add_Measure_Control();
    }
    if (bs == 0) {
        Distance();
    }
    else if (bs == 1) {
        AreaMeasure();
    }
}
function add_Measure_Control() {
    myDis = new SuperMap.Control.DrawFeature(measureLayer, SuperMap.Handler.Path, { multi: true, style: MeasureStyle });
    myDis.events.on({ "featureadded": dis_drawCompleted });

    AreaTool = new SuperMap.Control.DrawFeature(measureLayer, SuperMap.Handler.Polygon, { multi: true, style: MeasureStyle });
    AreaTool.events.on({ "featureadded": area_drawCompleted });

    map.addControl(myDis);
    map.addControl(AreaTool);

    map.addLayers([measureLayer, textLayer, markerLayer]);
    var LayerDiv = measureLayer.div;
    $(LayerDiv).css({ zIndex: 1550 });
    LayerDiv = textLayer.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = markerLayer.div;
    $(LayerDiv).css({ zIndex: 1600 });
}

//面积测量
function AreaMeasure() {
    var img = $("#AreaLS").attr("src");
    if (img == "/images/tool/M0_测面积.png") {
        Tool_ClearLayer();
        $("#AreaLS").attr("src", "/images/tool/M1_测面积.png");
        AreaTool.activate();
    }
    else {
        $("#AreaLS").attr("src", "/images/tool/M0_测面积.png");
        AreaTool.deactivate();
        Tool_ClearLayer();
    }
}

//测距
function Distance() {
    var img = $("#DisLS").attr("src");
    if (img == "/images/tool/M0_测距.png") {
        Tool_ClearLayer();
        $("#DisLS").attr("src", "/images/tool/M1_测距.png");
        myDis.activate();
    }
    else {
        $("#DisLS").attr("src", "/images/tool/M0_测距.png");
        myDis.deactivate();
        Tool_ClearLayer();
    }
}


//===============测距离Begin============//
//距离量算绘完触发事件
function dis_drawCompleted(drawGeometryArgs) {
    myDis.deactivate();
    var geometry = drawGeometryArgs.feature.geometry,
            measureParam = new SuperMap.REST.MeasureParameters(geometry),
            myMeasuerService = new SuperMap.REST.MeasureService(MeasureUrl);
    var Points = geometry.components[0].components;
    var x0 = 0, y0 = 0, x1 = 0, y1 = 0, geoText, geotextFeature, alldis = 0;
    for (var i = 0; i < Points.length; i++) {
        if (i == 0) {
            x0 = Points[i].x;
            y0 = Points[i].y;
            geoText = new SuperMap.Geometry.GeoText(x0, y0, "开始");
            geotextFeature = new SuperMap.Feature.Vector(geoText);
            textLayer.addFeatures([geotextFeature]);
        }
        else {
            x0 = Points[i - 1].x;
            y0 = Points[i - 1].y;
            x1 = Points[i].x;
            y1 = Points[i].y;
            var dis = GetDistance(x0, y0, x1, y1);
            alldis += dis;
            geoText = new SuperMap.Geometry.GeoText(x1, y1, (alldis / 1000).toFixed(2) + "公里");
            geotextFeature = new SuperMap.Feature.Vector(geoText);
            textLayer.addFeatures([geotextFeature]);
            if (i == Points.length - 1) {
                var size = new SuperMap.Size(12, 12);
                var offset = new SuperMap.Pixel(0, -size.h - 2);
                var icon = new SuperMap.Icon('/images/comm/tool_clear.png', size, offset);
                marker = new SuperMap.Marker(new SuperMap.LonLat(x1, y1), icon);
                marker.events.on({
                    "click": Tool_ClearLayer,
                    "scope": marker
                });
                markerLayer.addMarker(marker);
            }
        }
    }
}
function dis_measureCompleted(measureEventArgs) {
    var distance = measureEventArgs.result.distance;
    var unit = measureEventArgs.result.unit;
}
//===============测距End============//

//===============测面积Begin============//
function area_drawCompleted(drawGeometryArgs) {
    AreaTool.deactivate();
    var geometry = drawGeometryArgs.feature.geometry,
            measureParam = new SuperMap.REST.MeasureParameters(geometry),
            myMeasuerService = new SuperMap.REST.MeasureService(MeasureUrl);
    myMeasuerService.events.on({ "processCompleted": area_measureCompleted });
    myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
    myMeasuerService.processAsync(measureParam);
}
//面积量算测量结束调用事件
function area_measureCompleted(measureEventArgs) {
    var area = measureEventArgs.result.area, unit = measureEventArgs.result.unit;
    var Geo = measureLayer.features[0].geometry.bounds;
    var x = (Geo.left + Geo.right) / 2;
    var y = (Geo.bottom + Geo.top) / 2;
    if (area > 1000000) {
        geoText = new SuperMap.Geometry.GeoText(x, y, (area / 1000000).toFixed(3) + "平方公里");
    }
    else {
        geoText = new SuperMap.Geometry.GeoText(x, y, (area).toFixed(0) + "平方米");
    }
    geotextFeature = new SuperMap.Feature.Vector(geoText);
    textLayer.addFeatures([geotextFeature]);

    var size = new SuperMap.Size(12, 12);
    var offset = new SuperMap.Pixel(0, -size.h - 2);
    var icon = new SuperMap.Icon('/images/comm/tool_clear.png', size, offset);
    marker = new SuperMap.Marker(new SuperMap.LonLat(x, y), icon);
    marker.events.on({
        "click": Tool_ClearLayer,
        "scope": marker
    });
    markerLayer.addMarker(marker);
}
//===============测面积End============//

//清除工具栏操作
function Tool_ClearLayer() {
    $("#ZTInfo").attr("src", "/images/tool/M0_详情.png");
    map.events.un({ "click": GetZTInfo });
    $("#Prop_Info").hide();
    Query_CurJson.arealayer.removeAllFeatures();
    Query_CurJson.marketlayer.clearMarkers();

    $("#DisLS").attr("src", "/images/tool/M0_测距.png");
    $("#AreaLS").attr("src", "/images/tool/M0_测面积.png");
    if (myDis != null || AreaTool!=null) {
        myDis.deactivate();
        AreaTool.deactivate();
    }
    measureLayer.removeAllFeatures();
    textLayer.removeAllFeatures();
    markerLayer.clearMarkers();
}

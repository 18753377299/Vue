//风险预警
var AllArrType = [];
var FXYJ_Json = [];
var LS_FXYJ_Json = [];
var FXYJ_Json_TJ1 = [];
var FXYJ_Json_TJ2 = [];
var FXYJ_SDLayer = null;
var FXYJ_CircleLayer_1 = null;
var FXYJ_LabelLayer_1 = null;
var FXYJ_CircleLayer_2 = null;
var FXYJ_LabelLayer_2 = null;

var selectGraphic;
var FXYJ_CurJson = { areacode: "", yjtype: [], yjleval: [] };
var FXYJ_CurState = 0;//代表关闭,1代表开启
var strategy = new SuperMap.Strategy.GeoText();
strategy.style = {
    fontColor: "#FFFFFF",
    fontWeight: "nomal",
    fontSize: "14px",
    fill: false,
    fillColor: "#FFA500",
    fillOpacity: 1,
    stroke: false,
    strokeColor: "#FFA500"
};

var strategy2 = new SuperMap.Strategy.GeoText();
strategy2.style = {
    fontColor: "#FFFFFF",
    fontWeight: "nomal",
    fontSize: "14px",
    fill: false,
    fillColor: "#FFA500",
    fillOpacity: 1,
    stroke: false,
    strokeColor: "#FFA500"
};

// 聚集图
var SettingForCircle_1 = {
    codomain: [0, 1000],
    maxR: 20,
    minR: 8,
    circleStyle: { fillOpacity: 0.8 },
    fillColor: "#FF8000", //"#FFA500",
    circleHoverStyle: { fillOpacity: 1 }
};

var SettingForCircle_2 = {
    codomain: [0, 1000],
    maxR: 20,
    minR: 8,
    circleStyle: { fillOpacity: 0.8 },
    fillColor: "#FF8000",
    circleHoverStyle: { fillOpacity: 1 }
};

function FXYJ_InitLayer()
{
    FXYJ_SDLayer = new SuperMap.Layer.Graphics("FXYJ_SDLayer", null, { hitDetection: true });
    FXYJ_CircleLayer_1 = new SuperMap.Layer.RankSymbol("FXYJ_CircleLayer_1", "Circle");
    FXYJ_LabelLayer_1 = new SuperMap.Layer.Vector("FXYJ_LabelLayer1", { strategies: [strategy] });
    FXYJ_CircleLayer_2 = new SuperMap.Layer.RankSymbol("FXYJ_CircleLayer_2", "Circle");
    FXYJ_LabelLayer_2 = new SuperMap.Layer.Vector("FXYJ_LabelLayer2", { strategies: [strategy2] });

    map.addLayers([FXYJ_CircleLayer_1, FXYJ_LabelLayer_1, FXYJ_CircleLayer_2, FXYJ_LabelLayer_2, FXYJ_SDLayer]);
    var LayerDiv = FXYJ_CircleLayer_1.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = FXYJ_LabelLayer_1.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = FXYJ_CircleLayer_2.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = FXYJ_LabelLayer_2.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = FXYJ_SDLayer.div;
    $(LayerDiv).css({ zIndex: 1600 });

    selectGraphic = new SuperMap.Control.SelectGraphic(FXYJ_SDLayer, {
        onSelect: FXYJ_GetInfo
    });
    map.addControl(selectGraphic);
    selectGraphic.activate();
}

//获取全部风险预警
function FXYJ_GetAllList() {
    if (FXYJ_Json.length == 0) {
        FXYJ_InitLayer();
        $.ajax({
            url: "/views/xtmh/fxyj.aspx?Action=FXYJ_GetSJQueryList",
            type: 'post',
            data: { seccode: U_Token },
            cache: false,
            success: function (text) {
                var info = eval("(" + text + ")");
                AllArrType = info.data;
                FXYJ_Json_TJ1 = info.data_tj1;
                FXYJ_Json_TJ2 = info.data_tj2;
                FXYJ_InitPanal();

                DrawCircle_1();
                DrawCircle_2();
                //FXYJ_GetQueryRes(1);

                $.ajax({
                    url: "/views/xtmh/fxyj.aspx?Action=FXYJ_GetBaseList",
                    type: 'post',
                    data: { seccode: U_Token },
                    cache: false,
                    success: function (text) {
                        var info = eval("(" + text + ")");
                        FXYJ_Json = info.data;

                        FXYJ_GetAllRes(1);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mui.toast(jqXHR.responseText);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                mui.toast(jqXHR.responseText);
            }
        });

    }
    else {

        FXYJ_ZoomControl();
        $("#FXYJ_Panal").show({
            duration: 500,
        });
        //FXYJ_GetQueryRes(1);
    }
    LSZH_AddLegend(4);
}

//获取统计数据
function GetTJJson() {
    var strJB = FXYJ_CurJson.yjleval.join("&");
    var strType = FXYJ_CurJson.yjtype.join("&");
    $.ajax({
        url: "/views/xtmh/fxyj.aspx?Action=FXYJ_GetSJTJList",
        type: 'post',
        data: { seccode: U_Token, yjtype: strType, yjlevel: strJB },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            FXYJ_Json_TJ1 = info.data_tj1;
            FXYJ_Json_TJ2 = info.data_tj2;
            DrawCircle_1();
            DrawCircle_2();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mui.toast(jqXHR.responseText);
        }
    });
}


//初始化预警面板
function FXYJ_InitPanal() {
    //var ArrType = [];
    //var ArrJB = [];
    //for (var i = 0; i < FXYJ_Json.length; i++) {
    //    var type = FXYJ_Json[i].signalType;
    //    var leval = FXYJ_Json[i].signalLevel;
    //    ArrType.push(type);
    //    ArrJB.push(leval);
    //}
    //var LSArrJB = ArrUnique(ArrJB);
    var LSArrType = AllArrType;//ArrUnique(ArrType);
    
    var strHtml = "";

    var strHtml = '<label class="MH_label MH_label_HH"  style="color:#242d3A"><input class="MH_radio FXYJ_AllCheckLX" value ="全选" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>全选</label><br/>';
    for (var i = 0; i < LSArrType.length; i++) {
        if (LSArrType[i].signalType != null && LSArrType[i].signalType != "") {
            var name = "";
            for (var j = 0; j < YJLX_Json.length; j++) {
                if (YJLX_Json[j].YJType == LSArrType[i].signalType) {
                    name = YJLX_Json[j].YJName;
                    strHtml += '<label class="MH_label MH_label_HH"><input class="MH_radio FXYJ_CheckLX" value ="' + LSArrType[i].signalType + '" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>' + name + '</label>';
                    break;
                }
            }
        }
    }
    $("#FXYJ_LX_Con").html(strHtml);
    $(".FXYJ_CheckLX").click(function () {
        FXYJ_GetQueryRes(1);
    });
    $(".FXYJ_AllCheckLX").click(function () {
        var state = $(this).is(':checked');
        if (state == true) {
            $(".FXYJ_CheckLX").each(function () {
                this.checked = true;
            });
        }
        else {
            $(".FXYJ_CheckLX").each(function () {
                this.checked = false;
            });
        }
        FXYJ_GetQueryRes(1);
    });
    strHtml = '<label class="MH_label MH_label_HH"><input class="MH_radio FXYJ_AllCheckJB" value ="全选" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>全选</label><br/>';
    strHtml += '<label class="MH_label MH_label_2"><input class="MH_radio FXYJ_CheckJB" value ="红色" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>红色预警[一级/特别严重]</label>';
    strHtml += '<label class="MH_label MH_label_2"><input class="MH_radio FXYJ_CheckJB" value ="橙色" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>橙色预警[二级/严重]</label>';
    strHtml += '<label class="MH_label MH_label_2"><input class="MH_radio FXYJ_CheckJB" value ="黄色" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>黄色预警[三级/较重]</label>';
    strHtml += '<label class="MH_label MH_label_2"><input class="MH_radio FXYJ_CheckJB" value ="蓝色" type="checkbox" checked="checked"><span class="MH_checkbox MH_radioInput"></span>蓝色预警[四级/一般]</label>';
    $("#FXYJ_JB_Con").html(strHtml);
    $(".FXYJ_CheckJB").click(function () {
        FXYJ_GetQueryRes(1);
    });
    $(".FXYJ_AllCheckJB").click(function () {
        var state = $(this).is(':checked');
        if (state == true) {
            $(".FXYJ_CheckJB").each(function () {
                this.checked = true;
            });
        }
        else {
            $(".FXYJ_CheckJB").each(function () {
                this.checked = false;
            });
        }
        FXYJ_GetQueryRes(1);
    });
    $("#FXYJ_Panal").show();
}

//风险预警获取查询结果   预警查询 bs=1,标的、区域查询  bs=2;

function FXYJ_GetAllRes(bs) {
    var chk_value = [];
    $('.FXYJ_CheckLX:checked').each(function () {
        chk_value.push($(this).val());
    });
    FXYJ_CurJson.yjtype = chk_value;

    var chk_value = [];
    $('.FXYJ_CheckJB:checked').each(function () {
        chk_value.push($(this).val());
    });
    FXYJ_CurJson.yjleval = chk_value;
    //清空预警信息
    LS_FXYJ_Json = [];

    ReDrawMarket();
}

function FXYJ_GetQueryRes(bs) {
    var chk_value = [];
    $('.FXYJ_CheckLX:checked').each(function () {
        chk_value.push($(this).val());
    });
    FXYJ_CurJson.yjtype = chk_value;

    var chk_value = [];
    $('.FXYJ_CheckJB:checked').each(function () {
        chk_value.push($(this).val());
    });
    FXYJ_CurJson.yjleval = chk_value;
    //清空预警信息
    LS_FXYJ_Json = [];

    ReDrawMarket();
    GetTJJson();
}

function ReDrawMarket() {
    if (LS_FXYJ_Json.length == 0) {
        var yjtype = [], yjleval = [];
        yjtype = FXYJ_CurJson.yjtype;
        yjleval = FXYJ_CurJson.yjleval;

        var ArrType = [];
        var ArrJB = [];
        var ArrSelType = [];
        var ArrSelJB = [];
        for (var i = 0; i < FXYJ_Json.length; i++) {
            var type = FXYJ_Json[i].signalType;
            var leval = FXYJ_Json[i].signalLevel;
            var lxbh = $.inArray(type, yjtype);
            var jbbh = $.inArray(leval, yjleval);

            ArrType.push(type);
            ArrJB.push(leval);
            if (lxbh >= 0 && jbbh >= 0) {
                ArrSelType.push(type);
                ArrSelJB.push(leval);
                LS_FXYJ_Json.push(FXYJ_Json[i]);
            }
        }
        FXYJ_DrawMarker();
    }
}



//展示风险预警地图标点
function FXYJ_DrawMarker() {
    //FXYJ_SDLayer.removeAllGraphics();
    //var points = [];  // 添加海量点数据
    //var TBYS = { "蓝色": "1", "黄色": "2", "橙色": "3", "红色": "4" };

    //var fillColors = ['rgba(18,150,219,0.9)', 'rgba(255,255,0,0.9)', 'rgba(255,128,10,0.9)', 'rgba(255,0,0,0.9)'];
    //var strokeColors = ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)'];
    //var radius = [6, 8, 10, 12];
    //var symbols = [];
    //for (var i = 0; i < fillColors.length; i++) {
    //    symbols.push(new SuperMap.Style.Circle({
    //        radius: radius[i],
    //        fill: new SuperMap.Style.Fill({
    //            color: fillColors[i]
    //        }),
    //        stroke: new SuperMap.Style.Stroke({
    //            color: strokeColors[i]
    //        })
    //    }));
    //}

    //for (i = 0, len = LS_FXYJ_Json.length; i < len; i++) {
    //    var bs = LS_FXYJ_Json[i]["id"];
    //    var lng = LS_FXYJ_Json[i]["cenx"];
    //    var lat = LS_FXYJ_Json[i]["ceny"];
    //    var jb = TBYS[LS_FXYJ_Json[i]["signalLevel"]];
    //    var Point = new SuperMap.Geometry.Point(parseFloat(lng), parseFloat(lat));

    //    var pointVector = new SuperMap.Graphic(Point);
    //    pointVector.style = {
    //        image: symbols[parseInt(jb) - 1]
    //    };
    //    Point.data = bs;
    //    points.push(pointVector)
    //}
    //FXYJ_SDLayer.addGraphics(points);
    //if (map.getZoom() >= 7) {
    //    FXYJ_SDLayer.setVisibility(true);
    //}
    //else {
    //    FXYJ_SDLayer.setVisibility(false);
    //}

    FXYJ_SDLayer.removeAllGraphics();
    if (map.getZoom() >= 7) {
        FXYJ_SDLayer.setVisibility(true);
    }
    else {
        FXYJ_SDLayer.setVisibility(false);
    }
    LS_FXYJ_Json.forEach(function (val, index) {
        if (val.signalType == null || val.signalLevel == null || val.cenx == null || val.ceny == null) return;
        var imageurl = "";
        if (val.signalType == "11B03") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/暴雨蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/暴雨黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/暴雨橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/暴雨红.png";
        }
        if (val.signalType == "11B04") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/暴雪蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/暴雪黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/暴雪橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/暴雪红.png";
        }
        if (val.signalType == "11B05") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/寒潮蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/寒潮黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/寒潮橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/寒潮红.png";
        }
        if (val.signalType == "11B06") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/大风蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/大风黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/大风橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/大风红.png";
        }
        if (val.signalType == "11B09") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/高温蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/高温黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/高温橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/高温红.png";
        }
        if (val.signalType == "11B14") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/雷电蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/雷电黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/雷电橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/雷电红.png";
        }
        if (val.signalType == "11B15") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/冰雹蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/冰雹黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/冰雹橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/冰雹红.png";
        }
        if (val.signalType == "11B16") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/霜冻蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/霜冻黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/霜冻橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/霜冻红.png";
        }
        if (val.signalType == "11B17") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/大雾蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/大雾黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/大雾橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/大雾红.png";
        }
        if (val.signalType == "11B21") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/道路结冰蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/道路结冰黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/道路结冰橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/道路结冰红.png";
        }
        if (val.signalType == "11B22") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/干旱蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/干旱黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/干旱橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/干旱红.png";
        }
        if (val.signalType == "11B19") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/霾蓝.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/霾黄.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/霾橙.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/霾红.png";
        }
        if (imageurl == "") {
            if (val.signalLevel == "蓝色") imageurl = "/images/qixiang/蓝色.png";
            if (val.signalLevel == "黄色") imageurl = "/images/qixiang/黄色.png";
            if (val.signalLevel == "橙色") imageurl = "/images/qixiang/橙色.png";
            if (val.signalLevel == "红色") imageurl = "/images/qixiang/红色.png";
        }

        var img = new Image();
        img.src = imageurl;
        var symbolinfo = new SuperMap.Style.Image({
            img: img,
            anchor: [36, 36]
        });

        var style = {
            image: symbolinfo,
            graphicHeight: 36,
            graphicWidth: 36
        };

        img.onload = function () {
            var Point = new SuperMap.Geometry.Point(val.cenx, val.ceny);
            var pointVector = new SuperMap.Graphic(Point, null, style);
            Point.data = val.id;
            FXYJ_SDLayer.addGraphics([pointVector]);
        }
    });
}

//绘制聚集图
function DrawCircle_1() {
    FXYJ_CircleLayer_1.clear();
    FXYJ_LabelLayer_1.removeAllFeatures();
    if (FXYJ_Json_TJ1.length == 0) {
        return;
    }
    var LSData = new Array();
    var Sel_ZB = "num";
    var ArrVal = [];
    var ThemeFids = [Sel_ZB];
    var ThemeFeas = [];
    var labelFeas = [];
    var LSData = [];
    var ArrLng = [];
    var ArrLat = [];

    for (var i = 0; i < FXYJ_Json_TJ1.length; i++) {
        try {
            var strName = FXYJ_Json_TJ1[i]["name"];
            var lng = parseFloat(FXYJ_Json_TJ1[i]["cenx"]);
            var lat = parseFloat(FXYJ_Json_TJ1[i]["ceny"]);
            if (isNaN(lng) == false && lng != 0 && isNaN(lat) == false && lat != 0) {
                var geo = new SuperMap.Geometry.Point(lng, lat);
                ArrLng.push(lng);
                ArrLat.push(lat);
                var attrs = {};
                attrs["code"] = FXYJ_Json_TJ1[i]["code"];

                var val = FXYJ_Json_TJ1[i][Sel_ZB];
                if (isNaN(val) == false) {
                    if (val != 0) {
                        ArrVal.push(val);
                    }
                }
                else {
                    val = 0;
                }
                attrs[Sel_ZB] = val;
                if (i == 0) {
                    LSData.push({ name: Sel_ZB, value: val });
                }
                var fea = new SuperMap.Feature.Vector(geo, attrs);

                ThemeFeas.push(fea);
                var label = new SuperMap.Geometry.GeoText(lng, lat, val);
                labelFeas.push(new SuperMap.Feature.Vector(label, attrs));
            }
        }
        catch (ex) { }
    }
    var max = Math.max.apply(null, ArrVal);
    var min = Math.min.apply(null, ArrVal);
    FXYJ_CircleLayer_1.isOverLay = false;
    FXYJ_CircleLayer_1.themeField = ThemeFids[0];
    SettingForCircle_1.codomain = [0, max];
    FXYJ_CircleLayer_1.symbolSetting = SettingForCircle_1;

    FXYJ_CircleLayer_1.addFeatures(ThemeFeas);
    FXYJ_LabelLayer_1.addFeatures(labelFeas);
    if (map.getZoom() < 5) {
        FXYJ_CircleLayer_1.setVisibility(true);
        FXYJ_LabelLayer_1.setVisibility(true);
    }
    else {
        FXYJ_CircleLayer_1.setVisibility(false);
        FXYJ_LabelLayer_1.setVisibility(false);
    }
}

function DrawCircle_2() {
    FXYJ_CircleLayer_2.clear();
    FXYJ_LabelLayer_2.removeAllFeatures();
    if (FXYJ_Json_TJ2.length == 0) {
        return;
    }
    var LSData = new Array();
    var Sel_ZB = "num";
    var ArrVal = [];
    var ThemeFids = [Sel_ZB];
    var ThemeFeas = [];
    var labelFeas = [];
    var LSData = [];
    var ArrLng = [];
    var ArrLat = [];

    for (var i = 0; i < FXYJ_Json_TJ2.length; i++) {
        try {
            var strName = FXYJ_Json_TJ2[i]["name"];
            var lng = parseFloat(FXYJ_Json_TJ2[i]["cenx"]);
            var lat = parseFloat(FXYJ_Json_TJ2[i]["ceny"]);
            if (isNaN(lng) == false && lng != 0 && isNaN(lat) == false && lat != 0) {
                var geo = new SuperMap.Geometry.Point(lng, lat);
                ArrLng.push(lng);
                ArrLat.push(lat);
                var attrs = {};
                attrs["code"] = FXYJ_Json_TJ2[i]["code"];

                var val = FXYJ_Json_TJ2[i][Sel_ZB];
                if (isNaN(val) == false) {
                    if (val != 0) {
                        ArrVal.push(val);
                    }
                }
                else {
                    val = 0;
                }
                attrs[Sel_ZB] = val;
                if (i == 0) {
                    LSData.push({ name: Sel_ZB, value: val });
                }
                var fea = new SuperMap.Feature.Vector(geo, attrs);


                ThemeFeas.push(fea);
                var label = new SuperMap.Geometry.GeoText(lng, lat, val);
                labelFeas.push(new SuperMap.Feature.Vector(label, attrs));
            }
        }
        catch (ex) { }
    }
    var max = Math.max.apply(null, ArrVal);
    var min = Math.min.apply(null, ArrVal);

    FXYJ_CircleLayer_2.isOverLay = false;
    FXYJ_CircleLayer_2.themeField = ThemeFids[0];
    SettingForCircle_2.codomain = [0, max];
    FXYJ_CircleLayer_2.symbolSetting = SettingForCircle_2;

    FXYJ_CircleLayer_2.addFeatures(ThemeFeas);
    FXYJ_LabelLayer_2.addFeatures(labelFeas);
    if (map.getZoom() >= 5 && map.getZoom() < 7) {
        FXYJ_LabelLayer_2.setVisibility(true);
        FXYJ_CircleLayer_2.setVisibility(true);
    }
    else {
        FXYJ_LabelLayer_2.setVisibility(false);
        FXYJ_CircleLayer_2.setVisibility(false);
    }
}

function FXYJ_ZoomControl() {
    if (FXYJ_SDLayer != null) {
        if (map.getZoom() < 5) {
            FXYJ_SDLayer.setVisibility(false);
            FXYJ_CircleLayer_2.setVisibility(false);
            FXYJ_LabelLayer_2.setVisibility(false);
            FXYJ_CircleLayer_1.setVisibility(true);
            FXYJ_LabelLayer_1.setVisibility(true);
            $("#Prop_Info").hide();
        }
        else if (map.getZoom() >= 5 && map.getZoom() < 7) {
            FXYJ_SDLayer.setVisibility(false);
            FXYJ_CircleLayer_1.setVisibility(false);
            FXYJ_LabelLayer_1.setVisibility(false);
            FXYJ_CircleLayer_2.setVisibility(true);
            FXYJ_LabelLayer_2.setVisibility(true);
            $("#Prop_Info").hide();
        }
        else {
            //ReDrawMarket();
            FXYJ_CircleLayer_1.setVisibility(false);
            FXYJ_LabelLayer_1.setVisibility(false);
            FXYJ_CircleLayer_2.setVisibility(false);
            FXYJ_LabelLayer_2.setVisibility(false);
            FXYJ_SDLayer.setVisibility(true);
        }
    }
}

//获取预警详情
function FXYJ_GetInfo(e) {
    var bs = e.geometry.data;
    $.ajax({
        url: "/views/xtmh/fxyj.aspx?Action=FXYJ_GetInfo",
        type: 'post',
        data: { bs: bs, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var FXYJ_Info = info.data;
            var cenx = FXYJ_Info[0].cenx;
            var ceny = FXYJ_Info[0].ceny;
            var info = FXYJ_Info[0].content;
            var point = new SuperMap.LonLat(cenx, ceny)

            var strHtml = '';
            strHtml += info;
            InfoWin_Json = { content: strHtml, point: point };
            ShowInfoWin();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mui.toast(jqXHR.responseText);
        }
    });
}

//清除风险预警
function FXYJ_ClearLayer() {
    FXYJ_CurState = 0;
    $("#FXYJ_Panal").hide();
    if (FXYJ_CircleLayer_1 != null) {
        FXYJ_CircleLayer_1.setVisibility(false);
        FXYJ_LabelLayer_1.setVisibility(false);
        FXYJ_CircleLayer_2.setVisibility(false);
        FXYJ_LabelLayer_2.setVisibility(false);
        FXYJ_SDLayer.setVisibility(false);
    }

    //if (FXYJ_CircleLayer_1 != null) {
    //    FXYJ_SDLayer.removeAllGraphics();
    //    FXYJ_CircleLayer_1.clear();
    //    FXYJ_LabelLayer_1.removeAllFeatures();
    //    FXYJ_CircleLayer_2.clear();
    //    FXYJ_LabelLayer_2.removeAllFeatures();

    //    FXYJ_CircleLayer_1 = null;
    //    FXYJ_LabelLayer_1 = null;
    //    FXYJ_CircleLayer_2 = null;
    //    FXYJ_LabelLayer_2 = null;
    //    FXYJ_SDLayer = null;
    //}
    //FXYJ_Json = [];
    //LS_FXYJ_Json = [];
    //FXYJ_Json_TJ1 = [];
    //FXYJ_Json_TJ2 = [];

    //FXYJ_CurJson = { areacode: "", yjtype: [], yjleval: [] };
    if (LSTF_SFSSTF == 1) {
        LSZH_ClearLegend();
    }
}

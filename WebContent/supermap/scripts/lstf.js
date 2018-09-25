// 台风
var PathLabel = new SuperMap.Strategy.GeoText();
PathLabel.style={
    labelAlign: "lt",
    labelXOffset: 12,
    labelYOffset: 8,
    fontColor: "#005B8A",
    fontSize: "14px",
    fill: true,
    fillColor: "#C1E4FB",
    fillOpacity: 1,
    stroke: true,
    strokeWidth: 5,
    strokeColor: "#C1E4FB",
    radius: "3px",
    fontFamily: "微软雅黑"
};
var LSTF_SFSSTF = 1;//是否实时台风 0代表是,1代表否
var LSTF_SJ = [];  //历史台风时间
var SSTF_Json = [];  //实时台风列表
var LSLJ_CurPath = [];//当前路径信息
var LSTF_PathLayer = { markerlayers: [], pathlayers: []};  //台风路径展示层
var LSTF_LabelLayer = null;
var LSTF_FCLayer = [[], []];  //历史台风风场
var LSTF_SJZ_Json = [];   //时间轴列表
var LSTF_DHLayer = null;    //动画
var LSTF_JJXLayer = null;    //警戒线
var LSTF_FQLayer = null;     //风圈
var TFLJ_BFLB_Json = [];   
var TFLJ_DrawBFInfo = { type: 0, cursx: 0, bfzt: 0 };
window.setTimeout("LSTF_Init()",1000);
function LSTF_Init() {
    LSTF_LabelLayer = new SuperMap.Layer.Vector("LSTF_LabelLayer", { strategies: [PathLabel] });
    LSTF_DHLayer = new SuperMap.Layer.Markers("LSTF_DHLayer");    //动画
    LSTF_JJXLayer = new SuperMap.Layer.Vector("LSTF_JJXLayer");    //警戒线
    LSTF_FQLayer = new SuperMap.Layer.Vector("LSTF_FQLayer");     //风圈
    map.addLayers([LSTF_DHLayer, LSTF_JJXLayer, LSTF_FQLayer, LSTF_LabelLayer]);
    var LayerDiv = LSTF_LabelLayer.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = LSTF_DHLayer.div;
    $(LayerDiv).css({ zIndex: 1600 });
    LayerDiv = LSTF_JJXLayer.div;
    $(LayerDiv).css({ zIndex: 1500 });
    LayerDiv = LSTF_FQLayer.div;
    $(LayerDiv).css({ zIndex: 1600 });
}


function LSTF_Draw_JJX() {
    var polypoint_1 = [
  new SuperMap.Geometry.Point(127, 34),
  new SuperMap.Geometry.Point(127, 22),
  new SuperMap.Geometry.Point(119, 17.99),
        new SuperMap.Geometry.Point(119, 11),
  new SuperMap.Geometry.Point(113, 4.5),
  new SuperMap.Geometry.Point(105, 0)
    ];

    var polyline_1 = new SuperMap.Geometry.LineString(polypoint_1);
    var line1Vector = new SuperMap.Feature.Vector(polyline_1);
    line1Vector.style = {
        strokeColor: "#FBF00A",
        strokeWidth: 1,
        label: "24\n小\n时\n台\n风\n警\n戒\n线",
        labelXOffset: 0,
        labelYOffset: -120,
        //labelAlign: "lm",
        fontColor: "#FBF00A"
    };

    var polypoint_2 = [
  new SuperMap.Geometry.Point(132.000122, 34.000122),
  new SuperMap.Geometry.Point(132.000122, 15.000122),
  new SuperMap.Geometry.Point(120.000122, 0),
        new SuperMap.Geometry.Point(105.000122, 0)
    ];
    var polyline_2 = new SuperMap.Geometry.LineString(polypoint_2);
    var line2Vector = new SuperMap.Feature.Vector(polyline_2);
    line2Vector.style = {
        strokeColor: "#0F12FD",
        strokeWidth: 1,
        label: "48\n小\n时\n台\n风\n警\n戒\n线",
        labelXOffset: 0,
        labelYOffset: -120,
        fontColor: "#0F12FD"
    };

    LSTF_JJXLayer.addFeatures([line1Vector, line2Vector]);
}
//初始化历史台风查询时间
LSTF_SJ_Init();
function LSTF_SJ_Init() {
    LSTF_SJ = [];
    for (var i = 2016; i >= 1949; i--) {
        LSTF_SJ.push({text:i.toString()});
    }
    mini.get("LSTF_SJ").setData(LSTF_SJ);
    mini.get("SJZ_KSSJ").setData(LSTF_SJ);
    mini.get("SJZ_JZSJ").setData(LSTF_SJ);
    mini.get("SJZ_KSSJ").setValue("2006");
    mini.get("SJZ_JZSJ").setValue("2016");
}

function LSLJ_GetList() {
    var qsj = mini.get("LSTF_SJ").getValue();
    var qname = mini.get("LSTF_Name").getValue();
    var gjdq = mini.get("LSTF_TJDQ").getValue();
    if (qsj == "" && qname == ""&&gjdq=="") {
        mini.get("LSTF_SJ").select(0);
        qsj = LSTF_SJ[0].text;
    }

    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_QueryTFList",
        type: 'post',
        data: { qsj: qsj, qname: qname, gjdq: gjdq, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var TF_Json = info.data;
            var strHtml = "";
            var strHtml_tfyj = "";
            for (var i = 0; i < TF_Json.length; i++) {
                var bh = TF_Json[i].numNati;
                var name = TF_Json[i].typhName;
                strHtml += '<label class="MH_label MH_label_4"><input class="MH_radio LSTF_Path" value ="' + bh + "|" + name + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + bh + "[" + name + "]" + '</label>';
            }
            $("#ZHLS_LSTF_List").html(strHtml);

            $(".LSTF_Path").click(function () {
                TFLJ_DrawBFInfo = { type: 0, cursx: 0, bfzt: 0 };
                $("#TFLJ_BFControl").attr("src", "/images/lstf/开始.png");
                $("#TFLJ_Node").find("img").attr("src", "/images/lstf/pot_lb.png");

                var val = $(this).attr('value').split("|")[0];
                var name = $(this).attr('value').split("|")[1];
                var state = $(this).is(':checked');
                if (state == true) {
                    LSLJ_CurPath.push({ tfbm: val,name:name,sj:"", path: [],info:"" });
                    var mlayer = new SuperMap.Layer.Markers("markerlayers");
                    var player = new SuperMap.Layer.Vector("pathlayers");
                    LSTF_PathLayer.markerlayers.push(mlayer);
                    LSTF_PathLayer.pathlayers.push(player);
                    map.addLayers([mlayer, player]);
                    var LayerDiv = mlayer.div;
                    $(LayerDiv).css({ zIndex: 1800 });
                    LayerDiv = player.div;
                    $(LayerDiv).css({ zIndex: 1500 });
                    LSLJ_GetInfo(val);
                }
                else {
                    for (var i = LSLJ_CurPath.length - 1; i >= 0; i--){
                        if (val == LSLJ_CurPath[i].tfbm) {
                            map.removeLayer(LSTF_PathLayer.markerlayers[i]);
                            map.removeLayer(LSTF_PathLayer.pathlayers[i]);
                            LSTF_PathLayer.markerlayers.splice(i, 1);
                            LSTF_PathLayer.pathlayers.splice(i, 1);
                            LSTF_LabelLayer.removeFeatures(LSTF_LabelLayer.features[i]);
                            LSLJ_CurPath.splice(i, 1);

                            if (LSTF_FCLayer[0][i] != "") {
                                try{map.removeLayer(LSTF_FCLayer[0][i], false);}catch(ex){}
                            }
                            LSTF_FCLayer[0].splice(i, 1);
                            LSTF_FCLayer[1].splice(i, 1);
                            break;
                        }
                    }
                    if (LSLJ_CurPath.length > 0) {
                        LSLJ_ReDrawInfo(LSLJ_CurPath.length - 1);
                        var pathxh = LSLJ_CurPath.length - 1;
                        var xh = LSLJ_CurPath[pathxh].path.length - 1;
                        var PathInfo = LSLJ_CurPath[pathxh].path[xh];
                        var lonlat = new SuperMap.LonLat(PathInfo["lon"], PathInfo["lat"]);

                        TFLJ_DrawFQ(lonlat);
                    }
                    if (LSLJ_CurPath.length == 0) {
                        LSTF_DHLayer.clearMarkers();
                        LSTF_FQLayer.removeAllFeatures();
                        $("#LSTFInfo_Panal").hide();
                    }
                    //TFLJ_DrawNode();
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

function SSLJ_GetList() {
    if (SSTF_Json.length == 0) {
        $.ajax({
            url: "/views/xtmh/lstf.aspx?Action=Get_QuerySSTFList",
            type: 'post',
            data: { qsj: "", qname: "", seccode: U_Token },
            cache: false,
            success: function (text) {
                var info = eval("(" + text + ")");
                SSTF_Json = info.data;
                var strHtml_tfyj = "";
                for (var i = 0; i < SSTF_Json.length; i++) {
                    var bh = SSTF_Json[i].numNati;
                    var name = SSTF_Json[i].typhName;
                    strHtml_tfyj += '<label class="MH_label MH_label_5"><input class="MH_radio LSTF_Path" value ="' + bh + "|" + name + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + bh + "[" + name + "]" + '</label>';
                }
                $("#ZHYJ_TFYJ_Con").html(strHtml_tfyj);

                $(".LSTF_Path").click(function () {
                    TFLJ_DrawBFInfo = { type: 0, cursx: 0, bfzt: 0 };
                    $("#TFLJ_BFControl").attr("src", "/images/lstf/开始.png");
                    $("#TFLJ_Node").find("img").attr("src", "/images/lstf/pot_lb.png");

                    var val = $(this).attr('value').split("|")[0];
                    var name = $(this).attr('value').split("|")[1];
                    var state = $(this).is(':checked');
                    if (state == true) {
                        LSLJ_CurPath.push({ tfbm: val, name: name, sj: "", path: [], info: "" });
                        var mlayer = new SuperMap.Layer.Markers("markerlayers");
                        var player = new SuperMap.Layer.Vector("pathlayers");
                        LSTF_PathLayer.markerlayers.push(mlayer);
                        LSTF_PathLayer.pathlayers.push(player);
                        map.addLayers([mlayer, player]);
                        var LayerDiv = mlayer.div;
                        $(LayerDiv).css({ zIndex: 1800 });
                        LayerDiv = player.div;
                        $(LayerDiv).css({ zIndex: 1500 });
                        SSLJ_GetInfo(val);
                    }
                    else {
                        for (var i = LSLJ_CurPath.length - 1; i >= 0; i--) {
                            if (val == LSLJ_CurPath[i].tfbm) {
                                map.removeLayer(LSTF_PathLayer.markerlayers[i]);
                                map.removeLayer(LSTF_PathLayer.pathlayers[i]);
                                LSTF_PathLayer.markerlayers.splice(i, 1);
                                LSTF_PathLayer.pathlayers.splice(i, 1);
                                LSTF_LabelLayer.removeFeatures(LSTF_LabelLayer.features[i]);
                                LSLJ_CurPath.splice(i, 1);
                            }
                        }
                        if (LSLJ_CurPath.length > 0) {
                            LSLJ_ReDrawInfo(LSLJ_CurPath.length - 1);
                            var pathxh = LSLJ_CurPath.length - 1;
                            var xh = LSLJ_CurPath[pathxh].path.length - 1;
                            var PathInfo = LSLJ_CurPath[pathxh].path[xh];
                            var lonlat = new SuperMap.LonLat(PathInfo["lon"], PathInfo["lat"]);
                            TFLJ_DrawFQ(lonlat);
                        }
                        if (LSLJ_CurPath.length == 0) {
                            LSTF_DHLayer.clearMarkers();
                            LSTF_FQLayer.removeAllFeatures();
                            $("#LSTFInfo_Panal").hide();
                        }
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                mini.alert(jqXHR.responseText);
            }
        });
    }
}


//历史路径
function LSLJ_GetInfo(bm) {
    LSTF_SFSSTF = 0;
    var a7_b1, a7_r1, a7_b2, a7_r2, a7_b3, a7_r3, a7_b4, a7_r4, a10_b1, a10_r1, a10_b2, a10_r2, a10_b3, a10_r3, a10_b4, a10_r4, a12_b1, a12_r1, a12_b2, a12_r2, a12_b3, a12_r3, a12_b4, a12_r4;
    var R_a7 = [], R_a10 = [], R_a12 = [];
    var R_7J_Min = 0, R_7J_Max = 0, R_10J_Min = 0, R_10J_Max = 0, R_12J_Min = 0, R_12J_Max = 0;
    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_TFInfo",
        type: 'post',
        data: { bm: bm, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var TF_Info = info.data;
            var JY_Info = info.tfxx[0];
            var strHtml = "";
            var pointArray = [];
            var pathxh = LSLJ_CurPath.length - 1;
            var ArrLng = [];
            var ArrLat = [];
            for (var i = 0; i < TF_Info.length; i++) {

                var sj = TF_Info[i].sj;
                if (i == 0) {
                    LSLJ_CurPath[pathxh].sj = sj;
                }
                var lon = TF_Info[i].lon;
                var lat = TF_Info[i].lat;
                var fs = TF_Info[i].fs;
                var zxqy = TF_Info[i].zxqy;
                
                LSLJ_CurPath[pathxh].path.push({ lon: lon, lat: lat, sj: sj, fs: fs, zxqy: zxqy });
                ArrLng.push(lon);
                ArrLat.push(lat);
            }
            strHtml = '<tr><td style="width:50%;padding-left:10px;text-align:left;">起始时间</td><td style="width:50%;text-align:right;padding-right:10px;">' + JY_Info.QSSJ + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">终止时间</td><td style="width:50%;text-align:right;padding-right:10px;">' + JY_Info.JSSJ + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">中心气压极值</td><td style="width:50%;text-align:right;padding-right:10px;">' + JY_Info.P0_Min + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">最大风速极值</td><td style="width:50%;text-align:right;padding-right:10px;">' + JY_Info.MWS_Max + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">瞬时热带气旋强度</td><td style="width:50%;text-align:right;padding-right:10px;">' + JY_Info.I_CN + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">副中心</td><td style="width:50%;text-align:right;padding-right:10px;">' + JY_Info.Dual_C + '</td></tr>';
            LSLJ_CurPath[pathxh].info = strHtml;
           
            var left = 0, bottom = 0, right = 0, top = 0;
            left = Math.min.apply(null, ArrLng);
            right = Math.max.apply(null, ArrLng);
            bottom = Math.min.apply(null, ArrLat);
            top = Math.max.apply(null, ArrLat);
            left1 = 1.5 * left - 0.5 * right;
            right1 = 1.5 * right - 0.5 * left;
            top1 = 1.5 * top - 0.5 * bottom;
            bottom1 = 1.5 * bottom - 0.5 * top;
            var bounds = new SuperMap.Bounds(left1, bottom1, right1, top1);
            map.zoomToExtent(bounds, true);

            LSLJ_ReDrawInfo(pathxh);
            LSLJ_DrawPath(0, pathxh);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}


//实时路径lqk
function SSLJ_GetInfo(bm) {
    LSTF_SFSSTF = 0;
    var a7_b1,a7_r1,a7_b2,a7_r2,a7_b3,a7_r3,a7_b4,a7_r4,a10_b1,a10_r1,a10_b2,a10_r2,a10_b3,a10_r3,a10_b4,a10_r4,a12_b1,a12_r1,a12_b2,a12_r2,a12_b3,a12_r3,a12_b4,a12_r4;
    var R_a7 = [], R_a10 = [], R_a12 = [];
    var R_7J_Min = 0, R_7J_Max = 0, R_10J_Min = 0, R_10J_Max = 0, R_12J_Min = 0, R_12J_Max = 0;
    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_SSTFInfo",
        type: 'post',
        data: { bm: bm, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var TF_Info = info.data;
            var strHtml = "";
            var pointArray = [];
            var pathxh = LSLJ_CurPath.length - 1;
            var ArrFS = [];
            var ArrZXQY = [];
            var QSSJ = "";
            var JSSJ = "";
            var ArrLng = [];
            var ArrLat = [];
            for (var i = 0; i < TF_Info.length; i++) {
                var sj = TF_Info[i].sj.substr(0, 16).replace(/T/, ' ');
                if (i == 0) {
                    LSLJ_CurPath[pathxh].sj = sj;
                    QSSJ = sj;
                }
                if (i == TF_Info.length - 1) {
                    JSSJ = sj;
                }
                var lon = TF_Info[i].lon;
                var lat = TF_Info[i].lat;
                var fs = TF_Info[i].fs;
                ArrFS.push(fs);
                var zxqy = TF_Info[i].zxqy;
                ArrFS.push(fs);
                ArrZXQY.push(zxqy);
                R_a7 = [], R_a10 = [], R_a12 = [];
                R_a7 = [TF_Info[i].a7_r1, TF_Info[i].a7_r2, TF_Info[i].a7_r3, TF_Info[i].a7_r4];
                R_a10 = [TF_Info[i].a10_r1, TF_Info[i].a10_r2, TF_Info[i].a10_r3, TF_Info[i].a10_r4];
                R_a12 = [TF_Info[i].a12_r1, TF_Info[i].a12_r2, TF_Info[i].a12_r3, TF_Info[i].a12_r4];
                R_7J_Min = Math.min.apply(null, R_a7); R_7J_Max = Math.max.apply(null, R_a7);
                R_10J_Min = Math.min.apply(null, R_a10); R_10J_Max = Math.max.apply(null, R_a10);
                R_12J_Min = Math.min.apply(null, R_a12); R_12J_Max = Math.max.apply(null, R_a12);
                var bj_7 = "";
                if (R_7J_Min > 10000) {
                    bj_7 = "";
                }
                else {
                    bj_7 = R_7J_Min + "-" + R_7J_Max + "公里";
                }
                var bj_10 = "";
                if (R_10J_Min > 10000) {
                    bj_10 = "";
                }
                else {
                    bj_10 = R_10J_Min + "-" + R_10J_Max + "公里";
                }
                var bj_12 = "";
                if (R_12J_Min > 10000) {
                    bj_12 = "";
                }
                else {
                    bj_12 = R_12J_Min + "-" + R_12J_Max + "公里";
                }
                var ArrFQInfo = [];
                
                if (TF_Info[i].a7_r1 < 1000) { ArrFQInfo.push(TF_Info[i].a7_r1); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a7_r2 < 1000) { ArrFQInfo.push(TF_Info[i].a7_r2); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a7_r3 < 1000) { ArrFQInfo.push(TF_Info[i].a7_r3); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a7_r4 < 1000) { ArrFQInfo.push(TF_Info[i].a7_r4); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a10_r1 < 1000) { ArrFQInfo.push(TF_Info[i].a10_r1); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a10_r2 < 1000) { ArrFQInfo.push(TF_Info[i].a10_r2); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a10_r3 < 1000) { ArrFQInfo.push(TF_Info[i].a10_r3); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a10_r4 < 1000) { ArrFQInfo.push(TF_Info[i].a10_r4); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a12_r1 < 1000) { ArrFQInfo.push(TF_Info[i].a12_r1); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a12_r2 < 1000) { ArrFQInfo.push(TF_Info[i].a12_r2); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a12_r3 < 1000) { ArrFQInfo.push(TF_Info[i].a12_r3); } else { ArrFQInfo.push(0); }
                if (TF_Info[i].a12_r4 < 1000) { ArrFQInfo.push(TF_Info[i].a12_r4); } else { ArrFQInfo.push(0); }
                LSLJ_CurPath[pathxh].path.push({ lon: lon, lat: lat, sj: sj, fs: fs, zxqy: zxqy, bj_7: bj_7, bj_10: bj_10, bj_12: bj_12, ArrFQInfo: ArrFQInfo });
                ArrLng.push(lon);
                ArrLat.push(lat);
            }
            var zdfs = Math.max.apply(null, ArrFS);
            var zdqy = Math.max.apply(null, ArrZXQY);
            strHtml = '<tr><td style="width:50%;padding-left:10px;text-align:left;">起始时间</td><td style="width:50%;text-align:right;padding-right:10px;">' + QSSJ + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">终止时间</td><td style="width:50%;text-align:right;padding-right:10px;">' + JSSJ + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">中心气压极值</td><td style="width:50%;text-align:right;padding-right:10px;">' + zdqy + '</td></tr>';
            strHtml += '<tr><td style="width:50%;padding-left:10px;text-align:left;">最大风速极值</td><td style="width:50%;text-align:right;padding-right:10px;">' + zdfs + '</td></tr>';
            LSLJ_CurPath[pathxh].info = strHtml;

            var xh = LSLJ_CurPath[pathxh].path.length - 1;
            var PathInfo = LSLJ_CurPath[pathxh].path[0];
            var B_PathInfo = LSLJ_CurPath[pathxh].path[xh - 1];

            var left = 0, bottom = 0, right = 0, top = 0;
            left = Math.min.apply(null, ArrLng);
            right = Math.max.apply(null, ArrLng);
            bottom = Math.min.apply(null, ArrLat);
            top = Math.max.apply(null, ArrLat);
            left1 = 1.5 * left - 0.5 * right;
            right1 = 1.5 * right - 0.5 * left;
            top1 = 1.5 * top - 0.5 * bottom;
            bottom1 = 1.5 * bottom - 0.5 * top;
            var bounds = new SuperMap.Bounds(left1, bottom1, right1, top1);
            map.zoomToExtent(bounds, true);
            LSLJ_ReDrawInfo(pathxh);
            LSLJ_DrawPath(0, pathxh);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

//重绘台风信息
function LSLJ_ReDrawInfo(xh) {
    var txt = LSLJ_CurPath[xh].tfbm + "(" + LSLJ_CurPath[xh].name + ")";
    $("#LSTFInfo_Head span").html(txt);
    $("#LSTF_Info").html(LSLJ_CurPath[xh].info);
    $("#LSTFInfo_Panal").show();
    var val = $("#TFSJZDiv").is(":hidden");
    if (val == false) {
        $("#LSTFInfo_Panal").css("top", JMObjH - 327);
        $("#LSTFInfo_Panal").css("left", JMObjW - 244);
    }
    else {
        $("#LSTFInfo_Panal").css("top", JMObjH - 127);
        $("#LSTFInfo_Panal").css("left", 257);
    }
}

//绘制台风动画lqk
function TFLJ_DrawFQ(lonlat) {
    LSTF_DHLayer.clearMarkers();
    var size = new SuperMap.Size(40, 40);
    var offset = new SuperMap.Pixel(-20, -20);
    var dhIcon = new SuperMap.Icon('/images/lstf/tf_fy.gif', size, offset);
    var dhMarker = new SuperMap.Marker(lonlat, dhIcon);
    LSTF_DHLayer.addMarker(dhMarker);
}

//绘制台风路径(其中的一步lqk)
function LSLJ_DrawPath(xh, pathxh) {
    if (TFLJ_DrawBFInfo.bfzt == 1) {
        return;
    }
    var PathInfo = LSLJ_CurPath[pathxh].path[xh];
    var lonlat = new SuperMap.LonLat(PathInfo["lon"], PathInfo["lat"]);
    var fs = PathInfo["fs"];
    var tb = "";
    if (parseFloat(fs) < 0.3) {
        tb = "/images/lstf/pot_0.png"
    }
    if (parseFloat(fs) >= 0.3 && parseFloat(fs) < 1.6) {
        tb = "/images/lstf/pot_1.png"
    }
    if (parseFloat(fs) >= 1.6 && parseFloat(fs) < 3.5) {
        tb = "/images/lstf/pot_2.png"
    }
    if (parseFloat(fs) >= 3.5 && parseFloat(fs) < 5.5) {
        tb = "/images/lstf/pot_3.png"
    }
    if (parseFloat(fs) >= 5.5 && parseFloat(fs) < 8) {
        tb = "/images/lstf/pot_4.png"
    }
    if (parseFloat(fs) >= 8 && parseFloat(fs) < 10.8) {
        tb = "/images/lstf/pot_5.png"
    }
    if (parseFloat(fs) >= 10.8 && parseFloat(fs) < 13.9) {
        tb = "/images/lstf/pot_6.png"
    }
    if (parseFloat(fs) >= 13.9 && parseFloat(fs) < 17.2) {
        tb = "/images/lstf/pot_7.png"
    }
    if (parseFloat(fs) >= 17.2 && parseFloat(fs) < 20.8) {
        tb = "/images/lstf/pot_8.png"
    }
    if (parseFloat(fs) >= 20.8 && parseFloat(fs) < 24.5) {
        tb = "/images/lstf/pot_9.png"
    }
    if (parseFloat(fs) >= 24.5 && parseFloat(fs) < 28.5) {
        tb = "/images/lstf/pot_10.png"
    }
    if (parseFloat(fs) >= 28.5 && parseFloat(fs) < 32.7) {
        tb = "/images/lstf/pot_11.png"
    }
    if (parseFloat(fs) >= 32.7 && parseFloat(fs) < 37.0) {
        tb = "/images/lstf/pot_12.png"
    }
    if (parseFloat(fs) >= 37.0 && parseFloat(fs) < 41.5) {
        tb = "/images/lstf/pot_13.png"
    }
    if (parseFloat(fs) >= 41.5 && parseFloat(fs) < 46.2) {
        tb = "/images/lstf/pot_14.png"
    }
    if (parseFloat(fs) >= 46.2 && parseFloat(fs) < 51) {
        tb = "/images/lstf/pot_15.png"
    }
    if (parseFloat(fs) >= 51 && parseFloat(fs) < 56.1) {
        tb = "/images/lstf/pot_16.png"
    }
    if (parseFloat(fs) >= 56.1 && parseFloat(fs) < 60.3) {
        tb = "/images/lstf/pot_17.png"
    }
    if (parseFloat(fs) >= 60.3) {
        tb = "/images/lstf/pot_18.png"
    }

    var size = new SuperMap.Size(16, 16);
    var offset = new SuperMap.Pixel(-8, -8);
    var myIcon = new SuperMap.Icon(tb, size, offset);
    var Marker = new SuperMap.Marker(lonlat, myIcon);
    Marker.Data = PathInfo;
    TFLJ_DrawFQ(lonlat);
    if (xh == 0) {
        if (LSTF_JJXLayer.features.length==0)
        {
            LSTF_Draw_JJX();
        }

        var txt = LSLJ_CurPath[pathxh].tfbm + "(" + LSLJ_CurPath[pathxh].name + ")";
        var x0 = lonlat.lon;
        var y0 = lonlat.lat;
        var geoText = new SuperMap.Geometry.GeoText(x0, y0, txt);
        var geotextFeature = new SuperMap.Feature.Vector(geoText);
        LSTF_LabelLayer.addFeatures([geotextFeature]);

        LSZH_AddLegend(6);
    }
    if (xh > 0) {
        var B_PathInfo = LSLJ_CurPath[pathxh].path[xh-1];
        var B_lonlat = new SuperMap.Geometry.Point(B_PathInfo["lon"], B_PathInfo["lat"]);
        var A_lonlat = new SuperMap.Geometry.Point(lonlat.lon, lonlat.lat);
        var polypoint_1 = [B_lonlat, A_lonlat];
        var polyline_1 = new SuperMap.Geometry.LineString(polypoint_1);
        var line1Vector = new SuperMap.Feature.Vector(polyline_1);
        line1Vector.style = {
            strokeColor: "#A2B0CC",
            strokeWidth: 2
        };
        LSTF_PathLayer.pathlayers[pathxh].addFeatures([line1Vector]);
    }

    Marker.events.on({
        "mouseover": function (e) {
            var marker = this;
            var Info = marker.Data;
            var strHtml = '<div class="Info_WinCon" style="overflow-x:hidden;overflow-y:auto;">';
            strHtml += "<table name='TFInfo'>";
            strHtml += '<tr><td name="col1">过去时间</td><td>' + Info["sj"].substr(0, 13) + '</td></tr>';
            strHtml += '<tr><td name="col1">中心位置</td><td>' + Info["lon"] + "N " + Info["lat"] + 'E</td></tr>';
            strHtml += '<tr><td name="col1">最大风速</td><td>' + Info["fs"] + '米/秒</td></tr>';
            strHtml += '<tr><td name="col1">中心气压</td><td>' + Info["zxqy"] + '百帕</td></tr>';
            if (Info["bj_7"] != undefined) {
                strHtml += '<tr><td name="col1">七级风圈半径</td><td>' + Info["bj_7"] + '</td></tr>';
            }
            if (Info["bj_10"] != undefined) {
                strHtml += '<tr><td name="col1">十级风圈半径</td><td>' + Info["bj_10"] + '</td></tr>';
            }
            if (Info["bj_12"] != undefined) {
                strHtml += '<tr><td name="col1">十二级风圈半径</td><td>' + Info["bj_12"] + '</td></tr>';
            }
            var point = new SuperMap.LonLat(parseFloat(Info["lon"]), parseFloat(Info["lat"]));
            strHtml += '</table></div>';
            InfoWin_Json = { content: strHtml, point: point };
            ShowInfoWin();
            if (Info.ArrFQInfo != undefined) {
                DrawSector(Info.ArrFQInfo, point);
            }
        },
        "scope": Marker
    });
    Marker.events.on({
        "mouseout": function (e) {
            $("#Prop_Info").hide();
        }
    });
    LSTF_PathLayer.markerlayers[pathxh].addMarker(Marker);

    if (xh < LSLJ_CurPath[pathxh].path.length - 1) {
        setTimeout(function () { LSLJ_DrawPath(xh + 1, pathxh) }, 100);
    }

    if (xh == LSLJ_CurPath[pathxh].path.length - 1) {
        if (TFLJ_DrawBFInfo.type == 1) {
            if (TFLJ_DrawBFInfo.cursx < TFLJ_BFLB_Json.length - 1) {
                TFLJ_DrawBFInfo.cursx += 1;
                LSLJ_DrawPath(0, TFLJ_BFLB_Json[TFLJ_DrawBFInfo.cursx].xh);
            }
            else if (TFLJ_DrawBFInfo.cursx == TFLJ_BFLB_Json.length - 1) {
                $("#TFLJ_BFControl").attr("src", "/images/lstf/开始.png");
                $("#TFLJ_Node").find("img").attr("src", "/images/lstf/pot_lb.png");
            }
        }
        if (TFLJ_DrawBFInfo.type == 0) {
            TFLJ_DrawFC(LSLJ_CurPath[pathxh].tfbm);
        }
    }
}


//叠加风场
function TFLJ_DrawFC(FCName) {
    var Name = "T" + FCName;
    var url = mapurl + "/iserver/services/map-Typhoon_3s/rest/maps/" + Name;
    var FCLayer = new SuperMap.Layer.TiledDynamicRESTLayer(Name, url, { transparent: true, cacheEnabled: true });
    LSTF_FCLayer[0].push("");
    LSTF_FCLayer[1].push(Name);
    var xh = LSTF_FCLayer[0].length;
    FCLayer.events.on({
        "layerInitialized": function (evt) {
            LSTF_FCLayer[0][xh - 1] = FCLayer;
            map.addLayers([FCLayer]);
            var LayerDiv = FCLayer.div;
            $(LayerDiv).css({ zIndex: 500 });
            $(LayerDiv).attr("name", "FCLayer");
        }
    });
}

//绘制风圈
function DrawSector(ArrFQInfo, Point) {
    LSTF_FQLayer.removeAllFeatures();
    var ArrColor = [
        [0, 90, "#00B00F",0.8, "#00B00F",0.3,"七级风圈半径","东北","lb"],
        [90, 180, "#00B00F", 0.8, "#00B00F", 0.3, "", "东南", "rb"],
        [180, 270, "#00B00F", 0.8, "#00B00F", 0.3, "", "西南", "rb"],
        [270, 360, "#00B00F", 0.8, "#00B00F", 0.3, "", "西北", "lb"],
        [0, 90, "#F8D500", 0.8, "#F8D500", 0.2, "十级风圈半径", "东北", "lm"],
        [90, 180, "#F8D500", 0.8, "#F8D500", 0.2, "", "东南", "rm"],
        [180, 270, "#F8D500", 0.8, "#F8D500", 0.2, "", "西南", "rm"],
        [270, 360, "#F8D500", 0.8, "#F8D500", 0.2, "", "西北", "lm"],
        [0, 90, "#FF0000", 0.8, "#FF0000", 0.2, "十二级风圈半径", "东北", "cm"],
        [90, 180, "#FF0000", 0.8, "#FF0000", 0.2, "", "东南", "cm"],
        [180, 270, "#FF0000", 0.8, "#FF0000", 0.2, "", "西南", "cm"],
        [270, 360, "#FF0000", 0.8, "#FF0000", 0.2, "", "西北", "cm"]
    ];
    var dwjl = GetDistance(Point.lon, Point.lat, Point.lon + 1, Point.lat);
    for (var i = 0; i < ArrFQInfo.length; i++) {
        if (ArrFQInfo[i] != 0) {
            var origion = new SuperMap.Geometry.Point(Point.lon, Point.lat);
            var sides = 30;
            var bj = (parseFloat(ArrFQInfo[i]) * 1000) / dwjl;
            var cuvre = SuperMap.Geometry.Polygon.createRegularPolygonCurve(origion, bj, sides, 90, ArrColor[i][0]);
            var cuvreVector = new SuperMap.Feature.Vector(cuvre);
            if (i % 4 != 0) {
                var XH_0 = Math.floor(i / 4) * 4;
                var XH_1 = Math.floor(i / 4) * 4 + 1;
                var XH_2 = Math.floor(i / 4) * 4 + 2;
                var XH_3 = Math.floor(i / 4) * 4 + 3;
                if ((ArrFQInfo[XH_0] == ArrFQInfo[XH_1]) && (ArrFQInfo[XH_1] == ArrFQInfo[XH_2]) &&(ArrFQInfo[XH_2] == ArrFQInfo[XH_3])) {
                    cuvreVector.style = {
                        strokeColor: ArrColor[i][2],
                        fillColor: ArrColor[i][4],
                        strokeWidth: 0,
                        fillOpacity: ArrColor[i][5]
                    };
                }
                else {
                    cuvreVector.style = {
                        strokeColor: ArrColor[i][2],
                        fillColor: ArrColor[i][4],
                        strokeWidth: 0,
                        fillOpacity: ArrColor[i][5],
                        label: ArrColor[i][6] + "\n" + ArrFQInfo[i].toString() + "km",
                        labelXOffset: 0,
                        labelYOffset: 0,
                        labelAlign: ArrColor[i][8],
                        //fontColor: "#89D624"
                        fontColor: "#FFF0F5"
                    };
                }
            }
            else {
                cuvreVector.style = {
                    strokeColor: ArrColor[i][2],
                    fillColor: ArrColor[i][4],
                    strokeWidth: 0,
                    fillOpacity: ArrColor[i][5],
                    label: ArrColor[i][6] + "\n" + ArrFQInfo[i].toString() + "km",
                    labelXOffset: 0,
                    labelYOffset: 0,
                    labelAlign: ArrColor[i][8],
                    //fontColor: "#89D624"
                    fontColor: "#FFF0F5"
                };
            }
            LSTF_FQLayer.addFeatures([cuvreVector]);

        }
    }
}


function LSTF_ClearLayer() {
    LSTF_SFSSTF = 1;
    $("#Prop_Info").hide();
    $("#ZHLS_LSTF_List").html("");
    $("#ZHYJ_TFYJ_Con input[type='checkbox']").each(function () {
        if (this.checked) {
            this.checked = false;
        }
    });
    //$("#ZHYJ_TFYJ_Con").html("");

    for (var i = LSLJ_CurPath.length - 1; i >= 0; i--) {
        map.removeLayer(LSTF_PathLayer.markerlayers[i]);
        map.removeLayer(LSTF_PathLayer.pathlayers[i]);
        LSTF_PathLayer.markerlayers.splice(i, 1);
        LSTF_PathLayer.pathlayers.splice(i, 1);

        LSTF_LabelLayer.removeAllFeatures();
        
        LSLJ_CurPath.splice(i, 1);
    }
    $("#map div[name='FCLayer']").prop('outerHTML', '');
    LSTF_FCLayer = [[],[]];
    LSTF_DHLayer.clearMarkers();
    LSTF_JJXLayer.removeAllFeatures();
    LSTF_FQLayer.removeAllFeatures();
    //LSTF_FQLayer.refresh();

    LSLJ_CurPath = [];//当前路径
    TFLJ_BFLB_Json = [];
    TFLJ_DrawBFInfo = { type: 0, cursx: 0, bfzt: 0 };
    LSTF_SJZ_Json = [];   //时间轴列表

    $("#LSTFInfo_Panal").hide();
    $("#TFSJZDiv").hide();
}

//获取历史台风时间轴查询列表
function LSSJZ_GetList() {
    var qssj = mini.get("SJZ_KSSJ").getValue();
    var jssj = mini.get("SJZ_JZSJ").getValue();
    var qname = mini.get("SJZ_Name").getValue();
    var gjdq = mini.get("SJZ_TJDQ").getValue();
    if ((qssj == "" && jssj == "" && name == "" && gjdq == "") || (qssj > jssj)) {
        mini.alert("请设置条件，且终止时间需大于起始时间!");
        return;
    }

    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_QuerySJZList",
        type: 'post',
        data: { qssj: qssj, jssj: jssj, qname: qname, gjdq: gjdq, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var LSTF_SJZ_Json = info.data;
            var SJZInfo = [];
            var maxyear = 0, maxmouth = 0, maxday = 0, maxhour = 0;
            var minyear = 0, minmouth = 0, minday = 0, minhour = 0;
            var arryear = [], arrmouth = [], arrday = [], arrhour = [];
            for (var i = 0; i < LSTF_SJZ_Json.length; i++) {
                var Obj = LSTF_SJZ_Json[i];
                var year = parseInt(LSTF_SJZ_Json[i].UTC_YR0);
                var mouth = parseInt(LSTF_SJZ_Json[i].UTC_MON0);
                var day = parseInt(LSTF_SJZ_Json[i].UTC_DAY0);
                var hour = parseInt(LSTF_SJZ_Json[i].UTC_HR0);
                arryear.push(year);
                arrmouth.push(mouth);
                arrday.push(day);
                var val = parseFloat(LSTF_SJZ_Json[i].I_CN);
                SJZInfo.push([
                    new Date(year, mouth, day, hour),
                    val, val, LSTF_SJZ_Json[i].Name, LSTF_SJZ_Json[i].BH
                ]);
            }
            maxyear = Math.max.apply(null, arryear);
            minyear = Math.min.apply(null, arryear);

            //SJZInfo.push([
            //        new Date((parseInt(minyear) - 1), 6, 1, 1),
            //        1.5, 1.5, "", ""
            //]);
            //SJZInfo.push([
            //        new Date((parseInt(maxyear) + 1), 11, 1, 1),
            //        1.5, 1.5, "", ""
            //]);

            Chart_TFSJZ.clear();
            var option_sjz = {
                backgroundColor: '#e3e6eb',
                title: {
                    text: '历史台风时序/等级分布',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        show: true,
                        type: 'cross',
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                dataZoom: {
                    show: true,
                    start: 0,
                    end: 100,
                    height: 30
                },
                dataRange: {
                    min: 0,
                    max: 6,
                    orient: 'vertical',
                    y: 30,
                    x: 'left',
                    itemGap: 2,
                    splitNumber: 10,
                    splitList: [
                        //{ start: 9, end: 9, label: '9-变性(热带气旋变温带气旋)', color: '#C1232B' },
                        //{ start: 8, end: 8, label: '8---', color: '#C73428' }, { start: 7, end: 7, label: '7---', color: '#CD4725' },
                        { start: 6, end: 6, label: '6-超强台风(SuperTY,>=51.0m/s)', color: '#D45A22' }, { start: 5, end: 5, label: '5-强台风(STY,41.5-50.9m/s)', color: '#DA6D1F' },
                        { start: 4, end: 4, label: '4-台风(TY,32.7-41.4m/s)', color: '#E17F1D' }, { start: 3, end: 3, label: '3-强热带风暴(STS,24.5-32.6m/s)', color: '#E89319' },
                        { start: 2, end: 2, label: '2-热带风暴(TS,17.2-24.4m/s)', color: '#EFA617' }, { start: 1, end: 1, label: '1-热带低压(TD,10.8-17.1m/s)', color: '#F6BC13' },
                        { start: 0, end: 0, label: '0-弱于热带低压或等级未知', color: '#FCCE10' }]
                },
                grid: {
                    x: 240,
                    y: 25,
                    y2: 70,
                    x2: 30
                },
                xAxis: [
                    {
                        type: 'time',
                        splitNumber: 10,
                        boundaryGap:[0.02,0.08]
                    }
                ],
                yAxis: [
                    {
                        name: '等级',
                        type: 'value',
                        show: false
                    }
                ],
                animation: false,
                series: [
                    {
                        name: '',
                        type: 'scatter',
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                var date = new Date(params.value[0]);
                                return params.value[3]
                                       + '<br/>'
                                       + date.getFullYear() + '-'
                                       + (date.getMonth() + 1) + '-'
                                       + date.getDate() + ' '
                                       + date.getHours()
                                       + '<br/>级别：'
                                       + params.value[1];
                            },
                            axisPointer: {
                                type: 'cross',
                                lineStyle: {
                                    type: 'dashed',
                                    width: 1
                                }
                            }
                        },
                        symbolSize: function (value) {
                            return 4;
                        },
                        data: SJZInfo
                    }
                ]
            };
            Chart_TFSJZ.setOption(option_sjz);
            $("#TFSJZDiv").show();
            //if (SJZInfo.length > 0) {
            //    var option = Chart_TFSJZ.getOption();
            //    option.series[0].data = SJZInfo;
            //    Chart_TFSJZ.setOption(option, true);
            //    $("#TFSJZDiv").show();
            //}
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

function SJZBF_Click(val, name) {
    LSTF_ClearLayer();
    $("#TFSJZDiv").show();
    TFLJ_DrawBFInfo = { type: 0, cursx: 0, bfzt: 0 };
    $("#TFLJ_BFControl").attr("src", "/images/lstf/开始.png");
    $("#TFLJ_Node").find("img").attr("src", "/images/lstf/pot_lb.png");

    LSLJ_CurPath.push({ tfbm: val, name: name, sj: "", path: [], info: "" });
    var mlayer = new SuperMap.Layer.Markers("markerlayers");
    var player = new SuperMap.Layer.Vector("pathlayers");
    LSTF_PathLayer.markerlayers.push(mlayer);
    LSTF_PathLayer.pathlayers.push(player);
    map.addLayers([mlayer, player]);
    var LayerDiv = mlayer.div;
    $(LayerDiv).css({ zIndex: 1800 });
    LayerDiv = player.div;
    $(LayerDiv).css({ zIndex: 1500 });
    LSLJ_GetInfo(val);
}



var ZHLS_LSTF_EditFrm = new mini.Form("ZHLS_LSTF_EditFrm");
var ZHLS_SJZ_EditFrm = new mini.Form("ZHLS_SJZ_EditFrm");
var ZHLS_DZ_EditFrm = new mini.Form("ZHLS_DZ_EditFrm");
var ZHLS_HPNSL_EditFrm = new mini.Form("ZHLS_HPNSL_EditFrm");
var ZHLS_YFQ_EditFrm = new mini.Form("ZHLS_YFQ_EditFrm");


var DZ_ZJ = [{ text: "3"}, { text: "4" }, { text: "5" }, { text: "6" }, { text: "7" }, { text: "8" }, { text: "9" }];
var DZ_SD = [{ text: "3" }, { text: "5" }, { text: "10" }, { text: "50" }, { text: "100" }, { text: "200" }, { text: "300" }, { text: "400" }, { text: "500" }];
var HPNSL_LX = [{ text: "不稳定斜坡" }, { text: "滑坡" }, { text: "地裂缝" }, { text: "地面沉降" }, { text: "崩塌" }, { text: "地面塌陷" }, { text: "泥石流" }];
var HPNSL_GM = [{ text: "小型" }, { text: "中型" }, { text: "大型" }, { text: "巨型" }];
var HPNSL_WDX = [{ text: "好" }, { text: "较差" }, { text: "差" }];
var YFQ_YFCD = [{ text: "非易发区" }, { text: "低易发区" }, { text: "中易发区" }, { text: "高易发区" }];

mini.get("DZ_ZJ1").setData(DZ_ZJ);
mini.get("DZ_ZJ1").setValue(5);
mini.get("DZ_ZJ2").setData(DZ_ZJ);
mini.get("DZ_SD1").setData(DZ_SD);
mini.get("DZ_SD2").setData(DZ_SD);

mini.get("HPNSL_LX").setData(HPNSL_LX);
mini.get("HPNSL_GM").setData(HPNSL_GM);
mini.get("HPNSL_GM").setValue("大型");
mini.get("HPNSL_WDX").setData(HPNSL_WDX);
mini.get("HPNSL_WDX").setValue("差");
mini.get("YFQ_YFCD").setData(YFQ_YFCD);



var Query_LSZHJson = { dsname: "DZHPNSL", dtname: "中国历史地震点分布", xh: 0, TotalItems: 0, curpage: 1, pagesize: 1000, querynum: 0 };
var Query_ConfigTable = [{dtname: "中国历史地震点分布",pic:"地震.png",fid: ["dm", "nyr", "sfm", "sd", "zj"], fidn: ["地名", "年月日", "时分秒", "深度", "震级"] },
    { dtname: "滑坡泥石流点位分布", pic: "滑坡.png", fid: ["sm", "xm", "lx", "gm", "fx", "wdx"], fidn: ["省名", "县名", "类型", "规模", "方向", "稳定性"] },
    { dtname: "县级滑坡泥石流易发程度分区", pic: "易发区.png", fid: ["sheng", "shi", "quxian", "fq"], fidn: ["省", "市", "区县", "易发程度"] }]
var LSZH_CurJson = [];
var LSZH_QueryLayer = null;
var LSZH_JHLayer = null;
var LSZH_SelGraphic;
var JH_Data = [];
var JH_Data2 = [];
var HPNSL_Show_Type = 3;

var LSZH_EChart_Layer = null, LSZH_Chart = null, LSZH_Chart_Dom, LSZH_DZ_GeoCoord, LSZH_DZ_Option;

function LSTF_InitQuery() {
    if (LSZH_QueryLayer == null) {
        LSZH_QueryLayer = new SuperMap.Layer.Graphics("LSZH_QueryLayer", null, { hitDetection: true });
        map.addLayers([LSZH_QueryLayer]);
        var LayerDiv = LSZH_QueryLayer.div;
        $(LayerDiv).css({zIndex:1600});

        LSZH_SelGraphic = new SuperMap.Control.SelectGraphic(LSZH_QueryLayer, {
            onSelect: LSZH_GetInfo
        });
        map.addControl(LSZH_SelGraphic);
        LSZH_SelGraphic.activate();
    }
    
}


/*初始化查询区域 Begin*/
function Query_LSTFReset() {
    ZHLS_LSTF_EditFrm.clear();
    LSTF_ClearLayer();
}
function Query_SJZReset() {
    ZHLS_SJZ_EditFrm.clear();
    LSTF_ClearLayer();
}

function Query_SetNum() {
    var pagesize = $("#LSZHResSum").val();
    if (!isNaN(parseInt(pagesize))) {
        $("#LSZHResSum").val(pagesize);
        Query_LSZHJson.pagesize = pagesize;
    }
    else {
        $("#LSZHResSum").val(1000);
        Query_LSZHJson.pagesize = 1000;
    }
}
// 历史地震
function Begin_Query_DZ() {
    if (LSZH_EChart_Layer != null) {
        var LayerDiv = LSZH_EChart_Layer.div;
        $(LayerDiv).prop('outerHTML', '');
        LSZH_EChart_Layer = null;
        LSZH_Chart = null;
    }
    if (LSZH_Chart == null) {
        //创建Elements的实例，获得其div
        LSZH_EChart_Layer = new SuperMap.Layer.Elements("LSZH_EChart_Layer");
        map.addLayers([LSZH_EChart_Layer]);
        var LayerDiv = LSZH_EChart_Layer.div;
        $(LayerDiv).css({ zIndex: 3000 });

        var elementsDiv = LSZH_EChart_Layer.getDiv();

        //设置Elements实例的div为地图大小
        var size = map.getSize();
        elementsDiv.style.width = size.w;
        elementsDiv.style.height = size.h;

        //创建一个图片对象并添加到Elements的实例，获得其div
        LSZH_Chart_Dom = document.createElement("div");
        elementsDiv.appendChild(LSZH_Chart_Dom);
        LSZH_Chart_Dom.style.width = size.w + "px";
        LSZH_Chart_Dom.style.height = size.h + "px";
        LSZH_Chart = echarts.init(LSZH_Chart_Dom);
    }

    Query_LSZHJson.curpage = 1;
    LSTF_InitQuery();
    Query_DZ();
}
function Query_DZ() {
    Query_LSZHJson.xh = 0;
    var o = ZHLS_DZ_EditFrm.getData();
    var bounds = map.getExtent();
    o.bounds = bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;
    if (o.DZ_Name == "") {
        Cur_SSQueryInfo.sfsf = false;
    }
    else {
        Cur_SSQueryInfo.sfsf = true;
    }
    Cur_SSQueryInfo.type = "lsdz";
    //Query_SetNum();
    var json = mini.encode([o]);
    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_DZList",
        type: 'post',
        data: { data: json, pagesize: Query_LSZHJson.pagesize, curpage: Query_LSZHJson.curpage, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var obj = info.data;
            Query_LSZHJson.querynum = info.total;
            Query_LSZHJson.TotalItems = info.total;
            LSZH_CurJson = obj;
            LSZH_Draw_DZ();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

//绘制地震
function LSZH_Draw_DZ() {
    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        $("#LSZHResTS").html("当前视野共找到" + Query_LSZHJson.querynum + "个搜索结果");
        if (Query_LSZHJson.xh == 0) {
            $("#LSZHQueryRes_DZ").html($("#LSZHQueryRes_Div"));
        }
        else if (Query_LSZHJson.xh == 1) {
            $("#LSZHQueryRes_HPNSL").html($("#LSZHQueryRes_Div"));
        }
        else {
            $("#LSZHQueryRes_YFQ").html($("#LSZHQueryRes_Div"));
        }
        $("#LSZHQueryRes_Div").show();

        LSZH_QueryLayer.removeAllGraphics();

        var points = [];
        var points1 = [];
        var points2 = [];
        var points3 = [];
        var points4 = [];
        //var points = [];  // 添加海量点数据
        LSZH_DZ_GeoCoord = {};
        LSZH_DZ_GeoData = [];
        //var TBYS = { "蓝色": "1","橙色": "2", "红色": "3", "灰色": "4" };

        //var fillColors = ['rgba(0,176,240,1)', 'rgba(248,160,87,1)', 'rgba(255,33,33,1)', 'rgba(192,192,192,1)'];
        //var strokeColors = ['rgba(0,176,240,1)', 'rgba(248,160,87,1)', 'rgba(255,33,33,1)', 'rgba(192,192,192,1)'];
        //var radius = [2, 4, 6, 2];
        var TBYS = { "蓝色": "1", "黄色": "2", "橙色": "3", "红色": "4", "灰色": "5" };

        var fillColors = ['rgba(0,176,240,1)', 'rgba(255,255,0,1)', 'rgba(248,128,10,1)', 'rgba(255,33,33,1)', 'rgba(192,192,192,1)'];
        var strokeColors = ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)'];
        var radius = [2, 3, 4, 6, 2];

        var symbols = [];
        for (var i = 0; i < fillColors.length; i++) {
            symbols.push(new SuperMap.Style.Circle({
                radius: radius[i],
                fill: new SuperMap.Style.Fill({
                    color: fillColors[i]
                }),
                stroke: new SuperMap.Style.Stroke({
                    color: strokeColors[i]
                })
            }));
        }

        for (i = 0, len = LSZH_CurJson.length; i < len; i++) {
            var lng = LSZH_CurJson[i]["lng"];
            var lat = LSZH_CurJson[i]["lat"];
            var jb = LSZH_CurJson[i]["jb"];
            var zj = LSZH_CurJson[i]["zj"];

            var Point = new SuperMap.Geometry.Point(parseFloat(lng), parseFloat(lat));
            var pointVector = new SuperMap.Graphic(Point);
            pointVector.style = {
                image: symbols[parseInt(jb) - 1]
            };
            Point.data = LSZH_CurJson[i]["id"];

            if (parseInt(jb) ==5) {
                points.push(pointVector);
            }
            else if (parseInt(jb) == 1) {
                points1.push(pointVector);
            }
            else if (parseInt(jb) == 2) {
                points2.push(pointVector);
            }
            else if (parseInt(jb) == 3) {
                points3.push(pointVector);
            }
            else if (parseInt(jb) == 4) {
                points4.push(pointVector);
            }
            //else if (parseInt(jb) == 3) {
            //    LSZH_DZ_GeoCoord[LSZH_CurJson[i]["dm"]] = [parseFloat(lng), parseFloat(lat)];
            //    LSZH_DZ_GeoData.push({
            //        name: LSZH_CurJson[i]["dm"],
            //        value: 100
            //    });
            //    points3.push(pointVector);
            //}
            if (parseFloat(zj) >= 8) {
                LSZH_DZ_GeoCoord[LSZH_CurJson[i]["dm"]] = [parseFloat(lng), parseFloat(lat)];
                LSZH_DZ_GeoData.push({
                    name: LSZH_CurJson[i]["dm"],
                    value: 100
                });
            }
            //if (parseFloat(zj) >= 7.5&&parseFloat(zj) <8) {
            //    LSZH_DZ_GeoCoord_1[LSZH_CurJson[i]["dm"]] = [parseFloat(lng), parseFloat(lat)];
            //    LSZH_DZ_GeoData_1.push({
            //        name: LSZH_CurJson[i]["dm"],
            //        value: 100
            //    });
            //}
            //points.push(pointVector);
        }
        LSZH_QueryLayer.addGraphics(points4);
        LSZH_QueryLayer.addGraphics(points3);
        LSZH_QueryLayer.addGraphics(points2);
        LSZH_QueryLayer.addGraphics(points1);
        LSZH_QueryLayer.addGraphics(points);
        LSZH_QueryLayer.setVisibility(true);
        if (FXYJ_SDLayer != null) {
            selectGraphic.deactivate();
        }
        LSZH_SelGraphic.activate();
        if (CurMap_Json.maptype == 0) {
            SetMapKS(1);
        }
        LSZH_CurJson = [];
        LSZH_AddLegend(Query_LSZHJson.xh);
        LSZH_DZ_Option = {};
        LSZH_DZ_Option = {
            color: ['gold', 'aqua', 'lime'],
            tooltip: {
                trigger: 'item',
                formatter: function (v) {
                    return v[1].replace(':', ' > ');
                }
            },
            toolbox: {
                show: false
            },
            dataRange: {
                show: false,
                min: 0,
                max: 100,
                y: '60%',
                calculable: true,
                color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua']
            },
            series: [
                {
                    name: '北京',
                    type: 'map',
                    mapType: 'none',
                    data: [],
                    geoCoord: LSZH_DZ_GeoCoord,
                    markPoint: {
                        symbol: 'emptyCircle',
                        symbolSize: 20,
                        effect: {
                            show: true,
                            shadowBlur: 0
                        },
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                }
                            }
                        },
                        data: LSZH_DZ_GeoData
                    }
                }
            ]
        };
        LSZH_DZ_Chart();

    } else {
        mini.alert('请在chrome、safari、IE8+以上浏览器查看本示例');
    }
}

function LSZH_DZ_Chart() {
    LSZH_DZ_ReSetOption(LSZH_DZ_Option);
    LSZH_Chart.setOption(LSZH_DZ_Option);
}

function LSZH_DZ_ReSetOption(option) {
    LSZH_Chart.clear();
    var series = option.series || {};
    // 记录所有的geoCoord
    if (!LSZH_DZ_GeoCoord) {
        LSZH_DZ_GeoCoord = {};
        for (var i = 0, item; item = series[i++];) {
            var geoCoord = item.geoCoord;
            if (geoCoord) {
                for (var k in geoCoord) {
                    LSZH_DZ_GeoCoord[k] = geoCoord[k];
                }
            }
        }
    }
    for (var i = 0, item; item = series[i++];) {
        var markPoint = item.markPoint || {};
        var markLine = item.markLine || {};

        var data = markPoint.data;
        if (data && data.length) {
            for (var k in data) {
                LSZH_DZ_ReSetPosition(data[k]);
            }
        }

        data = markLine.data;
        if (data && data.length) {
            for (var k in data) {
                LSZH_DZ_ReSetPosition(data[k][0]);
                LSZH_DZ_ReSetPosition(data[k][1]);
            }
        }
    }
}

function LSZH_DZ_ReSetPosition(obj) {
    var coord = LSZH_DZ_GeoCoord[obj.name];
    if (coord != undefined) {
        
        //var pos = map.getViewPortPxFromLonLat(new SuperMap.LonLat(coord[0], coord[1]));
        var pos = LSZH_EChart_Layer.getLayerPxFromLonLat(new SuperMap.LonLat(coord[0], coord[1]));
        obj.x = pos.x;
        obj.y = pos.y;
    }
}

function Query_DZReset() {
    ZHLS_DZ_EditFrm.clear();
    LSZH_ClearQueryLayer();
}
function LSZH_ClearQueryLayer() {
    Cur_SSQueryInfo.type = "";
    if (LSZH_QueryLayer != null) {
        LSZH_QueryLayer.removeAllGraphics();
    }
    LSZH_CurJson = [];

    //LSTF_JJXLayer.removeAllFeatures();
    //LSTF_FQLayer.removeAllFeatures();
    
    $("#LSZHResTS").html("");
    $('#LSZH_Page').hide();
    LSZH_ClearLegend();
    $("#Prop_Info").hide();
    $("#HPNSL_QHDiv").hide();
    JH_Data = [];
    JH_Data2 = [];
    if (LSZH_JHLayer != null) {
        map.removeLayer(LSZH_JHLayer);
        LSZH_JHLayer = null;
    }
    if (LSZH_Chart != null) {
        LSZH_Chart.clear();
    }
}

function Begin_Query_HPNSL() {
    Query_LSZHJson.curpage = 1;
    LSTF_InitQuery();
    Query_HPNSL();
}
//滑坡泥石流分布点查询
function Query_HPNSL() {
    JH_Data = [];
    JH_Data2 = [];
    if (LSZH_JHLayer != null) {
        map.removeLayer(LSZH_JHLayer);
        LSZH_JHLayer = null;
    }
    Query_LSZHJson.xh = 1;
    var o = ZHLS_HPNSL_EditFrm.getData();
    var bounds = map.getExtent();
    o.bounds = bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;
    if (o.HPNSL_DQ == "") {
        Cur_SSQueryInfo.sfsf = false;
    }
    else {
        Cur_SSQueryInfo.sfsf = true;
    }
    Cur_SSQueryInfo.type = "hpnsl";
    Query_SetNum();
    var json = mini.encode([o]);
    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_HPNSLList",
        type: 'post',
        data: { data: json, pagesize: Query_LSZHJson.pagesize, curpage: Query_LSZHJson.curpage, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var obj = info.data;
            Query_LSZHJson.querynum = info.total;
            Query_LSZHJson.TotalItems = info.total;
            LSZH_CurJson = obj;
            LSZH_DrawHPNSL();
            //LSZH_DrawQuery();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

function LSZH_DrawHPNSL() {
    $("#HPNSL_QHDiv").show();
    //Cur_SSQueryInfo.type = "lxzh";
    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        $("#LSZHResTS").html("当前视野共找到" + Query_LSZHJson.querynum + "个搜索结果");
        if (Query_LSZHJson.xh == 0) {
            $("#LSZHQueryRes_DZ").html($("#LSZHQueryRes_Div"));
        }
        else if (Query_LSZHJson.xh == 1) {
            $("#LSZHQueryRes_HPNSL").html($("#LSZHQueryRes_Div"));
        }
        else {
            $("#LSZHQueryRes_YFQ").html($("#LSZHQueryRes_Div"));
        }
        $("#LSZHQueryRes_Div").show();


        LSZH_QueryLayer.removeAllGraphics();
        var points = [];  // 添加海量点数据
        var TBYS = { "蓝色": "1", "黄色": "2", "橙色": "3", "红色": "4", "灰色": "5" };

        var fillColors = ['rgba(18,150,219,0.9)', 'rgba(255,255,0,0.9)', 'rgba(255,128,10,0.9)', 'rgba(255,0,0,0.9)', 'rgba(192,192,192,0.9)'];
        var strokeColors = ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)'];
        var radius = [8, 8, 10, 12, 8];
        var symbols = [];
        for (var i = 0; i < fillColors.length; i++) {
            symbols.push(new SuperMap.Style.Circle({
                radius: radius[i],
                fill: new SuperMap.Style.Fill({
                    color: fillColors[i]
                }),
                stroke: new SuperMap.Style.Stroke({
                    color: strokeColors[i]
                })
            }));
        }

        var data1 = [];
        var data2 = [];
        for (i = 0, len = LSZH_CurJson.length; i < len; i++) {
            var lng = LSZH_CurJson[i]["lng"];
            var lat = LSZH_CurJson[i]["lat"];
            var jb = LSZH_CurJson[i]["jb"];
            var Point = new SuperMap.Geometry.Point(parseFloat(lng), parseFloat(lat));

            var pointVector = new SuperMap.Graphic(Point);
            pointVector.style = {
                image: symbols[parseInt(jb) - 1]
            };
            Point.data = LSZH_CurJson[i]["id"];
            points.push(pointVector);

            data1.push({
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                count: 1
            });

            data2.push({
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                count: 2
            });

            
        }
        JH_Data = new mapv.DataSet(data1);
        JH_Data2 = new mapv.DataSet(data2);

        LSZH_QueryLayer.addGraphics(points);
        if (FXYJ_SDLayer != null) {
            selectGraphic.deactivate();
        }
        LSZH_SelGraphic.activate();
        if (CurMap_Json.maptype == 0) {
            SetMapKS(1);
        }
        LSZH_CurJson = [];
        LSZH_AddLegend(Query_LSZHJson.xh);

        if (HPNSL_Show_Type == 2) {
            ChangeWG();
        }
        else if (HPNSL_Show_Type == 3) {
            ChangeRL()
        }
        else {
            ChangeFC();
        }

    } else {
        mini.alert('请在chrome、safari、IE8+以上浏览器查看本示例');
    }
}

function ChangeFC() {
    HPNSL_Show_Type = 1;
    if (LSZH_JHLayer != null) {
        map.removeLayer(LSZH_JHLayer);
        LSZH_JHLayer = null;
    }
    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        max: 100,
        size: 50,
        label: {
            show: true,
            fillStyle: 'white',
        },
        globalAlpha: 0.5,
        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
        draw: 'honeycomb'
    };

    LSZH_JHLayer = new SuperMap.Layer.MapVLayer("mapv", { dataSet: JH_Data, options: options });
    map.addLayer(LSZH_JHLayer);
    var LayerDiv = LSZH_JHLayer.div;
    $(LayerDiv).css({ zIndex: 1800 });
    if (map.getZoom() > 8) {
        LSZH_QueryLayer.setVisibility(true);
        LSZH_JHLayer.setVisibility(false);
    } else {
        LSZH_QueryLayer.setVisibility(false);
        LSZH_JHLayer.setVisibility(true);
    }
}

function ChangeWG() {
    HPNSL_Show_Type = 2;
    if (LSZH_JHLayer != null) {
        map.removeLayer(LSZH_JHLayer);
        LSZH_JHLayer = null;
    }
    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        max: 100,
        size: 50,
        label: {
            show: true,
            fillStyle: 'white',
        },
        globalAlpha: 0.5,
        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
        draw: 'grid'
    };

    LSZH_JHLayer = new SuperMap.Layer.MapVLayer("mapv", { dataSet: JH_Data, options: options });
    map.addLayer(LSZH_JHLayer);
    var LayerDiv = LSZH_JHLayer.div;
    $(LayerDiv).css({ zIndex: 1800 });
    if (map.getZoom() > 8) {
        LSZH_QueryLayer.setVisibility(true);
        LSZH_JHLayer.setVisibility(false);
    } else {
        LSZH_QueryLayer.setVisibility(false);
        LSZH_JHLayer.setVisibility(true);
    }
}

function ChangeRL() {
    HPNSL_Show_Type = 3;
    if (LSZH_JHLayer != null) {
        map.removeLayer(LSZH_JHLayer);
        LSZH_JHLayer = null;
    }
    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        max: 100,
        size: 50,
        label: {
            show: true,
            fillStyle: 'white',
        },
        globalAlpha: 0.5,
        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "rgb(255,128,0)", 1.0: "rgb(255,0,0)" },
        draw: 'heatmap'
    };

    LSZH_JHLayer = new SuperMap.Layer.MapVLayer("mapv", { dataSet: JH_Data2, options: options });
    map.addLayer(LSZH_JHLayer);
    var LayerDiv = LSZH_JHLayer.div;
    $(LayerDiv).css({ zIndex: 1800 });
    if (map.getZoom() > 8) {
        LSZH_QueryLayer.setVisibility(true);
        LSZH_JHLayer.setVisibility(false);
    } else {
        LSZH_QueryLayer.setVisibility(false);
        LSZH_JHLayer.setVisibility(true);
    }
}

function Query_HPNSLReset() {
    ZHLS_HPNSL_EditFrm.clear();
    LSZH_ClearQueryLayer();
}

function Begin_Query_YFQ() {
    Query_LSZHJson.curpage = 1;
    LSTF_InitQuery();
    Query_YFQ();
}
//滑坡泥石流易发分区查询
function Query_YFQ() {
    Query_LSZHJson.xh = 2;
    var o = ZHLS_YFQ_EditFrm.getData();
    var bounds = map.getExtent();
    o.bounds = bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;
    
    if (o.YFQ_DQ == "") {
        Cur_SSQueryInfo.sfsf = false;
    }
    else {
        Cur_SSQueryInfo.sfsf = true;
    }
    Cur_SSQueryInfo.type = "yfq";
    //Query_SetNum();
    var json = mini.encode([o]);
    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=Get_YFQList",
        type: 'post',
        data: { data: json, pagesize: Query_LSZHJson.pagesize, curpage: Query_LSZHJson.curpage, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var obj = info.data;
            Query_LSZHJson.querynum = info.total;
            Query_LSZHJson.TotalItems = info.total;
            LSZH_CurJson = obj;
            LSZH_DrawQuery();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}
function Query_YFQReset() {
    ZHLS_YFQ_EditFrm.clear();
    LSZH_ClearQueryLayer();
}

function LSZH_DrawQuery() {
    Cur_SSQueryInfo.type = "lxzh";
    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        $("#LSZHResTS").html("当前视野共找到" + Query_LSZHJson.querynum + "个搜索结果");
        if (Query_LSZHJson.xh == 0) {
            $("#LSZHQueryRes_DZ").html($("#LSZHQueryRes_Div"));
        }
        else if (Query_LSZHJson.xh == 1) {
            $("#LSZHQueryRes_HPNSL").html($("#LSZHQueryRes_Div"));
        }
        else {
            $("#LSZHQueryRes_YFQ").html($("#LSZHQueryRes_Div"));
        }
        $("#LSZHQueryRes_Div").show();


        LSZH_QueryLayer.removeAllGraphics();
        var points = [];  // 添加海量点数据
        var TBYS = {"蓝色": "1", "黄色": "2", "橙色": "3", "红色": "4","灰色": "5"};

        var fillColors = ['rgba(18,150,219,0.9)', 'rgba(255,255,0,0.9)', 'rgba(255,128,10,0.9)', 'rgba(255,0,0,0.9)', 'rgba(192,192,192,0.9)'];
        var strokeColors = ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)'];
        var radius = [5, 5, 6, 7,5];
        var symbols = [];
        for (var i = 0; i < fillColors.length; i++) {
            symbols.push(new SuperMap.Style.Circle({
                radius: radius[i],
                fill: new SuperMap.Style.Fill({
                    color: fillColors[i]
                }),
                stroke: new SuperMap.Style.Stroke({
                    color: strokeColors[i]
                })
            }));
        }

        for (i = 0, len = LSZH_CurJson.length; i < len; i++) {
            var lng = LSZH_CurJson[i]["lng"];
            var lat = LSZH_CurJson[i]["lat"];
            var jb = LSZH_CurJson[i]["jb"];
            var Point = new SuperMap.Geometry.Point(parseFloat(lng), parseFloat(lat));

            var pointVector = new SuperMap.Graphic(Point);
            pointVector.style = {
                image: symbols[parseInt(jb) - 1]
            };
            Point.data = LSZH_CurJson[i]["id"];
            points.push(pointVector)
        }
        LSZH_QueryLayer.addGraphics(points);
        //LSZH_QueryLayer.redraw();
        LSZH_QueryLayer.setVisibility(true);
        if (FXYJ_SDLayer != null) {
            selectGraphic.deactivate();
        }
        LSZH_SelGraphic.activate();
        if (CurMap_Json.maptype==0)
        {
            SetMapKS(1);
        }
        LSZH_CurJson = [];
        LSZH_AddLegend(Query_LSZHJson.xh);

        //$("#LSZH_Page").show();
        //laypage({
        //    cont: $('#LSZH_Page'), //容器。值支持id名、原生dom对象，jquery对象,
        //    pages: Math.ceil(parseInt(Query_LSZHJson.TotalItems) / parseInt(Query_LSZHJson.pagesize)),
        //    skip: true, //是否开启跳页
        //    skin: '#EB6868',
        //    groups: 2,
        //    curr: Query_LSZHJson.curpage,
        //    jump: function (obj, first) {
        //        if (!first) {
        //            Query_LSZHJson.curpage = obj.curr;

        //            if (Query_LSZHJson.xh == 0) {
        //                Query_DZ();
        //            }
        //            else if (Query_LSZHJson.xh == 1) {
        //                Query_HPNSL();
        //            }
        //            else {
        //                Query_YFQ();
        //            }
        //        }
        //    }
        //});
        //$(".laypage_total").hide();
    } else {
        mini.alert('请在chrome、safari、IE8+以上浏览器查看本示例');
    }
}

function LSZH_GetInfo(e) {
    var bs = e.geometry.data;
    $.ajax({
        url: "/views/xtmh/lstf.aspx?Action=LSZH_GetInfo",
        type: 'post',
        data: { bs: bs, lx: Query_LSZHJson.xh, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var obj = info.data[0];
            var sjjxh = Query_LSZHJson.xh;
            var Fid = Query_ConfigTable[sjjxh].fid;
            var FidN = Query_ConfigTable[sjjxh].fidn;
            
            var strHtml = '';
            strHtml += '<div class="Info_WinCon" style="overflow-x:hidden;overflow-y:auto;">';
            for (var i = 0; i < Fid.length; i++) {
                strHtml += FidN[i] + "：" + ((obj[Fid[i]] == null) ? '' : obj[Fid[i]]) + "<br/>";
            }
            strHtml += '</div>';
            var cenx = obj["lng"];
            var ceny = obj["lat"];
            var point = new SuperMap.LonLat(cenx, ceny)
            
            InfoWin_Json = { content: strHtml, point: point };
            ShowInfoWin();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

//添加历史灾害图例   地震、滑坡泥石流、易发区、气象预警
function LSZH_AddLegend(bs) {
    var img = "/images/legend/";
    if (bs == 0) {
        img += "历史事件_地震分布.png";
    }
    else if (bs == 1) {
        img += "历史事件_滑坡泥石流分布.png";
    }
    else if (bs == 2) {
        img += "历史事件_滑坡泥石流易发区.png";
    }
    else if(bs==4) {
        img += "风险预警_气象预警.png";
    }
    else if (bs == 6) {
        img += "台风风速.png";
    }
    var layerlen = $("#Layer_FXZTList div[value='LSZH']").length;
    if (layerlen > 0) {
        $("#Layer_FXZTList div[value='LSZH'] img").attr("src", img);
    }
    else {
        var strHtml_L = '<div class="LabelFJInfo" value="LSZH">';
        strHtml_L += '<img style="width:198px;" src="' + img + '" onerror="Remove_Img(this)"/></div>';
        $("#Layer_FXZTList").append(strHtml_L);
        $("#Layer_Panal").show();
    }
    //LSZH_ClearLegend();
}

//清除历史灾害图例
function LSZH_ClearLegend() {
    $("#Layer_FXZTList div[value='LSZH']").prop('outerHTML', '');
    var layerlen = $("#Layer_FXZTList div").length;
    if (layerlen == 0) {
        $("#Layer_Panal").hide();
    }
}

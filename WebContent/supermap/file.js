
//querytype  sxcx:属性查询 不定位  dwcx：定位查询 定位  bmcx：编码查询   
var Query_FXZTLayer = { querytype: "", sfdw: 0, lng: 0, lat: 0, quenum: 0, succnum: 0, djlayer: [], lslayer: [], querylayer: [] };//{ dsname: "", dtname: "", mapname: "", val: "" }
var Query_BMCXInfo = [{ point: [], fxinfo: [] }];

function bd2mars(lng,lat) {
    var longitude = 0 + lng;
    var latitude = 0 + lat;
    var longlat = bb2mars(+longitude, +latitude);
    return longlat;
};

function mars2bd(lng,lat) {
    var longitude = 0 + lng;
    var latitude = 0 + lat;

    var longlat = mars2bb(longitude, latitude);
    return longlat;
}

window.setTimeout("CXDW_Init()",1000);
function CXDW_Init() {
    Query_CurJson.marketlayer = new SuperMap.Layer.Markers("marketlayer");
    Query_CurJson.arealayer = new SuperMap.Layer.Vector("arealayer");
    map.addLayers([Query_CurJson.marketlayer, Query_CurJson.arealayer]);
    var LayerDiv = Query_CurJson.marketlayer.div;
    $(LayerDiv).css({ zIndex: 3000 });
    LayerDiv = Query_CurJson.arealayer.div;
    $(LayerDiv).css({ zIndex: 2550 });
    Query_CurJson.marketlayer.setVisibility(false);
    Query_CurJson.arealayer.setVisibility(false);
}

Init_CityList();
function Init_CityList() {
    $('#keySearch').bind('keydown', function (event) {
        if (event.keyCode == 13) {
            Query_NameDW();
        }
    });
    var strHtml = "";
    for (var i = 0; i < City_List.length; i++) {
        if (City_List[i].city.length > 1) {
            strHtml += '<tr><td class="Col1">'
            strHtml += '<div class="Item1" bs="city" value="' + City_List[i].code + '" name="' + City_List[i].name + '">' + City_List[i].name + '：</div></td>';
            strHtml += '<td class="Col2">'
            for (var j = 0; j < City_List[i].city.length; j++) {
                strHtml += '<div class="Item2" bs="city" value="' + City_List[i].city[j].code + '" name="' + City_List[i].city[j].name + '">' + City_List[i].city[j].name + '</div>';
            }
            strHtml += '</td></tr>';
        }
    }
    $("#CityFSList").html(strHtml);

    $("#CityListPanal div[bs='city']").click(function () {
        var code = $(this).attr('value');
        var name = $(this).attr('name');
        $("#CurSelCity").html(name);
        CloseCityList();
        Query_CurJson.areaname = name;
        Query_CurJson.areacode = code;
        //Query_CurJson.business = name;
        Query_ClearLayer();
        if (code == "100000") {
            FullMap();
        }
        else {
            var NewCode = (Query_CurJson.areacode + "000000").substr(0, 6);
            $.ajax({
                url: "/views/xtmh/wdcx.aspx?Action=WDCX_GetQYInfo",
                type: 'post',
                data: { areacode: NewCode, seccode: U_Token },
                cache: false,
                success: function (text) {
                    var info = eval("(" + text + ")");
                    var AreaJson = info.data[0];
                    var ArrQYZB = AreaJson.qyzb.split("|"); //行政区域的点有多少个
                    if (ArrQYZB.length === 0) {
                        return;
                    }
                    var ArrLng = [];
                    var ArrLat = [];
                    for (var i = 0; i < ArrQYZB.length; i++) {
                        var ArrPoint = ArrQYZB[i].split(";");
                        var Points = [];
                        for (var k = 0; k < ArrPoint.length; k++) {
                            var point = ArrPoint[k].split(",");
                            var lng = parseFloat(point[0]);
                            var lat = parseFloat(point[1]);
                            Points.push(new SuperMap.Geometry.Point(lng, lat));
                            ArrLng.push(lng);
                            ArrLat.push(lat);
                        }
                        var linearRings = new SuperMap.Geometry.LinearRing(Points),
                        region = new SuperMap.Geometry.Polygon([linearRings]);
                        var polygonVector = new SuperMap.Feature.Vector(region);
                        polygonVector.style = {
                            strokeColor: "#FF0000",
                            fillColor: "#FFFFFF",
                            strokeWidth: 1.5,
                            fillOpacity: 0
                        };
                        Query_CurJson.arealayer.addFeatures([polygonVector]);
                    }
                    SetBoundParams(ArrLng, ArrLat);
                    SetMapBound(ArrLng, ArrLat);
                    Query_QYFXZB();
                    $("#QYCX_Panal").show();
                    $("#QYCX_Head span").html("区域风险评估信息(" + name + ")");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    mini.alert(jqXHR.responseText);
                }
            });
        }
    });
}

function OpenCityList() {
    if ($("#CityListPanal").is(':hidden')) {
        $("#CityListPanal").show();
        $("#CurCitySel").attr("src", "/images/tool/上箭头_0.png");
    }
    else {
        $("#CityListPanal").hide();
        $("#CurCitySel").attr("src", "/images/tool/下箭头_0.png");
    }
}

function CloseCityList() {
    $("#CityListPanal").hide();
}


$("#keySearch").focus(function () {
    var point = map.getCenter();
    //map_js.centerAndZoom(new BMap.Point(point.lon, point.lat), map.getZoom());
    map_js.centerAndZoom(new BMap.Point(116.4, 39.9), 12);
});

function G(id) {
    return document.getElementById(id);
}


var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
	    {
	        "input": "keySearch", "location": map_js
	    });
ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        Query_SetInfo(_value);
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
});

var PlaceValue;
ac.addEventListener("onconfirm", function (e) {
    var _value = e.item.value;
    PlaceValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    Query_SetInfo(_value);
    setPlace();
});


function Query_SetInfo(_value) {
    Query_CurJson.province = _value.province;
    Query_CurJson.city = _value.city;
    Query_CurJson.district = _value.district;
    Query_CurJson.street = _value.street;
    Query_CurJson.business = _value.business;
}

function setPlace() {
    Query_FXZTLayer.sfdw = 0;
    function myFun() {
        var pp = local.getResults().getPoi(0).point;
        if (pp) {
            var lnglat = bd2mars(pp.lng, pp.lat);
            Query_CurJson.cenx = lnglat[0];
            Query_CurJson.ceny = lnglat[1];
            var strSearch = $("#keySearch").val();
            Query_ClearLayer();
            $("#keySearch").val(strSearch);
            Query_GetArea();
            if (Query_CurJson.type == 1) {
                GetDWCXInfo();
            }
        }
    }
    var local = new BMap.LocalSearch(map_js, {
        onSearchComplete: myFun
    });
    local.search(PlaceValue);
}

//查询结束后获取区域信息_暂时不用
function Query_GetArea_Old() {
    var city = Query_CurJson.city;
    var district = Query_CurJson.district;
    var business = Query_CurJson.business;
    //省级  business为省  可考虑查询数据库？？？
    if (city == "" && district == "" && business != "") {
        var selname = business;
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].Sheng;
            if ((selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) && AreaCode_Json[i].JB == "2") {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 2);
                Query_CurJson.type = 2;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
    //市级  business为市
    //else if (district == "" && city != "" && business != "") {
    else if (district == business && city != "" && (city.indexOf("省") >= 0 || city.indexOf("自治区") >= 0 || city.indexOf("北京市") >= 0 || city.indexOf("上海市") >= 0 || city.indexOf("天津市") >= 0 || city.indexOf("重庆市") >= 0)) {
        var selname = business.replace("市","");
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].ShiXian;
            if ( AreaCode_Json[i].JB == "3" && (selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) ) {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 4);
                Query_CurJson.type = 2;
                Query_CurJson.areaname = selname;
                break;
            }
        }

        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].ShiXian;
            if (AreaCode_Json[i].JB == "4" && (selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0)) {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode;
                Query_CurJson.type = 2;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
        //区县  business为区县
    else if (district != "" && city != "" && (business == district)) {
        var selname = district;
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].ShiXian;
            if ((selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) && AreaCode_Json[i].JB == "4") {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode;
                Query_CurJson.type = 2;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
        //点位
    else {
        var selname = district;
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].ShiXian;
            if ((selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) && AreaCode_Json[i].JB == "4") {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode;
                Query_CurJson.type = 1;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
    Query_AreaDW(Query_CurJson.areaname);
}

function Query_GetArea() {
    var city = Query_CurJson.city;
    var district = Query_CurJson.district;
    var business = Query_CurJson.business;
    //省级  business为省  可考虑查询数据库？？？
    if ((city == "" && district == "" && business != "") || (city == district && district == business)) {
        var selname = business;
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].Sheng;
            if ((selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) && AreaCode_Json[i].JB == "2") {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 2);
                Query_CurJson.type = 2;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
    //
    else if (district != "" && city != "" && (business.indexOf(district) >= 0 || district.indexOf(business) >= 0)) {
        //var selname = district;
        var selname = district.replace("市", "");
        selname = selname.replace("区", "");
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].ShiXian;

            if (selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) {
                var jb = AreaCode_Json[i].JB;
                if (jb == "3") {
                    Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 4);
                }
                else {
                    Query_CurJson.areacode = AreaCode_Json[i].AreaCode;
                }
                Query_CurJson.type = 2;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
    //点位
    else {
        var selname = district;
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var areaname = AreaCode_Json[i].ShiXian;
            if ((selname.indexOf(areaname) >= 0 || areaname.indexOf(selname) >= 0) && AreaCode_Json[i].JB == "4") {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode;
                Query_CurJson.type = 1;
                Query_CurJson.areaname = selname;
                break;
            }
        }
    }
    Query_AreaDW(Query_CurJson.areaname);
}

//行政区查询定位
function Query_AreaDW(cityname) {
    if (Query_CurJson.type == 1) {
        var mPoint = new SuperMap.LonLat(Query_CurJson.cenx, Query_CurJson.ceny);
        var size = new SuperMap.Size(30, 30);
        var offset = new SuperMap.Pixel(-15, -15);
        var dhIcon = new SuperMap.Icon('/images/圆圈1.gif', size, offset);
        var dhMarker = new SuperMap.Marker(mPoint, dhIcon);
        Query_CurJson.marketlayer.addMarker(dhMarker);
    }
    else if (Query_CurJson.type == 2) {
        var sfzd = 0;
        var jb = '';
        for (var i = 0; i < AreaCode_Json.length; i++) {
            var shengname = AreaCode_Json[i].Sheng;
            var qxname = AreaCode_Json[i].ShiXian;
            qxname = qxname.replace("市", "");
            qxname = qxname.replace("区", "");
            var jb = AreaCode_Json[i].JB;
            if ((shengname.indexOf(cityname) >= 0 || cityname.indexOf(shengname) >= 0) && jb == "2") {
                Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 2);
                Query_CurJson.type = 2;
                Query_CurJson.areaname = cityname;
                break;
            }
            else if (qxname.indexOf(cityname) >= 0 || cityname.indexOf(qxname) >= 0) {
                if (jb == "3") {
                    Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 4);
                    Query_CurJson.type = 2;
                }
                if (jb == "4") {
                    Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 6);
                    Query_CurJson.type = 2;
                }
                Query_CurJson.areaname = cityname;
                break;
            }
        }
        var NewCode = (Query_CurJson.areacode + "000000").substr(0, 6);
        $.ajax({
            url: "/views/xtmh/wdcx.aspx?Action=WDCX_GetQYInfo",
            type: 'post',
            data: { areacode: NewCode, seccode: U_Token },
            cache: false,
            success: function (text) {
                var info = eval("(" + text + ")");
                if (info.data.length > 0) {
                    var AreaJson = info.data[0];
                    if (AreaJson.qyzb != null && AreaJson.qyzb != "") {
                        var ArrQYZB = AreaJson.qyzb.split("|"); //行政区域的点有多少个
                        if (ArrQYZB.length === 0) {
                            return;
                        }
                        var ArrLng = [];
                        var ArrLat = [];
                        for (var i = 0; i < ArrQYZB.length; i++) {
                            var ArrPoint = ArrQYZB[i].split(";");
                            var Points = [];
                            for (var k = 0; k < ArrPoint.length; k++) {
                                var point = ArrPoint[k].split(",");
                                var lng = parseFloat(point[0]);
                                var lat = parseFloat(point[1]);
                                Points.push(new SuperMap.Geometry.Point(lng, lat));
                                ArrLng.push(lng);
                                ArrLat.push(lat);
                            }
                            var linearRings = new SuperMap.Geometry.LinearRing(Points),
                            region = new SuperMap.Geometry.Polygon([linearRings]);
                            var polygonVector = new SuperMap.Feature.Vector(region);
                            polygonVector.style = {
                                strokeColor: "#FF0000",
                                fillColor: "#FFFFFF",
                                strokeWidth: 1.5,
                                fillOpacity: 0
                            };
                            Query_CurJson.arealayer.addFeatures([polygonVector]);
                        }
                        SetBoundParams(ArrLng, ArrLat);
                        SetMapBound(ArrLng, ArrLat);
                        Query_QYFXZB();
                        $("#QYCX_Panal").show();
                        $("#QYCX_Head span").html("区域风险评估信息(" + cityname + ")");
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                mini.alert(jqXHR.responseText);
            }
        });
    }
}

//地名查询
function Query_NameDW() {
    var selname = $("#keySearch").val();
    if (selname == "") {
        return;
    }
    Query_ClearLayer();
    $("#keySearch").val(selname);
    var sfdq = 0;
    for (var i = 0; i < AreaCode_Json.length; i++) {
        var shengname = AreaCode_Json[i].Sheng;
        var shixian = AreaCode_Json[i].ShiXian;
        shixian = shixian.replace("市", "");
        shixian = shixian.replace("区", "");
        if ((selname.indexOf(shengname) >= 0 || shengname.indexOf(selname) >= 0 || selname.indexOf(shixian) >= 0 || shixian.indexOf(selname) >= 0)) {
            var jb = AreaCode_Json[i].JB;
            Query_CurJson.areacode = AreaCode_Json[i].AreaCode.substr(0, 2 * (parseInt(jb)-1));
            Query_CurJson.type = 2;//parseInt(jb);
            Query_CurJson.areaname = selname;
            sfdq = 1;
            break;
        }
    }
    if (sfdq == 0) {
        Query_CurJson.type = 1;
        Query_CurJson.areaname = selname;
    }
    Query_AreaDW(Query_CurJson.areaname);
}
//开始坐标查询
function Query_Location() {
    Query_FXZTLayer.sfdw = 0;
    LocationGetPlace();
}
//坐标查询定位
function LocationGetPlace() {
    var lng = $("#lngSearch").val();
    var lat = $("#latSearch").val();
    if (lng == "" || lat == "") {
        return;
    }
    if (isNaN(lng)) {
        $("#lngSearch").val("");
        $('#lngSearch').focus();
        return;
    }
    
    if (isNaN(lat)) {
        $("#latSearch").val("");
        $('#latSearch').focus();
        return;
    }
    Query_CurJson.cenx = lng;
    Query_CurJson.ceny = lat;
    
    var lnglat = mars2bd(lng, lat);
    var mPoint = new BMap.Point(lnglat[0], lnglat[1]);
    var geoc = new BMap.Geocoder();
    geoc.getLocation(mPoint, function (rs) {
        var _value = rs.addressComponents;
        Query_CurJson.province = _value.province;
        Query_CurJson.city = _value.city;
        Query_CurJson.district = _value.district;
        Query_CurJson.street = _value.street;
        Query_CurJson.business = _value.streetNumber;
        Query_ClearLayer();

        var mPoint = new SuperMap.LonLat(Query_CurJson.cenx, Query_CurJson.ceny);
        var size = new SuperMap.Size(30, 30);
        var offset = new SuperMap.Pixel(-15, -15);
        var dhIcon = new SuperMap.Icon('/images/圆圈1.gif', size, offset);
        var dhMarker = new SuperMap.Marker(mPoint, dhIcon);
        Query_CurJson.marketlayer.addMarker(dhMarker);
        Query_CurJson.type = 1;
        GetDWCXInfo();
    });
}

//绘制危险指数柱图
function Query_DrawWXZSChart() {
    var FXZSData = [];
    for (var i = 0; i < 9; i++) {
        var sjval = parseFloat(Query_FXZTLayer.querylayer[i]["val"]);
        FXZSData.push(sjval);
    }
    var dataStyle = {
        normal: {
            color: "#a2b0cc",
            label: {
                show: true, position: 'top'
            }
        }
    };
    var option = {
        backgroundColor: '#e3e6eb',
        title: {
            show: true,
            textStyle: { fontFamily: '微软雅黑,Arial', fontSize: 10, fontWeight: 'bolder', color: "#FFFFFF" }
            //text: '危险等级指数'
            //x: 50,
            //y: 0
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: false,
            data: ['危险等级指数']
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: false }
            }
        },
        calculable: true,
        grid: {
            borderWidth: 0,
            x: 30, x2: 0,
            y: 40,
            y2: 36
        },
        xAxis: [
            {
                splitLine: { show: false },
                axisTick: { show: false },
                splitArea: { show: false },
                axisLine: {
                    lineStyle: {
                        color: '#000', width: 1
                    }
                },
                axisLabel: { 'interval': 0, rotate: 0, textStyle: { color: '#242d3a', fontFamily: '微软雅黑', fontSize: 8 } },
                data: ['暴雨', '台风', '洪水', '风暴潮','地震','滑坡\n泥石流', '雪灾', '冰雹', '雷电']
            }
        ],
        yAxis: [
            {
                splitLine: { show: false },
                axisLine: {
                    lineStyle: {
                        color: '#000', width: 1
                    }
                },
                axisLabel: { textStyle: { color: '#242d3a', fontFamily: '微软雅黑', fontSize: 8 } }
            }
        ],
        series: [
            {
                name: '危险等级指数',
                type: 'bar',
                barCategoryGap: '50%',
                itemStyle: dataStyle,
                data: FXZSData 
            }
        ]
    };
    Chart_WXDJ.setOption(option, true);
}


//查询区域统计指标
function Query_QYFXZB() {

    var LayerDiv = Query_CurJson.marketlayer.div;
    $(LayerDiv).css({ zIndex: 3000 });
    LayerDiv = Query_CurJson.arealayer.div;
    $(LayerDiv).css({ zIndex: 2550 });
    Query_CurJson.marketlayer.setVisibility(true);
    Query_CurJson.arealayer.setVisibility(true);


    Query_CurJson.type = 2;
    var NewCode = (Query_CurJson.areacode + "000000").substr(0, 6);
    $.ajax({
        url: "/views/xtmh/wdcx.aspx?Action=WDCX_GetQYList",
        type: 'post',
        data: { areacode: NewCode, seccode: U_Token },
        cache: false,
        success: function (text) {
            var info = eval("(" + text + ")");
            var FXInfo = info.data;
            var DZInfo = info.data_1;
            WDBG_QY_Json.staticlayer = [];
            var val_1 = 0, val_2 = 0, val_3 = 0, val_4 = 0, val_5 = 0, val_6 = 0, val_7 = 0, val_8 = 0;
            $("#QYCXTable tr").each(function () {
                var fxtype = $(this).find("td").eq(0).attr('value');
                $(this).find("td").eq(1).html("");
                $(this).find("td").eq(2).html("");
                $(this).find("td").eq(3).html("");
                $(this).find("td").eq(4).html("");
                $(this).find("td").eq(5).html("");
                $(this).find("td").eq(6).html("");
                $(this).find("td").eq(7).html("");
                $(this).find("td").eq(8).html("");
                var fxlx = FXZT_FS_Config.xhys[fxtype];
                var staticinfo = [];
                for (var i = 0; i < FXInfo.length; i++) {
                    if (fxlx == FXInfo[i]["type"]) {
                        val_1 = delHtmlTag(parseFloat(FXInfo[i]["max"]).toFixed(2));
                        val_2 = delHtmlTag(parseFloat(FXInfo[i]["min"]).toFixed(2));
                        val_3 = delHtmlTag(parseFloat(FXInfo[i]["mean"]).toFixed(2));
                        val_4 = delHtmlTag(parseFloat(FXInfo[i]["std"]).toFixed(2));
                        val_5 = delHtmlTag(parseFloat(FXInfo[i]["var"]).toFixed(2));
                        val_6 = delHtmlTag(parseFloat(FXInfo[i]["v25"]).toFixed(2));
                        val_7 = delHtmlTag(parseFloat(FXInfo[i]["v50"]).toFixed(2));
                        val_8 = delHtmlTag(parseFloat(FXInfo[i]["v75"]).toFixed(2));

                        $(this).find("td").eq(1).html(val_1);
                        $(this).find("td").eq(2).html(val_2);
                        $(this).find("td").eq(3).html(val_3);
                        $(this).find("td").eq(4).html(val_4);
                        $(this).find("td").eq(5).html(val_5);
                        $(this).find("td").eq(6).html(val_6);
                        $(this).find("td").eq(7).html(val_7);
                        $(this).find("td").eq(8).html(val_8);
                        staticinfo.push(delHtmlTag($(this).find("td").eq(0).html()));
                        staticinfo.push(val_1);
                        staticinfo.push(val_2);
                        staticinfo.push(val_3);
                        staticinfo.push(val_4);
                        staticinfo.push(val_5);
                        staticinfo.push(val_6);
                        staticinfo.push(val_7);
                        staticinfo.push(val_8);
                        WDBG_QY_Json.staticlayer.push(staticinfo);
                        break;
                    }
                }
            });

            $("#QYCXTable_1 tr").each(function () {
                var staticinfo = [];
                for (var i = 0; i < DZInfo.length; i++) {
                    val_1 = delHtmlTag(parseFloat(DZInfo[i]["A_Less05"]).toFixed(2).toString());
                    val_2 = delHtmlTag(parseFloat(DZInfo[i]["A_Equal05"]).toFixed(2).toString());
                    val_3 = delHtmlTag(parseFloat(DZInfo[i]["A_Equal10"]).toFixed(2).toString());
                    val_4 = delHtmlTag(parseFloat(DZInfo[i]["A_Equal15"]).toFixed(2).toString());
                    val_5 = delHtmlTag(parseFloat(DZInfo[i]["A_Equal20"]).toFixed(2).toString());
                    val_6 = delHtmlTag(parseFloat(DZInfo[i]["A_Equal30"]).toFixed(2).toString());
                    val_7 = delHtmlTag(parseFloat(DZInfo[i]["A_NoLess40"]).toFixed(2).toString());

                    $(this).find("td").eq(1).html(val_1);
                    $(this).find("td").eq(2).html(val_2);
                    $(this).find("td").eq(3).html(val_3);
                    $(this).find("td").eq(4).html(val_4);
                    $(this).find("td").eq(5).html(val_5);
                    $(this).find("td").eq(6).html(val_6);
                    $(this).find("td").eq(7).html(val_7);
                    $(this).find("td").eq(8).html("");
                    $(this).find("td").eq(1).attr("title", val_1);
                    $(this).find("td").eq(2).attr("title", val_2);
                    $(this).find("td").eq(3).attr("title", val_3);
                    $(this).find("td").eq(4).attr("title", val_4);
                    $(this).find("td").eq(5).attr("title", val_5);
                    $(this).find("td").eq(6).attr("title", val_6);
                    $(this).find("td").eq(7).attr("title", val_7);
                    staticinfo.push(delHtmlTag($(this).find("td").eq(0).html()));
                    staticinfo.push(val_1);
                    staticinfo.push(val_2);
                    staticinfo.push(val_3);
                    staticinfo.push(val_4);
                    staticinfo.push(val_5);
                    staticinfo.push(val_6);
                    staticinfo.push(val_7);
                    staticinfo.push("");
                    WDBG_QY_Json.staticlayer.push(staticinfo);
                }
            });
            $("#QYCX_Panal").show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            mini.alert(jqXHR.responseText);
        }
    });
}

//查询输出报告
function Query_SCBG(bs) {
    $("#BDCX_Panal").hide();
    $("#QYCX_Panal").hide();
    if (bs == 1) {
        if (Query_CurJson.type ==1) {
            $("#BDCX_Panal").show();
            $("#BDCX_Panal").css("left", 258);
        }
        else {
            mini.alert("请您查询以便确定生成报告的点位");
        }
    }
    else if (bs == 2) {
        if (Query_CurJson.type == 2) {
            $("#QYCX_Panal").show();
        }
        else {
            mini.alert("请您定位生成报告的区域");
        }
    }
}

//获取点位风险专题属性
function Query_GridInfo(url, lng, lat, dsname, dtname, mapname,xh) {
    if (!!lng) {
        var gridCellQueryParam = new SuperMap.REST.GetGridCellInfosParameter({
            mapname: mapname,
            xh:xh,
            datasetName: dtname,
            dataSourceName: dsname,
            X: lng,
            Y: lat
        });
        var gridCellQueryService = new SuperMap.REST.GetGridCellInfosService(url, {
            'eventListeners': {
                'processCompleted': QueryGridSuccess,
                'processFailed': QueryFailed
            },'xh':xh
        });
        gridCellQueryService.processAsync(gridCellQueryParam);
    } else {
        alert("地理位置错误！");
    }
}
//专题属性查询成功
function QueryGridSuccess(evt) {
    var result = evt.result;
    var strHtml = "";
    Query_FXZTLayer.succnum += 1;
    for(var objName in result) {
        if (result.hasOwnProperty(objName)) {
            if (objName == "value") {
                var xh = evt.object.xh;
                var ArrXH = xh.toString().split("_");
                if (ArrXH.length == 2) {
                    Query_BMCXInfo[parseInt(ArrXH[0])].fxinfo[parseInt(ArrXH[1])][1] = result[objName].toFixed(2);
                }
                else {
                    if (Query_FXZTLayer.querytype == "morecx") {
                        $(".FXZT_MoreVal[value='" + xh + "']").parent().next().html(result[objName].toFixed(2));
                    }
                    else {
                        Query_FXZTLayer.querylayer[parseInt(xh)]["val"] = result[objName].toFixed(2);
                    }
                }
                break;
            }
        }       
    }
    if (Query_FXZTLayer.quenum == Query_FXZTLayer.succnum) {
        if (Query_FXZTLayer.querytype != "morecx") {
            QueryShowResult();
        }
    }
}
//专题属性查询失败
function QueryFailed(evt) {
    Query_FXZTLayer.succnum += 1;
    var xh = evt.object.xh;
    var ArrXH = xh.toString().split("_");
    if (ArrXH.length == 2) {
    }
    else {
        if (Query_FXZTLayer.querytype != "morecx") {
            Query_FXZTLayer.querylayer[parseInt(xh)]["val"] = "0";
        }
    }
    if (Query_FXZTLayer.quenum == Query_FXZTLayer.succnum) {
        QueryShowResult();
    }
}

//获取点位矢量专题属性
function Query_VectorInfo(url, lng, lat, dsname, dtname, mapname, xh) {
    if (!!lng) {
        var point = new SuperMap.Geometry.Point(lng, lat);
        var getFeaturesByGeometryParameters, getFeaturesByGeometryService;
        getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters({
            xh: xh,
            datasetNames: [dsname + ":" + dtname],
            toIndex: -1,
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
            geometry: point
        });
        getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(url, {
            eventListeners: {
                "processCompleted": QueryVectorSuccess,
                "processFailed": QueryVectorFailed
            }, 'xh': xh
        });
        getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
    } else {
        alert("地理位置错误！");
    }
}
//矢量专题属性查询成功
function QueryVectorSuccess(evt) {
    var result = evt.result.features;
    Query_FXZTLayer.succnum += 1;
    if (result.length > 0) {
        Query_FXZTLayer.querylayer[parseInt(4)]["val"] = parseFloat(result[0].attributes.PGA).toFixed(2);
    }
    if (Query_FXZTLayer.quenum == Query_FXZTLayer.succnum) {
        if (Query_FXZTLayer.querytype != "morecx") {
            QueryShowResult();
        }
    }
}
//矢量专题属性查询失败
function QueryVectorFailed(evt) {
    Query_FXZTLayer.succnum += 1;
    if (Query_FXZTLayer.quenum == Query_FXZTLayer.succnum) {
        QueryShowResult();
    }
}


//显示属性查询结果
function QueryShowResult() {
    if (Query_FXZTLayer.querytype == "dwcx") {

        var LayerDiv = Query_CurJson.marketlayer.div;
        $(LayerDiv).css({ zIndex: 3000 });
        LayerDiv = Query_CurJson.arealayer.div;
        $(LayerDiv).css({ zIndex: 2550 });
        Query_CurJson.marketlayer.setVisibility(true);
        Query_CurJson.arealayer.setVisibility(true);


        var Arr_DJDT = ["rain_hazard_scale", "typhoon_hazard_scale", "flood_hazard_scale_1km", "stormsurge_hazard_scale_1km_re",
            "landslide_hazard_scale", "snowstorm_hazard_scale", "hail_hazard_scale", "thunderstorm_hazard_scale"];
        var strHtml = '<div class="Info_WinCon" style="overflow-x:hidden;overflow-y:auto;">';
        strHtml += '<div class="InfoChartHead">综合风险等级指数&nbsp;&nbsp;值域：0-10</div>';
        var strTable_0 = "";
        var strTable = '<table cellpadding="0" cellspacing="0" class="InfoChart" style="margin-top:20px !important;">';
        var strTable_1 = '<table cellpadding="0" cellspacing="0" class="InfoChart_1" style="margin-top:0px !important;">';
        strTable_1 += '<tr style="height:2px;"><td></td><td></td></tr>';
        var strTable_2 = "";
        for (var i = 0; i < Query_FXZTLayer.querylayer.length; i++) {
            var width = 0;
            var qsz = parseFloat(Query_FXZTLayer.querylayer[i].minval);
            var jsz = parseFloat(Query_FXZTLayer.querylayer[i].maxval);
            var skz = parseFloat(Query_FXZTLayer.querylayer[i].val);
            if (isNaN(skz)) {
                skz = 0;
            }
            else {
                if (skz > jsz) {
                    skz = 0;
                }
                width = parseInt(skz/(jsz-qsz)* 100);
            }
            var alltext = Query_FXZTLayer.querylayer[i].mapname;
            var dsname = Query_FXZTLayer.querylayer[i].dsname;
            var dtname = Query_FXZTLayer.querylayer[i].dtname;
            if ($.inArray(dtname, Arr_DJDT) < 0) {
                if (dtname == "eq_hazard_pga_475a") {
                    width = parseInt(skz / (jsz - qsz) * 100);
                    var jhname = FXZT_FS_Config.nameys[dsname];
                    strTable_0 += '<tr><td name="col1" title="' + alltext + '">' + jhname + '</td>' +
                                '<td><div name="con_bj" style="width:100px;">' +
                                '<div name="jsz">' + jsz + '</div>' +
                                '<div style="width:' + width + 'px;" name="con_sk"></div><div name="qsz">' + qsz + '</div><div name="skz" style="width:50px">' + skz + '<span name="dw">PGA</span></div>' +
                                '</div></td></tr>';
                }
                else {
                    width = parseInt(skz / (jsz - qsz) * 145);
                    strTable_2 += '<tr><td name="col1" title="' + alltext + '">' + alltext + '</td>' +
                                '<td><div name="con_bj">' +
                                '<div name="jsz">' + jsz + '</div>' +
                                '<div style="width:' + width + 'px;" name="con_sk"></div><div name="qsz">' + qsz + '</div><div name="skz">' + skz + '</div>' +
                                '</div></td></tr>';
                }
            }
            else {
                
                var jhname = FXZT_FS_Config.nameys[dsname];
                strTable += '<tr><td name="col1" title="' + alltext + '">' + jhname + '</td>' +
                            '<td><div name="con_bj">' +
                            '<div style="width:' + width + 'px;" name="con_sk"></div><div name="skz">' + skz + '</div>' +
                            '</div></td></tr>';
            }
        }
        strTable += strTable_0;
        strTable += '</table>';
        if (strTable_2 != "") {
            strTable_2 = strTable_1 + strTable_2 + '</table>';
        }
        strHtml += strTable + strTable_2 + '</div>';
        var point = new SuperMap.LonLat(parseFloat(Query_FXZTLayer.lng), parseFloat(Query_FXZTLayer.lat));
        InfoWin_Json = { content: strHtml, point: point };
        if (Query_FXZTLayer.sfdw == 0) {
            map.setCenter(point, 10);
        }
        SetMapKS(1);
        ShowInfoWin();
        $("#Prop_Close2").show();
        $("#Prop_Close1").hide();
        Query_DrawWXZSChart();
    }
    else {
        for (var i = 0; i < Query_BMCXInfo.length; i++) {
            var ZTInfo = Query_BMCXInfo[i].fxinfo;
            for (var j = 0; j < ZTInfo.length; j++) {
                var name = ZTInfo[j][0];
                var val = ZTInfo[j][1];
                SJGL_Data_Json[i][name] = val;
            }
        }
        mini.hideMessageBox(SJGL_BMMessage);
    }
}

//点击信息窗口时设置查询状态为不可查
function ClickInfoWin() {
    InfoWin_Json.clickbs = 1;
}
//关闭信息窗口
function ClickInfoWinClose() {
    InfoWin_Json.clickbs = 1;
    $("#Prop_Info").hide();
}

//点击属性查询窗口   clickbs=0，启动属性查询  =1关闭属性查询
function OpenInfoWin(obj) {
    InfoWin_Json.clickbs = 0;
    var img = $(obj).attr("src");
    if (img == "/images/tool/M0_详情.png") {
        Tool_ClearLayer();
        $(obj).attr("src", "/images/tool/M1_详情.png");
        map.events.on({ 'click': GetZTInfo });
    }
    else {
        $(obj).attr("src", "/images/tool/M0_详情.png");
        map.events.un({"click":GetZTInfo});
        Tool_ClearLayer();
    }
}

//获取专题查询信息
function GetZTInfo(e) {
    if (InfoWin_Json.clickbs != 1) {
        Query_CurJson.U_QNum = parseInt(Query_CurJson.U_QNum) + 1;
        if (Query_CurJson.U_QNum > 2000) {
            mini.alert("您今天的查询次数已用完,请明天继续!");
            return;
        }
        Query_FXZTLayer.sfdw = 1;
        LocationGetPlace();
        var random = Math.random();
        var img = document.getElementById("fxzttj");
        img.src = "/views/comm/querytj.aspx?" + random + "&Action=Query&seccode=" + U_Token;
        img.click();
    }
    else {
        InfoWin_Json.clickbs = 0;
    }
}

// 我的查询-标的定位查询风险等级
function GetDWCXInfo() {
    Query_FXZTLayer.querytype = "dwcx";
    Query_FXZTLayer.lng = Query_CurJson.cenx;
    Query_FXZTLayer.lat = Query_CurJson.ceny;
    Query_FXZTLayer.succnum = 0;

    Query_FXZTLayer.querylayer = Query_FXZTLayer.djlayer.concat(Query_FXZTLayer.lslayer);
    Query_FXZTLayer.quenum = Query_FXZTLayer.querylayer.length;
    for (var i = 0; i < Query_FXZTLayer.querylayer.length; i++) {
        Query_FXZTLayer.querylayer[i].val = "";
        var url = mapurl + "/iserver/services/data-" + Query_FXZTLayer.querylayer[i].dsname + "/rest/data";
        var dsname = Query_FXZTLayer.querylayer[i].dsname;
        var dtname = Query_FXZTLayer.querylayer[i].dtname;
        var mapname = Query_FXZTLayer.querylayer[i].mapname;
        if (dtname == "eq_hazard_pga_475a") {
            Query_VectorInfo(url, Query_FXZTLayer.lng, Query_FXZTLayer.lat, dsname, dtname, mapname, i);
        }
        else {
            Query_GridInfo(url, Query_FXZTLayer.lng, Query_FXZTLayer.lat, dsname, dtname, mapname, i);
        }
    }
}

//我的查询-标的定位查询风险等级
function GetBMCXInfo() {
    Query_FXZTLayer.querytype = "bmcx";
    Query_FXZTLayer.succnum = 0;
    Query_FXZTLayer.querylayer = Query_FXZTLayer.djlayer;
    Query_FXZTLayer.quenum = Query_FXZTLayer.querylayer.length * Query_BMCXInfo.length;
    for (var j = 0; j < Query_BMCXInfo.length; j++) {
        var lng = Query_BMCXInfo[j].point[0];
        var lat = Query_BMCXInfo[j].point[1];
        for (var i = 0; i < Query_FXZTLayer.querylayer.length; i++) {
            if (lng == "" || lat == "") {
                Query_FXZTLayer.succnum += 1;
            }
            else {
                var url = mapurl + "/iserver/services/data-" + Query_FXZTLayer.querylayer[i].dsname + "/rest/data";
                var dsname = Query_FXZTLayer.querylayer[i].dsname;
                var dtname = Query_FXZTLayer.querylayer[i].dtname;
                var mapname = Query_FXZTLayer.querylayer[i].mapname;
                if (dtname == "eq_hazard_pga_475a") {
                    Query_VectorInfo(url, lng, lat, dsname, dtname, mapname, j + "_" + i);
                }
                else {
                    Query_GridInfo(url, lng, lat, dsname, dtname, mapname, j + "_" + i);
                }
            }
        }
    }
}

//清除查询相关内容
function Query_ClearLayer() {
    try
    {
        $("#Prop_Info").hide();
        Query_CurJson.arealayer.removeAllFeatures();
        Query_CurJson.marketlayer.clearMarkers();
        $("#keySearch").val("");
        Query_CurJson.qybounds = "";
        BDCX_ClearLayer();
        WDBG_ClearLayer();

        Query_CurJson.type = -1;
        Query_CurJson.marketlayer.setVisibility(false);
        Query_CurJson.arealayer.setVisibility(false);
    }
    catch(ex){}
}

//经纬度查询重置
function CXDW_ResetJWD() {
    $("#lngSearch").val("");
    $("#latSearch").val("");
    Query_ClearLayer();
}

//初始化标的查询及区域查询
function BDCX_ClearLayer() {
    try {
        if (Query_CurJson.type == "1") {
            NavTabQH_1('BDCX', 1);
            $("#BDCXDiv3 input[type='checkbox']").each(function () {
                if (this.checked) {
                    this.checked = false;
                }
            });
            $("#BDCXDiv3 span[name='Val']").html("");
            $("#BDCX_Panal").hide();
        }
        else {
            $("#QYCXDiv1 input[type='checkbox']").each(function () {
                if (this.checked) {
                    this.click();
                }
            });
            $("#QYCX_Panal").hide();
        }
    }
    catch (ex) { }
}

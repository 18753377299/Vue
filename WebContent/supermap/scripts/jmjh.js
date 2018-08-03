// 预警（包括台风和气象）
var ZDY_Info_Layer = [];
var BHEdit_SJLX = [{ text: '低洼易涝' }];
var Cur_SSQueryInfo = {type:"",sfsf:false};// dz、hpnsl、yfq、qxyj

var YPSQ_Pos = { X: 1000, Y: 500, Cur_BS: "WDCX" };
var Cur_ScreenState = "0";  //0为打印保存  1为标的报告输出  2为区域报告输出  3为自定义区域报告输出
var SFAZPrint = "否";
//----------------------------------------------------------

function SetCurCity() {
    if (Cur_SSQueryInfo.type != "") {
        if (Cur_SSQueryInfo.type == "fxyj") {
            //FXYJ_GetQueryRes(1);
            //FXYJ_ZoomEnd();
            FXYJ_ZoomControl();
        }
        if (Cur_SSQueryInfo.type == "hpnsl") {
            if (map.getZoom() > 8) {
                LSZH_QueryLayer.setVisibility(true);
                LSZH_JHLayer.setVisibility(false);
            } else {
                $("#Prop_Info").hide();
                LSZH_QueryLayer.setVisibility(false);
                LSZH_JHLayer.setVisibility(true);
            }
        }
        if (Cur_SSQueryInfo.type == "lsdz") {
            LSZH_DZ_ReSetOption(LSZH_DZ_Option);
            LSZH_Chart.setOption(LSZH_DZ_Option, {});
            //if (map.getZoom() > 9) {
            //    SetMapKS(1);
            //}
            //else {
            //    SetMapKS(2);
            //}
        }
    }
}

//设置地图范围
function SetMapBound(ArrLng, ArrLat) {
    var left = 0, bottom = 0, right = 0, top = 0;
    left = Math.min.apply(null, ArrLng);
    right = Math.max.apply(null, ArrLng);
    bottom = Math.min.apply(null, ArrLat);
    top = Math.max.apply(null, ArrLat);
    var bounds = new SuperMap.Bounds(left, bottom, right, top);
    map.zoomToExtent(bounds, false);
    ArrLng = [];
    ArrLat = [];
}

function SetBoundParams(ArrLng, ArrLat) {
    var left = 0, bottom = 0, right = 0, top = 0;
    left = Math.min.apply(null, ArrLng);
    right = Math.max.apply(null, ArrLng);
    bottom = Math.min.apply(null, ArrLat);
    top = Math.max.apply(null, ArrLat);
    Query_CurJson.cenx = (left + right) / 2;
    Query_CurJson.ceny = (top + bottom) / 2;
    WDBG_QY_Json.bounds = [left, bottom, right, top];
    Query_CurJson.qybounds = left + "," + bottom + "," + right + "," + top;
    ArrLng = [];
    ArrLat = [];
}

//$(document).ready(function () {
function Init_JMJH() {
    YPSQ_Pos.X = JMObjW - 35;
    YPSQ_Pos.Y = JMObjH + 21;
    GetWinGK();
    //======一级导航======
    $("#NavPanal div[name='Head']").click(function () {
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0];
        if (YPSQ_Pos.Cur_BS != bs) {
            YPSQ_Pos.Cur_BS = bs;
            Nav_YPSetImg(bs);
        }
        $(".NavPanal div[name='Content']").hide();
        $("#" + bs + "_Panal div[name='Content']").animate({ width: 'toggle', opacity: 'toggle' }, "slow");
        Nav_EJ_Control(bs);
    });
    //======我的查询-二级导航======
    $("#WDCX_Content_Panal div[name='EJ_Head']").click(function () {
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0] + "_" + id.split("_")[1];
        $("#WDCX_Content_Panal div[name='EJ_Content']").hide();
        $(this).next().show();
    });
    //======我的数据-二级导航======
    $("#WDSJ_Content_Panal div[name='EJ_Head']").click(function () {
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0] + "_" + id.split("_")[1];
        $("#WDSJ_Content_Panal div[name='EJ_Content']").hide();
        $(this).next().show();
    });
    //======风险专题-二级导航======
    $("#FXZT_Content_Panal div[name='EJ_Head']").click(function () {
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0] + "_" + id.split("_")[1];
        $("#FXZT_Content_Panal div[name='EJ_Content']").hide();
        $(this).next().show();
    });
    //======灾害预警-二级导航======
    $("#ZHYJ_Content_Panal div[name='EJ_Head']").click(function () {
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0] + "_" + id.split("_")[1];
        $("#ZHYJ_Content_Panal div[name='EJ_Content']").hide();
        $(this).next().show();
        if (this.id == "ZHYJ_QXYJ_Head") {
            FullMap();
            SetMapKS(1);
            LSTF_ClearLayer();
            LSZH_ClearLegend();
            Cur_SSQueryInfo.type = "fxyj";
            FXYJ_GetAllList();
            //OpenQXYJ();
            WDSJ_ClearLayer();
            selectGraphic.activate();
            if (LSZH_QueryLayer != null) {
                LSZH_SelGraphic.deactivate();
            }
        }
        if (this.id == "ZHYJ_TFYJ_Head") {
            SetMapKS(1);
            FXYJ_ClearLayer();
            SSLJ_GetList();
        }
    });
    //======历史灾害-台风面板切换======
    $("#ZHLS_QH").click(function () {
        var val = $("#ZHLS_LSTF_Panal").is(":hidden");
        if (val == false) {
            $("#ZHLS_LSTF_Panal").hide();
            $("#ZHLS_LSTF_Con").hide();
            $("#ZHLS_SJZ_Panal").show();
            $("#ZHLS_SJZ_Con").show();
        }
        else {
            $("#ZHLS_LSTF_Panal").show();
            $("#ZHLS_LSTF_Con").show();
            $("#ZHLS_SJZ_Panal").hide();
            $("#ZHLS_SJZ_Con").hide();
        }
        $("#ZHLS_DZ_Con").hide();
        $("#ZHLS_HPNSL_Con").hide();
        $("#ZHLS_YFQ_Con").hide();
        LSTF_ClearLayer();
        LSZH_ClearQueryLayer();
    });
    $("#HPNSL_QH").click(function () {
        //$("#LSZHYFQSL_TD").html($("#LSZHResSum"));
        //$("#LSZHYFQSL_TR").show();
        $("#ZHLS_HPNSL_Panal").hide();
        $("#ZHLS_HPNSL_Con").hide();
        $("#ZHLS_YFQ_Panal").show();
        $("#ZHLS_YFQ_Con").show();
        LSTF_ClearLayer();
        LSZH_ClearQueryLayer();
        
    });
    $("#YFQ_QH").click(function () {
        //$("#LSZHHPNSLSL_TD").html($("#LSZHResSum"));
        //$("#LSZHHPNSLSL_TR").show();
        $("#ZHLS_HPNSL_Panal").show();
        $("#ZHLS_HPNSL_Con").show();
        $("#ZHLS_YFQ_Panal").hide();
        $("#ZHLS_YFQ_Con").hide();
        LSTF_ClearLayer();
        LSZH_ClearQueryLayer();
        $("#HPNSL_QHDiv").show();
    });
    $("#ZHLS_DZ_Head").click(function () {
        //$("#LSZHDZSL_TD").html($("#LSZHResSum"));
        //$("#LSZHDZSL_TR").show();
    });
    $("#ZHLS_HPNSL_Head").click(function () {
        //$("#LSZHHPNSLSL_TD").html($("#LSZHResSum"));
        //$("#LSZHHPNSLSL_TR").show();
        $("#HPNSL_QHDiv").show();
    });
    $("#ZHLS_YFQ_Head").click(function () {
        //$("#LSZHYFQSL_TD").html($("#LSZHResSum"));
        //$("#LSZHYFQSL_TR").show();
    });

    //======历史灾害-二级导航======
    $("#ZHLS_Content_Panal div[name='EJ_Head']").click(function () {
        LSTF_ClearLayer();
        LSZH_ClearQueryLayer();
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0] + "_" + id.split("_")[1];
        $("#ZHLS_Content_Panal div[name='EJ_Content']").hide();
        $(this).next().show();
        //$("#LSZHResSum").val(parseInt(Query_LSZHJson.pagesize));
        if ($(this).attr('id') == "ZHLS_DZ_Head") {
            FullMap();
            SetMapKS(2);
            Begin_Query_DZ();
        }
        if ($(this).attr('id') == "ZHLS_HPNSL_Head") {
            SetMapKS(1);
            FullMap();
            Begin_Query_HPNSL();
        }
        if ($(this).attr('id') == "ZHLS_SJZ_Head") {
            SetMapKS(1);
        }
        if ($(this).attr('id') == "ZHLS_LSTF_Head") {
            SetMapKS(1);
        }
    });

    //======灾害预警-二级导航======
    $("#WDBG_Content_Panal div[name='EJ_Head']").click(function () {
        var id = $(this).parent().attr('id');
        var bs = id.split("_")[0] + "_" + id.split("_")[1];
        $("#WDBG_Content_Panal div[name='EJ_Content']").hide();
        $(this).next().show();
    });

    //======导航面板收缩======
    $("#ZKZDImg").click(function () {
        var val = $("#NavPanal").is(":hidden");
        var NavControl = $(".smControlPanZoomBar");
        var CityControl = $(".BMap_CityListCtrl");
        if (val == true) {
            $("#NavPanal").animate({ width: 'toggle', opacity: 'toggle' }, "slow");
            $("#ZKZDPanal").animate({ left: '256px' }, "slow");
            $(this).attr("src", "/images/nav/收回.png");
            $(NavControl).animate({ left: '262px' }, "slow");
            //$(CityControl).animate({ left: '331px' }, "slow");
        }
        else {
            $("#NavPanal").animate({ width: 'toggle', opacity: 'toggle' }, "slow");
            $("#ZKZDPanal").animate({ left: '0px' }, "slow");
            $(this).attr("src", "/images/nav/拉出.png");
            $(NavControl).animate({ left: '6px' }, "slow");
            //$(CityControl).animate({ left: '75px' }, "slow");
        }
    });

    //======工具面板收缩======
    $("#ZKZDToolImg").click(function () {
        var val = $("#T_Menu").is(":hidden");
        if (val == true) {
            $("#T_Menu").show({
                duration: 500,
            });
            $(this).attr("src", "/images/tool/收回.png");
        }
        else {
            $("#T_Menu").hide({
                duration: 500,
            });
            $(this).attr("src", "/images/tool/拉出.png");
        }
    });
}
//});

//======页面窗口大小调整======
function WinResize() {
    $("#map").css("width", JMObjW);
    setTimeout(function () {
        myChart.resize();
    }, 200);
}

//======初始化导航面板======
function GetWinGK() {
    var CZKJH = JMObjH - (8 * 36);
    $(".NavPanal div[name='Content']").css("height", CZKJH);
    $("#JCSJ_Content_Panal").css("height", CZKJH - 5);
    var CZKJH_2 = CZKJH - 2 * 31;
    var CZKJH_3 = CZKJH - 3 * 31;
    $("#WDCX_MC_Con").css("height", CZKJH_2);
    $("#WDCX_JWD_Con").css("height", CZKJH_2);

    $("#WDSJ_SJ_Con").css("height", CZKJH_2);
    $("#WDSJ_ZT_Con").css("height", CZKJH_2);

    $("#FXZT_DJT_Con").css("height", CZKJH_2);
    $("#FXZT_More_Con").css("height", CZKJH_2);

    $("#ZHYJ_TFYJ_Con").css("height", CZKJH_2);

    $("#ZHLS_LSTF_Con").css("height", CZKJH_3);
    $("#ZHLS_SJZ_Con").css("height", CZKJH_3);
    $("#ZHLS_DZ_Con").css("height", CZKJH_3);
    $("#ZHLS_HPNSL_Con").css("height", CZKJH_3);
    $("#ZHLS_YFQ_Con").css("height", CZKJH_3);
    $("#ZHLS_LSTF_List").css("height", CZKJH_3 - 138);

    //$("#WDBG_ZDYBG_Con").css("height", CZKJH_3);

    $("#WDCX_Panal").prependTo($("#NavPanal"));
    $(".NavPanal div[name='Content']").hide();
    $("#WDCX_Panal div[name='Content']").show();
}
//======圆盘导航======
function Nav_YPControl(bs) {
    $(".NavPanal div[name='Content']").hide();
    $("#" + bs + "_Panal div[name='Content']").show();
    Nav_EJ_Control(bs);
    //$("#NavYP").fadeOut(1000);
    //$("#Nav_YPSQ").fadeIn(1000);
}
//======设置圆盘状态======
function Nav_YPSetImg(bs) {
    var $YP = $("#NavYP"),
    $WY = $("#NavYP_WY"),
    $NY = $("#NavYP_NY");
    if (bs == "WDCX") {
        $NY.attr("src", "/navyp/images/内圆_我的查询.png");
        $WY.attr("src", "/navyp/images/外圆.png");
        $WY.hide();
    }
    else if (bs == "WDSJ") {
        $NY.attr("src", "/navyp/images/内圆_我的数据.png");
        $WY.attr("src", "/navyp/images/外圆.png");
        $WY.hide();
    }
    else if (bs == "FXZT") {
        $NY.attr("src", "/navyp/images/内圆_风险地图.png");
        $WY.attr("src", "/navyp/images/外圆.png");
        $WY.hide();
    }
    else if (bs == "ZHYJ") {
        $NY.attr("src", "/navyp/images/内圆_灾害预警.png");
        $WY.attr("src", "/navyp/images/外圆.png");
        $WY.hide();
    }
    else if (bs == "ZHLS") {
        $WY.attr("src", "/navyp/images/外圆_灾害历史.png");
        $NY.attr("src", "/navyp/images/内圆_更多.png");
    }
    else if (bs == "WDBG") {
        $WY.attr("src", "/navyp/images/外圆_我的报告.png");
        $NY.attr("src", "/navyp/images/内圆_更多.png");
    }
    else if (bs == "ZS") {
        $WY.attr("src", "/navyp/images/外圆_再商.png");
        $NY.attr("src", "/navyp/images/内圆_更多.png");
    }
    else if (bs == "JCSJ") {
        $WY.attr("src", "/navyp/images/外圆_基础数据.png");
        $NY.attr("src", "/navyp/images/内圆_更多.png");
    }
    $("#NavYP").fadeOut(1000);
    $("#Nav_YPSQ").fadeIn(1000);
}
//======圆盘二级导航======
function Nav_EJ_Control(bs) {
    if (bs == "WDCX") {
        SetMapKS(1);
        Tool_ClearLayer();
        Query_ClearLayer();
        WDSJ_ClearLayer();
        LSTF_ClearLayer();
    }
    if (bs == "WDSJ") {
        SetMapKS(0);
        Tool_ClearLayer();
        Query_ClearLayer();
        WDSJ_ClearLayer();
        if (LSTF_SFSSTF == 1) {
            LSTF_ClearLayer();
            LSZH_ClearQueryLayer();
        }
        FXYJ_ClearLayer();
        if ($("#WDSJ_SJ_Con label").length < 1) {
            WDSJ_GetSJList("0");
        }
    }
    if (bs == "FXZT" || bs == "JCSJ") {
        SetMapKS(0);
    }
    if (bs == "ZHYJ") {
        SetMapKS(1);
        Tool_ClearLayer();
        Query_ClearLayer();
        WDSJ_ClearLayer();
        LSTF_ClearLayer();
        LSZH_ClearQueryLayer();
        FXYJ_ClearLayer();
    }
    if (bs == "ZHLS") {
        SetMapKS(1);
        Tool_ClearLayer();
        Query_ClearLayer();
        WDSJ_ClearLayer();
        LSTF_ClearLayer();
        LSZH_ClearQueryLayer();
        FXYJ_ClearLayer();
    }
    if (bs == "WDBG") {
        WDBG_InitDraw();
    }
    $("#NavPanal div[name='Head']").find("img").each(function () {
        var img = $(this).attr("src");
        if (img.indexOf("N1") >= 0) {
            var img1 = img.replace('N1', 'N0');
            $(this).attr("src", img1);
        }
    });
    var img = $("#" + bs + "_Head").find("img").attr("src");
    if (img.indexOf("N0") >= 0) {
        var img1 = img.replace('N0', 'N1');
        $("#" + bs + "_Head").find("img").attr("src", img1);
    }

    var val = $("#NavPanal").is(":hidden");
    if (val == true) {
        $("#NavPanal").animate({ width: 'toggle', opacity: 'toggle' }, "slow");
        $("#ZKZDPanal").animate({ left: '256px' }, "slow");
        $(this).attr("src", "/images/nav/收回.png");
    }
}
//======圆盘位置调整======
function MoveYPSQ() {
    var obj = document.getElementById("Nav_YPSQ");
    var objhead = document.getElementById("Nav_YPSQ_Head");
    objhead.onmousedown = function (e) {
        obj.style.position = "absolute";
        var drag_x = 0;
        var drag_y = 0;
        var draging = true;
        var moveing = false;
        var left = obj.offsetLeft;
        var top = obj.offsetTop;
        if (typeof document.all !== "undefined") {
            drag_x = event.clientX;
            drag_y = event.clientY;
            document.onmousemove = function (e) {
                if (draging === false) return false;
                moveing = true;
                obj.style.left = left + event.clientX - drag_x + "px";
                obj.style.top = top + event.clientY - drag_y + "px";
                YPSQ_Pos.X = left + event.clientX - drag_x;
                YPSQ_Pos.Y = top + event.clientY - drag_y;
            }
        } else {
            drag_x = e.pageX;
            drag_y = e.pageY;
            document.onmousemove = function (e) {
                if (draging === false) return false;
                moveing = true;
                obj.style.left = left + e.pageX - drag_x + "px";
                obj.style.top = top + e.pageY - drag_y + "px";
                YPSQ_Pos.X = left + event.clientX - drag_x;
                YPSQ_Pos.Y = top + event.clientY - drag_y;
            }
        }
        document.onmouseup = function () {
            if (moveing == false) {
                var JMObj = document.getElementById("CenterPanal");
                var JMObjH = JMObj.offsetHeight;
                var JMObjW = JMObj.offsetWidth;
                var X = YPSQ_Pos.X;
                var Y = YPSQ_Pos.Y;
                var YP_X = X - 125;
                var YP_Y = Y - 125;
                $("#NavYP").fadeIn(1000);
                $("#Nav_YPSQ").fadeOut(1000);

                if (YP_X <= 0) {
                    YP_X = 4;
                }
                else if ((YP_X + 312) >= JMObjW) {
                    YP_X = JMObjW - 316;
                }

                if (YP_Y <= 0) {
                    YP_Y = 4;
                }
                else if ((YP_Y +312) >= (JMObjH + 62)) {
                    YP_Y = JMObjH - 254;
                }
                $("#NavYP").css("left", YP_X);
                $("#NavYP").css("top", YP_Y);
            }
            draging = false;
            moveing = true;
        };
    }
}

//Tab切换
function NavTabQH(bs, xh) {
    $("td[name*=" + bs + "Tab]").attr("class", "Tab_wbj");
    $("td[name*=" + bs + "Tab" + xh + "]").attr("class", "Tab_ybj");
    $("div[name*=" + bs + "Div]").hide();
    $("div[name*=" + bs + "Div" + xh + "]").show();
}

//Tab_But切换
function NavTabQH_1(bs, xh) {
    $("input[name*=" + bs + "Tab]").attr("class", "SJGLBut");
    $("input[name*=" + bs + "Tab" + xh + "]").attr("class", "SJGLButSel");
    $("div[name*=" + bs + "Div]").hide();
    $("div[name*=" + bs + "Div" + xh + "]").show();
}

//灾害预警--气象预警
function OpenQXYJ() {
    $("#FXYJ_Panal").show();
    FXYJ_ZoomControl();
    //FXYJ_GetYJLX();
}

//==========工具==========
//全图
function FullMap() {
    var point = new SuperMap.LonLat(103.4, 35.55);
    map.setCenter(point, 4, false, true);
}
//最佳视角
function GoodViewMap() {
    var lng = 0, lat = 0;
    lng = Query_CurJson.cenx;
    lat = Query_CurJson.ceny;
    var point = null;
    if (lng == "" || lng == 0) {
        point = map.getCenter();
    }
    else {
        point = new SuperMap.LonLat(lng, lat);
    }
    var img = $("#Menu_DTQH").attr("src");
    if (img == "/images/tool/M1_地图.png") {
        map.setCenter(point, 14,false,true);
    }
    else {
        map.setCenter(point, 12, false, true);
    }
}
//放大
function MapZoomIn() {
    map.zoomIn();
}
//缩小
function MapZoomOut() {
    map.zoomOut();
}

function Set_PrintState(bs) {
    Cur_ScreenState = bs;
}

//切换地图
function SetMap2D(obj) {
    var img = $(obj).attr("src");
    if (img.indexOf("M1_地图") >= 0) {
        var img1 = img.replace('M1_地图', 'M1_影像');
        $(obj).attr("src", img1);
        $(obj).attr("title", "影像");
        DarkLayer.setVisibility(false);
        tiandituLayer.setVisibility(false);
        tianMarkerLayer.setVisibility(false);
        tiandituImgLayer.setVisibility(true);
        tianImgMarkerLayer.setVisibility(true);
        CurMap_Json.maptype = 1;
    }
    else if (img.indexOf("M1_影像") >= 0) {
        var img1 = img.replace('M1_影像', 'M1_简化');
        $(obj).attr("src", img1);
        $(obj).attr("title", "简化");
        DarkLayer.setVisibility(true);
        tiandituLayer.setVisibility(false);
        tianMarkerLayer.setVisibility(false);
        tiandituImgLayer.setVisibility(false);
        tianImgMarkerLayer.setVisibility(false);
        CurMap_Json.maptype = 2;
    }
    else {
        var img1 = img.replace('M1_简化', 'M1_地图');
        $(obj).attr("src", img1);
        $(obj).attr("title", "地图");
        DarkLayer.setVisibility(false);
        tiandituLayer.setVisibility(true);
        tianMarkerLayer.setVisibility(true);
        tiandituImgLayer.setVisibility(false);
        tianImgMarkerLayer.setVisibility(false);
        CurMap_Json.maptype = 0;
    }
}
//快速切换地图
function SetMapKS(bs) {
    var val = bs;
    if (val == 0) {
        $("#Menu_DTQH").attr("src", "/images/tool/M1_影像.png");
        $("#Menu_DTQH").attr("title", "影像");
        DarkLayer.setVisibility(false);
        tiandituLayer.setVisibility(true);
        tianMarkerLayer.setVisibility(true);
        tiandituImgLayer.setVisibility(false);
        tianImgMarkerLayer.setVisibility(false);
        CurMap_Json.maptype = 0;
    }
    else if (val == 1) {
        $("#Menu_DTQH").attr("src", "/images/tool/M1_简化.png");
        $("#Menu_DTQH").attr("title", "简化");
        DarkLayer.setVisibility(false);
        tiandituLayer.setVisibility(false);
        tianMarkerLayer.setVisibility(false);
        tiandituImgLayer.setVisibility(true);
        tianImgMarkerLayer.setVisibility(true);
        CurMap_Json.maptype = 1;
    }
    else {
        $("#Menu_DTQH").attr("src", "/images/tool/M1_地图.png");
        $("#Menu_DTQH").attr("title", "地图");
        DarkLayer.setVisibility(true);
        tiandituLayer.setVisibility(false);
        tianMarkerLayer.setVisibility(false);
        tiandituImgLayer.setVisibility(false);
        tianImgMarkerLayer.setVisibility(false);
        CurMap_Json.maptype = 2;
    }
}

//图层控制
function OpenTCKZ() {
    if ($("#Layer_Panal").is(':hidden')) {
        var layerlen = $("#Layer_FXZTList div").length;
        if (layerlen == 0) {
            $("#Layer_Panal").hide();
        }
        else {
            $("#Layer_Panal").show();
        }
    }
    else {
        $("#Layer_Panal").hide();
    }
}

function mapToImg1() {
    MapToImg && MapToImg.excute(map);
}
//弹窗窗口显示
var InfoWin_Json = { content: "", point: null, clickbs: 0 };//clickbs  0 点击地图,1点击信息窗口
function ShowInfoWin() {
    $("#Prop_Content").html(InfoWin_Json.content);
    var pixel = map.getLayerPxFromLonLat(InfoWin_Json.point);
    $("#Prop_Info").css("left", pixel.x-110);
    $("#Prop_Info").css("top", pixel.y-20);
    $("#Prop_Info").show();
    $("#Prop_Close2").hide();
    $("#Prop_Close1").show();
}

function Exit() {
    mini.confirm("您确定要退出登录吗!", "",
    function (action) {
        if (action == "ok") {
            $.ajax({
                url: "/views/comm/comm.aspx?Action=Exit",
                type: 'post',
                data: {},
                cache: false,
                success: function (text) {
                    window.location = "/login.aspx";
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    mini.alert(jqXHR.responseText);
                }
            });
        }
    });
}

//清除全部
function ClearAll() {
    Tool_ClearLayer();
    Query_ClearLayer();
    WDSJ_ClearLayer();
    FXZT_ClearLayer();
    FXYJ_ClearLayer();
    LSTF_ClearLayer();
    LSZH_ClearQueryLayer();
}

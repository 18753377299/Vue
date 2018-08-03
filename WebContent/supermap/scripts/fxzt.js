// 风险专题图
var FXZT_CheckInfo = {};
var FXZT_CheckXH = 0;
var FXZT_FS_Config = {
    nameys: {
        "Rain": "暴雨", "Typhoon": "台风", "Flood": "洪水",
        "Stormsurge": "风暴潮", "Earthquake": "地震", "Landslide": "泥石流",
        "Snowstorm": "雪灾", "Hail": "冰雹", "Thunderstorm": "雷电"
    },
    xhys: {
        "Rain": "1", "Typhoon": "2", "Flood": "3",
        "Stormsurge": "4", "Earthquake": "地震", "Landslide": "5",
        "Snowstorm": "6", "Hail": "7", "Thunderstorm": "8"
    }
};

FXZT_GetAllList();

function FXZT_GetAllList() {
    var FXZT_DJT_Json = [];
    var FXZT_More_Json = [];
    var FXZT_FSDJT_Json = [];
    var FXZT_JCSJ_Json = [];
    var strHtml_djt = "";
    var strHtml_more = "";
    var strHtml_fsdjt = "";
    var strHtml_fsdjt_dz = "";
    var strHtml_jcsj = "";

    for (var i = 0; i < FXZT_Json.length; i++) {
        var obj = FXZT_Json[i];
        obj["xh"] = i;
        if (obj["type"] == "djt") {
            var minval = FXZT_Json[i].minval;
            var maxval = FXZT_Json[i].maxval;
            if (minval == maxval || minval == null || maxval == null) {
            }
            else {
                Query_FXZTLayer.djlayer.push({ dsname: FXZT_Json[i].dsname, dtname: FXZT_Json[i].dtname, mapname: FXZT_Json[i].mapname, val: "", minval: minval, maxval: maxval });
            }
            strHtml_djt += '<label class="MH_label" title="' + FXZT_Json[i].mapbm + '"><input class="MH_radio FXZT_CheckZT" value ="' + i + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + FXZT_Json[i].mapbm + '</label>';
        }
        else if (obj["type"] == "more") {
            FXZT_More_Json.push(obj);
            var pid = FXZT_Json[i].pid;
            if (pid != "more") {
                var minval = FXZT_Json[i].minval;
                var maxval = FXZT_Json[i].maxval;
                if (maxval != "0") {
                    strHtml_more += '<div class="LabelFJInfo"><label class="MH_label MH_label_2" style="width: 240px !important;"><input class="MH_radio FXZT_MoreVal" value ="' + i + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + FXZT_Json[i].mapbm + '</label><span name="Val" style="float:right;"></span></div>';
                }
                if (pid.length == 7) {
                    var strHtml = '<label class="MH_label MH_label_1" title="' + FXZT_Json[i].mapbm + '"><input class="MH_radio FXZT_CheckZT" value ="' + i + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + FXZT_Json[i].mapbm + '</label>';
                    $("#" + pid).append(strHtml);
                }
            }
        }
        else if (obj["type"] == "fsdjt") {
            var mapbm = FXZT_FS_Config.nameys[FXZT_Json[i].mapname];
            if (mapbm == "地震") {
                strHtml_fsdjt_dz += '<tr><td value="' + FXZT_Json[i].mapname + '" style="width:90px;" title="50年超越概率10%PGA的面积"><label class="MH_label MH_label_2"><input class="MH_radio FXZT_CheckZT" value ="' + i + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + mapbm + '</label></td>';
                strHtml_fsdjt_dz += '<td></td><td></td><td></td><td></td><td></td><td style="width:90px;"></td><td style="width:90px;"></td><td style="width:90px;"></td></tr>';
            }
            else {
                strHtml_fsdjt += '<tr><td value="' + FXZT_Json[i].mapname + '" style="width:90px;"><label class="MH_label MH_label_2"><input class="MH_radio FXZT_CheckZT" value ="' + i + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + mapbm + '</label></td>';
                strHtml_fsdjt += '<td></td><td></td><td></td><td></td><td></td><td style="width:90px;"></td><td style="width:90px;"></td><td style="width:90px;"></td></tr>';
            }
        }
        else if (obj["type"] == "jcsj") {
            strHtml_jcsj += '<label class="MH_label MH_label_8" title="' + FXZT_Json[i].mapbm + '"><input class="MH_radio FXZT_CheckZT" value ="' + i + '" type="checkbox"><span class="MH_checkbox MH_radioInput"></span>' + FXZT_Json[i].mapbm + '</label>';
        }
    }
    
    $("#FXZT_DJT_Con").html(strHtml_djt);
    $("#JCSJ_Content_Panal").append(strHtml_jcsj);
    $("#QYCXTable").html(strHtml_fsdjt);
    $("#QYCXTable_1").html(strHtml_fsdjt_dz);
    $("#BDCXDiv3").html(strHtml_more);
    $(".FXZT_MoreVal").click(function () {
        var val = $(this).attr('value');
        var mapname = FXZT_Json[parseInt(val)].mapname;
        var dsname = FXZT_Json[parseInt(val)].dsname;
        var dtname = FXZT_Json[parseInt(val)].dtname;

        var state = $(this).is(':checked');
        if (state) {
            Query_FXZTLayer.querytype = "morecx";
            var url = mapurl + "/iserver/services/data-" + dsname + "/rest/data";
            if (Query_CurJson.cenx != 0) {
                Query_GridInfo(url, Query_CurJson.cenx, Query_CurJson.ceny, dsname, dtname, mapname, val);
            }
        }
        else {
            $(this).parent().next().html("");
        }
    });


    $(".FXZT_CheckZT").click(function () {
        var val = $(this).attr('value');
        var mapname = FXZT_Json[parseInt(val)].mapname;
        var mapbm = FXZT_Json[parseInt(val)].mapbm;
        var dsname = FXZT_Json[parseInt(val)].dsname;
        var dtname = FXZT_Json[parseInt(val)].dtname;
        var type = FXZT_Json[parseInt(val)].type;
        var state = $(this).is(':checked');
        if (state == true) {
            var cururl = "";
            //var url = mapurl + "/iserver/services/map-mongodb/rest/maps/" + mapname;
            var url = mapurl + "/iserver/services/map-" + dsname + "/rest/maps/" + mapname;
            if (type == "fsdjt") {
                cururl = url + "_" + Query_CurJson.areacode.substr(0, 2);
            }
            else {
                cururl = url;
            }

            var CurCheckLayer = new SuperMap.Layer.TiledDynamicRESTLayer(mapname, cururl, { transparent: true, cacheEnabled: true });
            $(".FXZT_CheckZT[value='" + val + "']").attr("checked", false);
            CurCheckLayer.events.on({
                "layerInitialized": function (evt) {
                    if (FXZT_CheckXH != 0) {
                        FXZT_CheckXH = FXZT_CheckXH + 1;
                    }
                    else {
                        FXZT_CheckXH = parseInt(val);
                    }
                    var Cur_SY = 400 + parseInt(FXZT_CheckXH);// 8000 + parseInt(val);
                    map.addLayers([CurCheckLayer]);
                    var LayerDiv = CurCheckLayer.div;
                    //$(LayerDiv).attr("z-index", Cur_SY);
                    $(LayerDiv).css({zIndex:Cur_SY});
                    $(LayerDiv).attr("name", "FXZTLayer");
                    $(LayerDiv).attr("value", val);
                    $(LayerDiv).css({ opacity: 0.8 });
                    FXZT_CheckInfo["L" + val] = CurCheckLayer;

                    var LegendTitle = mapbm;
                    if (mapbm == "中国GDP") {
                        LegendTitle = "中国GDP(万元/平方公里)";
                    }
                    if (mapbm == "中国人口") {
                        LegendTitle = "中国人口(人/平方公里)";
                    }
                    var strHtml_L = '<div class="LabelFJInfo" name="FXZTLegend" value="' + val + '"><label class="MH_label MH_label_7">' +
                                '<input class="MH_radio FXZT_CheckZT" onclick="Layer_FXZTRemove(this)" checked="checked"  type="checkbox">' +
                                '<span class="MH_checkbox MH_radioInput"></span>' + LegendTitle + '</label><br/>' +
                                '<img class"FXZT_XSYC" name="XSYC" onclick="Layer_FXZTXSYC(this)" src="/images/fxdt/L1_显示.png"/>' +
                                '<input type="range" style="background: #e3e6eb;" min="0" max="100" step="10" value="80" oninput="SetOpacity(this)" onchange="SetOpacity(this)"><br/>' +
                                '<img value="TL" style="max-width:200px;" src="/images/legend/' + mapbm + '.png" onerror="Remove_Img(this)"/></div>';
                    $("#Layer_FXZTList").append(strHtml_L);
                    $(".FXZT_CheckZT[value='" + val + "']").attr("checked", true);
                    $("#Layer_Panal").show();
                    var AllChkLayer = $("#map div[name='FXZTLayer']");
                    if (AllChkLayer.length >= 3) {
                        for (var i = 0; i < AllChkLayer.length - 2; i++) {
                            var curval = $(AllChkLayer[i]).attr("value");
                            $(AllChkLayer[i]).prop('outerHTML', '');
                            delete FXZT_CheckInfo["L" + curval];
                            $("#Layer_FXZTList div[value='" + curval + "']").prop('outerHTML', '');
                            $(".FXZT_CheckZT[value='" + curval + "']").attr("checked", false);
                        }
                    }

                    if (FXZT_Json[parseInt(val)].type != "djt") {
                        FXZT_GetLSQueryLayer();
                    }
                    //if (FXZT_Json[parseInt(val)].type != "fsdjt") {
                    //    FullMap();
                    //}
                }
            });
        }
        else {
            $("#Layer_FXZTList div[value='" + val + "']").prop('outerHTML', '');
            var layerlen = $("#Layer_FXZTList div").length;
            if (layerlen == 0) {
                $("#Layer_Panal").hide();
            }

            $("#map div[name='FXZTLayer'][value='" + val + "']").prop('outerHTML', '');
            delete FXZT_CheckInfo["L" + val];
            if (FXZT_Json[parseInt(val)].type != "djt") {
                FXZT_GetLSQueryLayer();
            }
        }
    });

    $(".FXZT_More_FL_Head").click(function () {
        var img = $(this).find("img").attr('src');
        $(".FXZT_More_FL_Head img").attr("src", "/images/fxdt/T_ZK.png");
        $(".FXZT_More_FL_Con").hide();
        if (img.indexOf("T_ZK") >= 0) {
            $(this).find("img").attr("src", "/images/fxdt/T_ZD.png");
            $(this).next().show();
        }
        else {
            $(this).find("img").attr("src", "/images/fxdt/T_ZK.png");
            $(this).next().hide();
        }
    });
}


//获取当前勾选专题图层
function FXZT_GetLSQueryLayer() {
    Query_FXZTLayer.lslayer = [];
    $("#Layer_FXZTList .FXZT_CheckZT").each(function () {
        if (this.checked) {
            var val = $(this).parent().parent().attr('value');
            var type = FXZT_Json[parseInt(val)].type;
            if (type != "djt") {
                var mapname = FXZT_Json[parseInt(val)].mapname;
                var dsname = FXZT_Json[parseInt(val)].dsname;
                var dtname = FXZT_Json[parseInt(val)].dtname;
                var minval = FXZT_Json[parseInt(val)].minval;
                var maxval = FXZT_Json[parseInt(val)].maxval;
                if (minval == maxval || minval == null || maxval == null) {
                }
                else {
                    Query_FXZTLayer.lslayer.push({ dsname: dsname, dtname: dtname, mapname: mapname, val: "", minval: minval, maxval: maxval });
                }
            }
        }
    });
}

//加载图例错误时移除
function Remove_Img(obj) {
    obj.parentNode.removeChild(obj);
}

//从图层控制面板操作移除风险专题
function Layer_FXZTRemove(obj) {
    var val = $(obj).parent().parent().attr('value');
    $("#Layer_FXZTList div[value='" + val + "']").prop('outerHTML', '');
    $(".FXZT_CheckZT[value='" + val + "']").attr("checked", false);
    var layerlen = $("#Layer_FXZTList div").length;
    if (layerlen == 0) {
        $("#Layer_Panal").hide();
    }
    $("#map div[name='FXZTLayer'][value='" + val + "']").prop('outerHTML', '');

    delete FXZT_CheckInfo["L" + val];
}

//设置风险专题显示隐藏
function Layer_FXZTXSYC(obj) {
    var val = $(obj).parent().attr('value');
    var img = $(obj).attr('src');
    if (img == "/images/fxdt/L1_显示.png") {
        $(obj).attr('src', "/images/fxdt/L0_显示.png");
        var Layer = FXZT_CheckInfo["L" + val];
        Layer.setVisibility(false);
        //$("#map div[name='FXZTLayer'][value='" + val + "']").hide();
    }
    else {
        $(obj).attr('src', "/images/fxdt/L1_显示.png");
        var Layer = FXZT_CheckInfo["L" + val];
        Layer.setVisibility(true);
        //$("#map div[name='FXZTLayer'][value='" + val + "']").show();
    }
}

//设置专题图层透明度
function SetOpacity(obj) {
    var pval = $(obj).parent().attr('value');
    var val = $(obj).attr('value');
    $("#map div[name='FXZTLayer'][value='" + pval + "']").css({ opacity: val / 100 });
}

//清除风险专题
function FXZT_ClearLayer() {
    $("#Prop_Info").hide();
    $("#FXZT_DJT_Head").click();
    $(".FXZT_CheckZT").each(function () {
        if (this.checked) {
            this.checked = false;
        }
    });
    Query_FXZTLayer.lslayer = [];
    $("#map div[name='FXZTLayer']").prop('outerHTML', '');
    $("#Layer_FXZTList div[name='FXZTLegend']").prop('outerHTML', '');
    FXZT_CheckXH = 0;
}


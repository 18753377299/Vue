<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head> 
<%-- 	<%@ include file="/WEB-INF/view/common/taglib.jspf"%> --%>
<!-- 	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />	 -->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
    <title>SuperMap</title>
    <!--引用需要的脚本-->
<%--     <script src="${ctx}/${app_version}/map/js/MapEdit.js"></script> --%>
<!-- /pdfb4/src/main/webapp/WEB-INF/riskctrl/MyFirst/libs/SuperMap.Include.js -->
<%--     <script src="${ctx}/${app_version}/MyFirst/libs/SuperMap.Include.js"></script> --%>
     <script src="./libs/SuperMap.Include.js"></script>
     <script type="text/javascript">
		var contextPath = "${pageContext.request.contextPath}";
	</script>
    <script type="text/javascript">
    //声明变量map、layer、url
    var map, layer,
    url = "http://10.10.1.156:8090/iserver/services/map-world/rest/maps/World";
    //创建地图控件
    function init() {
        map = new SuperMap.Map ("map");
        //创建分块动态REST图层，该图层显示iserver 8C 服务发布的地图,
        //其中"world"为图层名称，url图层的服务地址，{transparent: true}设置到url的可选参数
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, 
        null, {maxResolution:"auto"});
        layer.events.on({"layerInitialized": addLayer});          
    }             
    function addLayer() {
        //将Layer图层加载到Map对象上
        map.addLayer(layer);
        //出图，map.setCenter函数显示地图
        map.setCenter(new SuperMap.LonLat(0, 0), 0);        
    }
    </script>
</head>

<body onload="init()">
    <!--地图显示的div-->
    <div id="map" style="position:absolute;left:0px;right:0px;width:800px;height:500px;" >             
    </div>  
    ssfs  
</body>
</html>
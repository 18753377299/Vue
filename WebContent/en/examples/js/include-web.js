(function () {
    var r = new RegExp("(^|(.*?\\/))(include-web\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                relativePath = m[1] || "./";
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        if (inArray(includes, 'jquery')) {
            inputScript("../../../web/libs/jquery/jquery.min.js");
        }

        if (inArray(includes, 'bootstrap')) {
            inputCSS("../../../web/libs/bootstrap/css/bootstrap.min.css");
            inputScript("../../../web/libs/bootstrap/js/bootstrap.min.js");
        }
        if (inArray(includes, 'bootstrap-css')) {
            inputCSS("../../../web/libs/bootstrap/css/bootstrap.min.css")
        }

        if (inArray(includes, 'bootstrap-js')) {
            inputScript("../../../web/libs/bootstrap/js/bootstrap.min.js");
        }

        if (inArray(includes, 'template')) {
            inputScript("../../../web/libs/art-template/template-web.js");
        }

        if (inArray(includes, 'randomcolor')) {
            inputScript("../../../web/libs/randomcolor/randomColor.min.js");
        }
        if (inArray(includes, 'papaparse')) {
            inputScript("../../../web/libs/PapaParse/papaparse.min.js");
        }

        if (inArray(includes, 'moment')) {
            inputScript("../../../web/libs/moment.js/moment.min.js");
            inputScript("../../../web/libs/moment.js/zh-cn.js");
        }

        if (inArray(includes, 'bootstrap-datetimepicker')) {
            inputCSS("../../../web/libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css");
            inputScript("../../../web/libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js");
        }
        if (inArray(includes, 'bootstrap-select')) {
            inputCSS("../../../web/libs/bootstrap-select/bootstrap-select.min.css");
            inputScript("../../../web/libs/bootstrap-select/bootstrap-select.min.js");
        }
        if (inArray(includes, 'geohash')) {
            inputScript("../../../web/libs/geohash/geohash.js");
        }
        if (inArray(includes, 'dat-gui')) {
            inputScript("../../../web/libs/dat-gui/dat.gui.min.js");
        }
        if (inArray(includes, 'admin-lte')) {
            inputCSS("../../../web/libs/admin-lte/css/AdminLTE.min.css");
            inputCSS("../../../web/libs/admin-lte/css/skins/skin-blue.min.css");
            inputCSS("../../../web/libs/font-awesome/css/font-awesome.min.css");
            inputScript("../../../web/libs/admin-lte/js/app.min.js");
        }
        if (inArray(includes, 'jquery.scrollto')) {
            inputScript("../../../web/libs/jquery.scrollto/jquery.scrollTo.min.js");
        }
        if (inArray(includes, 'ace')) {
            inputScript("../../../web/libs/ace/ace.js");
        }

        if (inArray(includes, 'widgets.alert')) {
            inputScript("../js/widgets.js");
        }

        if (inArray(includes, 'widgets')) {
            inputCSS("../../../web/libs/css-loader/css-loader.css");
            inputScript("../js/widgets.js");
        }
        if (inArray(includes, 'zTree')) {
            inputCSS("../../../web/libs/iclient8c/examples/js/plottingPanel/zTree/css/zTreeStyle.css");
            inputScript("../../../web/libs/iclient8c/examples/js/plottingPanel/zTree/jquery.ztree.core.js");
        }
        if (inArray(includes, 'jquery-scontextMenu')) {
            inputCSS("../../../web/libs/iclient8c/examples/css/jquery.contextMenu.css");
            inputScript("../../../web/libs/iclient8c/examples/js/jquery.contextMenu.js");
        }
        if (inArray(includes, 'sticklr')) {
            inputCSS("../../../web/libs/iclient8c/examples/css/jquery-sticklr.css");
        }
        if (inArray(includes, 'responsive')) {
            inputCSS("../../../web/libs/iclient8c/examples/css/bootstrap-responsive.min.css");
        }
        if (inArray(includes, 'lazyload')) {
            inputScript("../../../web/libs/lazyload/jquery.lazyload.min.js");
        }
        if (inArray(includes, 'i18n')) {
            inputScript("../../../web/libs/i18next/i18next.min.js");
            inputScript("../../../web/libs/jquery-i18next/jquery-i18next.min.js");
            inputScript("../../../web/libs/i18next-xhr-backend/i18nextXHRBackend.min.js");
        }

    }

    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
    window.isSite = true;//i18n相关设置
    window.version = "9.0.1";
})();

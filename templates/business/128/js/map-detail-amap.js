$(function () {
    //高德地图api功能
    var sContent =pageData.address;
    var map = new AMap.Map('allmap', {
            center: [pageData.lng, pageData.lat],
            zoom: 15,
        });
        AMap.plugin('AMap.ToolBar', function() { //异步加载插件
            var toolbar = new AMap.ToolBar();
            map.addControl(toolbar);
        });
        // 构造点标记
        var marker = new AMap.Marker({
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [pageData.lng, pageData.lat]
        });
        map.add(marker);
        var content = [
            '<p style="line-height: 3em;">' + sContent + '</p>'
        ];
        // 创建 infoWindow 实例 
        var infoWindow = new AMap.InfoWindow({
           content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
        });
        // 打开信息窗体
        infoWindow.open(map,[pageData.lng, pageData.lat]);
});
var OpenMap_URL = ""; //跳转链接路径
var MapImg_URL = ""; //根据经纬度获取地图IMG

if(pageData.lnglat){
  var lnglatArr = pageData.lnglat.split(',');
  pageData.lng = lnglatArr[0];
  pageData.lat = lnglatArr[1];
}
var device = navigator.userAgent;
// 百度小程序
if(device.indexOf('swan-baiduboxapp')>-1){
    document.write(unescape("%3Cscript src='https://b.bdstatic.com/searchbox/icms/searchbox/js/swan-2.0.21.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
}
//跳转链接路径
var userAgent1 = navigator.userAgent;
var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
if (ua.match(/MicroMessenger/i) == "micromessenger" && pageData.lng != '' && pageData.lat != '') {
    OpenMap_URL = "javascript:;";
    if (pageData.mapType == "baidu") {
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = pageData.lng - 0.0065;
        var y = pageData.lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
         pageData.lng = z * Math.cos(theta);
         pageData.lat = z * Math.sin(theta);
    }
}else if (pageData.mapType == "baidu") {
    OpenMap_URL = "https://api.map.baidu.com/marker?location="+pageData.lat+","+pageData.lng+"&title="+pageData.title+"&content="+pageData.address+"&output=html"
}else if (pageData.mapType == "google") {
    OpenMap_URL = "https://www.google.com/maps/place/"+pageData.cityName+""+pageData.title+""
}else if (pageData.mapType == "amap") {
    OpenMap_URL = "https://m.amap.com/search/mapview/keywords="+pageData.title+"&city="+pageData.cityName+""
}else if (pageData.mapType == "qq") {
    OpenMap_URL = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:"+pageData.lat+","+pageData.lng+";title:"+pageData.title+"&key="+pageData.mapKey+"&referer=myapp"
}


// 根据经纬度获取地图IMG
if (pageData.mapType == "baidu") {
    MapImg_URL = "http://api.map.baidu.com/staticimage?width=300&height=130&zoom=13&markers="+pageData.lng+","+pageData.lat+"&markerStyles=m,Y"
}else if (pageData.mapType == "google") {
    MapImg_URL = "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=400x200&maptype=roadmap&markers="+pageData.lat+","+pageData.lng+"&key="+pageData.mapKey+""
}else if (pageData.mapType == "amap") {
    MapImg_URL = "http://restapi.amap.com/v3/staticmap?location="+pageData.lng+","+pageData.lat+"&zoom=13&size=750*300&markers=mid,,A:"+pageData.lng+","+pageData.lat+"&key="+pageData.mapKey+""
}else if (pageData.mapType == "qq") {
    MapImg_URL = "http://apis.map.qq.com/ws/staticmap/v2/?center="+pageData.lat+","+pageData.lng+"&zoom=13&size=600*300&maptype=roadmap&markers=size:large|color:0xFFCCFF|label:k|"+pageData.lat+","+pageData.lng+"&key="+pageData.mapKey+""
}


$(function(){
  $('body').delegate('.appMapBtn', 'click', function(e){
    if (pageData.lat != "" && pageData.lng != "") {
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        e.preventDefault();
        wx.ready(function() {
            wx.openLocation({
                latitude: parseFloat(pageData.lat), // 纬度，浮点数，范围为90 ~ -90
                longitude: parseFloat(pageData.lng), // 经度，浮点数，范围为180 ~ -180。
                name: pageData.title, // 位置名
                address: pageData.addrDetail ? pageData.addrDetail : pageData.address, // 地址详情说明
                scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: location.href // 在查看位置界面底部显示的超链接,可点击跳转
            });
        })
      }else if(ua.indexOf("huoniao") > -1){
        if(pageData.mapType == "baidu" || pageData.mapType == "google" || pageData.mapType == "amap"){
  				e.preventDefault();
          setupWebViewJavascriptBridge(function(bridge) {
    				bridge.callHandler("skipAppMap", {
    					"lat": pageData.lat,
    					"lng": pageData.lng,
    					"addrTitle": pageData.title,
    					"addrDetail": pageData.address
    				}, function(responseData) {});
          });
    		}
      }else if(ua.indexOf('swan-baiduboxapp')>-1){
          swan.webView.getEnv(function (res) {
              if(res.smartprogram){
                swan.getLocation({
                  latitude: pageData.lat,
                  longitude: pageData.lng,
                  scale: 18,
                  name: pageData.title,
                  address: pageData.address,
                  success: res => {
                      console.log('openLocation success', res);
                  },
                  fail : err => {
                      swan.showToast({
                          title: '检查位置权限',
                          icon: 'none'
                      })
                      console.log('openLocation fail', err);
                  }
                })
              }
          });
      }else{
          var href = $(this).attr('data-href');
          if(href) {
              location.href = href;
          }
      }
    }
  })
});

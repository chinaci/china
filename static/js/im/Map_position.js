var IMOpenMap_URL = ""; //跳转链接路径
var MapImg_URL = ""; //根据经纬度获取地图IMG
var pageData={};
if(pageData.lnglat){
  var lnglatArr = pageData.lnglat.split(',');
  pageData.lng = lnglatArr[0];
  pageData.lat = lnglatArr[1];
}
var userAgent1 = navigator.userAgent;
	var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
function map_url(pageData){
	//跳转链接路径
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
	    IMOpenMap_URL = "javascript:;";
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
	    IMOpenMap_URL = "https://api.map.baidu.com/marker?location="+pageData.lat+","+pageData.lng+"&title="+pageData.title+"&content="+pageData.address+"&output=html"
	}else if (pageData.mapType == "google") {
	    IMOpenMap_URL = "https://www.google.com/maps/place/"+pageData.cityName+""+pageData.title+""
	}else if (pageData.mapType == "amap") {
	    IMOpenMap_URL = "https://m.amap.com/search/mapview/keywords="+pageData.title+"&city="+pageData.cityName+""
	}else if (pageData.mapType == "qq") {
	    IMOpenMap_URL = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:"+pageData.lat+","+pageData.lng+";title:"+pageData.title+"&key="+pageData.mapKey+"&referer=myapp"
	}
	

}




$(function(){
  $('body').delegate('.IMappMapBtn', 'click', function(e){
  	var t = $(this),p=t.parents('.im-post_content');
  	 pageData = {
  		mapType:'baidu',
  		lng    : p.attr('data-lng'),
  		lat    : p.attr('data-lat'),
  		title  : p.find('h2').text(),
  		address: p.find('p').text(),
  		lnglat:[p.attr('data-lng'),p.attr('data-lat')],
  	}
  	 
  	 map_url(pageData);
//	 img_url(pageData);
    if (pageData.lat != "" && pageData.lng != "") {
    	console.log()
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        e.preventDefault();
        wx.ready(function() {
            wx.openLocation({
                latitude: parseFloat(pageData.lat), // 纬度，浮点数，范围为90 ~ -90
                longitude: parseFloat(pageData.lng), // 经度，浮点数，范围为180 ~ -180。
                name: pageData.title, // 位置名
                address: pageData.addrDetail ? pageData.addrDetail : pageData.address, // 地址详情说明
                scale: 21, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: location.href // 在查看位置界面底部显示的超链接,可点击跳转
            });
        })
      }else if(ua.indexOf("huoniao") > -1){
        if(pageData.mapType == "baidu" || pageData.mapType == "google"){
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
      }else{
      	$(this).attr('href',IMOpenMap_URL)
      }
    }
  });
});

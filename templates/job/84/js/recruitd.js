//创建和初始化地图函数：
function initMap(){

    //百度地图
    if(site_map == "baidu"){
      createMap();//创建地图
      setMapEvent();//设置地图事件
      addMapControl();//向地图添加控件
      addMapOverlay();//向地图添加覆盖物

  }else if(site_map == "google"){

      //加载地图事件
  	function initialize() {
  		var map = new google.maps.Map(document.getElementById('dituContent'), {
  			zoom: 14,
  			center: new google.maps.LatLng(pointLat, pointLon),
  			zoomControl: true,
  			mapTypeControl: false,
  			streetViewControl: false,
  			zoomControlOptions: {
  				style: google.maps.ZoomControlStyle.SMALL
  			}
  		});

  		var infowindow = new google.maps.InfoWindow({
            content: '<div style="font-weight: 700; font-size: 16px;">' + title + '</div>' + '<p style="line-height: 3em;">详细地址：' + pointAddr + '</p>'
          });

  		var marker = new google.maps.Marker({
  			position: {lat: pointLat, lng: pointLon},
  			map: map,
  			title: title
  		});
  		marker.addListener('click', function() {
  			infowindow.open(map, marker);
  		});
  	}

  	google.maps.event.addDomListener(window, 'load', initialize);
    }
}
function createMap(){
  map = new BMap.Map("dituContent");
  map.centerAndZoom(new BMap.Point(pointLon,pointLat),15);
}
function setMapEvent(){
  map.enableScrollWheelZoom();
  map.enableKeyboard();
  map.enableDragging();
  map.enableDoubleClickZoom()
}
function addClickHandler(target,window){
  target.addEventListener("click",function(){
    target.openInfoWindow(window);
  });
}
function addMapOverlay(){
  var markers = [
    {content:pointAddr,title:title,imageOffset: {width:-46,height:-21},position:{lat:pointLat,lng:pointLon}}
  ];
  for(var index = 0; index < markers.length; index++ ){
    var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
    var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
      imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
    })});
    var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
    var opts = {
      width: 200,
      title: markers[index].title,
      enableMessage: false
    };
    var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
    marker.setLabel(label);
    addClickHandler(marker,infoWindow);
    map.addOverlay(marker);

    marker.openInfoWindow(infoWindow);
  };
}
//向地图添加控件
function addMapControl(){
  var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_SMALL});
  map.addControl(navControl);
}
var map;
initMap();


  // 分享
  var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
  var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
  window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];

$(function(){
  var sck = $('.sck'),oli = $('.tabnav li'),mkb = $('.mkb');
  var otop = [];
  mkb.each(function(){
    otop.push($(this).offset().top - 50);
  })
  oli.click(function(){
    var o = $(this);
    var index = o.index(),sct = otop[index];
    $('html,body').animate({
      'scrollTop' : sct + 'px'
    },300)
  })

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    var n = -1;
    for(var i in otop) {
      if(sct >= otop[i]) {
        n = i;
      }
    }
    if(n == -1) {
      sck.removeClass('fixed');
    } else {
      sck.addClass('fixed');
      oli.eq(n).addClass('curr').siblings().removeClass('curr');
    }
  }).scroll();

})

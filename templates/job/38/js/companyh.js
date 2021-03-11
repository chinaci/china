$(function(){

  //二维码
	$(".ewm").qrcode({
		render: window.applicationCache ? "canvas" : "table",
		width: 100,
		height: 100,
		text: pageUrl
	});

})





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

  }else if (site_map == "amap") {

		var mapObj,toolBar,MGeocoder,mar;

		//初始化地图对象，加载地图
		mapObj = new AMap.Map("dituContent",{
	      //二维地图显示视口
	      view: new AMap.View2D({
	          center: new AMap.LngLat(pointLon,pointLat),//地图中心点
	          zoom: 13 //地图显示的缩放级别
	      })
	  });

		//在地图中添加ToolBar插件
		mapObj.plugin(["AMap.ToolBar"],function(){
				toolBar = new AMap.ToolBar({position: 'RB'});
				toolBar.show();
				toolBar.showDirection();
				toolBar.hideRuler();
				mapObj.addControl(toolBar);
		});

		//添加地图类型切换插件
	    mapObj.plugin(["AMap.MapType"],function(){
	        //地图类型切换
	        var mapType= new AMap.MapType({
	            defaultType:0//默认显示地图
	        });
	        mapObj.addControl(mapType);
	    });

		//配置marker图标
		var markerOption = {
			map: mapObj,
				draggable:true,   //点标记可拖拽
				cursor:'move',    //鼠标悬停点标记时的鼠标样式
				raiseOnDrag:true, //鼠标拖拽点标记时开启点标记离开地图的效果
				offset:new AMap.Pixel(-32,-64), //标记显示位置偏移量

			icon:new AMap.Icon({  //复杂图标
							size:new AMap.Size(64,64),  //图标大小
							image:"/static/images/mark_ditu.png" //图标地址
					})
		};

		//自定义地图配置
		//如果经、纬度都为0则设置城市名为中心点
		if(pointLon == 0 && pointLat == 0){

			//根据地址解析
			if(city != ""){
				var address = city;
				if(addr != "") address = addr;

				//加载地理编码插件
			    mapObj.plugin(["AMap.Geocoder"], function() {       
			        MGeocoder = new AMap.Geocoder({
			            city: city
			        });
			        //返回地理编码结果
			        AMap.event.addListener(MGeocoder, "complete", geocoder_CallBack);
			        //地理编码
			        MGeocoder.getLocation(address);
			    });

			//如果城市为空，地图默认显示用户当前城市范围
			}else{
				mapObj = new AMap.Map("dituContent");

			}

		}else{
			addmarker(pointLon, pointLat);
		}

	    
		function addmarker(lngX, latY) {
			mar ? mar.setMap(null) : "";  //清除地图上已有的marker
				markerOption.position = new AMap.LngLat(lngX, latY); //设置marker的坐标位置
				mar = new AMap.Marker(markerOption);   //向地图添加marker
				new AMap.LngLat(lngX, latY);
				//mapObj.setZoom(14);
		}

  }else if (site_map == "qq") {

		var mapOptions = {
			zoom: 14,
			center: new qq.maps.LatLng(pointLat, pointLon),
			zoomControl: true,
			zoomControlOptions: {
				style: qq.maps.ZoomControlStyle.SMALL,
				position: qq.maps.ControlPosition.RIGHT_BOTTOM
			},
			panControlOptions: {
				position: qq.maps.ControlPosition.RIGHT_BOTTOM
			}
		};

		var map = new qq.maps.Map(document.getElementById("map"), mapOptions);
		var anchor = new qq.maps.Point(32, 64);
		var size = new qq.maps.Size(64, 64);
		var origin = new qq.maps.Point(0, 0);
		var myIcon = new qq.maps.MarkerImage('/static/images/mark_ditu.png', size, origin, anchor);

		var marker = new qq.maps.Marker({
			icon: myIcon,
			position: mapOptions.center,
			animation: qq.maps.MarkerAnimation.DROP,
			map: map
		});

		function initialize() {

			//如果经、纬度都为0则设置城市名为中心点
			if(pointLat == 0 && pointLon == 0){

				//根据地址解析
				if(city != ""){
					var address = city;
					if(addr != "") address = address + addr;
					var geocoder = new qq.maps.Geocoder({
						complete : function(result){
							var location = result.detail.location;
							map.setCenter(location);
							mapOptions.center = new qq.maps.LatLng(location.lat, location.lng);
							setMark();
						}
					});
					geocoder.getLocation(address);

				//如果城市为空，则定位当前城市
				}else{
					var citylocation = new qq.maps.CityService({
						complete : function(result){
							var location = result.detail.latLng;
							map.setCenter(location);
							mapOptions.center = new qq.maps.LatLng(location.lat, location.lng);
							setMark();
						}
					});
					citylocation.searchLocalCity();
				}

			}else{
				// setMark();
			}

		}

		initialize();

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
  var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
  map.addControl(navControl);
}
var map;
"undefined" != typeof pointLat && initMap();

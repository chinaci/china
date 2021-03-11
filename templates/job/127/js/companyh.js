$(function() {

	$('.ewmbtn .poster-enter').hover(function() {
		$('.posterBox').show()
	}, function() {
		$('.posterBox').hide()
	});
	$('.ewmbtn .phone-enter').hover(function() {
		$('.ewm').show()
	}, function() {
		$('.ewm').hide()
	});

	//二维码
	$(".ewm").qrcode({
		render: window.applicationCache ? "canvas" : "table",
		width: 172,
		height: 172,
		text: pageUrl
	});

})





//创建和初始化地图函数：
function initMap() {

	//百度地图
	if (site_map == "baidu") {
		createMap(); //创建地图
		setMapEvent(); //设置地图事件
		addMapControl(); //向地图添加控件
		addMapOverlay(); //向地图添加覆盖物

	} else if (site_map == "google") {

		//加载地图事件
		function initialize() {
			var map = new google.maps.Map(document.getElementById('dituContent'), {
				zoom: 14,
				center: new google.maps.LatLng(Number(pointLat), Number(pointLon)),
				zoomControl: true,
				mapTypeControl: false,
				streetViewControl: false,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL
				}
			});

			var infowindow = new google.maps.InfoWindow({
				content: '<div style="font-weight: 700; font-size: 16px;">' + title + '</div>' +
					'<p style="line-height: 3em;">详细地址：' + pointAddr + '</p>'
			});
			var marker = new google.maps.Marker({
				position: {
					lat: Number(pointLat),
					lng: Number(pointLon)
				},
				map: map,
				title: title
			});
			infowindow.open(map, marker);
		}

		google.maps.event.addDomListener(window, 'load', initialize);

	} else if (site_map == "qq") {
		// var map = new qq.maps.Map(document.getElementById('dituContent'), {center: new qq.maps.LatLng(pointLat, pointLon), zoom: 18, draggable:true});

		var center = new qq.maps.LatLng(pointLat, pointLon);
		var map = new qq.maps.Map(document.getElementById('dituContent'), {
			center: center,
			zoom: 18
		});
		 var marker=new qq.maps.Marker({
		            position:center,
					animation:qq.maps.MarkerAnimation.DROP,
		            map:map
		        });
		var infoWin = new qq.maps.InfoWindow({
			map: map
		});
		infoWin.open();
		//tips  自定义内容
		infoWin.setContent('<div style="font-weight: 700; font-size: 16px;">' + title + '</div>' +
			'<p style="line-height: 3em;">详细地址：' + pointAddr + '</p>');
		infoWin.setPosition(center);
	} else if (site_map == "amap") {
		var map = new AMap.Map('dituContent', {
			center: [pointLon, pointLat],
			zoom: 15,
		});
		AMap.plugin('AMap.ToolBar', function() { //异步加载插件
			var toolbar = new AMap.ToolBar();
			map.addControl(toolbar);
		});
		// 构造点标记
		var marker = new AMap.Marker({
			icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
			position: [pointLon, pointLat]
		});
		map.add(marker);
		var content = [
		   '<div style="font-weight: 700; font-size: 16px;">' + title + '</div>' +
			'<p style="line-height: 3em;">详细地址：' + pointAddr + '</p>'
		];
		
		// 创建 infoWindow 实例	
		var infoWindow = new AMap.InfoWindow({
		   content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
		});
		// 打开信息窗体
		infoWindow.open(map,[pointLon, pointLat]);
	}
}

function createMap() {
	map = new BMap.Map("dituContent");
	map.centerAndZoom(new BMap.Point(pointLon, pointLat), 15);
}

function setMapEvent() {
	map.enableScrollWheelZoom();
	map.enableKeyboard();
	map.enableDragging();
	map.enableDoubleClickZoom()
}

function addClickHandler(target, window) {
	target.addEventListener("click", function() {
		target.openInfoWindow(window);
	});
}

function addMapOverlay() {
	var markers = [{
		content: pointAddr,
		title: title,
		imageOffset: {
			width: -46,
			height: -21
		},
		position: {
			lat: pointLat,
			lng: pointLon
		}
	}];
	for (var index = 0; index < markers.length; index++) {
		var point = new BMap.Point(markers[index].position.lng, markers[index].position.lat);
		var marker = new BMap.Marker(point, {
			icon: new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png", new BMap.Size(20, 25), {
				imageOffset: new BMap.Size(markers[index].imageOffset.width, markers[index].imageOffset.height)
			})
		});
		var label = new BMap.Label(markers[index].title, {
			offset: new BMap.Size(25, 5)
		});
		var opts = {
			width: 200,
			title: markers[index].title,
			enableMessage: false
		};
		var infoWindow = new BMap.InfoWindow(markers[index].content, opts);
		marker.setLabel(label);
		addClickHandler(marker, infoWindow);
		map.addOverlay(marker);

		marker.openInfoWindow(infoWindow);
	};
}
//向地图添加控件
function addMapControl() {
	var navControl = new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_TOP_LEFT,
		type: BMAP_NAVIGATION_CONTROL_LARGE
	});
	map.addControl(navControl);
}
var map;
"undefined" != typeof pointLat && initMap();

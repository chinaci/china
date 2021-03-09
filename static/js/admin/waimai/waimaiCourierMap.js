$(function(){

  if (site_map == "baidu") {

    var map = new BMap.Map("map", {enableMapClick: false});
    // map.centerAndZoom(mapCity, 13);
    map.enableScrollWheelZoom(); //启用滚轮放大缩小
    map.disableInertialDragging(); //禁用惯性拖拽

    var points = [];
    $.each(list, function(e, o) {
        var bubbleLabel, r = [];

        var state = "";
        if(o.state == 0){
            state = " closed";
        }

        bubbleLabel = new BMap.Label('<p class="bubble-3 bubble'+state+'"><i class="num">'+o.name+'</i><i class="arrow-up"><i class="arrow"></i><i></p>', {
            position: new BMap.Point(o.lat, o.lng),
            offset: new BMap.Size(-46, -46)
        });

        bubbleLabel.setStyle({
    			color: "#fff",
    			borderWidth: "0",
    			padding: "0",
    			zIndex: "2",
    			backgroundColor: "transparent",
    			textAlign: "center",
    			fontFamily: '"Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei", "微软雅黑", "Segoe UI", Tahoma, "宋体b8bf53", SimSun, sans-serif'
    		});
        map.addOverlay(bubbleLabel);

        points.push(new BMap.Point(o.lat, o.lng));

    });

    //最佳视野显示所有配送员
    map.setViewport(points);

  // 谷歌地图
  }else if (site_map == "google") {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: new google.maps.LatLng(30, 120),
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false
    });


    var points = [], LatLngList = [];
    $.each(list, function(e, o) {
        var bubbleLabel, r = [];

        var state = "";
        if(o.state == 0){
            state = " closed";
        }

        var poi = new google.maps.LatLng(o.lng, o.lat);
        var marker = new google.maps.Marker({
          position: poi,
          map: map
        });

        var infoWindow = new google.maps.InfoWindow({
          content: '<p class="cour_google'+state+'">'+o.name+'</p>'
        });
        infoWindow.open(map, marker);

        LatLngList.push(new google.maps.LatLng(o.lng, o.lat))

    });

    // 调整到合适的视野
    var bounds = new google.maps.LatLngBounds ();
    for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
      bounds.extend (LatLngList[i]);
    }
    map.fitBounds (bounds);

  }else if(site_map == 'amap'){
        map = new AMap.Map("map",{
            jogEnable: false,   //禁用缓动
        });

        var pointsLng = [], pointsLat = [];
        var points = [];
        $.each(list, function(e, o) {
            var bubbleLabel, r = [];

            var state = "";
            if(o.state == 0){
                state = " closed";
            }
            if(o.lng!='' && o.lat!=''){
              points.push(new AMap.LngLat(o.lat, o.lng));
            bubbleLabel = new AMap.Marker({
                position: ([o.lat, o.lng]),
                draggable: true,    // 允许拖动
                content: '<p class="bubble-3 bubble'+state+'" style="color:#fff;background:transparent;font-family:\'microsoft yahei\';white-space:nowrap;"><i class="num">'+o.name+'</i><i class="arrow-up"><i class="arrow"></i><i></p>',
                offset: new AMap.Pixel(-46,-46)
            });
            bubbleLabel.setMap(map);

            AMap.event.addListener(bubbleLabel, "dragend",function(ea){
            bubbleLabel.setContent('<p class="bubble-3 bubble'+state+'" style="color:#fff;background:transparent;font-family:\'microsoft yahei\';white-space:nowrap;"><i class="num" style="background:#ccc;">'+o.name+' 3秒后回到实际位置</i><i class="arrow-up"><i class="arrow"></i><i></p>');
            setTimeout(function(){
                bubbleLabel.show();
                bubbleLabel.moveTo(new AMap.LngLat(o.lat, o.lng), 100000);
                bubbleLabel.setContent('<p class="bubble-3 bubble'+state+'" style="color:#fff;background:transparent;font-family:\'microsoft yahei\';white-space:nowrap;"><i class="num">'+o.name+'</i><i class="arrow-up"><i class="arrow"></i><i></p>');
            },3000)
        })
            
              pointsLng.push(parseFloat(o.lng));
              pointsLat.push(parseFloat(o.lat));
            }
            
          
            

        });


        setCenter();

        function autoResize(level){
            map.setZoom(level);
            setTimeout(function(){
                var area = map.getBounds();
                var out = false;
                for(var n = 0; n < points.length; n++){
                    if(!area.contains(points[n])){
                        out = true;
                        break;
                    }
                }
                if(out && level > 3){
                    autoResize(--level);
                }
            }, 200)
        }
        autoResize(14);

        // 中心点
        function setCenter(){
            pointsLng = pointsLng.sort();
            pointsLat = pointsLat.sort();

            console.log(pointsLat)
            console.log([(pointsLat[pointsLat.length-1] + pointsLat[0])/2, (pointsLng[pointsLng.length-1] + pointsLng[0])/2])
            map.setCenter([(pointsLat[pointsLat.length-1] + pointsLat[0])/2, (pointsLng[pointsLng.length-1] + pointsLng[0])/2]);
        }

    }

});

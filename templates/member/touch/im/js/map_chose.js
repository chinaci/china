
  
$(function(){
	// 地图坐标 ------------------------- s
  $("#im-map .im-lead p").bind("click", function() {
    $(".im-pageitem").hide();
    $('.im-gz-address').show();
  });

  $('body').delegate('.im-btn_posi','click',function(){
    $('#im-map').show();
    var lnglat = '';
    var lng = lat = "";
//  console.log('看看'+)
    //第一次进入自动获取当前位置
    if(lnglat == "" && lnglat != ","){
      HN_Location.init(function(data){
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
          alert(langData['siteConfig'][27][136]);//定位失败
        }else{
          lng = data.lng;
          lat = data.lat;
          //定位地图
          if(site_map == "baidu"){
            map = new BMap.Map("im-mapdiv");
            var mPoint = new BMap.Point(lng, lat);
            map.centerAndZoom(mPoint, 16);
            map.addControl(new BMap.GeolocationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:true}));
            var circle = new BMap.Circle(mPoint,500,{strokeColor:"rgb(83,128,255)", strokeWeight:2, fillColor:"rgb(83,128,255)",fillOpacity:.3, strokeOpacity:0.03}); //创建圆
            map.addOverlay(circle);
            getLocation(mPoint);

            map.addEventListener("dragend", function(e){
              getLocation(e.point);
            });
          }
        }
      })
    }else{
        var lnglat_ = lnglat.split(',');
        var lng = lnglat_[0];
        var lat = lnglat_[1];
        //定位地图
        if(site_map == "baidu"){
          map = new BMap.Map("im-mapdiv");
            var mPoint = new BMap.Point(lng, lat);
            map.centerAndZoom(mPoint, 16);
            getLocation(mPoint);

            map.addEventListener("dragend", function(e){
              getLocation(e.point);
            });
        }
    }
  });
  // 地图
  //关键字搜索
  if(site_map == "baidu"){
    var myGeo = new BMap.Geocoder();
    var autocomplete = new BMap.Autocomplete({input: "searchAddr"});
    autocomplete.addEventListener("onconfirm", function(e) {
      var _value = e.item.value;
      myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

      var options = {
        onSearchComplete: function(results){
          // 判断状态是否正确
          if (local.getStatus() == BMAP_STATUS_SUCCESS){
            var s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i ++){
              if(i == 0){
                var lng = results.getPoi(i).point.lng;
                var lat = results.getPoi(i).point.lat;
//              此处为点击匹配搜索的结果之后执行的操作   tangram-suggestion-main
								console.log(lng+'===='+lat);
								theLocation(lng,lat);
								
								
              }
            }
          }else{
            alert(langData['siteConfig'][20][431]);
          }
        }
      };
      var local = new BMap.LocalSearch(map, options);
      local.search(myValue);

    });

    //周边检索
function getLocation(point){
      myGeo.getLocation(point, function mCallback(rs){
          var allPois = rs.surroundingPois;
          var reg1 =rs.addressComponents.city;
          var reg2 =rs.addressComponents.district;
          var reg3 =rs.addressComponents.province;
          console.log(rs)
       
          if(allPois == null || allPois == ""){
              return;
          }
          var list = [];
          for(var i = 0; i < allPois.length; i++){
          	  var cur = '';
          	  if(i==0){
          	  	cur='im-onchose'
          	  }
              list.push('<li class="'+cur+'" data-lng="'+allPois[i].point.lng+'" data-lat="'+allPois[i].point.lat+'"><h5>'+allPois[i].title+'</h5><p>'+allPois[i].address.replace(reg1,'').replace(reg2,'').replace(reg3,'')+'</p></li>');
          }
          if(list.length > 0){
            $(".im-mapresults ul").html(list.join(""));
          }

      }, {
          poiRadius: 5000,  //半径一公里
          numPois: 50
      });
    }
		
		//重新定位
		function theLocation(lng,lat){
					var new_point = new BMap.Point(lng,lat);
					getLocation(new_point);
					map.centerAndZoom(new_point, 16);
    
			}

  }

  //点击检索结果
  $(".im-mapresults").delegate("li", "click", function(){
    var t = $(this), title = t.find("h5").text() ,title1 = t.find("p").text();
    var lng = t.attr("data-lng");
    var lat = t.attr("data-lat");
    t.addClass('im-onchose').siblings('li').removeClass('im-onchose');
    
  });

 //取消定位
 $('body').delegate('.im-map_cancel','click',function(){
 	$('#im-map').hide();
 });
 




  // 地图坐标 ------------------------- e
});

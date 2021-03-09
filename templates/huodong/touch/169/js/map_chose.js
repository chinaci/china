// 地图坐标 ------------------------- s
  //页面定位失败时 取默认坐标
  var ulocal = utils.getStorage('user_local');

  $("#map .lead p").bind("click", function() {
    $(".pageitem").hide();
    $('.gz-address').show();
  });
  var lng,lat;
  if ($("#lnglat").val() != "") {
      var lnglat = $("#lnglat").val().split(",");
      lng = lnglat[0];
      lat = lnglat[1];
  }else{
    //第一次进入自动获取当前位置
      HN_Location.init(function(data){
        console.log(data)
          if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
            //alert(langData['siteConfig'][27][137])   /* 定位失败，请重新刷新页面！ */ 
            if(ulocal){
              lng = ulocal.lng;
              lat = ulocal.lat;
            }

          }else{      
            lng = data.lng;
            lat = data.lat;

          }
        }, device.indexOf('huoniao') > -1 ? false : true);
  }



  $(".detail_addr").click( function(){
  	$(this).parents('.gz-address').hide();
    $(".pageitem").hide();
    $('#map').show();
    //百度
    if(site_map == 'baidu') {
      var myGeo = new BMap.Geocoder();

      if(lng&&lat){ 
          //定位地图
          map = new BMap.Map("mapdiv");
          var mPoint = new BMap.Point(lng, lat);
          map.centerAndZoom(mPoint, 16);
          getLocation(mPoint);

          map.addEventListener("dragend", function (e) {
              getLocation(e.point);
          });
      }

      //关键字搜索
      var autocomplete = new BMap.Autocomplete({input: "searchAddr"});
      autocomplete.addEventListener("onconfirm", function (e) {
          var _value = e.item.value;
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business;

          var options = {
              onSearchComplete: function (results) {
                  // 判断状态是否正确
                  if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                      var s = [];
                      for (var i = 0; i < results.getCurrentNumPois(); i++) {
                          if (i == 0) {
                              lng = results.getPoi(i).point.lng;
                              lat = results.getPoi(i).point.lat;
                              //$("#local strong").html(_value.business);
                              $("#lnglat").val(lng + ',' + lat);
                              $(".pageitem").hide();
                              $('.gz-address').show();
                              $('#address').val(_value.business);
                          }
                      }
                  } else {
                      alert(langData['siteConfig'][20][431]);
                  }
              }
          };
          var local = new BMap.LocalSearch(map, options);
          local.search(myValue);

      });

      //周边检索
      function getLocation(point){
          myGeo.getLocation(point, function mCallback(rs) {
              var allPois = rs.surroundingPois;
              if (allPois == null || allPois == "") {
                  return;
              }
              var list = [];
              for (var i = 0; i < allPois.length; i++) {
                  list.push('<li data-lng="' + allPois[i].point.lng + '" data-lat="' + allPois[i].point.lat + '"><h5>' + allPois[i].title + '</h5><p>' + allPois[i].address + '</p></li>');
              }

              if (list.length > 0) {
                  $(".mapresults ul").html(list.join(""));
                  $(".mapresults").show();
              }

          }, {
              poiRadius: 1000,  //半径一公里
              numPois: 50
          });
      }
    //高德
    }else if(site_map == 'amap'){

        var map = new AMap.Map('mapdiv', {zoom:14});
        console.log(lng,lat)
        if(lng&& lat){
            map.setZoomAndCenter(14, [lng, lat]);
        }

        AMap.service('AMap.PlaceSearch',function(){//回调函数
            var placeSearch= new AMap.PlaceSearch();

            var s = function(){
                if(lng != '' && lat != ''){
                    placeSearch.searchNearBy("", [lng, lat], 500, function(status, result) {
                        callback(result, status);
                    });
                }else{
                    setTimeout(s,1000)
                }
            }

            AMap.event.addListener(map ,"complete", function(status, result){
                lnglat = map.getCenter();
                lng = lnglat['lng'];
                lat = lnglat['lat'];
                console.log(lnglat);
                s();
            });

            AMap.event.addListener(map ,"dragend", function(status, result){
                lnglat = map.getCenter();
                lng = lnglat['lng'];
                lat = lnglat['lat'];
                console.log(lnglat);
                s();
            });

        })

        function callback(results, status) {
            if (status === 'complete' && results.info === 'OK') {
                var list = [];
                var allPois = results.poiList.pois;
                for(var i = 0; i < allPois.length; i++){
                    list.push('<li data-lng="'+allPois[i].location.lng+'" data-lat="'+allPois[i].location.lat+'"><h5>'+allPois[i].name+'</h5><p>'+allPois[i].address+'</p></li>');
                }
                if(list.length > 0){
                    $(".mapresults ul").html(list.join(""));
                    $(".mapresults").show();
                }
            }else{
                $(".mapresults ul").html('');
            }
        }

        map.plugin('AMap.Autocomplete', function () {
            console.log('Autocomplete loading...')
            autocomplete = new AMap.Autocomplete({
                input: "searchAddr"
            });
            // 选中地址
            AMap.event.addListener(autocomplete, 'select', function(result){
                lng = result.poi.location.lng;
                lat = result.poi.location.lat;
                var r = result.poi.name ? result.poi.name : (result.poi.address ? result.poi.address : result.poi.district);

                //$("#local strong").html(r);
                $("#lnglat").val(lng + ',' + lat);
                $(".pageitem").hide();
                $('.gz-address').show();
                $('#address').val(r);
            });
        });

    // 谷歌地图
    }else if (site_map == "google") {
      if ($("#lnglat").val() != "") {
          var lnglat = $("#lnglat").val().split(",");
          lng = lnglat[0];
          lat = lnglat[1];
      }
      if(lng && lat){
        businessgooleMap(lng,lat);
      }
      

    }

  });
  
	//点击确认按钮
	$('.btn_sure').bind('click',function(){
		 var name2 = $('#house_chosed').val(),str = $('#house_title').val();
		 var detail_address = $('.chose_val input[type="text"]').val();
		 var address_lnglat = $('#lnglat').val();
		 var chosed = $('#house_name').val();
		 var cityid = $('.gz-addr-seladdr').data('ids');
		 $('#detail_addr').val(detail_address);
		 $('#addr_lnglat').val(address_lnglat);
		 $('#house_chosed').val(chosed);
		 $('.gz-address').hide();
		 $('.house_address').show()
		 $('.input_info').show();
     $('#houseid').val(0);
		 
		 //选择的小区名整合到标题中
    var house_name = chosed;
		if($('#house_title').val()!=''){
			if(house_name != name2){
				$('#house_title').val(str.replace(name2,house_name)) ;
			}
		}else{
			$('#house_title').val(house_name);
		}

    if(window.type && window.type == 'cf'){
      $('#house_chosed').val($('.chose_house .selgroup p').text());
    }

	})
  //点击检索结果
  $(".mapresults").delegate("li", "click", function(){
    var t = $(this), title = t.find("h5").text() ,title1 = t.find("p").text();
    var lng = t.attr("data-lng");
    var lat = t.attr("data-lat");
        $("#address").val(""+title1+""+title+"" );
        $("#lnglat").val(""+lng+","+lat+"" )
        $('.pageitem').hide();
        $('#house_name').val(title); //赋值给表单页
        $('.gz-address').show()
  });

  // 地图坐标 ------------------------- e
  

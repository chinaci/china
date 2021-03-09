// 地图坐标 ------------------------- s
  $("#map .lead p").bind("click", function() {
    $(".pageitem").hide();
    $('.gz-address').show();
  });

  $(".detail_addr").click( function(){
    
  	$(this).parents('.gz-address').hide();
    $(".pageitem").hide();
    $('#map').show();
    var lnglat = $('#lnglat').val();
    var lng = lat = "";
   
    //第一次进入自动获取当前位置
    if(lnglat == "" && lnglat != ","){
      
      HN_Location.init(function(data){
         console.log(1111)
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
          alert(langData['siteConfig'][27][136]);//定位失败
        }else{
         
          lng = data.lng;
          lat = data.lat;
		  console.log(data)
          //定位地图
          if(site_map == "baidu"){
            map = new BMap.Map("mapdiv");
            var mPoint = new BMap.Point(lng, lat);
			
            map.centerAndZoom(mPoint, 16);
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
          map = new BMap.Map("mapdiv");
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
                $("#address").val(_value.business);
                $("#lnglat").val(lng+','+lat);
                $(".pageitem").hide();
                $('.gz-address').show()
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
              list.push('<li data-lng="'+allPois[i].point.lng+'" data-lat="'+allPois[i].point.lat+'"><h5>'+allPois[i].title+'</h5><p>'+allPois[i].address.replace(reg1,'').replace(reg2,'').replace(reg3,'')+'</p></li>');
          }
          if(list.length > 0){
            $(".mapresults ul").html(list.join(""));
          }

      }, {
          poiRadius: 5000,  //半径一公里
          numPois: 50
      });
    }
  }
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
  

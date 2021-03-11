$(function(){

	var map, edit;

	$("html,body").scrollTop(0);
	location.hash = "main";
	$("#main").show();

	//选择地址
	$(".Address_list .add_txt").bind("click", function(){
		var t = $(this), id = t.data("id");
		if(!edit){
			location.href = redirectUrl.replace("#id", id);
		}
	});

	//新增地址
	$("#addNew").bind("click", function(){
		id = 0;
		lng = "";
		lat = "";
		$("#person").val("");
		$("#tel").val("");
		$("#local strong").html("定位中...");
		$("#address").val("");
		location.hash = "add";
		$("#add .lead span").html("新增地址");
	});

	//手动定位
	$("#local").bind("click", function(){
		location.hash = "map";
	});

	//显示编辑按钮
	$('.lead b a').click(function(){
		if ($('.edit').css('display') == 'none') {
			edit = true;
			$('.edit').show();
			$('.dui').hide();
		}else{
			edit = false;
			$('.edit').hide();
			$('.dui').show();
		};
	});

	//修改地址
	$('.Address_list .add_txt .edit a').click(function(){
		var x = $(this).closest(".add_txt");
		id = x.data("id");
		lng = x.data("lng");
		lat = x.data("lat");

		$("#person").val(x.data("person"));
		$("#tel").val(x.data("tel"));
		$("#local strong").html(x.data("street"));
		$("#address").val(x.data("address"));

		location.hash = "add";
		$("#add .lead span").html("修改地址");
	});

	//删除
	$('.Address_list .add_txt .edit b').click(function(){
		var x = $(this), par = x.closest(".add_txt"), id = par.data("id");

		if(confirm("确定要删除吗？")){
			par.remove();
			$.ajax({
	            url: '/include/ajax.php?service=waimai&action=deleteAddress',
	            data: {
	                id: id
	            },
	            type: 'post',
	            dataType: 'json',
	            success: function(data){}
			});
		}
	});


	//关键字搜索
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
							lng = results.getPoi(i).point.lng;
							lat = results.getPoi(i).point.lat;
							$("#local strong").html(_value.business);
							location.hash = "add";
						}
					}
				}else{
					alert("您选择地址没有解析到结果!");
				}
			}
		};
		var local = new BMap.LocalSearch(map, options);
		local.search(myValue);

	});


	//点击检索结果
	$(".mapresults").delegate("li", "click", function(){
		var t = $(this), title = t.find("h5").text();
		lng = t.attr("data-lng");
		lat = t.attr("data-lat");
		$("#local strong").html(title);
		location.hash = "add";
	});


	//监听hash
	$(window).on('hashchange', function(){
        var hash = location.hash;
		$(".pageitem").hide();
		$(hash).show();
		if(hash == "#main"){
			document.title = "选择地址";
		}else if(hash == "#add"){
			document.title = "新增地址";

			//第一次进入自动获取当前位置
			if(lng == "" || lat == ""){
				var geolocation = new BMap.Geolocation();
			    geolocation.getCurrentPosition(function(r){
			    	if(this.getStatus() == BMAP_STATUS_SUCCESS){
			    		lat = r.point.lat;
						lng = r.point.lng;

						var geoc = new BMap.Geocoder();
						geoc.getLocation(r.point, function(rs){
							var rs = rs.addressComponents;
							$("#local strong").html(rs.street + rs.streetNumber);
						});
			    	}
			    	else {
			    		alert('failed'+this.getStatus());
			    	}
			    },{enableHighAccuracy: true});
			}


		}else if(hash == "#map"){
			document.title = "选择地址";

			//定位地图
			map = new BMap.Map("mapdiv");
			var mPoint = new BMap.Point(lng, lat);
			map.centerAndZoom(mPoint, 16);
			getLocation(mPoint);


			map.addEventListener("dragend", function(e){
			    getLocation(e.point);
			});

			//周边检索
			function getLocation(point){
			    myGeo.getLocation(point, function mCallback(rs){
			        var allPois = rs.surroundingPois;
			        if(allPois == null || allPois == ""){
			            return;
			        }
					var list = [];
					for(var i = 0; i < allPois.length; i++){
						list.push('<li data-lng="'+allPois[i].point.lng+'" data-lat="'+allPois[i].point.lat+'"><h5>'+allPois[i].title+'</h5><p>'+allPois[i].address+'</p></li>');
					}

					if(list.length > 0){
						$(".mapresults ul").html(list.join(""));
						$(".mapresults").show();
					}

			    }, {
			        poiRadius: 1000,  //半径一公里
			        numPois: 50
			    });
			}


		}
    });


	//保存地址
	$("#saveAddress").bind("click", function(){
		var t = $(this), person = $("#person").val(), tel = $("#tel").val(), street = $("#local strong").text(), address = $("#address").val();

		if(person == ""){
			alert("请填写联系信息！");
			return false;
		}

		if(tel == ""){
			alert("请填写联系电话！");
			return false;
		}

		if(street == "" || lng == "" || lat == ""){
			alert("请选择街道/小区/建筑！");
			return false;
		}

		if(address == ""){
			alert("请填写详细地址！");
			return false;
		}

		t.attr("disabled", true).html('保存中...');

		$.ajax({
            url: '/include/ajax.php?service=waimai&action=operAddress',
            data: {
                id: id,
                person: person,
                tel: tel,
                street: street,
                address: address,
                lng: lng,
                lat: lat
            },
            type: 'post',
            dataType: 'json',
            success: function(data){
				if(data && data.state == 100){
					location.reload();
				}else{
					alert(data.info);
					t.removeAttr("disabled").html("保存");
				}
			},
			error: function(){
				alert("网络错误，保存失败！");
				t.removeAttr("disabled").html("保存");
			}
		});

		
		
	});

})

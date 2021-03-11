$(function() {

	//二维码
	$(".list").delegate("li", "mouseover", function(){
		var t = $(this).find(".ewm"), url = t.data("url"), obj = t.find(".k");
		if(obj.html() == ""){
			obj.qrcode({
				render: window.applicationCache ? "canvas" : "table",
				width: 120,
				height: 120,
				text: url
			});
		}
	});

	//时间
	var selectDate = function(el, func){
		WdatePicker({
			el: el,
			isShowClear: false,
			isShowOK: false,
			isShowToday: false,
			qsEnabled: false,
			dateFmt: 'yyyy-MM-dd',
			onpicked: function(dp){
				var date = dp.cal.getNewDateStr();
				var url = $("#dateObj").data("url").replace("%date%", date);
				location.href = url;
			}
		});
	}
	$("#dateObj").click(function(){
		selectDate("date");

		$(".areaList").parent().hide();
		$(".areaList").hide();
		$(".fairsList").parent().hide();
		$(".fairsList").hide();
	});


	// 搜索
	$('.ss form').submit(function(e){
		e.preventDefault();
		var s = $(this).find('.inp').val().replace("请输入关键词", "");
		var url = $(".ss form").attr("action");
		location.href = url.replace("%title%", s);
	});


	//选择工作区域 s
	var areaArr = [];
	$('#addr').click(function(){
		if($(".areaList").is(":visible")){
			$(".areaList").parent().hide();
			$(".areaList").hide();
		}else{
			loadArray($('#addrObj'));
		}
		$(".fairsList").parent().hide();
		$(".fairsList").hide();
		return false;
	})
	function loadArray(parobj){
		var content = [];

		if(areaArr.length > 0){
			content.push(createArea());

		}else{
			content.push('<p align="center">加载中...</p>');
		}


		if($(".areaList").html() == undefined){
			$('<div></div>')
				.attr("class", "areaList fn-clear")
				.html(content.join(""))
				.appendTo(".area");
		}

		var areaList = $(".areaList");

		if($(".areaList").html().indexOf("加载中") > -1){
			areaList.html(content.join(""));
		}

		parobj.find('.area, .areaList').show();

		if(areaArr.length <= 0){
			$.ajax({
				url: masterDomain + "/include/ajax.php?service=job&action=addr&son=1&template=singel",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						areaArr = data.info;
						areaList.html(createArea());

					}else{
						areaList.html('<p align="center"><font size="3" color="#ff0000">'+data.info+'</font></p>');
					}
				},
				error: function(){
					areaList.html('<p align="center"><font size="3" color="#ff0000">加载失败，请稍后访问！</font></p>');
				}
			});
		}

	};

	function createArea(){
		if($(".areaList").html().indexOf("加载中") > -1 && areaArr){
			var content = [];
			var data = areaArr;
			var subdata = [], f = 0, i = true;
			var url = $("#addr").data("url");

			for(var a = 0; a < data.length; a++){

				content.push('<div class="sub-data" data-id="'+a+'" data-addr="'+data[a].id+'" title="'+data[a].typename+'"><a href="javascript:;">'+data[a].typename+'</a><i></i></div>');
				lower2 = data[a].lower;

				subdata.push('<ul class="fn-clear area'+a+'">');
				for(var c = 0; c < lower2.length; c++){
					subdata.push('<li><a href="'+url.replace("%addr%", lower2[c].id)+'" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
				}
				subdata.push('</ul>');

				f++;

				if(f == 4 || a == data.length-1){

					if(a == data.length-1 && f < 4){
						i = false;
						content.push('<div class="sub-data no"><a href="'+url.replace("%addr%", '')+'">不限</a></div>');
					}

					content.push(subdata.join(""));
					subdata = [];
					f = 0;
				}

			}

			if(i){
				content.push('<div class="sub-data no"><a href="'+url.replace("%addr%", '')+'">不限</a></div>');
			}

			return content.join("");
		}
	}

	//选择工作地区
	$(".area").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id"), addr = t.attr("data-addr");
		if(t.hasClass("no")){
			$("#addr")
				.attr("data-id", 0)
				.attr("title", "按区域")
				.html("按区域<i></i>");

		}else{
			if(t.hasClass("curr")){
				t.removeClass("curr");
				$(".area .sub-data").removeClass("curr");
				$(".area ul").stop().slideUp("fast");
			}else{
				$(".area .sub-data").removeClass("curr");
				$(".area ul").stop().slideUp("fast");

				t.addClass("curr");
				if(t.parent().find(".area"+id+" li").length){
					t.parent().find(".area"+id).stop().slideDown("fast");
				}else{
					location.href = '?addr='+addr+'#J_crumbs';
				}
			}
			return false;
		}
	});

	//确定工作地区
	$(".area").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name');
		if(id && name){
			$("#addr")
				.attr("data-id", id)
				.attr("title", name)
				.html(name + '<i></i>');
		}
	});

	$(document).click(function (e) {
		var s = e.target;
		$(".areaList").parent().hide();
		$(".areaList").hide();
	});

	//选择工作区域 e






	//选择场馆 s
	var centerArr = [];
	$('#fairs').click(function(){
		if($(".fairsList").is(":visible")){
			$(".fairsList").parent().hide();
			$(".fairsList").hide();
		}else{
			loadFairs($('#fairsObj'));
		}
		$(".areaList").parent().hide();
		$(".areaList").hide();
		return false;
	})
	function loadFairs(parobj){
		var content = [];

		if(centerArr.length > 0){
			content.push(createCenter());

		}else{
			content.push('<p align="center">加载中...</p>');
		}


		if($(".fairsList").html() == undefined){
			$('<div></div>')
				.attr("class", "fairsList fn-clear")
				.html(content.join(""))
				.appendTo(".fairs");
		}

		var fairsList = $(".fairsList");

		if($(".fairsList").html().indexOf("加载中") > -1){
			fairsList.html(content.join(""));
		}

		parobj.find('.fairs, .fairsList').show();

		if(centerArr.length <= 0){
			$.ajax({
				url: masterDomain + "/include/ajax.php?service=job&action=fairsCenter&pageSize=99999999&addr="+addr,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						centerArr = data.info.list;
						fairsList.html(createCenter());

					}else{
						fairsList.html('<p align="center"><font size="3" color="#ff0000">'+data.info+'</font></p>');
					}
				},
				error: function(){
					fairsList.html('<p align="center"><font size="3" color="#ff0000">加载失败，请稍后访问！</font></p>');
				}
			});
		}

	};

	function createCenter(){
		if($(".fairsList").html().indexOf("加载中") > -1 && areaArr){
			var content = [];
			var data = centerArr;
			var subdata = [], f = 0, i = true;
			var url = $("#fairs").data("url");

			content.push('<div class="item no"><a href="'+url.replace("%center%", '')+'" data-id="1" data-name="按场馆">全部场馆</a></div>');
			for(var a = 0; a < data.length; a++){
				content.push('<div class="item"><a href="'+url.replace("%center%", data[a].id)+'" data-id="'+data[a].id+'" data-name="'+data[a].title+'" title="'+data[a].title+'">'+data[a].title+'</a></div>');
			}

			return content.join("");
		}
	}

	//确定工作地区
	$(".area").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name');
		if(id && name){
			$("#fairs")
				.attr("data-id", id)
				.attr("title", name)
				.html(name + '<i></i>');
		}
	});

	$(document).click(function (e) {
		var s = e.target;
		$(".fairsList").parent().hide();
		$(".fairsList").hide();
	});
	//选择场馆 s



})

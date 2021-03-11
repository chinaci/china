$(function(){

	// 左侧筛选条件 收起展开
	$('.screening dt').click(function(){
		var dt = $(this);
		dt.siblings('dd').stop().slideToggle(200);
		dt.parent('dl').toggleClass();
	});

	//左右分页
	$("#totalPage").html(totalPage);
	$("#totalCount").html(totalCount);
	if(totalPage > 1){
		$(".pages").show();
		if(atPage == 1){
			$(".pages .prev").addClass("disabled");
		}else{
			$(".pages .prev").attr("href", pageUrl.replace("pagePlaceholder", atPage - 1));
		}
		if(atPage == totalPage){
			$(".pages .next").addClass("disabled");
		}else{
			$(".pages .next").attr("href", pageUrl.replace("pagePlaceholder", atPage + 1));
		}
	}

	if(totalCount == 0){
		$(".checkAll").hide();
	}


	//选择工作区域 s
	var areaArr = [];
	$('#addr1').click(function(){
		if($(".areaList").is(":visible")){
			$(".areaList").parent().hide();
			$(".areaList").hide();
		}else{
			loadArray($('#addrObj'));
		}

		$(".industryList").parent().hide();
		$(".industryList").hide();
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
				url: masterDomain + "/include/ajax.php?service=job&action=addr&son=1&template=single",
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
			var url = $("#addr1").data("url");

			for(var a = 0; a < data.length; a++){

				content.push('<div class="sub-data" data-id="'+a+'" title="'+data[a].typename+'"><a href="javascript:;">'+data[a].typename+'</a><i></i></div>');
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
		var t = $(this), id = t.attr("data-id");
		if(t.hasClass("no")){
			$("#addr1")
				.attr("data-id", 0)
				.attr("title", "工作地点")
				.html("工作地点<i></i>");

		}else{
			if(t.hasClass("curr")){
				t.removeClass("curr");
				$(".area .sub-data").removeClass("curr");
				$(".area ul").stop().slideUp("fast");
			}else{
				$(".area .sub-data").removeClass("curr");
				$(".area ul").stop().slideUp("fast");

				t.addClass("curr");
				t.parent().find(".area"+id).stop().slideDown("fast");
			}
			return false;
		}
	});

	//确定工作地区
	$(".area").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name');
		if(id && name){
			$("#addr1")
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


	//选择行业领域 s
	var industryArr = [];
	$('#industry').click(function(){
		if($(".industryList").is(":visible")){
			$(".industryList").parent().hide();
			$(".industryList").hide();
		}else{
			loadArray1($('#industryObj'));
		}

		$(".areaList").parent().hide();
		$(".areaList").hide();
		return false;
	})
	function loadArray1(parobj){
		var content = [];

		if(industryArr.length > 0){
			content.push(createIndustry());

		}else{
			content.push('<p align="center">加载中...</p>');
		}


		if($(".industryList").html() == undefined){
			$('<div></div>')
				.attr("class", "industryList fn-clear")
				.html(content.join(""))
				.appendTo(".industry");
		}

		var industryList = $(".industryList");

		if($(".industryList").html().indexOf("加载中") > -1){
			industryList.html(content.join(""));
		}

		parobj.find('.industry, .industryList').show();

		if(industryArr.length <= 0){
			$.ajax({
				url: masterDomain + "/include/ajax.php?service=job&action=industry&son=1",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						industryArr = data.info;
						industryList.html(createIndustry());

					}else{
						industryList.html('<p align="center"><font size="3" color="#ff0000">'+data.info+'</font></p>');
					}
				},
				error: function(){
					industryList.html('<p align="center"><font size="3" color="#ff0000">加载失败，请稍后访问！</font></p>');
				}
			});
		}

	};

	function createIndustry(){
		if($(".industryList").html().indexOf("加载中") > -1 && industryArr){
			var content = [];
			var data = industryArr;
			var subdata = [], f = 0, i = true;
			var url = $("#industry").data("url");

			for(var a = 0; a < data.length; a++){

				content.push('<div class="sub-data" data-id="'+a+'" title="'+data[a].typename+'"><a href="javascript:;">'+data[a].typename+'</a><i></i></div>');
				lower2 = data[a].lower;

				subdata.push('<ul class="fn-clear industry'+a+'">');
				for(var c = 0; c < lower2.length; c++){
					subdata.push('<li><a href="'+url.replace("%industry%", lower2[c].id)+'" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
				}
				subdata.push('</ul>');

				f++;

				if(f == 4 || a == data.length-1){

					if(a == data.length-1 && f < 4){
						i = false;
						content.push('<div class="sub-data no"><a href="'+url.replace("%industry%", "")+'">不限</a></div>');
					}

					content.push(subdata.join(""));
					subdata = [];
					f = 0;
				}

			}

			if(i){
				content.push('<div class="sub-data no"><a href="'+url.replace("%industry%", "")+'">不限</a></div>');
			}

			return content.join("");
		}
	}

	//选择工作地区
	$(".industry").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id");
		if(t.hasClass("no")){
			$(".addrTxt")
				.attr("data-id", 0)
				.attr("title", "行业领域")
				.html("行业领域<i></i>");

		}else{
			if(t.hasClass("curr")){
				t.removeClass("curr");
				$(".industry .sub-data").removeClass("curr");
				$(".industry ul").stop().slideUp("fast");
			}else{
				$(".industry .sub-data").removeClass("curr");
				$(".industry ul").stop().slideUp("fast");

				t.addClass("curr");
				t.parent().find(".industry"+id).stop().slideDown("fast");
			}
			return false;
		}
	});

	//确定工作地区
	$(".industry").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name');
		if(id && name){
			$("#industry")
				.attr("data-id", id)
				.attr("title", name)
				.html(name + '<i></i>');
		}
	});

	$(document).click(function (e) {
		var s = e.target;
		$(".industryList").parent().hide();
		$(".industryList").hide();
	});

	//选择行业领域 e



	var dataInfo;
	var zhinengArr = [];

	//选择职位类型 s
	$("#zn").bind("click", function(){
		var content = [];

		if(zhinengArr.length > 0){
			content.push(createZhineng());
		}else{
			content.push('<p class="loadzhineng" align="center">加载中...</p>');
		}

		dataInfo = $.dialog({
			id: "dataInfo",
			fixed: false,
			title: "选择职位类型",
			content: '<div class="selectType">'+content.join("")+'</div>',
			width: 800,
			height: 450,
			button: [
				{
					name: '不限类别',
					callback: function(){
						var url = $("#zn").data("url").replace("%type%", "");
						$("#zn")
							.attr("data-id", 0)
							.attr("title", "职位类型")
							.html("职位类型<i></i>");
						location.href = url;
					}
				}
			]
		});

		if(zhinengArr.length <= 0){
			$.ajax({
				url: "/include/ajax.php?service=job&action=type&son=1",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						zhinengArr = data.info;
						$(".selectType").html(createZhineng());

					}else{
						$(".selectType").html('<p align="center"><font size="3" color="#ff0000">'+data.info+'</font></p>');
					}
				},
				error: function(){
					$(".selectType").html('<p align="center"><font size="3" color="#ff0000">加载失败，请稍后访问！</font></p>');
				}
			});
		}

	});

	//创建职能HTML
	function createZhineng(){
		var content = [];
		var data = zhinengArr;
		var url = $("#zn").data("url");
		for(var a = 0; a < data.length; a++){
			content.push('<dl>');
			content.push('<dt><span>'+data[a].typename+'</span><s></s></dt>');
			content.push('<dd class="fn-clear">');

			if(data[a].lower.length > 0){
				var lower1 = data[a].lower;
				var subdata = [], f = 0;

				for(var b = 0; b < lower1.length; b++){
					content.push('<div class="sub-data" data-id="'+b+'" title="'+lower1[b].typename+'"><a href="javascript:;">'+lower1[b].typename+'</a><i></i></div>');
					lower2 = lower1[b].lower;

					subdata.push('<ul class="fn-clear zn'+b+'">');
					for(var c = 0; c < lower2.length; c++){
						subdata.push('<li><a href="'+url.replace("%type%", lower2[c].id)+'" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
					}
					subdata.push('</ul>');

					f++;

					if(f == 3 || b == lower1.length-1){
						content.push(subdata.join(""));
						subdata = [];
						f = 0;
					}

				}

			}

			content.push('</dd>');
			content.push('</dl>');
		}

		return content.join("");
	}

	//TAB切换
	$("body").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id"), par = t.closest("dd");
		if(t.hasClass("curr")){
			t.removeClass("curr");
			$(".selectType .sub-data").removeClass("curr");
			$(".selectType ul").stop().slideUp("fast");
		}else{
			$(".selectType .sub-data").removeClass("curr");
			$(".selectType ul").stop().slideUp("fast");

			t.addClass("curr");
			par.find(".zn"+id).stop().slideDown("fast");
		}
	});

	//选择标签
	$("body").delegate(".selectType li a", 'click', function(){
		var t = $(this), id = t.attr("data-id"), name = t.attr("data-name");
		$("#zn")
			.attr("data-id", id)
			.attr("title", name)
			.html(name+'<i></i>');
		dataInfo.close();
	});

	//选择职位类型 e

})

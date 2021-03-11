$(function(){

	var zhinengArr = [];

	//slideshow_1200_60
	$("#slideshow120060").cycle({
		fx: 'scrollUp',
		speed: 300,
		pager: '#slidebtn120060',
		pause: true
	});

	$(".slideshow_1200_60 .close").click(function(){
		$(this).parent().remove();
	});

	var dataInfo;

	//选择职能类别 s
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
			title: "选择职能类别",
			content: '<div class="selectType">'+content.join("")+'</div>',
			width: 800,
			height: 450,
			button: [
				{
					name: '不限类别',
					callback: function(){
						$("#zn")
							.attr("data-id", 0)
							.attr("title", "职能类别")
							.html("职能类别");
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
						subdata.push('<li><a href="javascript:;" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
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
			.html(name);
		dataInfo.close();
	});

	//选择职能类别 e


	//关键词模糊搜索
	$('#q').autocomplete({
      serviceUrl: '/include/ajax.php?service=job&action=post',
      paramName: 'title',
      dataType: 'jsonp',
      transformResult: function(data){
      	var arr = [];
      	arr['suggestions'] = [];
      	if(data && data.state == 100){
      		var list = data.info.list;
      		for(var i = 0; i < list.length; i++){
      			arr['suggestions'][i] = list[i].title;
      		}
      	}
      	return arr;
      },
      lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
          var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
          return re.test(suggestion.value);
      }
  });


	var areaArr = [];

	//选择工作区域 s
	$("#area").bind("click", function(){
		var content = [];

		if(areaArr.length > 0){
			content.push(createArea());

		}else{
			content.push('<p align="center">加载中...</p>');
		}

		if($("#areaList").html() == undefined){
			$('<div></div>')
				.attr("id", "areaList")
				.attr("class", "fn-clear")
				.html(content.join(""))
				.appendTo(".area");
		}

		var areaList = $("#areaList");

		if($("#areaList").html().indexOf("加载中") > -1){
			areaList.html(content.join(""));
		}

		areaList.show();

		if(areaArr.length <= 0){
			$.ajax({
				url: "/include/ajax.php?service=job&action=addr&son=1",
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


	});

	function createArea(){
		if($("#areaList").html().indexOf("加载中") > -1 && areaArr){
			var content = [];
			var data = areaArr;
			var subdata = [], f = 0, i = true;

			for(var a = 0; a < data.length; a++){

				content.push('<div class="sub-data" data-id="'+a+'" title="'+data[a].typename+'"><a href="javascript:;">'+data[a].typename+'</a><i></i></div>');
				lower2 = data[a].lower;

				subdata.push('<ul class="fn-clear area'+a+'">');
				for(var c = 0; c < lower2.length; c++){
					subdata.push('<li><a href="javascript:;" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
				}
				subdata.push('</ul>');

				f++;

				if(f == 4 || a == data.length-1){

					if(a == data.length-1 && f < 4){
						i = false;
						content.push('<div class="sub-data no"><a href="javascript:;">不限</a></div>');
					}

					content.push(subdata.join(""));
					subdata = [];
					f = 0;
				}

			}

			if(i){
				content.push('<div class="sub-data no"><a href="javascript:;">不限</a></div>');
			}

			return content.join("");
		}
	}

	//选择工作地区
	$(".area").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id");
		if(t.hasClass("no")){
			$("#area")
				.attr("data-id", 0)
				.attr("title", "工作地区")
				.html("工作地区");

			$("#areaList").hide();
			return false;

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
			$("#area")
				.attr("data-id", id)
				.attr("title", name)
				.html(name);
		}
	});

	$(document).click(function (e) {
		var s = e.target;
		if ($("#areaList").html() != undefined) {
			if ($.inArray(s, $("#areaList")) < 0) {
				if ($.inArray(s, $("#area")) < 0) {
					if (s.id == "userCenter") {
						$("#areaList").fadeIn();
					} else {
						$("#areaList").hide();
					}
				}
			}
		}
	});

	//选择工作区域 e


	//搜索
	$("#q").bind("input keyup", function(){
		$(this).prev("label").hide();
		if($(this).val() == ""){
			$(this).prev("label").show();
		}
	});

	$("#q").bind("blur", function(){
		if($(this).val() == ""){
			$(this).prev("label").show();
		}
	});

	$("#sBtn").bind("click", function(){
		var keywords = $.trim($("#q").val());
		if(keywords != ""){
			var type = $("#zn").attr("data-id");
			var addr = $("#area").attr("data-id");
			var rurl = $("#sBtn").attr("data-url");

			rurl = rurl.replace("%type", type).replace("%addr", addr).replace("%title", keywords);
			top.location = rurl;
		}else{
			alert("请输入职位或公司名关键字");
		}
	});

	//伯乐
	$(".bole li").hover(function(){
		var index = $(this).index(), i2 = $(this).find(".i2");
		if(index > 3){
			i2.css({"right": 0, "left": "auto"});
		}else{
			i2.css({"right": "auto", "left": 0});
		}
		$(this).addClass('show');
	}, function(){
		$(this).removeClass('show');
	});

	//热门职位
	$("#hotZw").cycle({
		fx: 'blindX',
		speed: 300,
		autostop: true,
		autostopCount: 1,
		pause: true,
		next:	'#zwRight',
		prev:	'#zwLeft'
	});

	//热门职位统计
	$(".post_count").each(function(){
		var t = $(this), id = t.attr("data-id");
		if(id){
			$.ajax({
				url: "/include/ajax.php?service=job&action=post&pageSize=-1&pageInfo=1&industry="+id,
				type: "POST",
				dataType: "jsonp",
				success: function (data) {
					var count = 0;
					if(data && data.totalCount){
						count = data.totalCount;
					}
					t.html(count);
				}
			});
		}
	});

	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		if(screenwidth < criticalPoint){
			$("#hotZw").css({"width": "1050px"});
			$("#hotZw .l-item").css({"width": "1103px"});
			$("#hotZw").cycle({
				fx: 'blindX',
				speed: 300,
				autostop: true,
				autostopCount: 1,
				pause: true,
				next:	'#zwRight',
				prev:	'#zwLeft',
				width: "1050px"
			});

		}else{
			$("#hotZw").css({"width": "1260px"});
			$("#hotZw .l-item").css({"width": "1323px"});
			$("#hotZw").cycle({
				fx: 'blindX',
				speed: 300,
				autostop: true,
				autostopCount: 1,
				pause: true,
				next:	'#zwRight',
				prev:	'#zwLeft',
				width: "1260px"
			});
		}
	});

	//紧急招聘
	$(".jj dl").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});

	//名企招聘
	$(".mq dl").hover(function(){
		var index = $(this).index(), dd = $(this).find("dd");
		$(this).siblings("dl").find("dt").stop().animate({"opacity": "0.3", "filter": "alpha(opacity=30)"}, 200);
		$(this).find("dt").stop().animate({"opacity": "1", "filter": "Alpha(opacity=100)"}, 200);

		if(index%7 > 3){
			dd.css({"left": "-222px"});
		}else{
			dd.css({"left": "152px"});
		}
		if(index > 13){
			dd.css({"bottom": 0, "top": "auto"});
		}else{
			dd.css({"bottom": "auto", "top": "0"});
		}
		$(this).addClass('show');
	}, function(){
		$(this).siblings("dl").find("dt").stop().animate({"opacity": "1", "filter": "Alpha(opacity=100)"}, 200);
		$(this).removeClass('show');
	});

	//招聘会
	$(".zph tr").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});

	//最新简历
	$(".jl dl").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});

});

$(function(){

	// 左侧筛选条件 收起展开
	$('.screening dt').click(function(){
		var dt = $(this);
		dt.siblings('dd').stop().slideToggle(200);
		dt.parent('dl').toggleClass();
	});

	//图表配置选项
	var chart = chartConfig = {
		chart: {renderTo: 'chart', type: 'bar', backgroundColor: 'rgba(0,0,0,0)'},
		title: null,
		xAxis: {
			categories: [
				'计算机软件',
				'电子技术·半导体·集成电路',
				'通信·电信·网络设备',
				'电子技术·半导体·集成电路',
				'汽车及零配件',
				'互联网·电子商务',
				'影视·媒体·艺术·文化传播',
				'制药·生物工程',
				'交通·运输·物流'
			],
			labels: {style: {font: 'normal 14px microsoft yahei'}}
		},
		yAxis: {title: {enabled: false}},
		tooltip: {headerFormat: "",	pointFormat: "{point.y}"},
		navigation: {buttonOptions: {enabled: false}},
		legend: {enabled: false},
		credits: {enabled: false},
		series: [{
			name: "工资",
			color: "#89D8C7",
			data: [107, 310, 635, 203, 200, 500, 800, 1500, 580]
		}]
	}

	//请求数据
	function getPayrollData(){
		var type = $('.tabhead .curr').data('type');

		$("#chart").html('<div class="loading">加载中...</div>');

		$.ajax({
			url: masterDomain + "/include/ajax.php?service=job&action=hotpayroll&type="+type,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data.state == 100){

					chartConfig.xAxis.categories = data.info.names;
					chartConfig.series[0].data = data.info.values;
					chart = new Highcharts.Chart(chartConfig);

				}else{

					chart = new Highcharts.Chart(chartConfig);
					$("#chart").highcharts().destroy();
					$("#chart").html('<div class="empty">'+data.info+'</div>');

				}
			},
			error: function(){

				chart = new Highcharts.Chart(chartConfig);
				$("#chart").highcharts().destroy();
				$("#chart").html('<div class="empty">网络错误，加载失败！</div>');

			}
		});
	}

	//第一次加载
	getPayrollData();

	//类型切换
	$('.tabhead li').bind("click", function(){
		var t = $(this);
		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
			getPayrollData();
		}
	});



	$(".shearWageForm input").bind("input", function(){
		$(".shearWageForm input").removeClass("has-error");
		$(".error").html("");
	});

	//关键词模糊搜索
	$(".companyname").bind("input", function(){
		$("#cid").val(0);
	});
	$(".companyname").autocomplete({
		source: function(request, response) {
			$.ajax({
				url: masterDomain+"/include/ajax.php?service=job&action=company",
				dataType: "jsonp",
				data:{
					title: request.term
				},
				success: function(data) {
					if(data && data.state == 100){
						response($.map(data.info.list, function(item, index) {
							return {
								id: item.id,
								label: item.title
							}
						}));
					}else{
						response([])
					}
				}
			});
		},
		minLength: 1,
		select: function(event, ui) {
			$("#cid").val(ui.item.id);
		}
	}).autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li data-id='"+item.id+"'>")
			.append(item.label)
			.appendTo(ul);
	};


	$("#zn").autocomplete({
		source: function(request, response) {
			$.ajax({
				url: masterDomain+"/include/ajax.php?service=job&action=post",
				dataType: "jsonp",
				data:{
					title: request.term
				},
				success: function(data) {
					if(data && data.state == 100){
						response($.map(data.info.list, function(item, index) {
							return {
								id: item.id,
								label: item.title
							}
						}));
					}else{
						response([])
					}
				}
			});
		},
		minLength: 1
	}).autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li data-id='"+item.id+"'>")
			.append(item.label)
			.appendTo(ul);
	};


	var areaArr = [];

	//选择工作区域 s
	$(".addr").bind("click", function(){
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

		return false;

	});

	function createArea(){
		if($("#areaList").html().indexOf("加载中") > -1 && areaArr){
			var content = [];
			var data = areaArr;
			var subdata = [], f = 0;

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
					content.push(subdata.join(""));
					subdata = [];
					f = 0;
				}

			}

			return content.join("");
		}
	}

	//选择工作地区
	$(".area").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id");
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
	});

	//确定工作地区
	$(".area").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name');
		if(id && name){
			$("#addr").parent().removeClass("has-error");
			$("#addrid").val(id);
			$("#addr")
				.attr("data-id", id)
				.attr("title", name)
				.html(name);
		}
	});

	$(document).click(function (e) {
		$("#areaList").hide();
	});

	//选择工作区域 e


	// 提交表单
	$('.shearWageForm form').submit(function(event){
		event.preventDefault();

    var t = $(".submit"), form = $(this);
		var action = form.attr("action");
    if(t.hasClass("disabled")) return false;

    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		$('.has-error').removeClass('has-error');
		$('.error').text('');
		var ocn = $('.companyname');
		var oaddr = $('#addr');
		var ozn = $('#zn');
		var owage = $('.wagenum');

		var str = [];
		if($.trim(ocn.val()) == '') {
			ocn.addClass('has-error').focus();
			str.push('所在公司');
		}
		if($.trim(oaddr.text()) == '选择区域') {
			oaddr.parent().addClass('has-error');
			if(str == '') oaddr.focus();
			str.push('区域');
		}
		if($.trim(ozn.val()) == '') {
			ozn.addClass('has-error');
			if(str == '') ozn.focus();
			str.push('担任职位');
		}
		if($.trim(owage.val()) == '') {
			owage.addClass('has-error');
			if(str == '') owage.focus();
			str.push('每月工资');
		}
		if(str != '') {
			$('.error').text('请填写 ' + str.join('、'));
			return false;
		}


		t.addClass("disabled");

    $.ajax({
      url: action,
			data: form.serialize(),
      type: "POST",
      dataType: "jsonp",
      success: function (data) {
        t.removeClass("disabled");
        if(data.state == 100){

          $.dialog.tips('发布成功！', 3, 'success.png');

        }else{
          $.dialog.tips(data.info, 3, 'error.png');
        }
      },
      error: function(){
        t.removeClass("disabled");
        $.dialog.tips('网络错误，发布失败！', 3, 'error.png');
      }
    });


	})

})

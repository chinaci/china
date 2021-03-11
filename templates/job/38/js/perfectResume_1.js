$(function(){

	// select
	$(document).on('click','.selBtn',function(event){
		var a = $(this),sel = a.parent('.sel');
		event.stopPropagation();
		if(sel.hasClass('selopen')) {
			$('.sel').removeClass('selopen');
		} else {
			$('.sel').removeClass('selopen');
			sel.addClass('selopen');
		}
	})

	$(document).on('click','.selList a',function(event){
		var a = $(this);
		if(a.attr('id') == 'addr') return;
		var t = a.text(),id = a.attr('data-id');
		a.parents('.sel').children('.selBtn').text(t).attr('data-id',id);
	})

	$("#addr").bind("click", function(){
		loadArray($('.area'));
	})

	// 选择所在城市 s

	var areaArr = [];

	function loadArray(parobj){
		var content = [];

		if(areaArr.length > 0){
			content.push(createArea());

		}else{
			content.push('<p align="center">加载中...</p>');
		}

		if($(".areaList").html() == undefined){
			$('<div></div>')
				.attr("class", "areaList selList fn-clear")
				.html(content.join(""))
				.appendTo(".area");
		}

		var areaList = $(".areaList");

		if($(".areaList").html().indexOf("加载中") > -1){
			areaList.html(content.join(""));
		}

		if(areaArr.length <= 0){
			$.ajax({
				url: masterDomain + "/include/ajax.php?service=job&action=addr&son=1",
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

	$(".area").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id");
		if(t.hasClass("no")){
			$("#addr")
				.attr("data-id", 0)
				.html("所在城市");

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

	//确定所在城市
	$(".area").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name');
		if(id && name){
			$("#addr")
				.attr("data-id", id)
				.attr("title", name)
				.html(name);
		}
	});

	// 选择所在城市 e

	// 表单
	$('.formFirst').submit(function(){
		var r = true;
		$('.has-error').removeClass('has-error');
		$('.error').text('');
		var oname = $('#username'),name = $.trim(oname.val());
		if(name == '') {
			oname.addClass('has-error').focus();
			r = false;
		}
		var oxl = $('#xl'),xl = oxl.attr('data-id');
		if(xl == '0') {
			oxl.addClass('has-error');
			r = false;
		}
		var oyear = $('#year'),year = oyear.attr('data-id');
		if(year == '0') {
			oyear.addClass('has-error');
			r = false;
		}
		var ophone = $('#phone'),phone = $.trim(ophone.val());
		if(phone == '') {
			ophone.addClass('has-error');
			if (r) {
				ophone.focus();
			}
			r = false;
		} else {
			var telReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			if(!telReg){
			    ophone.addClass('has-error');
			    if (r) {
			    	ophone.focus();
			    }
				r = false;
			}
		}
		var oarea = $('#addr'),area = oarea.attr('data-id');
		if(area == '0') {
			oarea.addClass('has-error');
			r = false;
		}
		if(!r) {
			$('.error').text('提示 : 请完善信息！');
			return false;
		}
	})

	$(document).click(function(){
		$('.sel').removeClass('selopen');
	})

})

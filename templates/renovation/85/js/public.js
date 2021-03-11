$(function(){

	$("img").scrollLoading();

	//搜索切换类别
	$(".header .s-type").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});

	$(".header .s-type li").click(function(){
		var t = $(this), type = t.attr("data-type"), s = $(".header .s-type");
		if(type == 1){
			s.find("li").eq(0)
				.html("装修公司")
				.attr("data-type", 1);
			s.find("li").eq(1)
				.html("效果图")
				.attr("data-type", 2);
			$("#search_keyword").attr("placeholder", "挑选您心仪的装修公司");
		}else if(type == 2){
			s.find("li").eq(0)
				.html("效果图")
				.attr("data-type", 2);
			s.find("li").eq(1)
				.html("装修公司")
				.attr("data-type", 1);
			$("#search_keyword").attr("placeholder", "海量精美效果图任你选");
		}
		t.closest('form').attr('action', t.closest('form').data("action" + type));
		$(".header .s-type").removeClass("hover");
	});

	//发布招标
	$(".header .entry").hover(function(){
		$(this).find(".dropdown-menu").stop().show();
	}, function(){
		$(this).find(".dropdown-menu").stop().hide();
	});

	$(".header .entry input").bind("input", function(){
		var dt = $(this).parent().prev("dt");
		$(this).val() == "" ? dt.show() : dt.hide();
	});

	$(".header .entry input").bind("blur", function(){
		if($(this).val() == ""){
			$(this).parent().prev("dt").show();
		}
	});

	$(".header .entry dt").bind("click", function(){
		$(this).next("dd").find("input").focus();
	});

	$("#province").change(function(){
		var sel = $(this), id = sel.val();
		if(id != 0 && id != ""){
			$.ajax({
				type: "GET",
				url: masterDomain+"/include/ajax.php",
				data: "service=renovation&action=addr&son=0&type="+id,
				dataType: "jsonp",
				success: function(data){
					var i = 0, opt = [];
					if(data instanceof Object && data.state == 100){
						for(var key = 0; key < data.info.length; key++){
							opt.push('<option value="'+data.info[key]['id']+'">'+data.info[key]['typename']+'</option>');
						}
						$("#city").html('<option value="">街道</option>'+opt.join("")+'</select>');
					}else{
						$("#city").html('<option value="">街道</option>');
					}
				},
				error: function(msg){
					alert(msg.status+":"+msg.statusText);
				}
			});
		}else{
			$("#city").html('<option value="">街道</option>');
		}
	});


	//提交免费设计
	$(".entry .form_btn").bind("click", function(){
		var f = $(this), form = f.closest(".m-form");
		var str = '',r = true;

		if(f.hasClass("disabled")) return false;

		// 称呼
		var name = form.find('input[name=name]');
		var namev = $.trim(name.val());
		if(namev == '') {
			errmsg(name, '请填写您的称呼');
			r = false;
		}

		// 手机号
		var phone = form.find('input[name=phone]');
		var phonev = $.trim(phone.val());
		if(phonev == '') {
			if (r) {
				phone.focus();
				errmsg(phone, '请输入手机号码');
			}
			r = false;
		} else {
			// var telReg = !!phonev.match(/^(13|14|15|17|18)[0-9]{9}$/);
			// if(!telReg){
		 //    if (r) {
		 //    	phone.focus();
		 //    	errmsg(phone,'请输入正确手机号码');
		 //    }
		 //    r = false;
			// }
		}

		// 区域
		var addr1 = $('#province');
		if(addr1.val() == 0 || addr1.val() == "") {
			if (r) {
				errmsg(addr1, '请选择区域');
			}
			r = false;
		}

		// 街道
		var addr2 = $('#city');
		if(addr2.val() == 0 || addr2.val() == "") {
			if (r) {
				errmsg(addr2, '请选择街道');
			}
			r = false;
		}

		if(!r) {
			return false;
		}

		f.addClass("disabled").val("申请中...");

		var data = [];
		data.push("people="+namev);
		data.push("contact="+phonev);
		data.push("addrid="+addr2.val());

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=renovation&action=sendEntrust",
			data: data.join("&"),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				f.removeClass("disabled").val("立即申请");
				if(data && data.state == 100){
					alert("申请成功，工作人员收到您的信息后会第一时间与你联系，请保持您的手机畅通！");
				}else{
					alert(data.info);
				}
			},
			error: function(){
				alert("网络错误，请重试！");
				f.removeClass("disabled").val("申请中...");
			}
		});


	});



	// -------------------右侧 留下足迹
	// 显示/隐藏表单
	$('.leaveMsg .k1').hover(function(){
		var p = $('.leaveMsg .pen');
		p.addClass('hover');
	},function(){
		var p = $('.leaveMsg .pen');
		p.removeClass('hover');
	}).click(function(){
		var b = $('.leaveMsg');
		b.toggleClass('open').children('.k2').toggleClass('show');
	});

	// 隐藏按钮
	$('.leaveMsg .close').click(function(){
		$('.leaveMsg').toggleClass('open').children('.k2').toggleClass('show');
	});

	//提交
	$('.leaveMsg .form').submit(function(){
		var f = $(this);
		f.find('.has-error').removeClass('has-error');
		var str = '',r = true;
		var btn = $(this).find(".submit");

		if(btn.hasClass("disabled")) return false;

		// 称呼
		var name = f.find('.username');
		var namev = $.trim(name.val());
		if(namev == '') {
			name.focus().addClass('has-error');
			errmsg(name, '请填写您的称呼');
			r = false;
		}

		// 手机号
		if(r){
			var phone = f.find('.userphone');
			var phonev = $.trim(phone.val());
			if(phonev == '') {
				phone.addClass('has-error');
				if (r) {
					phone.focus();
					errmsg(phone, '请输入手机号码');
				}
				r = false;
			} else {
				// var telReg = !!phonev.match(/^(13|14|15|17|18)[0-9]{9}$/);
				// if(!telReg){
				// 		str = '请输入正确手机号码';
				// 		phone.addClass('has-error');
				// 		if (r) {
				// 			phone.focus();
				// 			errmsg(phone, '请输入正确手机号码');
				// 		}
				// 		r = false;
				// }
			}
		}

		// 小区
		if(r){
			var community = f.find('.community');
			var communityv = $.trim(community.val());
			if(communityv == '') {
				community.focus().addClass('has-error');
				errmsg(community, '请填写您的小区');
				r = false;
			}
		}

		if(!r) {
			return false;
		}

		btn.addClass("disabled").val("提交中...");

		var data = [];
		data.push("company="+company);
		data.push("userid="+designer);
		data.push("people="+namev);
		data.push("contact="+phonev);
		data.push("community="+communityv);

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=renovation&action=sendRese",
			data: data.join("&"),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				btn.removeClass("disabled").val("提交");
				if(data && data.state == 100){
					alert("预约成功，工作人员收到您的信息后会第一时间与你联系，请保持您的手机畅通！");
					f.find("input[type=text]").val("");
					$('.leaveMsg .close').click();
				}else{
					alert(data.info);
				}
			},
			error: function(){
				alert("网络错误，请重试！");
				btn.removeClass("disabled").val("提交中...");
			}
		});

		return false;


	})

});



//数量错误提示
var errmsgtime;
function errmsg(div,str){
	$('#errmsg').remove();
	clearTimeout(errmsgtime);
	var top = div.offset().top - 33;
	var left = div.offset().left;

	var msgbox = '<div id="errmsg" style="position:absolute;top:' + top + 'px;left:' + left + 'px;height:30px;line-height:30px;text-align:center;color:#f76120;font-size:14px;display:none;z-index:99999;background:#fff;">' + str + '</div>';
	$('body').append(msgbox);
	$('#errmsg').fadeIn(300);
	errmsgtime = setTimeout(function(){
		$('#errmsg').fadeOut(300, function(){
			$('#errmsg').remove()
		});
	},2000);
};

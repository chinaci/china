$(function(){
	$("img").scrollLoading();

	//二维码
	$("#qrimg").qrcode({
		render: window.applicationCache ? "canvas" : "table",
		width: 87,
		height: 87,
		text: huoniao.toUtf8(pageData.url)
	});


	//通知
	var noticeCla = "";
	$(".bj, .bm-btn, .kp, .sqbtn").bind("click", function(){
		var cla = $(this).attr("class");
		noticeCla = cla;

		if(cla != "bm-btn"){
			$("body").append($(".dy").clone().addClass("popup").fadeIn());
		}else{
			$(".dy").addClass("popup").fadeIn();
		}
		$(".popup_bg").show();

		//根据按钮选中不同的选项
		if(cla != "bm-btn"){
			$(".dy.popup dl .checkbox").removeClass("checked");
			$(".dy.popup .c"+cla).addClass("checked");
		}
		return false;
	});
	$("body").delegate(".dy .close", "click", function(){
		if(noticeCla == "bm-btn"){
			$(this).parent().hide();
		}else{
			$(this).parent().remove();
			$("#verifycode").click();
		}
		$(".popup_bg").hide();
	});

	//修复订阅浮动层IE下不兼容placeholder
	$("body").delegate(".popup input", "click", function(){
		var t = $(this), val = t.val(), placeholder = t.attr("placeholder");
		if(val == placeholder){
			t.val("").removeClass("placeholder");
		}
	});
	$("body").delegate(".popup input", "blur", function(){
		var t = $(this), val = t.val(), placeholder = t.attr("placeholder");
		if(val == ""){
			t.val(placeholder).addClass("placeholder");
		}
	});

	//复选框
	$("body").delegate(".dc dl", "click", function(){
		var t = $(this).find(".checkbox");
		t.hasClass("checked") ? t.removeClass("checked") : t.addClass("checked");
	});

	$("body").delegate(".checkbox", "click", function(){
		var t = $(this);
		t.hasClass("checked") ? t.removeClass("checked") : t.addClass("checked");
	});

	//更新验证码
	var verifycode = $("#verifycode").attr("src");
	$("body").delegate("#verifycode", "click", function(){
		$(this).attr("src", verifycode+"?v="+Math.random());
	});


	//提交订阅信息
	$("body").delegate("#tj", "click", function(){
		var data = [], type = [], t = $(this), obj = t.closest(".dy"), btnhtml = t.html();

		if(t.hasClass("disabled")) return false;

		obj.find("dl").each(function(){
			var checkbox = $(this).find(".checkbox");
			if(checkbox.hasClass("checked")){
				type.push(checkbox.attr('data-val'));
			}
		});

		if(type.length == 0){
			alert('请选择要订阅的信息类型');
			return false;
		}

		data.push("act=loupan");
		data.push("aid="+pageData.id);
		data.push("type="+type.join(","));

		var name = obj.find("#name");
		if(name.val() == "" || name.val() == name.attr("placeholder")){
			alert('请输入您的姓名');
			return false;
		}
		data.push("name="+name.val());

		var phone = obj.find("#phone");
		if(phone.val() == "" || phone.val() == phone.attr("placeholder")){
			alert('请输入您的手机号码');
			return false;
		}
		if(!/(13|14|15|17|18)[0-9]{9}/.test($.trim(phone.val()))){
			alert('手机号码格式错误，请重新输入！');
			return false;
		}
		data.push("phone="+phone.val());

		var vercode = obj.find("#vercode");
		if(vercode.val() == "" || vercode.val() == vercode.attr("placeholder")){
			alert('请输入验证码');
			return false;
		}
		data.push("vercode="+vercode.val());

		var xy = obj.find(".xy");
		if(!xy.hasClass("checked")){
			alert('请先同意[免责协议]');
			return false;
		}

		data = data.join("&");
		t.addClass("disabled").html("提交中...");

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=house&action=subscribe",
			data: data,
			dataType: "JSONP",
			success: function(data){
				if(data && data.state == 100){
					t.removeClass("disabled").html("订阅成功");
					setTimeout(function(){
						t.closest(".dy").find(".close").click();
					}, 1000);
				}else{
					t.removeClass("disabled").html(btnhtml);
					alert(data.info);
				}
			},
			error: function(){
				t.removeClass("disabled").html(btnhtml);
				alert("网络错误，请稍候重试！");
			}
		})

	});


	$("html").delegate(".bdshare_popup_box", "mouseover", function(){
		$(".share").addClass("curr");
	});
	$("html").delegate(".bdshare_popup_box", "mouseout", function(){
		$(".share").removeClass("curr");
	});

});

//百度分享代码
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":["tsina","tqq","qzone","weixin","sqq","renren"],"bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];

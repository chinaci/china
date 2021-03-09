$(function(){
	var formAction = $("#editform").attr("action"),
		init = {
		//提示信息
		showTip: function(type, message){
			var obj = $("#infoTip");
			obj.html('<span class="msg '+type+'">'+message+'</span>').show();

			setTimeout(function(){
				obj.fadeOut();
			}, 5000);
		}
	};

	//头部导航切换
	$(".config-nav button").bind("click", function(){
		var index = $(this).index(), type = $(this).attr("data-type");
		if(!$(this).hasClass("active")){
			$(".item").hide();
			$("input[name=configType]").val(type);
			$(".item:eq("+index+")").fadeIn();
		}
	});

	//咨询热线切换
	$("input[name=hotline_rad]").bind("click", function(){
		var t = $(this);
		if(t.val() == 0){
			t.parent().siblings("#hotline").hide();
		}else{
			t.parent().siblings("#hotline").show();
		}
	});

	//表单验证
	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this);
		huoniao.regex(obj);
	});

	//开启、关闭交互
	$("input[name=subdomain]").bind("click", function(){
		var t = $(this), parent = t.parent().parent().parent(), input = $("#channeldomain"), basehost = $("#basehost").val();
		if(t.val() == 0){
			input.removeClass().addClass("input-large");
			input.prev(".add-on").html("http://");
			input.next(".add-on").hide();
		}else if(t.val() == 1){
			input.removeClass().addClass("input-mini");
			input.prev(".add-on").html("http://");
			input.next(".add-on").html("."+basehost).show();
		}else{
			input.removeClass().addClass("input-mini");
			input.prev(".add-on").html("http://"+basehost+"/");
			input.next(".add-on").hide();
		}
	});

	$("input[name=articleLogo], input[name=channelswitch]").bind("click", function(){
		var t = $(this), parent = t.parent().parent().parent();
		if(t.val() == 1){
			parent.next("dl").show();
		}else{
			parent.next("dl").hide();
		}
	});

	$("input[name=articleUpload], input[name=articleFtp], input[name=articleMark]").bind("click", function(){
		var t = $(this), parent = t.parent().parent().parent();
		if(t.val() == 1){
			parent.next("div").show();
		}else{
			parent.next("div").hide();
		}
	});

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var index = $(".config-nav .active").index(),
			type = $("input[name=configType]").val();

		if(type == "site"){
			var channelname = $("#channelname"),
				channelLogo = $("input[name=articleLogo]:checked").val(),
				litpic = $("#litpic").val(),
				subdomain = $("input[name=subdomain]:checked").val(),
				channeldomain = $("#channeldomain"),
				channelswitch = $("input[name=channelswitch]:checked").val(),
				closecause = $("#closecause").val(),
				title = $("#title").val(),
				keywords = $("#keywords").val(),
				description = $("#description").val();

			//频道名称
			if(!huoniao.regex(channelname)){
				window.scroll(0, 0);
				//$(".config-nav button:eq(0)").click();
				return false;
			};

			//频道LOGO
			if(channelLogo == 1 && $.trim(litpic) == ""){
				window.scroll(0, 0);
				//$(".config-nav button:eq(0)").click();
				init.showTip("error", "请上传频道LOGO！", "auto");
				return false;
			};

			//启用频道域名
			if(subdomain == 0){
				if($.trim(channeldomain.val()) == ""){
					tj = false;
					window.scroll(0, 0);
					//$(".config-nav button:eq(0)").click();
					init.showTip("error", "请输入访问方式！", "auto");
					return false;
				};
			}
		}

		//异步提交
		post = $("#editform .item:eq("+index+")").find("input, select, textarea").serialize();
		if($("input[name=ftpStateType]:checked").val() == 0){
			$("#ftpConfig input").attr("disabled", true);
		}
		huoniao.operaJson(formAction+"?action="+action+"&type="+type, post + "&token="+$("#token").val(), function(data){
			var state = "success";
			if(data.state != 100){
				state = "error";
			}

			if(data.state == 2001){
				$.dialog.alert(data.info);
			}else{
				huoniao.showTip(state, data.info, "auto");
			}

			if(data.state == 100){
				parent.getPreviewInfo();
			}
		});

	});

	//初始化
	$("input[name=subdomain]:checked").click();
});

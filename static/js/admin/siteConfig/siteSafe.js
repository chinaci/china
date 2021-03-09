$(function(){
	//头部导航切换
	$(".config-nav button").bind("click", function(){
		var index = $(this).index(), type = $(this).attr("data-type");
		if(!$(this).hasClass("active")){
			$(".item").hide();
			$("input[name=configType]").val(type);
			$(".item:eq("+index+")").fadeIn();
		}
	});

	//消息通知配置
	$("#siteNotify").bind("click", function(event){
		var href  = $(this).attr("href");

		try {
			event.preventDefault();
			parent.addPage("siteNotifyphp", "siteConfig", "消息通知配置", "siteConfig/"+href);
		} catch(e) {}
	});

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});

	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this);
		huoniao.regex(obj);
	});

	//开启、关闭交互
	$("input[name=regstatus]").bind("click", function(){
		var t = $(this), parent = t.parent().parent().parent();
		if(t.val() == 0){
			$("#reg0").hide();
			$("#reg1").show();
		}else{
			$("#reg0").show();
			$("#reg1").hide();
		}
	});

	//支付成功跳转页面
	$("input[name=payReturnType]").bind("click", function(){
		var t = $(this);
		if(t.val() == 0){
			$(".payReturnType1").hide();
		}else{
			$(".payReturnType1").show();
		}
	});

	//拼接现有问题
	if(safeqa.length > 0){
		var html = [];
		for(var i = 0; i < safeqa.length; i++){
			html.push('<li class="clearfix">');
			html.push('  <span class="row60"><input type="text" name="question[]" class="row90" value="'+safeqa[i].question+'" /></span>');
			html.push('  <span class="row30"><input type="text" name="answer[]" class="row90" value="'+safeqa[i].answer+'" /></span>');
			html.push('  <span class="row10 center"><a href="javascript:;" title="删除" class="del">删除</a></span>');
			html.push('</li>');
		}
		$("#qaList").append(html.join(""));
	}

	//新增安全问题
	$("#addNew").bind("click", function(){
		var html = [];
		html.push('<li class="clearfix">');
		html.push('  <span class="row60"><input type="text" name="question[]" class="row90" /></span>');
		html.push('  <span class="row30"><input type="text" name="answer[]" class="row90" /></span>');
		html.push('  <span class="row10 center"><a href="javascript:;" title="删除" class="del">删除</a></span>');
		html.push('</li>');
		$("#qaList").append(html.join(""));
	});

	//删除安全问题
	$("#qaList").delegate(".del", "click", function(){
		var t = $(this), parent = t.parent().parent();
		parent.remove();
	});

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var index = $(".config-nav .active").index(),
			type = $("input[name=configType]").val();

		//基本设置
		if(type == "basic"){
			var holdsubdomain = $("#holdsubdomain"),
				iplimit = $("#iplimit"),
				regstatus = $("input[name=regstatus]:checked").val(),
				regclosemessage = $("#regclosemessage"),
				replacestr = $("#replacestr");

			//保留子级域名
			if(!huoniao.regex(holdsubdomain)){
				window.scroll(0, 0);
				return false;
			};

			//IP访问限制
			if(!huoniao.regex(iplimit)){
				window.scroll(0, 0);
				return false;
			};

			//会员注册关闭
			if(regstatus == 0){
				if(!huoniao.regex(regclosemessage)){
					window.scroll(0, 0);
					return false;
				};
			}

			//敏感词过滤
			if(!huoniao.regex(replacestr)){
				window.scroll(0, 0);
				return false;
			};

		//验证码
		}else if(type == "verify"){
			var seccodewidth = $("#seccodewidth").val(),
				seccodeheight = $("#seccodeheight").val();

			if(seccodewidth == ""){
				$.dialog.alert("请填写验证码尺寸：宽度");
				return false;
			}

			if(seccodeheight == ""){
				$.dialog.alert("请填写验证码尺寸：高度");
				return false;
			}

		}

		//异步提交
		post = $("#editform .item:eq("+index+")").find("input, select, textarea").serialize();
		huoniao.operaJson("siteSafe.php?action="+type, post + "&token="+$("#token").val(), function(data){
			var state = "success";
			if(data.state != 100){
				state = "error";
			}
			huoniao.showTip(state, data.info, "auto");

			if(type == "verify"){
				$("#sceimg").attr("src", $("#sceimg").attr("src"));
			}

		});
	});


});

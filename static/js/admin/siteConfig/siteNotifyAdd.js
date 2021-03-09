$(function () {

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	//TAB切换
	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		var obj = $(this).attr("href").replace("#", "");
		if(!$(this).parent().hasClass("active")){
			$(this).parent().siblings("li").removeClass("active");
			$(this).parent().addClass("active");

			$(this).parent().parent().next(".tagsList").find("div").hide();
			$("#"+obj).show();
		}
	});

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});

	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this), tip = obj.siblings(".input-tips");
		if(obj.attr("data-required") == "true"){
			if($(this).val() == ""){
				tip.removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				tip.removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}else{
			huoniao.regex(obj);
		}
	});

	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t     = $(this),
			id    = $("#id").val(),
			title = $("#title");

		//关键字
		if(!huoniao.regex(title)){
			huoniao.goTop();
			return false;
		};

		t.attr("disabled", true);

		$.ajax({
			type: "POST",
			url: "siteNotifyAdd.php",
			data: $(this).parents("form").serialize() + "&submit=" + encodeURI("提交"),
			dataType: "json",
			success: function(data){
				if(data.state == 100){
					if($("#dopost").val() == "save"){

						$.dialog({
							fixed: true,
							title: "添加成功",
							icon: 'success.png',
							content: "添加成功！",
							ok: function(){
								try{
									$("body",parent.document).find("#nav-siteNotifyphp").click();
									parent.reloadPage($("body",parent.document).find("#body-siteNotifyphp"));
									$("body",parent.document).find("#nav-siteNotifyAdd s").click();
								}catch(e){
									location.href = thisPath + "siteNotify.php";
								}
							},
							cancel: false
						});

					}else{
						$.dialog({
							fixed: true,
							title: "修改成功",
							icon: 'success.png',
							content: "修改成功",
							ok: function(){
								try{
									$("body",parent.document).find("#nav-siteNotifyphp").click();
									parent.reloadPage($("body",parent.document).find("#body-siteNotifyphp"));
									$("body",parent.document).find("#nav-siteNotifyEdit"+id+" s").click();
								}catch(e){
									location.href = thisPath + "siteNotify.php";
								}
							},
							cancel: false
						});
					}
				}else{
					$.dialog.alert(data.info);
					t.attr("disabled", false);
				};
			},
			error: function(msg){
				$.dialog.alert("网络错误，请刷新页面重试！");
				t.attr("disabled", false);
			}
		});
	});

});

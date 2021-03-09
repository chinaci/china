$(function () {

	huoniao.parentHideTip();

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	$("#birthday").datetimepicker({format: 'yyyy-mm-dd', autoclose: true, minView: 2, language: 'ch'});
	
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

	$("#editform").delegate("select", "change", function(){
		if($(this).parent().siblings(".input-tips").html() != undefined){
			if($(this).val() == 0){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});

	//会员模糊匹配
	$("#user").bind("input", function(){
		$("#userid").val("0");
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("../inc/json.php?action=checkUser", "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					$("#userList").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'" title="'+data[i].username+'">'+data[i].username+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#userList")
						.css({"left": pos.left, "top": pos.top + 36, "width": t.width() + 12})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#userList").html("").hide();
				}
			});

		}else{
			$("#userList").html("").hide();
		}
    });

	$("#userList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id");
		$("#user").val(name);
		$("#userid").val(id);
		$("#userList").html("").hide();
		checkMember($("#user"), name, $("#id").val());
		return false;
	});

	//交友会员模糊匹配
	$("#user2").bind("input", function(){
		$("#company").val("0");
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("?dopost=checkUser&type="+(type+1), "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					$("#userList2").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'" title="'+data[i].username+'">'+data[i].username+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#userList2")
						.css({"left": pos.left, "top": pos.top + 36, "width": t.width() + 12})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#userList2").html("").hide();
				}
			});

		}else{
			$("#userList2").html("").hide();
		}
    });

	$("#userList2").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id");
		$("#user2").val(name);
		$("#company").val(id);
		$("#userList2").html("").hide();
		return false;
	});

	$(document).click(function (e) {
        var s = e.target;
        if (!jQuery.contains($("#userList").get(0), s)) {
            if (jQuery.inArray(s.id, "user") < 0) {
                $("#userList").hide();
            }
        }
    });

	$("#user").bind("blur", function(){
		var t = $(this), val = t.val(), id = $("#id").val();
		if(val != ""){
			checkMember(t, val, id);
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择会员');
		}
	});

	function checkMember(t, val, id){
		var flag = false;
		t.addClass("input-loading");
		huoniao.operaJson("../inc/json.php?action=checkDating", "key="+val+"&id="+id, function(data){
			t.removeClass("input-loading");
			if(data == 200){
				t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>此会员已经开通交友功能！');
			}else{
				if(data) {
					for(var i = 0; i < data.length; i++){
						if(data[i].username == val){
							flag = true;
							$("#userid").val(data[i].id);
						}
					}
				}
				if(flag){
					t.siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>请输入网站对应会员名');
				}else{
					t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择会员');
				}
			}
		});
	}

	//选择标签、技能
	$(".chooseData").bind("click", function(){
		var type = $(this).prev("input").attr("id"), input = $(this).prev("input"), valArr = input.val().split(",");
		huoniao.showTip("loading", "数据读取中，请稍候...");
		huoniao.operaJson("datingMember.php?dopost=get"+type, "", function(data){
			huoniao.hideTip();
			if(data){

				var content = [], selected = [];
				content.push('<div class="selectedTags">已选：</div>');
				content.push('<ul class="nav nav-tabs" style="margin-bottom:5px;">');
				for(var i = 0; i < data.length; i++){
					content.push('<li'+ (i == 0 ? ' class="active"' : "") +'><a href="#tab'+i+'">'+data[i].typename+'</a></li>');
				}
				content.push('</ul><div class="tagsList">');
				for(var i = 0; i < data.length; i++){
					content.push('<div class="tag-list'+(i == 0 ? "" : " hide")+'" id="tab'+i+'">')
					for(var l = 0; l < data[i].lower.length; l++){
						var id = data[i].lower[l].id, name = data[i].lower[l].typename;
						if($.inArray(id, valArr) > -1){
							selected.push('<span data-id="'+id+'">'+name+'<a href="javascript:;">&times;</a></span>');
						}
						content.push('<span'+($.inArray(id, valArr) > -1 ? " class='checked'" : "")+' data-id="'+id+'">'+name+'<a href="javascript:;">+</a></span>');
					}
					content.push('</div>');
				}
				content.push('</div>');

				$.dialog({
					id: "memberInfo",
					fixed: false,
					title: "选择"+(type == "tags" ? "标签" : "兴趣爱好"),
					content: '<div class="selectTags">'+content.join("")+'</div>',
					width: 600,
					okVal: "确定",
					ok: function(){

						//确定选择结果
						var html = parent.$(".selectedTags").html().replace("已选：", ""), ids = [];
						parent.$(".selectedTags").find("span").each(function(){
							var id = $(this).attr("data-id");
							if(id){
								ids.push(id);
							}
						});
						input.val(ids.join(","));
						input.prev(".selectedTags").html(html);

					},
					cancelVal: "关闭",
					cancel: true
				});

				var selectedObj = parent.$(".selectedTags");
				//填充已选
				selectedObj.append(selected.join(""));

				//TAB切换
				parent.$('.nav-tabs a').click(function (e) {
					e.preventDefault();
					var obj = $(this).attr("href").replace("#", "");
					if(!$(this).parent().hasClass("active")){
						$(this).parent().siblings("li").removeClass("active");
						$(this).parent().addClass("active");

						$(this).parent().parent().next(".tagsList").find("div").hide();
						parent.$("#"+obj).show();
					}
				});

				//选择标签
				parent.$(".tag-list span").click(function(){
					if(!$(this).hasClass("checked")){
						var length = selectedObj.find("span").length;
						if(type == "tags" && length >= tagsLength){
							alert("交友标签最多可选择 "+tagsLength+" 个，可在模块设置中配置！");
							return false;
						}
						if(type == "grasp" && length >= graspLength){
							alert("会的技能最多可选择 "+graspLength+" 个，可在模块设置中配置！");
							return false;
						}
						if(type == "learn" && length >= learnLength){
							alert("想学技能最多可选择 "+learnLength+" 个，可在模块设置中配置！");
							return false;
						}
						if(type == "interests" && length >= interestsLength){
							alert("兴趣爱好最多可选择 "+interestsLength+" 个，可在模块设置中配置！");
							return false;
						}

						var id = $(this).attr("data-id"), name = $(this).text().replace("+", "");
						$(this).addClass("checked");
						selectedObj.append('<span data-id="'+id+'">'+name+'<a href="javascript:;">&times;</a></span>');
					}
				});

				//取消已选
				selectedObj.delegate("a", "click", function(){
					var pp = $(this).parent(), id = pp.attr("data-id");

					parent.$(".tagsList").find("span").each(function(index, element) {
                        if($(this).attr("data-id") == id){
							$(this).removeClass("checked");
						}
                    });

					pp.remove();
				});

			}
		});
	});

	//删除已选择的标签/技能（非浮窗）
	$(".selectedTags").delegate("span a", "click", function(){
		var pp = $(this).parent(), id = pp.attr("data-id"), input = pp.parent().next("input");
		pp.remove();

		var val = input.val().split(",");
		val.splice($.inArray(id,val),1);
		input.val(val.join(","));
	});

	//标注地图
	$("#mark").bind("click", function(){
		$.dialog({
			id: "markDitu",
			title: "标注地图位置<small>（请点击/拖动图标到正确的位置，再点击底部确定按钮。）</small>",
			content: 'url:'+adminPath+'../api/map/mark.php?mod=dating&lnglat='+$("#lnglat").val()+"&city="+mapCity,
			width: 800,
			height: 500,
			max: true,
			ok: function(){
				var doc = $(window.parent.frames["markDitu"].document),
					lng = doc.find("#lng").val(),
					lat = doc.find("#lat").val();
				$("#lnglat").val(lng+","+lat);
			},
			cancel: true
		});
	});

	// 选择语言
	$("#languageCon label").click(function(e){
		var t = $(this), input = t.find("input");
		var con = $("#languageCon");
		setTimeout(function(){
			if(input.is(":checked")){
				var count = con.find("input:checked").length;
				if(count > languageLengh){
					input.prop("checked", false);
				}
			}
		}, 200)
	})

	//语音试听
	$("#voicePreview").delegate("a", "click", function(event){
		event.preventDefault();
		var id   = $(this).attr("data-id");
		var audio = new Audio();
		audio.src = id;
		audio.play();

	});

	//视频预览
	$("#videoPreview").delegate("a", "click", function(event){
		event.preventDefault();
		var href = $(this).attr("href"),
			id   = $(this).attr("data-id");

		window.open(href+id, "videoPreview", "height=500, width=650, top="+(screen.height-500)/2+", left="+(screen.width-650)/2+", toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
	});

	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		if(type == 0){
			var addrid = $('#addrid').siblings('.btn-group').find('.addrBtn').attr('data-id');
			var addr = $('#addr').siblings('.btn-group').find('.addrBtn').attr('data-id');
			$('#addrid').val(addrid);
			$('#addr').val(addr);
      var addrids = $('#addrid').siblings('.btn-group').find('.addrBtn').attr('data-ids').split(' ');
      $('#cityid').val(addrids[0]);
    }
		var t           = $(this),
				id          = $("#id").val(),
				userid      = $("#userid").val(),
				user        = $("#user").val(),
				fromage     = $("#fromage").val(),
				toage       = $("#toage").val(),
				dfheight    = $("#dfheight").val(),
				dtheight    = $("#dtheight").val(),
				dfeducation = $("#dfeducation").val(),
				dteducation = $("#dteducation").val(),
				dfincome    = $("#dfincome").val(),
				dtincome    = $("#dtincome").val();

		//会员名
		if(userid == "" || userid == 0 || user == ""){
			$("#user").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			huoniao.goTop();
			return false;
		}

		if(type == 0){

			if(toage != '0' && toage < fromage){
				alert('最大年龄必须大于最小年龄！');
				return false;
			}

			if(dtheight != '0' && dtheight < dfheight){
				alert('最高身高必须大于最少身高！');
				return false;
			}

			if(dteducation != '0' && dteducation < dfeducation){
				alert('最高学历必须大于最低学历！');
				return false;
			}

			if(dtincome != '0' && dtincome < dfincome){
				alert('最高收入必须大于最低收入！');
				return false;
			}

		}

		t.attr("disabled", true);

		$.ajax({
			type: "POST",
			url: "datingMember.php?dopost="+$("#dopost").val(),
			data: $(this).parents("form").serialize() + "&submit=" + encodeURI("提交"),
			dataType: "json",
			success: function(data){
				if(data.state == 100){
					if($("#dopost").val() == "Add"){

						huoniao.parentTip("success", "添加成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
						huoniao.goTop();
						location.reload();

						// huoniao.goTop();
						// $.dialog({
						// 	fixed: true,
						// 	title: "添加成功",
						// 	icon: 'success.png',
						// 	content: "添加成功！",
						// 	ok: function(){
						// 		location.reload();
						// 	},
						// 	cancel: false
						// });

					}else{

						huoniao.parentTip("success", "修改成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
						t.attr("disabled", false);

						// $.dialog({
						// 	fixed: true,
						// 	title: "修改成功",
						// 	icon: 'success.png',
						// 	content: "修改成功！",
						// 	ok: function(){
						// 		try{
						// 			$("body",parent.document).find("#nav-datingMemberphp").click();
						// 			//parent.reloadPage($("body",parent.document).find("#body-datingMemberphp")[0].contentWindow);
						// 			parent.reloadPage($("body",parent.document).find("#body-datingMemberphp"));
						// 			$("body",parent.document).find("#nav-datingMemberEdit"+id+" s").click();
						// 		}catch(e){
						// 			location.href = thisPath + "datingMember.php";
						// 		}
						// 	},
						// 	cancel: false
						// });

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

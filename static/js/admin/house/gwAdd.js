$(function () {

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	var init = {
		//树形递归分类
		treeTypeList: function(type){
			var typeList = [], cl = "";
			if(type == "addr"){
				var l=addrListArr;
				typeList.push('<option value="">选择地区</option>');
			}else{
				var l=typeListArr;
				typeList.push('<option value="">选择开发商</option>');
			}
			for(var i = 0; i < l.length; i++){
				(function(){
					var jsonArray =arguments[0], jArray = jsonArray.lower, selected = "";
					if((type == "type" && typeid == jsonArray["id"]) || (type == "addr" && addr == jsonArray["id"])){
						selected = " selected";
					}
					if(jsonArray['lower'] != "" && type == "type"){
						typeList.push('<optgroup label="'+cl+"|--"+jsonArray["typename"]+'"></optgroup>');
					}else{
						typeList.push('<option value="'+jsonArray["id"]+'"'+selected+'>'+cl+"|--"+jsonArray["typename"]+'</option>');
					}
					for(var k = 0; k < jArray.length; k++){
						cl += '    ';
						var selected = "";
						if((type == "type" && typeid == jArray[k]["id"]) || (type == "addr" && addr == jArray[k]["id"])){
							selected = " selected";
						}
						if(jArray[k]['lower'] != ""){
							arguments.callee(jArray[k]);
						}else{
							typeList.push('<option value="'+jArray[k]["id"]+'"'+selected+'>'+cl+"|--"+jArray[k]["typename"]+'</option>');
						}
						if(jsonArray["lower"] == null){
							cl = "";
						}else{
							cl = cl.replace("    ", "");
						}
					}
				})(l[i]);
			}
			return typeList.join("");
		}

	};


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

	//开发商模糊匹配
	$("#type").bind("input", function(){
		$("#typeid").val("0");
		var val = $(this).val();
		if(val != ""){
			var list = [];
			for(var i = 0; i < kfsListArr.length; i++){
				if(kfsListArr[i].typename.indexOf(val) > -1 && list.length < 10){
					list.push('<li data-id="'+kfsListArr[i].id+'" title="'+kfsListArr[i].typename+'">'+kfsListArr[i].typename+'</li>');
				}
			}
			if(list.length > 0){
				var pos = $(this).position();
				$("#kfsList")
					.css({"left": pos.left, "top": pos.top + 36, "width": $(this).width() + 12})
					.html('<ul>'+list.join("")+'</ul>')
					.show();
			}else{
				$("#kfsList").html("").hide();
			}
		}else{
			$("#kfsList").html("").hide();
		}
    });

	$("#kfsList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id");
		$("#type").val(name);
		$("#typeid").val(id);
		$("#kfsList").html("").hide();
		$("#type").siblings(".input-tips").removeClass().addClass("input-tips input-ok");
		return false;
	});

	$(document).click(function (e) {
        var s = e.target;
        if (!jQuery.contains($("#kfsList").get(0), s)) {
            if (jQuery.inArray(s.id, "type") < 0) {
                $("#kfsList").hide();
            }
        }
    });

	$("#type").bind("blur", function(){
		var val = $(this).val(), flag = false;
		if(val != ""){
			for(var i = 0; i < kfsListArr.length; i++){
				if(kfsListArr[i].typename == val){
					flag = true;
					$("#typeid").val(kfsListArr[i].id);
				}
			}
			if(flag){
				$(this).siblings(".input-tips").removeClass().addClass("input-tips input-ok");
			}else{
				$(this).siblings(".input-tips").removeClass().addClass("input-tips input-error");
			}
		}else{
			$(this).siblings(".input-tips").removeClass().addClass("input-tips input-error");
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
		checkGw($("#user"), name, $("#id").val());
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
			checkGw(t, val, id);
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择会员');
		}
	});

	function checkGw(t, val, id){
		var flag = false;
		t.addClass("input-loading");
		huoniao.operaJson("../inc/json.php?action=checkGw_", "key="+val+"&id="+id, function(data){
			t.removeClass("input-loading");
			if(data == 200){
				t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>此会员已经加入其它开发商，不可以重复添加！');
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

	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		$('#addr').val($('.addrBtn').attr('data-id'));
        var addrids = $('.addrBtn').attr('data-ids').split(' ');
        $('#cityid').val(addrids[0]);
		var t            = $(this),
			id           = $("#id").val(),
			typeid       = $("#typeid").val(),
			type         = $("#type").val(),
			userid       = $("#userid").val(),
			user         = $("#user").val(),
			stores       = $("#stores"),
			addr         = $("#addr").val(),
			litpic       = $("#litpic").val(),
			weight       = $("#weight");

		//开发商
		if(typeid == "" || typeid == 0 || type == ""){
			$("#type").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			huoniao.goTop();
			return false;
		}

		//会员名
		if(userid == "" || userid == 0 || user == ""){
			$("#user").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			huoniao.goTop();
			return false;
		}

		//所属门店
		if(!huoniao.regex(stores)){
			huoniao.goTop();
			return false;
		};

		//工作区域
		if(addr == "" || addr == "0"){
			$("#addrList").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			huoniao.goTop();
			return false;
		}else{
			$("#addrList").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
		}

		if(litpic == ""){
			$.dialog.alert("请上传证件！");
			return false;
		}

		//排序
		if(!huoniao.regex(weight)){
			huoniao.goTop();
			return false;
		}

		t.attr("disabled", true);

		$.ajax({
			type: "POST",
			url: "gwList.php?dopost="+$("#dopost").val(),
			data: $(this).parents("form").serialize() + "&submit=" + encodeURI("提交"),
			dataType: "json",
			success: function(data){
				if(data.state == 100){
					if($("#dopost").val() == "add"){
						huoniao.goTop();
						$.dialog({
							fixed: true,
							title: "添加成功",
							icon: 'success.png',
							content: "添加成功！",
							ok: function(){
								location.reload();
							},
							cancel: false
						});

					}else{
						$.dialog({
							fixed: true,
							title: "修改成功",
							icon: 'success.png',
							content: "修改成功！",
							ok: function(){
								try{
									$("body",parent.document).find("#nav-gwListphp").click();
									parent.reloadPage($("body",parent.document).find("#body-gwListphp"));
									$("body",parent.document).find("#nav-gwListEdit"+id+" s").click();
								}catch(e){
									location.href = thisPath + "gwList.php";
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

	//头部导航切换
	$(".config-nav button").bind("click", function(){
		var index = $(this).index(), type = $(this).attr("data-type");
		if(!$(this).hasClass("active")){
			$(".item").hide();
			$(".item:eq("+index+")").fadeIn();
			$(this).addClass("active").siblings().removeClass("active");
		}
	});

	$("#gwTj .lp").click(function(){
		var id = $(this).attr("data-id"),
			title = $(this).text(),
			href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("loupanEdit"+id, "house", title, "house/"+href);
		} catch(e) {}
	})

});

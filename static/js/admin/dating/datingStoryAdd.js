var uploadCustom = {
	//旋转图集文件
	rotateAtlasPic: function(mod, direction, img, c) {
		var g = {
			mod: mod,
			type: "rotateAtlas",
			direction: direction,
			picpath: img,
			randoms: Math.random()
		};
		$.ajax({
			type: "POST",
			cache: false,
			async: false,
			url: "/include/upload.inc.php",
			dataType: "json",
			data: $.param(g),
			success: function(a) {
				try {
					c(a)
				} catch(b) {}
			}
		});
	}
}

$(function(){

	huoniao.parentHideTip();

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	$("#kdate").datetimepicker({format: 'yyyy-mm-dd', minView: 3, autoclose: true, language: 'ch'});

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

	//模糊匹配会员
	$("#fidname").bind("input", function(){
		$("#fid").val("0");
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("../inc/json.php?action=checkUser", "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择设会员');
					$("#fidList").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'" data-name="'+data[i].username+'">'+data[i].username+"--"+data[i].nickname+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#fidList")
						.css({"left": pos.left, "top": pos.top + 36})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#fidList").html("").hide();
				}
			});

		}else{
			$("#fidList").html("").hide();
		}
    });

	$("#fidList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id"), name = $(this).attr("data-name");
		$("#fidname").val(name);
		$("#fid").val(id);
		$("#fidList").html("").hide();
		checkUser($("#fidname"), name, $("#id").val());
		return false;
	});

	$(document).click(function (e) {
        var s = e.target;
        if (!jQuery.contains($("#fidList").get(0), s)) {
            if (jQuery.inArray(s.id, "fidname") < 0) {
                $("#fidList").hide();
            }
        }
    });

	$("#fidname").bind("blur", function(){
		var t = $(this), val = t.val(), id = $("#id").val();
		if(val != ""){
			checkUser(t, val, id);
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>&nbsp;');
		}
	});

	$("#tidname").bind("input", function(){
		$("#tid").val("0");
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("../inc/json.php?action=checkUser", "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择设会员');
					$("#tidList").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'" data-name="'+data[i].username+'">'+data[i].username+"--"+data[i].nickname+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#tidList")
						.css({"left": pos.left, "top": pos.top + 36})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#tidList").html("").hide();
				}
			});

		}else{
			$("#tidList").html("").hide();
		}
    });

	$("#tidList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id"), name = $(this).attr("data-name");
		$("#tidname").val(name);
		$("#tid").val(id);
		$("#tidList").html("").hide();
		checkUser($("#tidname"), name, $("#id").val());
		return false;
	});

	$(document).click(function (e) {
        var s = e.target;
        if (!jQuery.contains($("#tidList").get(0), s)) {
            if (jQuery.inArray(s.id, "tidname") < 0) {
                $("#tidList").hide();
            }
        }
    });

	$("#tidname").bind("blur", function(){
		var t = $(this), val = t.val(), id = $("#id").val();
		if(val != ""){
			checkUser(t, val, id);
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>&nbsp;');
		}
	});

	function checkUser(t, val, id){
		var flag = false;
		t.addClass("input-loading");
		huoniao.operaJson("../inc/json.php?action=checkDatingStory&type=dating", "key="+val, function(data){
			t.removeClass("input-loading");
			if(data == 200){
				t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>会员已开通成功故事！');
			}else{
				if(data) {
					for(var i = 0; i < data.length; i++){
						if(data[i].username == val){
							flag = true;
							t.val(data[i].username);
						}
					}
				}
				if(flag){
					t.siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>请输入用户名');
				}else{
					t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择设会员');
				}
			}
		});
	}

	//搜索回车提交
    $("#editform input").keyup(function (e) {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode) {
            code = e.keyCode;
        }
        else if (e.which) {
            code = e.which;
        }
        if (code === 13) {
            $("#btnSubmit").click();
        }
    });

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t            = $(this),
			id           = $("#id").val(),
			fid          = $("#fid").val(),
			fidname      = $("#fidname").val(),
			tid          = $("#tid").val(),
			tidname      = $("#tidname").val(),
			litpic       = $("#litpic").val(),
			kdate        = $("#kdate").val(),
			title        = $("#title"),
			content      = $("#content");

		if(fid == "" || fidname == 0){
			huoniao.goInput($("#fidname"));
			$("#fidname").siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请输入申请人用户名');
			return false;
		}

		if(tid == "" || tidname == 0){

		}

		if(litpic == ""){
			huoniao.goInput($("#litpic"));
			$.dialog.alert("请上传合影照片！");
			return false;
		};

		if(kdate == ""){
			huoniao.goInput($("#kdate"));
			$.dialog.alert("请选择两个确定关系时间！");
			return false;
		};

		if(!huoniao.regex(title)){
			huoniao.goInput(title);
			return false;
		};

		if(!huoniao.regex(content)){
			return false;
		}

		t.attr("disabled", true);

		//异步提交
		huoniao.operaJson("datingStoryAdd.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			if(data.state == 100){
				if($("#dopost").val() == "save"){

					huoniao.parentTip("success", "添加成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
					huoniao.goTop();
					location.reload();

				}else{

					huoniao.parentTip("success", "修改成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
					t.attr("disabled", false);

				}
			}else{
				$.dialog.alert(data.info);
				t.attr("disabled", false);
			};
		});
	});

});

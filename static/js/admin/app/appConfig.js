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

	//头部导航切换
	$(".config-nav button").bind("click", function(){
		var index = $(this).index(), type = $(this).attr("data-type");
		if(!$(this).hasClass("active")){
			$(".item").hide();
			$("input[name=configType]").val(type);
			$(".item:eq("+index+")").fadeIn();
		}
	});

	$(".updateDate").datetimepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: 'ch',
		todayBtn: true,
		minView: 2
	});

	//禁用模块
    $("#tplList").delegate(".disabled", "click", function () {
        var t = $(this), li = t.closest("li"), ul = t.closest(".tpl-list"), img = li.find(".img"),
            id = img.attr("data-id");
        if (!li.hasClass("disabled")) {
            li.addClass("disabled");
            t.html('已禁用');
        }else{
			li.removeClass("disabled");
			t.html('禁用');
        }
        return false;
    });


	//手机底部按钮
	$('#bottomButton').bind('click', function(){
		var href = $(this).attr("href");
	  	try {
	  		event.preventDefault();
	  		parent.$(".h-nav a").each(function(index, element) {
	        	if($(this).attr("href") == href){
	  				parent.$(this).click();
	  				return false;
	  			}
	  		});
	  	} catch(e) {}
	});

	var formAction = $("#editform").attr("action");

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var index = $(".config-nav .active").index(),
			type = $("input[name=configType]").val();

		//禁用模块提取
		var disabledModule = [];
		$("#tplList").find('li.disabled').each(function(){
			var t = $(this), mid = t.find('.img').attr('data-id');
			if(mid != 'skin1' && mid != 'skin2' && mid != 'skin3' && mid != 'skin4' && mid != 'skin5' && mid != 'skin6' && mid != 'skin7' && mid != 'skin8' && mid != 'skin9' && mid != 'skin10'){
				disabledModule.push(mid);
			}
		});
		$('#disabledModule').val(disabledModule.join(','));

		//异步提交
		huoniao.operaJson(formAction, $("#editform").serialize(), function(data){
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

});

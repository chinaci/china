$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];


	//表单验证
	$("#editform").delegate("select", "change", function(){
		if($(this).parent().siblings(".input-tips").html() != undefined){
			if($(this).val() == 0){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t            = $(this),
			id           = $("#id").val(),
			typeid       = $("#typeid").val();

		//分类
		// if(typeid == "" || typeid == "0"){
		// 	$("#typeidList").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
		// 	tj = false;
		// 	huoniao.goTop();
		// 	return false;
		// }else{
		// 	$("#typeidList").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
		// }

		var imgli = $("#listSection2 li");

		if(imgli.length == 0){
			$.dialog.alert("请上传照片");
			return false;
		}

		t.attr("disabled", true);

		//异步提交
		huoniao.operaJson("datingAlbum.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			if(data.state == 100){
				if($("#dopost").val() == "add"){
					$.dialog({
						fixed: true,
						title: "添加成功",
						icon: 'success.png',
						content: "添加成功！",
						ok: function(){
							try{
								$("body",parent.document).find("#nav-datingMemberAlbum"+$("#userid").val()).click();
								//parent.reloadPage($("body",parent.document).find("#body-loupanListphp")[0].contentWindow);
								parent.reloadPage($("body",parent.document).find("#body-datingMemberAlbum"+$("#userid").val()));
								$("body",parent.document).find("#nav-datingAlbumAdd"+$("#userid").val()+" s").click();
							}catch(e){
								location.href = thisPath + "datingAlbum.php?userid="+$("#userid").val();
							}
						},
						cancel: false
					});

				}
			}else{
				$.dialog.alert(data.info);
				t.attr("disabled", false);
			};
		});
	});

	//图集排序
	$(".list-holder ul").dragsort({ dragSelector: "li", placeHolderTemplate: '<li class="holder"></li>' });

});

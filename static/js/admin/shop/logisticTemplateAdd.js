$(function(){

	$("input[name=bearFreight]").bind("click", function(){
		var val = $(this).val();
		if(val == 1){
			$(".freight").hide();
		}else{
			$(".freight").show();
		}
	});

	$("input[name=valuation]").bind("click", function(){
		var val = $(this).val(), i = $(".freight i");
		if(val == 0){
			i.html("件");
		}else if(val == 1){
			i.html("kg");
		}else if(val == 2){
			i.html("m³");
		}
	});


	//保存
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t = $(this);

		t.attr("disabled", true);
		huoniao.operaJson("logisticTemplate.php?dopost=add", $("#editform").serialize() + "&submit=" + encodeURI("提交"), function(data){
			if(data.state == 100){
				if($("#dopost").val() == "add"){
					$.dialog({
						fixed: true,
						title: "添加成功",
						icon: 'success.png',
						content: "添加成功！",
						ok: function(){
							window.location.reload();
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
								var hz = "php";
								if(sid){
									hz = sid;
								}
								$("body",parent.document).find("#nav-logisticTemplate"+hz).click();
								parent.reloadPage($("body",parent.document).find("#body-logisticTemplate"+hz));
								$("body",parent.document).find("#nav-logisticTemplateEdit"+$("#id").val()+" s").click();
							}catch(e){
								location.href = thisPath + "logisticTemplate.php?sid="+sid;
							}
						},
						cancel: false
					});
				}
			}else{
				$.dialog.alert(data.info);
				t.attr("disabled", false);
			};
		}, function(){
			$.dialog.alert("网络错误，请刷新页面重试！");
			t.attr("disabled", false);
		});
	});

});

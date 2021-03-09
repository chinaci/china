$(function () {
	
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
		
	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t   = $(this),
			id    = $("#id").val(),
			state = $("input[name='state']:checked").val(),
			note  = $("#note").val(),
			tj    = true;
		
		if(state == undefined){
			$.dialog.alert("请选择状态！");
			return false;
		}
		if(note == ""){
			$.dialog.alert("请输入备注！");
			return false;
		}

		if(tj){
			t.attr("disabled", true);
			$.ajax({
				type: "POST",
				url: "withdrawEdit.php?action="+action,
				data: $(this).parents("form").serialize()+"&submit=" + encodeURI("提交"),
				dataType: "json",
				success: function(data){
					if(data.state == 100){
						$.dialog({
							fixed: true,
							title: "更新成功",
							icon: 'success.png',
							content: "更新成功！",
							ok: function(){
								location.reload();
							},
							cancel: false
						});
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
		}
	});
	
});
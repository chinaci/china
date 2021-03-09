$(function () {

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];


	//打款
	$("#payment").bind("click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要打款吗？', function(){
			huoniao.showTip("loading", "正在操作，请稍候...");
			huoniao.operaJson("withdrawEdit.php?dopost=transfers", "id="+id, function(data){
				if(data.state == 100){
					huoniao.showTip("success", data.info, "auto");
					setTimeout(function() {
						location.reload();
					}, 500);
				}else{
					$.dialog.alert(data.info);
				}
			});
		});
	});


	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t   = $(this),
			id    = $("#id").val(),
			state = $("input[name='state']:checked").val(),
			auditstate = $("input[name='auditstate']:checked").val(),
			note  = $("#note").val(),
			tj    = true;

		if(state == undefined && auditstate == undefined ){
			$.dialog.alert("请选择状态！");
			return false;
		}
		if(note == "" && (state == 2 || auditstate == 2)){
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
function fail(type){
	if(type == 'fail'){
		$('#fail').show();
	}else{
		$('#fail').hide();

	}
}


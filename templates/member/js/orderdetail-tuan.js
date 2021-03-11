$(function(){

	//收货
	$(".sh").bind("click", function(){
		var t = $(this);
		if(t.attr("disabled") == "disabled") return;

		if(confirm(langData['siteConfig'][20][545])){  //确定要收货吗？
			t.html(langData['siteConfig'][6][35]+"...").attr("disabled", true);  //提交中

			$.ajax({
				url: "/include/ajax.php?service=tuan&action=receipt",
				data: "id="+id,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){
						location.reload();

					}else{
						alert(data.info);
						t.attr("disabled", false).html(langData['siteConfig'][6][45]);  //确认收货
					}
				},
				error: function(){
					$.dialog.alert(langData['siteConfig'][20][183]); //网络错误，请重试！
					t.attr("disabled", false).html(langData['siteConfig'][6][45]); //确认收货
				}
			});

		}

	});

});

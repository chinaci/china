$(function() {
	// 显示描述内容...
	$('tr.main').mouseover(function(){
		var tr = $(this);
		$('.listTab .show').removeClass('show');
		$('.listTab .curr').removeClass('curr');
		tr.addClass('curr').next().addClass('show');
	});

	//下载
	$(".down a").bind("click", function(){
		var t = $(this), id = t.closest("tr").data("id");

    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(id && !t.hasClass("disabled")){

			t.addClass("disabled");

			$.ajax({
				url: masterDomain + "/include/ajax.php?service=job&action=downloadFile&id="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					t.removeClass("disabled");
					if(data.state == 100){
						window.open(data.info);
					}else{
						$.dialog.tips(data.info, 3, 'error.png');
					}
				},
				error: function(){
					t.removeClass("disabled");
					$.dialog.tips('网络错误，下载失败！', 3, 'error.png');
				}
			});

		}
	});
})

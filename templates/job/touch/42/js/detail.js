$(function(){

	$('.appMapBtn').attr('href', OpenMap_URL);

	//应聘
	$("#yp").bind("click", function(){
		var t = $(this);
		if(t.hasClass("disabled")) return false;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain + '/login.html'
			return false;
		}

		t.addClass("disabled");

		$.ajax({
			url: masterDomain + "/include/ajax.php?service=job&action=delivery&id="+id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				t.removeClass("disabled");
				if(data.state == 100){
					if(data.info.url!=undefined && data.info.url!=null){
						location.href = data.info.url;
						return false;
					}
					// $.dialog.tips('简历已成功投出去了，请静候佳音！', 3, 'success.png');
					alert('简历已成功投出去了，请静候佳音！')
				}else{
					// $.dialog.tips('网络错误，投递失败！', 3, 'error.png');
					alert(data.info)
				}
			},
			error: function(){
				t.removeClass("disabled");
				// $.dialog.tips('网络错误，投递失败！', 3, 'error.png');
				alert('网络错误，投递失败！2')
			}
		});

	});

	//收藏
	$("#sc").bind("click", function(){
		var t = $(this);
		if(t.hasClass("disabled")) return false;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain + '/login.html'
			return false;
		}

		t.addClass("disabled");
		var type = t.hasClass("has") ? "del" : "add";

		$.ajax({
			url: masterDomain + "/include/ajax.php?service=member&action=collect&module=job&temp=job&type="+type+"&id="+id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				t.removeClass("disabled");
				if(data.state == 100){

					if(type == "add"){
						t.find('.liked').css('display','block');
						t.find('.like').hide();
					}else{
						t.find('.liked').hide;
						t.find('.like').show();
					}
					t.toggleClass('has');

				}else{
					// $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
					alert('网络错误，收藏失败！')
				}
			},
			error: function(){
				t.removeClass("disabled");
				// $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
				alert('网络错误，收藏失败！')
			}
		});

	});

})

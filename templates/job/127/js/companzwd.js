$(function(){

  //应聘
  $("#yp").bind("click", function(){
    var t = $(this);
    if(t.hasClass("disabled")) return false;

    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
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
                $.dialog.tips(data.info.info, 3, 'alert.png');
                setTimeout(function(){
                    location.href = data.info.url;
                }, 2000);
                return false;
            }
          $.dialog.tips('简历已成功投出去了，请静候佳音！', 3, 'success.png');
        }else{
          $.dialog.tips(data.info, 3, 'error.png');
        }
      },
      error: function(){
        t.removeClass("disabled");
        $.dialog.tips('网络错误，应聘失败！', 3, 'error.png');
      }
    });

  });

  //收藏
  $("#sc").bind("click", function(){
    var t = $(this);
    if(t.hasClass("disabled")) return false;

    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

    t.addClass("disabled");

    $.ajax({
      url: masterDomain + "/include/ajax.php?service=member&action=collect&module=job&temp=job&type=add&id="+id,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        t.removeClass("disabled");
        if(data.state == 100){

          $.dialog.tips('收藏成功！', 3, 'success.png');

        }else{
          $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
        }
      },
      error: function(){
        t.removeClass("disabled");
        $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
      }
    });

  });
});



$(function(){

  //搜索
  $("#search").bind("click", function(){

    var keywords = $.trim($("#keywords").val()), price1 = $.trim($("#price1").val()), price2 = $.trim($("#price2").val());
    var data = [];
    if(keywords != "" && keywords != langData['shop'][2][10]){
      data.push("keywords="+keywords);
    }
    if(price1 != "" || price2 != ""){
      var price = [];
      if(price1 != ""){
        price.push(price1);
      }
      price.push(",");
      if(price2 != ""){
        price.push(price2);
      }
      data.push("price="+price.join(""));
    }

    var param = pageUrl.indexOf(".html") > -1 ? "?" : "&";
    location.href = pageUrl + param + data.join("&");

  });

  //回车提交
  $(".codi input").keyup(function (e) {
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
			$("#search").click();
		}
	});

  //热卖商品排行
  $(".hot ul li").hover(function(){
		$li=$(this);
		$li.find("p").addClass("on");
		$li.siblings("li").find("p").removeClass("on");
		$li.find("dl").addClass("on");
		$li.siblings("li").find("dl").removeClass("on");
	})

  // 收藏
  $('.collect').click(function(){
    var t = $(this), type = t.hasClass("has") ? "del" : "add";
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      huoniao.login();
      return false;
    }
    t.toggleClass('has');
    $.post("/include/ajax.php?service=member&action=collect&module=shop&temp=store-detail&type="+type+"&id="+id);
  });

});

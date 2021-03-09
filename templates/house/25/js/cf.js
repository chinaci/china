$(function(){

	$("img").scrollLoading();

	//区域、公交/地铁
	$(".t-fi-item li a").bind("click", function(){
		var t = $(this).parent(), index = t.index();
		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
			$(".t-fi .sub-fi").hide();
			$(".t-fi .sub-fi:eq("+index+")").show();
		}else{
			t.removeClass("curr");
			$(".t-fi .sub-fi:eq("+index+")").hide();
		}
	});


	//排序
	$(".orderby .o-c a").bind("click", function(){
		var t = $(this);

		//筛选
		if(t.hasClass("fi")){
			t.hasClass("on") ? t.removeClass("on") : t.addClass("on");
			return;
		}


		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("a").removeClass("curr");
		}else{
			if(t.hasClass("curr") && t.hasClass("ob")){
				t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
			}
		}

	});
	

});
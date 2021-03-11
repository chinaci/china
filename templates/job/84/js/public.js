$(function(){

	$("img").scrollLoading();

	//导航【鼠标经过】
	$(".nav li").hover(function(){
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");
	}, function(){
		$(".nav li").removeClass("active");
		$(".nav ul").find(".curr").addClass("active");
	});

});

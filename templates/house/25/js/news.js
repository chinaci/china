$(function(){

	$("img").scrollLoading();

	//分类切换显示
	$(".category dt").bind("click", function(){
		var par = $(this).closest("dl");
		par.hasClass("on") ? (par.find("dd").hide(), par.removeClass("on")) : (par.find("dd").show(), par.addClass("on"));
	});
	
});
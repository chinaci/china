$(function(){

	$("img").scrollLoading();

	$("#totalCount").html(totalCount);

	//更多筛选条件
	$(".filter .more .item").hover(function(){
		$(this).find("ul").stop().slideDown(150);
	}, function(){
		$(this).find("ul").stop().slideUp(150);
	});

	//排序
	$(".sortby .sort").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});

});

$(function(){

	$("#totalCount").html(totalCount);

	// 窄屏下鼠标移入设计师名字上方
	var showlongt;
	$('.short').mouseover(function(){
		$(this).parent('.txt').addClass('hover');
	});
	$(document).on('mouseleave','.hover .long',function(){
		$(this).parent('.txt').removeClass('hover');
	});

	// 设计师作品 滚动
	$(".slide").slide({
		mainCell: "ul",
		effect: "left",
		vis: 4,
		autoPlay: false,
		switchLoad: "_src"
	});

})

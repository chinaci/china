$(function(){

	$("#totalCount").html(totalCount);

	// 窄屏下鼠标移入公司列表
	var showlongt;
	$('.list li').hover(function(){
		if($('html').hasClass('w1200')) return;
		$(this).addClass('hover');
	},function(){
		if($('html').hasClass('w1200')) return;
		$(this).removeClass('hover');
	});

})

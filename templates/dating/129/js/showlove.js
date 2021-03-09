$(function(){
	//大图幻灯
	$("#slide").cycle({
		pager: '#slidebtn'
	});

	$("img").scrollLoading();
	
	$('.showlist li').hover(function(){
		var li = $(this)
		li.addClass('hover')
	},function(){
		var li = $(this)
		li.removeClass('hover')
	})
})

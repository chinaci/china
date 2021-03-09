$(function(){
	// 电话
	$('.bmain').find('.telphone').hover(function() {
		$(this).next('.c_telphone').css("display","block");
	},function(){
		$(this).next('.c_telphone').css("display","none");
	});

	
})
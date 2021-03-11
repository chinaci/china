$(function(){

	$('.tab-box span').click(function(){
		var index = $(this).index(),
			 wrap = $('.choose-box .wrapper').eq(index);
		$(this).addClass('active').siblings().removeClass('active');
		if (wrap.css('display') == "none") {
			wrap.show().siblings().hide();
		}
	})

	$('.appMapBtn').attr('href', OpenMap_URL);


})

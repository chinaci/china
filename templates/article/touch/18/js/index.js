$(function(){
	// 滚动图片
    $('#picscroll').slider();
    $(window).resize(function(){
        var bannaH = $('.swiper-slide img').height();
        $('.swiper-container').height(bannaH + 'px')
    })

    $('img').scrollLoading();

    // 订阅天气
    $('#rss').click(function(){
    	var owea = $('.weatherRss');
        if(owea.parent().is('.modalwrap')) {
            $('.modalwrap').addClass('open');
        } else {
            var $wrap = '<div class="modalwrap open">';
            owea.wrapAll($wrap).after('<div class="modalBg"></div>');
        }
    })
    // 取消订阅
    $(document).on('click','.modalBg ,#cancelRss',function(){
    	$('.modalwrap').removeClass('open');
    })
    // 确定订阅
    $(document).on('click','#confirmRss',function(){
    	$('.modalwrap').removeClass('open');
    })

})

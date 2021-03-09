$(function(){

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.search').css('margin-top', 'calc(.9rem + 20px)');
	}

	$('img').scrollLoading();

	// 幻灯片
	new Swiper('#slider', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

	// 栏目滑动
	if ($('#slideNav li').length > 8) {
		var mySwiper = new Swiper('#slideNav', {pagination: '.swiper-pagination'})
	}

	// 下部列表
	$('.content-lead ul li').click(function(){
		var  u = $(this);
		var index = u.index();
		$('.content .content-list').eq(index).show();
		$('.content .content-list').eq(index).siblings().hide();
		u.addClass('ll');
		u.siblings('li').removeClass('ll');
	})

})

$(function(){

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.info').css('margin-top', 'calc(.9rem + 20px)');
	}

	var mySwiper = new Swiper('.swiper-container', {pagination : '.swiper-pagination',})

})

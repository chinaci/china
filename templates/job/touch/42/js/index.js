$(function(){

	// 头部幻灯片
	new Swiper('.swiper-container', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

	// 上滑下滑导航隐藏
 	var upflag = 1, downflag = 1, fixFooter = $(".fixFooter");
 	//scroll滑动,上滑和下滑只执行一次！
 	scrollDirect(function (direction) {
 		if (direction == "down") {
 			if (downflag) {
 				fixFooter.hide();
 				downflag = 0;
 				upflag = 1;
 			}
 		}
 		if (direction == "up") {
 			if (upflag) {
 				fixFooter.show();
 				downflag = 1;
 				upflag = 0;
 			}
 		}
 	});



})

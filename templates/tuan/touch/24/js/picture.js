$(function() {

	
	// 返回
	$('.header-l').click(function(){
		history.go(-1);
	})

	var mySwiper = new Swiper('.swiper-container', {
		onSlideChangeStart: function(swiper){
			getImage(swiper.activeIndex);
		}
	});

	mySwiper.swipeTo(atPage, 100, false);
	getImage(atPage);



	function getImage(index){
		var li = $(".swiper-container li:eq("+index+")"), type = li.data("type"), img = li.find("img"), src = img.data("src"), alt = img.attr("alt");

		img.attr("src", src);
		$(".f14").html(alt);

	}


	
})
$(document).ready(function(){
		var height = $(window).height() - $('.pic-btn').height()-$('.photo-head-h').height();
		$('.swiper-container,.swiper-slide').css('height',height);
		$('.swiper-slide').css('line-height',height+'px');
	});
$(function(){
	 $('.pic-tab a').click(function(){
	 	if (!$(this).hasClass('active')) {
	 		var index = $(this).index();
	 		$(this).addClass('active').siblings().removeClass('active');
	 		$('.pic-list').eq(index).show().siblings('.pic-list').hide();

	 		var html = '<figure itemprop="associatedMedia" itemscope itemtype=""><a href="upfile/l4.jpg" itemprop="contentUrl" data-size="1024x768"><img src="upfile/l4.jpg" itemprop="thumbnail" alt="Image description" /></a></figure>';
	 		var active = $('.content .pic-list').eq(index);
	 		active.children('.my-gallery').html(html);
	 		active.show().siblings().hide();
	 	}
	 })

	 // 返回
	$('.header-l').click(function(){
		history.go(-1);
	})

})
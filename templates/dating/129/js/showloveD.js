$(function() {
	// 点赞
	$('.zan').click(function(event) {
		var zan = $(this)
		if (zan.hasClass('actived')) return
		zan.addClass('actived')
		var w = zan.children('span');
		var n = parseInt(w.text()) + 1
		w.text(n)
	});

	// 右侧固定
	$('.mainright.pinned').pined({});

})

//固定菜单
+(function ($) {
	$.fn.pined = function(options){
		var defaults = {'topBC':0,'parents':'','WinMinHeight':480};
		var setting = $.extend({},defaults,options);

		var $this = $(this);
		// var tw = $this.width();
        var Height = $this.outerHeight();
        var objTop = $this.offset().top ;
        var flstr = $this.css('float');


		$this.wrapAll('<div class="pinedBox" style="height:' + Height + 'px;float:' + flstr + ';">')

		$(window).scroll(function(){
            if($(window).height()<setting.WinMinHeight){$(this).removeClass('fixed_s').css('top',0);return;}
            var objMaxTop = setting.parents!='' ? $(setting.parents).offset().top + $(setting.parents).outerHeight() : 99999 ;
			var scrollTop = $(document).scrollTop();
			if(scrollTop < objTop || scrollTop > objMaxTop){
				$this.removeClass("fixed_s");
			}
			if(scrollTop > objTop && scrollTop < objMaxTop){
				$this.addClass("fixed_s").css({'top':setting.topBC+'px'});
			}
		})
	}
})(jQuery);


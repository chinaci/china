$(function(){
	$('.areatype li a').click(function(){
		var a = $(this), p = a.parent('li'), index = p.index();
		if(p.hasClass('curr')) return;
		p.addClass('curr').siblings().removeClass('curr');
		$('.select_area .areabox').eq(index).show().siblings('.areabox').hide();
	})
})
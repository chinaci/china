$(function(){
	$('#sx a').click(function(){
		var a = $(this), s = a.attr('data-show');
		if(a.hasClass('curr')) return;
		a.addClass('curr').siblings().removeClass('curr');
		$(s).show().siblings().hide();
	})

})
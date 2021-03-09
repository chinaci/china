$(function(){
	$('.choose1').delegate('li', 'click', function() {
		$(this).toggleClass('active').siblings().removeClass('active')
	})
	$('.choose2').delegate('li', 'click', function() {
		$(this).toggleClass('active').siblings().removeClass('active')
	})
	$('.choose3').delegate('li', 'click', function() {
		$(this).toggleClass('choosed');
	})

	
})
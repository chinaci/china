$('.rewardbox').on('click','.lright',function(){
	if($(this).hasClass('cared')){
		$(this).removeClass('cared').text('关注');
	}else{
		$(this).addClass('cared').text('已关注');
	}
})

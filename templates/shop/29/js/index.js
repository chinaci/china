$(function(){

	//大图幻灯
	$("#slide").cycle({
		pager: '#slidebtn',
		pause: true
	});

	//推荐优质商家
	$(".recbus li").hover(function(){
		var t = $(this);
		t.find("img").stop().animate({"margin-top": "-10px"}, 250);
		t.find("p").stop().animate({"opacity": "1"}, 250);
	}, function(){
		var t = $(this);
		t.find("img").stop().animate({"margin-top": "0"}, 250);
		t.find("p").stop().animate({"opacity": "0"}, 250);
	});

	//产品分类切换
	$(".tlist").cycle({
		pager: '.tcorl',
		pause: true,
		speed: 500
	});

	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		if(screenwidth < criticalPoint){
			$(".tlist .item").css({'width': '1010px'});
		}else{
			$(".tlist .item").css({'width': '1210px'});
		}
	});

});

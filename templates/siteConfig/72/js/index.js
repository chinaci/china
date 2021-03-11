$(function(){

	//页面自适应设置
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		var criticalPoint = criticalPoint != undefined ? criticalPoint : 1240;
		var criticalClass = criticalClass != undefined ? criticalClass : "w1200";
		if(screenwidth < criticalPoint){
			$("html").removeClass(criticalClass);
			$("html").addClass('w1000');

		}else{
			$("html").addClass(criticalClass);
			$("html").removeClass('w1000');
		}

	});

	// 厦门小鱼下拉框
	$('.type-link').hover(function(){
		$(this).find('.type-panel').show();
	},function(){
		$(this).find('.type-panel').hide();
	})

	// 小鱼微信
	$('li.weixin').hover(function(){
		$(this).find('.fish_weixin').show();	
	},function(){
		$(this).find('.fish_weixin').hide();	
	})

	// 新闻幻灯片
	jQuery(".news-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
	});

	// 右侧新闻幻灯片
	jQuery(".news-slide-r").slide({
		mainCell: ".bd ul",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
	});


	//公告切换
	$(".notice-tap li").each(function(index) {
		$(this).hover(function() {
			$(this).addClass('on');
			$(this).siblings().removeClass('on');
			$(".notice-item").eq(index).show();
			$(".notice-item").eq(index).siblings().hide();
		})
	})

	// 鱼鱼爆料
	$(".baoliao-slide h3").each(function(index) {
		$(this).hover(function() {
			$(this).hide();
			$(this).parent().siblings().find('h3').show();
			$(this).siblings('.baoliao-slide-img').show();
			$(this).parent().siblings().find('.baoliao-slide-img').hide();
		})
	})

	// 热门点击
	$(".txt-slide").slide({
		mainCell:".bd ul",
		autoPage:true,
		effect:"topLoop",
		autoPlay:true
	});

	// 小鱼策划手风琴
	$(".coupon-slide").slide({
		titCell:"h3", 
		targetCell:".coupon-bd-info",
		defaultIndex:1,
		effect:"fade",
		delayTime:0,
		returnDefault:true
	});

	// 小鱼策划
	$(".coupon-tab li").hover(function() {
		$(this).addClass('on');
		$(this).siblings().removeClass('on');
		var index = $(".coupon-tab li").index(this);
		$('.coupon-con .coupon-item').eq(index).show();
		$('.coupon-con .coupon-item').eq(index).siblings().hide();

		$(".coupon-line").stop().animate({
			left: 20 + index * 66 + "px"
		}, 400);
	})
	

	// 美食吃货
	$(".block-rec").slide({
		effect: "fade",
		delayTime:0
	});

	$('.eat-con li a').hover(function(){
		$(this).find('p').show();
	},function(){
		$(this).find('p').hide();
	})

	// 房产楼市幻灯片
	$(".estate-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
	});

	// 房产楼市滚动图片
	$(".estate-img").slide({
		mainCell: ".bd ul",
		autoPlay: true,
		effect: "leftLoop",
		autoPage: true,
		vis:5,
		prevCell:".sw-pre",
		nextCell:".sw-next",
		scroll:5
	});

	// 房产楼市幻灯片
	$(".de-module .house-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
	});

	// 房产楼市滚动图片
	$(".de-module .house-img").slide({
		mainCell: ".bd ul",
		autoPlay: true,
		effect: "leftLoop",
		autoPage: true,
		vis:5,
		prevCell:".sw-pre",
		nextCell:".sw-next",
		scroll:5
	});

	// 结婚宝
	$(".annoce-con").slide({
		mainCell: ".bd ul",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
	});

	// 小鱼汽车幻灯片
	$(".car-slide").slide({
		mainCell: ".bd ul",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
	});

	// 小鱼汽车图片滚动
	$(".car-box-img").slide({
		mainCell: ".car-con ul",
		autoPlay: true,
		effect: "top",
		autoPage: true,
		vis:2,
		scroll:2,
	});

	// 浮动导航
	$('.kehu,.wei').hover(function(){
		$(this).find('.code').show();
	},function(){
		$(this).find('.code').hide();
	})

$('.news-slide,.house-slide,.car-slide').hover(function(){
	$(this).find('.prev,.next').show();
},function(){
	$(this).find('.prev,.next').hide();
})

})
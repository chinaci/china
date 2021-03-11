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
	

	$('.slideBox').hover(function(){
		$('.hot .prev, .hot .next').show();
	},function(){
		$('.hot .prev, .hot .next').hide();
	})

	$('.slideBox').slide({mainCell:".bd ul",titCell:".hd ul",autoPlay:true,effect:"fade",vis:1,autoPage: true,});
	$('.activity-list').slide({mainCell:".bd ul",autoPlay:true,effect:"topLoop",vis:2,autoPage: true,});
	$('.info-slide').slide({mainCell:".bd ul",effect:"leftLoop",vis:10,autoPage: true,scroll:10});
	$('.job-slide').slide({mainCell:".bd ul",effect:"topLoop",vis:4,autoPage: true,autoPlay:true});
	$('.estate-slide').slide({mainCell:".bd ul",effect:"topLoop",vis:3,autoPage: true,autoPlay:true});

	// 今日热点
	$('.news-tit li').hover(function(){

		var t = $(this), index = t.index(), box = $('.news-list .news-box');
		t.addClass('active').siblings().removeClass('active');
		box.eq(index).show().siblings().hide();

	})

	// 省啦商城
	$('.goods .goods-tab li:not(:last)').hover(function(){

		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.goods-list ul').eq(index).show().siblings().hide();

	})

	// 生活信息
	$('.life .goods-tab li:not(:last)').hover(function(){

		var index = $(this).index(), ul = $('.life-list-box').find('ul');
		$(this).addClass('active').siblings().removeClass('active');
		ul.hide();
		ul.eq(index).show();


	})

	// 口碑店铺
	$('.intro .goods-tab li:not(:last)').hover(function(){

		var index = $(this).index(), box = $('.intro-list').find('.intro-list-box');
		$(this).addClass('active').siblings().removeClass('active');
		box.hide();
		box.eq(index).show();


	})

	// 房源
	$('.estate-tit-l a').hover(function(){

		var index = $(this).index(), ul = $(this).parents('.estate-tit').siblings('.estate-con').find('ul');
		$(this).addClass('active').siblings().removeClass('active');
		ul.hide();
		ul.eq(index).show();

	})

	// 招聘
	$('.job .estate-tit-l a').hover(function(){

		var index = $(this).index(), ul = $(this).parents('.estate-tit').siblings('.job-con-l').find('ul');
		$(this).addClass('active').siblings().removeClass('active');
		ul.hide();
		ul.eq(index).show();

	})

	// 经纪人
	$('.jjr-tab a').hover(function(){

		var index = $(this).index(), ul = $(this).parents('.estate-tit').siblings('.estate-box').find('.estate-slide');
		$(this).addClass('active').siblings().removeClass('active');
		ul.hide();
		ul.eq(index).show();


	})

	// 浮动导航
	$('.scroll li').hover(function(){
		$(this).find('.code-box').show();
	},function(){
		$(this).find('.code-box').hide();
	})


	//返回顶部
	$(".scroll .top").bind("click", function(){
		$('html, body').animate({scrollTop:0}, 300);
	});


})

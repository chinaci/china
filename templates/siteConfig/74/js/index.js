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

	$('.dropdown').hover(function(){
		$(this).addClass('hover');
	})

	$('.wxTit').hover(function(){
		$(this).find('.pop').show();
	}, function(){
		$(this).find('.pop').hide();
	})

	// 头部下拉框
	$('.dropdown').hover(function(){
		$(this).find('ul').show();
	},function(){
		$(this).find('ul').hide();
	})

	$('.search-nav').click(function(){

		var ul = $(this).find('ul');
		if (ul.css("display")=='none' ) {
			$(this).find('ul').slideDown();
		}
		else{
			$(this).find('ul').slideUp();
		}
	})

	$('.search-nav ul li').click(function(){

		var val = $(this).html();
		$('.search-nav span').html(val);

	})


	$('.slideBox').hover(function(){
		$('.hot .prev, .hot .next').show();
	},function(){
		$('.hot .prev, .hot .next').hide();
	})

	$('.slideBox').slide({mainCell:".bd ul",titCell:".hd ul",autoPlay:true,effect:"fold",vis:1,autoPage: true,});
	$('.activity-list').slide({mainCell:".bd ul",autoPlay:true,effect:"topLoop",vis:4,autoPage: true,});
	$('.info-slide').slide({mainCell:".bd ul",effect:"leftLoop",vis:10,autoPage: true,scroll:10});
	$('.job-slide').slide({mainCell:".bd ul",effect:"topLoop",vis:3,autoPage: true,autoPlay:true});
	$('.estate-slide').slide({mainCell:".bd ul",effect:"topLoop",vis:3,autoPage: true,autoPlay:true});


	// 新单上线
	$('.goods-tit-l a').hover(function(){

		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.goods-list ul').eq(index).show().siblings().hide();

	})

	// 房源
	$('.estate-tit-l a').hover(function(){

		var index = $(this).index(),
		       ul = $(this).parents('.estate-tit').siblings('.estate-con').find('ul');
		$(this).addClass('active').siblings().removeClass('active');
		ul.hide();
		ul.eq(index).show();


	})

	// 经纪人
	$('.jjr-tab a').hover(function(){

		var index = $(this).index(),
		       ul = $(this).parents('.estate-tit').siblings('.estate-box').find('.estate-slide');
		$(this).addClass('active').siblings().removeClass('active');
		ul.hide();
		ul.eq(index).show();


	})

	// 浮动导航
	$('.scroll a').hover(function(){
		$(this).addClass('hover');
	},function(){
		$(this).removeClass('hover');
	})

	$('.s-wx').hover(function(){
		$('.wx-down-box').show();
	},function(){
		$('.wx-down-box').hide();
	})

	$('.s-phone').hover(function(){
		$('.app-down-box').show();
	},function(){
		$('.app-down-box').hide();
	})


})

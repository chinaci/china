$(function(){

	//页面自适应设置
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		var criticalPoint = criticalPoint != undefined ? criticalPoint : 1240;
		var criticalClass = criticalClass != undefined ? criticalClass : "w1200";
		if(screenwidth < criticalPoint){
			$("html").removeClass(criticalClass);
		}else{
			$("html").addClass(criticalClass);
		}

	});


	// 顶部
	$('.topNav-r .topNav-r-li').hover(function(){
		$(this).find('.dropdown').show();
	}, function(){
		$(this).find('.dropdown').hide();
	})

	// 手机版
	$('.mobile').hover(function(){
		$(this).find('.pop').show();
	}, function(){
		$(this).find('.pop').hide();
	})

	//幻灯片
	$('.slide-1').slide({titCell:".hd ul", mainCell:".bd .slideul", autoPage:true, effect:"left", autoPlay:true, vis:1 });

	// 幻灯片翻页按钮
	$('.slide-1').hover(function(){
		$(this).find('.prev, .next').show();
	}, function(){
		$(this).find('.prev, .next').hide();
	})

	// 快递导航
	$(function(){
       $(".nav-l .nav-list li").hover(function() {
		   $(".nav-c").find(".nav-box").eq($(this).index()).show();
       }, function() {
				$(".nav-c").find(".nav-box").eq($(this).index()).hide();
      });
       $(".nav-c .nav-box").hover(function() {
            $(this).show();
       }, function() {
           $(this).hide();
       });
   })

	// 头部搜索
	$('.search-nav').hover(function(){
		$(this).find('ul').show();
	}, function(){
		$(this).find('ul').hide();
	})

	$('.search-nav ul li').click(function(){
		var t = $(this), li = t.text();
		$('.search-nav span').html(li);
	})


	//推荐竞价消息
	$('.m2-right .m2r-box li').hover(function(){
		$(this).addClass('on').siblings('li').removeClass('on');
	})

	// 滚动广告
	$('.advScroll').slide({mainCell:".bd ul", autoPage: true, autoPlay: true, effect: "left", vis: 7})

	//最新照片人才
	$('.picScroll').slide({mainCell:".bd ul", autoPage: true, autoPlay: true, effect: "left", vis: 2})

	//推荐经纪人
	$('.agentScroll').slide({mainCell:".bd ul", autoPage: true, autoPlay: true, effect: "left", vis: 2})

	// 分类信息
	$('.m2l-tab li').hover(function(){
		var t = $(this), box = $('.m2l-con .m2l-ul'), index = t.index();
		t.addClass('on').siblings().removeClass('on');
		box.eq(index).show().siblings().hide();

	})


	// 商场频道
	$('.m5-tab li').hover(function(){
		var t = $(this), box = $('.m5-box .m5-ul'), index = t.index();
		t.addClass('on').siblings().removeClass('on');
		box.eq(index).show().siblings().hide();

	})

	// 出租出售
	$('.m7-middle .module-tit h3 span').hover(function(){
		var t = $(this), index = t.index();
		t.addClass('on').siblings('span').removeClass('on');
		$('.m7m-box ul').eq(index).show().siblings('ul').hide();
	})

	// 浮动导航
	$('.floatNav li').hover(function(){
		$(this).find('.float-box').show();
	}, function(){
		$(this).find('.float-box').hide();
	})

	//返回顶部
	$(".floatNav .top").bind("click", function(){
		$('html, body').animate({scrollTop:0}, 300);
	});

})

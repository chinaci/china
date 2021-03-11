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

	// 头部幻灯片
	$('.slide-1').slide({titCell:".hd ul",mainCell: ".bd ul",autoPlay: true,autoPage:true,vis: 1,})
	$('.slide-2').slide({titCell:".hd ul",mainCell: ".bd ul",autoPlay:true,effect:"topLoop",vis:9})

	// 职位详情
	$('.job-list').hover(function(){
		$(this).find('.job-info').show();
	},function(){
		$(this).find('.job-info').hide();
	})

	// 搜索
	$('.search-nav').hover(function(){
		$(this).find('ul').show();
	},function(){
		$(this).find('ul').hide();
	})

	$('.search-nav ul li').click(function(){
		var t = $(this), val = t.html(), mval = $('.search-nav span').html();
		$('.search-nav span').html(val);
		t.html(mval);t.parent('ul').hide();
	})

	// 头部
	$('.header-r .wap').hover(function(){
		$(this).find('.wap-code-box').show();
	},function(){
		$(this).find('.wap-code-box').hide();
	})

	// 左边导航
	$('.subNav-ul .nav-li').hover(function(){

		var t = $(this), index = t.index(), li = $('.subNav-ul .nav-li');
		t.addClass('active');t.find('.type-arrow').show();

		if (index != 0) {
			li.eq(index-1).addClass('active-nbr');
		}
		li.addClass('active-all');
		t.find('.subNav-info').show();

	},function(){

		var t = $(this), index = t.index(), li = $('.subNav-ul .nav-li');
		t.removeClass('active');t.find('.type-arrow').hide();
		li.eq(index-1).removeClass('active-nbr');li.removeClass('active-all');
		t.find('.subNav-info').hide();

	})

	// 浮动导航
	$('.float-nav .bg-box').hover(function(){
		$(this).find('.txt-box').show();
	}, function(){
		$(this).find('.txt-box').hide();
	})

	//返回顶部
	$(".float-nav .top").bind("click", function(){
		$('html, body').animate({scrollTop:0}, 300);
	});

})

//单点登录执行脚本
function ssoLogin(info){

	$(".navLogin").remove();

	//已登录
	if(info){
		$(".top-r ul").append('<li><a class="l1" href="'+info['userDomain']+'">您好，欢迎<em>'+info['nickname']+'</em>回来</a></li><li><a class="l1 l3" href="'+info['userDomain']+'">会员中心</a></li><li><a class="l1" href="'+masterDomain+'/logout.html">退出登录</a></li>');

		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".top-r ul").append('<li><a href="'+masterDomain+'/login.html">登录</a><em>|</em><a href="'+masterDomain+'/register.html" target="_blank">注册</a></li><li><a href="'+jobUrl+'" target="_blank">薪酬统计</a></li>');

		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

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

	//第三方登录
	$("body").delegate(".loginconnect", "click", function(e){
		e.preventDefault();
		var href = $(this).attr("href");
		loginWindow = window.open(href, 'oauthLogin', 'height=565, width=720, left=100, top=100, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');

		//判断窗口是否关闭
		mtimer = setInterval(function(){
			if(loginWindow.closed){
				clearInterval(mtimer);
				huoniao.checkLogin(function(){
					location.reload();
				});
			}
		}, 1000);
	});

  var mask = $('.mask'), layer = $('.layer');

  // 头部搜索
  $('.search-nav').hover(function(){
    $('.search-nav ul').show();
  },function(){
    $('.search-nav ul').hide();
  })

  $('.search-nav ul li').click(function(){
    var li = $(this).text();
    $('.search-nav-box span').html(li);
    $(this).closest('ul').hide();
  })

  //筛选
  $('.choose-item').hover(function(){
    $(this).find('.dropdown').show();
  },function(){
    $(this).find('.dropdown').hide();
  })

  $('.dropdown a').click(function(){
    var t = $(this), li = t.html();
    t.closest('.choose-item').find('p').find('span').html(li);
  })

  //求职简历
  $('.resume-slide').slide({mainCell:".bd" ,effect:"topLoop",autoPlay:true,vis:2})


  //资讯
  $('.news-tab li').hover(function(){
    var t = $(this), index = t.index();
    t.addClass('on').siblings('li').removeClass('on');
    $('.news-con .news-list').eq(index).show().siblings('.news-list').hide();
  })

  //选择职位
  $('.choose-item-first').click(function(){
    mask.show(); layer.show();
  })

  $('.layer-tit a').click(function(){
    mask.hide(); layer.hide();
  })

  $('.layer-box li').click(function(){
    var t = $(this), li = t.find('a').text();
    $('.choose-item-first a span').html(li);
    mask.hide(); layer.hide();
  })

	// 浮动导航
	$('.floatNav .float-li').hover(function(){
		$(this).find('.box').show();
	},function(){
		$(this).find('.box').hide();
	})

	$('.floatNav .top').click(function(){
		$('html, body').animate({scrollTop:0}, 300);
	})

})

//单点登录执行脚本
function ssoLogin(info){

	$(".loginBar-a, .loginBar-b").remove();

	//已登录
	if(info){
		$(".top-r").append('<div class="loginBar-a fn-left"><a href="'+info['userDomain']+'">'+info['nickname']+'</a><span>欢迎来到分类信息频道！ <a href="'+masterDomain+'/logout.html" class="exit logout">[退出]</a></span><em class="line">|</em><a href="'+info['userDomain']+'">管理我的信息</a></div>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".top-r").append('<div class="loginBar-b fn-left"><div class="login-l fn-left"><a href="'+masterDomain+'/login.html">登录</a><em>|</em><a href="'+masterDomain+'/register.html" target="_blank">注册</a></div><div class="login-r share fn-left"><a class="m0 loginconnect" href="'+masterDomain+'/api/login.php?type=qq" target="_blank"><img src="'+templets+'images/qqlogin.gif" alt=""></a><a class="m0 loginconnect" href="'+masterDomain+'/api/login.php?type=wechat" target="_blank"><img src="'+templets+'images/wechat_login2.png" alt=""></a></div></div>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

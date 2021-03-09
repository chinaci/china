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
		var href = $(this).attr("href"), type = href.split("type=")[1];
		loginWindow = window.open(href, 'oauthLogin', 'height=565, width=720, left=100, top=100, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');

		mtimer = setInterval(function(){
			if(loginWindow.closed){
				$.cookie(cookiePre+"connect_uid", null, {expires: -10, domain: masterDomain.replace("http://www", ""), path: '/'});
				clearInterval(mtimer);
				huoniao.checkLogin(function(){
					location.reload();
				});
			}else{
				if($.cookie(cookiePre+"connect_uid") && $.cookie(cookiePre+"connect_code") == type){
					loginWindow.close();
					var modal = '<div id="loginconnectInfo"><div class="mask"></div> <div class="layer"> <p class="layer-tit"><span>温馨提示</span></p> <p class="layer-con">为了您的账户安全，请绑定您的手机号<br /><em class="layer_time">3</em>s后自动跳转</p> <p class="layer-btn"><a href="'+masterDomain+'/bindMobile.html?type='+type+'">前往绑定</a></p> </div></div>';

					$("#loginconnectInfo").remove();
					$('body').append(modal);

					var t = 3;
					var timer = setInterval(function(){
						if(t == 1){
							clearTimeout(timer);
							location.href = masterDomain+'/bindMobile.html?type='+type;
						}else{
							$(".layer_time").text(--t);
						}
					},1000)
				}
			}
		}, 1000);

	});

	  $('.mobile').hover(function(){
	    $(this).find('.pop').show();
	  }, function(){
	    $(this).find('.pop').hide();
	  })

  // 生活服务
  $('.kindslist li:not(:last)').hover(function(){
    $(this).addClass('on').find('.sub_kinds').show();
  }, function(){
    $(this).removeClass('on').find('.sub_kinds').hide();
  })

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
		$(".top-r").append('<div class="loginBar-a fn-left"><a href="'+info['userDomain']+'" target="_blank">'+info['nickname']+'</a><span>欢迎来到分类信息频道！ <a href="'+masterDomain+'/logout.html" class="logout" class="exit">[退出]</a></span><em class="line">|</em><a href="'+fabuUrl+'" target="_blank">管理我的信息</a></div>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".top-r").append('<div class="loginBar-b fn-left"><div class="login-l fn-left"><a href="'+masterDomain+'/login.html">登录</a><em>|</em><a href="'+masterDomain+'/register.html">注册</a></div><div class="login-r fn-left"><a class="loginconnect" href="'+masterDomain+'/api/login.php?type=qq" target="_blank"><img src="'+template+'images/qqlogin.gif" alt=""></a>	<a class="loginconnect" href="'+masterDomain+'/api/login.php?type=wechat" target="_blank"><img src="'+template+'images/wechat_login2.png" alt=""></a></div></div>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

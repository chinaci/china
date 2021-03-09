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


  $('.topNav-ul .more').hover(function(){
    $(this).addClass('on');
    $(this).find('.dropdown').show();
  }, function(){
    $(this).removeClass('on');
    $(this).find('.dropdown').hide();
  })

  // 扫码访问
  $('.la').hover(function(){
    $(this).find('.pop').show();
  }, function(){
    $(this).find('.pop').hide();
  })

  // 返回顶部
  $('.floatNav .top').click(function(){
    $('body, html').animate({scrollTop: 0}, 300)
  })
})

//单点登录执行脚本
function ssoLogin(info){

	$(".navLogin").remove();

	//已登录
	if(info){
		$(".topNav-r").append('<ul><li><a href="'+info['userDomain']+'" target="_blank">'+info['nickname']+'</a></li><li>|</li><li><a href="'+masterDomain+'/logout.html" class="logout">退出</a></li></ul>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".topNav-r").append('<ul><li><a href="'+masterDomain+'/register.html">免费注册</a></li><li>|</li><li><a href="'+masterDomain+'/login.html">会员登录</a></li></ul>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

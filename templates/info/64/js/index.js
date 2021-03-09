$(function(){

  // 幻灯广告
  $('.advSlide').slide({titCell:".hd ul", mainCell:".bd .slideBox",autoPlay:true, effect: "leftLoop",autoPage:"<li></li>"})

  // 更多
  $('.more').hover(function(){
    $(this).find('.dropdown, .more-small').show();

  }, function(){
    $(this).find('.dropdown, .more-small').hide();

  })

  // 头部导航固定
  var top = $('.nav').offset().top + 139;
  	$(window).scroll(function(){
  		var sct = $(window).scrollTop();
  		if(sct >= top) {
  			if($('.header-fixed').css('display') == "none"){
  				$('.header-fixed').show();
  			}
  		} else {
        $('.header-fixed').hide();
  		}
  	}).trigger('scroll')


    //获取天气预报
  	$.ajax({
  		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=9",
  		dataType: "json",
  		success: function (data) {
  			if(data && data.state == 100){
  				$(".weatherInfo").append(data.info);
  			}
  		}
  	});

})


//单点登录执行脚本
function ssoLogin(info){

	$(".login-a, .login-b").remove();

	//已登录
	if(info){
		$(".topNav-r").append('<ul class="login-a"><li><a href="'+info['userDomain']+'" target="_blank">欢迎回来,'+info['nickname']+'</a></li><li><a href="'+masterDomain+'/logout.html" class="logout">退出</a></li><li><a href="'+masterDomain+'/help.html" target="_blank">帮助</a></li></ul>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".topNav-r").append('<ul class="login-b"><li><a href="'+masterDomain+'/register.html">注册</a></li><li><a href="'+masterDomain+'/login.html">登录</a></li><li><a href="'+masterDomain+'/help.html" target="_blank">帮助</a></li></ul>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

$(function(){

  // 顶部导航
  $('.daohang').hover(function(){
    $(this).addClass('hover').find('.submenu').show();
  }, function(){
    $(this).removeClass('hover').find('.submenu').hide();
  })

  // 导航
  $('.la').hover(function(){
    $(this).addClass('hover').find('.dropdown').show();
  }, function(){
    $(this).removeClass('hover').find('.dropdown').hide();
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

})


//单点登录执行脚本
function ssoLogin(info){

	$(".navLogin").remove();

	//已登录
	if(info){
		$(".topNav-r ul").prepend('<li>欢迎您回来，<a href="'+info['userDomain']+'" target="_blank">'+info['nickname']+'</a></a></li><li><a href="'+masterDomain+'/logout.html" class="logout">退出</a><i class="arrow"></i></li>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".topNav-r ul").prepend('<li><a href="'+masterDomain+'/login.html">登录</a><i>|</i><a href="'+masterDomain+'/register.html">注册</a></li><li><a href="'+masterDomain+'/help.html">帮助中心</a><i class="arrow"></i></li>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

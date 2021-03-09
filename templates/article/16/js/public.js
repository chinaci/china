// JavaScript Document
$(function(){
	jQuery(".slideBox").slide({mainCell:".bd ul",effect:"left",autoPlay:true});
	/* 导航部分*/
	$("#more,#help,#local_news").hover(function(){
		$(this).find("ul").show();
	},function(){
		$(this).find("ul").hide();
	})
	/*搜索部分*/

	$("#local_news li a").click(function(){
		var x=$(this).text();
		$(this).parents("span").find("i").text(x)
		$(this).parents("span").find("ul").hide();
	})
})

//第三方登录
$("body").delegate('.navl .m0', 'click', function(e){
	e.preventDefault();
	var href = $(this).attr("href"), type = href.split("type=")[1];
	loginWindow = window.open(href, 'oauthLogin', 'height=565, width=720, left=100, top=100, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');

	//判断窗口是否关闭
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

//单点登录执行脚本
function ssoLogin(info){

	$("#navLoginBefore, #navLoginAfter").remove();

	//已登录
	if(info){
		$(".navl .r").prepend('<a class="f12" href="'+info['userDomain']+'">您好，欢迎<em>'+info['nickname']+'</em>回来</a><a class="f12 center" href="'+info['userDomain']+'">会员中心</a><a class="f12" href="'+masterDomain+'/logout.html">退出登录</a>');

		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".navl .r").prepend('<a class="f12 login" href="'+masterDomain+'/login.html">请登录</a><a class="f12" href="'+masterDomain+'/register.html">免费注册</a><a class="m0" href="'+masterDomain+'/api/login.php?type=qq"><font class="l QQ">QQ登录<i></i></font></a><a class="m0" href="'+masterDomain+'/api/login.php?type=wechat"><font class="l weixin">微信登录<i></i></font></a>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

// JavaScript Document
$(function(){

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

	/* 导航部分*/
	$("#jifen,#mine,#local_news,#fabu,#nav1").hover(function(){
		$(this).find("ul").show();
	},function(){
		$(this).find("ul").hide();
	})

	$(".head .navl font.phone,.nav2_con a.sj").hover(function(){
		$(this).find(".erweima").show();
	},function(){
		$(this).find(".erweima").hide();
	})
	/*搜索部分*/
	$("#local_news li a").click(function(){
		var x=$(this).text();
		$(this).parents("span").find("i").text(x)
		$(this).parents("span").find("ul").hide();
	})


	/* 二级导航*/
	$(".zp-1 .nav-s li,.new-zp .zp-list,.multipleColumn .bd ul li,.per-jl dl").hover(function(){
		$(this).addClass("on");
	},function(){
		$(this).removeClass("on");
	})

	$(".zp-1 .right .bottom .title span a").hover(function(){
		var n=$(this).index();
		$(this).addClass("on").siblings().removeClass("on");
		$(".zp-info-list .zp-list").eq(n).show().siblings().hide();
	})

	/*首页广告位 */
	$(".gg a.small,.gg a.sb,.gg a.big").hover(function(){
			var w=$(this).width();
			var h=$(this).height();
			var imgSrc=$(this).find("img").attr("src");
			var t=parseInt($(this).offset().top)-2;
			var l=parseInt($(this).offset().left)-1;
			$("#zoomer").show().css({"width":w,"top":t,"left":l});
			$("#zoomer img").css("width",w).attr("src",imgSrc);
	},function(){
		$("#zoomer").hide();
	})

	$("#zoomer").hover(function(){
		$(this).show();
	},function(){
		$(this).hide();
	})
})

//单点登录执行脚本
function ssoLogin(info){
	$(".navLogin").remove();

	//已登录
	if(info){
		$(".navl .l").append('<a class="f12 navLogin" href="'+info['userDomain']+'">您好，欢迎<em>'+info['nickname']+'</em>回来</a><a class="f12 navLogin" href="'+info['userDomain']+'">会员中心</a><a class="f12 navLogin" href="'+masterDomain+'/logout.html">退出登录</a>');

		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".navl .l").append('<a class="f12 navLogin login" href="'+masterDomain+'/login.html">请登录</a><a class="navLogin f12" href="'+masterDomain+'/register.html" target="_blank">免费注册</a><a class="m0 loginconnect navLogin" href="'+masterDomain+'/api/login.php?type=qq"  target="_blank"><font class="l QQ">QQ登录<i></i></font></a><a class="m0 loginconnect navLogin" href="'+masterDomain+'/api/login.php?type=wechat"  target="_blank"><font class="l weixin">微信登录<i></i></font></a>');

		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

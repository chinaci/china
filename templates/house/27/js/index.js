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

	$('.search-nav').hover(function(){
		$(this).find('ul').show();
	},function(){
		$(this).find('ul').hide();
	})


	$(".search-nav li").bind("click", function(){
		var val = $(this).text(), id = $(this).attr("data-id");
		$(".keytype").attr("data-id", id).html(val+"<s></s>");
		$(".search-nav ul").hide();
		$(this).addClass('active').siblings().removeClass('active');
	});


	// 搜索
    $(".search-btn").bind("click", function(){
	      var keywords = $("#search-txt"), txt = $.trim(keywords.val()),
	          type = $('.search-nav .active').attr('data-type');
	      if(txt != ""){
	              location.href = masterDomain +"/house/"+type+".html?keywords="+txt;
	      }else{
	          keywords.focus();
	      }
    });
    

	$('.banner').slide({mainCell:".bd ul",titCell:".hd",autoPlay:true,effect:"fold",vis:1,autoPage: true,});

	// 新房切换
	$('#house-tab li').hover(function(){

		var index = $(this).index();

		$(this).addClass('active').siblings().removeClass('active');

		$('#house-list ul').eq(index).show().siblings().hide();

	});
	$(document).keyup(function(event){
	  if(event.keyCode ==13){
	    $(".search-btn").trigger("click");
	  }
	});


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






})


//单点登录执行脚本
function ssoLogin(info){

	//已登录
	if(info){
		$(".top-r").html('您好，<a href="'+info['userDomain']+'" id="uname" target="_blank">'+info['nickname']+'</a> | <a href="'+masterDomain+'/logout.html" class="logout">安全退出</a>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".top-r").html('<a href="'+masterDomain+'/login.html" class="icon icon-4">登录</a><a href="'+masterDomain+'/register.html">注册</a>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}




}

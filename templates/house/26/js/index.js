$(function(){

	//第三方登录
	$("body").delegate(".loginconnect", "click", function(e){
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


	/*头部*/
	/* 导航部分*/
	$("#more,#help,#local_news").hover(function(){
		$(this).find("ul").show();
	},function(){
		$(this).find("ul").hide();
	})

	$("#local_news .expandedPanel a").click(function(){
		var t=$(this), val = $(this).text(), id = $(this).attr("data-id");
		$("#local_news i").attr("data-id", id).html(val);
		t.closest("ul").hide();
		$(this).parent().addClass('active').siblings().removeClass('active');
	})

	// 搜索
    $(".btnSearch").bind("click", function(){
	      var keywords = $("#txtSearch"), txt = $.trim(keywords.val()),
	          type = $('.expandedPanel .active').find('a').attr('data-type');
	      if(txt != ""){
	              location.href = masterDomain +"/house/"+type+".html?keywords="+txt;
	      }else{
	          keywords.focus();
	      }
    });

    // banner 搜索
    $('.searchNav').hover(function(){
		$(this).find('ul').show();
	},function(){
		$(this).find('ul').hide();
	});
	$(".searchNav li").bind("click", function(){
		var val = $(this).text(), id = $(this).attr("data-id");
		$(".keytype").attr("data-id", id).html(val);
		$(".searchNav ul").hide();
		$(this).addClass('active').siblings().removeClass('active');
	});


	// 搜索
    $(".search_button").bind("click", function(){
	      var keywords = $("#search_keyword"), txt = $.trim(keywords.val()),
	          type = $('.searchNav .active').attr('data-type');
	      if(txt != ""){
	              location.href = masterDomain +"/house/"+type+".html?keywords="+txt;
	      }else{
	          keywords.focus();
	      }
    });

    $(document).keyup(function(event){
	  if(event.keyCode ==13){
	    $(".btnSearch,.search_button").trigger("click");
	  }
	});

	// 出租房源
	$(".fabu").hover(function(){
		var t=$(this);
		t.find("ul").show();
	},function(){
		var t=$(this);
		t.find("ul").hide();
	})

	$(".fabu li a").click(function(){
		var t=$(this);
		$(".fabu span em").text(t.text());
		t.closest("ul").hide();
	})
	// 大图幻灯片
	$("#slide").cycle({
		pager: '#slidebtn',
		pause: true,
		prev: '#prev',
		next: '#next'
	});
	// 推荐楼盘
		pause: true
	$(".blockCon .list").cycle({
		pager: '#slidebtn1',
		pause: true
	});
	// 推荐中介店铺
	$(".blockList .con").cycle({
		pause: true,
		prev: '#prev2',
		next: '#next2'
	});
	//二手房源
	$(".esfy .list .con").cycle({
		pause: true,
		prev: '#prev3',
		next: '#next3'
	});
	// 出租房源
	$(".czfy .list .con").cycle({
		pause: true,
		prev: '#prev4',
		next: '#next4'
	});
	// 推荐经纪人
	$(".tjjjr .con").cycle({
		pager: '#slidebtn2',
		pause: true,
		prev: '#prev5',
		next: '#next5'
	});
})


//单点登录执行脚本
function ssoLogin(info){

	$(".navLogin").remove();

	//已登录
	if(info){
		$(".navl").append('<div class="fn-right"><a class="l1" href="'+info['userDomain']+'">您好，欢迎<em>'+info['nickname']+'</em>回来</a><a class="l1 l3" href="'+info['userDomain']+'">会员中心</a><a class="l1" href="'+masterDomain+'/logout.html">退出登录</a></div>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".navl").append('<div class="fn-right"><a class="l1" href="javascript:;">您好，欢迎您回来</a><a class="l1" href="'+masterDomain+'/login.html">请登录</a><a class="l1" href="'+masterDomain+'/register.html">免费注册</a><a class="l2 m0 loginconnect" href="'+masterDomain+'/api/login.php?type=qq" target="_blank"><font class="fn-left QQ">QQ登录<i></i></font></a><a class="l2 m0 loginconnect" href="'+masterDomain+'/api/login.php?type=wechat" target="_blank"><font class="fn-left weixin">微信登录<i></i></font></a></div>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

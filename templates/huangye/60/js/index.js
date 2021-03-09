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


// 全部服务机构
	$('.t-list ul').hover(function(){
		var x = $(this);
		x.addClass('live');
	},function(){
		var x = $(this);
		x.removeClass('live');
	});
	$('.t-list').find('a.curr').closest('ul').addClass('active');


// 电话、邮箱、微信
	$('.information .droptit').hover(function(){
		$(this).find('div').show();
	},function(){
		$(this).find('div').hide();
	})
})

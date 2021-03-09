$(function(){


	// 跟帖
	$('.slide-box').delegate(".post-wrap", "mouseenter", function(){
		$(this).css('margin-top', '-20px');
	}).delegate(".post-wrap", "mouseleave", function(){
		$(this).css('margin-top', '0');
	})


  //分享功能
	$("html").delegate(".share", "mouseenter", function(){
		var t = $(this), title = t.attr("data-title"), url = t.attr("data-url"), pic = t.attr("data-pic"), site = encodeURIComponent(document.title);
		title = title == undefined ? "" : encodeURIComponent(title);
		url   = url   == undefined ? "" : encodeURIComponent(url);
		pic   = pic   == undefined ? "" : encodeURIComponent(pic);
		if(title != "" || url != "" || pic != ""){
			$("#shareBtn").remove();
			var offset = t.offset(),
					left   = offset.left - 42 + "px",
					top    = offset.top + 25 + "px",
					shareHtml = [];
			shareHtml.push('<s></s>');
			shareHtml.push('<ul>');
			shareHtml.push('<li class="tqq"><a href="http://share.v.t.qq.com/index.php?c=share&a=index&url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
			shareHtml.push('<li class="qzone"><a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&desc='+title+'&pics='+pic+'" target="_blank">QQ空间</a></li>');
			shareHtml.push('<li class="qq"><a href="http://connect.qq.com/widget/shareqq/index.html?url='+url+'&desc='+title+'&title='+title+'&summary='+site+'&pics='+pic+'" target="_blank">QQ好友</a></li>');
			shareHtml.push('<li class="sina"><a href="http://service.weibo.com/share/share.php?url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
			shareHtml.push('<li class="weixin"><a href="javascript:;">微信</a><div class="code-box"><div class="wx-arrow"></div><div class="code"><img src="'+masterDomain+'/include/qrcode.php?data='+url+'"></div><p>用微信扫码二维码</p><p>分享至好友和朋友圈</p></div></li>');
			shareHtml.push('</ul>');

			$("<div>")
				.attr("id", "shareBtn")
				.css({"left": left, "top": top})
				.html(shareHtml.join(""))
				.show()
				.mouseover(function(){
					$(this).show();
					return false;
				})
				.mouseleave(function(){
					$(this).hide();
				})
				.appendTo("body");
		}
	});


  // 分享
  $("html").delegate(".share", "mouseleave", function(){
    $("#shareBtn").hide();
  });

  $("html").delegate("#shareBtn a", "click", function(event){
    event.preventDefault();
    var href = $(this).attr("href");
    if(href == "javascript:;") return;
    var w = $(window).width(), h = $(window).height();
    var left = (w - 760)/2, top = (h - 600)/2;
    window.open(href, "shareWindow", "top="+top+", left="+left+", width=760, height=600");
  });


  var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
	var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"4","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"12"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];



})

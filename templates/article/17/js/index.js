$(function(){

	//第三方登录
	$(".loginconnect, .othertype a").click(function(e){
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

	//获取天气预报
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=9",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				$(".weather-box").prepend(data.info);
			}
		}
	});

	var weatherCity = $(".weatherCity").text();
	if(weatherCity != ""){
		$(".weather-box").addClass("pointer").bind("click", function(){
			window.open('https://www.baidu.com/s?wd='+weatherCity+'天气');
		});
	}


	var paneHeight = $('.pane').offset().top;


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


	//获取附件不同尺寸
	function changeFileSize(url, to, from){
		if(url == "" || url == undefined) return "";
		if(to == "") return url;
		var from = (from == "" || from == undefined) ? "large" : from;
		if(hideFileUrl == 1){
			return url + "&type=" + to;
		}else{
			return url.replace(from, to);
		}
	}


	//转换PHP时间戳
	function transTimes(timestamp, n){
		update = new Date(timestamp*1000);//时间戳要乘1000
		year   = update.getFullYear();
		month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
		day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
		hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
		minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
		second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
		if(n == 1){
			return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
		}else if(n == 2){
			return (year+'-'+month+'-'+day);
		}else if(n == 3){
			return (month+'-'+day);
		}else if(n == 4){
			return (hour+':'+minute+':'+second);
		}else{
			return 0;
		}
	}

	//获取服务器当前时间
	var nowStamp = 0;
	$.ajax({
		"url": masterDomain+"/include/ajax.php?service=system&action=getSysTime",
		"dataType": "jsonp",
		"success": function(data){
			if(data){
				nowStamp = data.now;
			}
		}
	});

	//获取时间段
	function time_tran(time) {
	    var dur = nowStamp - time;
	    if (dur < 0) {
	        return transTimes(time, 2);
	    } else {
	        if (dur < 60) {
	            return dur+'秒前';
	        } else {
	            if (dur < 3600) {
	                return parseInt(dur / 60)+'分钟前';
	            } else {
	                if (dur < 86400) {
	                    return parseInt(dur / 3600)+'小时前';
	                } else {
	                    if (dur < 259200) {//3天内
	                        return parseInt(dur / 86400)+'天前';
	                    } else {
	                        return transTimes(time, 2);
	                    }
	                }
	            }
	        }
	    }
	}



	// 网易独家幻灯片
	$('.slide-1').slide({titCell:".hd ul", mainCell:".bd .slideul", autoPage:true, effect:"left", autoPlay:true, vis:1 });
	//右边顶部幻灯片
	$('.slide-3').slide({titCell:".hd ul", mainCell:".bd .slideul", effect:"leftLoop", autoPlay:true, vis:1, autoPage:true });
	//底部图片幻灯片
	$(".slide-4 .bd li").first().before($(".slide-4 .bd li").last());
	$(".slide-4").slide({ titCell: ".hd ul", mainCell: ".bd ul", effect: "leftLoop", autoPlay: true, vis: 3, autoPage: true, trigger: "click"});

	// 幻灯片翻页按钮
	$('.slide-1, .slide-3, .slide-4').hover(function(){
		$(this).find('.prev, .next').show();
	}, function(){
		$(this).find('.prev, .next').hide();
	})



	//鼠标经过头部链接显示浮动菜单
	$(".topbarlink li").hover(function(){
		var t = $(this), pop = t.find(".pop");
		pop.show();
		t.addClass("hover");
	}, function(){
		var t = $(this), pop = t.find(".pop");
		pop.hide();
		t.removeClass("hover");
	});

	//异步加载新闻列表
	var page = 1, isload;
	var ajaxNews = function() {
		var id = $(".pane .hd .on a:eq(0)").attr("data-id"),
			href = $(".pane .hd .on a:eq(0)").attr("href");
		var objId = "newsList" + id;
		if ($("#" + objId).html() == undefined) {
			$("#newsList").append('<div id="' + objId + '" class="slide-box"></div>');
			if (isload && $('.pane').hasClass('fixed')) {
				$(window).scrollTop(paneHeight);
			}
		}
		isload = true;

		$("#" + objId).find(".load-more").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=article&action=alist&typeid=" + id + "&group_img=1&pageSize=40&page="+page,
			type: "GET",
			dataType: "jsonp",
			success: function(data) {
				if (data && data.state != 200) {
					if (data.state == 101) {
						$("#" + objId).html("<p class='loading'>" + data.info + "</p>");
					} else {
						var list = data.info.list,
							pageInfo = data.info.pageInfo,
							html = [];
						for (var i = 0; i < list.length; i++) {
							var item = [],
								id = list[i].id,
								title = list[i].title,
								typeName = list[i].typeName,
								url = list[i].url,
								common = list[i].common,
								litpic = list[i].litpic,
								keywords = list[i].keywords,
								description = list[i].description;

							if (list[i].group_img != "" && list[i].group_img != null) {
								item.push('<div class="picture-box">');
								item.push('<div class="pic-tit"><h3><a href="' + url + '" target="_blank">' + title + '</a></h3></div>');
								item.push('<div class="pic-list">');
								for (var g = 0; g < list[i].group_img.length; g++) {
									if(g < 3 && list[i].group_img[g].path != null){
										item.push('<a href="' + url + '" target="_blank"><span><img src="' + changeFileSize(list[i].group_img[g].path, "small") + '" /></span></a>');
									}
								};
								item.push('</div>');
								item.push('<div class="txt-box fn-clear"><div class="news-keywords fn-left"><div class="txt-tag fn-left"><a href="javascript:;">'+typeName[typeName.length-1]+'</a></div>');

								//关键字
								if (keywords != "") {
									var words = keywords.split(' '), keywordsArr = [];
									for (var k = 0; k < words.length; k++) {
										if(k < 3){
											keywordsArr.push('<a href="'+url+'" target="_blank">'+words[k]+'</a>');
										}
									}
									item.push('<div class="txt-label fn-left">'+keywordsArr.join("")+'</div>');
								}

								item.push('<span class="time">'+time_tran(list[i].pubdate)+'</span></div>');
								item.push('<div class="share-box fn-right"><a href="javascript:;" class="share" data-title="'+title+'" data-url="'+url+'" data-pic="'+litpic+'"></a>');
								item.push('<a href="' + url + '#comment" target="_blank" class="post-box fn-right" title="评论数" target="_blank"><div class="post-wrap"><span class="icon-post">' + common + '</span><span class="red">评论' + common + '</span></div></a>');
								item.push('</div>');
								item.push('</div>');
								item.push('</div>');
							} else {
								item.push('<div class="list-box fn-clear">');
								if (list[i].litpic != "" && list[i].litpic != null) {
									item.push('<div class="list-img fn-left"><a href="' + url + '" target="_blank"><img src="' + litpic + '" alt="' + title + '"></a></div>');
								}
								item.push('<div class="list-txt"><h3><a href="' + url + '" target="_blank">' + title + '</a></h3>');
								item.push('<div class="txt-box fn-clear"><div class="news-keywords fn-left"><div class="txt-tag fn-left"><a href="javascript:;">'+typeName[typeName.length-1]+'</a></div>');

								//关键字
								if (keywords != "") {
									var words = keywords.split(' '), keywordsArr = [];
									for (var k = 0; k < words.length; k++) {
										if(k < 3){
											keywordsArr.push('<a href="'+url+'" target="_blank">'+words[k]+'</a>');
										}
									}
									item.push('<div class="txt-label fn-left">'+keywordsArr.join("")+'</div>');
								}

								item.push('<span class="time">'+time_tran(list[i].pubdate)+'</span></div>');
								item.push('<div class="share-box fn-right"><a href="javascript:;" class="share" data-title="'+title+'" data-url="'+url+'" data-pic="'+litpic+'"></a>');
								item.push('<a href="' + url + '#comment" target="_blank" class="post-box fn-right" title="评论数"><div class="post-wrap"><span class="icon-post">' + common + '</span><span class="red">评论' + common + '</span></div></a>');
								item.push('</div>');
								item.push('</div>');
								item.push('</div>');
								item.push('</div>');
							}
							html.push(item.join(""));
						}

						$("#" + objId).find(".loading").remove();
						$("#" + objId).append(html.join(""));
						if (page < pageInfo.totalPage) {
							$("#" + objId).append('<div class="load-more"><div class="load-add"><i></i><span>加载更多</span></div></div>');
						} else {
							$("#" + objId).append('<span class="mnbtn">:-)已经到最后啦~</span>');
						}

					}
				} else {
					$("#" + objId).html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$("#" + objId).html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	ajaxNews();


	//更新左右按钮标题
	var updateBtnText = function(){
        var currLi = $(".pane .hd .cur"), index = currLi.index(),
        	prevBtnText = currLi.prev("li").text(),
        	nextBtnText = currLi.next("li").text();

        if(index == 0){
        	$(".slide-btn.prev .slide-txt").html(prevDefaultTxt);
			$(".slide-btn.next .slide-txt").html(nextDefaultTxt);

        }else if(index == 7){
        	var prevDefaultTxt_ = $(".pane-ul li:last").prev("li").text(),
				nextDefaultTxt_ = $(".pane-ul li:first").text();
        	$(".slide-btn.prev .slide-txt").html(prevDefaultTxt_);
			$(".slide-btn.next .slide-txt").html(nextDefaultTxt_);

        }else{
        	$(".slide-btn.prev .slide-txt").html(prevBtnText);
			$(".slide-btn.next .slide-txt").html(nextBtnText);
        }
	}

	//左右分页默认标题
	var prevDefaultTxt = $(".pane-ul li:last").text(),
		nextDefaultTxt = $(".pane-ul li:eq(1)").text();
	$(".slide-btn.prev .slide-txt").html(prevDefaultTxt);
	$(".slide-btn.next .slide-txt").html(nextDefaultTxt);

	// 切换信息tab
	var isOnImg;
	$(".pane .hd li").bind("mouseenter", function(event){
		event.preventDefault();
		var t = $(this), id = t.find("a").attr("data-id");
		isOnImg = setTimeout(function() {
			if(!t.hasClass("on")){
				t.siblings("li").removeClass("on").removeClass('cur');
				$('.slide-2 .hd .more').removeClass('on');
				t.addClass("on").addClass('cur');
				if ($("#newsList" + id).html() == undefined) {
					page = 1;
					ajaxNews();
				}else{
					$("#newsList" + id).show().siblings(".slide-box").hide();
				}

				updateBtnText();
			}
        }, 500);

	});
	$(".pane .hd li").bind("mouseleave", function(event){
		clearTimeout(isOnImg);
	});


	// 切换信息 更多
	var isMore;
	$('.slide-2 .hd .more').hover(function(){
		var t = $(this);
		isMore = setTimeout(function(){
			$('.pane .hd li').removeClass('on');
			t.addClass('on');
			$('.pane .hd li:first').addClass('cur').siblings('li').removeClass('cur').removeClass('on');
			$('.slide-2 .hd .more-list').show();

	        var currLi = $(".pane .hd .cur"), index = currLi.index(),
	        	prevBtnText = $(".pane .hd li:last").text(),
	        	nextBtnText = $(".pane .hd li:first").text();

        	$(".slide-btn.prev .slide-txt").html(prevBtnText);
			$(".slide-btn.next .slide-txt").html(nextBtnText);

		},500)
	},function(){
		$('.slide-2 .hd .more-list').hide();
		clearTimeout(isMore);
	})


	// 切换信息 更多列表
	$(".paneBox .more-list a").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.attr("data-id"), url = t.attr("href"), txt = t.text(), parent = t.closest("span");
		$('.pane .hd li:first').addClass('cur').siblings('li').removeClass('cur').removeClass('on');
		parent.siblings("ul").find("li").removeClass("on");
		parent.find('em').html(txt);
		parent
			.addClass("on")
			.find("a:eq(0)")
				.attr("data-id", id)
				.attr("href", url);

		page = 1;
		ajaxNews();
	});


	// 左右翻页
	$(window).scroll(function(){
		var scroH = $(this).scrollTop();
		if (scroH <= 1200) {
			$('.slide-2 .slide-btn').removeClass('slide-btn-show');
		}else{
			$('.slide-2 .slide-btn').addClass('slide-btn-show');
		}
	})

	$('.slide-2 .slide-btn').click(function(){
		if ($('.slide-2 .hd .more').hasClass("on")) {
			$('.slide-2 .hd .more').removeClass('on');
			var param = $(this).hasClass("prev") ? "prev" : "next";

			var currLi = $(".pane .hd li:last"), index = currLi.index(),
			obj = (param == "prev" ? index == 0 : index == 7) ? (param == "prev" ? $(".pane .hd li:last") : $(".pane .hd li:first")) : (param == "prev" ? currLi : currLi);
			obj.addClass("on").addClass("cur").siblings("li").removeClass("on").removeClass("cur");
			updateBtnText();

		}else{
			var param = $(this).hasClass("prev") ? "prev" : "next";

			var currLi = $(".pane .hd .cur"), index = currLi.index(),
				obj = (param == "prev" ? index == 0 : index == 7) ? (param == "prev" ? $(".pane .hd li:last") : $(".pane .hd li:first")) : (param == "prev" ? currLi.prev("li") : currLi.next("li"));
			obj.addClass("on").addClass("cur").siblings("li").removeClass("on").removeClass("cur");

			updateBtnText();
		}

		var id = $(".pane .hd .cur a").data("id");
			if ($("#newsList" + id).html() == undefined) {
				page = 1;
				ajaxNews();
			}else{
				$("#newsList" + id).show().siblings(".slide-box").hide();
			}
	})



	//显示更多
	$("#newsList").delegate(".load-more", "click", function(){
		var t = $(this);
		page++;
		ajaxNews();
	});


	// 跟帖
	$('#newsList').delegate(".post-wrap", "mouseenter", function(){
		$(this).css('margin-top', '-20px');
	}).delegate(".post-wrap", "mouseleave", function(){
		$(this).css('margin-top', '0');
	})


	// 导航固定
	var top    = $('.pane').offset().top;
	$(window).scroll(function(){
		var topOff = $('.photo-slide').offset().top - 600;
		var sct = $(window).scrollTop();
		if(sct >= top && sct <= topOff) {
			if(!$('.pane').hasClass('fixed')){
				$('.pane').hide().addClass('fixed').slideDown();
			}
		} else {
			$('.pane').removeClass('fixed');
			$('.slide-2 .slide-btn').removeClass('slide-btn-show');
		}
	})


	// 新闻有态度固定
	var atdTop    = $('.atd-box:last').offset().top + 136;

	// 右侧广告位固定
	var rightTop    = $('#right-last').offset().top ;

	$(window).scroll(function(){
		var sct = $(window).scrollTop();
		var topOff = $('.photo-slide').offset().top - 300;
		var atdTopOff = $('.photo-slide').offset().top - $(window).height();
		if(sct >= atdTop && sct <= atdTopOff) {
			if(!$('.wrap-l-box').hasClass('topFixed')){
				$('.wrap-l-box').hide().addClass('topFixed').slideDown();

				$(".attitude").css({"height": $(window).height() - 82});
			}
		} else {
			$('.wrap-l-box').removeClass('topFixed');
			$(".attitude").css({"height": "auto"});
		}

		if(sct >= rightTop && sct <= topOff) {
			if(!$('#right-last a').hasClass('advFixed')){
				$('#right-last a').addClass('advFixed');
			}
		} else {
			$('#right-last a').removeClass('advFixed').show();
		}

	}).trigger('scroll')

	$(window).resize(function(){
		var sct = $(window).scrollTop();
		if(sct >= atdTop) {
			$(".attitude").css({"height": $(window).height() - 82});
		}
	});

	//新闻有态度标题图片
	var isShowImg;
	$('.atd-list').mouseleave(function(){
		clearTimeout(isShowImg);
		$(this).closest('li').removeClass('atd-hover');
	});
	$('.atd-list .atd-list-fw h2').mouseenter(function(){
		var t = $(this);
		isShowImg = setTimeout(function() {
            t.closest('li').addClass('atd-hover');
        }, 500);
	})

	//新闻有态度滚动条
	$(".attitude").mCustomScrollbar({theme:"minimal-dark"});


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
  window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"12"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];

})

$(function(){

	//获取天气预报
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=6",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				$(".weatherInfo").append(data.info);
			}
		}
	});

	//slideshow_1000_330
	$("#slideshow1000330").find("script").remove();
	$("#slideshow1000330").cycle({
		fx: 'fade',
		pager: '#slidebtn1000330',
		pause: true
	});

	//异步显示新闻
	var ajaxNews = function(){
		var id = $("#ajaxnews .nht .current a:eq(0)").attr("data-id"),
				href = $("#ajaxnews .nht .current a:eq(0)").attr("href");
		var objId = "newsList"+id;
		if($("#"+objId).html() == undefined){
			$("#newsList").append('<div id="'+objId+'" class="newsitem"></div>');
		}
		$("#"+objId)
			.html("<p class='loading'>加载中...</p>")
			.siblings(".newsitem").hide();
		$("#"+objId).show();

		$.ajax({
			url: "/include/ajax.php?service=article&action=alist&typeid="+id+"&group_img=1&pageSize=20",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state != 200){
					if(data.state == 101){
						$("#"+objId).html("<p class='loading'>"+data.info+"</p>");
					}else{
						var list = data.info.list, html = [], html1 = [];
						for(var i = 0; i < list.length; i++){
							var item        = [],
									id          = list[i].id,
									title       = list[i].title,
									url         = list[i].url,
									common      = list[i].common,
									litpic      = list[i].litpic,
									description = list[i].description;
							var defaultPic = '/static/images/blank.gif';

							if(list[i].group_img){
								item.push('<div class="hdnews pics fn-clear">');
								item.push('<h3><a href="'+url+'" target="_blank">'+title+'</a></h3>');
								item.push('<ul class="fn-clear">');
								for (var g = 0; g < list[i].group_img.length; g++) {
									item.push('<li><a href="'+url+'" target="_blank"><img onerror="this.src=\''+defaultPic+'\'" src="'+huoniao.changeFileSize(list[i].group_img[g].path, "small")+'" /></a></li>');
								};
								item.push('</ul>');
								item.push('<div class="btns fn-clear">');
								item.push('<a href="'+url+'#comment" class="reviewbtn" title="评论数">'+common+'</a>');
								item.push('<a href="javascript:;" class="sharebtn" data-title="'+title+'" data-url="'+url+'" data-pic="'+litpic+'"></a>');
								item.push('</div>');
								item.push('</div>');
							}else{
								item.push('<div class="hdnews haspic fn-clear">');
								if(litpic != ""){
									item.push('<a href="'+url+'" target="_blank" class="pic"><img onerror="this.src=\''+defaultPic+'\'" src="'+litpic+'" alt="'+title+'"></a>');
								}
								item.push('<h3><a href="'+url+'" target="_blank">'+title+'</a></h3>');
								item.push('<p>'+description+'</p>');
								item.push('<div class="btns fn-clear">');
								item.push('<a href="'+url+'#comment" class="reviewbtn" title="评论数">'+common+'</a>');
								item.push('<a href="javascript:;" class="sharebtn" data-title="'+title+'" data-url="'+url+'" data-pic="'+litpic+'"></a>');
								item.push('</div>');
								item.push('</div>');
							}
							if(i < 10){
								html.push(item.join(""));
							}else{
								html1.push(item.join(""));
							}
						}
						$("#"+objId).html(html.join(""));
						$("#"+objId).append('<div class="moreNews fn-hide">'+html1.join("")+'</div>');
						if(list.length > 10){
							$("#"+objId).append('<span class="mnbtn" data-url="'+href+'"><a href="javascript:;">再显示10条资讯</a></span>');
						}else{
							$("#"+objId).append('<span class="mnbtn" data-url="'+href+'" style="block;"><a href="javascript:;" style="background:none;">查看更多要闻</a></span>');
						}
					}
				}else{
					$("#"+objId).html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function(){
				$("#"+objId).html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	ajaxNews();

	$("#ajaxnews .nht li").bind("click", function(event){
		event.preventDefault();
		var t = $(this);
		if(!t.hasClass("current") && !t.hasClass("last")){
			t.siblings("li").removeClass("current");
			t.addClass("current");
			ajaxNews();
		}
	});

	$("#ajaxnews .last .more a").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.attr("data-id"), url = t.attr("href"), txt = t.text(), parent = t.closest("li");
		parent.siblings("li").removeClass("current");
		parent
			.addClass("current")
			.find("a:eq(0)")
				.attr("data-id", id)
				.attr("href", url)
				.html(txt+"<i></i>");
		ajaxNews();
	});

	//再显示10条新闻
	$("#newsList").delegate(".mnbtn", "click", function(){
		var t = $(this), moreNews = t.siblings(".moreNews");
		if(moreNews.is(":hidden")){
			moreNews.slideDown(200);
			$('html, body').animate({scrollTop: t.offset().top}, 300);
			t.find("a").html("查看更多要闻").css({"background": "none"});
		}else{
			var url = $(this).attr("data-url");
			if(url != ""){
				window.open(url);
			}
		}
	});

	//影像力
	$("#slideshow_yxl").cycle({
		fx:	'scrollHorz',
		speed:	'fast',
		next:	'#yxl_slidebtn_next',
		prev:	'#yxl_slidebtn_prev',
		pause: true,
		after:	function (curr, next, opts) {
					var index = opts.currSlide;
					$("#yxl_atpage").html(index+1);
				}
	});

	//热门专题
	$("#slideshow_rmzt").cycle({
		fx:	'scrollHorz',
		speed:	'fast',
		next:	'#rmzt_slidebtn_next',
		prev:	'#rmzt_slidebtn_prev',
		pager:	'#slidebtn_rmzt',
		pause: true
	});

	//热度、评论排行
	$("#dragMark .hdt li").bind("hover", function(){
		var t = $(this), index = t.index();
		if(!t.hasClass("current")){
			$("#dragMark .hdt li").removeClass("current");
			t.addClass("current");
			$("#dragMark .hdc ol").hide();
			$("#dragMark .hdc ol").eq(index).show();
		}
	});


	//新闻排行
	$("#xwph .hdt li").bind("hover", function(){
		var t = $(this), index = t.index();
		if(!t.hasClass("current")){
			$("#xwph .hdt li").removeClass("current");
			t.addClass("current");
			$("#xwph .hdc div").hide();
			$("#xwph .hdc #xwph"+index).show();
		}
	});

	/*
	 * 图说天下 s
	 */

	$("#slideshow_tstx").cycle({
		fx:	'scrollHorz',
		pager:	'#slidebtn_tstx',
		speed:	'500',
		pause: true
	});

	// 修正FF浏览器兼容
	function getOffset(e) {
	    var target = e.target;
	    if (target.offsetLeft == undefined) {
	        target = target.parentNode;
	    }
	    var pageCoord = getPageCoord(target);
	    var eventCoord = {
	        x: window.pageXOffset + e.clientX,
	        y: window.pageYOffset + e.clientY
	    };
	    var offset = {
	        offsetX: eventCoord.x - pageCoord.x,
	        offsetY: eventCoord.y - pageCoord.y
	    };
	    return offset;
	}

	function getPageCoord(element) {
	    var coord = {
	        x: 0,
	        y: 0
	    };
	    while (element) {
	        coord.x += element.offsetLeft;
	        coord.y += element.offsetTop;
	        element = element.offsetParent;
	    }
	    return coord;
	}

	$("#slideshow_tstx a").hover(function(e){
		var _this  = $(this), //闭包
		_desc  = _this.find(".txt").stop(true),
		width  = _this.width(), //取得元素宽
		height = _this.height(), //取得元素高
		left   = (e.offsetX == undefined) ? getOffset(e).offsetX : e.offsetX, //从鼠标位置，得到左边界，利用修正ff兼容的方法
		top    = (e.offsetY == undefined) ? getOffset(e).offsetY : e.offsetY, //得到上边界
		right  = width - left, //计算出右边界
		bottom = height - top, //计算出下边界
		rect   = {}, //坐标对象，用于执行对应方法。
		_min   = Math.min(left, top, right, bottom), //得到最小值
		_out   = e.type == "mouseleave", //是否是离开事件
		spos   = {}; //起始位置

		rect[left] = function (epos){ //鼠从标左侧进入和离开事件
			spos = {"left": -width, "top": 0};
			if(_out){
				_desc.animate(spos, "fast"); //从左侧离开
			}else{
				_desc.css(spos).animate(epos, "fast"); //从左侧进入
			}
		};

		rect[top] = function (epos) { //鼠从标上边界进入和离开事件
			spos = {"top": -height, "left": 0};
			if(_out){
				_desc.animate(spos, "fast"); //从上面离开
			}else{
				_desc.css(spos).animate(epos, "fast"); //从上面进入
			}
		};

		rect[right] = function (epos){ //鼠从标右侧进入和离开事件
			spos = {"left": left,"top": 0};
			if(_out){
				_desc.animate(spos, "fast"); //从右侧成离开
			}else{
				_desc.css(spos).animate(epos, "fast"); //从右侧进入
			}
		};

		rect[bottom] = function (epos){ //鼠从标下边界进入和离开事件
			spos = {"top": height, "left": 0};
			if(_out){
				_desc.animate(spos, "fast"); //从底部离开
			}else{
				_desc.css(spos).animate(epos, "fast"); //从底部进入
			}
		};

		rect[_min]({"left":0, "top":0}); // 执行对应边界 进入/离开 的方法

	});

	/*
	 * 图说天下 e
	 */





	//分享功能
	$("html").delegate(".sharebtn", "mouseenter", function(){
		var t = $(this), title = t.attr("data-title"), url = t.attr("data-url"), pic = t.attr("data-pic"), site = encodeURIComponent(document.title);
		title = title == undefined ? "" : encodeURIComponent(title);
		url   = url   == undefined ? "" : encodeURIComponent(url);
		pic   = pic   == undefined ? "" : encodeURIComponent(pic);
		if(title != "" || url != "" || pic != ""){
			$("#shareBtn").remove();
			var offset = t.offset(),
					left   = offset.left - 42 + "px",
					top    = offset.top + 20 + "px",
					shareHtml = [];
			shareHtml.push('<s></s>');
			shareHtml.push('<ul>');
			shareHtml.push('<li class="tqq"><a href="http://share.v.t.qq.com/index.php?c=share&a=index&url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
			shareHtml.push('<li class="qzone"><a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&desc='+title+'&pics='+pic+'" target="_blank">QQ空间</a></li>');
			shareHtml.push('<li class="qq"><a href="http://connect.qq.com/widget/shareqq/index.html?url='+url+'&desc='+title+'&title='+title+'&summary='+site+'&pics='+pic+'" target="_blank">QQ好友</a></li>');
			shareHtml.push('<li class="sina"><a href="http://service.weibo.com/share/share.php?url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
			shareHtml.push('</ul>');

			$("<div>")
				.attr("id", "shareBtn")
				.css({"left": left, "top": top})
				.html(shareHtml.join(""))
				.mouseover(function(){
					$(this).show();
					return false;
				})
				.mouseout(function(){
					$(this).hide();
				})
				.appendTo("body");
		}
	});

	$("html").delegate(".sharebtn", "mouseleave", function(){
		$("#shareBtn").hide();
	});

	$("html").delegate("#shareBtn a", "click", function(event){
		event.preventDefault();
		var href = $(this).attr("href");
		var w = $(window).width(), h = $(window).height();
		var left = (w - 760)/2, top = (h - 600)/2;
		window.open(href, "shareWindow", "top="+top+", left="+left+", width=760, height=600");
	});




});

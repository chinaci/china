$(function(){

	//侧栏分类
	$(".sb-type").hover(function(){
		var height = 0;
		$(this).find("dl").each(function(){
			height = height + $(this).height() + 20;
		});
		$(this).stop().animate({height: height+"px"}, 200);
	}, function(){
		$(this).stop().animate({height: "390px"}, 200);
	});

	//slideshow_710_400
	var sid = 710400;
	$("#slideshow"+sid).cycle({
		fx: 'scrollHorz',
		speed: 300,
		pager: '#slidebtn'+sid,
		next:	'#slidebtn'+sid+'_next',
		prev:	'#slidebtn'+sid+'_prev',
		pause: true
	});

	$(".slideshow_710_400").hover(function(){
		$(this).find(".prev, .next").show();
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	//服务项目鼠标经过
	$(".project li").hover(function(){
		$(this).siblings("li").stop().animate({"opacity": "0.5", "filter": "Alpha(opacity=50)"}, 200);
		$(this).stop().animate({"opacity": "1", "filter": "Alpha(opacity=100)"}, 200);
	}, function(){
		$(this).siblings("li").stop().animate({"opacity": "1", "filter": "Alpha(opacity=100)"}, 200);
	});

	//设计师
	$("#designer .plist li").each(function(i){ $("#designer .plist li").slice(i*5,i*5+5).wrapAll("<ul></ul>");});

	//设计师列表
	$("#designer .plist").cycle({
		fx: 'scrollHorz',
		speed: 300,
		next:	'#designer .next',
		prev:	'#designer .prev',
		pause: true
	});

	$("#designer").hover(function(){
		$(this).find(".prev, .next").show();
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	//企业列表
	$(".comlist li").hover(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		var t = $(this), index = t.index();
		t.siblings("li").stop().animate({"opacity": "0.15", "filter": "Alpha(opacity=15)"}, 200);
		t.siblings("li").css({"z-index": "1"});
		t.stop().animate({"opacity": "1", "filter": "Alpha(opacity=100)"}, 200);
		t.css({"z-index": "2"});

		if(screenwidth < criticalPoint){
			index = index > 6 ? index - 7 : index;
			count = 3;
		}else{
			index = index > 7 ? index - 8 : index;
			count = 4;
		}
		if(index > count){
			t.find(".popup").css({"left": "auto", "right": "-1px"});
			t.find(".popup .title, .popup .info").css({"float": "right"});
		}

		t.find(".popup").show();
		t.find(".info").stop().animate({"width": (screenwidth < criticalPoint ? 410 : 433) + "px"}, 150);

	}, function(){
		var t = $(this);
		t.siblings("li").stop().animate({"opacity": "1", "filter": "Alpha(opacity=100)"}, 200);
		t.siblings("li").css({"z-index": "1"});

		t.find(".info").stop().animate({"width": "0"});
		t.find(".popup").hide();
	});

	//装修效果图换一换效果
	var arartta2= window['arartta2'] = function(o){
		return new das2(o);
	}
	das2 = function(o){
		this.obj = $('#'+o.obj);
		this.bnt = $('#'+o.bnt);
		this.showLi = this.obj.find('li');
		this.current = 0;
		this.myTimersc = '';
		this.init()
	}
	das2.prototype = {
		chgPic:function(n){
			var _this = this;
			_this.showLi.each(function(){
				var width = $(this).width();
				$(this).find('.item:not(:animated)').animate({left: -(n * width) + "px"}, {easing:"easeInOutExpo"}, 1500);
			});
		},
		init:function(){
			var _this = this;
			this.bnt.bind("click",function(){
				_this.current++;
				if (_this.current > 2) {
					_this.current = 0 ;
				}
				_this.chgPic(_this.current);
			});
		}
	}

	//异步获取装修效果图
	$.ajax({
		url: "/include/ajax.php?service=renovation&action=rcase&type=0&orderby=click&pageSize=18",
		type: "POST",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state == 100){
				var list = data.info.list, html = [], li = [];
				for(var i = 0; i < list.length; i++){
					html.push('<a href="'+list[i].url+'" target="_blank"><img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'"><p>'+list[i].title+'</p><div class="bg"></div></a>');
				}
				var length = html.length;
				for(var i = 0; i < length/3; i++){
					li.push('<li class="p'+(i+1)+'"><div class="item">'+html.splice(0,3).join("")+'</div></li>');
				}
				$("#zxPics").html(li.join(""));
				$("#zxPicsBtn").fadeIn();
				arartta2({
					bnt:'zxPicsBtn',
					obj:'zxPics'
				});
			}else{
				$("#zxPics .loading").html("暂无相关信息！");
			}
		}
	});

	//异步获取装修案例
	$.ajax({
		url: "/include/ajax.php?service=renovation&action=diary&orderby=click&pageSize=24",
		type: "POST",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state == 100){
				var list = data.info.list, html = [], li = [];
				for(var i = 0; i < list.length; i++){
					var title = list[i].btype + parseFloat(list[i].price) + "万 " + list[i].units;
					var type = "small";
					if(i > 5 && i < 13){
						title = title + " " + list[i].style;
						type = "middle";
					}
					if(i > 20){
						type = "middle";
					}
					html.push('<a href="'+list[i].url+'" target="_blank"><img src="'+huoniao.changeFileSize(list[i].litpic, type)+'"><p>'+title+'</p><div class="bg"></div></a>');
				}
				var length = html.length;
				for(var i = 0; i < length/3; i++){
					var l = (i > 5 ? i+1 : i) + 1;
					li.push('<li class="p'+l+'"><div class="item">'+html.splice(0,3).join("")+'</div></li>');
				}
				$("#casePics").html(li.join(""));
				$("#casePicsBtn").fadeIn();
				arartta2({
					bnt:'casePicsBtn',
					obj:'casePics'
				});
			}else{
				$("#casePics .loading").html("暂无相关信息！");
			}
		}
	});

	//异步获取装修攻略
	$.ajax({
		url: "/include/ajax.php?service=renovation&action=news&ispic=1&pageSize=27",
		type: "POST",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state == 100){
				var list = data.info.list, li = [], ul = [], l = 0;
				for(var i = 0; i < list.length; i++){
					l = l > 8 ? 1 : l+1;
					type = "small";
					if(l == 3 || l == 4 || l == 7 || l == 9){
						type = "middle";
					}
					li.push('<li class="p'+l+'"><div class="item"><a href="'+list[i].url+'" target="_blank"><img src="'+huoniao.changeFileSize(list[i].litpic, type)+'"><p>'+list[i].title+'</p><div class="bg"></div></a></div></li>');
				}

				var length = li.length;
				for(var i = 0; i < length/9; i++){
					ul.push('<ul class="pics">'+li.splice(0,9).join("")+'</ul>');
				}
				$("#gl").html(ul.join(""));

				$("#gl").cycle({
					fx: 'scrollHorz',
					speed: 300,
					next:	'#glnext',
					prev:	'#glprev',
					pause: true
				});

				$(".gl").hover(function(){
					$(this).find(".prev, .next").show();
				}, function(){
					$(this).find(".prev, .next").hide();
				});

			}else{
				$("#gl .loading").html("暂无相关信息！");
			}
		}
	});

	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){

		$("#slideshow"+sid).cycle('pause');
		$("#designer .plist").cycle('pause');
		$("#gl").cycle('pause');

		var screenwidth = window.innerWidth || document.body.clientWidth;
		if(screenwidth < criticalPoint){
			$("#slideshow"+sid).cycle({fx: 'scrollHorz', speed: 300, width: "775px"});
			$("#designer .plist").cycle({fx: 'scrollHorz', speed: 300, width: "780px"});
			$("#designer").find("ul").css({width: "780px"});
			$("#gl").cycle({fx: 'scrollHorz', speed: 300, width: "1000px"});
			$("#gl").find(".pics").css({width: "1000px"});
		}else{
			$("#slideshow"+sid).cycle({fx: 'scrollHorz', speed: 300, width: "710px"});
			$("#designer .plist").cycle({fx: 'scrollHorz', speed: 300, width: "975px"});
			$("#designer").find("ul").css({width: "975px"});
			$("#gl").cycle({fx: 'scrollHorz', speed: 300, width: "975px"});
			$("#gl").find(".pics").css({width: "975px"});
		}
	});

});

//单点登录执行脚本
function ssoLogin(info){

	$("#navLoginBefore, #navLoginAfter").remove();

	//已登录
	if(info){
		$(".top .topbar").prepend('<div class="userinfo" id="navLoginAfter"><div id="upic"><a href="'+info['userDomain']+'" target="_blank"><img onerror="javascript:this.src=\''+masterDomain+'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'"></a></div><a href="'+info['userDomain']+'" id="uname" target="_blank">'+info['nickname']+'</a><a href="'+masterDomain+'/logout.html" class="logout">安全退出</a></div>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".top .topbar").prepend('<ul class="logreg" id="navLoginBefore"><li><a href="javascript:;" id="login">登录</a></li><li><a href="'+masterDomain+'/register.html">注册</a></li></ul>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}

$(function(){

	$("img").scrollLoading();

	//文本框placeholder
	$("html input").placeholder();

	//二级导航
	$(".s-nav li").hover(function(){
		$(this).addClass("current");
	}, function(){
		$(this).removeClass("current");
	});

	//异步获取二手房统计数据
	$.ajax({
		url: "/include/ajax.php?service=house&action=saleList&pageSize=-1&pageInfo=1",
		type: "POST",
		dataType: "jsonp",
		success: function (data) {
			var count = 0;
			if(data && data.totalCount){
				count = data.totalCount;
			}
			$("#saleTotal").html(count);
		}
	});

	$.ajax({
		url: "/include/ajax.php?service=house&action=saleList&times=week-1&pageSize=-1&pageInfo=1",
		type: "POST",
		dataType: "jsonp",
		success: function (data) {
			var count = 0;
			if(data && data.totalCount){
				count = data.totalCount;
			}
			$("#saleWeekTotal").html(count);
		}
	});


	//搜索分类切换
	$(".s-nav li").hover(function(){
		var t = $(this), index = t.index();
		if(!t.hasClass("on") && index < t.siblings("li").length){
			t.addClass("on").siblings("li").removeClass("on");
		}
	});

	$("#search_button").bind("click", function(){
		var keywords = $("#search_keyword"), txt = $.trim(keywords.val());
		if(txt != ""){

			var href = $(".s-nav .on a").attr("href");
			if(href != ""){
				location.href = href + (href.indexOf("?") > -1 ? "&" : "?") + "keywords="+txt;
			}

		}else{
			keywords.focus();
		}
	});


	$("#search_keyword").autocomplete({
		source: function(request, response) {

			var action = $(".s-nav .on").attr("data-type");

			$.ajax({
				url: masterDomain+"/include/ajax.php?service=house&action="+action+"List",
				dataType: "jsonp",
				data:{
					keywords: request.term
				},
				success: function(data) {
					if(data && data.state == 100){
						response($.map(data.info.list, function(item, index) {
							return {
								id: item.id,
								value: item.title,
								label: item.title
							}
						}));
					}else{
						response([])
					}
				}
			});
		},
		minLength: 1,
		select: function(event, ui) {
			$("#search_button").click();
		}
	}).autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append(item.label)
			.appendTo(ul);
	};


	//回车搜索
	$("#search_keyword").keyup(function (e) {
		if (!e) {
			var e = window.event;
		}
		if (e.keyCode) {
			code = e.keyCode;
		}
		else if (e.which) {
			code = e.which;
		}
		if (code === 13) {
			$("#search_button").click();
		}
	});



	//定义公用func
	var cycle = function(obj, prev, next, pager){

		$(obj).cycle({
			fx: 'scrollHorz',
			speed: 300,
			next:	next,
			prev:	prev,
			pager: pager,
			pause: true
		});

		$(obj).cycle('pause');
	}

	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){
		$(".w-item .slide").cycle('pause');
		$(".w-item .group-slide").cycle('pause');
		$("#topicSlide").cycle('pause');

		var screenwidth = window.innerWidth || document.body.clientWidth;
		if(screenwidth < criticalPoint){
			$(".w-item ul").css({"width": "1015px", "height": "404px"});
			$(".w-item .slide").cycle({fx: 'scrollHorz', speed: 300, width: "1015px"});

			$(".w-item .group-slide ul").css({"width": "605px", "height": "330px"});
			$(".w-item .group-slide").cycle({fx: 'scrollHorz', speed: 300, width: "605px"});

			$("#topicSlide ul").css({"width": "1048px"});
			$("#topicSlide").cycle({fx: 'scrollHorz', speed: 300, width: "1048px"});
		}else{
			$(".w-item ul").css({"width": "1215px", "height": "486px"});
			$(".w-item .slide").cycle({fx: 'scrollHorz', speed: 300, width: "1215px"});

			$(".w-item .group-slide ul").css({"width": "800px", "height": "330px"});
			$(".w-item .group-slide").cycle({fx: 'scrollHorz', speed: 300, width: "800px"});

			$("#topicSlide ul").css({"width": "1248px"});
			$("#topicSlide").cycle({fx: 'scrollHorz', speed: 300, width: "1248px"});
		}
	});

	//显示左右切换按钮
	$(".wc").hover(function(){
		$(this).find(".prev, .next").show();
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	//房产知识
	$(".r-community .tab li").hover(function(){
		var t = $(this), index = t.index();
		if(!t.hasClass("on")){
			t.parent().find("li").removeClass("on");
			t.addClass("on");
			var width = $(".r-community .list ul:eq("+index+")").width();
			width = index == 0 ? 0 : -width;
			$(".r-community .list").stop().animate({"margin-left": width+"px"}, 300);
		}
	});

	//更多资讯分类
	$(".nnav .more").hover(function(){
		$(this).find("ul").show();
	}, function(){
		$(this).find("ul").hide();
	});

	//鼠标经过装修效果图左右切换按钮
	$(".zx .l").hover(function(){
		$(this).find(".prev, .next").show();
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	//显示/隐藏更多筛选项
	$(".filter .more").click(function(){
		var t = $(this), parent = t.closest(".filter"), txt = t.html();
		if(txt.indexOf("更多") > -1){
			parent.find("dl").show();
			t.html("收起&nbsp;︽");
		}else{
			parent.find("dl").each(function(index){
				if(index > 1){
					$(this).hide();
				}
			});
			t.html("更多&nbsp;︾");
		}
	});

	//关闭筛选
	$(".filter .close").click(function(){
		var obj = $(this).closest(".filter"), id = obj.attr("data-id");
		obj.remove();

		var date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));  //设置过期时间为7天
		$.cookie("filter_"+id, true, {expires: date});
	});

	//验证是否显示筛选
	$(".filter").each(function(){
		var id = $(this).attr("data-id");
		if($.cookie("filter_"+id) != 'true'){
			$(this).show();
		}
	});

	//往期回顾
	$("#topicPast").click(function(){
		var url = $(this).attr("data-url");
		WdatePicker({
			el: 'pastDate',
			position: {left: -95, top: 0},
			isShowClear: false,
			isShowOK: false,
			isShowToday: false,
			qsEnabled: false,
			maxDate: '%y-%M-%d',
			onpicking: function(dp){
				var date = dp.cal.getNewDateStr() + " 00:00:00";
				var nDate = huoniao.transToTimes(date);
				url = url.replace("#date#", nDate);
				window.open(url);
			}
		});
	});

	//返回顶部
	$(".fix-footer a").bind("click", function(){
		$('html, body').animate({scrollTop:0}, 300);
	});

	//滚动监听
	$(window).scroll(function(){
		var scroH = $(this).scrollTop();
		if(scroH <= 600){
			$(".fix-menu").removeClass("fix-menu-show");
		}else{
			$(".fix-menu").addClass("fix-menu-show");
		}
	});

	//楼层直达
	$(".fix-item a").click(function(){
		var index = $(this).parent().index();
		$(".wt").each(function(i){
			var top = $(this).offset().top - 10;
			if(i == index){
				if($(this).prev("div").hasClass("wh")){
					top = top - 30;
				}
				$('html, body').stop().animate({scrollTop:top}, 300);
			}
		});
	});

	//异步获取数据
	function getData(id){
		var obj = $("#"+id), action = id, service = 'house',
				on  = obj.find(".xtab .on a"),
				filter = on.get(0).attributes,
				data = [], fil = [], num = 10, pageSize = 50;

		for(i = 0; i < filter.length; i++){
			var name = filter[i].name, value = filter[i].value;
			if(name.indexOf("data-") > -1){
				key = name.replace("data-", "");
				data.push(key+"="+value);
				fil.push(key+value);
			}
		}

		//楼盘团购
		if(id == "groupbuy"){
			num = 13;
			pageSize = 45;
			action = "loupanList";

		//租房
		}else if(id == "zuList"){
			//写字楼
			if(on.attr("data-atype") == "xzl"){
				action = "xzlList";

			//商铺
			}else if(on.attr("data-atype") == "sp"){
				action = "spList";

			//厂房
			}else if(on.attr("data-atype") == "cf"){
				action = "cfList";
			}

		//商业地产
		}else if(id == "commerical"){
			//写字楼
			if(on.attr("data-atype") == "xzl"){
				action = "xzlList";

			//商铺
			}else if(on.attr("data-atype") == "sp"){
				action = "spList";

			//厂房
			}else if(on.attr("data-atype") == "cf"){
				action = "cfList";
			}

		//建材产品
		}else if(id == "product"){
			service = 'build';
			num = 12;
			pageSize = 36;
			action = "blist";
		}

		data.push("pageSize="+pageSize);
		obj.find(".w-item").hide();

		var wrapObj = id+'-'+fil.join("-");
		if($("#"+wrapObj).html() != undefined){
			obj.find(".loading").hide();
			$("#"+wrapObj).fadeIn(300);
		}else{

			obj.find(".loading").html("加载中，请稍候...").show();
			$.ajax({
				url: "/include/ajax.php?service="+service+"&action="+action+"&"+data.join("&"),
				type: "POST",
				dataType: "jsonp",
				success: function (data) {
					obj.find(".loading").hide();
					if(data && data.state == 100 && data.info.list.length > 0){
						var html = [], list = data.info.list;
						html.push('<div class="w-item" id="'+wrapObj+'">');

						//针对团购单独配置
						if(id == "groupbuy"){
							html.push('<div class="l-item">');
							html.push('<div id="'+wrapObj+'-slide" style="z-index: 1;">');
							for(var i = 0; i < list.length; i++){
								var addrlength = list[i].addr.length;
								//将推荐的团购数据设置为幻灯显示方式
								if(list[i].rec == 1){
									html.push('<div class="slideshow-item">');
									html.push('<a href="'+list[i].url+'" target="_blank" class="pic"><img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'"></a>');
									html.push('<div class="info">');

									var price = list[i].price;
									if(price == 0){
										price = "价格待定";
									}else{
										price = price + (list[i].ptype == 1 ? (echoCurrency('short')+"/平米") : ("万"+echoCurrency('short')+"/套"));
									}

									html.push('<h5><a href="'+list[i].url+'" target="_blank">'+list[i].title+'</a>[<a href="'+list[i].url+'" target="_blank">'+list[i].addr[addrlength-2]+'</a>]</h5>');
									html.push('<div class="p">');
									html.push('<span class="price">最低价格 '+price+'</span>');
									html.push('<span class="book">已有<strong>'+list[i].tuanCount+'</strong>人报名</span>');
									html.push('</div>');
									html.push('<div class="bg"></div>');
									html.push('</div>');
									html.push('<a href="'+list[i].url+'" target="_blank" class="apply">我要报名</a>');

									if(list[i].tuanState == "1"){
										html.push('<span class="state soon">还未开始</span>');
									}else if(list[i].tuanState == "2"){
										html.push('<span class="state being">进行中</span>');
									}else if(list[i].tuanState == "3"){
										html.push('<span class="state soon">已结束</span>');
									}

									html.push('</div>');

								}
							}
							html.push('</div>');
							html.push('<div id="'+wrapObj+'-slidebtn" class="slidebtn"></div>');
							html.push('</div>');
							html.push('<div class="r-item">');
						}

						//如果数据大于每页显示的数量则输出左右切换按钮
						if(list.length > num){
							html.push('<span class="prev"><i></i></span>');
							html.push('<span class="next"><i></i></span>');
						}

						html.push('<div class="slide">');
						html.push('<ul class="fn-clear">')
						for(var i = 0; i < list.length; i++){
                            var addrlength = list[i].addr.length;
							//建材
							if(id == "product"){
								html.push('<li>');
								html.push('<a href="'+list[i].url+'" target="_blank">');
								html.push('<img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" alt="'+list[i].title+'">');
								html.push('<div class="info">');
								html.push('<div class="txt">'+list[i].title+'<br>'+echoCurrency('symbol')+list[i].price+'</div>');
								html.push('<div class="bg"></div>');
								html.push('</div>');
								html.push('</a>');
								html.push('</li>');

							}else{

								//针对团购单独配置
								if(id == "groupbuy" && list[i].rec == 1){
									continue;
								}
								html.push('<li>');
								html.push('<a href="'+list[i].url+'" target="_blank">');
								if(list[i].rec == 1){
									html.push('<span class="rec">今日推荐</span>');
								}

								//团购属性
								if(id == "groupbuy"){
									if(list[i].salestate == 0){
										html.push('<span class="sale">待售</span>');
									}else if(list[i].salestate == 1){
										html.push('<span class="being">在售</span>');
									}else if(list[i].salestate == 2){
										html.push('<span class="late">尾盘</span>');
									}else if(list[i].salestate == 3){
										html.push('<span class="gone">售磬</span>');
									}
								}

								//二手房属性
								if(id == "saleList"){
									var flag = list[i].flag;
									if(flag != ""){
										html.push('<span class="flag">');
										flag = flag.split(",");
										for(var f = 0; f < flag.length; f++){
											if(flag[f] == "0"){
												html.push('<span class="jishou">急售</span>');
											}else if(flag[f] == "1"){
												html.push('<span class="mianshui">免税</span>');
											}else if(flag[f] == "2"){
												html.push('<span class="ditie">公交/地铁</span>');
											}else if(flag[f] == "3"){
												html.push('<span class="xiaoqu">校区房</span>');
											}else if(flag[f] == "4"){
												html.push('<span class="wunian">满五年</span>');
											}else if(flag[f] == "5"){
												html.push('<span class="tuijian">推荐</span>');
											}
										}
										html.push('</span>');
									}
								}

								//设置图片尺寸
								var type = "middle";
								if(id == "groupbuy"){
									// type = "small";
								}

								html.push('<img src="'+huoniao.changeFileSize(list[i].litpic, type, 'small')+'" alt="'+list[i].title+'" />');
								html.push('<div class="info">');

								var price = list[i].price;
								if(price == 0){
									price = "价格待定";
								}else{
									price = price + (list[i].ptype == 1 ? (echoCurrency('short')+"/平米") : ("万"+echoCurrency('short')+"/套"));
								}

								//设置价格显示方式
								//团购
								if(id == "groupbuy"){
									price = '<span class="price">'+price+'</span><strong>'+list[i].tuanCount+'</strong>人报名';

								//二手房
								}else if(id == "saleList"){

									var price = list[i].price == 0 ? "价格面议" : list[i].price + "万";
									price = list[i].area+'㎡&nbsp;&nbsp;'+price+'&nbsp;&nbsp;'+list[i].room;

								//租房
								}else if(id == "zuList" || id == "commerical"){

									var type = on.attr("data-type");

									//房产
									if(action == "zuList"){
										var price = list[i].price == 0 ? "价格面议" : list[i].price + echoCurrency('short')+"/月";
										price = price+'&nbsp;&nbsp;'+list[i].room+'&nbsp;&nbsp;'+list[i].rentype;

									//写字楼
									}else if(action == "xzlList"){
										var price = list[i].price == 0 ? "价格面议" : list[i].price + (type == 1 ? "万"+echoCurrency('short') : echoCurrency('short')+"/月");
										price = price+'&nbsp;&nbsp;'+list[i].area+'㎡';

									//商铺
									}else if(action == "spList"){
										var price = list[i].price == 0 ? "价格面议" : list[i].price + (type == 1 ? "万"+echoCurrency('short') : echoCurrency('short')+"/月");
										price = price+'&nbsp;&nbsp;'+list[i].area+'㎡';

									//厂房
									}else if(action == "cfList"){
										var price = list[i].price == 0 ? "价格面议" : list[i].price + (type == 2 ? "万"+echoCurrency('short') : echoCurrency('short')+"/月");
										price = price+'&nbsp;&nbsp;'+list[i].area+'㎡';
									}
								}

								//设置显示标题
								var title = list[i].title;
								if(id == "saleList" || id == "zuList"){
									title = list[i].community;
								}


								//写字楼、商铺、厂房
								if(action == "xzlList"){
									title = list[i].loupan;
								}else if(action == "spList" || action == "cfList"){
									title = list[i].title.substr(0, 10);
								}

								html.push('<div class="txt">'+title+'['+list[i].addr[addrlength-2]+']<br />'+price+'</div>');
								html.push('<div class="bg"></div>');
								html.push('</div>');
								html.push('</a>');
								html.push('</li>');
							}

							if((i+1)%num == 0 && i < list.length-1){
								html.push('</ul><ul class="fn-clear">')
							}
						}
						html.push('</ul>')
						html.push('</div>');

						//针对团购单独配置
						if(id == "groupbuy"){
							html.push('</div>');
						}

						html.push('</div>');

						obj.find(".wc").append(html.join(""));

						//团购幻灯
						if(id == "groupbuy"){
							cycle('#'+wrapObj+'-slide', null, null, '#'+wrapObj+'-slidebtn');
						}

						cycle('#'+wrapObj+' .slide', '#'+wrapObj+' .prev', '#'+wrapObj+' .next', null);

						$("img").scrollLoading();

					}else{
						obj.find(".loading").html(data.info).show();

					}
				}
			});
		}
	}

	//筛选点击切换
	$(".xtab li").click(function(){
		var t = $(this);
		if(!t.hasClass("l") && !t.hasClass("link") && !t.hasClass("on")){
			t.siblings("li").removeClass("on");
			t.addClass("on");
			var obj = t.closest(".wrap").attr("id");
			if(obj){
				getData(obj);
			}
		}
	});

	var ajaxList = ["loupanList", "groupbuy", "saleList", "zuList", "commerical"];
	$.each(ajaxList, function(){
		getData(this);
	});

	//房产资讯TAB切换
	$(".nnav li").hover(function(){
		var t = $(this), parent = t.closest("ul"), index = t.attr("data-id");
		if(parent.hasClass("nnav") && !t.hasClass("more")){
			t.siblings("li").removeClass("on");
			t.addClass("on");

			parent.parent().next(".con").find(".con-item").hide();
			$("#con"+index).show();
		}
	});

	//专题策划
	cycle('#topicSlide', null, null, '#topicSlideBtn');

	//装修效果图
	cycle('#zx-slide', '.zx .prev', '.zx .next', '#zx-slidebtn');


	//装修效果图换一换效果
	var arartta2= window['arartta2'] = function(o){
      return new das2(o);
  }
  das2 = function(o){
      this.obj = $('#'+o.obj);
      this.bnt = $('#'+o.bnt);
      this.showLi = this.obj.find('.item');
      this.current = 0;
      this.myTimersc = '';
      this.init()
  }
  das2.prototype = {
      chgPic:function(n){
          var _this = this;
          	_this.showLi.each(function(){
          		var width = $(this).width();
          		$(this).find('.imore:not(:animated)').animate({left: -(n * width) + "px"}, {easing:"easeInOutExpo"}, 1500);
          	});
      },
      init:function(){
          var _this = this;
          this.bnt.bind("click",function(){
              _this.current++;
              if (_this.current> 2) {
                  _this.current = 0 ;
              }
              _this.chgPic(_this.current);
          });
      }
  }

	//换一组效果
	$(".change").click(function(){
		var t = $(this), obj = t.closest(".wrap"), index = obj.find(".xtab li.on").index(), lis = [];

		//正常模块
		if(obj.attr("id") != "zhuangxiu"){
			obj.find(".xtab li").each(function(){
				if(!$(this).hasClass("l") && !$(this).hasClass("link")){
					lis.push($(this));
				}
			});
			if(index == lis.length - 1){
				lis[0].find("a").click();
			}else{
				lis[index+1].find("a").click();
			}
		}
	});

	//装修效果图换一换效果
	arartta2({
		bnt:'zhuangxiu .change',
		obj:'zhuangxiu'
	});
});

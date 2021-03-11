$(function(){

	//slideshow_1200_60
	$("#slideshow120060").cycle({ 
		fx: 'fade',
		speed: 300,
		pager: '#slidebtn120060',
		pause: true
	});

	$(".slideshow_1200_60 .close").click(function(){
		$(this).parent().remove();
	});

	//更多筛选条件
	$(".h-content .more").hover(function(){
		$(this).closest("dl").addClass("on");
	});

	$(".h-content dl").hover(function(){}, function(){
		$(this).removeClass("on");
	});

	$("#weekHot li").each(function(){
		if($.trim($(this).html()) == ""){
			$(this).remove();
		}
	});

	//本周精选
	$("#weekHot ul").cycle({ 
		fx: 'fade',
		speed: 200,
		pager: '#weekHotBtn',
		next:	'#weekHot_next', 
		prev:	'#weekHot_prev',
		pause: true
	});

	$("#weekHot").hover(function(){
		$(this).find(".prev, .next").fadeIn(300);
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	//美梦成真
	$("#lottery").cycle({ 
		fx: 'scrollHorz',
		speed: 300,
		pager: '#lotteryBtn',
		next:	'#lottery_next', 
		prev:	'#lottery_prev',
		pause: true
	});

	$(".lottery-c").hover(function(){
		$(this).find(".prev, .next").fadeIn(300);
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	$("#ontime").hover(function(){
		$(this).find(".prev, .next").fadeIn(300);
	}, function(){
		$(this).find(".prev, .next").hide();
	});

	//倒计时（开始时间、结束时间、显示容器）
	var countDown = function(stime, etime, obj, func){
		sys_second = etime - stime;

		var i = 9;
		var mtimer = setInterval(function(){
			i = i < 0 ? 9 : i;
			$(obj).find(".ms").text(i);
			i--;
		}, 100);

		var timer = setInterval(function(){
			if (sys_second > 0) {
				sys_second -= 1;
				var hour = Math.floor((sys_second / 3600) % 24);
				var minute = Math.floor((sys_second / 60) % 60);
				var second = Math.floor(sys_second % 60);
				$(obj).find(".h").text(hour < 10 ? "0" + hour : hour);
				$(obj).find(".m").text(minute < 10 ? "0" + minute : minute);
				$(obj).find(".s").text(second < 10 ? "0" + second : second);
			} else {
				clearInterval(timer);
				clearInterval(mtimer);
				typeof func === 'function' ? func() : "";
			}
		}, 1000);
	}

	function getTime(){
		$.ajax({
			url: "/include/ajax.php?service=system&action=getSysTime",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					var now = huoniao.transTimes(data.now, 1);
					now = now.split(" ")[1];
					var hour = now.split(":")[0], index = hour - 9;

					//判断当前时间段，为时间轴添加样式
					$(".time-list li").each(function(i){
						if(index == i){
							$(this).addClass("current");
						}else if(index < i && index > 0){
							$(this).addClass("after");
						}
					});

					if(index >= 13 || index < 0){
						$(".time-list li:last").addClass("current");
						data.nextHour = data.nextDay + 28800;
					}

					if(index < 0){
						data.nextHour = data.today + 28800;
					}

					var now = data.now, nextHour = data.nextHour;

					//异步加载数据
					$("#ontime .loading").html("加载中，请稍候...").show();
					$.ajax({
						url: "/include/ajax.php?service=tuan&action=tlist&hourly=1&time="+data.nextHour+"&pageSize=50",
						type: "GET",
						dataType: "jsonp",
						success: function (data) {
							if(data && data.state == 100 && data.info.list.length > 0){
								var list = data.info.list, html = [];
								for(var i = 0; i < list.length; i++){
									html.push('<li><a href="'+list[i].url+'" target="_blank"><img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" /><h4>'+list[i].title+'</h4><div class="price"><span><i>超值价&nbsp;'+echoCurrency('symbol')+'</i>'+list[i].price+'</span><span class="sum_g">'+list[i].sale+'<em>人已抢</em></span></div></a></li>');
								}
								$("#ontime .loading").hide();
								$("#ontime ul").html(html.join(""));

								//引入倒计时效果
								countDown(now, nextHour, '#countDown', function(){

									//当前时间段结束后执行
									/* 自动加载下个时间段，由于左右滚动效果在第二次加载后会乱掉，所以暂时隐藏此功能 */
									// var cur = $(".time-list li.current"), length = $(".time-list li").length;
									// cur.removeClass("current");
									// if(cur.index() < length){
									// 	cur.next("li").removeClass("after").addClass("current");
									// 	getTime();
									// }
									$(".cutime").fadeOut();

								});

								setTimeout(function(){$(".cutime").fadeIn();}, 1000);

								/* 整点团 */
								$("#ontime").slide({
									mainCell: "ul",
									effect: "leftLoop",
									autoPlay: false,
									vis: 4,
									delayTime: 300
								});

							}else{
								$("#ontime .loading").html("暂无此时间段的团购信息！");
								$(".cutime").fadeOut();
							}
						}
					});

				}else{
					$(".cutime").fadeOut();
				}
			}
		});
	}
	getTime();

	//数据筛选导航
	var win = $(window), modList = $("#mod-list"), fixnav = modList.find(".fixnav"), filterbg = modList.find(".filterbg"), sldown = null;
	$(window).scroll(function() {
		var stop = win.scrollTop();
		stop > modList.offset().top && stop < modList.offset().top + modList.height() - 400 ? (fixnav.addClass("fixed"), filterbg.slideUp(100), sldown && clearTimeout(sldown), sldown = setTimeout(function(){filterbg.slideDown(100)},400)) : fixnav.removeClass("fixed");
	});

	$("img").scrollLoading();

	//获取团购数据
	function getTuanData(){
		var filterObj = $(".mod-filter"),
				orderby = filterObj.find(".sort .on").parent().attr("class").replace("sort-", ""),
				filter  = filterObj.find(".filter .on").parent().attr("class").replace("filter-", "");

		$("#mod-item .loading").html("加载中，请稍候...").show();
		$.ajax({
			url: "/include/ajax.php?service=tuan&action=tlist&pageSize="+pageSize+"&orderby="+orderby+"&filter="+filter+"&page="+atpage,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				$("#mod-item .loading").hide();
				if(data && data.state == 100 && data.info.list.length > 0){
					var list = data.info.list, 
							pageinfo = data.info.pageInfo,
							html = [];
					for(var i = 0; i < list.length; i++){
						html.push('<li>');
						html.push('<a href="'+list[i].url+'" target="_blank">');
						if(list[i].flag != ""){
							html.push('<span class="marks">');
							flag = list[i].flag;
							for(var b = 0; b < flag.length; b++){
								html.push('<span class="item '+flag[b]+'"></span>');
							}
							html.push('</span>');
						}
						html.push('<img src="'+cfg_staticPath+'images/blank.gif" data-url="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" alt="'+list[i].title+'" />');
						html.push('<span class="geo"><i></i><strong>商圈：</strong>'+list[i].store.circle+'</span>');
						html.push('<h4>'+list[i].title+'</h4>');
						html.push('<h3 title="'+list[i].subtitle+'">'+list[i].subtitle+'</h3>');
						html.push('<div class="item-prices">');
						html.push('<div class="price"><i>'+echoCurrency('symbol')+'</i><em class="actPrice">'+list[i].price+'</em></div>');
						html.push('<div class="dock"><del class="orig-price">'+echoCurrency('symbol')+list[i].market+'</del></div>');
						html.push('<div class="prompt"><span class="sold-num"><span class="fire"></span>已售 <em>'+list[i].sale+'</em></span></div>');
						html.push('</div>');
						html.push('</a>');
						html.push('</li>');
					}
					$("#mod-item ul").html(html.join(""));

					$("img").scrollLoading();
					showPageInfo();

				}else{
					$("#mod-item ul").empty();
					$("#mod-item .loading").html("暂无数据！").show();

					var pageList = [];
					//上一页
					pageList.push('<span class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></span>');
					//下一页
					pageList.push('<span class="pg-next"><span class="text">下一页</span><i class="trigger"></i></span>');
					//页码统计
					pageList.push('<span class="sum"><em>1</em>/1</span>');
					$(".mod-filter .pagination").html(pageList.join(""));

				}
			}
		});
	}
	// getTuanData();

	$(".mod-filter li a").click(function(){
		var t = $(this);
		if(!t.hasClass("on")){
			t.closest("ul").find("li a").removeClass("on");
			t.addClass("on");
			
			$("#mod-item").attr("data-page", 1);
			$('html, body').animate({scrollTop: $("#mod-item").offset().top - 84}, 100);
			getTuanData();
		}
	});

	//翻页
	$(".mod-filter .pagination").delegate("a", "click", function(){
		var cla = $(this).attr("class"), page = $("#mod-item").attr("data-page");
		if(cla == "pg-prev"){
			atpage -= 1;
		}else{
			atpage += 1;
		}
		getTuanData();
	});

	//打印分页
	showPageInfo();
	function showPageInfo(){
		var allPageNum = Math.ceil(totalCount/pageSize);
		var pageList = [];
		//上一页
		if(atpage > 1){
			pageList.push('<a href="javascript:;" class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></a>');
		}else{
			pageList.push('<span class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></span>');
		}

		//下一页
		if(atpage >= allPageNum){
			pageList.push('<span class="pg-next"><span class="text">下一页</span><i class="trigger"></i></span>');
		}else{
			pageList.push('<a href="javascript:;" class="pg-next"><span class="text">下一页</span><i class="trigger"></i></a>');
		}

		//页码统计
		pageList.push('<span class="sum"><em>'+atpage+'</em>/'+allPageNum+'</span>');

		$(".mod-filter .pagination").html(pageList.join(""));
	}

});
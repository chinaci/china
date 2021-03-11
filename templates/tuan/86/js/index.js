$(function(){

	$(".city-info h2").hover(function(){
		$(this).parent().addClass("curr");
	}, function(){
		$(this).parent().removeClass("curr");
	});

	$(".city-info ul").hover(function(){
		$(this).parent().addClass("curr");
	}, function(){
		$(this).parent().removeClass("curr");
	});

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


	//异步加载团购列表
	var page = 1, isload;
	var ajaxNews = function() {
		var id = $(".NewsNav .on a:eq(0)").attr("data-id"),
			href = $(".NewsNav .on a:eq(0)").attr("href");
		var objId = "tuan_list" + id;
		if ($("#" + objId).html() == undefined) {
			$("#tuan_list").append('<div id="' + objId + '" class="slide-box"></div>');
		}
		isload = true;

		$("#" + objId).find(".load-more").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=tuan&action=tlist&typeid=" + id + "&group_img=1&pageSize=10&page="+page,
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

								item.push('<div class="tuan_detail fn-clear">');
								item.push('<div class="tuan_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].litpic+'" alt="'+list[i].title+'"></a></div>');
								item.push('<div class="tuan_title">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a>');
								item.push('<div class="tuan_tips"></div></div>');
								item.push('<div class="tuan_stitle">'+list[i].subtitle+'</div>');
								item.push('<div class="star fn-clear"><div class="down"><em>'+list[i].sale+'</em>人已买</div></div>');
								item.push('<div class="price">'+echoCurrency('symbol')+'<em> '+list[i].price+'</em><span>门店价 ¥'+list[i].market+'</span></div>');
								item.push('<div class="right_now"><a href="'+list[i].url+'">立即团购</a></div>');
								item.push('</div>');

							html.push(item.join(""));
						}

						$("#" + objId).find(".loading").remove();
						$("#" + objId).append(html.join(""));
						if (list == 0) {
							$("#" + objId).html("<p class='loading'>暂无相关数据</p>");
						}else if (page < pageInfo.totalPage) {
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


	// 切换信息tab
	$(".NewsNav ul li").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.find("a").attr("data-id");
			if(!t.hasClass("on")){
				t.siblings("li").removeClass("on").removeClass('NewsNav_bc');
				t.closest(".NewsNav").find('.more_list ul li').removeClass("on").removeClass('NewsNav_bc');
				$('.slide-2 .hd .more').removeClass('on');
				t.addClass("on").addClass('NewsNav_bc');
				if ($("#tuan_list" + id).html() == undefined) {
					page = 1;
					ajaxNews();
				}else{
					$("#tuan_list" + id).show().siblings(".slide-box").hide();
				}

			}

	});

	// 切换信息 更多列表
	$(".more_list ul li a").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.attr("data-id"), url = t.attr("href"), txt = t.text(), parent = t.closest("span");
		$('.pane .hd li:first').addClass('cur').siblings('li').removeClass('cur').removeClass('on');
		parent.siblings("ul").find("li").removeClass("on").removeClass('NewsNav_bc');
		parent
			.addClass("on")
			.find("a:eq(0)")
				.attr("data-id", id)
				.attr("href", url);
		page = 1;
		ajaxNews();
	});

	// 点击加载更多
	$("#tuan_list").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page++;
		ajaxNews();
	});

	//倒计时（开始时间、结束时间、显示容器）
	var countDown = function(stime, etime, obj, func){
		sys_second = etime - stime;
		var i = 9,mtimer,stop = false,first = true;
		setTimeout(function(){
			mtimer = setInterval(function(){
				i = i < 0 ? 9 : i;
				$(obj).find(".ms").text(i);
				i--;
				if(stop && i == -1) {
					clearInterval(mtimer);
				}
			}, 100);
		},1000)

		var timer = setInterval(function(){
			if (sys_second > 0) {
				first = false;
				sys_second -= 1;
				var hour = Math.floor((sys_second / 3600) % 24);
				var minute = Math.floor((sys_second / 60) % 60);
				var second = Math.floor(sys_second % 60);
				$(obj).find(".h1").text(parseInt(hour/10));
				$(obj).find(".h2").text(hour%10);
				$(obj).find(".m1").text(parseInt(minute/10));
				$(obj).find(".m2").text(minute%10);
				$(obj).find(".s1").text(parseInt(second/10));
				$(obj).find(".s2").text(second%10);
			} else {
				clearInterval(timer);
				if(first) {
					clearInterval(mtimer);
				}
				stop = true;
				typeof func === 'function' ? func() : "";
			}
		}, 1000);
	}

	function getTime(){
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=system&action=getSysTime",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					var now = huoniao.transTimes(data.now, 1);
					now = now.split(" ")[1];
					var hour = now.split(":")[0], index = hour - 9;
					var now = data.now, nextHour = data.nextHour;

					//获取团购数据
					$.ajax({
						url: masterDomain+"/include/ajax.php?service=tuan&action=tlist&hourly=1&time="+nextHour+"&pageSize=10",
						type: "GET",
						dataType: "jsonp",
						success: function (data) {
							if(data && data.state == 100 && data.info.list.length > 0){
								var list = data.info.list, html = [];
								for(var i = 0; i < list.length; i++){

									var flag = list[i].flag, yuyue = '';
									if(flag.indexOf("yuyue") > -1){
										yuyue = '<i class="iicon"></i>';
									}
									html.push('<div class="integral_detail on_time">');
									html.push('<div class="inte_time fn-clear"><i></i><em>'+list[i].store.openStart+'</em><span><div class=" time_tips h1"></div><div class=" time_tips h2"></div> 时 <div class=" time_tips m1"></div><div class=" time_tips m2"></div> 分<div class=" time_tips s1"></div><div class=" time_tips s2"></div> 秒后结束</span></div>');
									html.push('<div class="inte_txt fn-clear">');
									html.push('<div class="inte_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" alt=""></a></div>');
									html.push('<h1><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a></h1>');
									html.push('<div class="inte_price"><em><i>'+echoCurrency('symbol')+'</i>'+list[i].price+'</em><span>抢购中</span></div>');
									html.push('</div>');
									html.push('</div>');

									//html.push('<li><a href="'+list[i].url+'" target="_blank"><img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" /><h4>'+list[i].title+'</h4><div class="price"><span><i>超值价&nbsp;&yen;</i>'+list[i].price+'</span><span class="sum_g">'+list[i].sale+'<em>人已抢</em></span></div></a></li>');
								}
								$(".integral_list").html(html.join(""));

								//引入倒计时效果
								countDown(now, nextHour, '.integral_list .inte_time', function(){
									getTime();
								});

							}else{
								$(".integral_list").html("<div class='empty'>暂无此时间段的团购信息！</div>");
							}
						}
					});


				}
			},
			error: function(){
				// console.log('error');
			}
		})
	}
	getTime();

});

$(function(){
	$("img").scrollLoading();
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
					return huoniao.transTimes(time, 2);
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
													return huoniao.transTimes(time, 2);
											}
									}
							}
					}
			}
	}
	//异步加载新闻列表
	var page = 1, isload;
	var ajaxNews = function() {
		var id = $(".NewsNav .on a:eq(0)").attr("data-id"),
			href = $(".NewsNav .on a:eq(0)").attr("href");
		var objId = "NewList" + id;
		if ($("#" + objId).html() == undefined) {
			$("#NewList").append('<div id="' + objId + '" class="slide-box"></div>');
		}
		isload = true;

		$("#" + objId).find(".load-more").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=article&action=alist&typeid=" + id + "&group_img=1&pageSize=10&page="+page,
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
								description = list[i].description,
								num = $(".NewsNav .on a:eq(0)").attr("data-id"),
								time = huoniao.transTimes(list[i].pubdate , 2);

							if (list[i].group_img != "" && list[i].group_img != null) {
								item.push('<div class="content">');

								if (list[i].writer != undefined) {
								item.push('<div class="infor fn-clear"> ');
								item.push('<div class="infor_left">');
								item.push('<div class="infor_img"><a target="_blank" href="#"><img src="{#changeFileSize url="'+list[i].photo+'"#}"></a></div>');
								item.push('<div class="name"><a target="_blank" href="#">'+list[i].writer+'</a><i class="VIP fn-hide"></i><i class="diamond"></i></div>');
								item.push('<div class="inofor_tips">');
								item.push('<em>包吃</em>');
								item.push('</div>');
								item.push('</div>');
								item.push('<div class="infor_right">');
								item.push('<i></i>TB娱乐');
								item.push('</div>');
								item.push('</div>');
								}

								item.push('<div class="con_title"><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a></div>');
								item.push('<div class="con_pic fn-clear">');
								item.push('<ul class="fn-clear">');
								for (var g = 0; g < list[i].group_img.length; g++) {
									if(g < 3 && list[i].group_img[g].path != null){
										item.push('<li><a target="_blank" href="'+list[i].url+'"><img src="' + huoniao.changeFileSize(list[i].group_img[g].path, "small") + '" alt=""></a></li>');
									}
								};
								item.push('</ul>');
								item.push('</div>');
								item.push('<div class="link"><i></i>'+list[i].source+'</div>');
								item.push('<div class="con_footer fn-clear">');
								item.push('<div class="timer">'+time_tran(list[i].pubdate)+'</div>');
								item.push('<div class="con_btn fn-clear">');
								item.push('<ul><li class="ju"><li class="ping"><a target="_blank" style="color:#acacac;" href="'+list[i].url+'#comment"><i></i>'+list[i].common+'</a></li>');
								item.push('</ul>');
								item.push('</div>');
								item.push('</div>');
								item.push('</div>');
							} else if (num == 1){
								item.push('<div class="News_detail fn-clear">');
								item.push('<div class="Video_pic">');
								item.push('<a target="_blank" href="'+list[i].url+'">');
								item.push('<img src="'+list[i].litpic+'" alt="">');
								item.push('<div class="time"><i></i></div>');
								item.push('</a>');
								item.push('</div>');
								item.push('<h1><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a></h1>');
								item.push('<div class="Video_Tips fn-clear">');
								item.push('<div class="News_form"><a target="_blank" href="'+list[i].url+'">'+list[i].source+'</a></div>');
								item.push('<div class="VT_right fn-clear">');
								item.push('<div class="com"><a target="_blank" href="'+list[i].url+'"><i></i>'+list[i].common+'</a></div>');
								item.push('<div class="Time_Before"><i></i>'+time+'</div>');
								item.push('</div>');
								item.push('</div>');
								item.push('</div>');
							}else {
								item.push('<div class="News_detail fn-clear">');
								item.push('<h1><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a></h1>');
								if (list[i].litpic != "") {
								item.push('<ul class="fn-clear">');
								item.push('<li><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].litpic+'" alt=""></a></li>');
								item.push('</ul>');
								}
								item.push('<div class="Video_Tips fn-clear">');
								if (list[i].source != "") {
								item.push('<div class="News_form"><a href="javascript:;">'+list[i].source+'</a></div>');
								}
								item.push('<div class="VT_right fn-clear">');
								item.push('<div class="com"><a target="_blank" href="'+list[i].url+'#comment"><i></i>'+list[i].common+'</a></div>');
								item.push('<div class="Time_Before"><i></i>'+time+'</div>');
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


	// 切换信息tab
	$(".NewsNav ul li").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.find("a").attr("data-id");
			if(!t.hasClass("on")){
				t.siblings("li").removeClass("on").removeClass('NewsNav_bc');
				t.closest(".NewsNav").find('.more_list ul li').removeClass("on").removeClass('NewsNav_bc');
				$('.slide-2 .hd .more').removeClass('on');
				t.addClass("on").addClass('NewsNav_bc');
				if ($("#NewList" + id).html() == undefined) {
					page = 1;
					ajaxNews();
				}else{
					$("#NewList" + id).show().siblings(".slide-box").hide();
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
	$("#NewList").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page++;
		ajaxNews();
	});



});

$(function(){
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


	//异步加载贴吧列表
	var page = 1, isload;
	var ajaxNews = function() {
		var id = $(".NewsNav .on a:eq(0)").attr("data-id"),
			href = $(".NewsNav .on a:eq(0)").attr("href");
		var objId = "EXhand_List" + id;
		if ($("#" + objId).html() == undefined) {
			$("#EXhand_List").append('<div id="' + objId + '" class="slide-box"></div>');
		}
		isload = true;

		$("#" + objId).find(".load-more").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=tieba&action=tlist&typeid=" + id + "&group_img=1&pageSize=10&page="+page,
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


								item.push('<div class="EL_detail">');
								item.push('<div class="infor fn-clear">');
								item.push('<div class="infor_left">');
								item.push('<div class="infor_img"><a target="_blank" href="'+masterDomain+'/user/'+list[i].uid+'#tieba">');
								if (list[i].photo != undefined) {
								item.push('<img src="'+list[i].photo+'" alt="">');
								}
								item.push('</a></div>');
								item.push('<div class="name"><a target="_blank" href="'+masterDomain+'/user/'+list[i].uid+'#tieba">'+list[i].username+'</a></div>');
								// item.push('<div class="form">来自 江苏无锡</div>');
								item.push('</div>');
								item.push('<div class="infor_right">');
								if (list[i].typename[1] != undefined) {
								item.push('<i></i>'+list[i].typename[1]+'');
								}
								item.push('</div>');
								item.push('</div>');
								item.push('<div class="ELD_title"><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a>');
								if (list[i].top == 1) {
									item.push('<i class="top"></i>');
								}
								if (list[i].jinghua == 1) {
									item.push('<i class="jing"></i>');
								}
								item.push('</div>');
								item.push('<div class="Summarize">'+list[i].content+'</div>');
								item.push('<ul class="fn-clear">');
								for (var g = 0; g < list[i].imgGroup.length; g++) {
									if(g < 4 && list[i].imgGroup[g] != null){
										item.push('<li><a target="_blank" href="'+list[i].url+'"><img src="' + list[i].imgGroup[g]  + '" alt="'+list[i].title+'" /></a></li>');
									}
								};
								item.push('</ul>');
								item.push('<div class="ELD_foot fn-clear">');
								item.push('<div class="EF_right">');
								item.push('<span class="view"><i></i><em>'+list[i].click+'</em></span>');
								item.push('<b class="add-num"></b>');
								item.push('<span class="com"><a target="_blank" href="'+list[i].url+'#publish"><i></i>'+list[i].reply+'</a></span>');
								if (list[i].writer != undefined) {
								item.push('<span class="time"><i></i>'+list[i].lastReply+'</span>');
								}
								item.push('</div>');
								item.push('</div>');
								item.push('</div>');


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
				if ($("#EXhand_List" + id).html() == undefined) {
					page = 1;
					ajaxNews();
				}else{
					$("#EXhand_List" + id).show().siblings(".slide-box").hide();
				}
			}

	});

	// 点击加载更多
	$("#EXhand_List").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page++;
		ajaxNews();
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
})

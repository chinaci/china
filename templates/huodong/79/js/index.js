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


	//异步加载活动列表
	var page = 1, isload;
	var ajaxNews = function() {
		var id = $(".NewsNav .on a:eq(0)").attr("data-id"),
			href = $(".NewsNav .on a:eq(0)").attr("href");
		var objId = "HD_list" + id;
		if ($("#" + objId).html() == undefined) {
			$("#HD_list").append('<div id="' + objId + '" class="slide-box"></div>');
		}
		isload = true;

		$("#" + objId).find(".loading").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=huodong&action=hlist&typeid=" + id + "&pageSize=40&page="+page,
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
								time = huoniao.transTimes(list[i].began , 2);

								item.push('<div class="HD_detail">');
								if (list[i].nickname != undefined) {
								item.push('<div class="HD_lead fn-clear">');
								item.push('<div class="HD_infor fn-clear">');
								item.push('<div class="HD_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].photo+'" alt=""></a></div>');
								item.push('<div class="HD_name"><a target="_blank" href="'+list[i].url+'">'+list[i].nickname+'</a><a href="#"><i></i></a></div>');
								item.push('<div class="attention"><em>关注</em></div>');
								item.push('</div><div class="time">'+list[i].date_format+'</div></div>');
								}
								item.push('<div class="HD_titel fn-clear">');
								item.push('<h1><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a></h1>');
								item.push('<span><em>已报</em>'+list[i].reg+'人</span>');
								item.push('</div><div class="HD_TxT fn-clear">');
								item.push('<div class="txt_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].litpic+'"></a></div>');
								item.push('<ul><li><em>活动时间</em>'+time+'</li>');
								item.push('<li><em>活动地点</em>'+list[i].addrname[0]+' '+list[i].addrname[1]+'</li>');
								if (list[i].mprice != undefined) {
								item.push('<li><em>费用</em>'+echoCurrency('symbol')+''+list[i].mprice+'/人</li>');
								}else{
									item.push('<li><em>费用</em>免费</li>');
								}
								item.push('<li><em>参与人数</em>'+list[i].reg+'人</li>');
								item.push('</ul><div class="txt_foot fn-clear">');
								if (nowStamp > list[i].end) {
								item.push('<span class="close">已结束</span>');
								}else{
								item.push('<a	href="'+list[i].url+'"><span>我要报名</span></a>');
								}
								item.push('<div class="share_box"><div class="bdsharebuttonbox" data-url="'+list[i].url+'"   data-title="'+list[i].title+'" data-litpic="'+list[i].litpic+'"><div class="Share_QQ Share"><a href="#"class="bds_sqq"data-cmd="sqq"title="分享到QQ好友"></a><i></i></div><div class="Share_weixin Share"><a href="#"class="bds_weixin"data-cmd="weixin"title="分享到微信"></a><i></i></div><div class="Share_weibo Share"><a href="#"class="bds_tsina"data-cmd="tsina"title="分享到新浪微博"></a><i></i></div></div></div></div></div></div>');



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
				window._bd_share_main.init();
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
				if ($("#HD_list" + id).html() == undefined) {
					page = 1;
					ajaxNews();
				}else{
					$("#HD_list" + id).show().siblings(".slide-box").hide();
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

	//绑定所有分享按钮所在A标签的鼠标移入事件，从而获取动态ID
	$("#HD_list").delegate(".bdsharebuttonbox", "hover", function(){
		Shareurl = $(this).attr("data-url");
		Sharelitpic = $(this).attr("data-litpic");
		Sharetitle = $(this).attr("data-title");
		window._bd_share_config.share.bdUrl= Shareurl;
		window._bd_share_config.share.bdText= Sharetitle;
		window._bd_share_config.share.bdPic= Sharelitpic;
	});

	// 百度分享
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"32"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];
})

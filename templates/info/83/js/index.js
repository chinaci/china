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

	//异步加载信息列表
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
			url: masterDomain+"/include/ajax.php?service=info&action=ilist&typeid=" + id + "&group_img=1&pageSize=10&page="+page,
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
							// baiduShare();

							var item = [],
								id = list[i].id,
								title = list[i].title,
								typeName = list[i].typeName,
								url = list[i].url,
								common = list[i].common,
								litpic = list[i].litpic,
								keywords = list[i].keywords,
								description = list[i].description,
								time = huoniao.transTimes(list[i].pubdate , 2);;

								item.push('<div class="EL_detail">');
								if (list[i].member.nickname != undefined) {
									item.push('<div class="infor fn-clear">');
									item.push('<div class="infor_left">');
									if (list[i].member.photo != undefined) {
										item.push('<div class="infor_img"><a target="_blank" href="'+masterDomain+'/info/store-'+list[i].member.id+'.html"><img src="'+list[i].member.photo+'"></a></div>');
									}
									item.push('<div class="name"><a target="_blank" href="'+masterDomain+'/info/store-'+list[i].member.id+'.html">'+list[i].member.nickname+'</a>');
									// item.push('<i class="VIP"></i><i class="diamond"></i>');
									item.push('</div>');
									item.push('<div class="form">来自 '+list[i].address+'</div>');
									item.push('</div>');
									// item.push('<div class="infor_right">');
									// item.push('￥<em>1350.00</em>');
									// item.push('</div>');
									item.push('</div>');
								}
								item.push('<div class="ELD_title"><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a>');
								// item.push('<i class="top"></i><i class="worry"></i><i class="new"></i>');
								item.push('</div>');
								item.push('<div class="ELD_tips fn-clear">');
								// item.push('<a href="#">防驼背</a><a href="#">防近视</a><a href="#">纠坐姿</a>');
								item.push('</div>');
								item.push('<div class="Summarize">'+list[i].desc+'</div>');
								// item.push('<div class="all">全文</div>');

								item.push('<div class="Tel">联系电话：<em>'+list[i].tel+'</em></div>');
								if (list[i].litpic != undefined) {
									item.push('<ul class="fn-clear">');
									item.push('<li data-litpic="'+list[i].litpic+'"><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].litpic+'" alt=""></a></li>');
									item.push('</ul>');
								}

								item.push('<div class="ELD_foot fn-clear">');
								item.push('<div class="EF_left">'+list[i].typename+' <em>·</em> 评论: '+list[i].common+' <em>·</em> '+time+' </div>');
								item.push('<div class="EF_right">');
								item.push('<div class="bdsharebuttonbox" data-url="'+list[i].url+'"   data-title="'+list[i].title+'" >');
								item.push('<div class="Share_QQ Share">');
								item.push('<a href="#" class="bds_sqq" data-cmd="sqq" title="分享到QQ好友"></a><i></i>');
								item.push('</div>');
								item.push('<div class="Share_weixin Share">');
								item.push('<a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a><i></i>');
								item.push('</div>');
								item.push('<div class="Share_weibo Share">');
								item.push('<a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><i></i>');
								item.push('</div>');
								item.push('</div>');
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
	// $(".more_list ul li a").bind("click", function(event){
	// 	event.preventDefault();
	// 	var t = $(this), id = t.attr("data-id"), url = t.attr("href"), txt = t.text(), parent = t.closest("span");
	// 	$('.pane .hd li:first').addClass('cur').siblings('li').removeClass('cur').removeClass('on');
	// 	parent.siblings("ul").find("li").removeClass("on").removeClass('NewsNav_bc');
	// 	parent
	// 		.addClass("on")
	// 		.find("a:eq(0)")
	// 			.attr("data-id", id)
	// 			.attr("href", url);

	// 	page = 1;
	// 	ajaxNews();
	// });


	  //绑定所有分享按钮所在A标签的鼠标移入事件，从而获取动态ID
		$("#EXhand_List").delegate(".bdsharebuttonbox", "hover", function(){
			Shareurl = $(this).attr("data-url");
			Sharelitpic = $(this).closest('.EL_detail').find('ul li').attr("data-litpic");
			Sharetitle = $(this).attr("data-title");
			window._bd_share_config.share.bdUrl= Shareurl;
			window._bd_share_config.share.bdText= Sharetitle;
			window._bd_share_config.share.bdPic= Sharelitpic;
		});

		// 百度分享
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":false,"bdStyle":"1","bdSize":"32"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];

})

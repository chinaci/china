$(function(){
	// 最新入驻商家自动轮播
	$(".carousel").slide({mainCell:".carousel_list ",effect:"topLoop",autoPlay:true,vis:3});

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


	//异步加载商家列表
	var page = 1, isload;
	var ajaxNews = function() {
		var id = $(".NewsNav .on a:eq(0)").attr("data-id"),
			href = $(".NewsNav .on a:eq(0)").attr("href");
		var objId = "BN_list" + id;
		if ($("#" + objId).html() == undefined) {
			$("#BN_list").append('<div id="' + objId + '" class="slide-box"></div>');
			// if (isload && $('.pane').hasClass('fixed')) {
			// 	$(window).scrollTop(paneHeight);
			// }
		}
		isload = true;

		$("#" + objId).find(".loading").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=business&action=blist&store=2&typeid=" + id + "&group_img=1&pageSize=10&page="+page,
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

								item.push('<div class="BN_detail fn-clear">');
								if (list[i].logo != "") {
								item.push('<div class="BN_pic"><a href="'+list[i].url+'"><img src="'+list[i].logo+'" alt=""></a></div>');
								}
								item.push('<div class="BN_title">');
								item.push('<a href="'+list[i].url+'">'+list[i].title+'</a></div>');
								item.push('<div class="evaluate"> ');
								// item.push('<div class="star"><i></i></div> ');
								// item.push('<em>'+list[i].comment+'人评论</em><em>人均: ￥'+list[i].amount+'</em>');
								item.push('</div>');
								item.push('<div class="tel">');
								if (list[i].tel != "") {
								item.push('<i></i><em>'+list[i].tel+'</em>');
								}
								item.push('</div>');
								item.push('<div class="detail_foot">');
								item.push('<div class="place"><em>'+list[i].typename[1]+'</em><span>|</span>'+list[i].addrname[0]+''+list[i].addrname[1]+'</div>');
								item.push('<div class="share_box"><div class="bdsharebuttonbox data-url="'+list[i].url+'"   data-title="'+list[i].title+'" data-litpic="'+list[i].logo+'""><div class="Share_QQ Share"><a href="#"class="bds_sqq"data-cmd="sqq"title="分享到QQ好友"></a><i></i></div><div class="Share_weixin Share"><a href="#"class="bds_weixin"data-cmd="weixin"title="分享到微信"></a><i></i></div><div class="Share_weibo Share"><a href="#"class="bds_tsina"data-cmd="tsina"title="分享到新浪微博"></a><i></i></div></div></div></div></div>');

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
				if ($("#BN_list" + id).html() == undefined) {
					page = 1;
					ajaxNews();
				}else{
					$("#BN_list" + id).show().siblings(".slide-box").hide();
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
	$("#BN_list").delegate(".bdsharebuttonbox", "hover", function(){
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

$(function(){
	$('.NewsNav ul li').click(function(){
		var x = $(this),
			index = x.index();
		x.addClass('NewsNav_bc').siblings().removeClass('NewsNav_bc');
		$('.job_list .job_tab').eq(index).show().siblings().hide();
	})

	//异步加载信息列表
	var page = 1;
	var post = function() {
		$(".post").find(".load-more").remove();
		$(".post").append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=job&action=post&pageSize=10&page="+page,
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
								html.push('<div class="Recommend_box">');
								html.push('<div class="RB_lead fn-clear">');
								html.push('<div class="RB_title"><a target="_blank" href=" '+list[i].url+'">'+list[i].title+'</a><i class="ding"></i><i class="ji"></i></div>');
								html.push('<div class="Rb_name"><a target="_blank" href="'+list[i].company['domain']+'">'+list[i].company['title']+'</a></div>');
								html.push('</div>');
								html.push('<div class="RB_detail fn-clear">');
								html.push('<div class="pay"><span>'+list[i].salary+'/月</span>'+list[i].addr[0]+'&nbsp;&nbsp;'+list[i].addr[1]+'<em>|</em>'+list[i].experience+'<em>|</em>'+list[i].educational+'</div>');
								html.push('<div class="scale">'+list[i].type+'<em>|</em>'+list[i].number+'人</div>');
								html.push('</div>');
								html.push('<div class="time">'+list[i].timeUpdate+'发布</div>');
								html.push('</div>');
						}
						$(".post").find(".loading").remove();
						$(".post").append(html.join(""));
						if (page < pageInfo.totalPage) {
							$(".post").append('<div class="load-more"><div class="load-add"><i></i><span>加载更多</span></div></div>');
						} else {
							$(".post").append('<span class="mnbtn">:-)已经到最后啦~</span>');
						}

					}
				} else {
					$(".post").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$(".post").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	// 点击加载更多
	$(".job_list .post").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page++;
		post();
	});


	var page1 = 1;
	var company = function() {
		$(".company").find(".load-more").remove();
		$(".company").append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=job&action=company&pageSize=10&page="+page1,
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
								html.push('<div class="job_detail fn-clear">');
								html.push('<div class="job_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].logo+'" alt="'+list[i].title+'"></a></div>');
								html.push('<div class="job_title"><a target="_blank" href="'+list[i].url+'">'+list[i].title+'</a><i class="ren"></i><i class="wai"></i></div>');
								html.push('<div class="job_tips"><em>五险一金</em><em>带薪年假</em><em>晋升空间大</em></div>');
								html.push('<div class="nature"><em>行业性质</em>  '+list[i].industry+' <em>规模</em>   '+list[i].scale+'</div>');
								html.push('<div class="job_location"><i></i> '+list[i].address+'</div>');
								html.push('<div class="In_recruit">');
								html.push('<p>在招职位</p>');
								html.push('<span>'+list[i].pcount+'</span>');
								html.push('</div>');
								html.push('</div>');
						}
						$(".company").find(".loading").remove();
						$(".company").append(html.join(""));
						if (page1 < pageInfo.totalPage) {
							$(".company").append('<div class="load-more"><div class="load-add"><i></i><span>加载更多</span></div></div>');
						} else {
							$(".company").append('<span class="mnbtn">:-)已经到最后啦~</span>');
						}

					}
				} else {
					$(".company").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$(".company").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	// 点击加载更多
	$(".job_list .company").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page1++;
		company();
	});

	var page2 = 1;
	var resume = function() {
		$(".resume").find(".load-more").remove();
		$(".resume").append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=job&action=resume&pageSize=10&page="+page2,
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
								html.push('<div class="Resume fn-clear">');
								html.push('<div class="Resume_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+list[i].photo+'" alt=""></a></div>');
								html.push('<div class="Resume_name"><a target="_blank" href="'+list[i].url+'">'+list[i].name+'</a><em>2017.6.30发布</em></div>');
								html.push('<div class="Resume_form">'+list[i].age+'岁 '+list[i].professional+'   '+list[i].workyear+'年工作经验   '+list[i].educational+' </div>');
								html.push('<div class="Resume_intention">求职意向：'+list[i].type+'</div>');
								html.push('<div class="Resume_btn"><a target="_blank" href="'+list[i].url+'" class="view">查看联系方式</a><a target="_blank" href="#" class="down_load">下载简历</a></div>');
								html.push('</div>');
						}
						$(".resume").find(".loading").remove();
						$(".resume").append(html.join(""));
						if (page2 < pageInfo.totalPage) {
							$(".resume").append('<div class="load-more"><div class="load-add"><i></i><span>加载更多</span></div></div>');
						} else {
							$(".resume").append('<span class="mnbtn">:-)已经到最后啦~</span>');
						}
					}
				} else {
					$(".resume").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$(".resume").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	// 点击加载更多
	$(".job_list .resume").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page2++;
		resume();
	});
})

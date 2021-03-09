$(function(){

	//信息分类导航
	$(".category-popup").hover(function(){
		$(this).find("li").show();
		$(this).find(".more").hide();
	}, function(){
		$(this).find("li").each(function(){
			var index = $(this).index();
			if(index > 4){
				$(this).hide();
			}
		});
		$(this).find(".more").show();
	});

	//slideshow_640_274
	$("#slideshow640274").cycle({ 
		fx: 'scrollHorz',
		speed: 300,
		next:	'#slidebtn640274_next', 
		prev:	'#slidebtn640274_prev',
		pause: true
	});

	$(".btn-app .scode").hover(function(){
		$(".btn-app .codepop").show();
	}, function(){
		$(".btn-app .codepop").hide();
	});

	//换一换
	$(".change").click(function(){
		var t = $(this), type = t.attr("data-type"), page = t.attr("data-page");
		var obj = t.parent().next(".hc").find("ul"), el = "", page = Number(page)+1;
		if(type == "new"){
			el = "&orderby=1&thumb=1&pageSize=16";
		}else if(type == "rec"){
			el = "&rec=1&thumb=1&pageSize=16";
		}else if(type == "hot"){
			el = "&order=2&pageSize=24";
			obj = t.parent().next(".hc").find(".hotnews");
		}
		$.ajax({
			url: "/include/ajax.php?service=info&action=ilist&page="+page+el,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state != 200){
					if(data.state == 101){
						obj.html("<p class='loading'>"+data.info+"</p>");
					}else{
						var list = data.info.list, html = [], d = 1;
						for(var i = 0; i < list.length; i++){
							var item        = [],
									id          = list[i].id,
									typename    = list[i].typename,
									title       = list[i].title,
									typeurl     = list[i].typeurl,
									url         = list[i].url,
									address     = list[i].address,
									litpic      = list[i].litpic;

							if(type == "hot"){

								if(d == 1){
									item.push('<dl>');
								}
								var cla = d < 4 ? ' class="t"' : '';
								item.push('<dd><i'+cla+'>'+d+'</i><a href="'+typeurl+'" class="type">['+typename+']</a><a href="'+url+'">'+title+'</a></dd>');
								if(d == 8){
									item.push('</dl>');
									d = 0;
								}
								d++;

							}else{
								item.push('<li>');
								item.push('<a href="'+url+'">');
								item.push('<img src="'+huoniao.changeFileSize(litpic, "small")+'">');
								item.push('<div class="info">');
								item.push('<p>'+title+'</p>');
								item.push('<p><span class="addr">'+address+'</span></p>');
								item.push('<span class="bg"></span>');
								item.push('</div>');
								item.push('</a>');
								item.push('</li>');
							}

							html.push(item.join(""));
						}
						obj.html(html.join(""));

						if(data.info.pageInfo.totalPage <= page+1){
							page = 0;
						}
						t.attr("data-page", page);
					}
				}else{
					obj.html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function(){
				obj.html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});
	});

	/* 使用js分组，每7个li放到一个ul里面 */
	$(".business li").each(function(i){ $(".business li").slice(i*14,i*14+14).wrapAll("<ul></ul>");});

	/* 调用SuperSlide，每次滚动一个ul，相当于每次滚动6个li */
	$(".business").slide({mainCell:".slide",effect:"leftLoop",autoPlay:true});

	// 分类TAB
	$(".type-tab li").hover(function(){
		var t = $(this), index = t.index();
		t.addClass("active").siblings("li").removeClass("active");
		$(".type-con ul").hide();
		$(".type-con ul:eq("+index+")").show();
	});

});
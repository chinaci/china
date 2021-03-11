$(function(){

	$("img").scrollLoading();

	//导航全部分类
	$(".lnav").hover(function(){
		$(this).find(".category-popup").show();
	}, function(){
		$(this).find(".category-popup").hide();
	});

	//slideshow
	$("#slideshow").find("script").remove();
	$("#slideshow").cycle({ 
		speed: 300,
		pager:	'#slidebtn',
		next:	'#slidebtn_next',
		prev:	'#slidebtn_prev',
		pause: true
	});

	//初始加载设置页码
	if(totalPage > 0){
		showPageInfo();
	}

	//选择区域
	$(".chooaddr").bind("click", function(){
		$(".addrpop").show();
		return false;
	});

	$(".addrpop a").bind("click", function(){
		var t = $(this), txt = t.text(), id = t.data('id');
		$(".chooaddr").attr("data-id", id).html(txt+"<s></s>");
		atpage = 1;
		getTuanData();
		$(".addrpop").hide();
		return false;
	});

	$(window).bind("click", function(){
		$(".addrpop").hide();
	});

	//筛选
	$(".flags label").bind("click", function(){
		var t = $(this);
		t.hasClass("curr") ? t.removeClass("curr") : t.addClass("curr");
		atpage = 1;
		getTuanData();
	});

	//数据筛选导航
	var win = $(window), modList = $("#mod-list"), fixnav = modList.find(".fixnav"), filterbg = modList.find(".filterbg"), sldown = null;
	modList.css("padding-top", fixnav.height());
	$(window).scroll(function() {
		var stop = win.scrollTop();
		stop > modList.offset().top && stop < modList.offset().top + modList.height() - 400 ? fixnav.addClass("fixed") : fixnav.removeClass("fixed");
	});

	$(window).resize(function(){
		modList.css("padding-top", fixnav.height());
	});

	
	//获取团购数据
	function getTuanData(type){
		var filterObj = $(".mod-filter"),
				addrid  = $(".chooaddr").attr("data-id"),
				orderby = filterObj.find(".sort .on").parent().attr("class").replace("sort-", "");

		if(type != 1){
			$('html, body').animate({scrollTop: modList.offset().top}, 0);
		}

		var flag = [];
		$(".flags label").each(function(){
			var t = $(this);
			t.hasClass("curr") ? flag.push(t.data("val")) : "";
		});

		$("#mod-item .loading").html("加载中，请稍候...").show();
		$.ajax({
			url: "/include/ajax.php?service=tuan&action=tlist&filter=today&pageSize="+pageSize+"&orderby="+orderby+"&addrid="+addrid+"&flag="+flag.join(",")+"&page="+atpage,
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
						html.push('<div class="prompt"><span class="sold-num"><em>'+list[i].sale+'</em> 件已售</span></div>');
						html.push('<div class="link">马上抢</div>');
						html.push('</div>');
						html.push('</a>');
						html.push('</li>');
					}
					$("#mod-item ul").html(html.join(""));

					// atpage++;
					totalCount = pageinfo.totalCount;

					showPageInfo();
					$("img").scrollLoading();

				}else{
					$("#mod-item ul").empty();
					$("#mod-item .loading").html("暂无相关数据！").show();
					$("#mod-item .pagination").html("").hide();

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
	// getTuanData(1);

	$(".mod-filter li a").click(function(){
		var t = $(this);
		if(!t.hasClass("on")){
			t.closest("ul").find("li a").removeClass("on");
			t.addClass("on");
			
			atpage = 1;
			$('html, body').animate({scrollTop: $("#mod-item").offset().top - 84}, 100);
			getTuanData();
		}
	});

	//翻页
	$(".mod-filter .pagination").delegate("a", "click", function(){
		var cla = $(this).attr("class");
		if(cla == "pg-prev"){
			atpage -= 1;
		}else{
			atpage += 1;
		}
		getTuanData();
	});

	//打印分页
	function showPageInfo() {
		var info = $("#mod-item .pagination");
		var nowPageNum = atpage;
		var allPageNum = Math.ceil(totalCount/pageSize);
		var pageArr = [];

		info.html("").hide();

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




		var pages = document.createElement("div");
		pages.className = "pagination-pages fn-clear";
		info.append(pages);
		
		//拼接所有分页
		if (allPageNum > 1) {

			//上一页
			if (nowPageNum > 1) {
				var prev = document.createElement("a");
				prev.className = "prev";
				prev.innerHTML = '上一页';
				prev.onclick = function () {
					atpage = nowPageNum - 1;
					getTuanData();
				}
				info.find(".pagination-pages").append(prev);
			}

			//分页列表
			if (allPageNum - 2 < 1) {
				for (var i = 1; i <= allPageNum; i++) {
					if (nowPageNum == i) {
						var page = document.createElement("span");
						page.className = "curr";
						page.innerHTML = i;
					} else {
						var page = document.createElement("a");
						page.innerHTML = i;
						page.onclick = function () {
							atpage = Number($(this).text());
							getTuanData();
						}
					}
					info.find(".pagination-pages").append(page);
				}
			} else {
				for (var i = 1; i <= 2; i++) {
					if (nowPageNum == i) {
						var page = document.createElement("span");
						page.className = "curr";
						page.innerHTML = i;
					}
					else {
						var page = document.createElement("a");
						page.innerHTML = i;
						page.onclick = function () {
							atpage = Number($(this).text());
							getTuanData();
						}
					}
					info.find(".pagination-pages").append(page);
				}
				var addNum = nowPageNum - 4;
				if (addNum > 0) {
					var em = document.createElement("span");
					em.className = "interim";
					em.innerHTML = "...";
					info.find(".pagination-pages").append(em);
				}
				for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
					if (i > allPageNum) {
						break;
					}
					else {
						if (i <= 2) {
							continue;
						}
						else {
							if (nowPageNum == i) {
								var page = document.createElement("span");
								page.className = "curr";
								page.innerHTML = i;
							}
							else {
								var page = document.createElement("a");
								page.innerHTML = i;
								page.onclick = function () {
									atpage = Number($(this).text());
									getTuanData();
								}
							}
							info.find(".pagination-pages").append(page);
						}
					}
				}
				var addNum = nowPageNum + 2;
				if (addNum < allPageNum - 1) {
					var em = document.createElement("span");
					em.className = "interim";
					em.innerHTML = "...";
					info.find(".pagination-pages").append(em);
				}
				for (var i = allPageNum - 1; i <= allPageNum; i++) {
					if (i <= nowPageNum + 1) {
						continue;
					}
					else {
						var page = document.createElement("a");
						page.innerHTML = i;
						page.onclick = function () {
							atpage = Number($(this).text());
							getTuanData();
						}
						info.find(".pagination-pages").append(page);			
					}
				}
			}

			//下一页
			if (nowPageNum < allPageNum) {
				var next = document.createElement("a");
				next.className = "next";
				next.innerHTML = '下一页';
				next.onclick = function () {
					atpage = nowPageNum + 1;
					getTuanData();
				}
				info.find(".pagination-pages").append(next);
			}

			//输入跳转
			var insertNum = Number(nowPageNum + 1);
			if (insertNum >= Number(allPageNum)) {
				insertNum = Number(allPageNum);
			}
			
			var redirect = document.createElement("div");
			redirect.className = "redirect";
			redirect.innerHTML = '<i>到</i><input id="prependedInput" type="number" placeholder="页码" min="1" max="'+allPageNum+'" maxlength="4"><i>页</i><button type="button" id="pageSubmit">确定</button>';
			info.find(".pagination-pages").append(redirect);

			//分页跳转
			info.find("#pageSubmit").bind("click", function(){
				var pageNum = $("#prependedInput").val();
				if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
					atpage = Number(pageNum);
					getTuanData();
				} else {
					$("#prependedInput").focus();
				}
			});
						
			info.show();

		}else{			
			info.hide();
		}
	}

});
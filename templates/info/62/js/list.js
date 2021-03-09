$(function(){

	$("img").scrollLoading();

	//折叠筛选
	$(".switch").bind("click", function(){
		$(this).hasClass("curr") ? $(this).removeClass("curr") : $(this).addClass("curr");
		$(".filter").stop().slideToggle(200);
	});

	//筛选
	$(".filter").delegate("a", "click", function(){
		if($(this).closest("dl").attr("id") != "fnav"){
			$(this).addClass("curr").siblings("a").removeClass("curr");
			atpage = 1;
			getList();
		}
	});

	// 删除关键字
	$('.filter-item .close').click(function(){
		keyword = "";
		$(this).parent('.filter-item').remove();
		getList(1);
	})


	//二级分类交互
	$("#subnav dd>a, #addr dd>a").bind("click", function(){
		var t = $(this), id = t.attr("data-id"), type = t.closest("dl").attr("id");

		if(type == "subnav") typeid = id;
		if(type == "addr") addrid = id;
		if(id == 0 || $("#"+type+id).size() == 0){
			$("#"+type).find(".subnav").hide();
		}else{
			$("#"+type).find(".subnav").show()
			$("#"+type).find(".subnav div").hide();
			$("#"+type+id).show();
			$("#"+type+id).find("a").removeClass("curr");
			$("#"+type+id).find("a:eq(0)").addClass("curr");
		}
	});

	$(".subnav").delegate("a", "click", function(){
		var t = $(this), id = t.attr("data-id"), type = t.closest("dl").attr("id");

		if(type == "subnav") typeid = id;
		if(type == "addr") addrid = id;
	});

	//根据二级分类获取字段
	$("#subnav a").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(id != 0){
			$.ajax({
				url: "/include/ajax.php?service=info&action=typeDetail&id="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var item = data.info[0].item, html = [];

						if(item != undefined && item.length > 0){

							for(var i = 0; i < item.length; i++){
								if(item[i].formtype != "text"){
									html.push('<dl class="item fn-clear" data-name="'+item[i].field+'" data-id="'+item[i].id+'">');
									html.push('<dt>'+item[i].title+'：</dt>');
									html.push('<dd>');
									html.push('<a href="javascript:;" data-id="0" class="curr">不限</a>');
									for(var b = 0; b < item[i].options.length; b++){
										html.push('<a href="javascript:;" data-id="'+item[i].options[b]+'">'+item[i].options[b]+'</a>')
									}
									html.push('</dd>');
									html.push('</dl>');
								}
							}

						}

						$("#itemOptions").html(html.join(""));

					}
				}
			});
		}
	});

	//更多选项
	$(".more a").bind("click", function(){
		var t = $(this), par = t.parent();
		if(par.hasClass("curr")){
			t.html("更多选项<i></i>");
			par.removeClass("curr");
			$(".filter .m").hide(200);
		}else{
			t.html("收起<i></i>");
			par.addClass("curr");
			$(".filter .m").show(200);
		}
	});

	//性质切换
	$(".sortbar .tabs li").bind("click", function(){
		var t = $(this);
		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
			atpage = 1;
			getList();
		}
	});

	//排序筛选
	$(".sort li a").bind("click", function(){
		var t = $(this), par = t.parent();

		//排序
		if(par.hasClass("st")){

			//价格特殊情况
			if(par.hasClass("price")){
				if(par.hasClass("curr")){
					var icla = t.find("i");
					icla.attr("class") == "arrow-b" || icla.attr("class") == "" ? (icla.removeClass().addClass("arrow-t"), par.attr("data-sort", 3)) : (icla.removeClass().addClass("arrow-b"), par.attr("data-sort", 2));
				}
			}
			par.addClass("curr").siblings(".st").removeClass("curr");

		//筛选
		}else{
			par.hasClass("curr") ? par.removeClass("curr") : par.addClass("curr");
		}
		atpage = 1;
		getList();
	});

	var infoListType = $.cookie("infoListType");
	if(infoListType == 0){
		$(".main").show();
		$(".bmain").hide();
		$(".rowlist").addClass("curr");
		$(".window").removeClass("curr");
	}else{
		$(".main").hide();
		$(".bmain").show();
		$(".rowlist").removeClass("curr");
		$(".window").addClass("curr");
	}

	//大图、列表切换
	$(".window").bind("click", function(){
		$(this).addClass("curr");
		$(".rowlist").removeClass("curr");
		$(".main").hide();
		$(".bmain").show();
		var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));  //设置过期时间为7天
		$.cookie("infoListType", 1, {expires: date});
	});
	$(".rowlist").bind("click", function(){
		$(this).addClass("curr");
		$(".window").removeClass("curr");
		$(".bmain").hide();
		$(".main").show();
		var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));  //设置过期时间为7天
		$.cookie("infoListType", 0, {expires: date});
	});

	//头部分页
	$(".views .tpage a").bind("click", function(){
		var t = $(this);
		if(!t.hasClass("diabled")){
			//上一页
			if(t.hasClass("prev")){
				atpage = Number(atpage) - 1;

			//下一页
			}else{
				atpage = Number(atpage) + 1;
			}
			getList();

		}
	});

	//收藏
	$(".main, .bmain").delegate(".fov", "click", function(){
		var t = $(this), id = t.closest(".item").attr("data-id"), type = "add", oper = "+1", txt = "已收藏";

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(!t.hasClass("curr")){
			t.addClass("curr");
		}else{
			type = "del";
			t.removeClass("curr");
			oper = "-1";
			txt = "收藏";
		}

		var $i = $("<b>").text(oper);
		var x = t.offset().left, y = t.offset().top;
		$i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#E94F06"});
		$("body").append($i);
		$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
			$i.remove();
		});

		t.html("<i></i>"+txt);

		$.post("/include/ajax.php?service=member&action=collect&module=info&temp=detail&type="+type+"&id="+id);

	});



	//初始加载
	getList(1);

	function getList(is){

		if(is != 1){
			$('html, body').animate({scrollTop: $(".crumbs").offset().top}, 300);
		}

		//获取字段
		var item = [];
		$(".filter .item").each(function(index){
			var t = $(this), id = t.attr("data-id"), value = t.find(".curr").attr("data-id");
			if(value != 0){
				item[index] = {
					"id": id,
					"value": value
				};
			}
		});
		//有效期
		var valid = $("#valid .curr").attr("data-id");
		//信息性质
		var nature = $(".sortbar .tabs .curr").attr("data-id");
		//排序
		var orderby = $(".st.curr").attr("data-sort");
		//只看有图
		var pic = $(".sort .pic").hasClass("curr") ? 1 : 0;
		//只看推荐
		var rec = $(".sort .rec").hasClass("curr") ? 1 : 0;
		//只看火急
		var fire = $(".sort .fire").hasClass("curr") ? 1 : 0;
		//只看置顶
		// var top = $(".sort .top1").hasClass("curr") ? 1 : 0;

		$(".main").html("");
		$(".failed").hide();
		$(".loading").show();

		$.ajax({
			type: "POST",
			traditional: true,
			url: "/include/ajax.php?service=info&action=ilist",
			data: {
				"typeid": typeid,
				"addrid": addrid,
				"item": JSON.stringify(item),
				//"valid": valid,
				"nature": nature,
				"orderby": orderby,
				"thumb": pic,
				"rec": rec,
				"fire": fire,
				"top": top,
				"page": atpage,
				"pageSize": pageSize,
				"title": keyword,
			},
			dataType: "json",
			success: function (data) {

				$(".loading").hide();

				if(data && data.state == 100){

					//列表
					var html = [], bhtml = [], list = data.info.list, pageInfo = data.info.pageInfo;
					$("#totalCount").html(pageInfo.totalCount);
					totalCount = pageInfo.totalCount;
					var tpage = Math.ceil(totalCount/pageSize);
					$(".views .tpage .atpage").html("<strong>"+atpage+"</strong>/"+tpage);

					var prev = $(".views .tpage .prev"), next = $(".views .tpage .next");
					if(atpage == 1){
						prev.addClass("diabled");
					}else{
						prev.removeClass("diabled");
					}

					if(tpage > 0 && atpage < tpage){
						next.removeClass("diabled");
					}else{
						next.addClass("diabled");
					}


					for(var i = 0; i < list.length; i++){
						html.push('<div class="item" data-id="'+list[i].id+'">');

						var video = '';
						if(list[i].video){
							video = '<em></em>';
						}

						var litpic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";

						html.push('<div class="pic"><a href="'+list[i].url+'" target="_blank" title="'+list[i].title+'"><i></i><img src="'+cfg_staticPath+'images/blank.gif" data-url="'+litpic+'" alt="'+list[i].title+'" />'+video+'</a></div>');
						html.push('<div class="right">');
						// html.push('<div class="tel"><s></s>'+list[i].tel+(list[i].teladdr != "" ? '<br /><span>归属地：'+list[i].teladdr+'</span>' : "")+'</div>');
						if (list[i].price == 0) {
							html.push('<div class="tel">面议</div>');
						}else{
							html.push('<div class="tel">'+echoCurrency('symbol')+''+list[i].price+'</div>');
						}
						var pubdate = huoniao.transTimes(list[i].pubdate, 3);
						html.push('<span class="date">'+pubdate.replace("-", "月")+'日</span>');
						html.push('</div>');
						html.push('<div class="info">');

						var arr = [];
						if(list[i].isbid == 1){
							arr.push('<i class="zd">置顶<s></s></i>');
						}
						if(list[i].fire == 1){
							arr.push('<i class="hj">火急<s></s></i>');
						}
						if(list[i].top == 1){
							// arr.push('<i class="zd">置顶<s></s></i>');
						}
						if(list[i].rec == 1){
							arr.push('<i class="rc">推荐<s></s></i>');
						}
						if(list[i].pcount > 0){
							arr.push('<i class="dt">'+list[i].pcount+'图<s></s></i>');
						}

						html.push('<h3><a href="'+list[i].url+'" target="_blank" title="'+list[i].title+'"><font color="'+list[i].color+'">'+list[i].title+'</font></a>'+arr.join("")+'</h3>');
						html.push('<p class="desc">'+list[i].desc+'</p>');
						html.push('<p class="type"><a href="'+list[i].typeurl+'">'+list[i].typename+'</a></p>');
						html.push('<p class="addr">'+list[i].address+'</p>');
						html.push('<div class="user">');

						var member = list[i].member;
						var photo = member.photo != "" && member.photo != undefined ? huoniao.changeFileSize(member.photo, "small") : "/static/images/noPhoto_40.jpg";
						var license = [];
						if(member.userType == 1 && member.certifyState == 1){
							license.push('<i class="per" title="已通过个人实名认证"></i>');
						}
						if(member.userType == 2 && member.licenseState == 1){
							license.push('<i class="com" title="已通过企业认证"></i>');
						}
						if(member.phoneCheck == 1){
							license.push('<i class="mob" title="已通过手机认证"></i>');
						}
						if(member.emailCheck == 1){
							license.push('<i class="ema" title="已通过邮件认证"></i>');
						}

						if(member.nickname != null){
							html.push('<a href="'+masterDomain+'/user/'+member.id+'#info" target="_blank" class="upic"><img src="'+cfg_staticPath+'images/blank.gif" data-url="'+photo+'" alt="'+member.nickname+'" />'+member.nickname+'</a>');
							html.push(license.join(""));
							html.push('<a href="'+masterDomain+'/user/'+member.id+'#info" target="_blank" class="count">共发贴（<strong>'+list[i].fabuCount+'</strong>）条</a>');
						}

						var collect = list[i].collect == 1 ? " curr" : "", txt = list[i].collect == 1 ? "已" : "";
						html.push('<a href="javascript:;" class="fov'+collect+'"><i></i>'+txt+'收藏</a>');
						html.push('</div>');
						html.push('</div>');
						html.push('</div>');


						bhtml.push('<li>');
						bhtml.push('<div class="item" data-id="'+list[i].id+'">');
						bhtml.push('<div class="tags">'+arr.join("")+'</div>');
						bhtml.push('<div class="pic"><a href="'+list[i].url+'" target="_blank" title="'+list[i].title+'"><s></s><img src="'+cfg_staticPath+'images/blank.gif" data-url="'+litpic+'" alt="'+list[i].title+'" />'+video+'</a></div>');
						bhtml.push('<h3><a href="'+list[i].url+'" target="_blank">'+list[i].title+'</a></h3>');
						bhtml.push('<div class="pf">');
						if(list[i].price == 0){
							bhtml.push('<a href="javascript:;" class="price">面议</a>');
						}else{
							bhtml.push('<a href="javascript:;" class="price">'+echoCurrency('symbol')+''+list[i].price+'</a>');
						}
						bhtml.push('<strong class="addr">'+list[i].address+'</strong>');
						bhtml.push('</div>');
						bhtml.push('</div>');
						bhtml.push('</li>');
					}

					$(".main").html(html.join(""));
					$(".bmain").html('<ul class="fn-clear">'+bhtml.join("")+'</ul>');

					$("img").scrollLoading();
					showPageInfo();

				}else{
					$(".main").html("");
					$(".bmain").html("");
					$(".pagination").hide();

					$("#totalCount").html(0);

					$(".views .tpage .atpage").html("<strong>0</strong>/0");
					$(".views .tpage .prev").addClass("diabled");
					$(".views .tpage .next").addClass("diabled");

					$(".failed").show().find("span").html(data.info);
				}

			},
			error: function(){
				$(".main").html("");
				$(".bmain").html("");
				$(".pagination, .loading").hide();

				$("#totalCount").html(0);

				$(".views .tpage .atpage").html("<strong>0</strong>/0");
				$(".views .tpage .prev").addClass("diabled");
				$(".views .tpage .next").addClass("diabled");

				$(".failed").show().find("span").html("网络错误，请重试！");
			}
		});

	}


	//打印分页
	function showPageInfo() {
		var info = $(".pagination");
		var nowPageNum = atpage;
		var allPageNum = Math.ceil(totalCount/pageSize);
		var pageArr = [];

		info.html("").hide();

		//输入跳转
		var redirect = document.createElement("div");
		redirect.className = "pagination-gotopage";
		redirect.innerHTML = '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
		info.append(redirect);

		//分页跳转
		info.find(".btn").bind("click", function(){
			var pageNum = info.find(".inp").val();
			if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
				atpage = pageNum;
				getList();
			} else {
				info.find(".inp").focus();
			}
		});

		var pages = document.createElement("div");
		pages.className = "pagination-pages";
		info.append(pages);

		//拼接所有分页
		if (allPageNum > 1) {

			//上一页
			if (nowPageNum > 1) {
				var prev = document.createElement("a");
				prev.className = "prev";
				prev.innerHTML = '<i></i>';
				prev.onclick = function () {
					atpage = nowPageNum - 1;
					getList();
				}
			} else {
				var prev = document.createElement("span");
				prev.className = "prev disabled";
				prev.innerHTML = '<i></i>';
			}
			info.find(".pagination-pages").append(prev);

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
							getList();
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
							getList();
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
									getList();
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
							getList();
						}
						info.find(".pagination-pages").append(page);
					}
				}
			}

			//下一页
			if (nowPageNum < allPageNum) {
				var next = document.createElement("a");
				next.className = "next";
				next.innerHTML = '下一页<i></i>';
				next.onclick = function () {
					atpage = nowPageNum + 1;
					getList();
				}
			} else {
				var next = document.createElement("span");
				next.className = "next disabled";
				next.innerHTML = '下一页<i></i>';
			}
			info.find(".pagination-pages").append(next);

			info.show();

		}else{
			info.hide();
		}
	}

});

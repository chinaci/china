var initRightNavMenu = function(){
	$(".default-nav li").rightMenu({
		func: function() {
			var t = $(this);
			!t.hasClass("cur") ? t.click() : "";
			rightNavMenu(t);
		}
	});
};

var hasNewVersion = 0;

$(function(){
	initRightNavMenu();

	//移动端增加标识
	if(isMobile()){
		var bodyEle = document.getElementsByTagName('html')[0];
    	bodyEle.className += " huoniao_mobile";
	}

	//设置主体内容高度
	fBodyHeight();

	//onresize事件
	$(window).resize(function () {
		fBodyHeight();
		$("#module").css({"height": $(".sub-top").height() + $("#modelList").height() + ($("#modelInfo").is(":visible") ? $("#modelInfo").height() : 0) + 10});
	});

	//导航菜单
	openSnSort();

	// 版本号
	$.ajax({
	    url: 'index_body.php?',
	    data: 'dopost=checkUpdate',
	    type: "GET",
	    dataType: "json",
	    success: function (data) {
	        if(data && data.state == 100){
				if(huoniaoOfficial){
					var d = data.info.split('，');
					$('.version_show h2').html(d[0].split('：')[1])
		            $('.version_show p').html(d[1].split(' ')[0]);
					$('.version_show').css('display','block');
					hasNewVersion = 1;
				}
	        }
	    }
	});

	// 版本号隐藏
	$('.close_btn').click(function(){
		var t = $(this);
		var p = t.parents('.version_show');
		p.animate({'right':'-270px'},200)
	});

	// 版本号展开 open_version
	$('.open_version').click(function(){
		var t = $(this);
		var p = t.parents('.version_show');
		p.animate({'right':'16px'},200)
	});

	//检查最新版本
	$("#indexUpdate").bind("click", function(event){
	 var href = $(this).attr("data-href");
	 try {
	 	event.preventDefault();
	 	$(".h-nav a").each(function(index, element) {
	     if($(this).attr("href") == href){
	 			$(this).click();
	 		}
	 	});
	 } catch(e) {}
	});

	//点击预览后隐藏菜单
	$(".preview").delegate(".sub-nav a", "click", function(){
		$(this).closest(".sub-nav").hide();
	});

	//模块切换
	$("#tab li").bind("click", function(){
		if(!$(this).hasClass("selected")){
			var index = $(this).index();
			$(this).siblings("li").removeClass("selected");
			$(this).addClass("selected");

			$("#modelList ul").hide();
			$("#modelInfo").hide();
			$("#modelList ul:eq("+index+")").show();
			var model = $("#modelList ul:eq("+index+")").find(".cur");

			if(model.html() != undefined){
				var id = model.attr("data-id"), title = model.text();
				$("#modelInfo div").hide();
				$("#modelInfo").find("#"+id).show();
				$("#modelInfo").show();
				$("#module").css({"height": $(".sub-top").height() + $("#modelList").height() + ($("#modelInfo").is(":visible") ? $("#modelInfo").height() : 0) + 10});
			}else{
				$("#module").css({"height": $(".sub-top").height() + $("#modelList").height() + 10});
			}
		}
	});

	//栏目切换
	$("#modelList li").bind("click", function(){
		if(!$(this).hasClass("cur")){
			var id = $(this).attr("data-id"), title = $(this).text();
			$(this).siblings("li").removeClass("cur");
			$(this).addClass("cur");

			$("#modelInfo div").hide();

			$("#modelInfo").find("#"+id).find("dt span").removeClass("cur");
			$("#modelInfo").find("#"+id).find("dd").hide();

			$("#modelInfo").find("#"+id).find("dt span:eq(0)").addClass("cur");
			$("#modelInfo").find("#"+id).find("dd:eq(0)").show();
			$("#modelInfo").find("#"+id).show();
			$("#modelInfo").stop(true, true).show();
			$("#module").css({"height": $(".sub-top").height() + $("#modelList").height() + ($("#modelInfo").is(":visible") ? $("#modelInfo").height() : 0) + 10});
		}else{
			$(this).removeClass("cur");
			$("#modelInfo").stop(true, true).hide();
			$("#module").css({"height": $(".sub-top").height() + $("#modelList").height() + 10});
		}
	});

	//三级分类切换
	$(".model-info dt span").bind("click", function(){
		if(!$(this).hasClass("cur")){
			var index = $(this).index();
			$(this).siblings("span").removeClass("cur");
			$(this).addClass("cur");

			$(this).parent().siblings("dd").hide();
			$(this).parent().siblings("dd:eq("+index+")").show();
		}
	});

	//确认导航分类切换
	$("#welcome").delegate("dt span", "click", function(){
		if(!$(this).hasClass("cur")){
			var index = $(this).index();
			$(this).siblings("span").removeClass("cur");
			$(this).addClass("cur");

			$(this).parent().siblings("dd").hide();
			$(this).parent().siblings("dd:eq("+index+")").show();
		}
	});

	//编辑模块
	$("#editModelList").bind("click", function(){
		$("#siteConfig a").each(function(){
			if($(this).attr("href").indexOf("moduleList") > -1){
				$(this).click();
			}
		});
	});
	//编辑模块
	//$("#editModelList").bind("click", function(){
//		if($(this).parent().hasClass("red")){
//
//			//保存模块排序
//			var modelList = '{"modelList":[', tab = $("#tab");
//			for(var i = 0; i < tab.find("li").length; i++){
//				//一级分类
//				modelList += '{"modelType": "'+tab.find("li:eq("+i+")").text()+'", "modelList":[';
//
//				//二级分类
//				var modelListModel = $("#modelList");
//				var modelListItem = modelListModel.find("ul:eq("+i+")");
//				for(var k = 0; k < modelListItem.find("li").length; k++){
//					var li = modelListItem.find("li:eq("+k+")");
//					modelList += '{"typeId":"'+li.attr("data-id")+'", "typeName": "'+li.text()+'", "typeIcon": "'+li.find("s img").attr("src")+'", "typeList":[';
//
//					//三级分类
//					var obj = $("#"+li.attr("data-id"));
//					for(var j = 0; j < obj.find("dt span").length; j++){
//						modelList += '{"itemName": "'+obj.find("dt span:eq("+j+")").text()+'", "itemList":[';
//
//						//四级分类
//						for(var l = 0; l < obj.find("dd:eq("+j+") a").length; l++){
//							var a = obj.find("dd:eq("+j+") a:eq("+l+")");
//							modelList += '{"listName": "'+a.text()+'", "listUrl": "'+a.attr("href")+'"},';
//						}
//						modelList = modelList.substr(0, modelList.length-1);
//
//						modelList += ']},';
//
//					}
//					modelList = modelList.substr(0, modelList.length-1);
//
//					modelList += ']},';
//				}
//				modelList = modelList.substr(0, modelList.length-1);
//
//				modelList += ']},';
//			}
//			modelList = modelList.substr(0, modelList.length-1) + "]}";
//
//			$.ajax({
//				url: "index.php?action=updateNavSort",
//				data: "modelList="+encodeURIComponent(modelList),
//				type: "POST",
//				dataType: "json",
//				error: function(){
//					//alert("保存失败，请重试！");
//				}
//			});
//
//			$(this).html("编辑模块");
//			$(this).parent().removeClass("red").addClass("selected");
//			$("#modelList").removeClass("edit");
//			$("#modelList ul").dragsort("destroy");
//		}else{
//			$(this).html("完成保存");
//			$("#modelList").addClass("edit");
//			$(this).parent().removeClass("selected").addClass("red");
//			$("#modelList ul").dragsort({ dragSelector: "li", dragSelectorExclude: '', placeHolderTemplate: '<li class="placeHolder"></li>' });
//		}
//	});

	//导航链接事件
	$(".h-nav").delegate("a", "click", function(event){
		event.preventDefault();
		var href = $(this).attr("href"),
			id = $(this).attr("data-id"),
			title = $(this).text(),
			parent = $(this).parent().parent().parent(),
			parentId = parent.attr("id"),
			parentHtml = parent.html();

		if(href == "javascript:;") return false;

		if(id == undefined){
			id = $(this).attr("href").split("/"),
			//id = id[1].split(".")[0];
			id = id[1].replace(/\./g, "").replace(/\=/g, "").replace(/\?/g, "").replace(/\&/g, "").replace('notice1', '');
		}

		//商店
		if(id == "store"){
			parentId = "store";
			$("#body .options").hide();
		}else{
			$("#body .options").show();
		}

		//插件
		if(id == "plugins"){
			parentId = "plugins";
			// $("#body .options").hide();
		}else{
			// $("#body .options").show();
		}

		if(href != "" && id != undefined){

			if(id != "store" && id != "plugins"){
				if($("#welcome-"+parentId).html() == undefined){
					//欢迎信息处增加栏目信息
					$("#welcome div").hide();
					$("<div>")
						.attr("class", "welcome-nav")
						.attr("id", "welcome-"+parentId)
						.html(parentHtml)
						.appendTo($("#welcome"));
				}else{
					$("#welcome div").hide();
					$("#welcome-"+parentId).show();
				}
			}

			if($("#nav-"+id).html() == undefined){
				//标签导航处增加栏目信息
				var cur = $(".navul li.cur").index();
				$(".default-nav li").removeClass("cur");
				if(cur > -1){
					$(".navul li:eq("+cur+")").after("<li class='navli cur' id='nav-"+id+"' data-type='"+parentId+"' title="+title+"><b></b><label>"+title+"<s title=\"点击关闭标签\">&times;</s></label></li>");
				}else{
					$(".navul ul").append("<li class='navli cur' id='nav-"+id+"' data-type='"+parentId+"' title="+title+"><b></b><label>"+title+"<s title=\"点击关闭标签\">&times;</s></label></li>");
				}
				initRightNavMenu();
			}else{
				$(".default-nav li").removeClass("cur");
				$("#nav-"+id).addClass("cur");
			}

			if($("#body-"+id).html() == undefined){
				//内容区增加栏目iframe
				$("#body iframe").hide();
				$("#body").append('<iframe id="body-'+id+'" name="body-'+id+'" frameborder="0" src="'+href+'"></iframe>');
			}else{
				$("#body iframe").hide();
				$("#body-"+id).show();
			}

			if(id == "store" || id == "plugins"){
				$("#welcome .on").removeClass("on");
				fBodyHeight();
			}else{
				$("#welcome-"+parentId).find("a").removeClass("on");
				$("#welcome-"+parentId).find("a").each(function() {

					var id_ = $(this).attr("href").split("/"),
					//id_ = id_[1].split(".")[0];
					id_ = id_[1].replace(/\./g, "").replace(/\=/g, "").replace(/\?/g, "").replace(/\&/g, "").replace('notice1', '');

					if(id_ == id){
						$(this).click();
					}
				});

				fBodyHeight();
				$(".sub-nav").hide();

			}
		};
	});

	//欢迎信息处链接事件
	$("#welcome").delegate("a", "click", function(event){
		event.preventDefault();

		var id = $(this).attr("id");
		if(id == "editPass"){
			var href = $(this).attr("href");
			try {
				addPage("adminEdit", "index", "修改密码", href);
			} catch(e) {
				location.href = href;
			}
			return false;
		}else if(id == "adminLogin"){
			var href = $(this).attr("href");
			try {
				addPage("adminLogin", "index", "登录记录", href);
			} catch(e) {
				location.href = href;
			}
			return false;
		}

		var href = $(this).attr("href"),
			id = href.split("/"),
			title = $(this).text(),
			parentId = $(this).parent().parent().parent().attr("id");

		//id = id[1].split(".")[0];
		id = id[1].replace(/\./g, "").replace(/\=/g, "").replace(/\?/g, "").replace(/\&/g, "").replace('notice1', '');

		if(!$(this).hasClass("on") && href != "" && id != undefined){
			$("#welcome a").removeClass("on");
			$(this).addClass("on");

			$("#welcome div").hide();
			$("#"+parentId).show();

			if($("#nav-"+id).html() == undefined){
				//标签导航处增加栏目信息
				var cur = $(".navul li.cur").index();
				$(".default-nav li").removeClass("cur");
				if(cur > -1){
					$(".navul li:eq("+cur+")").after("<li class='navli' id='nav-"+id+"' data-type='"+parentId.replace("welcome-", "")+"' title="+title+"><b></b><label>"+title+"<s title=\"点击关闭标签\">&times;</s></label></li>");
				}else{
					$(".navul ul").append("<li class='navli' id='nav-"+id+"' data-type='"+parentId.replace("welcome-", "")+"' title="+title+"><b></b><label>"+title+"<s title=\"点击关闭标签\">&times;</s></label></li>");
				}
				initRightNavMenu();
				//重置主体内容高度
				fBodyHeight(0);
				if(cur > -1){
					$(".navul li:eq("+cur+")").next("li").click();
				}else{
					$(".navul ul li").click();
				}
			}else{
				$(".default-nav li").removeClass("cur");
				//重置主体内容高度
				fBodyHeight(0);
				$("#nav-"+id).click();
			}

			if($("#body-"+id).html() == undefined){
				//内容区增加栏目iframe
				$("#body iframe").hide();
				$("#body").append('<iframe id="body-'+id+'" name="body-'+id+'" frameborder="0" src="'+href+'"></iframe>');
			}
			else{
				$("#body iframe").hide();
				$("#body-"+id).show();
			}

			$("#welcome-"+parentId).find("a").removeClass("on");
			$("#welcome-"+parentId).find("a").each(function() {
				var id_ = $(this).attr("href").split("/"),
				//id_ = id_[1].split(".")[0];
				id_ = id_[1].replace(/\./g, "").replace(/\=/g, "").replace(/\?/g, "").replace(/\&/g, "").replace('notice1', '');
				if(id_ == id){
					$(this).addClass("on");
				}
			});

		};
	});

	//双击关闭菜单
	$(".default-nav").delegate("li", "dblclick", function(e){
		$(this).find("s").click();
	});

	//内容导航拖动排序
	$(".default-nav ul").dragsort({ dragSelector: "li.navli b", placeHolderTemplate: '<li class="placeHolder"></li>' });

	$(document).click(function (e) {

		$("#menuNav").bind("click", function(){
			return false;
		});

		//关闭菜单
		closeMenu();
	});

	//内容菜单切换
	$(".default-nav").delegate("li", "click", function(e){
		//下拉菜单
		if($(this).hasClass("lastnav")){
			rightNavMenu($(this));
			return false;

		//普通菜单
		}else{
			var id = $(this).attr("id").replace("nav-", ""), type = $(this).attr("data-type"), index = $(this).index() + 1;

			//关闭按钮
			if(e.target.nodeName.toLowerCase() == "s"){
				$("#body-"+id).remove();
				$(".default-nav li:eq("+index+")").remove();
				if($(this).hasClass("cur")){
					if($(".default-nav li:eq("+(index-1)+")").attr("data-type") != "store" && $(".default-nav li:eq("+(index-1)+")").attr("data-type") != "plugins"){
						$("#welcome div").hide();
					}
					$(".default-nav li:eq("+(index-1)+")").click();
				}
				parentHideTip();

			//切换
			}else{

				//关闭菜单
				closeMenu();

				if($(this).hasClass("cur")) return false;

				$(".default-nav li").removeClass("cur");
				$(this).addClass("cur");

				$("#body iframe").hide();
				$("#body-"+id).show();

				if(type != "store" && type != "plugins"){
					$("#welcome div").hide();
					$("#welcome-"+type).show();
					$("#welcome-"+type+" a").removeClass("on");
					if(type == "index" && hasNewVersion){
						$("#welcome div.version_show").show();
					}
					if(id != "index"){
						$("#welcome-"+type+" a").each(function() {
							var href = $(this).attr("href").split("/"), //id_ = href[1].split(".")[0];
							id_ = href[1].replace(/\./g, "").replace(/\=/g, "").replace(/\?/g, "").replace(/\&/g, "").replace('notice1', '');
							if(id_ == id){
								$(this).addClass("on");

								var index = $(this).parent().index();
								$(this).parent().siblings("dd").hide();
								$(this).parent().show();
								$(this).parent().siblings("dt").find("span").removeClass("cur");
								$(this).parent().siblings("dt").find("span:eq("+(index-1)+")").addClass("cur");
							}
						});
					}
					$("#body .options").show();
				}else{
					$("#welcome .on").removeClass("on");
					$("#body .options").hide();
				}
			}

			//计算点击的li左边的li宽度和
			var w = 0, index = $(this).index();
			for(var i = 0; i < index; i++){
				w = w + $(".navul li:eq("+i+")").outerWidth(true);
			};

			if(!$(this).hasClass("firstnav")){
				var ul = $('.navul ul'),
					li_offset = $(this).offset(),
					li_width = $(this).outerWidth(true),
					navwidth = Number($(".navul").css("max-width").replace("px", ""));
				if(li_offset.left + li_width - 115 > navwidth) {//如果将要移动的元素在不可见的右边，则需要移动
					var distance = w + li_width - navwidth;//计算当前父元素的右边距离，算出右移多少像素
					ul.animate({"margin-left": -distance}, 200, 'swing');
				}else if(li_offset.left < $(".navul").offset().left) {//如果将要移动的元素在不可见的左边，则需要移动
					var distance = ul.offset().left - li_offset.left;//计算当前父元素的左边距离，算出左移多少像素
					if(distance > 0){
						distance = 0;
					}
					ul.animate({"margin-left": distance }, 200, 'swing');
				}
			}
			//$(this).trigger('click');
		}

		fBodyHeight(0);

		//修复Chrome下页面切换后鼠标滑轮失效的怪异现象 by:guozi 2014-9-10
		$("#body").height($("#body").height()+1);
	});

	//刷新
	$("#refresh").bind("click", function(){
		var id = $(".default-nav .cur").attr("id").replace("nav-", ""),iframe = "body-"+id;
		//if(iframe[0].contentWindow) {
//			reloadPage(iframe[0].contentWindow);
//		}
		if(iframe) {
			reloadPage(iframe);
		}
	});

	//全屏
	$("#fullScreen").bind("click", function(){
		var nBodyHeight = $(".header").height() + $(".welcome").height() + $(".default-nav").height() + 28, nBodyWidth = document.documentElement.clientWidth - 15;
		var nClientHeight = document.documentElement.clientHeight;

		if(!$(this).hasClass("cur")){
			$(this).addClass("cur");
			$(".welcome, .default-nav").hide();
			$("#body").css({"height": nClientHeight - $(".header").height()});

			//浏览器全屏
			launchFullScreen(document.documentElement);
		}else{
			$("#body").height(nClientHeight - nBodyHeight);
			$(this).removeClass("cur");
			$(".welcome, .default-nav").show();

			var w = 0;
			$(".navul li").each(function() {
				w = w + $(this).width() + 1;
			});

			$(".navul ul").width(Math.ceil(w+2));

			//退出全屏
			exitFullscreen();
		}
	});

	//上次访问页面
	var gotopage = $("#gotopage").html();
	if(gotopage != ""){
		$(".h-nav a").each(function() {
            if(gotopage.indexOf($(this).attr("href")) > -1){
				$(this).click();
				return false;
			}
        });
	}

	//功能搜索
	$("#search form").bind("submit", function(event){
		event.preventDefault();
		$("#search").hide();
		var searchKey = $("#searchKey").val(), action = $(this).attr("action");
		if($.trim(searchKey) != ""){
			try{
				if($("#nav-searchFun0").html() != undefined){
					$("#body-searchFun0").attr("src", action+"?keyword="+encodeURIComponent(searchKey));
					$("#nav-searchFun0").click();
				}else{
					addPage("searchFun0", "index", "搜索功能", action+"?keyword="+encodeURIComponent(searchKey));
				}
			}catch(e){
				location.href = action;
			}
		}else{
			$("#searchKey").focus();
		}
	});

	//目录导航
	$("#mapsBtn").bind("click", function(event){
		var href = $(this).attr("href");
		try{
			event.preventDefault();
			$("#search").hide();
			addPage("searchFun1", "index", "目录导航", href);
		}catch(e){}
	});

	//系统基本参数
	$(".config a").bind("click", function(event){
		event.preventDefault();
		try{
			parent.$(".h-nav a").each(function(index, element) {
				if($(this).attr("href") == "siteConfig/siteConfig.php"){
					$(this).click();
					return false;
				}
			});
		}catch(e){}
	});

	//退出提示
	$(".exit a").bind("click", function(event){
		var href = $(this).attr("href");
		event.preventDefault();
		$.dialog.confirm('确定要退出吗？', function(){

			var channelDomainClean = window.location.host;
		    var channelDomain_1 = channelDomainClean.split('.');
		    var channelDomain_1_ = channelDomainClean.replace(channelDomain_1[0]+".", "");

		    channelDomain_ = channelDomainClean.split("/")[0];
		    channelDomain_1_ = channelDomain_1_.split("/")[0];

		    $.cookie(cookiePre + 'admin_auth', null, {domain: channelDomainClean, path: '/'});
		    $.cookie(cookiePre + 'admin_auth', null, {domain: channelDomain_1_, path: '/'});

			location.href = href;
		});
	});

	//获取预览信息
	// getPreviewInfo();



	//消息通知
	var timer, audio, step = 0, _title = document.title;

	//消息通知音频
	if(window.HTMLAudioElement){
		audio = new Audio();
		audio.src = "/static/audio/notice01.mp3";
		audio.pause();
	}

	//显示消息通知层，同时恢复默认标题
	$(".notice").hover(function(){
		$(this).find(".noticify").show();
		document.title = _title;
		clearInterval(timer);
	}, function(){
		$(this).find(".noticify").hide();
	});

	//静音||开启声音
	var adminNoticeSound = $.cookie("adminNoticeSound");
	$(".noticify .sound").bind("click", function(){
		var t = $(this);
		if(t.hasClass("un")){
			t.removeClass("un").attr("title", "关闭声音");
			$.cookie("adminNoticeSound", 1, {expires: -1});
		}else{
			t.addClass("un").attr("title", "开启声音");
			$.cookie("adminNoticeSound", 1, {expires: 365});
		}
	});

	//静音样式
	var adminNoticeSound = $.cookie("adminNoticeSound");
	if(adminNoticeSound == 1){
		$(".noticify .sound").addClass("un").attr("title", "开启声音");
	}


	//点击通知列表跳转指定页面
	$(".r-nav .noticify .con").delegate("li", "click", function(event){
		var t = $(this), module = t.attr("data-module"), id = t.attr("data-id"), name = t.attr("data-name"), url = t.attr("data-url");

		try {
	  		event.preventDefault();
	  		$(".h-nav a").each(function(index, element) {
				var ta = $(this);
				if(ta.attr("href") == url){
					var _url = url + (url.indexOf('?') > -1 ? '&' : '?') + "notice=1";
					ta.attr("href", _url);
					// ta.attr("href", url + (url.indexOf('?') > -1 ? '&' : '?') + "notice=1");
	  				ta.click();
					$(".notice .noticify").hide();
					ta.attr("href", url);
					$("#welcome .on").attr("href", url);
	  				return false;
		  		}
	  		});
	  	} catch(e) {}

	});


	//异步获取通知
	getAdminNotice();

	//每隔10秒再请求一次
	setInterval(function(){
        getAdminNotice();
        opearModuleData.init();
    }, 10000);

	var noticeTotalCount = lastTotalCount = 0;
	var isfirst = 1;
	function getAdminNotice(){
		$.ajax({
			url: "index.php?dopost=getAdminNotice",
			type: "GET",
			dataType: "jsonp",
			success: function (d) {

				//如果有新消息
				var data = d.data;
				var moduleList = [];

				if(data.length > 0){

					//拼接消息通知列表
					var list = [];
					noticeTotalCount = 0;
					for(var i = 0; i < data.length; i++){

						if(data[i].count > 0){
							var cla = '';
							if(data[i].name.length <= 2){
								cla = ' class="f2"';
							}
							if(data[i].name.length >= 5){
								cla = ' class="f5"';
							}
							list.push('<li'+cla+' data-module="'+data[i].module+'" data-id="'+data[i].id+'" data-name="'+data[i].name+'" data-url="'+data[i].url+'"><a href="javascript:;"><em>'+data[i].count+'</em>'+data[i].name+'</a></li>');

							noticeTotalCount += Number(data[i].count);
						}
							moduleList.push(data[i].id);
					}
					$(".r-nav .notice .con ul").html(list.join(""));
					$(".r-nav .notice a i").html(noticeTotalCount);
					$(".r-nav .notice").show();
				}else{
					$(".r-nav .notice .con ul").html("");
					$(".r-nav .notice").hide();
				}

					// 需要重复播放提示音的订单模块
				var audio_type = '';
				if(moduleList.length){
					if(in_array('orderWarning', moduleList)){
						audio_type = 'warning';
					}else if(in_array('waimaiOrderphp', moduleList)){
						audio_type = 'waimai';
					}else if(in_array('paotuiOrderphp', moduleList)){
						audio_type = 'paotui';
					}else if(in_array('shopOrder', moduleList)){
						audio_type = 'shop';
					}
				}

				//消息提醒
				if(d.hasnew || audio_type != '' || (lastTotalCount > 0 && lastTotalCount < noticeTotalCount)){

					audio.src = audio_type != '' ? "/static/audio/notice_"+audio_type+".mp3" : "/static/audio/notice01.mp3";
					//标题闪动
					//标题闪动
					clearInterval(timer);
					timer = setInterval(function(){
						step++;
						if(step == 3) {step = 1};
						if(step == 1) {document.title = '【　　　】-' + _title};
						if(step == 2) {
							document.title = '【新消息】-' + _title;
						};
					}, 500);

					//播放音频
					adminNoticeSound = $.cookie("adminNoticeSound")
					if(!adminNoticeSound){
						audio.play();
					}

					$.get("index.php?dopost=clearAdminNotice");
				}else{

					document.title = _title;
					clearInterval(timer);

					//播放音频
					adminNoticeSound = $.cookie("adminNoticeSound")
					if(!adminNoticeSound){
						audio.pause();
					}

				}

				lastTotalCount = noticeTotalCount;

				//首页待办事项通知
				if($("#body-index").length>0){
					if(isfirst){
						setTimeout(function(){
							if(isMobile()){
							    var frame =  document.getElementById("body-index");
	                            frame.onload = function(){
	                                frame.contentWindow.getAdminNoticeA(data);
	                            };
							}else{
								document.getElementById('body-index').contentWindow.getAdminNoticeA(data);
							}
						}, 1000);
					}else{
						if(isMobile()){
							var frame =  document.getElementById("body-index");
	                        frame.onload = function(){
	                            frame.contentWindow.getAdminNoticeA(data);
	                        };
						}else{
							document.getElementById('body-index').contentWindow.getAdminNoticeA(data);
						}
					}
				}
				isfirst = 0;

			}
		});
	}

	// 定时检查数据
	var now = new Date().getTime();
	var opearModuleData = {
		list: [],
		index: 0,
		speed: 0,
		changeIndex: function(){
			this.index = this.index + 2 > this.list.length ? 0 : this.index + 1;
		},
		init: function(){
			var that_ = this;
			if(!that_.list.length) return;
			setTimeout(function(){
				var index = that_.index;
				that_.changeIndex();

				if(that_.list[index].stop == true){
					if(that_.index != index){
						that_.init();
					}
					return;
				}
				var name = that_.list[index]['name'];
				that_[name](index);
			}, 1000)
		},
		articleUpdateVideotime_face: function(index){
			var that_ = this;
			var page = that_.list[index].page;
			$.ajax({
				url: 'article/articleJson.php',
				type: 'post',
				data: 'action=checkVideotime_face',
				dataType: 'json',
				success: function(data){
					if(data && data.length){
						that_.list[index].stop = true;

						$box = $('#articleUpdateVideotime_face');
						if(!$box.length){
							$box = $('<div id="articleUpdateVideotime_face" style="visibility: hidden;"></div>');
							$('body').append($box);
						}
						for(var i = 0; i < data.length; i++){
							(function(data, i, obj, idx){

		            var captureImage = function(videos, scale, aid){
		            		var scale = scale ? scale : 1;
			                var canvas = document.createElement("canvas");
					            canvas.width = videos.videoWidth * scale;
					            canvas.height = videos.videoHeight * scale;
					            canvas.getContext('2d').drawImage(videos, 0, 0, canvas.width, canvas.height);
					            $box.append(canvas);

					            var img = document.createElement("img");
					            var src = canvas.toDataURL("image/png");
					            img.src = src;
					            $box.append(img);

					            var s = new Date().getTime();
					            $.ajax({
					            	url: '/include/upload.inc.php?mod=article',
					            	type: 'post',
					            	data: {
					            		'type': 'thumb',
					            		'base64': 'base64',
					            		'thumbLargeWidth': canvas.width,
					            		'thumbLargeHeight': canvas.height,
					            		'Filedata': src.split(',')[1],
					            	},
					            	dataType: 'json',
					            	success: function(data){
					            		if(data && data.state == 'SUCCESS'){
					            			var e = new Date().getTime();
					            			that_.speed = Math.round(data.fileSize/(e-s));
					            			$.post('article/articleJson.php?action=updateVideotime_face', 'type=face&id='+aid+'&litpic='+data.url);
					            		}
					            	},
					            	error: function(){
					            		console.log('error')
					            	}
					            })
			            }

								var d = data[i], url = d.videotype == "0" ? (window.location.origin+'/include/attachment.php?f='+d.videourl) : d.videourl;
								var video =  document.createElement('video');
								video.src = url;
								video.setAttribute('crossorigin', 'anonymous'); // 注意设置图片跨域应该在图片加载之前
								$box.append(video);

								video.addEventListener("loadeddata", function (_event) {

									if(d.videotime == 0){
									    $.post('article/articleJson.php?action=updateVideotime_face', 'type=time&id='+d.id+'&videotime='+parseInt(video.duration));
									}
							    	if(d.litpic == ''){
										setTimeout(function(){
							    			captureImage(video, 1, d.id);
							    			if(i + 1 == data.length){
										    	$box.html('');
										    	obj.list[idx].stop = false;
										    }
							    		}, 3000);
								    }

								});

								video.addEventListener("error", function (_event) {
									console.clear();
                  console.log('%c新闻信息视频不存在，或者远程附件服务器没有设置允许跨域，无法自动生成视频缩略图。\n若您没有此需求，请忽略此消息。谢谢您的合作。', 'color:#ccc;font-size:12px');
                })

							})(data, i, that_, index)
						}
					}
				},
				error: function(){
				}
			})
		},
		articleUeditorVideo_face: function(index){
			var that_ = this;
			var page = that_.list[index].page;
			$.ajax({
				url: 'article/articleJson.php',
				type: 'post',
				data: 'action=checkUeditorVideo_face',
				dataType: 'json',
				success: function(data){
					if(data && data.length){
						that_.list[index].stop = true;

						$box = $('#articleUpdateUeditorVideotime_face');
						if(!$box.length){
							$box = $('<div id="articleUpdateUeditorVideotime_face" style="visibility: hidden;"></div>');
							$('body').append($box);
						}
						for(var i = 0; i < data.length; i++){
							(function(data, i, obj, idx){

		            var captureImage = function(videos, scale, path, aid){
		            		var scale = scale ? scale : 1;
			                var canvas = document.createElement("canvas");
					            canvas.width = videos.videoWidth * scale;
					            canvas.height = videos.videoHeight * scale;
					            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
					            $box.append(canvas);

					            var img = document.createElement("img");
					            var src = canvas.toDataURL("image/png");
					            img.src = src;
					            $box.append(img);

					            var s = new Date().getTime();
					            $.ajax({
					            	url: '/include/upload.inc.php?mod=article',
					            	type: 'post',
					            	data: {
					            		'type': 'adv',
					            		'base64': 'base64|'+path,
					            		'thumbLargeWidth': canvas.width,
					            		'thumbLargeHeight': canvas.height,
					            		'Filedata': src.split(',')[1],
					            	},
					            	dataType: 'json',
					            	success: function(data){
					            		if(data && data.state == 'SUCCESS'){
					            			var e = new Date().getTime();
					            			that_.speed = Math.round(data.fileSize/(e-s));
					            			$.post('article/articleJson.php?action=updateVideotime_face', 'type=face&id='+aid+'&litpic='+data.url);
					            		}
					            	},
					            	error: function(){
					            		console.log('error')
					            	}
					            })
			            }

								var d = data[i], url = d.src, path = d.path.replace('.mp4', '.png');
								var video =  document.createElement('video');
								video.src = url;
								video.setAttribute('crossorigin', 'anonymous'); // 注意设置图片跨域应该在图片加载之前
								$box.append(video);

								video.addEventListener("loadeddata", function (_event) {

									setTimeout(function(){
										captureImage(video, 1, path, d.id);
										if(i + 1 == data.length){
											$box.html('');
											obj.list[idx].stop = false;
										}
									}, 3000);

								});

								video.addEventListener("error", function (_event) {
									console.clear();
                  console.log('%c新闻信息视频不存在，或者远程附件服务器没有设置允许跨域，无法自动生成视频缩略图。\n若您没有此需求，请忽略此消息。谢谢您的合作。', 'color:#ccc;font-size:12px');
                })

							})(data, i, that_, index)
						}
					}
				},
				error: function(){
				}
			})
		},
		circlecleUpdateVideotime_face: function(index){
			var that_ = this;
			var page = that_.list[index].page;
			$.ajax({
				url: 'circle/circleJson.php',
				type: 'post',
				data: 'action=checkVideotime_face',
				dataType: 'json',
				success: function(data){
					if(data && data.length){
						that_.list[index].stop = true;

						$circlebox = $('#circleUpdateVideotime_face');
						if(!$circlebox.length){
							$circlebox = $('<div id="circleUpdateVideotime_face" style="visibility: hidden;"></div>');
							$('body').append($circlebox);
						}

						for(var i = 0; i < data.length; i++){

							(function(data, i, obj, idx){
					            var captureImage = function(videos, scale, cid){
					            	var scale = scale ? scale : 1;
					                var canvas = document.createElement("canvas");
							            canvas.width = videos.videoWidth * scale;
							            canvas.height = videos.videoHeight * scale;
							            canvas.getContext('2d').drawImage(videos, 0, 0, canvas.width, canvas.height);
							            $circlebox.append(canvas);

							            var img = document.createElement("img");
							            var src = canvas.toDataURL("image/png");
							            img.src = src;
							            $circlebox.append(img);
							            var s = new Date().getTime();
							            $.ajax({
							            	url: '/include/upload.inc.php?mod=circle',
							            	type: 'post',
							            	data: {
							            		'type': 'thumb',
							            		'base64': 'base64',
							            		'thumbLargeWidth': canvas.width,
							            		'thumbLargeHeight': canvas.height,
							            		'Filedata': src.split(',')[1],
							            	},
							            	dataType: 'json',
							            	success: function(data){
							            		console.log(data);
							            		if(data && data.state == 'SUCCESS'){
							            			var e = new Date().getTime();
							            			that_.speed = Math.round(data.fileSize/(e-s));
							            			$.post('circle/circleJson.php?action=updateVideotime_face', 'type=face&id='+cid+'&litpic='+data.url);
							            		}
							            	},
							            	error: function(){
							            		console.log('error')
							            	}
							            })
					            }

								var d = data[i], url = d.videoadr;
								var videocircle =  document.createElement('video');
								videocircle.src = url;
								videocircle.setAttribute('crossorigin', 'anonymous'); // 注意设置图片跨域应该在图片加载之前
								// videocircle.setAttribute('autoplay', 'autoplay'); // 注意设置图片跨域应该在图片加载之前
								videocircle.setAttribute('videotime', d.videotime);
								videocircle.setAttribute('thumbnail', d.thumbnail);
								videocircle.setAttribute('cid', d.id);
								videocircle.setAttribute('cid', d.id);
								$circlebox.append(videocircle);

								videocircle.addEventListener("loadeddata", function (_event) {

									var _this_ = this;
									if(!_this_.getAttribute('videotime')){
									    $.post('circle/circleJson.php?action=updateVideotime_face', 'type=time&id='+_this_.getAttribute('cid')+'&videotime='+parseInt(_this_.getAttribute('duration')));
									 }
							    	if(_this_.getAttribute('thumbnail') == ''){
							    		setTimeout(function(){
							    			captureImage(_this_, 1, _this_.getAttribute('cid'));
							    			if(i + 1 == data.length){
										    	$circlebox.html('');
										    	obj.list[idx].stop = false;
										    }
							    		}, 3000);
								    }

								});

								videocircle.addEventListener("error", function (_event) {
									console.clear();
					              console.log('%动态信息视频不存在，或者远程附件服务器没有设置允许跨域，无法自动生成视频缩略图。\n若您没有此需求，请忽略此消息。谢谢您的合作。', 'color:#ccc;font-size:12px');
					            })

							})(data, i, that_, index)
						}
					}
				},
				error: function(){
				}
			})
		},
		circleUeditorVideo_face: function(index){
			var that_ = this;
			var page = that_.list[index].page;
			$.ajax({
				url: 'circle/circleJson.php',
				type: 'post',
				data: 'action=checkUeditorVideo_face',
				dataType: 'json',
				success: function(data){
					if(data && data.length){
						that_.list[index].stop = true;

						$circlebox = $('#circleUpdateUeditorVideotime_face.hide');
						if(!$circlebox.length){
							$circlebox = $('<div id="circleUpdateUeditorVideotime_face" class="hide"></div>');
							$('body').append($circlebox);
						}
						for(var i = 0; i < data.length; i++){
							(function(data, i, obj, idx){

		            var captureImage = function(videos, scale, path, cid){
		            		var scale = scale ? scale : 1;
		                var canvas = document.createElement("canvas");
				            canvas.width = videos.videoWidth * scale;
				            canvas.height = videos.videoHeight * scale;
				            canvas.getContext('2d').drawImage(videos, 0, 0, canvas.width, canvas.height);
				            $circlebox.append(canvas);

				            var img = document.createElement("img");
				            var src = canvas.toDataURL("image/png");
				            img.src = src;
				            $circlebox.append(img);

				            var s = new Date().getTime();
				            $.ajax({
				            	url: '/include/upload.inc.php?mod=circle',
				            	type: 'post',
				            	data: {
				            		'type': 'adv',
				            		'base64': 'base64|'+path,
				            		'thumbLargeWidth': canvas.width,
				            		'thumbLargeHeight': canvas.height,
				            		'Filedata': src.split(',')[1],
				            	},
				            	dataType: 'json',
				            	success: function(data){
				            		if(data && data.state == 'SUCCESS'){
				            			var e = new Date().getTime();
				            			that_.speed = Math.round(data.fileSize/(e-s));
				            			$.post('circle/circleJson.php?action=updateVideotime_face', 'type=face&id='+cid+'&litpic='+data.url);
				            		}
				            	},
				            	error: function(){
				            		console.log('error')
				            	}
				            })
		            }

								var d = data[i], url = d.src, path = d.path.replace('.mp4', '.png');
								var videocircle =  document.createElement('video');
								videocircle.src = url;
								videocircle.setAttribute('crossorigin', 'anonymous'); // 注意设置图片跨域应该在图片加载之前
								$circlebox.append(videocircle);

								videocircle.addEventListener("loadeddata", function (_event) {

									setTimeout(function(){
										captureImage(videocircle, 1, d.id);
										if(i + 1 == data.length){
											$circlebox.html('');
											obj.list[idx].stop = false;
										}
									}, 3000);
								});

								videocircle.addEventListener("error", function (_event) {
									console.clear();
                  console.log('%c动态信息视频不存在，或者远程附件服务器没有设置允许跨域，无法自动生成视频缩略图。\n若您没有此需求，请忽略此消息。谢谢您的合作。', 'color:#ccc;font-size:12px');
                })

							})(data, i, that_, index)
						}
					}
				},
				error: function(){
				}
			})
		},
	}
	function checkModule(){
		if($('#modelList [data-id="article"]').length){
			opearModuleData.list.push({'name': 'articleUpdateVideotime_face'}); // 新闻模块 获取已发布(本地上传)视频的时长及封面
			opearModuleData.list.push({'name': 'articleUeditorVideo_face'}); // 新闻模块 获取已发布(本地上传)视频的时长及封面
		}
		if($('#modelList [data-id="circle"]').length){
			opearModuleData.list.push({'name': 'circlecleUpdateVideotime_face'}); // 圈子模块 获取已发布(本地上传)视频的时长及封面
			opearModuleData.list.push({'name': 'circleUeditorVideo_face'}); // 圈子模块 获取已发布(本地上传)视频的时长及封面
		}
	}
	checkModule();

});


function rightNavMenu(t){
	var menu = $("#menuNav");
	if(menu.is(":visible")){
		menu.hide();
	}else{
		var top = $(".header").height() + $("#welcome").height() + 55, offset = t.offset(), left = offset.left + t.width() - 150;

		if(t.hasClass("lastnav")){
			left = left + 25;
		}

		var parentLi = [], navLiLength = $(".navul li").length, navLiCur = $(".navul li.cur").index(), cleft = cright = 0;
		if(t.hasClass("firstnav") && navLiLength == 0) return;

		var liElse = '';
		if(navLiLength > 1 && navLiCur > -1){
			if(navLiCur != 0){
				parentLi.push('<li class="closeleft"><a href="javascript:;">关闭左侧标签</a></li>');
				cleft = 1;
			}
			if(navLiCur < navLiLength - 1){
				parentLi.push('<li class="closeright"><a href="javascript:;">关闭右侧标签</a></li>');
				cright = 1;
			}
			if(cleft && cright){
				liElse = '<li class="closeelse"><a href="javascript:;">关闭其它标签</a></li>';
			}
		}

		menu.html('<li class="closeall"><a href="javascript:;">关闭全部</a></li>'+liElse+parentLi.join("")+'<li role="presentation" class="divider"></li>');
		var c = "";
		if($(".firstnav").hasClass("cur")){
			c = " cur";
		}
		menu.append('<li class="firstnav'+c+'" id="nav-index" data-type="index" data-listidx="false"><a href="javascript:;">后台首页</a></li>');

		var mscrollHeight = document.documentElement.clientHeight - top - menu.height() - 25;

		if($(".navul ul").html() != ""){
			menu.append('<li role="presentation" class="divider"></li>');
			menu.append('<div class="menu-scroll"></div>');
			menu.find(".menu-scroll").append($(".navul ul").html()
				.replace(/id="(.*?)"/g, "")
				.replace(/<label>/g, "<a href='jajvascript:;'>")
				.replace(/label/g, "a"));
			menu.find(".menu-scroll").css({"max-height": mscrollHeight});
		}

		$("<div>")
			.attr("id", "bodyBg")
			.css({"position": "absolute", "left": "0", "top": "0", "width": "100%", "height": "100%", "background": "#fff", "opacity": "0"})
			.appendTo("body");

		menu.find(".menu-scroll").css({"max-height": (mscrollHeight)});

		menu.css({"top": top, "left": (left < 0 ? 10 : left)}).show();

		menu.find("li").bind("click", function(e){
			var c = $(this).attr("class"), index = $(this).index() + 1;

			//关闭所有标签
			if(c == "closeall"){
				$(".navul ul, .menu-scroll").html("");
				$(".firstnav").click();
				$("#body iframe").each(function() {
					if($(this).attr("id") != "body-index"){
						$(this).remove();
					}
				});
				parentHideTip();
				$(".navul ul").width(0);
				$(".default-nav li:eq(0)").click();
				$(".lastnav").hide();
				return false;
			};

			//关闭当前选中之外的其它标签
			if(c == "closeelse"){
				var curId = $(".navul li.cur").attr("id").replace("nav-", "");
				$(".navul li").each(function(){
					if(!$(this).hasClass("cur")){
						$(this).remove();
					}
				});

				$("#body iframe").each(function() {
					var attrId = $(this).attr("id").replace("body-", "");
					if(attrId != curId && attrId != "index"){
						$(this).remove();
					}
				});
				closeMenu();
				fBodyHeight();
				$(".navul ul").css({"margin-left": 0});
				return false;
			}

			//关闭当前选中的左侧标签
			if(c == "closeleft"){
				var curId = $(".navul li.cur").attr("id").replace("nav-", "");
				var cIndex = $(".navul li.cur").index();
				var navArr = [];
				$(".navul li").each(function(){
					var curIndex = $(".navul li.cur").index();
					var i = $(this).index();
					if(!$(this).hasClass("cur") && i < curIndex){
						$(this).remove();
						navArr.push($(this).attr("id").replace("nav-", ""));
					}
				});

				$("#body iframe").each(function() {
					var attrId = $(this).attr("id").replace("body-", "");
					if($.inArray(attrId, navArr) > -1 && attrId != "index" && attrId != curId){
						$(this).remove();
					}
				});
				closeMenu();
				fBodyHeight();
				return false;
			}

			//关闭当前选中的右侧标签
			if(c == "closeright"){
				var curId = $(".navul li.cur").attr("id").replace("nav-", "");
				var cIndex = $(".navul li.cur").index();
				var navArr = [];
				$(".navul li").each(function(){
					var curIndex = $(".navul li.cur").index();
					var i = $(this).index();
					if(!$(this).hasClass("cur") && i > curIndex){
						$(this).remove();
						navArr.push($(this).attr("id").replace("nav-", ""));
					}
				});

				$("#body iframe").each(function() {
					var attrId = $(this).attr("id").replace("body-", "");
					if($.inArray(attrId, navArr) > -1 && attrId != "index" && attrId != curId){
						$(this).remove();
					}
				});
				closeMenu();
				fBodyHeight();
				return false;
			}

			//首页
			if(c == "firstnav"){
				$(".default-nav li:eq(0)").click();
				return false;
			}

			if(e.target.nodeName.toLowerCase() == "s"){
				$(".default-nav li:eq("+index+")").find("s").click();
				$(this).remove();
				if($(".navul li").length > 0){
					$(".default-nav li:last").click();
				}
			}else{
				$(".default-nav li:eq("+index+")").click();
			}
		});

		return false;
	}
}



function parentHideTip(){
	var notice = parent.$(".w-notice");
	if(notice.length > 0){
		notice.stop().animate({top: "-50px", opacity: 0}, 300, function(){
			notice.remove();
		});
	}
}

//关闭菜单
function closeMenu(){
	$("#menuNav, #bodyBg").hide();
	$("#bodyBg").remove();
}

/*
 * 子页向父级新增标签
 * id     标签ID
 * type   标签类型
 * title  标签标题
 * url    标签地址
 */
function addPage(id, type, title, href){
	$("#welcome a").removeClass("on");

	id = id.replace('notice1', '');

	if(type != "store" && type != "plugins"){
		$("#welcome div").hide();
		$("#welcome-"+type).show();
	}

	title = title.replace(/\s/g, "");
	var strTitle = title;
	if(title.length > 6){
		strTitle = title.substr(0, 6)+"..";
	}

	if($("#nav-"+id).html() == undefined){
		//标签导航处增加栏目信息
		var cur = $(".navul li.cur").index();
		$(".default-nav li").removeClass("cur");
		if(cur > -1){
			$(".navul li:eq("+cur+")").after("<li class='navli' id='nav-"+id+"' data-type='"+type+"' title="+title+"><b></b><label>"+strTitle+"<s title=\"点击关闭标签\">&times;</s></label></li>");
		}else{
			$(".navul ul").append("<li class='navli' id='nav-"+id+"' data-type='"+type+"' title="+title+"><b></b><label>"+strTitle+"<s title=\"点击关闭标签\">&times;</s></label></li>");
		}
		//重置主体内容高度
		fBodyHeight(0);
		if(cur > -1){
			$(".navul li:eq("+cur+")").next("li").click();
		}else{
			$(".navul ul li").click();
		}
	}else{
		$(".default-nav li").removeClass("cur");
		//重置主体内容高度
		fBodyHeight(0);
		$("#nav-"+id).click();
	}

	if($("#body-"+id).html() == undefined){
		//内容区增加栏目iframe
		$("#body iframe").hide();
		$("#body").append('<iframe id="body-'+id+'" name="body-'+id+'" frameborder="0" src="'+href+'"></iframe>');
	}else{
		$("#body iframe").hide();
		$("#body-"+id).show();
	}
	initRightNavMenu();
}

//导航菜单
function openSnSort() {
    var N = $(".header");
    var D = N.find("li");
    var J = null;
    var X = null;
    D.mouseover(function() {
        clearTimeout(X);
		var t = $(this);
		if(t.attr("class") != undefined && t.attr("class").indexOf("sub-li") < 0) {
			t.siblings("li").find(".sub-nav").hide();
			return false;
		}
		var subtitle = t.find(".sub-title").html(), subNav = t.find(".sub-nav"), cla = t.attr("class");
		J = setTimeout(function(){
			if(subtitle != undefined && (subtitle.indexOf("模块") > -1 || subtitle.indexOf("功能搜索") > -1)){
				subNav.css({"left": -t.position().left});
			}else{
				var length = subNav.find("dl dt span").length;
				if(length > 0){
					subNav.width(length * (t.find("dl dt span").width() + 20));
				}
			}
			if(cla != undefined && cla.indexOf("sear") > -1){
				subNav.css({"left": -40, "right": 0});
			}
			subNav.stop(true, true).show();
			t.siblings("li").find(".sub-nav").hide();
			$("#module").css({"height": $(".sub-top").height() + $("#modelList").height() + ($("#modelInfo").is(":visible") ? $("#modelInfo").height() : 0) + 10});
		}, 50);


    }).mouseout(function() {
        clearTimeout(J);
		var t = $(this), cla = t.attr("class");
		var time = 300;
		if(cla != null && (cla.indexOf("sear") > -1 || cla.indexOf("preview") > -1)){
			time = 0;
		}
        X = setTimeout(function() {
            t.find(".sub-nav").stop(true, true).fadeOut(100);
        }, time);
    });
};

//设置主体内容高度
function fBodyHeight(m){
	var nBodyHeight = $(".header").height() + $(".welcome").height() + $(".default-nav").height() + 28, nBodyWidth = document.documentElement.clientWidth - 15;
	var nClientHeight = document.documentElement.clientHeight;

	if($("#fullScreen").hasClass("cur")){
		$(".welcome, .default-nav").hide();
		$("#body").css({"height": nClientHeight - $(".header").height()});
	}else{
		$("#body").height(nClientHeight - nBodyHeight);
	}

	//模块二级菜单宽度
	$(".h-nav li.sub-li").each(function(index, element) {
        if($(this).find(".sub-title").html().indexOf("模块") > -1){
			$(this).find(".sub-nav").width(nBodyWidth - 25);
		}
    });;

	//内容导航宽度
	var navwidth = nBodyWidth - $(".firstnav").width() - $(".lastnav").width() - 35;
	$(".navul").css({"max-width": navwidth});
	var w = 0;
	$(".navul li").each(function() {
		w = w + $(this).outerWidth();
	});
	w -= ($(".navul li").length - 1);

	$(".navul ul").width(Math.ceil(w+2));

	if($(".navul li").length > 2){
		$(".lastnav").show();
	}else{
		$(".lastnav").hide();
	}

	if(m != 0){
		if((w - navwidth) > 0){
			// $(".navul ul").stop().animate({"margin-left": -(w-navwidth)}, 200, 'swing');
		}
	}
}

//全屏，找到支持的方法, 使用需要全屏的 element 调用
function launchFullScreen(element) {
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

//退出 fullscreen
function exitFullscreen() {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozExitFullScreen) {
		document.mozExitFullScreen();
	} else if(document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}

//重新刷新页面，使用location.reload()有可能导致重新提交
function reloadPage(win) {
	//var location = win.location;
	//location.href = location.pathname + location.search;
	if(typeof win=="object"){
		win = win[0].id;
	}
	document.getElementById(win).contentWindow.location.reload(true);
	// var location = win.attr("src");
	// if(location){
	// 	win.attr("src", win.attr("src"));
	// }
}

//监听F5，只刷新当前页面
function resetEscAndF5(e) {
	e = e ? e : window.event;
	actualCode = e.keyCode ? e.keyCode : e.charCode;
	var id = $(".default-nav .cur").attr("id").replace("nav-", ""),iframe = "body-"+id;
	//if(actualCode == 116 && iframe[0].contentWindow) {
	//	reloadPage(iframe[0].contentWindow);
	if(actualCode == 116 && iframe) {
		reloadPage(iframe);
		if(document.all) {
			e.keyCode = 0;
			e.returnValue = false;
		} else {
			e.cancelBubble = true;
			e.preventDefault();
		}
	}
}

function _attachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if(eventobj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
}

_attachEvent(document.documentElement, 'keydown', resetEscAndF5);


//上传成功接收
function uploadSuccess(obj, file, filetype){
	$("#"+obj).val(file);
	$("#"+obj).siblings(".spic").find(".sholder").html('<img src="'+cfg_attachment+file+'" />');
	$("#"+obj).siblings(".spic").find(".reupload").attr("style", "display: inline-block");
	$("#"+obj).siblings(".spic").show();
	$("#"+obj).siblings("iframe").hide();
}

//删除文件
function reupload(action, t){
	var t = $(t), parent = t.parent(), input = parent.prev("input"), iframe = parent.next("iframe"), src = iframe.attr("src");
	var g = {
		mod: action,
		type: "delbrandLogo",
		picpath: input.val(),
		randoms: Math.random()
	};
	$.ajax({
		type: "POST",
		cache: false,
		async: false,
		url: "/include/upload.inc.php",
		dataType: "json",
		data: $.param(g),
		success: function() {
			try {
				input.val("");
				t.prev(".sholder").html('');
				parent.hide();
				iframe.attr("src", src).show();
			} catch(b) {}
		}
	})
};


//异步获取预览链接
function getPreviewInfo(){
	$.ajax({
		url: "index.php?dopost=getModuleArr",
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			var list = [];
			for(var i = 0; i < data.length; i++){
				list.push('<a href="'+data[i].url+'" target="_blank">'+data[i].name+'</a>');
			}
			$("#preview").html(list.join(""));


			//临时处理域名修改后不生效的BUG，原因是程序第一次请求到的配置文件不是最新的，第二次请求才对
			setTimeout(function(){
				$.ajax({
					url: "index.php?dopost=getModuleArr",
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						var list = [];
						for(var i = 0; i < data.length; i++){
							list.push('<a href="'+data[i].url+'" target="_blank">'+data[i].name+'</a>');
						}
						$("#preview").html(list.join(""));
					}
				});
			}, 5000);


		}
	});
}
function in_array(str, arr){
    for(var i in arr){
        if(arr[i] == str){
            return true;
        }
    }
    return false;
}

//是否移动端
function isMobile(){
	if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		return true;
	}
}

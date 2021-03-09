$(function(){

	//二级导航
	$(".listnav li").hover(function(){
		$(this).addClass("current");
	}, function(){
		$(this).removeClass("current");
	});

	//slideshow_640_380
	var sid = 640380;
	if($("#slideshow"+sid).find(".slideshow-item").length > 0){
		$("#slideshow"+sid).cycle({ 
			fx: 'fade',
			pager: '#slidebtn'+sid,
			next:	'#slidebtn'+sid+'_next', 
			prev:	'#slidebtn'+sid+'_prev',
			pause: true
		});
	}else{
		$("#slideshow"+sid).parent().hide();
	}



	

	//分享功能
	$("html").delegate(".sharebtn", "mouseenter", function(){
		var t = $(this), title = t.attr("data-title"), url = t.attr("data-url"), pic = t.attr("data-pic"), site = encodeURIComponent(document.title);
		title = title == undefined ? "" : encodeURIComponent(title);
		url   = url   == undefined ? "" : encodeURIComponent(url);
		pic   = pic   == undefined ? "" : encodeURIComponent(pic);
		if(title != "" || url != "" || pic != ""){
			$("#shareBtn").remove();
			var offset = t.offset(), 
					left   = offset.left - 42 + "px",
					top    = offset.top + 20 + "px",
					shareHtml = [];
			shareHtml.push('<s></s>');
			shareHtml.push('<ul>');
			shareHtml.push('<li class="tqq"><a href="http://share.v.t.qq.com/index.php?c=share&a=index&url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
			shareHtml.push('<li class="qzone"><a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&desc='+title+'&pics='+pic+'" target="_blank">QQ空间</a></li>');
			shareHtml.push('<li class="qq"><a href="http://connect.qq.com/widget/shareqq/index.html?url='+url+'&desc='+title+'&title='+title+'&summary='+site+'&pics='+pic+'" target="_blank">QQ好友</a></li>');
			shareHtml.push('<li class="sina"><a href="http://service.weibo.com/share/share.php?url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
			shareHtml.push('</ul>');

			$("<div>")
				.attr("id", "shareBtn")
				.css({"left": left, "top": top})
				.html(shareHtml.join(""))
				.mouseover(function(){
					$(this).show();
					return false;
				})
				.mouseout(function(){
					$(this).hide();
				})
				.appendTo("body");
		}
	});

	$("html").delegate(".sharebtn", "mouseleave", function(){
		$("#shareBtn").hide();
	});

	$("html").delegate("#shareBtn a", "click", function(event){
		event.preventDefault();
		var href = $(this).attr("href");
		var w = $(window).width(), h = $(window).height();
		var left = (w - 760)/2, top = (h - 600)/2;
		window.open(href, "shareWindow", "top="+top+", left="+left+", width=760, height=600");
	});


    //科技
    $.ajax({
        type: "GET",
        url: "/include/ajax.php?service=article&action=alist&typeid=2&pageSize=8&thumb=1&page=1&isAjax=1",
        data: '',
        dataType: "json",
        success: function(data){
            if(data.state == 100){
                var info = data.info.list;
                var obj = $(".picrec .fn-clear");
                var html = '';
                for (i = 0; i < info.length; i++){
                    html += "<li><a href=" + info[i].url +" target=\"_blank\"><img src="+info[i].litpic+" alt="+info[i].description+" />"+info[i].title+"</a></li>\n";
                }
                obj.html(html);
            }
        }
    });

    //新闻点击排行
    $.ajax({
        type: "GET",
        url: "/include/ajax.php?service=article&action=alist&pageSize=4&orderby=2&thumb=1&isAjax=1",
        data: '',
        dataType: "json",
        success: function(data){
            if(data.state == 100){
                var info = data.info.list;
                var obj = $(".clickrank .fn-clear");
                var html = '';
                for (i = 0; i < info.length; i++){
                    html += "<li><a href="+ info[i].url +" target=\"_blank\"><img src="+info[i].litpic+" alt="+info[i].description.substr(0,50)+" /><span class=\"txt\">"+info[i].title+"</span><span class=\"bg\"></span></a></li>\n";
                }
                obj.html(html);
            }
        }
    });
    $.ajax({
        type: "GET",
        url: "/include/ajax.php?service=article&action=alist&pageSize=15&orderby=2&thumb=0&isAjax=1",
        data: '',
        dataType: "json",
        success: function(data){
            if(data.state == 100){
                var info2 = data.info.list;
                var obj2 = $(".clickrank .txt-list");
                var html2 = '';
                for (i = 0; i < info2.length; i++){
                    html2 += "<li><a href="+info2[i].url+" target=\"_blank\">"+info2[i].title+"</a></li>";
                }
                obj2.html(html2);
            }
        }
    });

    //视频新闻
    $.ajax({
        type: "GET",
        url: "/include/ajax.php?service=article&action=alist&typeid=5&flag=r&pageSize=4&thumb=1&isAjax=1",
        data: '',
        dataType: "json",
        success: function(data){
            if(data.state == 100){
                var info = data.info.list;
                var obj = $(".video .hdc ul");
                var html = '';
                for (i = 0; i < info.length; i++){
                    html += "<li><a href="+ info[i].url +" target=\"_blank\"><img src="+info[i].litpic+" /><i></i><span>"+info[i].title+"</span><p>点击数："+info[i].click+"</p></a></li>";
                }
                obj.html(html);
            }
        }
    });
    //精彩图集
    $.ajax({
        type: "GET",
        url: "/include/ajax.php?service=article&action=alist&typeid=8&page=1&pageSize=8&thumb=1&isAjax=1",
        data: '',
        dataType: "json",
        success: function(data){
            if(data.state == 100){
                var info = data.info.list;
                var obj = $(".piclist .fn-clear");
                var html = '';
                for (i = 0; i < info.length; i++){
                    html += "<li><a href="+info[i].url+" target=\"_blank\"><img src="+info[i].litpic+" />"+info[i].title+"</a></li>";
                }
                obj.html(html);
            }
        }
    });



});

    
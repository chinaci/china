$(function(){
	var atpage = 1, isload = false, pageSize = 10;

	//导航栏切换
	$('body').on('click', 'nav.nav li',function(){
		$(this).addClass('active').siblings('li').removeClass('active');
		//数据筛选 或者切换
		getList(1);
	})

	//固定导航栏
	$(window).scroll(function (){
		var top1 = $(window).scrollTop();
		var top3 = $('.mediaBox').offset().top
		var h =$('.header').height()+$('nav').height();
		//当导航栏快被遮挡时，固定导航栏
  　　   if((top1+h)>top3){
			$('nav').addClass('fixed')
		}else{
			$('nav').removeClass('fixed');
		}
　　 });

	/*关注功能*/
	$('.wemeadiaBox').on('click','.careBox ._right a',function(){
		var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}

		if($(this).hasClass('cared')){
			$(this).removeClass('cared').html('<s></s>关注');
		}else{
			$(this).addClass('cared').html('<s></s>已关注');
		}

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+id);
	});

	//var dataInfo = {};

    //var detailList;
    //setTimeout(function(){detailList = new h5DetailList();}, 300);
    //setTimeout(function(){detailList.removeLocalStorage();}, 800);

    $('.mediaBox').delegate('li', 'click', function(){
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), mainHtml = $(".ulbox").html();
        //detailList.insertHtmlStr(dataInfo, mainHtml, {lastIndex: atpage});
        setTimeout(function(){location.href = url;}, 500);
	})

	$(window).scroll(function() {
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() + 50 > scroll && !isload) {
            atpage++;
            getList();
        };
	});

	function getList(tr){

        isload = true;

        if(tr){
            atpage = 1;
            $(".mediaBox ul").html("");
        }

        $(".mediaBox ul").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
        $(".mediaBox ul .loading").remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		data.push("uid="+userid_);

		var mold = $('.mddetailnav ul .active a').attr('data-id');
		if(mold != undefined && mold != '' && mold != null){
			data.push("mold="+mold);
		}

        $.ajax({
            url: "/include/ajax.php?service=article&action=alist",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if (data && data.state == 100) {
                    $(".loading").remove();
                    var list = data.info.list, pageInfo = data.info.pageInfo, page = pageInfo.page, html = [];
                    var totalPage = data.info.pageInfo.totalPage;
                    for (var i = 0, lr; i < list.length; i++) {
                        lr = list[i];
                        var time = returnHumanTime(lr.pubdate,3);
                        var ihot =  lr.flag && lr.flag.indexOf('h') ? '<i class="ihot"></i>' : '';
                        var piccount = lr.group_img == undefined ? 0 : lr.group_imgnum;
                        if(i==0){
                            html.push('<li class="singleBox">');
                            html.push('<a href="javascript:;" data-url="' + lr.url + '" class="fn-clear">');
                            if(lr.litpic!=''){
                                html.push('<div class="aright_">');
                                html.push('<img src="' + lr.litpic + '">');
                                if(piccount > 0){
                                    html.push('<span class="Icount">'+piccount+'图</span>');
                                }
                                html.push('</div>');
                            }
                            html.push('<div class="aleft">');
                            html.push('<h2>' + ihot + lr.title + '</h2>');
                            html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+time+'</span></p>');
                            html.push('</div>');
                            html.push('</a>');
                            html.push('</li>');
                        }else{
                            if(list[i].group_img && lr.group_img.length >= 3 && lr.group_img.length != undefined){
                                html.push('<li class="multipleBox">');
                                html.push('<a href="javascript:;" data-url="' + lr.url + '">');
                                html.push('<h2>' + ihot + lr.title + '</h2>');
                                html.push('<div class="imgBox fn-clear">');
                                var n = 0;
                                if(piccount > 0){
                                    html.push('<span class="Icount">'+ piccount +'图</span>');
                                }
                                for (var g = 0; g < lr.group_img.length; g++) {
                                    var src = huoniao.changeFileSize(lr.group_img[g].path, "small");
                                    if(src && n < 3) {
                                        html.push('<div class="mBox"><img src="'+src+'" onerror=this.src="'+lr.litpic+'" data-url="' + src + '" alt="title"></div>');
                                        n++;
                                        if(n == 3) break;
                                    }
                                }
                                html.push('</div>');
                                html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+ time +'</span></p>');
                                html.push('</a>');
                                html.push('</li>');
                            }else{
                                html.push('<li class="bigBox">');
                                html.push('<a href="javascript:;" data-url="' + lr.url + '">');
                                html.push('<h2>' + ihot + lr.title + '</h2>');
                                if(lr.litpic!=''){
                                    html.push('<div class="imgBox fn-clear"><img src="' + lr.litpic + '" alt="">'+(piccount > 0 ? '<span class="Icount">'+ piccount +'图</span>' : '')+'</div>');
                                }
                                html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+ time +'</span></p>');
                                html.push('</a>');
                                html.push('</li>');
                            }
                        }
                    }
                    $(".mediaBox ul").append(html.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".mediaBox ul .loading").remove();
                        $(".mediaBox ul").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".mediaBox ul").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".mediaBox ul").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
            }
        });

	}

	//初始加载
    getList();

});

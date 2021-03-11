$(function(){
    var atpage = 1, isload = false, pageSize = 10;

	//导航栏切换
	$('body').on('click', 'nav.nav li',function(){
		$(this).addClass('active').siblings('li').removeClass('active');
		//数据筛选 或者切换
		getList(1);
	});

	$('#myform').submit(function(e) {
        e.preventDefault();
        getList(1);
	});

	var detailList;
    detailList = new h5DetailList();
	setTimeout(function(){detailList.removeLocalStorage();}, 500);
	
	var dataInfo = {
        id: '',
        url: '',
        typeid: '',
        isBack: true
    };

    $('.search-content').delegate('li', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url'), mainHtml = $("#search-content").html();

		var typeid = $('.searchnav .active a').attr('data-id');
        dataInfo.url = url;
        dataInfo.typeid = typeid;
		detailList.insertHtmlStr(dataInfo, mainHtml, {lastIndex: atpage});
		
        setTimeout(function(){location.href = url;}, 500);
	});

	$(window).scroll(function() {
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() + 50 > scroll && !isload) {
            atpage++;
            getList();
        };
	});

	//初始加载
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
        getList(1);
    }else {
        getData();
        setTimeout(function(){
            detailList.removeLocalStorage();
        }, 500)
    }

	function getList(tr){

        isload = true;

        if(tr){
            atpage = 1;
            $(".search-content ul").html("");
        }

        $(".search-content ul").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
        $(".search-content ul .loading").remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		
		var mold = $('.nav ul .active a').attr('data-id');
		if(mold != undefined && mold != '' && mold != null){
			data.push("mold="+mold);
		}

		if($('#keywords').val()!=''){
			data.push("title="+$('#keywords').val());
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

						if(lr.litpic=='' && lr.group_img == undefined){//无图
							html.push('<li class="noimgBox">');
							html.push('<a href="javascript:;" data-url="' + lr.url + '">');
							html.push('<h2>' + lr.title + '</h2>');
							html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+time+'</span></p>');
							html.push('</a>');
							html.push('</li>');
						}else{
							if(lr.mold == 2 || lr.mold == 3){//视频
								html.push('<li class="bigBox videoBox">');
								html.push('<a href="javascript:;" data-url="' + lr.url + '">');
								html.push('<h2>' + lr.title + '</h2>');
								html.push('<div class="imgBox fn-clear"><img src="'+ huoniao.changeFileSize(lr.litpic, "middle") +'" alt=""><i></i></div>');
								html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+time+'</span></p>');
								html.push('</a>');
								html.push('</li>');
							}else if(lr.mold == 0){//头条
								html.push('<li class="bigBox">');
								html.push('<a href="javascript:;" data-url="' + lr.url + '">');
								html.push('<h2>' + lr.title + '</h2>');
								html.push('<div class="imgBox fn-clear"><img src="'+ huoniao.changeFileSize(lr.litpic, "middle") +'" alt=""></div>');
								html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+time+'</span></p>');
								html.push('</a>');
								html.push('</li>');
							}else if(lr.mold == 1){//图集
								if(lr.group_img && lr.group_img.length >= 3 && lr.group_img.length != undefined){//多图
									html.push('<li class="multipleBox">');
									html.push('<a href="javascript:;" data-url="' + lr.url + '">');
									html.push('<h2>' + lr.title + '</h2>');
									html.push('<div class="imgBox fn-clear">');
									var n = 0;
									for (var g = 0; g < lr.group_img.length; g++) {
										var src = huoniao.changeFileSize(lr.group_img[g].path, "small");
										if(src && n < 3) {
											var classlast = '';
											if(n == 2){ 
												classlast = 'last';
											}
											html.push('<div class="mBox '+ classlast +'"><img src="'+src+'" onerror=this.src="'+lr.litpic+'" data-url="' + src + '"></div>');
											n++;
											if(n == 3) break;
										}
									}
									html.push('<span class="Icount">'+ piccount +'图</span>');
									html.push('</div>');
									html.push('<p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+time+'</span></p>');
									html.push('</a>');
									html.push('</li>');
								}else{
									html.push('<li class="singleBox">');
									html.push('<a href="javascript:;" class="fn-clear" data-url="' + lr.url + '">');
									html.push('<div class="aright_"><img src="'+ huoniao.changeFileSize(lr.litpic, "middle") +'"><span class="Icount">'+ piccount +'图</span></div>');
									html.push('<div class="aleft"><h2>' + lr.title + '</h2><p><span>' + lr.source + '</span><span>' + lr.common + '评论<em>·</em>'+time+'</span></div>');
									html.push('</a>');
									html.push('</li>');
								}
							}
						}
                        
                    }
                    $(".search-content ul").append(html.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".search-content ul .loading").remove();
                        $(".search-content ul").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".search-content ul").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".search-content ul").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
            }
        });

	}
	
	// 本地存储的筛选条件
	function getData() {

		var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		atpage = detailList.getLocalStorage()['extraData']['lastIndex'];

		if (filter.typeid != '') {
            $('.searchnav li[data-id="'+filter.typeid+'"]').addClass('active').siblings('li').removeClass('active');
        }
	}
	
});
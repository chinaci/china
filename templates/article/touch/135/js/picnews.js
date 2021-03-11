$(function(){
	var atpage = 1, isload = false, pageSize = 10;

	//导航栏切换
	$('body').on('click', 'nav.nav li',function(){
		$(this).addClass('active').siblings('li').removeClass('active');
		//数据筛选 或者切换
		getList(1);
	})

	//控制图集标题的字数
	$('.imginfoBox li').each(function(){
		//可以先遍历数据中字符长度
		var h = $(this).find('h2');
		var len = h.html().length;
		if(len>16){
			h.text(h.text().slice(0,16))
			h.addClass('more');
		}
	})
    
    var detailList;
    detailList = new h5DetailList();
    setTimeout(function(){detailList.removeLocalStorage();}, 500);

    var dataInfo = {
        id: '',
        url: '',
        typeid: '',
        isBack: true
    };

    $('.imginfoBox').delegate('li', 'click', function(){
        var t = $(this), a = t.find('a'), url = a.attr('data-url');
        var typeid = $('.picnewsnav .active a').attr('data-id');
        
        dataInfo.url = url;
        dataInfo.typeid = typeid;
        
        detailList.insertHtmlStr(dataInfo, $("#picnews").html(), {lastIndex: atpage});
        
        //location.href = url;
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
            $(".imginfoBox ul").html("");
        }

        $(".imginfoBox ul").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
        $(".imginfoBox ul .loading").remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		data.push("mold="+mold);
		
		var typeid = $('.picnewsnav .active a').attr('data-id');
		if(typeid != undefined && typeid != '' && typeid != null){
			data.push("typeid="+typeid);
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
						var piccount = lr.group_img == undefined ? 0 : lr.group_imgnum;

                        var litpic = lr.litpic ? huoniao.changeFileSize(lr.litpic, "middle") : (piccount ? lr.group_img[0].path : '/static/images/blank.gif');

						html.push('<li class="infoBox">');
						html.push('<a href="javascript:;" data-url="' + lr.url + '" class="fn-clear">');
						html.push('<div class="imgbox"><img src="'+litpic+'" /><span class="Icount">'+piccount+'图</span></div>');
						html.push('<div class="infotitle"><h2>' + lr.title.substr(0, 20) + '</h2><span class="num-comment">' + lr.common + '</span></div>');
						html.push('</a>');
						html.push('</li>');
                    }
                    $(".imginfoBox ul").append(html.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".imginfoBox ul .loading").remove();
                        $(".imginfoBox ul").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".imginfoBox ul").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".imginfoBox ul").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
            }
        });

	}
	
    

    // 本地存储的筛选条件
	function getData() {

		var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		atpage = detailList.getLocalStorage()['extraData']['lastIndex'];

		if (filter.typeid != '') {
            $('.picnewsnav li[data-id="'+filter.typeid+'"]').addClass('active').siblings('li').removeClass('active');
        }
	}

});


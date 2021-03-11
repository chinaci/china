$(function(){
	var atpage = 1, isload = false, pageSize = 10;

	//加关注
	$('.videoinfoBox ').on('click','.btn_care',function(){
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

		var id = $(this).attr('data-id');

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+id);

	});

	//点赞
	$('.videoinfoBox').on('click','.numZan',function(e){
        e.preventDefault();

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}
        var num = parseInt($(this).text());
        if($(this).hasClass('al_zan')){
            num = parseInt(num - 1);
            $(this).html(num);
			$(this).removeClass('al_zan');
        }else{
            num = parseInt(num + 1);
            $(this).html(num);
			$(this).addClass('al_zan');
        }

        var uid = $(this).attr('data-uid'), id = $(this).attr('data-id');
        
        $.post("/include/ajax.php?service=member&action=getZan&module=article&temp=detail&id="+id + "&uid=" + uid);
	});

	//导航栏切换
	$('body').on('click', 'nav.nav li',function(){
		$(this).addClass('active').siblings('li').removeClass('active');
		//数据筛选 或者切换
		getList(1);
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

    $('.videoinfoBox').delegate('li', 'click', function(e){
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), mainHtml = $("#videoinfoBox").html();
        var target = $(e.target);

        var typeid = $('.videonav .active a').attr('data-id');
        
        dataInfo.url = url;
        dataInfo.typeid = typeid;

		detailList.insertHtmlStr(dataInfo, mainHtml, {lastIndex: atpage});
		
        if(target.closest("._right").length == 1){//点击id为parentId之外的地方触发

        }else if(target.closest(".btn_care").length == 1){

		}else{
            setTimeout(function(){location.href = url;}, 500);
        }
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
            $(".videoinfoBox ul").html("");
        }

        $(".videoinfoBox ul").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
        $(".videoinfoBox ul .loading").remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		data.push("mold="+mold);
		data.push("get_zan=1");
		
		var typeid = $('.videonav ul .active a').attr('data-id');
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

						html.push('<li class="liBox">');
						html.push('<a href="javascript:;" data-url="' + lr.url + '">');
						html.push('<div class="videoBox">');
						html.push('<h2>' + lr.title + '</h2>');
						html.push('<p class="videoInfo"><span class="numClick">' + lr.click + '</span><span class="videoTime">' + lr.videotime + '</span></p>');
						html.push('<div class="vedioImg"><div class="zhezhao"></div><img  src="'+huoniao.changeFileSize(lr.litpic, "large")+'"/><i></i></div>');
						html.push('</div>');
						html.push('</a>');
						html.push('<div class="up_more">');
                        html.push('<div class="_left">');
                        var uid = lr.admin;
                        if(lr.media != null){
                            uid = lr.media.userid;
                            html.push('<a class="headimgbox" href="' + lr.media.url + '"><img src="'+(lr.media.ac_photo ? huoniao.changeFileSize(lr.media.ac_photo, "small") : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></a>');
                            html.push('<h2><a href="' + lr.media.url + '">' + lr.media.ac_name + '</a></h2>');
                            if(lr.media.isfollow != 2){
                                if(lr.media.isfollow == 1){
                                    html.push('<a href="javascript:;" class="btn_care cared" data-id="' + lr.media.id + '"><s></s>已关注</a>');
                                }else{
                                    html.push('<a href="javascript:;" class="btn_care" data-id="' + lr.media.id + '"><s></s>关注</a>');
                                }
                            }
                        }else{
                            html.push('<a class="headimgbox" href="javascript:;"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></a>');
                            html.push('<h2><a href="javascript:;">' + lr.writer + '</a></h2>');
                        }
						html.push('</div>');
						if(lr.zan==1){
							html.push('<div class="_right"><a href="javascript:;" class="numComment">' + lr.common + '</a><span data-uid="' + uid + '" data-id="' + lr.id + '" class="numZan al_zan">' + lr.zannum + '</span></div>');
						}else{
							html.push('<div class="_right"><a href="javascript:;" class="numComment">' + lr.common + '</a><span data-uid="' + uid + '" data-id="' + lr.id + '" class="numZan">' + lr.zannum + '</span></div>');
						}
						html.push('</div>');
						html.push('</li>');
                    }
                    $(".videoinfoBox ul").append(html.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".videoinfoBox ul .loading").remove();
                        $(".videoinfoBox ul").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".videoinfoBox ul").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".videoinfoBox ul").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
            }
        });

	}
	
    // 本地存储的筛选条件
	function getData() {

		var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		atpage = detailList.getLocalStorage()['extraData']['lastIndex'];

		if (filter.typeid != '') {
            $('.videonav li[data-id="'+filter.typeid+'"]').addClass('active').siblings('li').removeClass('active');
        }
	}

});
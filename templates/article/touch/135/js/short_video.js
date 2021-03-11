$(function(){
	var atpage = 1, isload = false, pageSize = 10;

	//点赞
	$('.shortVideoBox').on('click','._right',function(e){
        e.preventDefault();

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}
        var num = $(this).find('.numZan').text();
        if($(this).find('.numZan').hasClass('onclick')){
            num = parseInt(num - 1);
            $(this).find('.numZan').html(num);
			$(this).find('.numZan').removeClass('onclick');
        }else{
            num = parseInt(num + 1);
            $(this).find('.numZan').html(num);
			$(this).find('.numZan').addClass('onclick');
        }

        var uid = $(this).attr('data-uid'), id = $(this).attr('data-id');
        
        $.post("/include/ajax.php?service=member&action=getZan&module=article&temp=detail&id="+id + "&uid=" + uid);
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

    $('.shortVideoBox').delegate('li', 'click', function(e){
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), mainHtml = $("#shortVideoBox").html();
        var target = $(e.target);

        dataInfo.url = url;
        //dataInfo.typeid = typeid;

        detailList.insertHtmlStr(dataInfo, mainHtml, {lastIndex: atpage});

        if(target.closest("._right").length == 1){//点击id为parentId之外的地方触发

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
			$(".shortVideoBox ul .box1").html("");
			$(".shortVideoBox ul .box2").html("");
        }

        $(".shortVideoBox").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
        $(".shortVideoBox .loading").remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
        data.push("mold="+mold);
        data.push("get_zan=1");
		
		var typeid = $('.picnewsnav ul .active a').attr('data-id');
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
                    var list = data.info.list, pageInfo = data.info.pageInfo, page = pageInfo.page, html = [], html1 = [];
                    var totalPage = data.info.pageInfo.totalPage;
                    for (var i = 0, lr; i < list.length; i++) {
                        lr = list[i];
                        var time = returnHumanTime(lr.pubdate,3);
						var piccount = lr.group_img == undefined ? 0 : lr.group_imgnum;

						if(i%2==0){
							html.push('<li class="liBox">');
							html.push('<a href="javascript:;" data-url="' + lr.url + '">');
							html.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(lr.litpic, "large")+'" /></div>');
							html.push('<div class="videoInfo">');
							html.push('<h2>' + lr.title + '</h2>');
                            html.push('<div class="up_more">');
                            var uid = lr.admin;
                            if(lr.media != null){
                                uid = lr.media.userid;
                                html.push('<div class="_left"><div class="headimgbox"><img src="'+(lr.media.ac_photo ? huoniao.changeFileSize(lr.media.ac_photo, "large") : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></div><h2>'+lr.media.ac_name+'</h2></div>');
                            }else{
                                html.push('<div class="_left"><div class="headimgbox"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></div><h2>'+lr.writer+'</h2></div>');
                            }
                            if(lr.zan==1){
                                html.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan onclick">' + lr.zannum + '</span></div>');
                            }else{
                                html.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan">' + lr.zannum + '</span></div>');
                            }
							html.push('</div>');
							html.push('</div>');
							html.push('</a>');
							html.push('</li>');
						}else{
							html1.push('<li class="liBox">');
							html1.push('<a href="javascript:;" data-url="' + lr.url + '">');
							html1.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(lr.litpic, "large")+'" /></div>');
							html1.push('<div class="videoInfo">');
							html1.push('<h2>' + lr.title + '</h2>');
                            html1.push('<div class="up_more">');
                            var uid = lr.admin;
                            if(lr.media != null){
                                uid = lr.media.userid;
                                html1.push('<div class="_left"><div class="headimgbox"><img src="'+huoniao.changeFileSize(lr.media.ac_photo, "large")+'" alt=""></div><h2>'+lr.media.ac_name+'</h2></div>');
                            }else{
                                html1.push('<div class="_left"><div class="headimgbox"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></div><h2>'+lr.writer+'</h2></div>');
                            }
                            if(lr.zan==1){
                                html1.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan onclick">' + lr.zannum + '</span></div>');
                            }else{
                                html1.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan">' + lr.zannum + '</span></div>');
                            }
							html1.push('</div>');
							html1.push('</div>');
							html1.push('</a>');
							html1.push('</li>');
						}
						
                    }
					$(".shortVideoBox ul.box1").append(html.join(""));
					$(".shortVideoBox ul.box2").append(html1.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".shortVideoBox .loading").remove();
                        $(".shortVideoBox").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".shortVideoBox").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".shortVideoBox").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
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
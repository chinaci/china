$(function () {
    var isload = false;

    getList();

    function  getList(){
        var data = [];
        data.push("page="+page);
        data.push("pageSize="+pageSize);
        data.push("filter="+typeid);
        data.push("istype=3");

        isload = true;
        if(page == 1){
            $(".loading").html('<span>'+langData['marry'][5][22]+'</span>');
        }else{
            $(".loading").html('<span>'+langData['marry'][5][22]+'</span>');
        }

        $.ajax({
            url: masterDomain + "/include/ajax.php?service=marry&action=storeList&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        //var detailsUrl = detailUrl.replace("%id%", list[i].id);
                        //html.push('<li class="fn-clear"><a href="'+detailsUrl+'">');
                        html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
                        var pic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
                        html.push('<div class="img-box"><img src="'+pic+'" alt=""></div>');
                        html.push('<div class="info">');
                        html.push('<p class="name">'+list[i].title+'</p>');
                        html.push('<p class="price"><span><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span> '+langData['marry'][0][6]+'</p>');
                        html.push('<p class="tel-num">'+langData['marry'][0][19]+'：'+list[i].tel+'</p>');
                        html.push('<p class="addr">'+langData['marry'][0][20]+'：'+list[i].address+'</p>');
                        html.push('</div>');
                        html.push('<span class="tel" data-tel="'+list[i].tel+'"></span>');
                        html.push('</a></li>');
                    }
                    if(page == 1){
                        $(".container ul").html(html.join(""));
                    }else{
                        $(".container ul").append(html.join(""));
                    }
                    isload = false;

                    if(page >= pageinfo.totalPage){
                        isload = true;
                        $(".loading").html('<span>'+langData['marry'][5][29]+'</span>');
                    }
                }else{
                    if(page == 1){
                        $(".container ul").html("");
                    }
                    $(".loading").html('<span>'+data.info+'</span>');
                }
            },
            error: function(){
                isload = false;
                if(page == 1){
                    $(".container ul").html("");
                }
                //网络错误，加载失败
                $(".loading").html('<span>'+langData['marry'][5][23]+'</span>');
            }
        });

    }

    //滚动底部加载
    $(window).scroll(function() {
        var sh = $('.container .loading').height();
        var allh = $('body').height();
        var w = $(window).height();
        var s_scroll = allh - sh - w;
        if ($(window).scrollTop() > s_scroll && !isload) {
            page++;
            getList();
        };
    });



});
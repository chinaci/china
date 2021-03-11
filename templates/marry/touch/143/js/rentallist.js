$(function () {
    var isload = false;

    getList();

    function  getList(){
        var data = [];
        data.push("page="+page);
        data.push("pageSize="+pageSize);

        isload = true;
        if(page == 1){
            $(".loading").html('<span>'+langData['marry'][5][22]+'</span>');
        }else{
            $(".loading").html('<span>'+langData['marry'][5][22]+'</span>');
        }

        $.ajax({
            url: masterDomain + "/include/ajax.php?service=marry&action=rentalList&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
                        var pic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
                        html.push('<div class="img-box"><img src="'+pic+'" alt=""></div>');
                        html.push('<div class="info">');
                        html.push('<p class="name">'+list[i].title+'</p>');
                        html.push('<p class="gl">'+list[i].duration+langData['marry'][1][1]+' '+list[i].kilometre+langData['marry'][1][2]+'</p>');
                        html.push('<p class="price"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</p>');
                        html.push('</div>');
                        html.push('<span class="tel" data-tel="'+list[i].store['tel']+'"></span>');
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
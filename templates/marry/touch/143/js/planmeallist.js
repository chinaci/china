$(function () {
    var isload = false;

    getList();

    function  getList(){
        var data = [];
        data.push("page="+page);
        data.push("pageSize="+pageSize);
        data.push("store="+storeId);
        data.push("type="+type);
        data.push("istype="+istype);
        data.push("businessid="+businessid);

        isload = true;
        if(page == 1){
            $(".loading").html('<span>'+langData['marry'][5][22]+'</span>');
        }else{
            $(".loading").html('<span>'+langData['marry'][5][22]+'</span>');
        }

        $.ajax({
            url: masterDomain + "/include/ajax.php?service=marry&action=planmealList&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
                        html.push('<div class="img-box fn-left">');
                        var pic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
                        html.push('<img src="'+pic+'" alt="">');
                        for(var m=0;m<list[i].tagAll.length;m++){
                            if(m == 0){
                                html.push('<i class="'+list[i].tagAll[m].py+'"></i>');
                            }else if(m == 1){
                                html.push('<i class="'+list[i].tagAll[m].py+'"></i>');
                            }else if(m == 2){
                                html.push('<i class="'+list[i].tagAll[m].py+'"></i>');
                            }
                        }
                        html.push('</div>');
                        html.push('<div class="info">');
                        html.push('<p class="name">'+list[i].title+'</p>');
                        html.push('<p class="price"><i>'+echoCurrency('symbol')+'</i>'+list[i].price+'  </p>');
                        html.push('</div>');
                        html.push('</a></li>');
                    }
                    if(page == 1){
                        $(".meal ul").html(html.join(""));
                    }else{
                        $(".meal ul").append(html.join(""));
                    }
                    isload = false;

                    if(page >= pageinfo.totalPage){
                        isload = true;
                        $(".loading").html('<span>'+langData['marry'][5][29]+'</span>');
                    }
                }else{
                    if(page == 1){
                        $(".meal ul").html("");
                    }
                    $(".loading").html('<span>'+data.info+'</span>');
                }
            },
            error: function(){
                isload = false;
                if(page == 1){
                    $(".meal ul").html("");
                }
                //网络错误，加载失败
                $(".loading").html('<span>'+langData['marry'][5][23]+'</span>');
            }
        });

    }

    //滚动底部加载
    $(window).scroll(function() {
        var sh = $('.meal .loading').height();
        var allh = $('body').height();
        var w = $(window).height();
        var s_scroll = allh - sh - w;
        if ($(window).scrollTop() > s_scroll && !isload) {
            page++;
            getList();
        };

    });

});
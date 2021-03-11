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
            url: masterDomain + "/include/ajax.php?service=marry&action=hostList&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li><a href="'+list[i].url+'">');
                        html.push('<div class="msg fn-clear">');
                        var pic = list[i].photoSource != "" && list[i].photoSource != undefined ? huoniao.changeFileSize(list[i].photoSource, "small") : "/static/images/noPhoto_40.jpg";
                        html.push('<div class="img-box"><img src="'+pic+'" alt=""></div>');
                        html.push('<div class="info">');
                        html.push('<p class="name">'+list[i].hostname+'</p>');
                        html.push('<p class="tel">'+langData['marry'][1][7]+': '+list[i].tel+'</p>');
                        html.push('</div>');
                        html.push('<span class="price"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span>');
                        html.push('</div>');
                        if(list[i].workArr.length > 0){
                            html.push('<div class="imgs">');
                            for(var m=0;m<list[i].workArr.length;m++){
                                html.push('<div class="imgs-item"><img src="'+huoniao.changeFileSize(list[i].workArr[m]['litpicSource'], "small")+'" alt=""></div>');
                            }
                            html.push('</div>');
                        }
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
        //服务列表
        if ($(window).scrollTop() > s_scroll && !isload) {
            page++;
            getList();
        };

    });

    // 回到顶部
    $(window).scroll(function(){
        var this_scrollTop = $(this).scrollTop();
        if(this_scrollTop>200 ){
            $(".top").show();
        }else {
            $(".top").hide();
        }
    });
    
});
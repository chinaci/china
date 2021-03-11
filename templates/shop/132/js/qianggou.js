$(function(){
    //导航全部分类
    // $(".lnav").find('.category-popup').hide();

    // $(".lnav").hover(function(){
    //     $(this).find(".category-popup").show();
    // }, function(){
    //     $(this).find(".category-popup").hide();
    // });

    // //鼠标经过

    $('.qgoubox').delegate('.good_box','mouseover',function (e) {
        $(this).find('.qprobox').hide();
        $(this).find('.btnbox').show();
        // e.stopPropagation();
    });
    $('.qgoubox').delegate('.good_box','mouseleave',function (e) {
        $(this).find('.qprobox').show();
        $(this).find('.btnbox').hide();
        e.stopPropagation();
        // return false;
    });

    //领券导航切换
    var linextHour = '';
    $('.txtScroll-left .bd ul').delegate('li','click',function () {
        var t = $(this);
        if( !t.hasClass('on') ){
            linextHour = t.attr("data-time");
            getDateList(linextHour,1);
            t.addClass('on');
            t.siblings().removeClass('on');
        }
    });


    //倒计时一次请求

    $.ajax({
        url: "/include/ajax.php?service=shop&action=systemTime",
        type: "GET",
        dataType: "jsonp",
        success:function (data) {
            var list = data.info.list,nowTime = data.info.nowTime,now = data.info.now;
            for(var i = 0; i < list.length; i++){
                if(now ==list[i].nowTime){
                    var nextHour = list[i].nextHour;
                    var nowTime = data.info.nowTime;
                    var intDiff = nextHour - nowTime;
                    // console.log(intDiff);
                    window.setInterval(function(){
                        i = i < 0 ? 9 : i;
                        // $(obj).find(".ms").text(i);
                        $('.daojishi').find(".hm").text('0'+i);
                        i--;
                    }, 100);

                    function timer(intDiff){
                        window.setInterval(function(){
                            var hour=0,
                                minute=0,
                                second=0;//时间默认值
                            if(intDiff > 0){
                                var hour = Math.floor((intDiff / 3600) % 24);
                                var minute = Math.floor((intDiff / 60) % 60);
                                var second = Math.floor(intDiff % 60);
                            }

                            $('.daojishi').find(".h").text(hour < 10 ? "0" + hour : hour);
                            $('.daojishi').find(".m").text(minute < 10 ? "0" + minute : minute);
                            $('.daojishi').find(".s").text(second < 10 ? "0" + second : second);
                            intDiff--;
                        }, 1000);
                    }
                    timer(intDiff);

                }
            }
        }
    });


    var navHeight = $('.navlist').offset().top;
    getDateList();
    function getDateList(time,tr){
        if(tr){
            atpage = 1;
            $(".qgoubox").html("");
        }
        $(".glistbox .loading").remove();
        $.ajax({
            url: "/include/ajax.php?service=shop&action=systemTime&num=9",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                // console.log(data);
                if(data.state == 100){
                    var list = data.info.list, now = data.info.now, nowTime = data.info.nowTime, html = [], className='';

                    if(list.length > 0){
                        for(var i = 0; i < list.length; i++){

                            if(now == list[i].nowTime){
                                var textname = '';
                                if(now == list[i].nowTime){
                                    textname = '已开抢';
                                    var nextHour = list[i].nextHour;
                                    nowIdexTime  = list[i].nextHour;
                                    if(list[i].nextHour==time){
                                        className='on';
                                    }else if((time=='' || time==undefined) && now == list[i].nowTime){
                                        className='on';
                                    }else{
                                        className='';
                                    }
                                }else{
                                    textname = '即将开抢';
                                }
                                html.push('<li class="'+className+'"   data-hour="'+list[i].nowTime+'" data-time="'+list[i].nextHour+'" ><p>'+list[i].showTime+'</p><span>'+textname+'</span></li>');
                            }else {
                                var textname = '';
                                if(now == list[i].nowTime){
                                    textname = '已开抢';
                                    var nextHour = list[i].nextHour;
                                    nowIdexTime  = list[i].nextHour;
                                }else{
                                    textname = '即将开抢';
                                    if(list[i].nextHour==time){
                                        className='on';
                                    }else{
                                        className='';
                                    }
                                }
                                html.push('<li class="'+className+'"   data-hour="'+list[i].nowTime+'" data-time="'+list[i].nextHour+'" ><p>'+list[i].showTime+'</p><span>'+textname+'</span></li>');
                            }
                        }
                    }
                    $(".navlist .bd ul").html(html.join(""));
                    $(".txtScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",scroll:9,vis:9,pnLoop:false,trigger:"click"});

                    // $(".navlist").slide({  titCell:".hd ul", autoPage:true });

                    var parm = [];
                    if(time!='' && time!=undefined){
                        nextHour = time;
                    }
                    parm.push("page="+atpage);
                    $(".qgoubox").append('<div class="loading">加载中...</div>');
                    $.ajax({
                        url: "/include/ajax.php?service=shop&action=slist&limited=4&time="+nextHour+"&pageSize="+pageSize,
                        type: "GET",
                        data: parm.join("&"),
                        dataType: "jsonp",
                        success: function (data) {
                            $('.qgoubox .loading').remove();
                            if(data && data.state == 100 && data.info.list.length > 0){
                                var list = data.info.list, ggoodboxhtml = [], html = [];
                                if(list.length > 0){
                                    for(var i = 0; i < list.length; i++){
                                        // if(i==0 && atpage==1){
                                        ggoodboxhtml.push('<div class="good_box">');
                                        ggoodboxhtml.push('<a target="_blank" href="'+list[i].url+'">');
                                        ggoodboxhtml.push('<div class="main_box fn-clear">');
                                        ggoodboxhtml.push('<div class="imgbox"><img src="'+staticPath+'images/blank.gif" data-url="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" alt=""></div>');
                                        ggoodboxhtml.push('<div class="txtbox">');
                                        //ggoodboxhtml.push('<div class="info"><h4>'+list[i].title+'</h4><p class="fn-clear"><i class="mark1"></i>前30分钟立减300元</p><p class="fn-clear"><i class="mark2"></i>送美的扫地机</p></div>');
                                        ggoodboxhtml.push('<div class="info"><h4>'+list[i].title+'</h4></div>');
                                        ggoodboxhtml.push('<div class="pricebox"><span class="nprice"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span><span class="yprice"><em>'+echoCurrency('symbol')+'</em>'+list[i].mprice+'</span></div>');

                                        var textName = '';
                                        var titName ='';
                                        if(list[i].states==1){
                                            textName = '查看详情';
                                            titName ='距开始';
                                            // ggoodboxhtml.push('<div class="qtstart">'+list[i].statesname+list[i].statestime+' 开启</div>');
                                        }else{
                                            textName = '立即抢购';
                                            titName ='距结束';

                                            var width = ((list[i].sales/list[i].inventory)*100).toFixed(0);

                                            ggoodboxhtml.push('<div class="qprobox fn-clear"><div class="qprogress"><s style="width:'+width+'%"></s> <span>已抢'+list[i].sales+'件</span></div> <span class="state">正在热抢 !</span></div>');
                                        }
                                        ggoodboxhtml.push('<div class="btnbox fn-clear"><em href="'+list[i].url+'" class="gobuying">'+textName+'</em> <div class="daojishi">'+titName+'<span class="h">00</span>:<span class="m">00</span>:<span class="s">00</span></div></div>');

                                        ggoodboxhtml.push('</div>');
                                        ggoodboxhtml.push('</div></a>');
                                        ggoodboxhtml.push('</div>');

                                    }
                                    $(".qgoubox").append(ggoodboxhtml.join(""));
                                    totalCount = data.info.pageInfo.totalCount;
                                    showPageInfo();
                                    $("img").scrollLoading();

                                    if(ggoodboxhtml.length<1 && atpage==1){
                                        $('.qgoubox').hide();
                                    }else{
                                        $('.qgoubox').show();
                                    }
                                    $('.djs').removeClass('opacity');

                                }else{
                                    $(".qgoubox").append('<div class="loading">暂无相关信息</div>');
                                }
                            }else{
                                $(".qgoubox").append('<div class="loading">暂无相关信息</div>');
                                $("#mod-item .pagination").html("").hide();
                                $('.djs').addClass('opacity');
                            }
                        },
                        error: function(){
                            $('.djs').addClass('opacity');
                            $('.qgoubox').html('<div class="loading">'+langData['siteConfig'][20][227]+'</div>');
                        }


                    });
                }
            }
        });
    }

    //时间轴吸顶
    $(window).scroll(function() {
        if ($(window).scrollTop() > navHeight) {
             $('.navlist').addClass('topfixed');
        } else {
             $('.navlist').removeClass('topfixed');
        }
    });


    //打印分页
    function showPageInfo() {
        var info = $("#mod-item .pagination");
        var nowPageNum = atpage;
        var allPageNum = Math.ceil(totalCount/pageSize);

        var pageArr = [];

        info.html("").hide();

        var pageList = [];
        //上一页
        if(atpage > 1){
            pageList.push('<a href="javascript:;" class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></a>');
        }else{
            pageList.push('<span class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></span>');
        }

        //下一页
        if(atpage >= allPageNum){
            pageList.push('<span class="pg-next"><span class="text">下一页</span><i class="trigger"></i></span>');
        }else{
            pageList.push('<a href="javascript:;" class="pg-next"><span class="text">下一页</span><i class="trigger"></i></a>');
        }

        //页码统计
        pageList.push('<span class="sum"><em>'+atpage+'</em>/'+allPageNum+'</span>');

        $("#bar-area .pagination").html(pageList.join(""));

        var pages = document.createElement("div");
        pages.className = "pagination-pages fn-clear";
        info.append(pages);

        //拼接所有分页
        if (allPageNum > 1) {

            //上一页
            if (nowPageNum > 1) {
                var prev = document.createElement("a");
                prev.className = "prev";
                prev.innerHTML = '上一页';
                prev.setAttribute('href','#');
                prev.onclick = function () {
                    atpage = nowPageNum - 1;
                    $("#mod-item .qgoubox").empty();
                    getDateList(linextHour,'');
                }
                info.find(".pagination-pages").append(prev);
            }

            //分页列表
            if (allPageNum - 2 < 1) {
                for (var i = 1; i <= allPageNum; i++) {
                    if (nowPageNum == i) {
                        var page = document.createElement("span");
                        page.className = "curr";
                        page.innerHTML = i;
                    } else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.setAttribute('href','#');
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            $("#mod-item .qgoubox").empty();
                            getDateList(linextHour,'');
                        }
                    }
                    info.find(".pagination-pages").append(page);
                }
            } else {
                for (var i = 1; i <= 2; i++) {
                    if (nowPageNum == i) {
                        var page = document.createElement("span");
                        page.className = "curr";
                        page.innerHTML = i;
                    }
                    else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.setAttribute('href','#');
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            $("#mod-item .qgoubox").empty();
                            getDateList(linextHour,'');
                        }
                    }
                    info.find(".pagination-pages").append(page);
                }
                var addNum = nowPageNum - 4;
                if (addNum > 0) {
                    var em = document.createElement("span");
                    em.className = "interim";
                    em.innerHTML = "...";
                    info.find(".pagination-pages").append(em);
                }
                for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                    if (i > allPageNum) {
                        break;
                    }
                    else {
                        if (i <= 2) {
                            continue;
                        }
                        else {
                            if (nowPageNum == i) {
                                var page = document.createElement("span");
                                page.className = "curr";
                                page.innerHTML = i;
                            }
                            else {
                                var page = document.createElement("a");
                                page.innerHTML = i;
                                page.setAttribute('href','#');
                                page.onclick = function () {
                                    atpage = Number($(this).text());
                                    $("#mod-item .qgoubox").empty();
                                    getDateList(linextHour,'');
                                }
                            }
                            info.find(".pagination-pages").append(page);
                        }
                    }
                }
                var addNum = nowPageNum + 2;
                if (addNum < allPageNum - 1) {
                    var em = document.createElement("span");
                    em.className = "interim";
                    em.innerHTML = "...";
                    info.find(".pagination-pages").append(em);
                }
                for (var i = allPageNum - 1; i <= allPageNum; i++) {
                    if (i <= nowPageNum + 1) {
                        continue;
                    }
                    else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.setAttribute('href','#');
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            $("#mod-item .qgoubox").empty();
                            getDateList(linextHour,'');
                        }
                        info.find(".pagination-pages").append(page);
                    }
                }
            }

            //下一页
            if (nowPageNum < allPageNum) {
                var next = document.createElement("a");
                next.className = "next";
                next.innerHTML = '下一页';
                next.setAttribute('href','#');
                next.onclick = function () {
                    atpage = nowPageNum + 1;
                    $("#mod-item .qgoubox").empty();
                    getDateList(linextHour,'');
                }
                info.find(".pagination-pages").append(next);
            }

            //输入跳转
            var insertNum = Number(nowPageNum + 1);
            if (insertNum >= Number(allPageNum)) {
                insertNum = Number(allPageNum);
            }

            var redirect = document.createElement("div");
            redirect.className = "redirect";
            redirect.innerHTML = '<i>到</i><input id="prependedInput" type="number" placeholder="页码" min="1" max="'+allPageNum+'" maxlength="4"><i>页</i><button type="button" id="pageSubmit">确定</button>';
            info.find(".pagination-pages").append(redirect);

            //分页跳转
            info.find("#pageSubmit").bind("click", function(){
                var pageNum = $("#prependedInput").val();
                if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
                    atpage = Number(pageNum);
                    $("#mod-item .qgoubox").empty();
                    getDateList(linextHour,'');
                } else {
                    $("#prependedInput").focus();
                }
            });

            info.show();

        }else{
            info.hide();
        }
    }


})

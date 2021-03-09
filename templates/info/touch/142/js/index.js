$(function () {
  var device = navigator.userAgent;
    if(device.indexOf('huoniao') > -1){
      $('.areaChose').bind('click', function(e){
        e.preventDefault();
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('goToCity', {'module': 'info'}, function(){});
        });
      });
    }
    //APP端取消下拉刷新
    toggleDragRefresh('off');
    // banner轮播图
    new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination',} ,slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:{delay: 2000,}});
   // 搜索
    $(".inp").delegate("#search","click",function(){
        $("#myForm").submit();
    });

    // 滑动导航
    var t = $('.tcInfo .swiper-wrapper');
    var swiperNav = [], mainNavLi = t.find('li');
    for (var i = 0; i < mainNavLi.length; i++) {
        swiperNav.push('<li>'+t.find('li:eq('+i+')').html()+'</li>');
    }

    var liArr = [];
    for(var i = 0; i < swiperNav.length; i++){
        liArr.push(swiperNav.slice(i, i + 10).join(""));
        i += 9;
    }

    t.html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');
    new Swiper('.tcInfo .swiper-container', {pagination: {el:'.tcInfo .pagination',}, loop: false, grabCursor: true, paginationClickable: true});

    var huoniao_ = {
        //转换PHP时间戳
        transTimes: function(timestamp, n){
            update = new Date(timestamp*1000);//时间戳要乘1000
            year   = update.getFullYear();
            month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
            day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
            hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
            minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
            second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
            if(n == 1){
                return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
            }else if(n == 2){
                return (year+'-'+month+'-'+day);
            }else if(n == 3){
                return (month+'-'+day);
            }else if(n == 4){
                return (month+'/'+day);
            }else{
                return 0;
            }
        },
        //转化天数
        getDays : function(timestamp){
            update   = parseInt(timestamp);//时间戳
            days     = Math.abs(parseInt((nowtime - update)/86400));
            return days;
        }
    }



    //滚动信息 最新入驻
    gettcNews();
    function gettcNews(){
        $.ajax({
            url : "/include/ajax.php?service=info&action=shopList",
            type : "GET",
            data : {},
            dataType : "json",
            success : function (data) {
                var obj = $(".mBox .swiper-wrapper");
                if(data.state == 100){
                    var list = data.info.list;

                    var html = [];
                    html.push('<li class="swiper-slide swiper-no-swiping">');
                    var length = list.length;
                    for (var i = 0; i < length; i++){
                        html.push('<p><em>'+huoniao_.transTimes(list[i].jointime, 4)+'</em> '+langData['info'][1][0]+'<span>'+list[i].user.company+'</span>'+langData['info'][1][1]+' </p>');
                        if((i + 1) % 2 == 0 && i + 1 < list.length){
                            html.push('</li>');
                            html.push('<li class="swiper-slide swiper-no-swiping">');
                        }
                    }
                    obj.html(html.join(""));
                    new Swiper('.mBox', {direction: 'vertical', pagination: { el: '.tcNews .pagination'},loop: true,autoplay: {delay: 2000},observer: true,observeParents: true,disableOnInteraction: false});
                }
            }
        });
    }


    //点赞
    $('.container').on('click','.numZan',function(e){
        e.preventDefault();
        var id = $(this).attr('data-id'), infotype = $(this).attr('data-type'), type = '', collecttxt = '';
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
            type = 'del';
        }else{
            num = parseInt(num + 1);
            $(this).html(num);
            $(this).addClass('al_zan');
            type = 'add';
        }
        var temps = 'detail';
        if(infotype == 1){
            temps = 'detail';
        }else if(infotype == 2){
            temps = 'shop';
        }
        $.post("/include/ajax.php?service=member&action=collect&module=info&temp="+temps+"&type="+type+"&id="+id,{},function(res){
            var res = JSON.parse(res);
            if(res.state == 100){
                if(type == 'del'){
                    collecttxt = langData['info'][1][8];//已取消收藏
                }else{
                    collecttxt = langData['info'][1][9];//您已收藏
                }
            }else{
                collecttxt = langData['info'][1][2];//请求出错请刷新重试
            }

            $.dialog({
                type : 'info',
                contentHtml : '<p class="info-text">'+collecttxt+'</p>',
                autoClose : 1000
            });
        });
    });

    //左右导航切换(推荐信息、推荐店铺)
    var loadMoreLock = false;
    var tabsSwiper = new Swiper('#tabs-container',{
        speed:350,
        touchAngle : 35,
        observer: true,
        observeParents: true,
        freeMode : false,
        longSwipesRatio : 0.1,
        on: {
            slideChangeTransitionStart: function(){

                var recomTab = $('.recomTab');

                $(".recomTab .active").removeClass('active');
                $(".recomTab li").eq(tabsSwiper.activeIndex).addClass('active');

                $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());
                getList();

            },
        },

    })

    $(".recomTab li").on('touchstart mousedown',function(e){
        e.preventDefault();
        $(".recomTab .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo( $(this).index() );
    });
    var tabHeight = 　1024;

    //导航吸顶
    $(window).scroll(function() {
        var sct = $(window).scrollTop();
        if ($(window).scrollTop() > tabHeight) {
            $('.recomTab').addClass('topfixed');
        } else {
            $('.recomTab').removeClass('topfixed');
        }

        var sh = 50;
        var allh = $('body').height();
        var w = $(window).height();
        var s_scroll = allh - sh - w;

        if ($(window).scrollTop() > s_scroll && !loadMoreLock) {
            var page = parseInt($('.recomTab .active').attr('data-page')),
                totalPage = parseInt($('.recomTab .active').attr('data-totalPage'));
            if (page < totalPage) {
                ++page;
                loadMoreLock = true;
                $('.recomTab .active').attr('data-page', page);
                getList();
            }
        }
    });



    //推荐商家
    getrecomList();
    function getrecomList(){
        $.ajax({
            url:masterDomain+"/include/ajax.php?service=info&action=shopList",
            data : {
                'orderby' : 1,
                'pagesize' : 5,
                'page' : 1,
            },
            type : 'get',
            dataType : 'jsonp',
            success:function (data) {
                if(data && data.state == 100){
                    var datalist = data.info.list;
                    var list;
                    for(var i=0;i<datalist.length;i++){
                        list = '<li><a href="'+datalist[i].url+'"><div class="img-box"><img src="'+datalist[i].user['photo']+'" alt=""></div><p class="name">'+datalist[i].user['company']+'</p><p class="tab"><span>'+datalist[i].typename+'</span></p></a></li>';
                        $(".store .storelist").append(list);
                    }
                }else {
                    $('.store .storelist').append('<div class="loading">'+data.info+'</div>');
                }
            },
            error: function(){
                $('.store .storelist').html(langData['info'][1][2]);//请求出错请刷新重试
            }
        });
    }

    // 最新发布
    getList();
    function getList() {
        var active = $('.recomTab .active'), action = active.attr('data-id'), url;
        var page = active.attr('data-page');
        if (action == 1) {
            if(page == 1){
                $(".new").html('<div class="loading"><i class="icon-loading"></i>'+langData['info'][1][3]+'</div>');
            }
            url =  masterDomain + "/include/ajax.php?service=info&action=ilist_v2&orderby=1&page="+page+"&pageSize="+pageSize +"";
        }else if(action == 3){
            if(page == 1){
                $(".recommend").html('<div class="loading"><i class="icon-loading"></i>'+langData['info'][1][3]+'</div>');
            }
            url =  masterDomain + "/include/ajax.php?service=info&action=shopList&page="+page+"&pageSize="+pageSize +"";
        }else if(action == 2){
            if(page == 1){
                $(".hot").html('<div class="loading"><i class="icon-loading"></i>'+langData['info'][1][3]+'</div>');
            }
            url =  masterDomain + "/include/ajax.php?service=info&action=ilist_v2&fire=1&page="+page+"&pageSize="+pageSize +"";
        }

        loadMoreLock = true;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "jsonp",
            success:function (data) {
                if(data && data.state == 100){
                    $(".loading").remove();
                    $(".empty").remove();
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo, page = pageinfo.page;
                    var totalPage = data.info.pageInfo.totalPage;
                    active.attr('data-totalPage', totalPage);
                    for(var i =0; i<list.length;i++){
                        if (action == 1 || action == 2) {
                            //html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
                            //信息过期
                            if (list[i].isvalid ==1) {
                                html.push('<li class="fn-clear over_li"><a href="'+list[i].url+'">');
                            }else{
                                html.push('<li class="fn-clear "><a href="'+list[i].url+'">');
                            }
                            var photo = list[i].member == null ? templatePath+'images/noavatar_middle.gif' : (list[i].member.photo == null ? templatePath+'images/noavatar_middle.gif' : list[i].member.photo);
                            html.push('<div class="userimg "><img src="'+photo+'" alt=""></div>');
                            html.push('<div class="info_r ">');
                            var nickname = list[i].member == null ? langData['info'][1][4] : (list[i].member.nickname == null ? langData['info'][1][4] : list[i].member.nickname);//匿名
                            html.push('<h4 class="fn-clear"><span>'+nickname+'</span> ');
                            if(list[i].is_shop == 0){
                                html.push('<i class="panel_tab">'+langData['info'][1][5]+'</i>');//个人
                            }else if(list[i].is_shop == 1){
                                html.push('<i class="com_tab"></i>');
                            }
                            if(list[i].price_switch==0){
                                if(list[i].price==0){
                                    html.push('<span class="price fn-right">'+langData['info'][2][30]+'</span>');
                                }else{
                                    html.push('<span class="price fn-right"><i>'+echoCurrency('symbol')+'</i>'+list[i].price+'</span>');
                                }
                            }
                            html.push('</h4>');

                            html.push('<p class="con" style="color:'+(list[i].color?list[i].color:"")+'; font-weight:'+(list[i].titleBlod=="1"?"bold":"normal")+'">');
                            // 置顶
                            if(list[i].isbid == 1){
                                html.push('<i class="top_tab"></i>');
                            }
                            html.push('<span class="type" >#<em>'+list[i].typename+'</em>#</span>'+list[i].title+'</p>');
                            if(list[i].video){
                                html.push(' <div class="item-box video-box commonimg">');
                                html.push('<img data-video="'+list[i].video+'" onerror="this.src=\''+list[i].litpic+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].litpic+'" alt="">');
                                html.push('<i class="play"></i>');
                                html.push('</div>');
                            }else if(list[i].pcount<=5){
                                html.push('<div class="item-box img-box">');
                                for(var m=0;m<list[i].picArr.length;m++){
                                    html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].picArr[m]['litpic']+'" alt=""></div>');
                                }
                                html.push('</div>');
                            }else {
                                html.push('<div class="item-box img-box">');
                                for(var m=0;m<list[i].picArr.length;m++){
                                    if(m == 5){
                                        html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].picArr[m]['litpic']+'" alt=""> <i>+'+list[i].pcount+'</i></div>');
                                    }else{
                                        html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].picArr[m]['litpic']+'" alt=""></div>');
                                    }
                                }
                                html.push('</div>');
                            }
                            html.push(' <p class="area"><span href=""><i class="icon_area"></i>'+list[i].address+'</span></p>');
                            html.push('<div class="msg fn-clear">');
                            var data1 = huoniao.transTimes(list[i].pubdate,4);
                            html.push(' <div class="_left fn-left"><span>'+data1+'</span><span class="point">·</span>'+langData['info'][1][6]+list[i].click+'</div>');
                            var al_zant = '';
                            if(list[i].collect){
                                al_zant = 'al_zan';
                            }
                            html.push(' <div class="_right fn-right"><span data-type="1" data-id="'+list[i].id+'" class="numZan '+al_zant+'">'+list[i].collectnum+'</span><span href="javascript:;" class="numComment">'+list[i].common+'</span></div>');
                            html.push('</div>');
                            html.push('</div>');
                            //信息过期标识
                            if (list[i].isvalid ==1) {
                                html.push('<i class="over_icon"></i>');
                            }
                            html.push('</a></li>');
                        }else{
                            html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
                            var photo = list[i].user.photo == null ? templatePath+'images/noavatar_middle.gif' : list[i].user.photo;
                            html.push('<div class="userimg "><img src="'+photo+'" alt=""></div>');
                            html.push('<div class="info_r ">');
                                var nickname = list[i].user.nickname == null ? langData['info'][1][4] : list[i].user.nickname;//匿名
                                html.push('<h4 class="fn-clear"><span>'+nickname+'</span> ');
                                html.push('<i class="com_tab"></i>');
                                html.push('</h4>');
                                html.push('<p class="con">');
                                // 置顶
                                if(list[i].top == 1){
                                    html.push('<i class="top_tab"></i>');
                                }
                                html.push('<span class="type" >#<em>'+list[i].typename+'</em>#</span>'+list[i].notes+'</p>');
                                if(list[i].video){
                                    html.push(' <div class="item-box video-box commonimg">');
                                    var pic = list[i].video_pic ? list[i].video_pic : huoniao.changeFileSize(list[i].pics[0], "small");
                                    html.push('<img data-video="'+list[i].video+'" src="'+pic+'" alt="">');
                                    html.push('<i class="play"></i>');
                                    html.push('</div>');
                                }else if(list[i].pcount<=5){
                                    html.push('<div class="item-box img-box">');
                                    for(var m=0;m<list[i].pics.length;m++){

                                        html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].pics[m]+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].pics[m]+'" alt=""></div>');
                                    }
                                    html.push('</div>');
                                }else {
                                    html.push('<div class="item-box img-box">');
                                    for(var m=0;m<list[i].pics.length;m++){
                                        if(m == 5){
                                            html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].pics[m]+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].pics[m]+'" alt=""> <i>+'+list[i].pcount+'</i></div>');
                                        }else{
                                            html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].pics[m]+'\'; this.onerror=this.src=\'/static/images/404.jpg\';" src="'+list[i].pics[m]+'" alt=""></div>');
                                        }
                                    }
                                    html.push('</div>');
                                }
                                html.push(' <p class="area"><span href=""><i class="icon_area"></i>'+list[i].address+'</span></p>');
                                html.push('<div class="msg fn-clear">');
                                var data1 =  huoniao_.getDays(list[i].jointime);
                                html.push(' <div class="_left fn-left"><span>'+langData['info'][1][16]+data1+langData['info'][1][17]+'</span><span class="point">·</span>'+langData['info'][1][6]+list[i].click+'</div>');
                                var al_zant = '';
                                if(list[i].collect){
                                    al_zant = 'al_zan';
                                }
                                html.push(' <div class="_right fn-right"><span data-type="2" data-id="'+list[i].id+'" class="numZan '+al_zant+'">'+list[i].collectnum+'</span><span href="javascript:;" class="numComment">'+list[i].shop_common+'</span></div>');
                                html.push('</div>')
                            html.push('</div>');
                            html.push('</a></li>');
                        }
                    }

                    if (action == 1) {
                        if(page == 1){
                            $(".new").html(html.join(""));
                        }else{
                            $(".new").append(html.join(""));
                        }
                    }else if(action == 3){
                        if(page == 1){
                            $(".recommend").html(html.join(""));
                        }else{
                            $(".recommend").append(html.join(""));
                        }
                    }else if(action == 2){
                        if(page == 1){
                            $(".hot").html(html.join(""));
                        }else{
                            $(".hot").append(html.join(""));
                        }
                    }

                    loadMoreLock = false;

                    if(page >= pageinfo.totalPage){
                        loadMoreLock = true;
                        if (action == 1) {
                            $(".new-list").append('<div class="empty">'+langData['info'][1][7]+'</div>');//没有更多啦~
                        }else if(action == 3){
                            $(".recommend-list").append('<div class="empty">'+langData['info'][1][7]+'</div>');
                        }else if(action == 2){
                            $(".hot-list").append('<div class="empty">'+langData['info'][1][7]+'</div>');
                        }
                    }

                }else {
                    $(".loading").remove();
                    if (action == 1) {
                        $(".new").append('<div class="loading">'+data.info+'</div>');
                    }else if(action == 3){
                        $(".recommend").append('<div class="loading">'+data.info+'</div>');
                    }else if(action == 2){
                        $(".hot").append('<div class="loading">'+data.info+'</div>');
                    }
                }
                // loadMoreLock = false;
            },
            error: function(){
                if(page == 1){
                    $(".goods-list ul").html("");
                }
              $(".goods-list ul").append('<div class="loading">'+langData['info'][1][2]+'</div>');
                //$(".goods-list ul").html(langData['info'][1][2]).show();
                loadMoreLock = false;
            }
        });


    }

    // 图片放大
    var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})
    $(".contents").delegate('.commonimg', 'click', function(e) {
        e.preventDefault();
        var imgBox = $(this).parents('li').find('.commonimg');
        var i = $(this).index();
        $(".videoModal .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length; j < c ;j++){
            if(j==0){
                var videoPath = imgBox.eq(j).find('img').attr("data-video");
                if(videoPath != '' && videoPath != null){
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><video width="100%" height="100%" controls preload="meta" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline  x5-video-player-fullscreen="true" id="video" src="'+videoPath+'"  poster="' + imgBox.eq(j).find('img').attr("src") + '"></video></div>');
                }else{
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find('img').attr("src") + '" / ></div>');
                }
            }else{
                $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find("img").attr("src") + '" / ></div>');
            }
        }
        videoSwiper.update();
        $(".videoModal").addClass('vshow');
        $('.markBox').toggleClass('show');
        videoSwiper.slideTo(i, 0, false);
        return false;
    });

    $(".videoModal").delegate('.vClose', 'click', function() {
        var video = $('.videoModal').find('video').attr('id');
        $(video).trigger('pause');
        $(this).closest('.videoModal').removeClass('vshow');
        $('.videoModal').removeClass('vshow');
        $('.markBox').removeClass('show');
    });

    // 悬浮发布
    $(document).ready(function (ev) {
        $('.menu').on('touchend', function (ev) {
            if($('.mask').hasClass('show')){
                $('.mask').removeClass('show');
            }else{
                $('.mask').addClass('show');
            }
            $('.mIcon').toggleClass('close');
            $('.menu').toggleClass('m_active');
            $('.mIcon.wx').toggleClass('m_curr');
            $('.mIcon.fb').toggleClass('m_curr');
            $('.mIcon.my').toggleClass('m_curr');
        });

    });

    // 悬浮框
    $('body').delegate('.popupRightBottom button', 'click', function(){
        var slideFastNav = $('.popupRightBottom .slideFastNav');
        var fastNavBtn = $('.popupRightBottom .fastNav button');
        if(slideFastNav.hasClass('showNav')){
            slideFastNav.addClass('hideNav');
            fastNavBtn.removeClass('openNav');
            setTimeout(function(){
                slideFastNav.removeClass('showNav');
                slideFastNav.removeClass('hideNav');
            }, 200);
        }else {
            fastNavBtn.addClass('openNav');
            slideFastNav.addClass('showNav').removeClass('hideNav');
        }
    });

    //返回顶部
    $('body').delegate('.fastTop', 'tap', function(){
        document.scrollingElement.scrollTop = 0;
    });

    //隐藏返回顶部
    $(window).on("scroll", function(){
        if($(window).scrollTop() > 400) {
            $('.popupRightBottom .fastTop').css("visibility", "visible");
        }else{
            $('.popupRightBottom .fastTop').css("visibility", "hidden");
        }
    });


});

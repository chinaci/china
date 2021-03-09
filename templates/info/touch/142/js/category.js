$(function () {
    //APP端取消下拉刷新
    toggleDragRefresh('off');

    $('.choose-tab li').bind('click',function () {
        $(this).toggleClass('active').siblings('.choose-tab li').removeClass('active');
    });

    var top = 0;//给top变量一个初始值，以便下方赋值并引用。

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
            }else if(n == 5){
                return (month+'-'+day+' '+hour+':'+minute);
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

    // 显示下拉框
    $('.choose-tab  li').click(function(){
        $(this).toggleClass('active').siblings('.choose-tab li').removeClass('active');
        top = $(window).scrollTop();//获取页面的scrollTop；
        $('body').css("top",-top+"px");//给body一个负的top值；
        $('body').addClass('add');//给body增加一个类，position:fixed;
        var index = $(this).index();
        var local = $('.choose-local').eq(index);
        if ( local.css("display") == "none") {
            $(this).toggleClass('active').siblings('.choose-tab li').removeClass('active');
            local.show().siblings('.choose-local').hide();
            $('.mask').show();
        }else{
            $('body').removeClass('add');//去掉给body的类
            $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
            $(this).removeClass('active');
            local.hide();
            $('.mask').hide();
        }
    });

    // 二级地域切换
    $('.choose-list .choose-city .category-wrapper .brand-list li').click(function(){
        $(this).addClass('curr').siblings().removeClass('curr');
        var i = $(this).index();
        var id = $(this).attr('data-id'), typename = $(this).text();
        $.ajax({
            url: masterDomain + "/include/ajax.php?service=info&action=addr&type="+id,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    var html = [], list = data.info;
                    html.push('<li class="all" data-id="'+id+'">'+typename+'</li>');
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li data-id="'+list[i].id+'">'+list[i].typename+'</li>');
                    }
                    $(".choose-city .brand-wrapper ul").html(html.join(""));
                }else if(data.state == 102){
                    $(".choose-city .brand-wrapper ul").html('<li data-id="'+id+'">'+typename+'</li>');
                }else{
                    $(".choose-city .brand-wrapper ul").html('<li class="load">'+data.info+'</li>');
                }
            },
            error: function(){
                $(".choose-city .brand-wrapper ul").html('<li class="load">'+langData['info'][1][29]+'</li>');
            }
        });

        $('.choose-list .choose-city .brand-wrapper ul').eq(i).addClass('show').siblings().removeClass('show');
    });

    //$('.choose-city .brand-wrapper ul li').click(function () {
    $('.choose-city .brand-wrapper ul').delegate("li", "click", function(){
        $('body').removeClass('add');//去掉给body的类
        $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
        $(this).addClass('active').siblings().removeClass('active');
        $('.choose-local').hide();
        $('.mask').hide();
        $('.choose-tab .city span').html($(this).html());
        $('.choose-tab  li').removeClass('active');
        var addrid = $(this).attr("data-id");
        location.href = listUrl + "?addrid=" + addrid + "&typeid=" + typeidold;
    });
    // 不限
    $('.choose-list .choose-city .category-wrapper .city-top').click(function () {
        $('body').removeClass('add');//去掉给body的类
        $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
        $('.choose-local').hide();
        $('.mask').hide();
        $('.choose-tab .city span').html($(this).html());
        $('.choose-tab  li').removeClass('active');


    });

    // 类别二级筛选
    $('.choose-list .choose-type .category-wrapper .brand-list li').click(function(){
        $(this).addClass('curr').siblings().removeClass('curr');
        var i = $(this).index();
        $('.choose-list .choose-type .brand-wrapper ul').eq(i).addClass('show').siblings().removeClass('show');
        var typeid = $(this).attr("data-id"), typename = $(this).text();

        $.ajax({
            url: masterDomain + "/include/ajax.php?service=info&action=type&type="+typeid,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                console.log(data);
                if(data && data.state == 100){
                    var html = [], list = data.info;
                    html.push('<li class="all" data-id="'+typeid+'">'+typename+'</li>');
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li data-id="'+list[i].id+'">'+list[i].typename+'</li>');
                    }
                    $(".choose-type .brand-wrapper ul").html(html.join(""));
                }else if(data.state == 102){
                    location.href = listUrl + "?typeid=" + typeid;
                    // $(".brand-wrapper ul").html('<li data-id="'+typeid+'">'+typename+'</li>');
                }else{
                    $(".choose-type .brand-wrapper ul").html('<li class="load">'+data.info+'</li>');
                }
            },
            error: function(){
                $(".choose-type .brand-wrapper ul").html('<li class="load">'+langData['info'][1][29]+'</li>');
            }
        });
    });
    $('.choose-type .brand-wrapper ul').delegate("li", "click", function(){
        $('body').removeClass('add');//去掉给body的类
        $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
        $(this).addClass('active').siblings().removeClass('active');
        $('.choose-local').hide();
        $('.mask').hide();
        $('.choose-tab .types span').html($(this).html());
        $('.choose-tab  li').removeClass('active');
        var typeid = $(this).attr("data-id");
        location.href = listUrl + "?typeid=" + typeid;
    });
    $('.choose-list .choose-type .category-wrapper .type-all').click(function () {
        $('body').removeClass('add');//去掉给body的类
        $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
        $('.choose-local').hide();
        $('.mask').hide();
        $('.choose-tab .types span').html($(this).html());
        $('.choose-tab  li').removeClass('active');
        var typeid = $(this).attr("data-id");
        location.href = listUrl + "?typeid=" + typeid;
    });

    // 筛选类别选择
    $('.choose-price .type-box span').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('#type').val($(this).data('id'));
    });

    // 重置
    $('.choose-price h3 span.reset').click(function () {
        $('.choose-price .type-box span').removeClass('active');
        $('#type').val("");
        $('#min_price').val("");
        $('#high_price').val("");
    });
    // 取消
    $('.choose-price .btns span.btn_cancel').click(function () {
        $('.choose-price .type-box span').removeClass('active');
        $('#type').val("");
        $('#min_price').val("");
        $('#high_price').val("");
        $('.mask').hide();
        $('.choose-local').hide();
    });
    //确定
    $('.choose-price .btns span.btn_sure').click(function () {
        var type = $('#type').val();
        var min_price =  $('#min_price').val();
        var high_price = $('#high_price').val();
        $('.mask').hide();
        $('.choose-local').hide();
        location.href = listUrl + "?typeid=" + typeidold + "&nature=" + type + "&price_section=" + min_price + "," + high_price;
    });

    $('.mask').click(function () {
        $('body').removeClass('add');//去掉给body的类
        $(window).scrollTop(top);//设置页面滚动的高度，如果不设置，关闭弹出层时页面会回到顶部。
        $('.mask').hide();
        $('.choose-local').hide();
        $('.choose-tab  li').removeClass('active');
    });

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


    //左右导航切换(推荐信息、推荐店铺)
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
    var tabHeight = 　345;

    $(window).scroll(function() {
        if ($(window).scrollTop() > tabHeight) {
            $('.recomTab').addClass('topfixed');
        } else {
            $('.recomTab').removeClass('topfixed');
        }

        var allh = $('body').height();
        var h = 60;
        var w = $(window).height();
        var s_scroll = allh - w - h;

        if ($(window).scrollTop() > s_scroll && !loadMoreLock) {
            var page = parseInt($('.recomTab .active').attr('data-page')),
                totalPage = parseInt($('.recomTab .active').attr('data-totalPage'));
            if (totalPage >= page) {
                ++page;
                loadMoreLock = true;
                $('.recomTab .active').attr('data-page', page);
                getList();
            }
        }
    });

    // 最新发布，热门信息，推荐商家
    getList();
    function getList() {
        var active = $('.recomTab .active'), action = active.attr('data-id'), url;
        var page = active.attr('data-page');
        if (action == 1) {
            if(page == 1){
                $(".new").html('<div class="loading"><i class="icon-loading"></i>'+langData['info'][1][3]+'</div>');
            }
            url =  masterDomain + "/include/ajax.php?service=info&action=ilist_v2&orderby=1&page="+page+"&pageSize="+pageSize +"&typeid=" + typeidold;
        }else if(action == 3){
            if(page == 1){
                $(".recommend").html('<div class="loading"><i class="icon-loading"></i>'+langData['info'][1][3]+'</div>');
            }
            url =  masterDomain + "/include/ajax.php?service=info&action=shopList&page="+page+"&pageSize="+pageSize +"&typeid=" + typeidold;
        }else if(action == 2){
            if(page == 1){
                $(".hot").html('<div class="loading"><i class="icon-loading"></i>'+langData['info'][1][3]+'</div>');
            }
            url =  masterDomain + "/include/ajax.php?service=info&action=ilist_v2&fire=1&page="+page+"&pageSize="+pageSize +"&typeid=" + typeidold;
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
                            html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
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
                                html.push('<img data-video="'+list[i].video+'" onerror="this.src=\''+list[i].litpic+'\'" src="'+huoniao.changeFileSize(list[i].litpic, "small")+'" alt="">');
                                html.push('<i class="play"></i>');
                                html.push('</div>');
                            }else if(list[i].pcount<=5){
                                html.push('<div class="item-box img-box">');
                                for(var m=0;m<list[i].picArr.length;m++){
                                    html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'" src="'+huoniao.changeFileSize(list[i].picArr[m]['litpic'], "small")+'" alt=""></div>');
                                }
                                html.push('</div>');
                            }else {
                                html.push('<div class="item-box img-box">');
                                for(var m=0;m<list[i].picArr.length;m++){
                                    if(m == 5){
                                        html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'" src="'+huoniao.changeFileSize(list[i].picArr[m]['litpic'], "small")+'" alt=""> <i>+'+list[i].pcount+'</i></div>');
                                    }else{
                                        html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'" src="'+huoniao.changeFileSize(list[i].picArr[m]['litpic'], "small")+'" alt=""></div>');
                                    }
                                }
                                html.push('</div>');
                            }
                            html.push(' <p class="area"><span href=""><i class="icon_area"></i>'+list[i].address+'</span></p>');
                            html.push('<div class="msg fn-clear">');
                            var data1 = huoniao_.transTimes(list[i].pubdate,5);
                            html.push(' <div class="_left fn-left"><span>'+data1+'</span><span class="point">·</span>'+langData['info'][1][6]+list[i].click+'</div>');
                            var al_zant = '';
                            if(list[i].collect){
                                al_zant = 'al_zan';
                            }
                            html.push(' <div class="_right fn-right"><span data-type="1" data-id="'+list[i].id+'" class="numZan '+al_zant+'">'+list[i].collectnum+'</span><span href="javascript:;" class="numComment">'+list[i].common+'</span></div>');
                            html.push('</div>');
                            html.push('</div>');
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
                                        html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].pics[m]+'\'" src="'+huoniao.changeFileSize(list[i].pics[m], "small")+'" alt=""></div>');
                                    }
                                    html.push('</div>');
                                }else {
                                    html.push('<div class="item-box img-box">');
                                    for(var m=0;m<list[i].pics.length;m++){
                                        if(m == 5){
                                            html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].pics[m]+'\'" src="'+huoniao.changeFileSize(list[i].pics[m], "small")+'" alt=""> <i>+'+list[i].pcount+'</i></div>');
                                        }else{
                                            html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].pics[m]+'\'" src="'+huoniao.changeFileSize(list[i].pics[m], "small")+'" alt=""></div>');
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
                            $(".new-list").append('<div class="empty">'+langData['info'][1][7]+'</div>');
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

            },
            error: function(){
                if(page == 1){
                    $(".goods-list ul").html("");
                }
                $(".goods-list ul").html(langData['info'][1][2]).show();
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





});

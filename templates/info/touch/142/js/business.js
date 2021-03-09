$(function () {
    //APP端取消下拉刷新
    toggleDragRefresh('off');
    //放大图片
    $.fn.bigImage({
        artMainCon:".introBox",  //图片所在的列表标签
    });
    // banner轮播图
    new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination', type: 'fraction',} ,slideClass:'slideshow-item',loop: false,grabCursor: true,paginationClickable: true});
    $('.video-box').on('click',function(){
        $('.video-btn').css('display','-webkit-flex');
        $('#video-control').css('display','-webkit-flex');
        setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 5000);
    });

    // 关注
    $('.btnCare').click(function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }

        var t = $(this), type = t.hasClass("cared") ? "0" : "1";
        $.ajax({
            url : masterDomain +"/include/ajax.php?service=info&action=follow&vid=" + user_id + '&type=' + type + '&temp=info',
            data : '',
            type : 'get',
            dataType : 'jsonp',
            success : function (data) {
                if(data.state == 100){
                    if(type == '0'){
                        t.removeClass('cared').html(langData['info'][2][52]);
                    }else{
                        t.addClass('cared').html(langData['info'][2][53]);
                    }
                }else{
                    alert(data.info);
                }
            }
        })

    });

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
                return (year+'.'+month+'.'+day);
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

    //点赞
    $('.pubBox').on('click','.numZan',function(e){
        e.preventDefault();
        var id = $(this).attr('data-id'), type = '', collecttxt = '';
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

        $.post("/include/ajax.php?service=member&action=collect&module=info&temp=detail&type="+type+"&id="+id,{},function(res){
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

    // 电话弹框
    $(".tel-box").on("click",function(){

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            alert(langData['info'][2][51]);
            location.href = masterDomain + '/login.html';
            return false;
        }
        $.smartScroll($('.modal-public'), '.modal-main');
        $('html').addClass('nos');
        $('.m-telphone').addClass('curr');
        return false;
    });
    // console.log($(window).height());
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

                $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height(360);


            },
        },

    })

    $(".recomTab li").on('touchstart mousedown',function(e){
        e.preventDefault();
        $(".recomTab .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo( $(this).index() );
    });

    var tabHeight = $('.recomTab').offset().top;

    $(window).scroll(function() {
        if ($(window).scrollTop() > tabHeight) {
            $('.recomTab').addClass('topfixed');
        } else {
            $('.recomTab').removeClass('topfixed');
        }
    });


    // 地图
    var map = new BMap.Map("map");
    map.centerAndZoom(new BMap.Point(lng, lat), 11);
    map.setCurrentCity("$detail_addr[1]");

    HN_Location.init(function(data){
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
            $('.map_distance').hide();
        }else{
            caculateLL(lat, lng, data.lat, data.lng);
            function caculateLL(lat, lng, lat2, lng2) {
                var radLat1 = lat * Math.PI / 180.0;
                var radLat2 = lat2 * Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;
                s = Math.round(s * 10000) / 10000;

                $(".map_distance p").html(s.toFixed(1) +'km');
            };
        }
    })

    $('.appMapBtn').attr('href', OpenMap_URL);


    // 加载发布
    var servepage = 1;
    var totalpage = 0;
    var isload = false;
    // 获发布店数据
    getfabuList();
    function  getfabuList(){
        isload = true;
        var url ="/include/ajax.php?service=info&action=ilist_v2&page="+ servepage +"&pageSize=10&uid="+user_id;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state == 100){
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo, page = pageinfo.page;
                    var totalPage = data.info.pageInfo.totalPage;
                  console.log(totalPage)
                    for(var i =0; i<list.length;i++){
                        html.push('<li class="fn-clear"><a href="'+list[i].url+'">');
                        var photo = list[i].member.photo == null ? templatePath+'images/noavatar_middle.gif' : list[i].member.photo;
                        html.push('<div class="userimg "><img src="'+photo+'" alt=""></div>');
                        html.push('<div class="info_r ">');
                        var nickname = list[i].member.nickname == null ? langData['info'][1][4] : list[i].member.nickname;//匿名
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

                        html.push('<p class="con" style="color:'+(list[i].color?list[i].color:"")+'; font-weight:'+(list[i].titleBlod=="1"?"bold":"normal")+'"><span class="type" >#<em>'+list[i].typename+'</em>#</span>'+list[i].title+'</p>');

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
                        var data1 = huoniao.transTimes(list[i].pubdate,4);
                        html.push(' <div class="_left fn-left"><span>'+data1+'</span><span class="point">·</span>'+langData['info'][1][6]+list[i].click+'</div>');
                        var al_zant = '';
                        if(list[i].collect){
                            al_zant = 'al_zan';
                        }
                        html.push(' <div class="_right fn-right"><span data-type="1" data-id="'+list[i].id+'" class="numZan '+al_zant+'">'+list[i].collectnum+'</span><span href="javascript:;" class="numComment">'+list[i].common+'</span></div>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</a></li>');
                    }
                    if(servepage == 1){
                        $(".fabuBox ul.fabuList").html(html.join(""));
                    }else{
                        $(".fabuBox ul.fabuList").append(html.join(""));
                    }
                    isload = false;
                    if(servepage >= totalPage){
                        isload = true;
                        $('.loading span').text(langData['info'][1][7]);//已显示全部
                    }
                }else {
                    $(".loading").remove();
                    $(".fabuBox ul.fabuList").append('<div class="loading">'+data.info+'</div>');
                }
            },
            error: function(){
                isload = false;
                $('.loading span').text(langData['info'][1][2]);
            }
        })
    }


    //滚动底部加载
    $(window).scroll(function() {
        var sh = $('.fabuBox .loading').height();
        var allh = $('body').height();
        var w = $(window).height();
        var s_scroll = allh - sh - w;
        if ($(window).scrollTop() > s_scroll && !isload) {         
            servepage++;
            getfabuList();
        };
    });

    // 评论
    $('.foot_bottom .f_left .plBox').click(function () {
        $('.mark').show();
        $('.footer_comment').addClass('open');

    });
    $('.mark').click(function () {
        $(this).hide();
        $('.footer_comment').removeClass('open');
    });
    $('#wcmt_send_btm').click(function () {
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }

        var wcmt_text = $('#wcmt_text').val();
        $.ajax({
            url : "/include/ajax.php?service=member&action=sendComment&type=info-business&check=1&aid="+id,
			data: "content="+wcmt_text,
            type: "GET",
            dataType: "json",
            success:function (data) {
                if(data && data.state == 100){
                    var list = data.info;
                    var photo = list.userinfo.photo == null ? staticPath + '/static/images/noPhoto_40.jpg' : list.userinfo.photo;
                    var nickname = list.userinfo.nickname == null ? langData['info'][1][4] : list.userinfo.nickname;//匿名
                    var comdReplayUrl = comdetailUrl.replace("%id%", list.id);

                    var list = '<li><div class="imgbox"><img src="'+photo+'" alt=""></div><div class="rightInfo"><h4>'+nickname+'</h4><p class="txtInfo">'+list.content+'</p><div class="rbottom"><div class="rtime">'+huoniao_.transTimes(list.dtime, 5)+'</div><div class="rbInfo"><a href="'+comdReplayUrl+'" class="btnReply"> <s></s> '+langData['info'][1][35]+' </a><a href="javascript:;" class="btnUp numZan" data-id="'+list.id+'"><em>'+list.zan+'</em> </a></div></div></div></li>';

                    $('.commentList ul').prepend(list);
                    $('.mark').hide();
                    $('.footer_comment').removeClass('open');

                    $.dialog({
                        type : 'info',
                        contentHtml : '<p class="info-text">'+langData['info'][2][50]+'</p>',
                        autoClose : 1000
                    });

                }else{
                    alert(data.info);
                }
            }
        });

    });

    $(".commentBox").delegate(".btnUp","click", function(){console.log(11);
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
        }
        var t = $(this), id = t.attr("data-id");
        // if(t.hasClass("al_zan")) return false;
        var num = t.find("em").html();
        if( typeof(num) == 'object') {
            num = 0;
        }
        var type = 'add';
        if(t.hasClass("al_zan")){
            type = 'del';
            num--;
        }else{
            num++;
        }

        $.ajax({
            url: "/include/ajax.php?service=member&action=dingComment&id="+id+"&type="+type,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data.state==100){
                    if(t.hasClass("al_zan")){
                        t.removeClass('al_zan');
                    }else{
                        t.addClass('al_zan');
                    }
                    t.find('em').html(num);
                }else{
                    alert(data.info);
                    t.removeClass('al_zan');
                }
            }
        });
    });

    // 微信弹框
    $("#wx-btn").on("click",function(){
        $.smartScroll($('.modal-public'), '.modal-main');
        $('html').addClass('nos');
        $('.m-wx').addClass('curr');
        return false;
    });

      // 轮播图片放大
    var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})
    $(".topSwiper").delegate('.topcomm', 'click', function(e) {
       e.preventDefault();
        //var imgBox = $('.topSwiper .topcomm');
      	var imgBox = $(this).parents('.swiper-wrapper').find('.topcomm');
        var i = $(this).index();
        $(".videoModal .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length; j < c ;j++){
            if(j==0){
                if(detail_video!=''){
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><video width="100%" height="100%" controls preload="meta" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline  x5-video-player-fullscreen="true" id="video" src="'+detail_video+'"  poster="' + imgBox.eq(j).find("img").attr("src") + '"></video></div>');
                }else{
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find("img").attr("src") + '" / ></div>');
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

    // 图片放大
    //var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})
    $(".fabuList").delegate('.commonimg', 'click', function(e) {
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

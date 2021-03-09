$(function () {
    //APP端取消下拉刷新
    toggleDragRefresh('off');
    //放大图片
    $.fn.bigImage({
        artMainCon:".introBox",  //图片所在的列表标签
    });

    $('.video-box').on('click',function(){
        $('.video-btn').css('display','-webkit-flex');
        $('#video-control').css('display','-webkit-flex');
        setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 2000);
    });

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


    if(collect){
        $('.foot_bottom .scBox').addClass("has");
        $('.foot_bottom .scBox').html("<s></s>" + langData['info'][1][32]);
    }else{
        $('.foot_bottom .scBox').html("<s></s>" + langData['info'][0][12]);
    }

    // 收藏
    $('.foot_bottom .scBox').click(function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }

        var t = $(this), type = t.hasClass("has") ? "del" : "add";

        if(type == 'del'){
            $('.foot_bottom .scBox').html("<s></s>" + langData['info'][0][12]);
        }else{
            $('.foot_bottom .scBox').html("<s></s>" + langData['info'][1][32]);
        }

        $.ajax({
            url : "/include/ajax.php?service=member&action=collect",
            data : {
                'type' : type,
                'module' : 'info',
                'temp' : 'detail',
                'id' : detail_id,
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.info == 'has'){
                    $.dialog({
                        type : 'info',
                        contentHtml : '<p class="info-text">'+langData['info'][1][9]+'</p>',
                        autoClose : 1000
                    });
                }else if(data.info == 'ok'){
                    if(type == 'del'){
                        $.dialog({
                            type : 'info',
                            contentHtml : '<p class="info-text">'+langData['info'][1][8]+'</p>',
                            autoClose : 1000
                        });
                        t.removeClass('has');
                    }else{
                        $.dialog({
                            type : 'info',
                            contentHtml : '<p class="info-text">'+langData['info'][1][33]+'</p>',
                            autoClose : 1000
                        });
                        t.addClass('has');
                    }
                }else{
                    $.dialog({
                        type : 'info',
                        contentHtml : '<p class="info-text">'+langData['info'][1][34]+'</p>',
                        autoClose : 1000
                    });
                    window.location.href = masterDomain+'/login.html';
                    return false;
                }
            }
        })

    });
    // 电话弹框
    $(".im_iphone").on("click",function(){

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

    // 评论
    $('.foot_bottom .f_left .plBox').click(function () {
        $('.mark').show();
        $('.footer_comment').addClass('open');

    });
    $('.mark').click(function () {
        $(this).hide();
        $('.footer_comment').removeClass('open');
    });

    //评论
    $('#wcmt_send_btm').click(function () {
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }

        var wcmt_text = $('#wcmt_text').val();
        $.ajax({
            url : "/include/ajax.php?service=member&action=sendComment&type=info-detail&check=1&aid="+id,
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

    $(".commentBox").delegate(".btnUp","click", function(){
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
            url: masterDomain + "/include/ajax.php?service=member&action=dingComment&id="+id+"&type="+type,
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


    // 地址
    var map = new BMap.Map("map");
    map.centerAndZoom(new BMap.Point(lng, lat), 11);
    map.setCurrentCity("$detail_addr[1]");
    HN_Location.init(function(data){
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "" || lat == "" || lng == "") {
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
				$('.map_distance').show();
            };
        }
    })

	if (pageData.lat != "" && pageData.lng != "") {
	    $('.appMapBtn').attr('href', OpenMap_URL).attr('target', '_blank');
	}


    // 图片放大
    var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})
    $(".recomList").delegate('.commonimg', 'click', function(e) {
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

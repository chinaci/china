$(function () {
	$.fn.scrollTo =function(options){
        var defaults = {
            toT : 0, //滚动目标位置
            durTime : 500, //过渡动画时间
            delay : 30, //定时器时间
            callback:null //回调函数
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(),//滚动条当前的位置
            subTop = opts.toT - curTop, //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback == 'function'){
                        opts.callback();
                    }
                    return;
                }else{
         
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };
    // 轮播
    new Swiper('.swiper-container', {pagination: {el: '.swiper-pagination',},loop: false,grabCursor: true,paginationClickable: true});

    $('.video-box').on('click',function(){
        $('.video-btn').css('display','-webkit-flex');
        $('#video-control').css('display','-webkit-flex');
        setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 5000);
    });
  

    

    if(collect){
        $('.btnCollect').addClass("collect1").html('<img src="'+templets+'images/collect1.png" alt="">');
    }

    // 大图关闭
    $('.topMain .vClose').on('click',function(){
        $('.swiper-container').removeClass('fullscreen-box');
        return false;
    });
        // 收藏
    $('.btnCollect').click(function(){
        var t = $(this), type = t.hasClass("collect1") ? "del" : "add";
        $.ajax({
            url : "/include/ajax.php?service=member&action=collect",
            data : {
                'type' : type,
                'module' : 'info',
                'temp' : 'business',
                'id' : detail_id,
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.info == 'has'){
                    alert("您已收藏");
                }else if(data.info == 'ok'){
                    if(type == 'del'){
                        t.removeClass('collect1').html('<img src="'+templets+'images/collect.png" alt="">');
                    }else{
                        $.dialog({
                            type : 'info',
                            contentHtml : '<img class="info-icon" src="'+templets+'images/success.png" alt="收藏成功" /><p class="info-text">收藏成功</p>',
                            autoClose : 1000
                        });
                        t.addClass('collect1').html('<img src="'+templets+'images/collect1.png" alt="">');
                    }
                }else{
                    $.dialog({
                           type : 'info',
                           contentHtml : '<img class="info-icon" src="'+templets+'images/error.png" alt="收藏失败" /><p class="info-text">收藏失败，请登录</p>',
                           autoClose : 1000
                    });
                    // alert("收藏失败，请登录或者稍后再试~");
                }
            }
        })

    });
    
    
 	// 发布信息
    $(".fabuInfo ul li a").on("click",function(){
        $(this).parent().addClass("scurr").siblings().removeClass("scurr");
        var i = $(this).parent().index();
        $('.fabuInfo .userCon').eq(i).addClass("show").siblings().removeClass("show");
        
    })
     // 用户评论
    $(".fabuInfo ul li a.userCom").on("click",function(){
        $(this).parent().addClass("curr").siblings().removeClass("curr");
        var dealTop = $("#c-info").offset().top;
        $("html,body").scrollTo({toT:dealTop})
        return false;
    });
    // 电话弹框
    $(".foot-2,.utelphone").on("click",function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            alert("登录后显示");
            location.href = masterDomain + '/login.html';
            return false;
        }
        $.smartScroll($('.modal-public'), '.modal-main');
        $('html').addClass('nos');
        $('.m-telphone').addClass('curr');
        return false;
    });
    
     // 微信弹框
    $(".foot-3").on("click",function(){
        $.smartScroll($('.modal-public'), '.modal-main');
        $('html').addClass('nos');
        $('.m-wx').addClass('curr');
        return false;
    });
    // 关闭
    $(".modal-public .modal-main .close").on("touchstart",function(){
        $("html, .modal-public").removeClass('curr nos');
        return false;
    })
    $(".bgCover").on("click",function(){
        $("html, .modal-public").removeClass('curr nos');
    })


    // 关注
    $('.btn_care').click(function(){

        var t = $(this), type = t.hasClass("cared") ? "0" : "1";
        $.ajax({
            url : masterDomain + "/include/ajax.php?service=info&action=follow&vid=" + user_id + '&type=' + type + '&temp=info',
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(type == 0){
                        t.removeClass('cared').html('关注');
                    }else{
                        t.addClass('cared').html('已关注');
                    }
                }else{
                    alert(data.info);
                    window.location.href = masterDomain + '/login.html';

                }
            }
        })

    });
    
})

// 视频
$(function(){

    var box = document.getElementById("video-control"); //box对象
    var video = document.getElementById("video"); //视频对象
    var play = document.getElementById("play"); //播放按钮
    var vbplay = document.getElementById("vbplay");//视频中间播放按钮
    var time = document.getElementById('time');
    var progress = document.getElementById("progress"); //进度条
    var bar = document.getElementById("bar"); //蓝色进度条
    var control = document.getElementById("control"); //声音按钮
    var sound = document.getElementById("sound"); //喇叭
    var full = document.getElementById("full") //全屏
    video.addEventListener('play', function() {
        play.className = "pause";
        $('.play-box').find('i').removeClass('play-icon').addClass('pause-icon');
    });
    video.addEventListener('pause', function() {
        play.className = "play";
        $('.play-box').find('i').removeClass('pause-icon').addClass('play-icon');
    });
    video.addEventListener('timeupdate', function() {
        var timeStr = parseInt(video.currentTime);
        var minute = parseInt(timeStr/60);
        if(minute == 0){
            if(timeStr < 10){
                timeStr = "0"+timeStr  ;
            }
            minute = "00:"+timeStr;
        }else{
            var timeStr = timeStr%60;
            if(timeStr < 10){
                timeStr = "0"+timeStr  ;
            }
            minute = minute +":"+timeStr;
        }
        time.innerHTML = minute;
    });
    video.addEventListener('volumechange', function() {
        if(video.muted) {
            sound.className = "soundoff"
        } else {
            sound.className = "soundon"
        }
    });
    full.addEventListener("click", function() {
        $('.video-box').parent().parent().toggleClass('fullscreen-box');
        var type = $(this).hasClass('small') ? "del" : "add";
        if(type=="del"){
            $(this).removeClass('small')
        }else if(type=="add"){
            $(this).addClass('small')
        }

    }, false)
    play.onclick = function() {
        if(video.paused) {
            play.className = "pause";
            video.play();
        } else {
            play.className = "play";
            video.pause();
        }
    }
    vbplay.onclick = function() {
        if (video.paused){
            video.play();
            video.value = "pause";
        }else{
            video.pause();
            video.value = "play";
        }
    }
    //进度条
    video.addEventListener("timeupdate", function() {
        var scales = video.currentTime / video.duration;
        bar.style.width = progress.offsetWidth * scales + "px";
        control.style.left = progress.offsetWidth * scales + "px";
    }, false);
    var move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
    control.addEventListener("touchstart", function(e) {
        var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.offsetWidth) {
                leftv = progress.offsetWidth;
            }
            control.style.left = leftv + "px"
    }, false);
    control.addEventListener('touchmove', function(e) {
        var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.offsetWidth) {
                leftv = progress.offsetWidth;
            }
        control.style.left = leftv + "px"
    }, false);
    control.addEventListener("touchend", function(e) {
        var scales = control.offsetLeft / progress.offsetWidth;
        video.currentTime = video.duration * scales;
        video.play();
        document.onmousemove = null;
        document.onmousedown = null;
    //video.pause();
    }, false);
    sound.onclick = function() {
        if(video.muted) {
            video.muted = false;
            sound.className = "soundon"
        } else {
            video.muted = true;
            sound.className = "soundoff"
        }
    }
})
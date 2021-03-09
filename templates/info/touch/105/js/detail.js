$(function () {
    //放大图片
    $.fn.bigImage({
        artMainCon:".introBox",  //图片所在的列表标签
    });

    //APP端取消下拉刷新
    toggleDragRefresh('off');

    $('#customerBtn').on('click',function(){
        qimoChatClick();
    });

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
    // new Swiper('.swiper-container', {pagination: {el: '.swiper-pagination',},loop: true,grabCursor: true,paginationClickable: true});

    $('.video-box').on('click',function(){
        $('.video-btn').css('display','-webkit-flex');
        $('#video-control').css('display','-webkit-flex');
        setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 5000);
    });


    // 大图关闭
    $('.top-video .vClose').on('click',function(){
        $('.top-video').removeClass('fullscreen-box');
        return false;
    });

    if(collect){
        $('.btnCollect').addClass("collect1").html('<img src="'+templets+'images/collect1.png" alt="">');

    }



    // 收藏
      $('.btnCollect').click(function(){
        var t = $(this), type = t.hasClass("collect1") ? "del" : "add";
        // var userid = $.cookie(cookiePre+"login_user");
        // if(userid == null || userid == ""){
        //     location.href = masterDomain + '/login.html';
        //     return false;
        // }
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
                           contentHtml : '<img class="info-icon" src="'+templets+'images/error.png" alt="收藏失败" /><p class="info-text">收藏失败，请登录~</p>',
                           autoClose : 1000
                    });
                }
            }
        })

      });

    // 导航
    $(document).ready(function(){ 
        var navHeight= $(".fabuInfo").offset().top; 
        var navFix=$("#nav-wrap"); 
        $(window).scroll(function(){ 
          if($(this).scrollTop()>navHeight){ 
            navFix.addClass("topfixed"); 
          } 
          else{ 
            navFix.removeClass("topfixed"); 
          } 
        }) 
    });
        //内容信息导航锚点
    $('.nav-wrap').navScroll({
        mobileDropdown: false,
        slidesPerView : "auto",
        mobileBreakpoint: 768,
        scrollSpy: true
    });
    
            
    
    $('.nav-wrap').on('click', '.nav-mobile', function (e) {
        e.preventDefault();
        $('.nav-wrap ul').slideToggle('fast');
    });



   

    // 展开更多
    var slideHeight = 620; 
    var defHeight = $('.introBox').height();
    if(defHeight >= slideHeight){
        $('.introBox').css('height' , slideHeight + 'px');
        $('.readMore').append('<a href="javascript:;">展开更多<i class="rmDown"></i></a>');
        $('.readMore a').click(function(){
            var curHeight = $('.introBox').height();
             console.log(curHeight)
             console.log(slideHeight)
            if(curHeight == slideHeight){
                $('.introBox').animate({height: defHeight}, "normal");
                $('.readMore a').html('全部收起<i class="rmUp"></i>');
                $('.gradient').fadeOut();
            }else{
                $('.introBox').animate({height: slideHeight}, "normal");
                $('.readMore a').html('展开更多<i class="rmDown"></i>');
                $('.gradient').fadeIn();
            }
            return false;
        });        
    }
    // 电话弹框
    $(".foot-bottom .ftel,.foot_bottom .ftel").on("click",function(){
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

    
})
$(function () {
    //var navHeight = $('.navlist').offset().top;
    //时间轴吸顶
    //$(window).scroll(function() {
        //if ($(window).scrollTop() > navHeight) {
            //$('.navlist').addClass('topfixed');
        //} else {
           // $('.navlist').removeClass('topfixed');
        //}
    //});

    // $(window).scroll(function(){
    //     var sct = $(window).scrollTop();
    //     if(sct + $(window).height() + 50 > $(document).height() && !loadMoreLock) {
    //         var CLASSID = CLASSIDArray[showPanelIndex];
    //         var panel = $('#chanel_' + CLASSID),
    //             page = parseInt(panel.attr('data-page'));
    //         totalPage = parseInt(panel.attr('data-totalPage'));
    //         if(page < totalPage) {
    //             loadMoreLock = true;
    //             getData(CLASSID,++page);
    //         }
    //     }
    // })

    //	首页新闻ajax请求
    $.fn.getAjax({
        page:1,
        pageSize:6,
        typeid: typeid,

        container:'.nhc'
    })


    //左侧浮动导航定位
    //左侧浮动导航定位
//      $(document).scroll(function(){
//         var top =  $('.channel_mod').offset().top;
//         var left =  $('.channel_mod').offset().left;
//         if($(document).scrollTop()>top){
// //          console.log($('.left-content').offset().top)
//             $('.ch2-list').css({'left':left-184,'position':'fixed','z-index':'12'})
//         }else{
//             $('.ch2-list').css({'left':'0','position':'absolute','z-index':'12'})
//         }
        
//     });
    
    
    //左侧浮动导航栏二级导航定位

    //  $('.ch2-list>li').hover(function(){
    //     var nav_H = $('.ch2-list').height();
    //     var nav_second = $(this).find('.secondnac-box');
    //     var li_top =  $(this).offset().top;
    //     var ul_top =  $(this).parents('.ch2-list').offset().top;
    //     if(nav_second.find('li').length==0){
    //         nav_second.remove()
    //     }
    //     if(nav_second.height()>nav_H){
    //         nav_second.css('top','44px');
    //         $(this).css('position','static')
    //     }else if(li_top<nav_second.height()){
    //         nav_second.css('top','44px');
    //         $(this).css('position','relative')
        
    //     }else if(li_top>nav_second.height()){
    //         console.log()
    //         nav_second.css('bottom',-.5*(nav_second.height()));
    //         $(this).css('position','relative')
    //     }
        
    // },function(){});

        //左侧浮动导航定位
     $(document).scroll(function(){
        var top =  $('.channel_mod').offset().top;
        var left =  $('.channel_mod').offset().left;
        if($(document).scrollTop()>top){
          //console.log($('.channel_mod').offset().top)

            $('.fudong-nav').css({'left':left-180,'position':'fixed','z-index':'12'})
        }else{
            $('.fudong-nav').css({'left':'0','position':'absolute','z-index':'12'})
        }
        
    });
    
    //左侧浮动导航栏二级导航定位

     $('.fudong-nav>li').hover(function(){
        var nav_H = $('.fudong-nav').height();
        var nav_second = $(this).find('.secondnac-box');
        var li_top =  $(this).offset().top;
        var ul_top =  $(this).parents('.fudong-nav').offset().top;
        if(nav_second.find('li').length==0){
            nav_second.remove()
        }
        if(nav_second.height()>nav_H){
            nav_second.css('top','0');
            $(this).css('position','static')
        }else if(li_top<nav_second.height()){
            nav_second.css('top','0');
            $(this).css('position','relative')
        
        }else if(li_top>nav_second.height()){
            console.log()
            nav_second.css('bottom',-.5*(nav_second.height()));
            $(this).css('position','relative')
        }
        
    },function(){});
  



    //分享功能
    $("html").delegate(".sharebtn", "mouseenter", function(){
        var t = $(this), title = t.attr("data-title"), url = t.attr("data-url"), pic = t.attr("data-pic"), site = encodeURIComponent(document.title);
        title = title == undefined ? "" : encodeURIComponent(title);
        url   = url   == undefined ? "" : encodeURIComponent(url);
        pic   = pic   == undefined ? "" : encodeURIComponent(pic);
        if(title != "" || url != "" || pic != ""){
            $("#shareBtn").remove();
            var offset = t.offset(),
                left   = offset.left - 42 + "px",
                top    = offset.top + 20 + "px",
                shareHtml = [];
            shareHtml.push('<s></s>');
            shareHtml.push('<ul>');
            shareHtml.push('<li class="tqq"><a href="http://share.v.t.qq.com/index.php?c=share&a=index&url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
            shareHtml.push('<li class="qzone"><a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&desc='+title+'&pics='+pic+'" target="_blank">QQ空间</a></li>');
            shareHtml.push('<li class="qq"><a href="http://connect.qq.com/widget/shareqq/index.html?url='+url+'&desc='+title+'&title='+title+'&summary='+site+'&pics='+pic+'" target="_blank">QQ好友</a></li>');
            shareHtml.push('<li class="sina"><a href="http://service.weibo.com/share/share.php?url='+url+'&title='+title+'&pic='+pic+'" target="_blank">腾讯微博</a></li>');
            shareHtml.push('</ul>');

            $("<div>")
                .attr("id", "shareBtn")
                .css({"left": left, "top": top})
                .html(shareHtml.join(""))
                .mouseover(function(){
                    $(this).show();
                    return false;
                })
                .mouseout(function(){
                    $(this).hide();
                })
                .appendTo("body");
        }
    });

    $("html").delegate(".sharebtn", "mouseleave", function(){
        $("#shareBtn").hide();
    });

    $("html").delegate("#shareBtn a", "click", function(event){
        event.preventDefault();
        var href = $(this).attr("href");
        var w = $(window).width(), h = $(window).height();
        var left = (w - 760)/2, top = (h - 600)/2;
        window.open(href, "shareWindow", "top="+top+", left="+left+", width=760, height=600");
    });



});
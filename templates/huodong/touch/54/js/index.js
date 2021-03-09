$(function(){

	// banna轮播图
    $('.picscroll .count').text($('#picscroll li').length);
    $('#picscroll').slider({changedFun:function(n){
        var li = $('#picscroll ul li'), active = li.eq(n);
        if(n < li.length - 1) {
            if(!active.hasClass('showed')) {
                active.addClass('showed');
            }
            var next = li.eq(n+1);
            next.addClass('showed');
        }
        $('.picscroll .page').text(++n);
    }})

    // 个人列表
    $(".tab").click(function(){
        if( $(".lead .tab-list").css("display")=='none' ) {
            $(".lead .tab-list").show();
        }else{
            $(".lead .tab-list").hide();
        }
    });

    //收藏
    $('.jojo-1').click(function(){
        $(this).hide();$(this).siblings('.jojo-2').show();
    })
    $('.jojo-2').click(function(){
        $(this).hide();$(this).siblings('.jojo-1').show();
    })


    // 价格
    $('.list-4, .jo-3 a').click(function(){
        $('.baoming').slideDown(300);
        $('.black,.baoming').show();
    })
    $('.baoming span,.black').click(function(){
        $('.baoming').slideUp(300);
        $('.black').hide();
    })

    //价格勾选
    $('.baoming ul li').click(function(){
        var x = $(this);
        if (x.hasClass('op-1')) {
            x.removeClass('op-1');
        }else{
            x.addClass('op-1');
            x.siblings().removeClass('op-1');
        }
    })

    // 筛选框
    $('.list-head li').click(function(){
        var $t = $(this),
         index = $t.index(),
           box = $('.fenlei .fenlei-1').eq(index);
         if (box.css("display")=="none") {
            $t.addClass('active').siblings().removeClass('active');
            box.show().siblings().hide();
            $('.mask').show();
         }else{
            $t.removeClass('active');
            box.hide();
            $('.mask').hide();
         }
    })
    // 遮罩层
    $('.mask').on('click',function(){
        $('.mask').hide();
        $('.fenlei .fenlei-1').hide();
        $('.list-head li').removeClass('active');
    })
    // 更多评论
    $('.dis-foot').click(function(){
        var dom = $('.discuss ul')
        if (dom.hasClass('turn')) {
            dom.removeClass('turn')
        }else{
            dom.addClass('turn')
        }
    })
    $('.chakan').click(function(){
        $(this).hide();$(this).siblings('.shouqi').show();
    })
    $('.shouqi').click(function(){
        $(this).hide();$(this).siblings('.chakan').show();
    })
    // 列表body置顶
    $('.list-head ul li').click(function(){
        var dom = $('.list-head ul li')
        if (dom.hasClass('active')) {
            $('body').addClass('by')
        }else{
            $('body').removeClass('by')
        }
    })
    $('.mask').click(function(){
        var dom = $('.mask')
        if (dom.hasClass('active')) {
            $('body').addClass('by')
        }else{
            $('body').removeClass('by')
        }
    })
})
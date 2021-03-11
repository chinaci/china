$(function(){
    // 焦点图
    $(".slideBox1").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
    // 顶部新闻选项卡
    $(".Newslead ul li").hover(function(){
        var x = $(this),
            index = x.index();
        x.addClass('newbc').siblings().removeClass('newbc');
        $('.NewsList .NewsDE').eq(index).stop().show().siblings().hide();
    })
    // 商家二维码生成
    $(".BusinessList .code i").each(function(){
        var t = $(this), url = t.data("url");
        t.qrcode({
            render: window.applicationCache ? "canvas" : "table",
            width: 110,
            height: 110,
            text: huoniao.toUtf8(url)
        });
    });
    // 新闻选项卡切换
    $('.HouseLead ul li').click(function(){
        var x = $(this),
            index = x.index();
        x.addClass('HL_bc').siblings().removeClass('HL_bc');
        $(".HouseType .HouseCom").eq(index).show().animate({opacity:1}, 50).siblings().hide().animate({opacity:0}, 50);
    })

    // 二手信息左右切换
    var InfoCon = [], InfoNum = $('.InfoCon .InfoDe');
    for (var i = 0; i < InfoNum.length; i++) {
      InfoCon.push('<div class="InfoDe IT'+i+'">'+$('.InfoCon .InfoDe:eq('+i+')').html()+'</div>');
    }

    var Arr = [];
    for(var i = 0; i < InfoCon.length; i++){
      Arr.push('<div class="InfoCon fn-clear">'+InfoCon.slice(i, i + 3).join("")+'</div>');
      i += 2;
    }

    $('.InfoList .InfoBB').html(Arr.join(""));

    $(".InfoList").slide({titCell:".InfoPage ul",mainCell:".InfoBB",effect:"leftLoop",autoPlay:true,autoPage:"<li>$</li>",interTime:15000});

    // 团购左右切换
    var TuanCon = [], TuanNum = $('.TuanCon .TuanDe');
    for (var i = 0; i < TuanNum.length; i++) {
      TuanCon.push('<div class="TuanDe">'+$('.TuanCon .TuanDe:eq('+i+')').html()+'</div>');
    }

    var Arr = [];
    for(var i = 0; i < TuanCon.length; i++){
      Arr.push('<div class="TuanCon fn-clear">'+TuanCon.slice(i, i + 6).join("")+'</div>');
      i += 5;
    }

    $('.TuanList .TuanBB').html(Arr.join(""));

    $(".TuanList").slide({mainCell:".TuanBB",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next",interTime:10000});

    // 招聘模块左右切换
    $(".Job_lead ul li").hover(function(){
        var x = $(this),
            index = x.index();
        x.addClass('JBL_bc').siblings().removeClass('JBL_bc');
        $('.JobCon .Job_debox').eq(index).show().animate({opacity:1}, 50).siblings().hide().animate({opacity:0}, 50);
    })
})

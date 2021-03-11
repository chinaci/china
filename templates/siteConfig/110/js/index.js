$(function(){
    // 判断浏览器是否是ie8
     if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.app-con .down .con-box:last-child').css('margin-right','0');
        $('.wx-con .c-box:last-child').css('margin-right','0');
        $('.module-con .box-con:last-child').css('margin-right','0');
        $('.recommend-info .picture-con .picture:last-child').css('margin-right','0');
        $('.tuan-box .tuan-con .main-tuan:last-child').css('margin-right','0');
        $('.qiye-con .main-box:last-child').css('margin-right','0');
        $('.house-box .slideBox .bd ul li .li-box:last-child').css({'border-bottom':'none','padding-bottom':'0'});
        $('.kefu-box .con-box .sub-fi:nth-child(4n)').css('margin-right','0');
        $('.rec-item:nth-child(4n)').css('margin-right','0');
        $('.kefu-box .con-box .bu-con ul.fb-list li:nth-child(5n)').css('margin','0 0 10px 0');
        $('.login-success .personal .person').css('background','#71adff');
        $('.login-success .personal .integral').css('background','#ffb145');
        
     }
     // 手机端、微信端
     $('.app-con .icon-box.app').hover(function(){
        $('.app-down').show();
     },function(){
        $('.app-down').hide();
     });
     $('.app-con .icon-box.wx').hover(function(){
        $('.wx-down').show();
     },function(){
        $('.wx-down').hide();
     })



    //鼠标经过头部链接显示浮动菜单
    $(".nav-con ul li").hover(function(){
        var t = $(this), pop = t.find(".li-down");
        pop.show();
        t.addClass("active");
    }, function(){
        var t = $(this), pop = t.find(".li-down");
        pop.hide();
        t.removeClass("active");
    });




  //搜索
   $(".MoudleNav ul li").click(function(){
      var index = $(this).closest('a').attr("data-module");
      $(".MoudleNav ul li").removeClass('MooudleBC');
      $(this).addClass('MooudleBC');
      $('.FormBox').find('.'+index+'').show().siblings().hide();
      $('.FormBox').find('.'+index+'').find(".inpbox input").focus();
      $('.keytype').text($(this).text());
      $('.search dl').removeClass('hover');
  })
  $('.search dl').hover(function(){
      var a = $(this);
      a.addClass('hover');
      a.find('dd .curr').addClass('active').siblings().removeClass();
  },function(){
      $(this).removeClass('hover');
  }).find('dd a').click(function(){
      var a = $(this);
      var index = $(this).attr("data-module");
      if (a.attr("data-id") == "0") {
          $('.FormBox').find('.'+index+'').show().siblings().hide();
          $('.FormBox').find('.'+index+'').find(".inpbox input").focus();
          $('.keytype').text(a.find('span').text());
          a.addClass('active curr').siblings().removeClass();
          $('.search dl').removeClass('hover');
      }
  }).hover(function(){
      var a = $(this);
      a.addClass('active').siblings().removeClass('active');
  })
  $('.searchkey').focus(function(){
      $('.hotkey').addClass('leave').stop().animate({
          'right' : '-400px'
      },500);
  }).blur(function(){
      $('.hotkey').removeClass('leave').stop().animate({
          'right' : '15px'
      },500);
  })


  //二级导航
  $(".MoudleNav li").hover(function(){
    $(this).addClass("current");
  }, function(){
    $(this).removeClass("current");
  });
  
    var slideBox6 = [];
    $(".life-wrap .left-tab p").hover(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var i=$(this).index();
        $('.life-m-wrap').find(".slideBox6").eq(i).addClass("show").siblings().removeClass("show");
        if(!slideBox6[i]){
          slideBox6[i] = $('.slideBox6: ').slide({mainCell: "ul",effect:"leftLoop",autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
        }
    });
    //      
    
    //广告焦点
     $(".slideBox6").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});
     
    // 焦点图
    $(".slideBox1").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
    
    //同城活动
    var swiperNav = [], mainNavLi = $('.slideBox2 .bd').find('li');
    for (var i = 0; i < mainNavLi.length; i++) {
      swiperNav.push($('.slideBox2 .bd').find('li:eq('+i+')').html());
    }
    var liArr = [];
    for(var i = 0; i < swiperNav.length; i++){
      liArr.push(swiperNav.slice(i, i + 4).join(""));
      i += 3;
    }
    //$('.slideBox2 .bd').find('ul').html('<li>'+liArr.join('</li><li>')+'</li>');
    $(".slideBox2").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});


     //推荐商品-导航条
    $(".goods-box .top-box ul li").hover(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var i=$(this).index();
        $(".goods-con").eq(i).addClass("show").siblings().removeClass("show");
    });


    //数码手机-导航条
    var slideBox3 = [];
    $(".recommend-info .top-box ul li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var i=$(this).index();
        $(this).closest('.recommend-info').find(".info-con").eq(i).addClass("show").siblings().removeClass("show");
        if(!slideBox3[i]){
          slideBox3[i] = $('.slideBox3:eq('+i+')').slide({mainCell: "ul",effect:"leftLoop",autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
        }
    });

    $('.slideBox3').each(function(index){
      var t = $(this), bd = t.find('.bd'), ul = bd.find('ul');
      var swiperNav = [], mainNavLi = ul.find('li');
      for (var i = 0; i < mainNavLi.length; i++) {
        swiperNav.push(ul.find('li:eq('+i+')').html());
      }
      var liArr = [];
      for(var i = 0; i < swiperNav.length; i++){
        liArr.push(swiperNav.slice(i, i + 5).join(""));
        i += 3;
      }
      ul.html('<li>'+liArr.join('</li><li>')+'</li>');

      if(index == 0){
        slideBox3[index] = t.slide({mainCell: "ul",effect:"leftLoop",autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
      }
    });
    

    //一句话求职-导航条
    $(".word .word-title ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on");
        var i=$(this).index();
        $(".word-info").eq(i).addClass("show").siblings().removeClass("show");
        $(".word .buy a").eq(i).show().siblings().hide();
    });


    //房产经纪人、中介公司-切换
     $(".room-wrap .room-title ul li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var i=$(this).index();
        $(".room-con").eq(i).addClass("show").siblings().removeClass("show");
    });

     //最新入驻企业--轮播
     $(".slideBox4").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop",autoPage:"<li></li>"});

    //最新入驻企业
    var bussiItem;
    $('.job-company-popup').hover(function(){
      $(this).show();
      bussiItem.addClass('hover');
      return false;
    }, function(){
      $(this).hide();
      bussiItem.removeClass('hover');
    });

    $('.bussi-item').hover(function(){
      var t = $(this), offset = t.offset(), hide = t.find('.fn-hide').html();
      var h = offset.top;
      var w = offset.left;
      bussiItem = t;
      t.addClass('hover');
      $('.job-company-popup')
        .css({'left': w - 15, 'top': h + t.height() + 9})
        .html(hide)
        .stop()
        .fadeIn();
    }, function(){
      $(this).removeClass('hover');
      $('.job-company-popup').hide();
    });

    //最新入驻--轮播
    $(".slideBox5").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});

})

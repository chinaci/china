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
        $('.kefu-box .con-box .bu-con ul.fb-list li:nth-child(5n)').css('margin','0 0 10px 0');
        $('.floor-wrap .floor-right .floor-bottom ul li:last-child').css('margin-right','0');
        $('.buy-wrap .buy-middle ul li:nth-child(3n)').css('margin-right','0');
        $('.build .tab-con ul li:last-child').css('margin-right','0');
        $('.buy-two .sou .submit').css('top','8');
        $('.buy-two .sou .submit').css('top','4');
        $('.logo-wrap .pub-room').css('background','#ff8a00');
        $('.buy-two .two-right .two-block').css('background','#ffa200');
        $('.buy-two .two-right .block-r').css('background','#2270ff');
        $('.buy-wrap .buy-right .book input').css('background','#ffa200');
        $('.search-top li').not('.active').hover(function(){
            $(this).css('background','#ffdfd8');
        },function(){
            $(this).css('background','#fff');
        });
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
    // 搜索头部样式
    $('.search-top li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');

    })


    /* 左侧导航 */
    $(".category-popup").hover(function(){
        $(this).find("li").show();
        $(this).addClass("category-hover");
        $(this).find(".more").hide();
    }, function(){
        $(this).removeClass("category-hover");
        $(this).find("li").each(function(){
            var index = $(this).index();
            if(index > 3 ){
                $(this).hide();
            }
        });
        $(this).find(".more").show();
    });

    $(".category-popup li").hover(function(){
        var t = $(this);
        t.siblings("li").removeClass("active");
        t.siblings("li").find(".sub-category").hide();

        if(!t.hasClass("active")){
            t.addClass("active");

            setTimeout(function(){
                if(t.find(".subitem").html() == undefined){
                    // var dlh = $(".category-popup").height(), ddh = dlh - 55, ocount = parseInt(ddh/32), aCount = t.find("dd a").length;
                    // t.find("dd").css("height", ddh+"px");
                    // t.find(".sub-category").css({"width": Math.ceil(aCount/ocount) * 120 + "px"});
                    // t.find("dd a").each(function(i){ t.find("dd a").slice(i*ocount,i*ocount+ocount).wrapAll("<div class='subitem'>");});
                }
            }, 1);
            t.find(".sub-category").show();
        }
    }, function(){
        $(this).removeClass("active");
        $(this).find(".sub-category").hide();
    });

    //焦点图
    $(".slideBox1").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
    //焦点图2
    $(".slideBox2").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
    //焦点图3
    $(".slideBox3").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});

    //推荐楼盘-导航条
    $(".build .build-tab ul li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var i=$(this).index();
        $(".tab-con").eq(i).addClass("show").siblings().removeClass("show");
    });
    //文字向上滚动
    $(".txtMarquee-top").slide({mainCell:".bd ul",autoPlay:true,effect:"topMarquee",vis:5,interTime:50});

    //最新求购--焦点图4
    $(".slideBox4").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});

    //中介公司-焦点图5
     $(".slideBox5").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
    

    //报名组团看房下拉菜单
    $('#selectTypeMenu').hover(function(){
        $(this).show();
        $(".searchArrow").addClass("searchArrowRote");
    }, function(){
        $(this).hide();
        $(".searchArrow").removeClass("searchArrowRote");
    });

    $("#selectTypeText").hover(function () {
        $(this).next("span").slideDown(200);
        $(".searchArrow").addClass("searchArrowRote");
    }, function(){
        $(this).next("span").hide();
        $(".searchArrow").removeClass("searchArrowRote");
    });
    
    $("#selectTypeMenu>a").click(function () {
        $("#selectTypeText").text($(this).text());
        $("#selectTypeRel").attr("value", $(this).attr("rel"));
        $(this).parent().hide();
        $(".searchArrow").removeClass("searchArrowRote");
    });

    //经纪人
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



    $("#search_button").bind('click', function () {

        var keywords = $("#search_keyword"), txt = $.trim(keywords.val());
        if(txt != ""){
            var href = $(".logo-wrap .search .active a").attr("data-href");
            if(href != ""){
                location.href = href + (href.indexOf("?") > -1 ? "&" : "?") + "keywords="+txt;
            }
        }else{
            keywords.focus();
        }
    })


    //回车搜索
    $("#search_keyword").keyup(function (e) {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode) {
            code = e.keyCode;
        }
        else if (e.which) {
            code = e.which;
        }
        if (code === 13) {
            $("#search_button").click();
        }
    });

   $(".sale1_search").bind('click', function () {
       var key = $(".sale1_key").val();
       if(key == ''){
           alert("请输入正确的关键字");return false;
       }
       var url = window.location.href + '/sale.html?keywords='+key;
       window.location.href = url;
       return false;
   })

    $(".broker_search").click(function () {
        var key = $(".broker_key").val();
        if(key == ''){
            alert("请输入正确的关键字");return false;
        }
        var url = window.location.href + '/broker.html?keywords='+key;
        window.location.href = url;
        return false;
    })

    $(".broker2_search").click(function () {
        var key = $(".broker_key2").val();
        if(key == ''){
            alert("请输入正确的关键字");return false;
        }
        var url = window.location.href + '/broker.html?keywords='+key;
        window.location.href = url;
        return false;
    })
    $(".zhongjiegongsi_search").click(function () {
        var key = $(".zhongjiegongsi_key").val();
        if(key == ''){
            alert("请输入正确的关键字");return false;
        }
        var url = window.location.href + '/store.html?keywords='+key;
        window.location.href = url;
        return false;
    })



    $(".sale2_search").click(function () {
        var key = $(".sale2_key").val();
        if(key == ''){
            alert("请输入正确的关键字");return false;
        }
        var url = window.location.href + '/sale.html?keywords='+key;
        window.location.href = url;
        return false;
    })
})

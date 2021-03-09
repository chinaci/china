$(function(){
  var device = navigator.userAgent;
  if(device.indexOf('huoniao') > -1){
        $('.area a').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {'module': 'info'}, function(){});
            });
        });
    }

  // banner轮播图
  new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination',} ,slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:{delay: 2000,}});

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
          // loadMoreLock = false;
              var recomTab = $('.recomTab');

              $(".recomTab .active").removeClass('active');
              $(".recomTab li").eq(tabsSwiper.activeIndex).addClass('active');

              $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());


          },
    },

  })

  $(".recomTab li").on('touchstart mousedown',function(e){
    e.preventDefault();
    $(".recomTab .active").removeClass('active');
    $(this).addClass('active');
    tabsSwiper.slideTo( $(this).index() );
  });


    //滚动信息
    $.ajax({
        url : "/include/ajax.php?service=info&action=ilist_v2",
        type : "GET",
        data : {},
        dataType : "json",
        success : function (data) {
            var obj = $(".mBox .swiper-wrapper");
            if(data.state == 100){
                var list = data.info.list;
                var html = '';
                var length = list.length;
                for (var i = 0; i < length; i++){
                    if(i < length){
                        if(i % 2 != 0 ){
                            continue;
                        }
                    }
                    var price_ = '';
                    if(list[i].price_switch == 0){
                        if(list[i].price > 0){
                            price_ = '<span><em>'+echoCurrency('symbol')+'</em>' + list[i].price+'</span>';
                        }else{
                            price_ = '<span>面议</span>';
                        }
                    }
                    var html2 = '';
                    if(i != length-1){
                        var price__ = '';
                        if(list[i+1].price > 0) {
                            price__ = '<span><em>' + echoCurrency('symbol') + '</em>' + list[i + 1].price + '</span>';
                        }else{
                            price__ = '<span>面议</span>';
                        }
                        html2 =  '<a href="'+list[i+1].url+'" class="fn-clear"><p>'+list[i+1].title+'</p>'+price__+'</a>' ;
                    }
                    html += '<div class="swiper-slide swiper-no-swiping">' +
                        '<a href="'+list[i].url+'" class="fn-clear"><p>'+list[i].title+'</p>'+price_+'</a>' +
                        html2 +
                        '</div>';

                }
                obj.html(html);
                new Swiper('.tcNews .swiper-container', {direction: 'vertical', pagination: { el: '.tcNews .pagination'},loop: true,autoplay: {delay: 2000},observer: true,observeParents: true,disableOnInteraction: false});
            }
        }
    });




    // 悬浮发布
  $(document).ready(function (ev) {
      $('.menu').on('touchend', function (ev) {
          if($('.mask').hasClass('show')){
             $('.mask').removeClass('show');
           }else{
             $('.mask').addClass('show');
           }
          $('.mIcon').toggleClass('close');
          $('.menu').toggleClass('m_active');
          $('.mIcon.wx').toggleClass('m_curr');
          $('.mIcon.fb').toggleClass('m_curr');
          $('.mIcon.my').toggleClass('m_curr');
      });

  });

    var tabHeight = 1700;
    var lng = lat = 0;

    function getList(){


        var lat2 = lat,lng2 = lng;

            //最新入驻店铺
            $.ajax({
                url : '/include/ajax.php?service=info&action=shopList',
                data : {
                    'orderby' : 1,
                    'page' : 1,
                    'pagesize':5,
                    'lat2' : lat2,
                    'lng2' : lng2
                },
                type : 'get',
                dataType : 'jsonp',
                success : function (data) {
                    if(data.state == 100){
                        list = data.info.list;

                        var obj = $(".recomShop").eq(0).find("ul");
                        var len = list.length;
                        tuijian_shop_len = len;
                        var html = '';
                        var top_htm;
                        for (var i = 0; i < len; i++){
                            if(list[i].top == '1'){
                                top_htm = 'style="background:  #fff  url('+templatePath+'images/top.png)  no-repeat right top;background-size: .94rem;"';
                            }else{
                                top_htm = '';
                            }
                            var photo = list[i].user['photo'];
                            var is_video = '';
                            if(list[i].video){
                                is_video = '<div class="mVideo"></div>';
                            }
                            var litphoto = list[i].user['photo'] != "" && list[i].user['photo'] != undefined ? huoniao.changeFileSize(list[i].user['photo'], "small") : "/static/images/404.jpg";

                            html += '<li class="acttop fn-clear" '+top_htm+'>' +
                                '<div class="rleft">' +
                                '<a href="'+list[i].url+'">' +
                                '<div class="rpic">' +
                                '<img src="'+litphoto+'" alt="">' +
                                is_video +
                                '</div>' +
                                '<div class="rinfo">' +
                                '<div class="rtitle">'+list[i].user.company+'</div>' +
                                '<p class="p-comment">'+list[i].shop_common+'评论</p>' +
                                // '<!--<span class="starbg"><i class="star" style="width: 60%;"></i></span>-->' +
                                '<p class="mark"><span class="mcolor1">商家</span><span class="mcolor2">'+list[i].typename+'</span></p>' +
                                '<p class="addr">'+list[i].address_[list[i].address_.length-1]+' <span><i class="pos"></i><em>'+list[i].lnglat_diff+'km</em></span></p>' +
                                '</div>' +
                                '</a>' +
                                '</div>' +
                                '<div class="rright tel" data-tel="'+list[i].tel+'">' +
                                '<img src="'+templatePath+'images/hPhone.png" alt="">' +
                                '</div>' +
                                '</li>';
                        }
                        obj.html(html);
                        tabHeight = $('.recomTab').offset().top;

                    }else{
                        tabHeight = $('.recomTab').offset().top;
                        $(".recomShop").eq(0).find("ul .empty").html('暂无数据！');

                    }

                }
            })



            //推荐信息
            $.ajax({
                url : '/include/ajax.php?service=info&action=ilist_v2',
                data : {
                    'orderby' : 1,
                    'lat2' : lat2,
                    'lng2' : lng2,
                    'rec' : 1
                },
                type : 'get',
                dataType : 'json',
                success : function (data) {
                    if(data.state == 100){
                        list = data.info.list;
                        var obj2 = $(".tuijianInfo .reInfo");
                        var len = list.length;
                        var html = '';
                        var top_htm;
                        var isshop_htm = '';
                        var juli = '';

                        for (var i = 0; i < len; i++){
                            var price_ = '';
                            if(list[i].price_switch == 0){
	                            if(list[i].price != 0){
	                                price_ = '<span class="mprice"><em>'+echoCurrency('symbol')+'</em>' + list[i].price+'</span>';
	                            }else{
	                                price_ = '<span class="mprice">价格面议</span>';
	                            }
                            }
                            if(list[i].is_shop){
                                isshop_htm = '<span class="mcolor1">商家</span><span class="mcolor2">'+list[i].typename+'</span>';
                                juli = '<i class="pos"></i><em>'+list[i].lnglat_diff+'km</em>';
                            }else{
                                isshop_htm = '<span class="mcolor1">个人</span>'+price_;
                                juli = list[i].pubdate1;
                            }
                            if(list[i].top == '1'){
                                top_htm = 'style="background:  #fff  url('+templatePath+'images/top.png)  no-repeat right top;background-size: .94rem;"';
                            }else{
                                top_htm = '';
                            }
                            var is_video = '';
                            if(list[i].video){
                                is_video = '<div class="mVideo"></div>';

                            }else{
                                is_video = '<div class="pnum">'+list[i].pcount+'图</div>';

                            }

                            // var litpic = huoniao.changeFileSize(list[i].litpic, "small");
                            var litpic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
                            var areaCode = list[i].areaCode;
                            var code = '',code2='';
                            if(areaCode != '' && areaCode != '86'){
                                code = '+'+areaCode+' ';
                                code2 = areaCode;
                            }
                            html += '<li class="fn-clear" '+top_htm+'>' +
                                '<div class="rleft">' +
                                '<a href="'+list[i].url+'">' +
                                '<div class="rpic">' +

                                '<img src="'+litpic+'" alt="">' +
                                is_video +

                                '</div>' +
                                '<div class="rinfo">' +
                                '<div class="rtitle">'+list[i].title+'</div>' +
                                '<p class="p-comment">' +
                                '<!--<span class="starbg"><i class="star" style="width: 40%;"></i></span>-->' +
                                '' +
                                list[i].common+'评论</p>' +
                                '<p class="mark">'+isshop_htm+'</p>' +
                                '<p class="addr">'+list[i].address[list[i].address.length-1]+' <span>'+juli+'</span></p>' +
                                '</div>' +
                                '</a>' +
                                '</div>' +
                                '<div class="rright tel" data-tel="'+code2+list[i].tel+'" data-code="'+code+list[i].tel+'">' +
                                '<img src="'+templatePath+'images/hPhone.png" alt="">' +
                                '</div>' +
                                '</li>';
                            juli = '';

                        }


                        obj2.html(html+"<div class=\"loading\">到底了...</div>");
                    }else{
                        $(".tuijianInfo .reInfo").find('.empty').html('暂无数据！');
                    }
                }
            })


            //推荐店铺
            $.ajax({
                url : '/include/ajax.php?service=info&action=shopList',
                data : {
                    'orderby' : 1,
                    'pagesize' : 10,
                    'page' : 1,
                    'lat2' : lat2,
                    'lng2' : lng2
                },
                type : 'get',
                dataType : 'json',
                success : function (data) {
                    if(data.state == 100){
                        list = data.info.list;

                        var obj = $(".tuijianshop .reShop");
                        var len = list.length;
                        var html = '';
                        var top_htm;

                        for (var i = 0; i < len; i++){
                            if(list[i].top == '1'){
                                top_htm = 'style="background:  #fff  url('+templatePath+'images/top.png)  no-repeat right top;background-size: .94rem;"';
                            }else{
                                top_htm = '';
                            }
                            var is_video = '';
                            if(list[i].video){
                                is_video = '<div class="mVideo"></div>';
                            }
                            var litphoto = list[i].user['photo'] != "" && list[i].user['photo'] != undefined ? huoniao.changeFileSize(list[i].user['photo'], "small") : "/static/images/404.jpg";

                            html += '<li class="acttop fn-clear" '+top_htm+'>' +
                                '<div class="rleft">' +
                                '<a href="'+list[i].url+'">' +
                                '<div class="rpic">' +
                                '<img src="'+litphoto+'" alt="">' +
                                is_video +
                                '</div>' +
                                '<div class="rinfo">' +
                                '<div class="rtitle">'+list[i].user.company+'</div>' +
                                '<p class="p-comment">'+list[i].shop_common+'评论</p>' +
                                // '<!--<span class="starbg"><i class="star" style="width: 60%;"></i></span>-->' +
                                '<p class="mark"><span class="mcolor1">商家</span><span class="mcolor2">'+list[i].typename+'</span></p>' +
                                '<p class="addr">'+list[i].address_[list[i].address_.length-1]+' <span><i class="pos"></i><em>'+list[i].lnglat_diff+'km</em></span></p>' +
                                '</div>' +
                                '</a>' +
                                '</div>' +
                                '<div class="rright tel" data-tel="'+list[i].tel+'">' +
                                '<img src="'+templatePath+'images/hPhone.png" alt="">' +
                                '</div>' +
                                '</li>';
                        }
                        obj.html(html+"<div class=\"loading\">到底了...</div>");
                    }else{
                        $(".tuijianshop .reShop").find('.empty').html('暂无数据！');
                    }
                }
            })


    }
    function checkLocal(){
        var local = false;
        if(!local){
            HN_Location.init(function(data){
                if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
                    lng = lat = -1;
                }else{
                    lng = data.lng;
                    lat = data.lat;
                    getList();
                }
            })
        }else{
            getList();
        }

    }

    checkLocal();




    $(window).scroll(function() {
        if ($(window).scrollTop() > tabHeight) {
            $('.recomTab').addClass('topfixed');
        } else {
            $('.recomTab').removeClass('topfixed');
        }
    });



});

var URL = location.href;
var URLArrary = URL.split('?type=');
var iname_start = getParam('type') ? getParam('type') : listid;
function getParam(name) {
   return location.href.match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';
}
$(function () {
  
  	var device = navigator.userAgent;
  	if(device.indexOf('huoniao') > -1){
        $('.areaChose').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {'module': 'article'}, function(){});
            });
        });
    }
  
    //APP端取消下拉刷新
    toggleDragRefresh('off');
  
    var cookie = $.cookie("HN_float_hide");
    //如果不是在客户端，显示下载链接
    if (device.indexOf('huoniao') <= -1 && cookie == null && $('.float-download').size() > 0) {
        $('.refreshText').css('top', '2.8rem')
        $('.container').css('padding-top', '2.8rem');
        $('.float-download').show();
    }

    $('.float-download .closesd').click(function () {
        $('.float-download').hide();
        $('.refreshText').css('top', '1.6rem')
        $('.container').css('padding-top', '1.6rem');
        setCookie('HN_float_hide', '1', '1');
    });

    function setCookie(name, value, hours) { //设置cookie
        var d = new Date();
        d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }

    var isload = 0,
        page;
    var advlen1 = $('.con_all .adv_banner1').find('.swiper-slide').length;
    var advlen2 = $('.adv_banner2').find('.swiper-slide').length;
    if (advlen1 != 0) {
        var swiper_adv = new Swiper('.adv_banner1 .swiper-container', {
            centeredSlides: true,
            slidesPerView: 'auto',
            pagination: {
                el: '.pagination'
            },
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            spaceBetween: 4,
            loop: true,

        });
    } else {
        $('.con_all .BannerBox').hide()
    }
    if (advlen2 != 0) {
        var swiper_adv = new Swiper('.adv_banner2 .swiper-container', {
            centeredSlides: true,
            slidesPerView: 'auto',
            pagination: {
                el: '.pagination'
            },
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            spaceBetween: 4,
            loop: true,

        });
    } else {
        $('.con_zt .BannerBox').hide()
    }

//  getNav();

    //政企号左侧栏目固定



    //判断视频窗口是否在可视窗口内,导航栏置顶
    $(window).scroll(function () {
        if ($('.video_pannel').length > 0) {
            var t = $('.video_pannel'),
                p = t.parents('.img_box');

            var a = $('.video_pannel').offset().top;
            if (a + p.height() < $(window).scrollTop() || a > ($(window).scrollTop() + $(window).height())) {
                p.removeClass('video_in')
                $('.video_pannel').remove();
            }
        }

        if($(window).scrollTop()>($('.header').height())){
            $('.nav_box').addClass('topfixed');
        }else{
            $('.nav_box').removeClass('topfixed');
        }

    });


    //判断是否有广告图
    if ($('.bg_banner').find('div').length > 0) {
        $('.top_head .logobox').addClass('fn-hide');

    } else {
        $('.top_head .logobox').removeClass('fn-hide');
    }

    //政企号分类
    $('.list_left').delegate('li', 'click', function () {
        $(this).addClass('on').siblings('li').removeClass('on');
        $('.list_right ul').html('');
        page = 1; //重新加载新的分类
        isload = 0;
        $('.list_left li.on').attr('data-page', '1')
        getdata_zqnum()
    });

    //首页跳媒体号
    $('body').delegate('.mediabox .more','click',function(){
        $('.nav_box li[data-index="zqnum"]').click()
    });
    $('body').delegate('.mediabox .more_zqnum','click',function(){
        $('.nav_box li[data-index="zqnum"]').click()
    });


    //关注
    $('.list_right').delegate('.carebtn', 'click', function () {
        var userid = $.cookie(cookiePre + "login_user");
        if (userid == null || userid == "") {
            window.location.href = masterDomain + '/login.html';
            return false;
        }

        if ($(this).hasClass('caredbtn')) {
            $(this).removeClass('caredbtn').html('关注');
        } else {
            $(this).addClass('caredbtn').html('已关注');
        }
        var mediaid = $(this).attr("data-id");
        $.post("/include/ajax.php?service=member&action=followMember&for=media&id=" + mediaid);

        return false;

    });

    //点击播放视频
    $('.news_box').delegate('.libox.video_box .img_box', 'click', function () {
        var id = $(this).parents('.libox.video_box').attr('data-id');
        var poster = $(this).find('img').attr('src')
        var t = $(this),
            p = $(this).parents('.video_box'),
            p_p = p.parents('.ulbox');
        //  var p_sib = t.parents('.libox.video_box').siblings('.libox.video_box');
        var videourl = p.attr('data-src'),
            videotype = p.attr('data-type');
        var video = '';
        if (videotype == '0') {
            //    video='<video class="video_pannel" webkit-playsinline="true" x-webkit-airplay="true"  playsinline="true"x5-video-player-type="h5" x5-video-player-fullscreen="true" preload="auto"  src="'+videourl+'" poster="'+poster+'"  controls="controls" autoplay="autoplay"></video>'
            video = '<div class="video_pannel prism-player" id="player-con" data-poster="' + poster +
                '" data-src="' + videourl + '" style="width:100%; height:3.92rem"></div>'
        } else {
            video = '<iframe class="video_pannel" src="' + videourl +
                '" frameborder="0" width="100%" height="100%" class="vIframe" allowfullscreen="true"></iframe>'
        }
        if ((t.find('iframe').length == 0) && (t.find('video').length == 0)) {
            p_p.find('.img_box').removeClass('video_in');
            p_p.find('.img_box .video_pannel').remove();
            t.append(video);
            t.addClass('video_in');

            if (videotype == '0') {
                var player = new Aliplayer({
                    "id": "player-con",
                    "source": videourl,
                    "cover": poster,
                    "width": "100%",
                    "height": "4.2rem",
                    "autoplay": true,
                    "rePlay": false,
                    "playsinline": true,
                    "preload": true,
                    "controlBarVisibility": "hover",
                    "useH5Prism": true,
                    "skinLayout": [
                        {
                            "name": "H5Loading",
                            "align": "cc"
    },
                        {
                            "name": "tooltip",
                            "align": "blabs",
                            "x": 0,
                            "y": 56
    },
                        {
                            "name": "controlBar",
                            "align": "blabs",
                            "x": 0,
                            "y": 0,
                            "children": [
                                {
                                    "name": "progress",
                                    "align": "blabs",
                                    "x": 0,
                                    "y": 44
        },
                                {
                                    "name": "playButton",
                                    "align": "tl",
                                    "x": 15,
                                    "y": 12
        },
                                {
                                    "name": "timeDisplay",
                                    "align": "tl",
                                    "x": 10,
                                    "y": 7
        },
                                {
                                    "name": "fullScreenButton",
                                    "align": "tr",
                                    "x": 10,
                                    "y": 12
        },
                                {
                                    "name": "volume",
                                    "align": "tr",
                                    "x": 5,
                                    "y": 10
        }
      ]
    }
  ],
                }, function (player) {
                    $('#player-con video').attr('poster', poster);
                    console.log("播放器创建了。");
                });
            }
        }
        return false;


    })










    //更多导航栏展开，关闭
    $('.more_nav').click(function () {
        $('.nav_all').animate({
            'bottom': '0',
            'height': $(window).height(),
        }, 200);
    });
    $('.close_btn').click(function () {
        $('.nav_all').animate({
            'bottom': '-100%',

        }, 200);
    });

    //新增导航
    $('.nav_all').delegate('li', 'click', function (e) {
        var p = $(this).parents('ul'),
            t = $(this);
        if (!p.hasClass('addnav')) {
            $(this).addClass('nav_on').siblings().removeClass('nav_on');
            var iname = $(this).attr('data-index');
            console.log(iname);
            $('.nav_box li[data-index="'+iname+'"]').click();
            $('.nav_all').animate({
                'bottom': '-100%'
            }, 200);
        }

    });



    //分站导航显示
    $('body').delegate('.s_nav a i', 'click', function (e) {
        var left = $(this).parents('.s_nav').offset().left;
        $('.s_box').show().css('left', left);
        $(document).click(function () {
            $('.s_box').hide();
        })
        e.stopPropagation();
    });

    $('body').delegate('.s_box li ', 'click', function (e) {
        var txt = $(this).text();
        $(this).addClass('s_active').siblings().removeClass('s_active')
        $('.s_nav').attr('data-page', 1).find('a').html(txt + '<i></i>');
        $('.con_area .news_box .ulbox').remove();
        getall(1, 'reg_area');
        return 0;
    });


    // 媒体号

   $('.footer_4_3 li.ficon').click(function(){
       var t = $(this),index = t.index();
       var code = $(this).attr('data-code');
       var icon1 = $('.footer_4_3 li').eq(1).find("a").attr("data-icon1"),
           icon2 =  $('.footer_4_3 li').eq(1).find("a").attr("data-icon2");
       var h_icon1 =  $('.footer_4_3 li').eq(0).find("a").attr("data-icon1"),
           h_icon2 =  $('.footer_4_3 li').eq(0).find("a").attr("data-icon2");
       t.addClass("icon_on").siblings('.ficon').removeClass('icon_on')
       if(index==1 && code=='media'){
          t.find('img').attr('src',icon2);
          $('.footer_4_3 li').eq(0).find('img').attr('src',h_icon1);
       }else if(index==0){
           $('.footer_4_3 li').eq(1).find('img').attr('src',icon1);
           t.find('img').attr('src',h_icon2);
       }
    });


    //左右导航切换
    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 350,
        touchAngle: 35,
        observer: true,
        observeParents: true,
        freeMode: false,
        longSwipesRatio: 0.1,
        autoHeight: true,
        on: {
            init: function () {
                //      page = 1;
//              if(iname_start=='zqnum'){
//                  $('.ficon.media_list').click();
//              }
                if(iname_start=='all' || (!iname_start && listid!='all' && !listid) ){
                    getall(1,'top'); //置顶数据加载
                    adv();  //广告
                    getall_zt(1);  //专题
                    getall(1,'reg');//测试
                }

            },
            slideChangeTransitionStart: function () {
                isload = 1;
                var recomTab = $('.nav_box');
                $(".nav_box .active").removeClass('active');
                $(".nav_box li").eq(this.activeIndex).addClass('active');
                var iname = $(".nav_box li").eq(this.activeIndex).attr('data-index');
                var len = $('.con_' +iname).find('.ulbox li').length;
                var end = $('.active').offset().left + $('.active').width() / 2 - $('body').width() /2;
                var star = $(".nav_box .f_nav").scrollLeft();
                var icon1 = $('.footer_4_3 li').eq(1).find("a").attr("data-icon1"),
                    icon2 =  $('.footer_4_3 li').eq(1).find("a").attr("data-icon2");
                var h_icon1 =  $('.footer_4_3 li').eq(0).find("a").attr("data-icon1"),
                    h_icon2 =  $('.footer_4_3 li').eq(0).find("a").attr("data-icon2");
                if(iname != 'zqnum'){
                    $('.footer_4_3 li').eq(0).addClass('icon_on').siblings('.ficon').removeClass('icon_on')
                    $('.footer_4_3 li').eq(0).find('img').attr('src',h_icon2);
                    $('.footer_4_3 li').eq(1).find('img').attr('src',icon1);
                }else{

                    $('.footer_4_3 li').eq(1).addClass('icon_on').siblings('.ficon').removeClass('icon_on')
                    $('.footer_4_3 li').eq(1).find('img').attr('src',icon2);
                    $('.footer_4_3 li').eq(0).find('img').attr('src',h_icon1);
                }
                $('.f_nav').scrollLeft(end + star);
                window.history.replaceState({}, 0, '?type=' + (iname?iname:listid))
                if (len != 0) {
                    console.log('已经加载');
                } else if (iname == 'video') {
                    getdata_video();
                } else if (iname == 'zqnum') {
                    var h1 = $(window).height();
                    var h2 = $('.footer_3_4').height()+$('.fixed_box').height();
                    $('.con_zqnum').find('.list_left').css('height',h1-h2)
                    getdata_zqnum();
                } else if (iname == 'zt') {
                    getdata_zt()
//                  console.log('333')
                } else if (iname == 'all') {
                    getall(1, 'top'); //置顶数据加载
                    getall_zt(1); //专题
                    getall(1, 'reg'); //测试
                } else if (iname == 'area') {
                    getall(1, 'reg_area');
                } else if (iname == 'live') {
                    getdata_live();
                } else if (iname == 'last') {
                    var mold = $('.nav_all .nav_on').attr('data-mold'),
                        typeid = $('.nav_all .nav_on').attr('data-id');
                    get_last(typeid, mold);
                } else {
                    var mold = $('.nav_box .active').attr('data-mold'),
                        typeid = $('.nav_box .active').attr('data-id');
                    add_list(typeid, mold);
                }

            },
            slideChangeTransitionEnd: function () {
                $("img").scrollLoading(); //测试懒加载
                setTimeout(function () {
                    isload = 0;
                }, 1000);

            }
        },

    });
     if(iname_start!='all'){
        tabsSwiper.slideTo($('.f_nav li[data-index="'+iname_start+'"]').index() );

    }else if(listid){
//      console.log(listid)
        tabsSwiper.slideTo($('.f_nav li[data-index="'+listid+'"]').index() );
    }
     $(window).bind('hashchange', function() {
        var change = location.href;
        var n_url = change.split('?type=');
        var hash = n_url[1]?n_url[1]:'all';
        tabsSwiper.slideTo($('.f_nav li[data-index="'+hash+'"]').index() );
    });
    $(".nav_box .f_nav li").on('click', function (e) {

        e.preventDefault();
        $(".recomTab .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index());
    });

    $(".footer_4_3 li").click(function(e){
        var index = $(this).index();
        var code = $(this).attr('data-code');
        if(index==1 && code=='media'){
            $(".nav_box .f_nav li[data-index='zqnum']").click();
            e.preventDefault()
        }else if(index==0){
            $(".nav_box .f_nav li[data-index='all']").click();
            e.preventDefault()
        }

    })

    var advIds = null;

    $(window).scroll(function () {
        var iname = $('.f_nav .active').attr('data-index');
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w - 50;

        $('.list_left').css('top', $(window).scrollTop());
        if ($(window).scrollTop() >= scroll && !isload) {
            page = parseInt($('.nav_box .active').attr('data-page')),
            totalPage = parseInt($('.nav_box .active').attr('data-totalPage'));
            page++;

            $('.nav_box .active').attr('data-page', page);
            if (iname == 'video') {
                getdata_video();
            } else if (iname == 'zqnum') {
                pagezq = parseInt($('.list_left li.on').attr('data-page'));
                pagezq++;
                $('.list_left li.on').attr('data-page', pagezq);
                getdata_zqnum();

            } else if (iname == 'zt') {
                console.log('专题加载')
                getdata_zt()
            } else if (iname == 'area') {
                getall(page, 'reg_area')
            } else if (iname == 'live') {
                getdata_live();
            } else if (iname == 'last') {
                var mold = $('li.nav_on').attr('data-mold');
                var typeid = $('li.nav_on').attr('data-id');
                get_last(typeid, mold);
            } else if (iname == 'all') {
//              console.log(page)
                getall(page, 'reg'); //新闻首页
//              console.log(page)
                if (page % 3 == 0) {
                    adv(); //添加广告
                }
                if (page == 2) {
                    getall_gz(1)
                }

            } else {
                var mold = $('.nav_box .active').attr('data-mold'),
                    typeid = $('.nav_box .active').attr('data-id');
//              console.log(mold + '====' + typeid);
                add_list(typeid, mold);
            }

        };
    });



    //首页广告

    function adv() {
        $.ajax({
            url: "/include/ajax.php?service=siteConfig&action=adv&id=stream&model=all&title=移动端流媒体广告",
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res && res.state == 100 && res.info.id != undefined && $('.adv-' + res.info.id).length == 0) {
                    var info = res.info;
                    var html = [];

                    //多图
                    if (info.class == 2 && info.list.length >= 3) {
                        var url = info.list[0].link;
                        html.push('<li class="libox more_img advbox adv-' + info.id + '">');
                        html.push('    <a href="' + url + '" class="fn-clear">');
                        html.push('        <h2>' + info.list[0].title + '</h2>');
                        html.push('        <ul class="pics_box">');
                        for (var i = 0; i < info.list.length; i++) {
                            html.push('            <li><img  data-url="' + info.list[i].turl +
                                '" src="' + staticPath + 'images/blank.gif" /></li>');
                        }
                        html.push('        </ul>');
                        html.push('        <p class="art_info"></p>');
                        html.push('    </a>');
                        html.push('</li>');
                    } else {

                        //单图
                        if(info.type == 'pic'){
                            var litpic, url, title;
                            if (info.class == 2) {
                                url = info.list[0].link;
                                litpic = info.list[0].turl;
                                title = info.list[0].title;
                            } else {
                                url = info.href;
                                litpic = info.turl;
                                title = info.title;
                            }
                            html.push('<li class="libox big_img advbox adv-' + info.id + '">');
                            html.push('    <a href="' + url + '" class="fn-clear">');
                            html.push('        <h2>' + title + '</h2>');
                            html.push('        <div class="img_box"><img data-url="' + litpic +
                                '" src="' + staticPath + 'images/blank.gif"/></div>');
                            html.push('        <p class="art_info"></p>');
                            html.push('    </a>');
                            html.push('</li>');

                        //代码
                        }else if(info.type == 'code'){
                            html.push(info.body);
                        }
                    }
                    $(".con_all .ulbox").last().append(html.join(""));
                    $("img").scrollLoading(); //测试懒加载

                }

            }
        })
    }

    //专题
    function getdata_zt(page) {
        isload = 1;
        var page = $('.nav_box li[data-index="zt"]').attr('data-page');
        var total = $('.nav_box li[data-index="zt"]').attr('data-total');
        // page = page ? parseInt(page) + 1 : 1;
        if (total != undefined && page > total) return;
        $('#zhuanti_box').append('<div class="loading"><img src="' + templets_skin +
            'images/loading.png"></div>');
        $.ajax({
            url: "/include/ajax.php?service=article&action=zhuantiList&orderby=time&get_news=1&thumb=1&page=" +
                page + "&pageSize=10",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                $('#zhuanti_box .loading').remove();
                if (data.state == 100) {
                    var datalist = data.info.list;
                    var totalpage = data.info.pageInfo.totalPage;
                    $('.nav_box li[data-index="zt"]').attr('data-total', totalpage)
                    for (var n = 0; n < datalist.length; n++) {
                        var detail = datalist[n];
                        var html = [],
                            html2 = [];

                        if (detail.flag_r&&detail.list.list.length>0) {
                            for (var i = 0; i < (detail.list.list.length>5?5:detail.list.list.length); i++) {
                              var img_src = page==1?(detail.list.list[i].litpic):"/static/images/blank.gif"
                                html.push('<li class="dbox swiper-slide"><a href="' + detail.list.list[
                                    i].url + '">');
                                html.push('<div class="imgbox"><img src="' + img_src +
                                    '" data-url="' + detail.list.list[i].litpic +
                                    '"></div>');
                                html.push('<div class="textbox"><h2>' + detail.list.list[i].title +
                                    '</h2><p class="art_info">' + (detail.list.list[i].source?detail.list.list[i].source:"管理员") +
                                    '</p></div>');
                                html.push('</a></li>');
                            }
                            html.push('<li class="dbox swiper-slide more_zt"><a href="' + detail.url +'"><div class="more_icon"><img src="'+templets_skin+'images/more_zq.png"/></div><h2>更多精彩文章</h2></a><li>');
                            $('#zhuanti_box').append('<div class="topicbox"><h1><a href="'+ detail.url+'">' + detail.typename +
                                '</a></h1><div class="swiper-container"><ul class="dlbox swiper-wrapper">' +
                                html.join('') + '</ul></div><a href="' + detail.url +
                                '" class="go_topiclist">进入专题 </a></div>');
                            new Swiper('.topicbox .swiper-container', {
                                pagination: '',
                                paginationClickable: true,
                                loop: false,
                                slidesPerView: 2.3,
                            });
                        } else {

                            html2.push('<li class="libox single_img tbox"><a href="' + detail.url +
                                '" class="fn-clear">');
                            html2.push('<div class="_right"><img src="' + staticPath +
                                'images/blank.gif" data-url="' + detail.litpic + '" /></div>');
                            html2.push('<div class="_left"><h2>' + detail.typename +
                                '</h2><p class="art_info"><span class=""> ' +(detail.source?detail.source:"管理员")+' · '+ returnHumanTime(
                                    detail.pubdate, 3) + '</span><i>' + returnHumanClick(detail
                                    .click) + '</i></p></div>');
                            html2.push('</a></li>');


                        }
                        $('#zhuanti_box').append('<ul class="ulbox">' + html2.join('') + '</ul>');

                    }
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            $('#zhuanti_box').append('<div class="loading"><span>已全部加载</span></div>');
                        }
                    },500)

                } else {
                    $('#zhuanti_box').append('<div class="loading"><span>暂无数据！</span></div>');
                }
                $("img").scrollLoading(); //测试懒加载
                tabsSwiper.updateAutoHeight(100);
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }



    function getdata() {
              isload = 1;
        var page = $('.nav_box li[data-index="zt"]').attr('data-page');
        $('.con_zt .loading').remove();
        $('.con_zt .news_box').append('<div class="loading"><img src="' + templets_skin +
            'images/loading.png"></div>')
        $.ajax({
            url: "/include/ajax.php?service=article&action=alist&mold=0,1&zhuanti=is&page=" + page +
                "&pageSize=5",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;
                    $('.nav_box li[data-index="zt"]').attr('data-total', totalpage);
                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {
                        html.push('<li class="libox single_img tbox"><a href="' + datalist[i].url +
                            '" class="fn-clear">');
                        html.push('<div class="_right"><img src="' + staticPath +
                            'images/blank.gif" data="' + datalist[i].litpic + '" /></div>');
                        html.push('<div class="_left"><h2 style="color:' + datalist[i].color +
                            ';">' + datalist[i].title +
                            '</h2><p class="art_info"><span class="">' + datalist[i].writer +
                            ' · ' + returnHumanTime(datalist[i].pubdate, 3) + '</span><i>' +
                            returnHumanClick(datalist[i].click) + '</i>  </p></div>');
                        html.push('</a></li>');
                    }

                    $('.con_zt .loading').remove();
                    $('.con_zt .tlist_box ul').append(html.join(''));
                    $("img").scrollLoading(); //测试懒加载
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            $('.con_zt .tlist_box').append(
                                '<div class="loading"><span>已全部加载</span></div>');
                        }
                    },500)
                    tabsSwiper.updateAutoHeight(100);


                }else{
                    isload = 1;
                     $('.con_zt .tlist_box').append(
                                '<div class="loading"><span>暂无数据</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
                isload = 0;
            }
        });
    }


    //政企号
    //关注
    $('.con_zqnum  .news_box,.con_all .news_box').delegate('.care', 'click', function () {

        var userid = $.cookie(cookiePre + "login_user");
        if (userid == null || userid == "") {
            window.location.href = masterDomain + '/login.html';
            return false;
        }
        if ($(this).hasClass('cared')) {
            $(this).html('关注'); //关注
            $(this).removeClass('cared')
        } else {
            $(this).html('已关注'); //已关注
            $(this).addClass('cared')
        }

        var mediaid = $(this).attr("data-id");

        $.post("/include/ajax.php?service=member&action=followMember&for=media&id=" + mediaid);
        return false;
    });





    //扫一扫
    $(".top_box").delegate(".scan a", "click", function () {

        //APP端
        if (device.indexOf('huoniao') > -1) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler("QRCodeScan", {}, function callback(DataInfo) {
                    if (DataInfo) {
                        if (DataInfo.indexOf('http') > -1) {
                            location.href = DataInfo;
                        } else {
                            alert(DataInfo);
                        }
                    }
                });
            });

            //微信端
        } else if (device.toLowerCase().match(/micromessenger/) && device.toLowerCase().match(
                /iphone|android/)) {

            wx.scanQRCode({
                // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                needResult: 1,
                desc: '扫一扫',
                success: function (res) {
                    if (res.resultStr) {
                        if (res.resultStr.indexOf('http') > -1) {
                            location.href = res.resultStr;
                        } else {
                            alert(res.resultStr);
                        }
                    }
                },
                fail: function (err) {
                    alert(langData['siteConfig'][20][183]);
                }
            });

            //浏览器
        } else {
            $('.downloadAppFixed').css("visibility", "visible");
            $('.downloadAppFixed .con').show();
        }

    });
    var ua = navigator.userAgent;
    var appVersion = '1.0';
    if (ua.match(/(iPhone|iPod|iPad);?/i)) {
        appVersion = $('.downloadAppFixed .app dd p').attr('data-ios');
    } else {
        appVersion = $('.downloadAppFixed .app dd p').attr('data-android');
    }
    $('.downloadAppFixed .app dd em').html(appVersion);
    $('.downloadAppFixed .close').bind('click', function () {
        $('.downloadAppFixed .con').hide();
        $('.downloadAppFixed').css("visibility", "hidden");
    });














    // 获取zqnum列表
    function getdata_zqnum() {
        isload = 1;
        $('.con_zqnum .loading').remove()
        //  var page = $('.nav_box li[data-index="zqnum"]').attr('data-page');
        var page = $('.list_left li.on').attr('data-page')?$('.list_left li.on').attr('data-page'):1;
        var type = $(".list_left li.on").data("id") || 0;
        $('.con_zqnum .list_right').append('<div class="loading"><img src="' + templets +
            'images/loading.png"></div>')
        $.ajax({
            url: "/include/ajax.php?service=article&action=selfmedia&ac_field=" + type + "&page=" +
                page + "&pageSize=10",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;
                    $('.list_left li.on').attr('data-total', totalpage)
                    //        $('.nav_box li[data-index="zqnum"]').attr('data-total',totalpage);
                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {
                        var d = datalist[i];
                        html.push('<li class="media_box"><a href="' + d.url + '">');
                        html.push('<div class="left_head"><img src="' + datalist[i].photo +
                            '"></div>')
                        // 已关注
                        if(d.isfollow == 1){
                            gz = '<span data-id="'+datalist[i].id+'" class="carebtn caredbtn">已关注</span>';
                        }else if(d.isfollow == 0){
                            gz = '<span data-id="'+datalist[i].id+'" class="carebtn">关注</span>';
                        }else{
                            gz = '<span data-id="'+datalist[i].id+'" class="carebtn disabled">关注</span>';
                        }
                        html.push(gz);
                        html.push('<div class="right_info"><h2>' + datalist[i].name +
                            '</h2><p class="intr">' + datalist[i].profile +
                            '</p><p class="count"><span>文章数:<em>' + datalist[i].total_article +
                            '</em></span><span>浏览量:<em>' + returnHumanClick(datalist[i].click) +
                            '</em></span><span>粉丝:<em>' + returnHumanClick(datalist[i].total_fans) +
                            '</em></span></p></div>');
                        html.push('</a></li>');


                    }




                    $('.list_right .loading').remove();
                    $('.list_right ul').append(html.join(''));
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            //              $('.con_zqnum .news_box').append('<div class="loading"><span>已全部加载</span></div>');
                        }
                    },500)


                    tabsSwiper.updateAutoHeight(100);


                } else {
                    console.log('暂无数据')
                    $('.con_zqnum .loading').remove();
                    $('.con_zqnum .list_right').append(
                        '<div class="loading"><span>暂无数据！</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }


    //推荐关注
    function getdata_gz(page) {
        $.ajax({
            url: "/include/ajax.php?service=article&action=selfmedia&page=" + page + "&pageSize=5",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list;
                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {

                        var d = datalist[i];
                        var gz = '';
                        // 已关注
                        if (d.isfollow == 1) {
                            gz = '<span data-id="' + datalist[i].id +
                                '" class="care cared">已关注</span>';
                        } else if (d.isfollow == 0) {
                            gz = '<span data-id="' + datalist[i].id + '" class="care">关注</span>';
                        } else {
                            gz = '<span data-id="' + datalist[i].id +
                                '" class="care disabled">关注</span>';
                        }
                        html.push('<li class="dbox swiper-slide"><a href="' + d.url + '">');
                        html.push('<div class="headimg"><img src="' + datalist[i].photo +
                            '"></div>');
                        html.push('<div class="media_info"><h2>' + d.name +
                            '</h2><p class="art_text">' + datalist[i].profile + ' </p>' + gz +
                            '</div>');
                        html.push('</a></li>');
                    }
                     html.push('<li class="dbox swiper-slide more_zqnum"><a href="javascript:;"><div class="more_icon"><img src="'+templets_skin+'images/more_zq.png"/></div><h2>更多媒体号</h2></a><li>');
                    $('.con_zqnum .news_box').append('<div class="mediabox"><h1>大家都关注 <a href="' +
                        channelDomain +
                        '/media.html" class="more">更多</a></h1><div class="swiper-container"><ul class="dlbox swiper-wrapper">' +
                        html.join('') + '</ul></div></div>');

                    new Swiper('.con_zqnum .news_box .swiper-container', {
                        pagination: '',
                        paginationClickable: true,
                        loop: false,
                        slidesPerView: 2.3,
                    });
                    tabsSwiper.updateAutoHeight(100);
                }

            },
            error: function (err) {
                console.log('fail');
            }
        });
    }

    function getdata_video() {
        isload = 1;
        var page = $('.nav_box li[data-index="video"]').attr('data-page');
        $('.con_video .news_box').append('<div class="loading"><img src="' + templets_skin +
            'images/loading.png"></div>')
        $.ajax({
            url: "/include/ajax.php?service=article&action=alist&mold=2&page=" + page + "&pageSize=5",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;
                    $('.nav_box li[data-index="video"]').attr('data-total', totalpage);
                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {
                       var imgSrc = (page==1?datalist[i].litpic:(staticPath + "images/blank.gif"));
                        html.push('<li class="libox big_img vbox video_box" data-src="' + datalist[
                                i].videourl + '" data-type = "' + datalist[i].videotype +
                            '"  data-id="' + datalist[i].id + '"><a href="' + datalist[i].url +
                            '" class="fn-clear">');
                        html.push('<h2 style="color:' + datalist[i].color + ';">' + datalist[i].title +
                            '</h2>')
                        html.push('<div class="img_box" ><img src="' + imgSrc +
                            '" data-url="' + datalist[i].litpic +
                            '" />'+(datalist[i].videotime > 0 ? '<i class="time">' + (datalist[i].videotime_) + '</i>' : '')+'</div>');
                        html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") +
                            ' · ' + returnHumanTime(datalist[i].pubdate, 3) + '</span><i>' +
                            returnHumanClick(datalist[i].click) + '</i>  </p>');
                        html.push('</a></li>');
                    }

                    $('.con_video .loading').remove();
                    $('.con_video .news_box .ulbox').append(html.join(''));

                    $("img").scrollLoading(); //测试懒加载
                    tabsSwiper.updateAutoHeight(100);
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            $('.con_video .news_box').append(
                                '<div class="loading"><span>已全部加载</span></div>');
                        }
                    },500)


                }else{
                     $('.con_video .loading').remove();
                     $('.con_video .news_box').append(
                                '<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }
    //加载直播列表
    function getdata_live() {
        isload = 1;
        var page = $('.nav_box li[data-index="live"]').attr('data-page');
        $('.con_live .news_box').append('<div class="loading"><img src="' + templets_skin +
            'images/loading.png"></div>')
        $.ajax({
            url: "/include/ajax.php?service=live&action=alive&mold=1&orderby=time&page=" + page +
                "&pageSize=5",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;
                    $('.nav_box li[data-index="live"]').attr('data-total', totalpage);
                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {
                        html.push('<li class="libox big_img vbox"><a href="' + datalist[i].url +
                            '" class="fn-clear">');
                        html.push('<h2 style="color:' + datalist[i].color + ';">' + datalist[i].title +
                            '</h2>')
                        html.push('<div class="img_box"><img src="' + staticPath +
                            'images/blank.gif" data-url="' + datalist[i].litpic + '" />');
                        if (datalist[i].state == '2') { //直播结束
                            html.push(
                                '<span class="live_state live_after"><i>回看</i></span><i class="time">' +
                                datalist[i].times + '</i>')
                        } else if (datalist[i].state == '1') { //正在直播
                            html.push('<span class="live_state living"><i>直播中</i><em>' +
                                returnHumanClick(datalist[i].click) + '人观看</em></span>')
                        } else { //未直播
                            html.push('<span class="live_state live_before"><i>预告</i><em>' +
                                datalist[i].ftime + '</em></span>');
                        }
                        html.push('</div>')
                        html.push('<p class="art_info"><span class="">' + datalist[i].nickname +
                            ' · ' + datalist[i].ftime + '</span>  </p>');
                        html.push('</a></li>');
                    }

                    $('.con_live  .loading').remove();
                    $('.con_live .news_box .ulbox').append(html.join(''));

                    $("img").scrollLoading(); //测试懒加载
                    tabsSwiper.updateAutoHeight(100);
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            $('.con_live .news_box').append(
                                '<div class="loading"><span>已全部加载</span></div>');
                        }
                    },500)

                }else{
                     isload = 1;
                            $('.con_live .news_box').append(
                                '<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }

    //数据加载
    function getall(page, type) {

        isload = 1;
        var iname = $('.f_nav .active').attr('data-index');
        if ($('.con_' + iname + ' .loading').length == 0) {
            $('.con_' + iname + ' .news_box').append('<div class="loading"><img src="' + templets_skin +
                'images/loading.png"></div>');
        } else {
            console.log('已经正在加载中')
        }

        $('.nav_box li[data-index="all"]').attr('data-page', page);
        var param = [];
        if (type == 'top') {
            param.push('flag=h');
            param.push('pageSize=2');
        } else if (type == 'reg') {
            param.push('flag=r');
            param.push('pageSize=10');
        } else {
            param.push('pageSize=10');
        }
        if ($('.s_nav').hasClass('active')) {
            var typeid = $('.s_box .s_active').data('id');
            param.push('typeid=' + typeid);
        }
        $.ajax({
            url: "/include/ajax.php?service=article&action=alist&orderby=1&page=" + page + "&" + param.join("&"),
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;
                    var html = [],
                        dataid = [];
                    for (var i = 0; i < datalist.length; i++) {
                        var d = datalist[i];
                        // 头条
                        var imgSrc = (page==1?datalist[i].litpic:(staticPath + "images/blank.gif"));
                        if (d.mold == 0 || (d.mold == 1 && d.group_img.length < 3)) {
                            if (d.litpic) {
                                // 小图
                                if (d.typeset == 0) {
                                    html.push('<li class="libox single_img libox-' + type +
                                        '" data-id="' + d.id + '"><a href="' + d.url +
                                        '" class="fn-clear">');
                                    html.push('<div class="_right"><img data-url="' + datalist[i].litpic +
                                        '" src="' + imgSrc + '" /></div>');
                                    html.push('<div class="_left"><h2 style="color:' + datalist[i].color +
                                        ';">' + datalist[i].title +
                                        '</h2><p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") + ' · ' + returnHumanTime(d.pubdate, 3) +
                                        '</span><i>' + returnHumanClick(datalist[i].click) +
                                        '</i>  </p></div>');
                                    html.push('</a></li>');
                                    // 大图
                                } else {
                                    html.push('<li class="libox big_img libox-' + type +
                                        '" data-id="' + d.id + '"><a href="' + d.url +
                                        '" class="fn-clear">');
                                    html.push('<h2 style="color:' + datalist[i].color + ';">' +
                                        datalist[i].title + '</h2>');
                                    html.push('<div class="img_box"><img data-url="' + datalist[i].litpic +
                                        '" src="' + imgSrc + '"/></div>');
                                    html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") +
                                        ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                        returnHumanClick(datalist[i].click) + '</i>  </p>');
                                    html.push('</a></li>');
                                }
                            } else {
                                html.push('<li class="libox no_img libox-' + type + '" data-id="' +
                                    d.id + '"><a href="' + d.url + '" class="fn-clear"><h2>' +
                                    d.title + '</h2><p class="art_info"><span class="">' + (d.source?d.source:"管理员") +
                                    ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' + d.click +
                                    '</i></p></a></li>');
                            }
                            // 图集
                        } else if (d.mold == 1) {

                            var pics = [];
                            for (var n = 0; n < d.group_img.length && n < 3; n++) {
                                pics.push('<li><img data-url="' + d.group_img[n].path + '" src="' +
                                    imgSrc + '"></li>');
                            }

                            html.push('<li class="libox more_img libox-' + type + '" data-id="' + d
                                .id + '"><a href="' + d.url + '" class="fn-clear">');
                            html.push('<h2 style="color:' + datalist[i].color + ';">' + datalist[i]
                                .title + '</h2>');
                            html.push('<ul class="pics_box">' + pics.join("") + '</ul>');
                            html.push('<p class="art_info"><span class="">' +(datalist[i].source?datalist[i].source:"管理员")  +
                                ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                returnHumanClick(datalist[i].click) + '</i>  </p>');
                            html.push('</a></li>');
                        } else if (d.mold == 2 || d.mold == 3) {
                            html.push('<li class="libox big_img vbox video_box libox-' + type +
                                '" data-id="' + d.id + '" data-type="' + d.videotype +
                                '"  data-src="' + d.videourl + '"  ><a href="' + d.url +
                                '" class="fn-clear">');
                            html.push('<h2 style="color:' + datalist[i].color + ';">' + datalist[i]
                                .title + '</h2>');
                            html.push('<div class="img_box"><img data-url="' + datalist[i].litpic +
                                '" src="' + imgSrc + '"/>'+(datalist[i].videotime > 0 ? '<i class="time">' + (datalist[i].videotime_) + '</i>' : '')+'</div>');
                            html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员")  +
                                ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                returnHumanClick(datalist[i].click) + '</i>  </p>');
                            html.push('</a></li>');
                        }
                        if ($('.libox[data-id="' + d.id + '"]').length > 0) {
                            dataid.push(d.id)
                        }

                    }

                    $('.con_' + iname + ' .loading').remove();
                    if (type == 'top') { //置顶数据加载

                        $('.con_all .news_box').prepend('<ul class="ulbox to_top">' + html.join('') +
                            '</ul>');
                    } else if (type == 'reg_area') {
                        $('.con_area .news_box').append('<ul class="ulbox rgbox">' + html.join('') +
                            '</ul>');
                    } else {
                        $('.con_all .news_box').append('<ul class="ulbox rgbox">' + html.join('') +
                            '</ul>');
                        for (var i = 0; i < dataid.length; i++) {
                            $('.rgbox .libox[data-id="' + dataid[i] + '"]').remove();
                        }
                    }
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            if (type == 'reg_area') {
                                $('.con_area .news_box').append(
                                    '<div class="loading"><span>已全部加载</span></ul>');
                            } else {

                                $('.con_all .news_box').append('<div class="loading"><span>已全部加载</span></div>');

                            }
                        }
                    },500)

                    $("img").scrollLoading(); //测试懒加载
                    tabsSwiper.updateAutoHeight(100);
                }else{
                    $('.con_all .news_box').append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }
    //专题
    function getall_zt(page) {

        $.ajax({
            url: "/include/ajax.php?service=article&action=zhuantiList&get_news=1&h=is&thumb=1&page=" +
                page + "&pageSize=1",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list;
                    var html = [];
                    var detail = datalist[0];
                    for (var i = 0; i < (detail.list.list.length>5?5:detail.list.list.length); i++) {
                        html.push('<li class="dbox swiper-slide"><a href="' + detail.list.list[i].url +
                            '">');
                        html.push('<div class="imgbox"><img data-url="' + detail.list.list[i].litpic +
                            '" src="' + staticPath + 'images/blank.gif"></div>');
                        html.push('<div class="textbox"><h2>' + detail.list.list[i].title +
                            '</h2><p class="art_info">' + (detail.list.list[i].source?detail.list.list[i].source:"管理员") +
                            '</p></div>');
                        html.push('</a></li>');
                    }


                     html.push('<li class="dbox swiper-slide more_zt"><a href="' + detail.url +'"><div class="more_icon"><img src="'+templets_skin+'images/more_zq.png"/></div><h2>更多精彩文章</h2></a><li>');
                    $('.con_all .news_box').append('<div class="topicbox"><h1><a href="'+detail.url+'">' + detail.typename +
                        '</a></h1><div class="swiper-container"><ul class="dlbox swiper-wrapper">' +
                        html.join('') + '</ul></div><a href="' + detail.url +
                        '" class="go_topiclist">进入专题 </a></div>  ');
                    new Swiper('.con_all .news_box .swiper-container', {
                        pagination: '',
                        paginationClickable: true,
                        loop: false,
                        slidesPerView: 2.3,
                    });
                    $("img").scrollLoading(); //测试懒加载
                    tabsSwiper.updateAutoHeight(100);
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }

    //关注
    function getall_gz(page) {
        $.ajax({
            url: "/include/ajax.php?service=article&action=selfmedia&page=" + page + "&pageSize=5",
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list;
                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {
                        var d = datalist[i];
                        var gz = '';
                        // 已关注
                        if (d.isfollow == 1) {
                            gz = '<span data-id="' + datalist[i].id +
                                '" class="care cared">已关注</span>';
                        } else if (d.isfollow == 0) {
                            gz = '<span data-id="' + datalist[i].id + '" class="care">关注</span>';
                        } else {
                            gz = '<span data-id="' + datalist[i].id +
                                '" class="care disabled">关注</span>';
                        }
                        html.push('<li class="dbox swiper-slide"><a href="' + d.url + '">');
                        html.push('<div class="headimg"><img src="' + datalist[i].photo +
                            '"></div>');
                        html.push('<div class="media_info"><h2>' + d.name +
                            '</h2><p class="art_text">' + datalist[i].profile + ' </p>' + gz +
                            '</div>');
                        html.push('</a></li>');
                    }
                    html.push('<li class="dbox swiper-slide more_zqnum"><a href="javascript:;"><div class="more_icon"><img src="'+templets_skin+'images/more_zq.png"/></div><h2>更多媒体号</h2></a><li>');
                    $('.con_all .news_box').append('<div class="mediabox"><h1>大家都关注 <a href="javascript:;" class="more">更多</a></h1><div class="swiper-container"><ul class="dlbox swiper-wrapper">' +
                        html.join('') + '</ul></div></div>  ');
                    new Swiper('.con_all .news_box .swiper-container', {
                        pagination: '',
                        paginationClickable: true,
                        loop: false,
                        slidesPerView: 2.3,
                    });
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }

//  function getNav() {
//      $.ajax({
//          type: "POST",
//          url: "/include/ajax.php",
//          dataType: "json",
//          data: 'service=siteConfig&action=siteModule&type=1',
//          success: function (data) {
//              if (data && data.state == 100) {
//                  var tcInfoList = [],
//                      list = data.info;
//                  for (var i = 0; i < list.length; i++) {
//                      if (list[i].code != 'special' && list[i].code != 'paper' && list[i].code !=
//                          'website') {
//                          tcInfoList.push('<li><a data-url="' + list[i].url + '" href="' + list[i]
//                              .url + '">' + list[i].name + '</a></li>');
//                      }
//                  }
//                  $('.nav_all .addnav').html(tcInfoList.join(''));
//              }
//          },
//          error: function () {
//              $('.nav_all .addnav').hide();
//          }
//      });
//  };


    function get_last(typeid, mold) {
        var page = $('.last_li').attr('data-page');
        var param = [];
        param.push('mold=' + mold);
        param.push('typeid=' + typeid);
        $('.con_last').append('<div class="loading"><img src="' + templets_skin +
            'images/loading.png"></div>');
        $.ajax({
            url: "/include/ajax.php?service=article&action=alist&page=" + page + "&pageSize=10&" +
                param.join("&"),
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;

                    var html = [];
                    for (var i = 0; i < datalist.length; i++) {
                        //是图集的时候
                        var d = datalist[i];
                        // 头条
                        if (d.mold == 0 || (d.mold == 1 && d.group_img.length < 3)) {
                            if (d.litpic) {
                                // 小图
                                if (d.typeset == 0) {
                                    html.push('<li class="libox single_img " data-id="' + d.id +
                                        '"><a href="' + d.url + '" class="fn-clear">');
                                    html.push('<div class="_right"><img src="' + staticPath +
                                        'images/blank.gif" data-url="' + datalist[i].litpic +
                                        '" /></div>');
                                    html.push('<div class="_left"><h2 style="color:' + datalist[i].color +
                                        ';">' + datalist[i].title +
                                        '</h2><p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") + ' · ' + returnHumanTime(d.pubdate, 3) +
                                        '</span><i>' + returnHumanClick(datalist[i].click) +
                                        '</i>  </p></div>');
                                    html.push('</a></li>');
                                    // 大图
                                } else {
                                    html.push('<li class="libox big_img " data-id="' + d.id +
                                        '"><a href="' + d.url + '" class="fn-clear">');
                                    html.push('<h2 style="color:' + datalist[i].color + ';">' +
                                        datalist[i].title + '</h2>');
                                    html.push('<div class="img_box"><img data-url="' + datalist[i].litpic +
                                        '" src="' + staticPath + 'images/blank.gif"/></div>');
                                    html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") +
                                        ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                        returnHumanClick(datalist[i].click) + '</i>  </p>');
                                    html.push('</a></li>');
                                }
                            } else {
                                html.push('<li class="libox no_img " data-id="' + d.id +
                                    '"><a href="' + d.url + '" class="fn-clear"><h2>' + d.title +
                                    '</h2><p class="art_info"><span class="">' + (d.source?d.source:"管理员") +
                                    ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' + d.click +
                                    '</i></p></a></li>');
                            }
                            // 图集
                        } else if (d.mold == 1) {

                            var pics = [];
                            for (var n = 0; n < d.group_img.length && n < 3; n++) {
                                pics.push('<li><img data-url="' + d.group_img[n].path + '" src="' +
                                    staticPath + 'images/blank.gif"></li>');
                            }

                            html.push('<li class="libox more_img " data-id="' + d.id +
                                '"><a href="' + d.url + '" class="fn-clear">');
                            html.push('<h2 style="color:' + datalist[i].color + ';">' + datalist[i]
                                .title + '</h2>');
                            html.push('<ul class="pics_box">' + pics.join("") + '</ul>');
                            html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") +
                                ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                returnHumanClick(datalist[i].click) + '</i>  </p>');
                            html.push('</a></li>');
                        }

                    }
                    $('.con_last  .loading').remove();
                    if (page == 1) {
                        $('.con_last ').append('<div class="news_box"><ul class="ulbox">' + html.join(
                            '') + '</ul></div>');
                    } else {
                        $('.con_last ').find('.ulbox').append(html.join(''));
                    }
                    if (totalpage == 0) {
                        $('.con_last').append('<div class="loading"><span>暂无数据</span></div>');
                        return 0;
                    }
                    if (page >= totalpage) {
                        isload = 1;
                        $('.con_last').append('<div class="loading"><span>已全部加载</span></div>');
                    }
                    $("img").scrollLoading(); //测试懒加载
                    tabsSwiper.updateAutoHeight(100);
                }else{
                     $('.con_last .loading').remove();
                    $('.con_last').append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });

    }

//图集跳转
$('.con_img').delegate('li','click',function(e){
    var url = $(this).find('a').attr('data-url');
    window.location.href = url;
})
    //新增的数据获取
    function add_list(typeid, mold) {
        isload =1;
        var page = $('.f_nav .active').attr('data-page');
        var iname = $('.f_nav .active').attr('data-index');
        var param = [];
        param.push('mold=' + mold);
        param.push('typeid=' + typeid);
        if(mold=='3'){
            param.push('get_zan=1' );
        }
        if ($('.con_' + iname).find('.loading').length == 0) {
            $('.con_' + iname).append('<div class="loading"><img src="' + templets_skin +
                'images/loading.png"></div>');
        }
        $.ajax({
            url: "/include/ajax.php?service=article&action=alist&page=" + page + "&pageSize=10&" +
                param.join("&"),
            type: "GET",
            dataType: "json", //指定服务器返回的数据类型
            crossDomain: true,
            success: function (data) {
                if (data.state == 100) {
                    var datalist = data.info.list,
                        totalpage = data.info.pageInfo.totalPage;
                    var html = [] , html1 = [];
                    for (var i = 0; i < datalist.length; i++) {
                        //是图集的时候
                        var d = datalist[i];
                        var imgSrc = (page==1?datalist[i].litpic:(staticPath + "images/blank.gif"));
                        // 头条
                        if(iname=='img'){
                            lr = d;
                            var time = returnHumanTime(lr.pubdate,3);
                            var piccount = lr.group_img == undefined ? 0 : lr.group_imgnum;
                            var litpic = lr.litpic ? huoniao.changeFileSize(lr.litpic, "middle") : (piccount ? lr.group_img[0].path : '/static/images/blank.gif');

                            html.push('<li class="infoBox">');
                            html.push('<a href="javascript:;" data-url="' + lr.url + '" class="fn-clear">');
                            html.push('<div class="imgbox"><img src="'+litpic+'" /><span class="Icount">'+piccount+'图</span></div>');
                            html.push('<div class="infotitle"><h2>' + lr.title.substr(0, 18) + '</h2><span class="num-comment">' + lr.common + '</span></div>');
                            html.push('</a></li>');
                        }else if(iname=='svideo'){
                             lr = d;
                            var time = returnHumanTime(lr.pubdate,3);
                            var piccount = lr.group_img == undefined ? 0 : lr.group_imgnum;

                            if(i%2==0){
                                html.push('<li class="liBox">');
                                html.push('<a href="' + lr.url + '" data-url="' + lr.url + '">');
                                html.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(lr.litpic, "large")+'" /></div>');
                                html.push('<div class="videoInfo">');
                                html.push('<h2>' + lr.title + '</h2>');
                                html.push('<div class="up_more">');
                                var uid = lr.admin;
                                if(lr.writerpic != null){
                                    html.push('<div class="_left"><div class="headimgbox"><img src="'+(lr.writerpic ? lr.writerpic : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></div><h2>'+(lr.writer?lr.writer:"佚名")+'</h2></div>');
                                }else{
                                    html.push('<div class="_left"><div class="headimgbox"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></div><h2>'+(lr.writer?lr.writer:"佚名")+'</h2></div>');
                                }
                                if(lr.zan==1){
                                    html.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan onclick">' + lr.zannum + '</span></div>');
                                }else{
                                    html.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan">' + lr.zannum + '</span></div>');
                                }
                                html.push('</div>');
                                html.push('</div>');
                                html.push('</a>');
                                html.push('</li>');
                            }else{
                                html1.push('<li class="liBox">');
                                html1.push('<a href="' + lr.url + '" data-url="' + lr.url + '">');
                                html1.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(lr.litpic, "large")+'" /></div>');
                                html1.push('<div class="videoInfo">');
                                html1.push('<h2>' + lr.title + '</h2>');
                                html1.push('<div class="up_more">');
                                var uid = lr.admin;
                                if(lr.writerpic != null){
                                    html1.push('<div class="_left"><div class="headimgbox"><img src="'+(lr.writerpic ? lr.writerpic : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></div><h2>'+lr.writer+'</h2></div>');
                                }else{
                                    html1.push('<div class="_left"><div class="headimgbox"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></div><h2>'+lr.writer+'</h2></div>');
                                }
                                if(lr.zan==1){
                                    html1.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan onclick">' + lr.zannum + '</span></div>');
                                }else{
                                    html1.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan">' + lr.zannum + '</span></div>');
                                }
                                html1.push('</div>');
                                html1.push('</div>');
                                html1.push('</a>');
                                html1.push('</li>');

                            }
                        }else{
                            if (d.mold == 0 || (d.mold == 1 && d.group_img.length < 3)) {
                                if (d.litpic) {
                                    // 小图
                                    if (d.typeset == 0) {
                                        html.push('<li class="libox single_img " data-id="' + d.id +
                                            '"><a href="' + d.url + '" class="fn-clear">');
                                        html.push('<div class="_right"><img data-url="' + datalist[i].litpic +
                                            '" src="' + imgSrc + '" /></div>');
                                        html.push('<div class="_left"><h2 style="color:' + datalist[i].color +
                                            ';">' + datalist[i].title +
                                            '</h2><p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") + ' · ' + returnHumanTime(d.pubdate, 3) +
                                            '</span><i>' + returnHumanClick(datalist[i].click) +
                                            '</i>  </p></div>');
                                        html.push('</a></li>');
                                        // 大图
                                    } else {
                                        html.push('<li class="libox big_img " data-id="' + d.id +
                                            '"><a href="' + d.url + '" class="fn-clear">');
                                        html.push('<h2 style="color:' + datalist[i].color + ';">' +
                                            datalist[i].title + '</h2>');
                                        html.push('<div class="img_box"><img data-url="' + datalist[i].litpic +
                                            '" src="' + imgSrc + '" /></div>');
                                        html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") +
                                            ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                            returnHumanClick(datalist[i].click) + '</i>  </p>');
                                        html.push('</a></li>');
                                    }
                                } else {
                                    html.push('<li class="libox no_img " data-id="' + d.id +
                                        '"><a href="' + d.url + '" class="fn-clear"><h2>' + d.title +
                                        '</h2><p class="art_info"><span class="">' + (d.source?d.source:"管理员") +
                                        ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' + d.click +
                                        '</i></p></a></li>');
                                }
                                // 图集
                            } else if (d.mold == 1) {
                                var pics = [];
                                for (var n = 0; n < d.group_img.length && n < 3; n++) {
                                    pics.push('<li><img src="' + imgSrc +
                                        '" data-url="' + d.group_img[n].path +
                                        '"></li>');
                                }

                                html.push('<li class="libox more_img " data-id="' + d.id +
                                    '"><a href="' + d.url + '" class="fn-clear">');
                                html.push('<h2 style="color:' + datalist[i].color + ';">' + datalist[i]
                                    .title + '</h2>');
                                html.push('<ul class="pics_box">' + pics.join("") + '</ul>');
                                html.push('<p class="art_info"><span class="">' + (datalist[i].source?datalist[i].source:"管理员") +
                                    ' · ' + returnHumanTime(d.pubdate, 3) + '</span><i>' +
                                    returnHumanClick(datalist[i].click) + '</i>  </p>');
                                html.push('</a></li>');
                            }
                        }
                    }
                   $('.con_' + iname).find('.loading').remove();

                    if (page == 1) {
                        if(iname=='svideo'){
                            $(".con_svideo ul.box1").html(html.join(""));
                            $(".con_svideo ul.box2").html(html1.join(""));
                        }else{
                            $('.con_' + iname).append('<div class="news_box"><ul class="ulbox">' + html
                            .join('') + '</ul></div>');
                        }

                    } else {
                        if(iname=='svideo'){
                            $(".con_svideo ul.box1").append(html.join(""));
                            $(".con_svideo ul.box2").append(html1.join(""));
                        }else{
                            $('.con_' + iname).find('.ulbox').append(html.join(''));
                        }

                    }
                    if (totalpage == 0) {
                        $('.con_' + iname).append('<div class="loading"><span>暂无数据</span></div>');
                        return 0;
                    }
                    setTimeout(function(){
                        isload = 0;
                        if (page >= totalpage) {
                            isload = 1;
                            $('.con_' + iname).append('<div class="loading"><span>已全部加载</span></div>');
                        }
                    },500)

                    $("img").scrollLoading(); //测试懒加载
                    tabsSwiper.updateAutoHeight(100);
                }else{
                    $('.con_' + iname).find('.loading').remove();
                    $('.con_'+iname).append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function (err) {
                console.log('fail');
            }
        });
    }


    var timeoutflag = null;
    (function (window) {

        var _element = document.getElementById('tabs-container'),

            _refreshText = document.querySelector('.refreshText'),
            _startPosY = 0,
            _startPosX = 0,
            _transitionHeight = 0;
        _element.addEventListener('touchstart', function (e) {
            _startPosY = e.touches[0].pageY;
            _startPosX = e.touches[0].pageX;
            //          _element.style.position = 'relative';
            _element.style.transition = 'transform 0s';

        }, false);

        _element.addEventListener('touchmove', function (e) {

            _transitionHeight = e.touches[0].pageY - _startPosY;
            _transitionWidth = e.touches[0].pageX - _startPosX;
            if($('.con_zqnum').hasClass('swiper-slide-active')&&_startPosX<=$('.list_left').width()){
                clearTimeout(timeoutflag);
                return false;
             }
            if (_transitionHeight > 40 && _transitionHeight < 70 && .5 * _transitionWidth <
                _transitionHeight) {
                _refreshText.innerText = '下拉刷新';
                _element.style.transform = 'translateY(50px)';
                if (_transitionHeight > 68) {
                    _refreshText.innerText = '释放更新';
                }
            }
        }, false);
        _element.addEventListener('touchend', function (e) {
            _element.style.transition = 'transform 0.2s ease .5s';
            _element.style.transform = 'translateY(0px)';
            _refreshText.innerText = '';
            if($('.con_zqnum').hasClass('swiper-slide-active')&&_startPosX<=$('.list_left').width()){
                clearTimeout(timeoutflag);
                return false;
             }
            if (e.changedTouches[0].clientY - _startPosY > 68) {
                if (timeoutflag != null) {
                    clearTimeout(timeoutflag);
                }

//              _refreshText.innerText = '更新中...';

                timeoutflag = setTimeout(function () {

                    _refreshText.innerText = '';
                    pullrefresh();
                }, 500);

            }
        }, false);
    })(window);



    function pullrefresh() {
        isload = 0;
        var iname = $('.nav_box .active').attr('data-index');
        $('.con_' + iname).find('.loading').remove();
        $('.f_nav .active').attr('data-page', '1').removeAttr('data-total');
        if (iname == 'video') {
            $('.con_video .news_box .ulbox').html('');
            getdata_video();
        } else if (iname == 'zqnum') {
            $('.con_zqnum .list_right ul').html('');
            $('.list_left li.on').attr('data-page', 1);
            getdata_zqnum()
        } else if (iname == 'zt') {
            $('#zhuanti_box').html('');
            getdata_zt();
        } else if (iname == 'all') {
            $('.con_all .news_box').html('');
            getall(1, 'top'); //置顶数据加载
            adv();
            getall_zt(1); //专题
            getall(1, 'reg'); //测试
        } else if (iname == 'area') {
            $('.con_area .news_box').html('');

            getall(1, 'reg_area');
        } else if (iname == 'live') {
            $('.con_live .news_box .ulbox').html('');

            getdata_live();
        } else if (iname == 'last') {
            var mold = $('.nav_all .nav_on').attr('data-mold'),
                typeid = $('.nav_all .nav_on').attr('data-id');
            $('.con_last ').html('')
            get_last(typeid, mold);
        }else {
            var mold = $('.nav_box .active').attr('data-mold'),
                typeid = $('.nav_box .active').attr('data-id');
                if(iname=='svideo'){
                    $('.con_svideo ul').html('');
                }else{
                     $('.con_' + iname).html('');
                }

            add_list(typeid, mold);

        }

    }



    $('.list_left').scroll(function(){
         clearTimeout(timeoutflag);
    })

    //搜索
    $('.input_box').click(function(){
        $(this).find('input').focus();
        clearTimeout(timeoutflag);
    });

    $('.search_box .btn_right button').click(function(){
        var keywords = $('.input_box input').val();
        $('.search').submit();

    });

//点赞
    $('.con_svideo').on('click','._right',function(e){
        e.preventDefault();
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }
        var num = $(this).find('.numZan').text();
        if($(this).find('.numZan').hasClass('onclick')){
            num = parseInt(num*1 - 1);
            $(this).find('.numZan').html(num);
            $(this).find('.numZan').removeClass('onclick');
        }else{
            num = parseInt(num*1 + 1);
            $(this).find('.numZan').html(num);
            $(this).find('.numZan').addClass('onclick');
        }

        var uid = $(this).attr('data-uid'), id = $(this).attr('data-id');

        $.post("/include/ajax.php?service=member&action=getZan&module=article&temp=detail&id="+id + "&uid=" + uid);
        return true;
    });



})

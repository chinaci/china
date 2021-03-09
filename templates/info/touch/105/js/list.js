$(function() {

    //APP端取消下拉刷新
    toggleDragRefresh('off');
    
    var dom = $('#screen');
    var mask = $('.mask');

    var detailList;
    detailList = new h5DetailList();
    detailList.settings.appendTo = ".recomShop";
    console.log(detailList)
    setTimeout(function(){detailList.removeLocalStorage();}, 800);

    var	isload = false, isClick = true,
        xiding = $(".choose"),
        chtop = parseInt(xiding.offset().top),
        device = navigator.userAgent;

    var dataInfo = {
        id: '',
        url: '',
        parid: '',
        typeid: '',
        typename: '',
        cityName: '',
        parAddrid: '',
        addrid: '',
        orderby: '',
        orderbyName: '',
        isBack: true
    };

    $('.recomShop').delegate('li', 'click', function(){
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), id = t.attr('data-id');

        var orderby = $('.choose-tab .orderby').attr('data-id'),
            orderbyName = $('.choose-tab .orderby span').text(),
            parid = $('#choose-info li.active').attr('data-id'),
            typeid = $('.choose-tab .typeid').attr('data-id'),
            typename = $('.choose-tab .typeid span').text(),
            parAddrid = $('#choose-area .active').attr('data-id'),
            addrid = $('.choose-tab .addrid').attr('data-id'),
            cityName = $('.choose-tab .addrid span').text();

        dataInfo.url = url;
        dataInfo.parid = parid;
        dataInfo.typeid = typeid;
        dataInfo.typename = typename;
        dataInfo.cityName = cityName;
        dataInfo.parAddrid = parAddrid;
        dataInfo.addrid = addrid;
        dataInfo.orderby = orderby;
        dataInfo.orderbyName = orderbyName;

        detailList.insertHtmlStr(dataInfo, $("#maincontent").html(), {lastIndex: page});

        // setTimeout(function(){location.href = url;}, 500);

    })


    // 筛选框
    var chooseArea = chooseInfo = chooseSort = null;
    $('.choose-tab li').click(function(){
        dom.hide();
        $('.confirm').hide();

        var $t = $(this), index = $t.index(), box = $('.choose-box .choose-local').eq(index);
        if (box.css("display")=="none") {
            $t.addClass('active').siblings().removeClass('active');
            box.show().siblings().hide();
            if (index == 0 && chooseArea == null) {
                chooseArea = new iScroll("choose-area", {vScrollbar: false,mouseWheel: true,click: true});
            }
            if (index == 1 && chooseInfo == null) {
                chooseInfo = new iScroll("choose-info", {vScrollbar: false,mouseWheel: true,click: true});
            }
            if (index == 2 && chooseSort == null) {
                chooseSort = new iScroll("choose-sort", {vScrollbar: false,mouseWheel: true,click: true});
            }
            mask.show();
        }else{
            $t.removeClass('active');
            box.hide();mask.hide();
        }
    });


    // 区域二级
    var chooseAreaSecond = null;
    $('#choose-area li').click(function(){
        var t = $(this), index = t.index(), id = t.attr("data-id"), localIndex = t.closest('.choose-local').index();
        if (index == 0) {
            $('#area-box .choose-stage-l').removeClass('choose-stage-l-short');
            t.addClass('current').siblings().removeClass('active');
            t.closest('.choose-local').hide();
            $('.choose-tab li').eq(localIndex).removeClass('active').attr("data-id", 0).find('span').text("不限");
            mask.hide();

            page = 1;
            getList();
        }else{
            t.siblings().removeClass('current');
            t.addClass('active').siblings().removeClass('active');
            $('#area-box .choose-stage-l').addClass('choose-stage-l-short');
            $('.choose-stage-r').show();
            chooseAreaSecond = new iScroll("choose-area-second", {vScrollbar: false,mouseWheel: true,click: true});

            $.ajax({
                url: masterDomain + "/include/ajax.php?service=info&action=addr&type="+id,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){
                        var html = [], list = data.info;
                        html.push('<li data-id="'+id+'">不限</li>');
                        for (var i = 0; i < list.length; i++) {
                            html.push('<li data-id="'+list[i].id+'">'+list[i].typename+'</li>');
                        }
                        $("#choose-area-second").html('<ul>'+html.join("")+'</ul>');
                        chooseSecond = new iScroll("choose-area-second", {vScrollbar: false,mouseWheel: true,click: true});
                    }else if(data.state == 102){
                        $("#choose-area-second").html('<ul><li data-id="'+id+'">不限</li></ul>');
                    }else{
                        $("#choose-area-second").html('<ul><li class="load">'+data.info+'</li></ul>');
                    }
                },
                error: function(){
                    $("#choose-area-second").html('<ul><li class="load">网络错误，加载失败！</li></ul>');
                }
            });
        }
    })

    // 分类二级
    var chooseSecond = null;
    $('#choose-info li').click(function(){
        var t = $(this),
            index = t.index(),
            id = t.attr("data-id"),
            localIndex = t.closest('.choose-local').index();
        if (index == 0) {
            $('#info-box .choose-stage-l').removeClass('choose-stage-l-short');
            t.addClass('current').siblings().removeClass('active');
            t.closest('.choose-local').hide();
            $('.choose-tab li').eq(localIndex).removeClass('active').attr("data-id", '').find('span').text("全部分类");
            mask.hide();
            $(".pack").css("margin-top","1.6rem");
            $(".screen").hide();
            $(".screen_list li").removeClass('on');

            page = 1;
            getList();
        }else{
            t.siblings().removeClass('current');
            t.addClass('active').siblings().removeClass('active');
            $('#info-box .choose-stage-l').addClass('choose-stage-l-short');
            $('.choose-stage-r').show();
            chooseSecond = new iScroll("choose-info-second", {vScrollbar: false,mouseWheel: true,click: true});

            $.ajax({
                url: masterDomain + "/include/ajax.php?service=info&action=type&type="+id,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){
                        var html = [], list = data.info;
                        html.push('<li data-id="'+id+'">不限</li>');
                        for (var i = 0; i < list.length; i++) {
                            html.push('<li data-id="'+list[i].id+'">'+list[i].typename+'</li>');
                        }
                        $("#choose-info-second").html('<ul>'+html.join("")+'</ul>');
                        chooseSecond = new iScroll("choose-info-second", {vScrollbar: false,mouseWheel: true,click: true});
                    }else if(data.state == 102){
                        $("#choose-info-second").html('<ul><li data-id="'+id+'">不限</li></ul>');
                    }else{
                        $("#choose-info-second").html('<ul><li class="load">'+data.info+'</li></ul>');
                    }
                },
                error: function(){
                    $("#choose-info-second").html('<ul><li class="load">网络错误，加载失败！</li></ul>');
                }
            });
        }
    })

    // 一级筛选  地址和排序
    var screenScroll = null;
    $('#choose-sort, #choose-area-second').delegate("li", "click", function(){
        var $t = $(this), id = $t.attr("data-id"), val = $t.html(), local = $t.closest('.choose-local'), index = local.index();

        $t.addClass('on').siblings().removeClass('on');
        $('.choose-tab li').eq(index).removeClass('active').attr("data-id", id).find('span').text(val);
        local.hide();
        mask.hide();

        page = 1;
        getList();

    })

    $('#choose-info-second').delegate("li", "click", function(){
        var $t = $(this), id = $t.attr("data-id"), val = $t.html(), local = $t.closest('.choose-local'), index = local.index();

        $t.addClass('on').siblings().removeClass('on');
        $('.choose-tab li').eq(index).removeClass('active').attr("data-id", id).find('span').text(val);
        local.hide();
        mask.hide();
        $(".pack").css("margin-top","1.6rem");

        page = 1;
        getList();

        //加载分类自定义筛选条件
        if(index == 1 && $t.index() > 0){
            $.ajax({
                url: masterDomain + "/include/ajax.php?service=info&action=typeDetail&id="+id,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    console.log(data)
                    if(data && data.state == 100){
                        var item = data.info[0].item,box =[],html = [],list = [], xuan = [], f = 0;

                        if (item != undefined && item.length > 0) {
                            $(".screen").show();
                            $(".pack").css("margin-top", "2.5rem");
                            html.push('<div class="screen_tab">');
                            html.push('<div class="screen_tab_top">');
                            for (var i = 0; i < item.length; i++) {
                                if (item[i].formtype != "text") {


                                    html.push('<div class="screen_box sb' + item[i].id + '" data-type="' + item[i].formtype + '"  data-id="' + item[i].id + '">' + item[i].title + '</div>');

                                    xuan.push('<div class="screen_list fn-clear fn-hide ' + item[i].id + '" data-id="' + item[i].id + '"  data-type=""><ul>');
                                    xuan.push('<li data-id="0" data-name="' + item[i].title + '">不限</li>');
                                    for (var b = 0; b < item[i].options.length; b++) {
                                        xuan.push('<li data-id="' + item[i].options[b] + '" data-name="' + item[i].options[b] + '">' + item[i].options[b] + '</li>');
                                    }
                                    xuan.push('</ul></div>');
                                }

                                // f++;
                                // if (f == 4) {
                                //     html.push('</div>');
                                //     html.push('<div class="screen_tab">');

                                //     f = 0;
                                // }

                            }
                            html.push('</div>');
                            html.push('<div class="screen_tab_sub">');
                            html.push( xuan.join(""));
                            html.push('</div>');
                        } else {
                            $(".screen").hide();
                            $(".pack").css("margin-top", "1.6rem");
                        }

                        $(".screen").html(html.join(""));
                    }else{
                        $(".screen").html('');
                    }
                },
                error: function(){
                    $(".screen").html('');
                }
            });
        }else{
            $(".screen").hide();
            $(".pack").css("margin-top","1.6rem");
        }
    })

    $('.screen').delegate(".screen_box", "click", function(){
        var t = $(this),id = "";
        id = t.attr("data-id");
        $('.screen_list').hide();
        $('.'+id+'').show();
        $(".screen_list li").removeClass('on');
        $('.screen_box').removeClass('on');
        t.addClass('on');

    })
    $('.screen').delegate(".screen_list li", "click", function(){
        var x = $(this),name = x.attr("data-name"),id = x.closest('.screen_list').attr("data-id");
        $('.sb'+id+'').text(name).removeClass("on");
        x.addClass('on').siblings().removeClass('on');
        $('.screen_list').hide();
        page = 1;
        getList();
    })


    // 遮罩层
    $('.mask').on('click',function(){
        mask.hide();dom.hide();$('.confirm').hide();
        $('.choose-local').hide();
        $('.choose-tab li').removeClass('active');
        $('.screen').hide();
    })

    // 筛选
    $('.header-user').click(function(){
        if (dom.css('display') == 'none') {
            dom.show();mask.show();$('.confirm').show();
            if(screenScroll == null){
                screenScroll = new iScroll("screen", {vScrollbar: false,mouseWheel: true,click: true});
            }else{
                screenScroll.refresh();
            }
            $('.choose-local').hide();
            $('.choose-tab li').removeClass('active');
        }
        else{
            dom.hide();
            mask.hide();
            $('.confirm').hide();
        }
    })

    $('.scroll-screen').delegate("li", "click", function(){
        $(this).addClass('active').siblings().removeClass('active');
    })

    $('.confirm').click(function(){
        dom.hide();
        mask.hide();
        $('.confirm').hide();

        page = 1;
        getList();
    })

    // 下拉加载
    var isload = isend = false;
    $(window).scroll(function() {
        var h = $('.recomShop li').height();
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - h - w;
        if ($(window).scrollTop() > scroll && !isload && !isend) {
            page++;
            getList();
        };
    });

    //初始加载
    if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){

        getList(1);
    }else {
        getData();
        setTimeout(function(){
            detailList.removeLocalStorage();
        }, 500)
    }

    $(".txtSearchs").click(function () {
        getList();
    })

    //获取信息列表
    function getList(tr){

        if(isload) return false;
        var data = [];
        data.push("page="+page);
        data.push("pageSize="+pageSize);
        data.push("title="+$(".txtSearch").val());
        $(".choose-tab li").each(function(){
            data.push($(this).attr("data-type") + "=" + $(this).attr("data-id"));
        });

        // var valid = $("#valid .active").attr("data-id");
        // data.push("valid="+valid);

        //获取字段
        var item = [];
        $(".screen_list li.on").each(function(index){
            var t = $(this), id = t.closest('.screen_list').attr("data-id"), value = t.attr("data-id");
            if(value != 0){
                item[index] = {
                    "id": id,
                    "value": value
                };
            }
        })
        data.push("item="+JSON.stringify(item));

        isload = true;
        if(page == 1){
            $(".recomShop ul").html('<div class="empty">数据加载中...</div>');
            // $(".WindowPack2").html('<div class="empty">加载中...</div>');
        }else{
            $(".recomShop ul").append('<div class="empty">数据加载中...</div>');
            // $(".WindowPack2").append('<div class="empty">加载中...</div>');
        }
        $.ajax({
            url: masterDomain + "/include/ajax.php?service=info&action=ilist_v2&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
                    $(".empty").remove();
                    var html = [],html_box = [], list = data.info.list, pageinfo = data.info.pageInfo;

                    for (var i = 0; i < list.length; i++) {
                        var is_shangjia;
                        if(list[i].is_shop == 1){
                            is_shangjia = '商家';
                        }else{
                            is_shangjia = '个人';
                        }
                        var price_ = '';
                        if(list[i].price_switch == 0){
	                        if(list[i].price != 0){
	                            price_ = '<span class="mprice"><em>'+echoCurrency('symbol')+'</em>' + list[i].price + '</span>';
	                        }else{
								price_ = '<span class="mprice">价格面议</span>';
	                        }
	                    }

                        // 列表
                        if(list[i].rec_fire_top == 'top'){

                            var top_htm = 'url('+templatePath+'images/top.png)';
                        }else{
                            top_htm = '';
                        }
                        html.push('<li class="fn-clear" style="background:  #fff  '+top_htm+'  no-repeat right top;background-size: .94rem;">');

                        var pic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
                        //手机区号
                        var areaCode = list[i].areaCode;
                        var code = '',code2='';
                        if(areaCode != '' && areaCode != '86'){
                            code = '+'+areaCode+' ';
                            code2 = areaCode;
                        }
                        html.push('<div class="rleft">');
                        html.push('<a href="'+list[i].url+'">');
                        if (list[i].video) {
                            var video = '';
                            video = '<div class="mVideo"></div>';
                            html.push('<div class="rpic"><img src="'+pic+'" alt="">'+video+'</div>');
                        }else{
                            var photo = '';
                            if(list[i].litpic){
                                photo = '<div class="pnum">'+list[i].pcount+'图</div>'
                            }
                            html.push('<div class="rpic"><img src="'+pic+'" alt="">'+photo+'</div>');
                        }
                        html.push('<div class="rinfo">');
                        html.push('<div class="rtitle">'+list[i].title+'</div>');
                        html.push('<p class="p-comment">'+list[i].common+'评论</p>');
                        html.push('<p class="mark"><span class="mcolor1">'+is_shangjia+'</span>'+price_+'</p>');
                        html.push('<p class="addr">'+list[i].address[1]+' <span>'+list[i].pubdate1+'发布</span></p>');
                        html.push('</div>');
                        html.push('</a>');
                        html.push('</div>');
                        html.push('<div class="rright tel" data-tel="'+code2+list[i].tel+'" data-code="'+code+list[i].tel+'">');
                        html.push('<img src="'+templatePath+'images/hPhone.png" alt="">');
                        html.push('</div>');
                        html.push('</li>');

                        // html.push('<div class="InfoBox fn-clear"><a href="'+list[i].url+'">');
                        // var pic = huoniao.changeFileSize(list[i].litpic, "small");
                        // if (list[i].litpic) {
                        //     var video = '';
                        //     if(list[i].video){
                        //       video = '<s></s>';
                        //     }
                        //     html.push('<div class="Info_pic"><img src="'+pic+'" alt="">'+video+'</div>');
                        // }
                        // html.push('<div class="Info_title">'+list[i].title+'</div>');
                        // if (list[i].price == 0) {
                        //     html.push('<div class="Info_price">面议</div>');
                        // }else{
                        //     html.push('<div class="Info_price"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</div>');
                        // }
                        // html.push('<div class="Info_foot fn-clear">');
                        // html.push('<div class="Info_member">');
                        // var photo = list[i].member.photo == null ? templatePath+'images/noavatar_middle.gif' : list[i].member.photo;
                        // html.push('<div class="Info_mpic"><img src="'+photo+'" alt=""></div>');
                        // var nickname = list[i].member.nickname == null ? '匿名' : list[i].member.nickname;
                        // html.push('<div class="Info_mname">'+nickname+'</div>');
                        // html.push('</div>');
                        // html.push('<div class="Info_location">'+list[i].address+'</div>');
                        // html.push('</div>');
                        // html.push('</a></div>');


                        // 大图
                        //    html_box.push('<div class="InfoBox"><a href="'+list[i].url+'">');
                        //    if (list[i].litpic) {
                        //        var pic = huoniao.changeFileSize(list[i].litpic, "small");
                        //        html_box.push('<div class="Info_pic"><img src="'+pic+'" alt=""></div>');
                        //    }else{
                        //        html_box.push('<div class="Info_pic"><img src="" alt=""></div>');
                        //    }
                        //    html_box.push('<div class="Info_title">'+list[i].title+'</div>');
                        //    if (list[i].price == 0) {
                        //        html_box.push('<div class="Info_price">面议</div>');
                        //    }else{
                        //        html_box.push('<div class="Info_price"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</div>');
                        //    }
                        //    html_box.push('<div class="Info_foot fn-clear">');
                        //    html_box.push('<div class="Info_location">'+list[i].address+'</div>');
                        // var pubdate = huoniao.transTimes(list[i].pubdate, 3);
                        //    html_box.push('<div class="Info_time">'+pubdate.replace("-", "月")+'日</div>');
                        //    html_box.push('</div>');
                        //    html_box.push('</a></div>');
                    }

                    if(page == 1){
                        $(".recomShop ul").html("");
                        setTimeout(function(){$(".recomShop ul").html(html.join(""))}, 200);
                    }else{
                        $(".recomShop ul").append(html.join(""));
                    }
                    isend = false;

                    if(page >= pageinfo.totalPage){
                        isend = true;
                        if(page != 1){
                            $(".recomShop ul").append('<div class="empty">到底了...</div>');
                        }
                    }

                }else{
                    if(page == 1){
                        $(".recomShop ul").html("");
                    }
                    $(".recomShop ul").html('<div class="empty">'+data.info+'</div>');
                }
            },
            error: function(){
                isload = false;
                if(page == 1){
                    $(".recomShop ul").html("");
                }
                $(".recomShop ul .empty").html('网络错误，加载失败...').show();
            }
        });

    }


    // 本地存储的筛选条件
    function getData() {

        var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];

        page = detailList.getLocalStorage()['extraData'].lastIndex;

        if (filter.typename != '') {$('.choose-tab .typeid span').text(filter.typename);}
        if (filter.parid != '') {
            $('#choose-info li[data-id="'+filter.parid+'"]').addClass('active').siblings('li').removeClass('active');
        }
        if (filter.typeid != '') {
            $('.choose-tab .typeid').attr('data-id', filter.typeid);
        }
        if (filter.cityName != '') {$('.choose-tab .addrid span').text(filter.cityName);}
        if (filter.parAddrid != '') {
            $('#choose-area li[data-id="'+filter.parAddrid+'"]').addClass('active').siblings('li').removeClass('active');
        }
        if (filter.addrid != '') {
            $('.choose-tab .addrid').attr('data-id', filter.addrid);
        }

        // 排序选中状态
        if (filter.orderby != "") {
            $('.choose-tab .orderby').attr('data-id', filter.orderby);
            $('#choose-sort li[data-id="'+filter.orderby+'"]').addClass('on').siblings('li').removeClass('on');
        }

    }


})

$(function() {

    //APP端取消下拉刷新
    toggleDragRefresh('off');

    var dom = $('#screen');
    var mask = $('.mask');

    var huoniao_ = {
        //转换PHP时间戳
        transTimes: function(timestamp, n){
            update = new Date(timestamp*1000);//时间戳要乘1000
            year   = update.getFullYear();
            month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
            day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
            hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
            minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
            second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
            if(n == 1){
                return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
            }else if(n == 2){
                return (year+'-'+month+'-'+day);
            }else if(n == 3){
                return (month+'-'+day);
            }else if(n == 4){
                return (month+'/'+day);
            }else if(n == 5){
                return (month+'-'+day+' '+hour+':'+minute);
            }else{
                return 0;
            }
        },
        //转化天数
        getDays : function(timestamp){
            update   = parseInt(timestamp);//时间戳
            days     = Math.abs(parseInt((nowtime - update)/86400));
            return days;
        }
    }

    var detailList;
    detailList = new h5DetailList();
    detailList.settings.appendTo = ".recomShop";
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
        nature: '',
        isBack: true
    };

    $('.recomShop').delegate('li', 'click', function(e){
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), id = t.attr('data-id');

        var orderby = $('.choose-tab .orderby').attr('data-id'),
            orderbyName = $('.choose-tab .orderby span').text(),
            parid = $('#choose-info li.active').attr('data-id'),
            typeid = $('.choose-tab .typeid').attr('data-id'),
            typename = $('.choose-tab .typeid span').text(),
            parAddrid = $('#choose-area .active').attr('data-id'),
            addrid = $('.choose-tab .addrid').attr('data-id'),
            nature = $('.type-box .active').attr('data-id'),
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
        dataInfo.nature = nature;

        detailList.insertHtmlStr(dataInfo, $("#maincontent").html(), {lastIndex: page});

        if($(e.target).closest(".commonimg").length == 0 && $(e.target).closest(".numZan").length == 0){
            setTimeout(function(){location.href = url;}, 500);
        }

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
                // chooseSort = new iScroll("choose-sort", {vScrollbar: false,mouseWheel: true,click: true});
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
            $('.choose-tab li').eq(localIndex).removeClass('active').attr("data-id", 0).find('span').text(langData['info'][2][47]);
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
                        html.push('<li data-id="'+id+'">'+langData['info'][2][47]+'</li>');
                        for (var i = 0; i < list.length; i++) {
                            html.push('<li data-id="'+list[i].id+'">'+list[i].typename+'</li>');
                        }
                        $("#choose-area-second").html('<ul>'+html.join("")+'</ul>');
                        chooseSecond = new iScroll("choose-area-second", {vScrollbar: false,mouseWheel: true,click: true});
                    }else if(data.state == 102){
                        $("#choose-area-second").html('<ul><li data-id="'+id+'">'+langData['info'][2][47]+'</li></ul>');
                    }else{
                        $("#choose-area-second").html('<ul><li class="load">'+data.info+'</li></ul>');
                    }
                },
                error: function(){
                    $("#choose-area-second").html('<ul><li class="load">'+langData['info'][2][48]+'</li></ul>');
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
            $('.choose-tab li').eq(localIndex).removeClass('active').attr("data-id", '').find('span').text(langData['info'][2][49]);
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
                        html.push('<li data-id="'+id+'">'+langData['info'][2][47]+'</li>');
                        for (var i = 0; i < list.length; i++) {
                            html.push('<li data-id="'+list[i].id+'">'+list[i].typename+'</li>');
                        }
                        $("#choose-info-second").html('<ul>'+html.join("")+'</ul>');
                        chooseSecond = new iScroll("choose-info-second", {vScrollbar: false,mouseWheel: true,click: true});
                    }else if(data.state == 102){
                        $("#choose-info-second").html('<ul><li data-id="'+id+'">'+langData['info'][2][47]+'</li></ul>');
                    }else{
                        $("#choose-info-second").html('<ul><li class="load">'+data.info+'</li></ul>');
                    }
                },
                error: function(){
                    $("#choose-info-second").html('<ul><li class="load">'+langData['info'][2][47]+'</li></ul>');
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
                                    xuan.push('<li data-id="0" data-name="' + item[i].title + '">'+langData['info'][2][47]+'</li>');
                                    for (var b = 0; b < item[i].options.length; b++) {
                                        xuan.push('<li data-id="' + item[i].options[b] + '" data-name="' + item[i].options[b] + '">' + item[i].options[b] + '</li>');
                                    }
                                    xuan.push('</ul></div>');
                                }
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
        if ($(window).scrollTop() > scroll && !isload) {
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
        page=1;
        getList();
    })

    //获取信息列表
    function getList(tr){

        // if(isload) return false;
        var data = [];
        data.push("page="+page);
        data.push("pageSize="+pageSize);
        data.push("title="+$(".txtSearch").val());
        $(".choose-tab li").each(function(){
            data.push($(this).attr("data-type") + "=" + $(this).attr("data-id"));
        });
        // var nature = $("#type").val();
        var nature = $(".type-box .active").attr('data-id');
        if(nature != '' && nature != undefined && nature != null){
            data.push("nature=" + nature);
        }
        var min_price  = $("#min_price").val();
        var high_price = $("#high_price").val();
        min_price = min_price ? min_price : 0;
        if(min_price >=0 && high_price){
            data.push("price_section=" + min_price + ',' + high_price);
        }
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
            $(".recomShop ul").html('<div class="empty">'+langData['info'][1][3]+'</div>');
        }else{
            $(".recomShop ul").append('<div class="empty">'+langData['info'][1][3]+'</div>');
        }
        $.ajax({
            url: masterDomain + "/include/ajax.php?service=info&action=ilist_v2&orderby=1&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    $(".empty").remove();
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        //信息过期
                            if (list[i].isvalid ==1) {
                                html.push('<li class="fn-clear over_li"><a href="'+list[i].url+'" data-url="'+list[i].url+'">');
                            }else{
                                html.push('<li class="fn-clear "><a href="'+list[i].url+'" data-url="'+list[i].url+'">');
                            }
                        //html.push('<li class="fn-clear"><a href="javascript:;" data-url="'+list[i].url+'">');
                        var photo = !list[i].member || list[i].member.photo == null ? templatePath+'images/noavatar_middle.gif' : list[i].member.photo;
                        html.push('<div class="userimg "><img src="'+photo+'" alt=""></div>');
                        html.push('<div class="info_r ">');
                        var nickname = !list[i].member || list[i].member.nickname == null ? langData['info'][1][4] : list[i].member.nickname;//匿名
                        html.push('<h4 class="fn-clear"><span>'+nickname+'</span> ');
                        if(list[i].is_shop == 0){
                            html.push('<i class="panel_tab">'+langData['info'][1][5]+'</i>');//个人
                        }else if(list[i].is_shop == 1){
                            html.push('<i class="com_tab"></i>');
                        }
                        if(list[i].price_switch==0){
                            if(list[i].price==0){
                                html.push('<span class="price fn-right">'+langData['info'][2][30]+'</span>');
                            }else{
                                html.push('<span class="price fn-right"><i>'+echoCurrency('symbol')+'</i>'+list[i].price+'</span>');
                            }
                        }
                        html.push('</h4>');
                        html.push('<p class="con" style="color:'+(list[i].color?list[i].color:"")+'; font-weight:'+(list[i].titleBlod=="1"?"bold":"normal")+'">');
                        // 置顶
                        if(list[i].isbid == 1){
                            html.push('<i class="top_tab"></i>');
                        }
                        html.push('<span class="type" >#<em>'+list[i].typename+'</em>#</span>'+list[i].title+'</p>');
                        if(list[i].video){
                            html.push(' <div class="item-box video-box commonimg">');
                            html.push('<img data-video="'+list[i].video+'" onerror="this.src=\''+list[i].litpic+'\'" src="'+huoniao.changeFileSize(list[i].litpic, "small")+'" alt="">');
                            html.push('<i class="play"></i>');
                            html.push('</div>');
                        }else if(list[i].pcount<=5){
                            html.push('<div class="item-box img-box">');
                            for(var m=0;m<list[i].picArr.length;m++){
                                html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'" src="'+huoniao.changeFileSize(list[i].picArr[m]['litpic'], "small")+'" alt=""></div>');
                            }
                            html.push('</div>');
                        }else {
                            html.push('<div class="item-box img-box">');
                            for(var m=0;m<list[i].picArr.length;m++){
                                if(m == 5){
                                    html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'" src="'+huoniao.changeFileSize(list[i].picArr[m]['litpic'], "small")+'" alt=""> <i>+'+list[i].pcount+'</i></div>');
                                }else{
                                    html.push('<div class="img_item commonimg"><img onerror="this.src=\''+list[i].picArr[m]['litpic']+'\'" src="'+huoniao.changeFileSize(list[i].picArr[m]['litpic'], "small")+'" alt=""></div>');
                                }
                            }
                            html.push('</div>');
                        }
                        html.push(' <p class="area"><span href=""><i class="icon_area"></i>'+list[i].address+'</span></p>');
                        html.push('<div class="msg fn-clear">');
                        var data1 = huoniao_.transTimes(list[i].pubdate,5);
                        html.push(' <div class="_left fn-left"><span>'+data1+'</span><span class="point">·</span>'+langData['info'][1][6]+list[i].click+'</div>');
                        var al_zant = '';
                        if(list[i].collect){
                            al_zant = 'al_zan';
                        }
                        html.push(' <div class="_right fn-right"><span data-type="1" data-id="'+list[i].id+'" class="numZan '+al_zant+'">'+list[i].collectnum+'</span><span href="javascript:;" class="numComment">'+list[i].common+'</span></div>');
                        html.push('</div>');
                        html.push('</div>');
                        //信息过期标识
                        if (list[i].isvalid ==1) {
                            html.push('<i class="over_icon"></i>');
                        }
                        html.push('</a></li>');
                    }

                    if(page == 1){
                        $(".recomShop ul").html("");
                        $(".recomShop ul").html(html.join(""));
                        // setTimeout(function(){$(".recomShop ul").html(html.join(""))}, 200);
                    }else{
                        $(".recomShop ul").append(html.join(""));
                    }
                    isload = false;

                    if(page >= pageinfo.totalPage){
                        isload = true;
                        $(".recomShop ul").append('<div class="empty">'+langData['info'][1][7]+'</div>');
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
                $(".recomShop ul .empty").html(langData['info'][1][2]).show();
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
        if (filter.nature != '') {
            $('.type-box span[data-id="'+filter.nature+'"]').addClass('active').siblings('span').removeClass('active');
        }

        // 排序选中状态
        // if (filter.orderby != "") {
        //     $('.choose-tab .orderby').attr('data-id', filter.orderby);
        //     $('#choose-sort li[data-id="'+filter.orderby+'"]').addClass('on').siblings('li').removeClass('on');
        // }

    }

    // 筛选
    // 筛选类别选择
    $('.choose-price .type-box span').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('#type').val($(this).data('id'));
    });
    // 重置
    $('.choose-price h3 span.reset').click(function () {
        $('.choose-price .type-box span').removeClass('active');
        $('#type').val("");
        $('#min_price').val("");
        $('#high_price').val("");
    });
    // 取消
    $('.choose-price .btns span.btn_cancel').click(function () {
        $('.choose-price .type-box span').removeClass('active');
        $('#type').val("");
        $('#min_price').val("");
        $('#high_price').val("");
        $('.mask').hide();
        $('.choose-local').hide();
    });
    //确定
    $('.choose-price .btns span.btn_sure').click(function () {
        var type = $('#type').val();
        var min_price =  $('#min_price').val();
        var high_price = $('#high_price').val();
        $('.mask').hide();
        $('.choose-local').hide();
        page=1;
        getList();
    });


    //点赞
    $('.container').on('click','.numZan',function(e){
        e.preventDefault();
        var id = $(this).attr('data-id'), infotype = $(this).attr('data-type'), type = '', collecttxt = '';
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }
        var num = parseInt($(this).text());
        if($(this).hasClass('al_zan')){
            num = parseInt(num - 1);
            $(this).html(num);
            $(this).removeClass('al_zan');
            type = 'del';
        }else{
            num = parseInt(num + 1);
            $(this).html(num);
            $(this).addClass('al_zan');
            type = 'add';
        }
        var temps = 'detail';
        if(infotype == 1){
            temps = 'detail';
        }else if(infotype == 2){
            temps = 'shop';
        }
        $.post("/include/ajax.php?service=member&action=collect&module=info&temp="+temps+"&type="+type+"&id="+id,{},function(res){
            var res = JSON.parse(res);
            if(res.state == 100){
                if(type == 'del'){
                    collecttxt = langData['info'][1][8];//已取消收藏
                }else{
                    collecttxt = langData['info'][1][9];//您已收藏
                }
            }else{
                collecttxt = langData['info'][1][2];//请求出错请刷新重试
            }

            $.dialog({
                type : 'info',
                contentHtml : '<p class="info-text">'+collecttxt+'</p>',
                autoClose : 1000
            });
        });
    });

    // 图片放大
    var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})

    $(".container").delegate('.commonimg', 'click', function(e) {
        e.preventDefault();
        var imgBox = $(this).parents('li').find('.commonimg');
        var i = $(this).index();
        $(".videoModal .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length; j < c ;j++){
            if(j==0){
                var videoPath = imgBox.eq(j).find('img').attr("data-video");
                if(videoPath != '' && videoPath != null){
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><video width="100%" height="100%" controls preload="meta" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline  x5-video-player-fullscreen="true" id="video" src="'+videoPath+'"  poster="' + imgBox.eq(j).find('img').attr("src") + '"></video></div>');
                }else{
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find('img').attr("src") + '" / ></div>');
                }
            }else{
                $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find("img").attr("src") + '" / ></div>');
            }
        }
        videoSwiper.update();
        $(".videoModal").addClass('vshow');
        $('.markBox').toggleClass('show');
        videoSwiper.slideTo(i, 0, false);
        return false;
    });

    $(".videoModal").delegate('.vClose', 'click', function() {
        var video = $('.videoModal').find('video').attr('id');
        $(video).trigger('pause');
        $(this).closest('.videoModal').removeClass('vshow');
        $('.videoModal').removeClass('vshow');
        $('.markBox').removeClass('show');
    });


})

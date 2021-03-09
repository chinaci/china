$(function(){
    $("img").scrollLoading();

    var lens = $('#fnav .item_box a').length;
    console.log(lens)
    if(lens<=10){
        $(".f_more").hide()
    }else{
        $(".f_more").show();
    }
	$('.main_list').delegate('.telphone','click',function(){
		event.preventDefault();   //阻止冒泡事件
		window.location.href = masterDomain+"/login.html";  //跳转到登录页面
	});
    //折叠筛选
    $(".f_more").bind("click", function(){
        var t = $(this);
        t.hasClass("curr") ? t.removeClass("curr") : t.addClass("curr");
        if(t.hasClass("curr")){
            t.next('.item_box').addClass('on');
            t.next('.item_box').parent('dd').css("background","#e8eaef");
            t.html("收起 <i></i>");
        }else{
            t.next('.item_box').removeClass('on');
            t.next('.item_box').parent('dd').css("background","none");
            t.html("更多 <i></i>");
        }

    });

    $('.main').delegate('.code', 'hover', function(event) {
        var type = event.type;
        var url = $(this).next().find('a').attr('href');
        if(type == "mouseenter"){
            $(this).find('.qrcode').css("display","block");
            $(this).find('#qrcode').qrcode({
                render: window.applicationCache ? "canvas" : "table",
                width: 95,
                height: 95,
                text: huoniao.toUtf8(url)
            });
        }else{
            $(this).find('.qrcode').css("display","none");
            $(this).find('#qrcode').html('');
        }
    });

    var infoListType = $.cookie("infoListType");
    if(infoListType == 0){
        $(".lmain").show();
        $(".bmain").hide();
        $(".lmain .bmain").show();
        $(".rowlist").addClass("curr");
        $(".window").removeClass("curr");
    }else{
        $(".lmain").hide();
        $(".bmain").show();
        $(".rowlist").removeClass("curr");
        $(".window").addClass("curr");
    }
    //大图、列表切换
    $(".window").bind("click", function(){
        $(this).addClass("curr");
        $(".rowlist").removeClass("curr");
        $(".lmain").hide();
        $(".bmain").show();
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));  //设置过期时间为7天
        $.cookie("infoListType", 1, {expires: date});
    });
    $(".rowlist").bind("click", function(){
        $(this).addClass("curr");
        $(".window").removeClass("curr");
        $(".bmain").hide();
        $(".lmain").show();
        $(".lmain .bmain").show();
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));  //设置过期时间为7天
        $.cookie("infoListType", 0, {expires: date});
    });



    /**
     * 筛选变量
     */
    var addrid; //地址
    var flag = 1; // pc端
    var item;
    var price_section; // 价格区间
    var orderby = $(".sort ul").find('.curr').attr("data-sort"); //排序
    var pic; // 只看图片
    if($(".sort .pic").hasClass("curr")){
        pic = $(".sort .pic").attr("data-sort");
    }
    var video; // 只看视频
    if($(".sort .vid").hasClass("curr")){
        pic = $(".sort .vid").attr("data-sort");
    }
    var memberType = $(".sort").find(".curr").attr("data-id"); // 商家或者个人


    //筛选
    $(".filter").delegate("a", "click", function(){

        var t = $(this), par = t.closest('dl'), i = par.index(),id =t.attr('data-id');
        if(!list_lower){

            var href = t.attr("href");
            if(t.attr("data-type") == 'flag'){
                // 没有分类id 则跳转到点击的分类页面
                window.location.href = href;return;
            }
        }
        if(i == 0){
            typeid = id;
        }else if(i == 2){
            price_section = id;
        }

        $(this).addClass("curr").siblings("a").removeClass("curr");
        atpage = 1;
        getList();
    });

     $(".inp_price .btn").click(function () {
        var pri_1 = $(".inp_price .p1").val();
        var pri_2 = $(".inp_price .p2").val();
        price_section = pri_1 + ',' + pri_2;
        getList();
    })

    // 删除关键字
    $('.filter-item .close').click(function(){
        keyword = "";
        $(this).parent('.filter-item').remove();
        typeid = 1;
        getList();
    })

    //二级分类交互
    $("#subnav .item_box>a, #addr dd>a").bind("click", function(){
        var t = $(this), id = t.attr("data-id"), type = t.closest("dl").attr("id");
        if(type == "subnav") typeid = id;
        if(type == "addr") addrid = id;
        if(id == 0 || $("#"+type+id).size() == 0){
            $("#"+type).find(".subnav").hide();
        }else{
            $("#"+type).find(".subnav").show()
            $("#"+type).find(".subnav div").hide();
            $("#"+type+id).show();
            $("#"+type+id).find("a").removeClass("curr");
            $("#"+type+id).find("a:eq(0)").addClass("curr");
        }
    });

    // $(".subnav").delegate("a", "click", function(){
    //     var t = $(this), id = t.attr("data-id");
    //     addrid = id;
    //     getList();
    // });
    $(".subnav").delegate("a", "click", function(){
        var t = $(this), id = t.attr("data-id"), type = t.closest("dl").attr("id");

        if(type == "subnav") typeid = id;
        if(type == "addr") addrid = id;
        getList();
    });

    //根据二级分类获取字段
    $("#subnav a").bind("click", function(){
        var t = $(this), id = t.attr("data-id");
        if(id != 0){
            $.ajax({
                url: "/include/ajax.php?service=info&action=typeDetail&id="+id,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){
                        var item = data.info[0].item, html = [];

                        if(item != undefined && item.length > 0){

                            for(var i = 0; i < item.length; i++){
                                if(item[i].formtype != "text"){
                                    html.push('<dl class="item fn-clear" data-name="'+item[i].field+'" data-id="'+item[i].id+'">');
                                    html.push('<dt>'+item[i].title+'</dt>');
                                    html.push('<dd>');
                                    html.push('<a href="javascript:;" data-id="0" class="curr">不限</a>');
                                    for(var b = 0; b < item[i].options.length; b++){
                                        html.push('<a href="javascript:;" data-id="'+item[i].options[b]+'">'+item[i].options[b]+'</a>')
                                    }
                                    html.push('</dd>');
                                    html.push('</dl>');
                                }
                            }
                        }
                        $("#itemOptions").html(html.join(""));

                    }
                }
            });
        }
    });

    //性质切换
    $(".sortbar .tabs li").bind("click", function(){
        var t = $(this);
        if(!t.hasClass("curr")){
            t.addClass("curr").siblings("li").removeClass("curr");
            memberType  = $(this).attr("data-id");
            atpage = 1;
            getList();
        }
    });


    //排序筛选
    $(".sort li a").bind("click", function(){
        var t = $(this), par = t.parent();
        //排序
        if(par.hasClass("st")){
            //价格特殊情况
            if(par.hasClass("price")){
                if(t.hasClass("price-up")){
                    t.removeClass("price-up").addClass("curr price-down").siblings("a").removeClass("curr");
                    par.attr("data-sort", 5);
                }else{
                    t.removeClass("price-down").addClass("curr price-up").siblings("a").removeClass("curr");
                    par.attr("data-sort", 5.1);
                }
            }
            par.addClass("curr").siblings(".st").removeClass("curr");

            //筛选
        }else if(par.hasClass('videopic')){
            !par.hasClass("curr") ? par.addClass('curr').siblings(".videopic").removeClass("curr") : par.removeClass('curr');
        }else{
            par.hasClass("curr") ? par.removeClass("curr") : par.addClass("curr");
        }

        if($(".videopic").hasClass("curr")){
            var type_ = $(".videopic.curr").attr("data-sort");

            if(type_ == 'pic'){
                pic = 1;
            }else{
                pic = 0;
            }
            if(type_ == 'vid'){
                video = 1;
            }else{
                video = 0;
            }
        }else{
            pic = 0;
            video = 0;
        }

        orderby = $(".sort ul").find('.curr').attr("data-sort");
        getList();

    });



    //头部分页
    $(".views .tpage a").bind("click", function(){
        var t = $(this);
        if(!t.hasClass("diabled")){
            //上一页
            if(t.hasClass("prev")){
                atpage = Number(atpage) - 1;
                //下一页
            }else{
                atpage = Number(atpage) + 1;
            }
            getList();
        }
    });



    // 初始化记载
    getList(1);


    function getList(is){

        $(".main_list").html("");
        $(".recCom").html("");
        var userid = $.cookie(cookiePre+"login_user");

        $.ajax({
            type: "POST",
            traditional: true,
            url: "/include/ajax.php?service=info&action=ilist_v2",
            data: {
                "typeid": typeid,
                "addrid": addrid,
                "item": JSON.stringify(item),
                "memberType": memberType,
                "orderby": orderby,
                "thumb": pic,
                "video": video,
                "page": atpage,
                "flag": flag,
                "pageSize": pageSize,
                "title": keywords,
                "price_section": price_section,
            },
            dataType: "json",
            success: function (data) {
                if(data && data.state == 100){
                    //列表
                    var html = '', html_b = '', html_t = '', list = data.info.list, pageInfo = data.info.pageInfo, len = list.length;
                    $("#totalCount").html(pageInfo.totalCount);
                    totalCount = pageInfo.totalCount;
                    var tpage = Math.ceil(totalCount/pageSize);
                    $(".views .tpage .atpage").html("<em>"+atpage+"</em>/"+tpage);

                    var prev = $(".views .tpage .prev"), next = $(".views .tpage .next");
                    if(atpage == 1){
                        prev.addClass("diabled");
                    }else{
                        prev.removeClass("diabled");
                    }

                    if(tpage > 0 && atpage < tpage){
                        next.removeClass("diabled");
                    }else{
                        next.addClass("diabled");
                    }



                    for(var i = 0; i < len; i++){
                        var is_collected = '';
                        if(list[i].collect){
                            is_collected = 'collected';
                        }
                        var is_shop = '';
                        if(list[i].is_shop){
                            is_shop = '<span class="m_shop">商家</span>';
                        }
                        var is_top = '';
                        if(list[i].top != 0){
                            is_top = '<span class="m_top">置顶</span>';
                        }
                        var is_Video = '';
                        if(list[i].video){
                            is_Video = '<div class="cover_play"><img src="'+templatePath+'/images/Icon_play.png" alt=""></div>';
                        }
                        var ishone = '';
                        var phone2 = '';
                        if(list[i].member.phone){
                            if(userid == null || userid == ""){
                                list[i].member.phone = '登录后显示';
                            }
                            ishone = '<div class="c_telphone">'+list[i].member.phone+' <i></i></div>'
                            phone2 = '<img src="'+templatePath+'images/Icon_tel.png" alt="">'

                        }
                        var price_ = '';
                        if(list[i].price_switch == 0){
	                        if(list[i].price != 0){
	                            price_ = '<p class="info_price"><b>'+ echoCurrency('symbol') +'</b>'+list[i].price+'</p>';
	                        }else{
	                            price_ = '<p class="info_price">价格面议</p>';
	                        }
	                    }
                        var addr_htm = '';
                        addr_htm = list[i].address[2] ? list[i].address[2] +'/'+list[i].address[1] : list[i].address[1];

                        var litpic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
                        
                        html += '<li>' +
                            '<div class="box_collect '+is_collected+'" data-id="'+list[i].id+'" data-type="shop"><i></i></div>' +
                            '<a href="'+list[i].url+'">' +
                            '<div class="recom_img">' +
                            '<img src="'+litpic+'" alt="">' +
                            is_Video +
                            '<div class="box_mark">' +
                            is_top +
                            is_shop +
                            '</div>' +
                            '</div>' +
                            '<div class="recom_info">' + price_ +
                            //'<p class="info_price">'+price_+'</p>' +
                            '<p class="m_info">'+list[i].title+'</p>' +
                            '<div class="info_address fn-clear">' +
                            '<span class="fn-left location">'+addr_htm+'</span>' +
                            '<span class="fn-right telphone" data-tel="'+list[i].member.phone+'">'+
                            phone2+
                            '</span>' +ishone+
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '</li>';

                        if(is_shop){
                            is_shop = '<span class="m_mark mark1">商家</span>';
                        }else{
                            is_shop = '<span class="m_mark mark3">个人</span>';
                        }
                        var shiming = '';
                        if(list[i].member.certifyState == 1){
                            shiming = '<span class="m_per"><i></i>身份认证</span>';
                        }
                        var phone_rz = '';
                        if(list[i].member.phoneCheck == 1){
                            phone_rz = '<span class="m_tel"><i></i>手机认证 </span>';
                        }
                        var price_ = '';
                        if(list[i].price != 0){
                            price_ = '<b>¥</b>'+list[i].price;
                        }else{
                            price_ = '价格面议';
                        }

                        var phone_html = '';
                        if(list[i].member.phone){
                            phone_html = list[i].member.phone;
                        }else{
                            phone_html = '暂无电话';
                        }

                        var nickname_ = '暂无';
                        if(list[i].member.nickname){
                            nickname_ = list[i].member.nickname;
                        }
                        var url_user = '';
                        if(list[i].url_user){
                            url_user = list[i].url_user;
                        }else{
                            url_user = 'javaScript:;';
                        }


                        if(list[i].top == '1'){

                            html_t += '<li class="fn-clear">' +
                                '<div class="code"><div class="qrcode"><div id="qrcode"></div></div></div>' +
                                '<div class="recom_img fn-left">' +
                                '<div class="box_collect '+is_collected+'" data-id="'+list[i].id+'" data-type="shop"><i></i></div>' +
                                '<a href="'+list[i].url+'">' +
                                '<img src="'+litpic+'" alt="">' +
                                '</a>' +
                                is_Video +
                                '<div class="box_mark">' +
                                '<span class="m_pic"><em>'+list[i].pcount+'</em>图</span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="recom_info fn-left">' +
                                '<h3><a href="'+list[i].url+'">'+list[i].title+'</a><i></i></h3>' +
                                '<div class="box_mark fn-clear">' +
                                '<span class="m_mark mark2">'+list[i].typename+'</span>' +
                                '<span class="s_add">'+list[i].address[2]+'-'+list[i].address[1]+'</span>' +
                                '<span class="s_time">'+list[i].pubdate1+'</span>' +
                                '<div class="price"> '+price_+'</div>' +
                                '</div>' +
                                '<div class="bottom_box fn-clear">' +
                                '<div class="fn-clear">' +
                                '<div class="head_img">' +
                                '<img src="'+list[i].member.photo+'" alt="">' +
                                '</div>' +
                                '<div class="user_info">' +
                                '<a href="'+url_user+'" class="u_name" target="_blank">' +
                                nickname_ +
                                '</a>' +
                                '<div class="box_mark fn-clear">' +
                                is_shop +
                                shiming +
                                phone_rz +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="r_tel"><i></i> <span>'+phone_html+'</span></div>' +
                                '</div>' +
                                '</div>' +
                                '</li>';
                        }else{
                            html_b += '<li class="fn-clear">' +
                                '<div class="code"><div class="qrcode"><div id="qrcode"></div></div></div>' +

                                '<div class="recom_img fn-left">' +
                                '<a href="'+list[i].url+'">' +
                                '<img src="'+litpic+'" alt="">' +
                                '</a>' +
                                '<div class="box_collect '+is_collected+'" data-id="'+list[i].id+'" data-type="shop"><i></i></div>' +
                                is_Video +
                                '<div class="box_mark">' +
                                '<span class="m_pic"><em>'+list[i].pcount+'</em>图</span>' +
                                '</div>' +

                                '</div>' +
                                '<div class="recom_info fn-left">' +
                                '<h3><a href="'+list[i].url+'">'+list[i].title+'</a></h3>' +
                                '<div class="box_mark fn-clear">' +
                                '<span class="m_mark mark2">'+list[i].typename+'</span>' +
                                '<span class="s_add">'+list[i].address[2]+'-'+list[i].address[1]+'</span>' +
                                '<span class="s_time">'+list[i].pubdate1+'</span>' +
                                '<div class="price"> '+price_+'</div>' +
                                '</div>' +
                                '<div class="bottom_box fn-clear">' +
                                '<div class="fn-clear">' +
                                '<div class="head_img">' +
                                '<img src="'+list[i].member.photo+'" alt="">' +
                                '</div>' +
                                '<div class="user_info">' +
                                '<a href="'+url_user+'" class="u_name" target="_blank">' +
                                nickname_ +
                                '</a>' +
                                '<div class="box_mark fn-clear">' +
                                is_shop +
                                shiming +
                                phone_rz +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="r_tel"><i></i> <span>'+phone_html+'</span></div>' +
                                '</div>' +
                                '</div>' +
                                '</li>';
                        }

                    }


                    $(".main_list").html(html);
                    $(".recCom").html(html_b);
                    $(".recTop").html(html_t);
                    $(".failed").hide();
                    $('.other_box').show();
                    if(html_t == ''){
                        $(".recTop").removeClass('topborder');
                    }else{
                        $(".recTop").addClass('topborder');
                    }
                    $("img").scrollLoading();
                    showPageInfo();

                }else{
                    $(".main_list").html("");
                    $(".recCom").html("");
                    $(".recTop").html("");
                    $(".pagination").hide();
                    if($(".recTop").html("")){
                        $(".recTop").removeClass('topborder');
                    }else{
                        $(".recTop").addClass('topborder');
                    }
                    $('.other_box').hide();

                    $(".views .tpage .atpage").html("<em>0</em>/0");
                    $(".views .tpage .prev").addClass("diabled");
                    $(".views .tpage .next").addClass("diabled");

                    $(".failed").show().find("span").html(data.info);
                }

            },
            error: function(){
                alert("网络错误");
                $(".main_list").html("");
                $(".recCom").html("");
                $(".recTop").html("");
                $(".pagination").hide();
                if($(".recTop").html("")){
                    $(".recTop").removeClass('topborder');
                }else{
                    $(".recTop").addClass('topborder');
                }
                $('.other_box').hide();

                $(".views .tpage .atpage").html("<em>0</em>/0");
                $(".views .tpage .prev").addClass("diabled");
                $(".views .tpage .next").addClass("diabled");

                $(".failed").show().find("span").html("网络错误，请重试！");
            }
        });

    }


    $('.searchkeys').delegate('a', 'click', function() {
        var t = $(this);
        var text = t.text();
        $('.search').show();
        $(".searchkey").val(text);
        $(".form").submit();
    })

    //打印分页
    function showPageInfo() {
        var info = $(".pagination");
        var nowPageNum = atpage;
        var allPageNum = Math.ceil(totalCount/pageSize);
        var pageArr = [];

        info.html("").hide();

        //输入跳转
        var redirect = document.createElement("div");
        redirect.className = "pagination-gotopage";
        redirect.innerHTML = '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
        info.append(redirect);

        //分页跳转
        info.find(".btn").bind("click", function(){
            var pageNum = info.find(".inp").val();
            if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
                atpage = pageNum;
                getList();
            } else {
                info.find(".inp").focus();
            }
        });

        var pages = document.createElement("div");
        pages.className = "pagination-pages";
        info.append(pages);

        //拼接所有分页
        if (allPageNum > 1) {

            //上一页
            if (nowPageNum > 1) {
                var prev = document.createElement("a");
                prev.className = "prev";
                prev.innerHTML = '<i></i>';
                prev.onclick = function () {
                    atpage = nowPageNum - 1;
                    getList();
                }
            } else {
                var prev = document.createElement("span");
                prev.className = "prev disabled";
                prev.innerHTML = '<i></i>';
            }
            info.find(".pagination-pages").append(prev);

            //分页列表
            if (allPageNum - 2 < 1) {
                for (var i = 1; i <= allPageNum; i++) {
                    if (nowPageNum == i) {
                        var page = document.createElement("span");
                        page.className = "curr";
                        page.innerHTML = i;
                    } else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            getList();
                        }
                    }
                    info.find(".pagination-pages").append(page);
                }
            } else {
                for (var i = 1; i <= 2; i++) {
                    if (nowPageNum == i) {
                        var page = document.createElement("span");
                        page.className = "curr";
                        page.innerHTML = i;
                    }
                    else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            getList();
                        }
                    }
                    info.find(".pagination-pages").append(page);
                }
                var addNum = nowPageNum - 4;
                if (addNum > 0) {
                    var em = document.createElement("span");
                    em.className = "interim";
                    em.innerHTML = "...";
                    info.find(".pagination-pages").append(em);
                }
                for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                    if (i > allPageNum) {
                        break;
                    }
                    else {
                        if (i <= 2) {
                            continue;
                        }
                        else {
                            if (nowPageNum == i) {
                                var page = document.createElement("span");
                                page.className = "curr";
                                page.innerHTML = i;
                            }
                            else {
                                var page = document.createElement("a");
                                page.innerHTML = i;
                                page.onclick = function () {
                                    atpage = Number($(this).text());
                                    getList();
                                }
                            }
                            info.find(".pagination-pages").append(page);
                        }
                    }
                }
                var addNum = nowPageNum + 2;
                if (addNum < allPageNum - 1) {
                    var em = document.createElement("span");
                    em.className = "interim";
                    em.innerHTML = "...";
                    info.find(".pagination-pages").append(em);
                }
                for (var i = allPageNum - 1; i <= allPageNum; i++) {
                    if (i <= nowPageNum + 1) {
                        continue;
                    }
                    else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            getList();
                        }
                        info.find(".pagination-pages").append(page);
                    }
                }
            }

            //下一页
            if (nowPageNum < allPageNum) {
                var next = document.createElement("a");
                next.className = "next";
                next.innerHTML = '<i></i>';
                next.onclick = function () {
                    atpage = nowPageNum + 1;
                    getList();
                }
            } else {
                var next = document.createElement("span");
                next.className = "next disabled";
                next.innerHTML = '<i></i>';
            }
            info.find(".pagination-pages").append(next);

            info.show();

        }else{
            info.hide();
        }
    }



})
$(function(){
    $("#qrcode").qrcode({
        render: window.applicationCache ? "canvas" : "table",
        width: 80,
        height: 80,
        text: huoniao.toUtf8(window.location.href)
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



    $('.btn_care').click(function(){

        var t = $(this), type = t.hasClass("cared") ? "0" : "1";
        $.ajax({
            url : masterDomain + "/include/ajax.php?service=info&action=follow&vid=" + user_id + '&type=' + type + '&temp=info',
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(type == 0){
                        t.removeClass('cared').html('关注');
                    }else{
                        t.addClass('cared').html('已关注');
                    }
                }else{
                    alert(data.info);
                    window.location.href = masterDomain + '/login.html';

                }
            }
        })

    });

    //手机看
    $(".sctop .sr").hover(function(){
        $(this).find(".qrcode").show();
    }, function(){
        $(this).find(".qrcode").hide();
    });

    $('.r_tab .rbox').click(function(event) {
        var t= $(this),fensi_list_type;
        if(t.hasClass('rbinfo')){
            $('.info_content').show();
            $('.fans_content').hide();
            $('.failed').hide();
            atpage = 1;
            getList();
        }else{
            if(t.hasClass('rbcare')){
                $('.fans_content .tabs li').removeClass('curr')
                $('.fans_content .tabs li').eq(0).addClass('curr');
                fensi_list_type = 'g';

            }else{
                $('.fans_content .tabs li').removeClass('curr')
                $('.fans_content .tabs li').eq(1).addClass('curr');
                fensi_list_type = 'f';

            }
            $('.info_content').hide();
            $('.fans_content').show();
            atpage = 1;
            fenSiList(fensi_list_type);
        }


    });
    // 点击微信号出现微信二维码弹出层
    $('.contact_box .c_wx').on('click',function(){
        $('html').addClass('nos');
        $('.modal-wx').addClass('curr');
    })
    // 关闭
    $(".modal-bg,.closebox").on("click",function(){
        $("html, .modal-wx").removeClass('curr nos');
    })


    /**
     * 筛选变量
     */
    var addrid; //地址
    var item;

    //粉丝切换
    $(".fans_content .sortbar .tabs li").bind("click", function(){
        var t = $(this) , fensi_list_type;
        var data_id = t.attr("data-id");

        if(!t.hasClass("curr")){
            t.addClass("curr").siblings("li").removeClass("curr");

            if(data_id == '0'){
                fensi_list_type = 'g';
            }else{
                fensi_list_type = 'f';
            }
            console.log(fensi_list_type)

            atpage = 1;
            fenSiList(fensi_list_type);
        }
    });

    //头部分页
    $(".info_content .views .tpage a").bind("click", function(){
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

        $.ajax({
            type: "POST",
            traditional: true,
            url: masterDomain + "/include/ajax.php?service=info&action=ilist_v2",
            data: {
                "item": JSON.stringify(item),
                "page": atpage,
                "pageSize": pageSize,
                "uid" : user_id
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
                        if(list[i].collect == 1){
                            is_collected = 'collected';
                        }
                        var is_shop = '';
                        if(list[i].is_shop == 1){
                            is_shop = '<span class="m_shop">商家</span>';
                        }
                        var is_top = '';
                        if(list[i].top == 1){
                            is_top = '<span class="m_top">置顶</span>';
                        }
                        var is_Video = '';
                        if(list[i].video == 1){
                            is_Video = '<div class="cover_play"><img src="'+templatePath+'/images/Icon_play.png" alt=""></div>';
                        }
                        var ishone = '';
                        if(user_phone){
                            ishone = '<div class="c_telphone">'+user_phone+' <i></i></div>'
                        }
                        var price_ = '';
                        if(list[i].price_switch == 0){
	                        if(list[i].price != 0){
	                            price_ = '<p class="info_price"><b>¥</b>' + list[i].price + '</p>';
	                        }else{
	                            price_ = '<p class="info_price">价格面议</p>';
	                        }
	                    }
                        html += '<li>' +
                            '<div class="box_collect '+is_collected+'" data-id="'+list[i].id+'" data-type="detail"><i></i></div>' +
                            '<a href="'+list[i].url+'">' +
                            '<div class="recom_img">' +
                            '<img src="'+list[i].litpic+'" alt="">' +
                            is_Video +
                            '<div class="box_mark">' +
                            is_top +
                            is_shop +
                            '</div>' +
                            '</div>' +
                            '<div class="recom_info">' + price_ +
                            //'<p class="info_price"> '+price_+'</p>' +
                            '<p class="m_info">'+list[i].title+'</p>' +
                            '<div class="info_address fn-clear">' +
                            '<span class="fn-left location">'+list[i].address[2]+'/'+list[i].address[1]+'</span>' +
                            '<span class="fn-right telphone" data-tel="'+list[i].member.phone+'">' +
                            '<img src="'+templatePath+'/images/Icon_tel.png" alt="">' +
                            '</span>' +
                            ishone +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '</li>';

                        if(is_shop){
                            is_shop = '<span class="m_mark mark1">商家</span>';
                        }
                        var shiming = '';
                        if(list[i].member.certifyState){
                            shiming = '<span class="m_per"><i></i>身份认证</span>';
                        }
                        var phone_rz = '';
                        if(list[i].member.phoneCheck){
                            phone_rz = '<span class="m_tel"><i></i>手机认证 </span>';
                        }
                        // if(list[i].top == '1'){
                        //
                        //     html_t += '<li class="fn-clear">' +
                        //         '<div class="code"><div class="qrcode"><div id="qrcode"></div></div></div>' +
                        //         '<div class="recom_img fn-left">' +
                        //         '<div class="box_collect '+is_collected+'" data-id="'+list[i].id+'" data-type="detail"><i></i></div>' +
                        //         '<a href="'+list[i].url+'">' +
                        //         '<img src="'+list[i].litpic+'" alt="">' +
                        //         '</a>' +
                        //         is_Video +
                        //         '<div class="box_mark">' +
                        //         '<span class="m_pic"><em>'+list[i].pcount+'</em>图</span>' +
                        //         '</div>' +
                        //
                        //         '</div>' +
                        //         '<div class="recom_info fn-left">' +
                        //         '<h3><a href="'+list[i].url+'">'+list[i].title+'</a></h3>' +
                        //         '<div class="box_mark fn-clear">' +
                        //         '<span class="m_mark mark2">'+list[i].typename+'</span>' +
                        //         '<span class="s_add">'+list[i].address[2]+'-'+list[i].address[1]+'</span>' +
                        //         '<span class="s_time">'+list[i].pubdate1+'</span>' +
                        //         '<div class="price"> '+price_+'</div>' +
                        //         '</div>' +
                        //         '<div class="bottom_box fn-clear">' +
                        //         '<div class="fn-clear">' +
                        //         '<div class="head_img">' +
                        //         '<img src="'+list[i].member.photo+'" alt="">' +
                        //         '</div>' +
                        //         '<div class="user_info">' +
                        //         '<a href="{#$info_channelDomain#}/store.html" class="u_name">' +
                        //         list[i].member.nickname +
                        //         '</a>' +
                        //         '<div class="box_mark fn-clear">' +
                        //         is_shop +
                        //         shiming +
                        //         phone_rz +
                        //         '</div>' +
                        //         '</div>' +
                        //         '</div>' +
                        //         '<div class="r_tel"><i></i> <span>'+ishone+'</span></div>' +
                        //         '</div>' +
                        //         '</div>' +
                        //         '</li>';
                        // }else{
                        //     html_b += '<li class="fn-clear">' +
                        //         '<div class="code"><div class="qrcode"><div id="qrcode"></div></div></div>' +
                        //         '<div class="recom_img fn-left">' +
                        //         '<div class="box_collect '+is_collected+'" data-id="'+list[i].id+'" data-type="detail"><i></i></div>' +
                        //
                        //         '<a href="'+list[i].url+'">' +
                        //         '<img src="'+list[i].litpic+'" alt="">' +
                        //         '</a>' +
                        //         is_Video +
                        //         '<div class="box_mark">' +
                        //         '<span class="m_pic"><em>'+list[i].pcount+'</em>图</span>' +
                        //         '</div>' +
                        //         '</div>' +
                        //         '<div class="recom_info fn-left">' +
                        //         '<h3><a href="'+list[i].url+'">'+list[i].title+'</a></h3>' +
                        //         '<div class="box_mark fn-clear">' +
                        //         '<span class="m_mark mark2">'+list[i].typename+'</span>' +
                        //         '<span class="s_add">'+list[i].address[2]+'-'+list[i].address[1]+'</span>' +
                        //         '<span class="s_time">'+list[i].pubdate1+'</span>' +
                        //         '<div class="price"> '+price_+'</div>' +
                        //         '</div>' +
                        //         '<div class="bottom_box fn-clear">' +
                        //         '<div class="fn-clear">' +
                        //         '<div class="head_img">' +
                        //         '<img src="'+list[i].member.photo+'" alt="">' +
                        //         '</div>' +
                        //         '<div class="user_info">' +
                        //         '<a href="{#$info_channelDomain#}/store.html" class="u_name">' +
                        //         list[i].member.nickname +
                        //         '</a>' +
                        //         '<div class="box_mark fn-clear">' +
                        //         is_shop +
                        //         shiming +
                        //         phone_rz +
                        //         '</div>' +
                        //         '</div>' +
                        //         '</div>' +
                        //         '<div class="r_tel"><i></i> <span>'+ishone+'</span></div>' +
                        //         '</div>' +
                        //         '</div>' +
                        //         '</li>';
                        // }



                    }


                    $(".main_list").html(html);
                    // $(".recCom").html(html_b);
                    // $(".recTop").html(html_t);

                    $(".failed").hide();

                    $("img").scrollLoading();
                    showPageInfo();

                }else{
                    $(".main_list").html("");
                    $(".recCom").html("");
                    $(".recTop").html("");
                    $(".pagination").hide();

                    $(".views .tpage .atpage").html("<em>0</em>/0");
                    $(".views .tpage .prev").addClass("diabled");
                    $(".views .tpage .next").addClass("diabled");

                    $(".failed").show().find("span").html(data.info);
                }

            },
            error: function(){
                alert("网络错误")
                $(".main_list").html("");
                $(".recCom").html("");
                $(".recTop").html("");
                $(".pagination").hide();

                $(".views .tpage .atpage").html("<em>0</em>/0");
                $(".views .tpage .prev").addClass("diabled");
                $(".views .tpage .next").addClass("diabled");

                $(".failed").show().find("span").html("网络错误，请重试！");
            }
        });

    }


    //粉丝、关注--头部分页
    $(".fans_content .views .tpage a").bind("click", function(){
        var t = $(this),fensi_list_type;
        if(!t.hasClass("diabled")){
            //上一页
            if(t.hasClass("prev")){
                atpage = Number(atpage) - 1;
                //下一页
            }else{
                atpage = Number(atpage) + 1;
            }
            fenSiList(fensi_list_type);
        }
    });
    function fenSiList(fensi_list_type) {
        $.ajax({
            url : masterDomain + '/include/ajax.php?service=info&action=getFenSiList',
            data : {
                user_id : user_id,
                type : fensi_list_type
            },
            dataType : 'json',
            type : 'GET',
            success : function (data) {
                if(data.state == 100){
                    var html = '', list = data.info, len = list.length;
                    totalCount = len;

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
                        var is_shop = '';
                        var vip = '';
                        if(list[i].is_shop){
                            vip = '<i class="vip"></i>'
                            is_shop = '<span class="m_mark mark1">商家</span><span class="m_mark mark2">'+list[i].typename+'</span>'
                        }else{
                            is_shop = '<span class="m_mark mark3">个人</span>'
                        }
                        html += '<li>' +
                            '<a href="'+list[i].url+'">' +
                            '<div class="head_img">' +
                            '<img src="'+list[i].user['photo']+'" alt="">' +
                            vip +
                            '</div>' +
                            '<h3>'+list[i].user['nickname']+'</h3>' +
                            '<div class="box_mark fn-clear">' +
                            is_shop  +
                            '</div>' +
                            '<div class="text_info">' +
                            '<span>信息 <b>'+list[i].info_count+'</b></span><em>|</em>' +
                            '<span>粉丝 <b>'+list[i].fensi_count+'</b></span>' +
                            '</div>' +
                            '<div class="btn">店铺主页</div>' +
                            '</a>' +
                            '</li>';
                    }

                    $(".care_fans ul").html(html);
                    $('.failed').hide();
                    showPageInfo();

                }else{
                    $(".care_fans ul").html("");
                    $(".pagination").hide();

                    $(".views .tpage .atpage").html("<em>0</em>/0");
                    $(".views .tpage .prev").addClass("diabled");
                    $(".views .tpage .next").addClass("diabled");

                    $(".failed").show().find("span").html(data.info);
                }
            },
            error: function(){
                alert("网络错误")
                $(".care_fans ul").html("");
                $(".pagination, .loading").hide();

                $(".views .tpage .atpage").html("<em>0</em>/0");
                $(".views .tpage .prev").addClass("diabled");
                $(".views .tpage .next").addClass("diabled");

                $(".failed").show().find("span").html("网络错误，请重试！");
            }
        })
    }


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
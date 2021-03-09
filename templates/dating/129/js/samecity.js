$(function(){

    HN_Location.init(function(data){
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
          lng = lat = -1;
        }else{
          lng = data.lng;
          lat = data.lat;
        }
    })

    var atpage = 1, pageSize = 20, totalCount = 0, container = $('.member-con');

	// 判断浏览器是否是ie8
     if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.app-con .down .con-box:last-child').css('margin-right','0');
        $('.wx-con .c-box:last-child').css('margin-right','0');
        $('.search .search-con input.submit').css('background','#ff313f');
        $('.filter .member-con .member-list:nth-child(5n)').css('margin-right','0');
        $('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right','0');
     }

	// 筛选
    $('.rank-list .father-li').hover(function(){
        var t = $(this);
        if(!t.hasClass('lock')){
            t.find('.two-list').slideDown();
        }else{
            
        }
    },function(){
        $(this).find('.two-list').hide();
    })

    $('#lock').click(function(){
        $('.desk').show();
        $('.hello-popup').show();
        $('#cancel').click(function(){
            $('.desk').hide();
            $('.hello-popup').hide();
        })
    })
    // 点击下拉选项
    $(".rank-con .two-list a").bind("click", function(){
        var val = $(this).text(), id = $(this).data('id');
        $(this).closest('.father-li').attr('data-id', id).find(".rank-one").html(val + '<img src="'+templets_skin+'images/rank.png" alt="">');
        $(this).closest('.two-list').hide();
        $(this).addClass('curr').siblings().removeClass('curr');
        getList(1);
    });
    // 切换排序方式
    $('.filter ul.smart-list li').click(function(){
        var t = $(this), id = t.data('id');
        if(id == "4"){
            if(lng == 0){
                $.dialog.alert('正在获取位置信息，请稍后');
                return;
            }else if(lng == -1){
                $.dialog.alert('位置获取失败');
                return;
            }
        }
        $(this).addClass('active').siblings().removeClass('active');
        getList(1);
    })
    // 监听切换地址
    setInterval(function(){
        
        if(!$('.city-select-box').length) return;

        if(!$('.city-select-tab .clear').length){
            $('.city-select-tab').append('<span class="clear">清除</span>');
            $('.city-select-tab .clear').click(function(){
                gzAddrSeladdrCurr.attr({'data-id':'','data-ids':'','data-last':''}).text(gzAddrSeladdrCurr.data('title'));
                $('.city-select-box').hide();
                getList(1);
            })
        }
        if(!$('.city-select-box').is(':hidden')){
            return;
        }
        
        var ischange = false;
        $('.addrBtn').each(function(){
            var t = $(this), id = t.attr('data-id'), last = t.attr('data-last');
            if(id){
                if(id != last){
                    ischange = true;
                }
                t.attr('data-last', id);
            }
        })
        if(ischange){
            getList(1);
        }
    }, 200)
    $('.addrBtn')
    // 打招呼
    container.delegate('.hi','click', function(){
        var t = $(this), uid = t.closest('.member-list').attr('data-uid');
        if(t.hasClass('hi-down')) return;
        $.ajax({
            url: masterDomain+'/include/ajax.php?service=dating&action=visitOper&type=3&id='+uid,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data.state == 100){
                    t.removeClass().addClass('hi-down').text('已打招呼');
                }else{
                    $.dialog.alert('操作失败，请重试');
                }
            },
            error: function(){
                $.dialog.alert('网络错误，请重试');
            }
        })
    })
    // 关注
    container.delegate('.follow','click', function(){
        var t = $(this), uid = t.closest('.member-list').attr('data-uid');
        var option = t.hasClass('active') ? 'cancelFollow' : 'visitOper';
        $.ajax({
            url: masterDomain+'/include/ajax.php?service=dating&action='+option+'&type=2&id='+uid,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data.state == 100){
                    if(option == 'visitOper'){
                        t.addClass('active').children('a').text('已关注');
                    }else{
                        t.removeClass('active').children('a').text('关注');
                    }
                }else{
                    $.dialog.alert('操作失败，请重试');
                }
            },
            error: function(){
                $.dialog.alert('网络错误，请重试');
            }
        })
    })

    $('#hello-popup-delete').click(function(){
        $('.desk').hide();
        $('.hello-popup').hide();
    })
    // 发消息弹窗
    container.delegate('.send','click', function(){
        var t = $(this), p = t.closest('.member-list'), name = p.attr('data-name');
        $('.send-popup .name').text(name);
        $('.send-popup .send-con').html('');
        $('.desk').show();
        $('.send-popup').show();
    })
    $('.send-popup .close').click(function(){
        $('.desk').hide();
        $('.send-popup').hide();
    })
    
    //评论
    var loadmore = $("#leave_message .load_more");

    //表情
    var emot = [];
    for (var i = 1; i < 51; i++) {
        var fi = i < 10 ? "0" + i : i;
        emot.push('<li><a href="javascript:;"><img src="images/ui/i_f'+fi+'.png" /></a></li>');
    }

    // 留言板评论展开
    $('body').delegate('.reply_btn i', "click", function(){
        var x = $(this),
            find = x.closest('.reply').find('.comment_box');
        if (find.css("display") == "block") {
            find.hide();
        }else{
            find.show();
        }
        var name = x.closest(".message_txt").find(".mes_first .name").text();
        find.find(".textarea").attr("placeholder", langData['siteConfig'][6][29]+"：" + name).focus();
    })
    var commonChange = function(t){
        var val = t.text(), maxLength = 200;
        var charLength = val.replace(/<[^>]*>|\s/g, "").replace(/&\w{2,4};/g, "a").length;
        var imglength = t.find('img').length;
        var alllength = charLength + imglength;
        var surp = maxLength - charLength - imglength;
        surp = surp <= 0 ? 0 : surp;

        t.closest('.write').find('em').text(surp);

        if(alllength > maxLength){
            t.text(val.substring(0,maxLength));
            return false;
        }
    // if(alllength > 0){
    //   t.closest('.comment_box').find('.com_btn').css('background','#34bdf6')
    // }else{
    //   t.closest('.comment_box').find('.com_btn').css('background','#d4d4d4')
    // }
    }
    $('body').delegate('.txt', "keyup", function(){
        memerySelection = window.getSelection();
        commonChange($(this));
    })


    // 表情盒子打开关闭
    var memerySelection;
    $('body').delegate('.editor', "click", function(){
        var x = $(this),
            find = x.closest('.comment_foot').find('.face_box');
        if (find.css("display") == "block") {
            find.hide();
            x.removeClass('ed_bc');
        }else{
        memerySelection = window.getSelection();
            find.show();
            x.addClass('ed_bc');
            return false;
        }
    })
    // 选择表情
    $('body').delegate('.face_box ul li', "click", function(){
        var t = $(this).find('img'), textarea = t.closest('.comment_box').find('.textarea'), hfTextObj = textarea;
        hfTextObj.focus();
        pasteHtmlAtCaret('<img src="'+t.attr("src")+'" />');
            commonChange(textarea);
            t.closest(".face_box").hide();
      });

     //根据光标位置插入指定内容
    function pasteHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            sel = memerySelection;
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            document.selection.createRange().pasteHTML(html);
        }
    }
     //光标定位到最后
    function set_focus(el){
        el=el[0];
        el.focus();
        if($.browser.msie){
            var rng;
            el.focus();
            rng = document.selection.createRange();
            rng.moveStart('character', -el.innerText.length);
            var text = rng.text;
            for (var i = 0; i < el.innerText.length; i++) {
                if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
                    result = i + 1;
                }
            }
        }else{
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }


    function getList(tr){
        if(tr){
            atpage = 1;
        }
        container.html('<div class="loading">正在获取，请稍后</div>');
        $(".pagination").hide();

        var data = [];
        data.push('page='+atpage);
        data.push('pageSize='+pageSize);
        data.push('keywords='+keywords);

        var order = $('.smart-list li.active').data('id');
        data.push('orderby='+order);
        if(order == "4" && lng >= 0){
            data.push('lng='+lng);
            data.push('lat='+lat);
        }

        $('.addrBtn').each(function(){
            var t = $(this), id = t.attr('data-id');
            id = id == undefined ? '' : id;
            t.parent().attr('data-id', id);
        })
        $('.father-li').not('.lock').each(function(){
            var t = $(this), type = t.data('type'), id = t.attr('data-id');
            if(id != undefined){
                data.push(type+'='+id);
            }
        })

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=memberList',
            type: 'get',
            data: data.join('&'),
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var html = [];
                    totalCount = data.info.pageInfo.totalCount;

                    for(var i = 0; i < data.info.list.length; i++){
                        var d = data.info.list[i];
                        var photo = d.photo ? ('<img src="'+d.photo+'" alt="" />') : ('<img src="' + staticPath + 'images/noPhoto_100.jpg" class="nophoto" alt="" />');
                        html.push('<div class="member-list" data-uid="'+d.id+'" data-name="'+d.nickname+'">');
                        html.push('    <a href="'+d.url+'" target="_blank">'+photo+'</a>');
                        html.push('    <div class="personal-wrap">');
                        html.push('        <div class="person-mess">');
                        html.push('            <p class="personal fn-clear"><a href="javascript:;" class="name">'+d.nickname+'</a><a href="javascript:;" class="page">个人主页</a></p>');
                        html.push('            <div class="message fn-clear">');
                        var has = 0;
                        if(d.age > 0){
                            has = 1;
                            html.push('                <p class="years"><a href="javascript:;">'+d.age+'<span>岁</span></a>&nbsp;&nbsp;</p>');
                        }
                        if(d.heightName){
                            has = 1;
                            html.push('                <p class="cm"><a href="javascript:;">'+d.heightName.replace('cm', '<span>cm</span>')+'</a>&nbsp;&nbsp;&nbsp;&nbsp;</p>');
                        }
                        if(d.marriageName){
                            has = 1;
                            html.push('                <p class="apart"><a href="javascript:;">'+d.marriageName+'</a></p>');
                        }
                        if(has == 0){
                            html.push('<p style="font-size:12px;color:#b3b3b3;line-height:30px;">什么都没填~</p>')
                        }
                        html.push('            </div>');
                        html.push('            <p class="location">'+d.addrName.join(' ')+'</p>');
                        html.push('        </div>');
                        if(d.online){
                            html.push('        <div class="shade high">在线</div>');
                        }else{
                            html.push('        <div class="shade">离线</div>');
                        }
                        html.push('        <div class="hello fn-hide">');
                        html.push('            <div class="say-hi">');
                        if(d.visit){
                            html.push('                <a class="hi-down" href="javascript:;">已打招呼</a>');
                        }else{
                            html.push('                <a class="hi" href="javascript:;">打招呼</a>');
                        }
                        html.push('                <a href="javascript:;" class="send">发消息</a>');
                        html.push('            </div>');
                        if(d.follow){
                            html.push('            <div class="follow active"><a href="javascript:;">已关注</a></div>');
                        }else{
                            html.push('            <div class="follow"><a href="javascript:;">关注</a></div>');
                        }
                        html.push('        </div>');
                        html.push('    </div>');
                        html.push('</div>');
                    }
                    container.html(html.join(""));
                    if(atpage > 1 || tr){
                        $('html,body').animate({scrollTop: $('.filterBox').offset().top}, 300);
                    }
                    showPageInfo();
                }else{
                    container.html('<div class="loading">没有找到符合条件的用户~</div>');
                }
            },
            error: function(){
                container.html('<div class="loading">网络错误，请重试</div>');
            }
        })
    }

    getList();


    // 打印分类
    function showPageInfo() {
        var info = $(".pagination");
        var nowPageNum = atpage;
        var allPageNum = Math.ceil(totalCount / pageSize);
        var pageArr = [];

        info.html("").hide();

        //输入跳转
        // var redirect = document.createElement("div");
        // redirect.className = "pagination-gotopage";
        // redirect.innerHTML =
        //     '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
        // info.append(redirect);

        // //分页跳转
        // info.find(".btn").bind("click", function () {
        //     var pageNum = info.find(".inp").val();
        //     if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
        //         atpage = pageNum;
        //         getList();
        //     } else {
        //         info.find(".inp").focus();
        //     }
        // });

        var pages = document.createElement("div");
        pages.className = "page pagination-pages fn-clear";
        info.append(pages);

        //拼接所有分页
        if (allPageNum > 1) {

            //上一页
            if (nowPageNum > 1) {
                var prev = document.createElement("a");
                prev.className = "prev";
                prev.innerHTML = '上一页';
                prev.onclick = function () {
                    atpage = nowPageNum - 1;
                    getList();
                }
            } else {
                var prev = document.createElement("span");
                prev.className = "prev disabled";
                prev.innerHTML = '上一页';
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
                    } else {
                        if (i <= 2) {
                            continue;
                        } else {
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
                    } else {
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
                next.innerHTML = '下一页';
                next.onclick = function () {
                    atpage = nowPageNum + 1;
                    getList();
                }
            } else {
                var next = document.createElement("span");
                next.className = "next disabled";
                next.innerHTML = '下一页';
            }
            info.find(".pagination-pages").append(next);

            info.show();

        } else {
            info.hide();
        }
    }

})
 
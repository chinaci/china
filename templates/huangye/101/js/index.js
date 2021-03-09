/**
 * Created by Administrator on 2018/5/18.
 */

$(function(){
    //导航条
    var container = $("#container"), isload = false;

    $(".area .t-fi-item li a").bind("click", function(){
        var t = $(this).parent(), index = t.index();
        if(!t.hasClass("curr")){
            t.addClass("curr").siblings("li").removeClass("curr");
            $(".area .t-fi .sub-fi").hide();
            $(".area .t-fi .sub-fi:eq("+index+")").show();
        }else{
            t.removeClass("curr");
            $(".area .t-fi .sub-fi:eq("+index+")").hide();
            $('.area .t-fi-item .all').addClass('curr');
        }
        getList();
    });
    $(".pos-item a").click(function(){
        var index=$(this).index();
        $(this).addClass("curr").siblings().removeClass("curr");
        //$(".tab-content").eq(index).addClass("show").siblings().removeClass("show");
        getList();
    });


    $(".style .t-fi-item li a").bind("click", function(){
        var t = $(this).parent(), index = t.index();
        if(!t.hasClass("curr")){
            t.addClass("curr").siblings("li").removeClass("curr");
            $(".style .t-fi .sub-fi").hide();
            $(".style .t-fi .sub-fi:eq("+index+")").show();
        }else{
            t.removeClass("curr");
            $(".style .t-fi .sub-fi:eq("+index+")").hide();
            $('.style .t-fi-item .all').addClass('curr');
        }
        getList();
    });

    $("#searchform").submit(function(e){
        e.preventDefault();
        getList(1);
    })

    function getList(tr){
        if(isload) return;
        $('.pagination').hide();
        if(tr) atpage = 1;
        container.html('<div class="load">正在加载，请稍后...</div>');
        var addrid = typeid = 0;
        var addrCurr = $('.area .t-fi-item li.curr'),
            addrIndex = addrCurr.index(),
            typeCurr = $('.style .t-fi-item li.curr'),
            typeIndex = typeCurr.index(),
            keywords = $.trim($('.keywords').val());
        if(addrIndex > 0){
            addrid = $(".area .t-fi .sub-fi:eq("+addrIndex+") .pos-item a.curr").attr("data-id");
        }
        if(typeIndex > 0){
            typeid = $(".style .t-fi .sub-fi:eq("+typeIndex+") .pos-item a.curr").attr("data-id");
        }

        isload = true;
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=business&action=blist&page='+atpage+'&pageSize='+pageSize,
            type: 'post',
            data: {addrid:addrid, typeid:typeid, keywords: keywords},
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
                    totalCount = pageInfo.totalCount;
                    if(list.length > 0){
                        for(var i = 0; i < list.length; i++){
                            var d = list[i];
                            html.push('<div class="con-box">');
                            html.push('    <div class="left-con">');
                            html.push('        <a href="'+d.url+'">');
                            html.push('            <img src="'+d.logo+'" >');
                            html.push('        </a>');
                            html.push('    </div>');
                            html.push('    <div class="right-con">');
                            html.push('        <div class="list-title">');
                            html.push('           <a href="'+d.url+'">'+d.title+' <span class="list-style">['+d.typename.join(" ")+']</span></a>');
                            for(var n = 0; n < d.auth.length; n++){
                                html.push('           <span class="state state_'+n+'" title="'+d.auth[n].typename+'">'+d.auth[n].jc+'</span>');
                            }
                            html.push('           <span class="_time">'+huoniao.transTimes(d.pubdate, 2)+'</span>');
                            html.push('        </div>');
                            html.push('        <p><i class="hy-address"></i>'+d.address);
                            if(d.weixinQr){
                                html.push('            <span class="hy-code"><i></i>');
                                html.push('                <span class="hn-code">');
                                html.push('                    <img src="'+d.weixinQr+'">');
                                html.push('                </span>');
                                html.push('            </span>');
                            }
                            html.push('        </p>');
                            html.push('        <p><i class="hy-phone"></i>'+d.tel+'</p>');
                            html.push('        <p><i class="hy-email"></i>'+d.email+'</p>');
                            html.push('    </div>');
                            html.push('</div>');
                        }
                        container.html(html.join(""));
                    }else{
                        $('.load').html(atpage == 1 ? '暂无相关信息！' : '已加载全部信息');
                    }
                    isload = false;
                    showPageInfo();
                }else{
                    isload = false;
                    $('.load').html(atpage == 1 ? '暂无相关信息！' : '已加载全部信息');
                }
            },
            error: function(){
                isload = false;
                $('.load').html('网络错误，请重试！');
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

        var pageList = [];
        //上一页
        if(atpage > 1){
            pageList.push('<a href="javascript:;" class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></a>');
        }else{
            pageList.push('<span class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></span>');
        }

        //下一页
        if(atpage >= allPageNum){
            pageList.push('<span class="pg-next"><span class="text">下一页</span><i class="trigger"></i></span>');
        }else{
            pageList.push('<a href="javascript:;" class="pg-next"><span class="text">下一页</span><i class="trigger"></i></a>');
        }

        //页码统计
        pageList.push('<span class="sum"><em>'+atpage+'</em>/'+allPageNum+'</span>');

        $("#bar-area .pagination").html(pageList.join(""));

        var pages = document.createElement("div");
        pages.className = "pagination-pages fn-clear";
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
                info.find(".pagination-pages").append(prev);
            }

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
                next.innerHTML = '下一页';
                next.onclick = function () {
                    atpage = nowPageNum + 1;
                    getList();
                }
                info.find(".pagination-pages").append(next);
            }

            //输入跳转
            var insertNum = Number(nowPageNum + 1);
            if (insertNum >= Number(allPageNum)) {
                insertNum = Number(allPageNum);
            }
            
            var redirect = document.createElement("div");
            redirect.className = "redirect";
            redirect.innerHTML = '<i>到</i><input id="prependedInput" type="number" placeholder="页码" min="1" max="'+allPageNum+'" maxlength="4"><i>页</i><button type="button" id="pageSubmit">确定</button>';
            info.find(".pagination-pages").append(redirect);

            //分页跳转
            info.find("#pageSubmit").bind("click", function(){
                var pageNum = $("#prependedInput").val();
                if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
                    atpage = Number(pageNum);
                    getList();
                } else {
                    $("#prependedInput").focus();
                }
            });
                        
            info.show();

        }else{          
            info.hide();
        }
    }

    showPageInfo();
});


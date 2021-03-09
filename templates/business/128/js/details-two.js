$(function(){
    //国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'JSONP',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
                   }
                   $('.areaCode_wrap ul').append(phoneList.join(''));
                }else{
                   $('.areaCode_wrap ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                        $('.areaCode_wrap ul').html('<div class="loading">加载失败！</div>');
                    }

        })
    }
    //显示区号
    $('.areaCode').bind('click', function(e){

        var areaWrap =$('.areaCode_wrap');
        if(areaWrap.is(':visible')){
            areaWrap.fadeOut(300)
        }else{
            areaWrap.fadeIn(300);
           return false; 
        }

        
    });

    //选择区号
    $('.areaCode_wrap').delegate('li', 'click', function(){
        var t = $(this), code = t.attr('data-code');
        $('.areaCode i').html('+' + code);
        $('#areaCode').val(code);
    });

    $('body').bind('click', function(){
        $('.areaCode_wrap').fadeOut(300);
    });
    // 播放视屏
    $('.view-content .view-item').click(function(){
        var t = $(this), url = t.attr('data-src'), title = t.attr('data-title');
        if(url!=undefined){
            $('.playdalog iframe').attr('src',url);
            $('.playdalog .title').html(title);
            $('.playdalog').show();
        }
    });

    $('.playdalog>div .close').click(function(){
        $('.playdalog').hide();
        $('.playdalog iframe').attr('src',0);

    });

    $('.storename').click(function(){
        if($('.code-con').hasClass('fn-hide')){
            alert('请在手机端使用');
        }
        $('.code-con').removeClass('fn-hide');
    });

    $(document).bind('click', function(e) {
        var target = $(e.target);
        if(target.is('.storename')){
            $('.code-con').removeClass('fn-hide');
        }else{
            $('.code-con').addClass('fn-hide');
        }
    });

    

    // 显示全景
    $('.overall .content .shop-item').click(function(){
        $('.playdalog').show();
    });

    $('.playdalog>div .close').click(function(){
        $('.playdalog').hide();
        $('.playdalog iframe').attr('src',0);
    });

	if($.browser.msie && parseInt($.browser.version) >= 8){
		$('.goods-list .goods-con .goods-item:nth-child(4n)').css('margin-right','0');
		$('.position .position-list:nth-child(2n)').css('margin-right','0');
		$('.content-right .seller-list:last-child').css('border-bottom','0');
		$('.fix-con .fix .common .text .qq:last-child').css('border-right','0');
	}
	// 收藏
	$('.shop-wrap .shop-left .shop-brief .way .collect').click(function(){
        var t = $(this), type = t.hasClass("click") ? "del" : "add";
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          location.href = masterDomain + '/login.html';
          return false;
        }
        if(type == 'add'){
            t.addClass('click').html('<img src="'+templets_skin+'images/details-two20.png" alt="">已收藏店铺');
        }else{
            t.removeClass('click').html('<img src="'+templets_skin+'images/details-two9.png" alt="">收藏店铺');
        }
        $.post("/include/ajax.php?service=member&action=collect&module=business&temp=detail&type="+type+'&id='+id);
    })
    
    // 视屏全景切换
    $('.overall .view-title span').click(function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        var  i = $(this).index();
        if(i==1){
            $('.vrorvideo a').attr('href',videoUrl);
        }else if(i==2){
            $('.vrorvideo a').attr('href',albumsUrl);
        }else{
            $('.vrorvideo a').attr('href',vrUrl);
        }
        $('.overall .shop-view  .content').eq(i).addClass('show').siblings().removeClass('show');
    });
    $('.appMapImg').attr('src', typeof MapImg_URL != "undefined" ? MapImg_URL : "");

	//大图切换
	$(".shop-right").slide({ titCell:".smallImg li", mainCell:".bigImg", effect:"fold", autoPlay:true,delayTime:200});
	//小图左滚动切换
	$(".smallScroll").slide({ mainCell:"ul",delayTime:100,vis:3,scroll:3,effect:"left",autoPage:true,prevCell:".sPrev",nextCell:".sNext",pnLoop:false });		
	// 商品列表查看更多
	var item = $('.goods-list .goods-con .goods-item').length;
	if (item >= 8) {
		$('.goods-list .see-more').show();
	}
	// $('.goods-list .see-more a').click(function(){
	// 	$('.goods-list .goods-con').addClass('show');
	// 	if ($('.goods-list .goods-con').hasClass('show')) {
	// 		$('.goods-list .see-more').hide();
	// 	}
	// })
	// 招聘职位查看更多
	var list = $('.position .position-list').length;
	if (list >= 6) {
		$('.position .see-more').show();
	}
	// $('.position .see-more a').click(function(){
	// 	$('.position .position-con').addClass('show');
	// 	if ($('.position .position-con').hasClass('show')) {
	// 		$('.position .see-more').hide();
	// 	}
	// })
    // 发布房源查看更多
    var salehouse = $('.salehouse .house-list').length;
    if(salehouse >= 8){
        $('.salehouse').siblings('.see-more').show();
    }
    var renthouse = $('.renthouse .house-list').length;
    if(renthouse >= 8){
        $('.renthouse').siblings('.see-more').show();
    }
	
	// $('.house-source .see-more a').click(function(){
	// 	$('.house-source .house-con').addClass('show');
	// 	if ($('.house-source .house-con').hasClass('show')) {
	// 		$('.house-source .see-more').hide();
	// 	}
	// })
	// 二手房、租房切换
    $('.house-source .view-title .house-tab li').click(function(){
    	$(this).addClass('active').siblings().removeClass('active');
    	var i = $(this).index();
    	$('.house-box-wrap .house-box').eq(i).addClass('show').siblings().removeClass('show');
    })
    // 商家团购查看更多
	var group = $('.group-buy .group-list').length;
	if (group >= 2) {
		$('.group-buy .see-more').show();
	}
	// $('.group-buy .see-more a').click(function(){
	// 	$('.group-buy .group-con').addClass('show');
	// 	if ($('.group-buy .group-con').hasClass('show')) {
	// 		$('.group-buy .see-more').hide();
	// 	}
	// })
	// 促销活动
	$(".txtMarquee-top").slide({mainCell:".bd ul",autoPlay:true,effect:"topMarquee",vis:5,interTime:50});
    // 促销活动弹窗
    /*if($('#newstotal').val()>5){
        $('.activity .activity-scroll .infoList li').click(function(e){
            e.preventDefault();
            $('.activity-popup').show();
            $('.desk').show();
            $('.activity-popup .act-title .close').click(function(){
                $('.activity-popup').hide();
                $('.desk').hide();
            })
        })
    }*/
    var atpage = 1, pageSize=15;

    //getNews();

    function getNews(){
        
        $(".act-con ul").html("");

        $.ajax({
            url: masterDomain+"/include/ajax.php?service=business&action=news_list",
            type: "POST",
            data: {
                "uid": id,
                "page": atpage,
                "pageSize" : pageSize
            },
            dataType: "json",
            success: function(data){
                if(data.state == 100){
                    var list = data.info.list, html = [], pageInfo = data.info.pageInfo;
                    totalCount = pageInfo.totalCount;
                    var tpage = Math.ceil(totalCount/pageSize);

                    for(var i = 0; i < list.length; i++){
                        var className = '';
                        if(i%3==0 && i%5>0){
                            className = 'red';
                        }else if(i%5==0 && i%3>0){
                            className = 'blue';
                        }
                        var stime = huoniao.transTimes(list[i].pubdate, 3);
                        stime = stime.replace('-','.');
                        
                        html.push('<li class="fn-clear"><a target="_blank" href="'+list[i]['url']+'"><em>• </em><p class="'+className+'">'+list[i]['title']+'</p><span>'+stime+'</span></a></li>');
                    }
                    $(".act-con ul").html(html.join(""));

                    showPageInfo();
                }else{
                    $(".act-con ul").html('<div class="empty">该商家未发布动态</div>');
                }
            }
        })

    }

    //打印分页
	function showPageInfo() {
	    var info = $(".page");
	    var nowPageNum = atpage;
	    var allPageNum = Math.ceil(totalCount/pageSize);
	    var pageArr = [];

	    info.html("").hide();

	    //拼接所有分页
	    if (allPageNum > 1) {

	        //上一页
	        if (nowPageNum > 1) {
	            var prev = document.createElement("a");
	            prev.className = "prev";
	            prev.innerHTML = '上一页';
	            prev.onclick = function () {
	                atpage = nowPageNum - 1;
	                getNews();
	            }
	        } else {
	            var prev = document.createElement("a");
	            prev.className = "prev disabled";
	            prev.innerHTML = '上一页';
	        }
	        info.append(prev);

	        //分页列表
	        if (allPageNum - 2 < 1) {
	            for (var i = 1; i <= allPageNum; i++) {
	                if (nowPageNum == i) {
	                    var page = document.createElement("a");
	                    page.className = "active";
	                    page.innerHTML = i;
	                } else {
	                    var page = document.createElement("a");
	                    page.innerHTML = i;
	                    page.onclick = function () {
	                        atpage = Number($(this).text());
	                        getNews();
	                    }
	                }
	                info.append(page);
	            }
	        } else {
	            for (var i = 1; i <= 2; i++) {
	                if (nowPageNum == i) {
	                    var page = document.createElement("a");
	                    page.className = "active";
	                    page.innerHTML = i;
	                }
	                else {
	                    var page = document.createElement("a");
	                    page.innerHTML = i;
	                    page.onclick = function () {
	                        atpage = Number($(this).text());
	                        getNews();
	                    }
	                }
	                info.append(page);
	            }
	            var addNum = nowPageNum - 4;
	            if (addNum > 0) {
	                var em = document.createElement("a");
	                em.className = "interim";
	                em.innerHTML = "...";
	                info.append(em);
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
	                            var page = document.createElement("a");
	                            page.className = "active";
	                            page.innerHTML = i;
	                        }
	                        else {
	                            var page = document.createElement("a");
	                            page.innerHTML = i;
	                            page.onclick = function () {
	                                atpage = Number($(this).text());
	                                getNews();
	                            }
	                        }
	                        info.append(page);
	                    }
	                }
	            }
	            var addNum = nowPageNum + 2;
	            if (addNum < allPageNum - 1) {
	                var em = document.createElement("a");
	                em.className = "interim";
	                em.innerHTML = "...";
	                info.append(em);
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
	                        getNews();
	                    }
	                    info.append(page);
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
	                getNews();
	            }
	        } else {
	            var next = document.createElement("a");
	            next.className = "next disabled";
	            next.innerHTML = '下一页';
	        }
	        info.append(next);

	        info.show();

	    }else{
	        info.hide();
	    }
    }
    
	// 发送到手机弹窗
	$('.shop-wrap .shop-left .shop-brief .tel').click(function(){
		$('.desk').show();
		$('.phone-popup').show();
		$('.phone-popup .phone-title img').click(function(){
			$('.phone-popup').hide();
			$('.desk').hide();
		})
	})
	$('.phone-popup .send-phone .sending').click(function(){
		var tel = $('.phone-popup .tel-num input').val();
		if (tel == '') {
            alert('请输入手机号码！');
            return false;
        }
        $.ajax({
            url: "/include/ajax.php?service=business&action=sendBusiness&id="+id+"&phone="+tel,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    alert('发送成功');
                    $(".phone-popup").hide();
                    $('.desk').hide();
                }else{
                    alert(data.info);
                }
            }
        });
	})
	// 地图弹窗
	$('.location img, .content-right .map img').click(function(){
		$('.desk').show();
		$('.map-popup').show();
		$('.map-popup .close img').click(function(){
            $('.desk').hide();
            $('.map-popup').hide();
        })
	})

	var commentObj = $("#commentList");
    //评论登录
    $(".comment").delegate(".login", "click", function(){
        if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
            $("html, body").scrollTop(0);
        }
        huoniao.login();
    });


    //评论筛选【时间、热度】
    $(".c-orderby a").bind("click", function(){
        if(!$(this).hasClass("active")){
            $(".c-orderby a").removeClass("active");
            $(this).addClass("active");

            commentObj.attr("data-page", 1).html('<div class="loading"></div>');
            $("#loadMore").removeClass().hide();

            loadComment();
        }
    });

    //加载评论
    function loadComment(){
        if(id && id != undefined){
            var page = commentObj.attr("data-page");
            var orderby = $(".c-orderby .active").attr('data-id');
            //异步获取用户信息
            $.ajax({
                url: "/include/ajax.php?service=member&action=getComment&type=business&pageSize=4&son=1&aid="+id+"&page="+page+"&orderby="+orderby,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){

                        if(commentObj.find("li").length > 0){
                            commentObj.append(getCommentList(data.info.list));
                        }else{
                            commentObj.html(getCommentList(data.info.list));
                        }

                        page = commentObj.attr("data-page", (Number(page)+1));

                        var pageInfo = data.info.pageInfo;
                        if(Number(pageInfo.page) < Number(pageInfo.totalPage)){
                            $("#loadMore").removeClass().show();
                        }else{
                            $("#loadMore").removeClass().hide();
                        }
                        $('#count').text(pageInfo.totalCountAll);

                    }else{
                        if(commentObj.find("li").length <= 0){
                            commentObj.html("<div class='empty'>暂无相关评论</div>");
                            $("#loadMore").removeClass().hide();
                        }
                    }
                },
                error: function(){
                    if(commentObj.find("li").length <= 0){
                        commentObj.html("<div class='empty'>暂无相关评论</div>");
                        $("#loadMore").removeClass().hide();
                    }
                }
            });
        }else{
            commentObj.html("Error!");
        }
    }

    //加载子评论
    function getChildComment(cid,obj){
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=member&action=getChildComment&pid='+cid+'&page=1&pageSize=5',
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var list = data.info.list;
                    var pageInfo = data.info.pageInfo;
                    var html = [];
                    //var html = getCommentList(data.info.list);
                    //$('#children'+obj).html(html);
                    //$('#reply'+obj).html(list.length);
                }
            }
        });
    }

    //拼接评论列表
    function getCommentList(list){
        var html = [];
        for(var i = 0; i < list.length; i++){
            html.push('<li class="fn-clear" data-id="'+list[i]['id']+'">');

            var photo = list[i].user['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(list[i].user['photo'], "small");

            html.push('  <img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" data-uid="'+list[i].user['userid']+'" src="'+photo+'" alt="'+list[i].user['nickname']+'">');
            html.push('  <div class="c-body">');
            html.push('    <div class="c-header">');
            html.push('      <a href="javascript:;" class="colorAnimate"  data-id="'+list[i].user['userid']+'">'+list[i].user['nickname']+'</a>');
            html.push('      <span>'+huoniao.transTimes(list[i].dtime, 2).replace(/-/g, '.')+'</span>');
            html.push('    </div>');
            html.push('    <p>'+list[i]['content']+'</p>');
            html.push('    <div class="c-footer">');

            var praise = "praise";
            if(list[i]['already'] == 1){
                praise = "praise active";
            }
            html.push('      <a href="javascript:;" class="'+praise+'"><s></s>(<em>'+list[i]['zan']+'</em>)</a>');
            if(list[i]['lower'] != null && list[i]['lower']['list'] != null){
                html.push('      <a href="javascript:;" class="reply"><s></s>回复(<em>'+(list[i]['lower']['count'])+'</em>)</a>');
            }else{
                html.push('      <a href="javascript:;" class="reply"><s></s>回复(<em>'+(0)+'</em>)</a>');
            }
            //html.push('      <a href="javascript:;" class="reply"><s></s>回复(<em>'+(0)+'</em>)</a>');
            html.push('    </div>');
            html.push('  </div>');
            
            if(list[i]['lower'] != null){
                if(list[i]['lower']['list'] != null){
                    html.push('  <ul class="children">');
                    html.push(getCommentList(list[i]['lower']['list']));
                    html.push('  </ul>');
                }
            }
            html.push('</li>');
        }
        return html.join("");
    }

    loadComment();

    //加载更多评论
    $("#loadMore").bind("click", function(){
        $(this).addClass("loading");
        loadComment();
    });
    //顶
    commentObj.delegate(".praise", "click", function(){
        var t = $(this), id = t.closest("li").attr("data-id");
        if(t.hasClass("active")) return false;
        if(id != "" && id != undefined){
            $.ajax({
                url: "/include/ajax.php?service=member&action=dingComment&type=add&id="+id,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    var ncount = Number(t.text().replace("(", "").replace(")", ""));
                    t.addClass("active").html('<s></s>(<em>'+(ncount+1)+'</em>)');

                    //加1效果
                    var $i = $("<b>").text("+1");
                    var x = t.offset().left, y = t.offset().top;
                    $i.css({top: y - 10, left: x + 17, position: "absolute", color: "#E94F06"});
                    $("body").append($i);
                    $i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
                        $i.remove();
                    });

                }
            });
        }
    });
    //评论回复
    commentObj.delegate(".reply", "click", function(){
        var carea = commentObj.find(".c-area");
        if(carea.html() != "" && carea.html() != undefined){
            carea.stop().slideUp("fast");
            commentObj.find(".reply").removeClass("active");
        }

        var areaObj = $(this).closest(".c-body"), replaytemp = $("#replaytemp").html();
        if(areaObj.find(".c-area").html() == "" || areaObj.find(".c-area").html() == undefined){
            areaObj.append(replaytemp);
            clearContenteditableFormat(areaObj.find(".c-area .textarea"));
        }
        areaObj.find(".c-area").stop().slideToggle("fast");

    });
     //提交评论回复
    $(".comment").delegate(".subtn", "click", function(){
        var t = $(this), cid = t.closest("li").attr("data-id");

        if(t.hasClass("login") || t.hasClass("loading")) return false;

        var contentObj = t.closest(".c-area").find(".textarea"),
            content = contentObj.html();

        if(content == ""){
            alert("请填写评论内容");
            return false;
        }
        if(huoniao.getStrLength(content) > 200){
            alert("超过200个字了！");
            return false;
        }

        cid = cid == undefined ? 0 : cid;

        var url = '';
        if(!isNaN(cid)&&cid>0){
            url = '/include/ajax.php?service=member&action=replyComment&type=business&check=1&sco1=1&id=' + cid;
        }else{
            url = '/include/ajax.php?service=member&action=sendComment&type=business&check=1&sco1=1&aid=' + id;
        }

        t.addClass("loading");

        $.ajax({
            url: url,
            data: "content="+content,
            type: "POST",
            dataType: "json",
            success: function (data) {
                t.removeClass("loading");
                contentObj.html("");
                if(data && data.state == 100){

                    var info = data.info;
                    var list = [];

                    var photo = info.userinfo['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(info.userinfo['photo'], "small");

                    list.push('<li class="fn-clear colorAnimate" data-id="'+info['id']+'">');
                    list.push('  <img data-uid="'+info.userinfo['userid']+'" src="'+photo+'" alt="'+info.userinfo['nickname']+'">');
                    list.push('  <div class="c-body">');
                    list.push('    <div class="c-header">');
                    list.push('      <a href="javascript:;" class="colorAnimate"  data-id="'+info.userinfo['userid']+'">'+info.userinfo['nickname']+'</a>');
                    list.push('      <span>'+info['ftime']+'</span>');
                    list.push('    </div>');
                    list.push('    <p>'+info['content']+'</p>');
                    list.push('    <div class="c-footer">');
                    list.push('      <a href="javascript:;" class="praise"><s></s>(<em>'+info['zan']+'</em>)</a>');
                    list.push('      <a href="javascript:;" class="reply">回复(<em>'+(info['lower'] ? info['lower'].length : 0)+'</em>)</a>');
                    list.push('    </div>');
                    list.push('  </div>');
                    list.push('</li>');

                    //一级评论
                    if(contentObj.attr("data-type") == "parent"){
                        if(commentObj.find("li").length <= 0){
                            commentObj.html("");
                            $("#loadMore").removeClass().hide();
                        }

                        commentObj.prepend(list.join(""));

                        //子级
                    }else{
                        t.closest(".c-area").hide();

                        var children = t.closest("li").find(".children");
                        //判断子级是否存在
                        if(children.html() == "" || children.html() == undefined){
                            t.closest("li").append('<ul class="children"></ul>');
                        }

                        t.closest("li").find("ul.children").prepend(list.join(""));
                    }

                }
            }
        });

    });


})
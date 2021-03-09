$(function(){
	$("#qrcode").qrcode({
		render: window.applicationCache ? "canvas" : "table",
		width: 114,
		height: 114,
		text: huoniao.toUtf8(window.location.href)
	});



	//手机看
	$(".btnLook").hover(function(){
		$(this).find(".qrcode").show();
	}, function(){
		$(this).find(".qrcode").hide();
	});
    // hover 出现收藏
    $('.recom_main').find('.recom_box').hover(function() {
        $(this).find('.box_collect').css("display","block");
    },function(){
        $(this).find('.box_collect').css("display","none");
    });
    $('.recom_box').delegate('.box_collect', 'click', function(event) {
        var t = $(this), type = t.hasClass("collected") ? "del" : "add";
        if(type == 'add'){
            // 收藏成功
            t.addClass('collected');
        }else{
            t.removeClass('collected');
        }
    });
	// 收藏
	$('.btn_box').delegate('.btnSc', 'click', function(event) {
		var t = $(this), type = t.hasClass("btnYsc") ? "del" : "add";
        $.ajax({
            url : "/include/ajax.php?service=member&action=collect",
            data : {
                'type' : type,
                'module' : 'info',
                'temp' : 'detail',
                'id' : id,
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.info == 'has'){
                    alert("您已收藏");
                }else if(data.info == 'ok'){
                    if(type == 'add'){
                        // 收藏成功
                        t.addClass('btnYsc').html('<i></i>已收藏');
                    }else{
                        t.removeClass('btnYsc').html('<i></i>收藏');;
                    }
                }else{
                    alert("收藏失败，请登录~");
                }
            }
        })

	});
	// 下拉详情
	$('.perHead,.perInfo h3').hover(function(){
		$('.perIntro').show();
	},function(){
		$('.perIntro').hide();
	});

    // 信息举报
    var complain = null;
    $(".btnJb").bind("click", function(){

        var domainUrl = masterDomain;
        complain = $.dialog({
            fixed: true,
            title: "信息举报",
            content: 'url:'+domainUrl+'/complain-info-detail-'+id+'.html',
            width: 460,
            height: 300
        });
    });

	// 收藏店铺
	$('.pbtn_box').delegate('.btn_coll', 'click', function(event) {
		var t = $(this), type = t.hasClass("collected") ? "0" : "1", is_shop = t.attr("data-type");

        $.ajax({
            url : masterDomain + "/include/ajax.php?service=info&action=follow&vid=" + user_id + '&type=' + type + '&temp=info',
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(is_shop == 1){
                        if(type == '1'){
                            // 收藏成功
                            t.addClass('collected').html('<i></i>收藏成功');
                        }else{
                            t.removeClass('collected').html('<i></i>收藏店铺');;
                        }
                    }else{
                        if(type == '1'){
                            // 收藏成功
                            t.addClass('collected').html('<i></i>已关注');
                        }else{
                            t.removeClass('collected').html('<i></i>关注');;
                        }
                    }


                }else{
                    alert(data.info);
                    window.location.href = masterDomain + '/login.html';

                }
            }
        })


	});

    // 微信悬浮层弹出
    $('.a_wechat,.bcontact_wx').on('click',function(){
        $('html').addClass('nos');
        $('.modal-wx').addClass('curr');
        
    });
     // 关闭
    $(".modal-bg,.closebox").on("click",function(){
        $("html, .modal-wx").removeClass('curr nos');
    })

    if($('#my-video').size() > 0){
        var myPlayer = videojs('my-video');
        videojs("my-video").ready(function(){
            var myPlayer = this;
        });
    }

    $('.video_icon').bind('click', function(){
        $('.popupVideo').show();
        $(".popupVideo video")[0].play();
    });
    $('.popupVideo .close').bind('click', function(){
        $('.popupVideo').hide();
        $(".popupVideo video")[0].pause();
    });


	//大图切换
	$("#d_slide").slide({
		titCell: ".plist li",
		mainCell: ".album",
		effect: "fold",
		autoPlay: true,
		delayTime: 500,
		switchLoad: "_src",
		startFun: function(i, p) {
			if (i == 0) {
				$(".sprev").click()
			} else if (i % 4 == 0) {
				$(".snext").click()
			}
    }
	});

	//小图左滚动切换
	$("#d_slide .thumb").slide({
		mainCell: "ul",
		delayTime: 300,
		vis: 4,
		scroll: 4,
		effect: "left",
		autoPage: true,
		prevCell: ".sprev",
		nextCell: ".snext",
		pnLoop: false
	});

	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		if(screenwidth < criticalPoint){
			$("#d_slide .tempWrap").css({'width': '516px'});
			$(".album li").css({'width': '516px'});
			$(".album").css({'width': '516px'});
		}else{
			$("#d_slide .tempWrap").css({'width': '716px'});
			$(".album li").css({'width': '716px'});
			$(".album").css({'width': '716px'});
		}
	});

	$(".sortbar .tabs li").bind("click", function(){
		var t = $(this), i = t.index();
		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
			$('.det_info').eq(i).addClass('dshow').siblings().removeClass('dshow');
		}
	});

	// 电话悬浮
	$('.recom_box').find('.telphone').hover(function() {
		$(this).next('.c_telphone').css("display","block");
	},function(){
		$(this).next('.c_telphone').css("display","none");
	});


 	// ----评论------
	var commentObj = $("#commentList");

    //评论登录
    $(".comment").delegate(".login", "click", function(){
        if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
            $("html, body").scrollTop(0);
        }
        huoniao.login();
    });
    
    loadComment();

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
                url: "/include/ajax.php?service=member&action=getComment&type=info-detail&son=1&aid="+id+"&page="+page+"&orderby="+orderby,
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
            html.push('      <span>'+list[i]['ftime']+'</span>');
            html.push('    </div>');
            html.push('    <p>'+list[i]['content']+'</p>');
            html.push('    <div class="c-footer">');

            var praise = "praise";
            if(list[i]['zan_has'] == 1){
                praise = "praise active";
            }
            html.push('      <a href="javascript:;" class="'+praise+'"><s></s>(<em>'+list[i]['zan']+'</em>)</a>');
            
            html.push('      <a href="javascript:;" class="reply"><s></s>回复(<em>'+(list[i]['lower']!=undefined && list[i]['lower'].count ? list[i]['lower'].count : 0)+'</em>)</a>');
            html.push('    </div>');
            html.push('  </div>');
            if(list[i]['lower']!=undefined && list[i]['lower'].count > 0 && list[i]['lower'].list!=null){
                html.push('  <ul class="children">');
                html.push(getCommentList(list[i]['lower']['list']));
                html.push('  </ul>');
            }
            html.push('</li>');
        }
        return html.join("");
    }


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
                dataType: "json",
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
            return false;
        }
        if(huoniao.getStrLength(content) > 200){
            alert("超过200个字了！");
        }

        if(cid == undefined){
            var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=info-detail&aid=' + id;
        }else{
            var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + cid;
        }
        cid = cid == undefined ? 0 : cid;
        

        t.addClass("loading");

        $.ajax({
            url: url,
            data: "content="+content,
            type: "POST",
            dataType: "json",
            success: function (data) {
                console.log(data)
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
                    list.push('      <a href="javascript:;" class="reply">回复(<em>'+(info['lower']!=undefined && info['lower'].count ? info['lower'].count : 0)+'</em>)</a>');
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




    //
    // $(".btnSc").click(function () {
    //     $.ajax({
    //         url : "/include/ajax.php?service=member&action=collect",
    //         data : {
    //             'type' : type,
    //             'module' : 'info',
    //             'temp' : coll_type,
    //             'id' : detail_id,
    //         },
    //         type : 'get',
    //         dataType : 'json',
    //         success : function (data) {
    //             if(data.state == 100){
    //                 if(data.info == 'has'){
    //                     alert("您已收藏");
    //                 }else if(data.info == 'ok'){
    //                     if(type == 'del'){
    //                         t.removeClass('collected');
    //                     }else{
    //                         t.addClass('collected');
    //                     }
    //                 }
    //             }else{
    //                 alert("请登录！");
    //                 window.location.href = masterDomain + '/login.html';
    //             }
    //         }
    //     })
    // })


})
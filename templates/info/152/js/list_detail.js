$(function(){

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

     //相册图片放大
    $('.img_list').viewer({
        url: 'data-original',
    });
// 信息举报
    var complain = null;
    $(".report").bind("click", function(){

        var domainUrl = masterDomain;
        complain = $.dialog({
            fixed: true,
            title: "信息举报",
            content: 'url:'+domainUrl+'/complain-info-detail-'+id+'.html',
            width: 460,
            height: 300
        });
    });

    //收藏
    $(".store-btn").bind("click", function(){
        var t = $(this), type = "add", oper = "+1", txt = "已收藏";

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            huoniao.login();
            return false;
        }

        if(!t.hasClass("curr")){
            t.addClass("curr");
        }else{
            type = "del";
            t.removeClass("curr");
            oper = "-1";
            txt = "收藏";
        }

        var $i = $("<b>").text(oper);
        var x = t.offset().left, y = t.offset().top;
        $i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#E94F06"});
        $("body").append($i);
        $i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
            $i.remove();
        });

        t.children('button').html("<em></em><span>"+txt+"</span>");

        $.post("/include/ajax.php?service=member&action=collect&module=info&temp=detail&type="+type+"&id="+id);

    });
    /**
     * 文本框根据输入内容自适应高度
     * @param                {HTMLElement}        输入框元素
     * @param                {Number}                设置光标与输入框保持的距离(默认0)
     * @param                {Number}                设置最大高度(可选)
     */
    var autoTextarea = function (elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                    addEvent = function (type, callback) {
                            elem.addEventListener ?
                                    elem.addEventListener(type, callback, false) :
                                    elem.attachEvent('on' + type, callback);
                    },
                    getStyle = elem.currentStyle ? function (name) {
                            var val = elem.currentStyle[name];

                            if (name === 'height' && val.search(/px/i) !== 1) {
                                    var rect = elem.getBoundingClientRect();
                                    return rect.bottom - rect.top -
                                            parseFloat(getStyle('paddingTop')) -
                                            parseFloat(getStyle('paddingBottom')) + 'px';
                            };

                            return val;
                    } : function (name) {
                                    return getComputedStyle(elem, null)[name];
                    },
                    minHeight = parseFloat(getStyle('height'));


            elem.style.resize = 'none';

            var change = function () {
                    var scrollTop, height,
                            padding = 0,
                            style = elem.style;

                    if (elem._length === elem.value.length) return;
                    elem._length = elem.value.length;

                    if (!isFirefox && !isOpera) {
                            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                    };
                    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    elem.style.height = minHeight + 'px';
                    if (elem.scrollHeight > minHeight) {
                            if (maxHeight && elem.scrollHeight > maxHeight) {
                                    height = maxHeight - padding;
                                    style.overflowY = 'auto';
                            } else {
                                    height = elem.scrollHeight - padding;
                                    style.overflowY = 'hidden';
                            };
                            style.height = height + extra + 'px';
                            scrollTop += parseInt(style.height) - elem.currHeight;
                            document.body.scrollTop = scrollTop;
                            document.documentElement.scrollTop = scrollTop;
                            elem.currHeight = parseInt(style.height);
                    };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
    };
    var text = document.getElementById("textarea");
    autoTextarea(text);// 调用


    // 导航栏置顶
    var Ggoffset = $('.list-lead').offset().top - 140;
    $(window).bind("scroll",function(){
        var d = $(document).scrollTop();
        if(Ggoffset < d){
                $('.list-lead').addClass('fixed');
        }else{
            $('.list-lead').removeClass('fixed');
        }
    });

    var isClick = 0;
    //左侧导航点击
    $(".list-lead a").bind("click", function(){
        isClick = 1; //关闭滚动监听
        var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $(".con-tit:eq("+index+")").offset().top - 200;
        parent.addClass("current").siblings("li").removeClass("current");
        $('html, body').animate({
            scrollTop: theadTop
        }, 300, function(){
            isClick = 0; //开启滚动监听
        });
    });
    //滚动监听
    $(window).scroll(function() {
        if(isClick) return false;
        var scroH = $(this).scrollTop();
        var theadLength = $(".con-tit").length;
        $(".list-lead li").removeClass("current");

        $(".con-tit").each(function(index, element) {
            var offsetTop = $(this).offset().top;
            if (index != theadLength - 1) {
                var offsetNextTop = $(".con-tit:eq(" + (index + 1) + ")").offset().top - 260;
                if (scroH < offsetNextTop) {
                    $(".list-lead li:eq(" + index + ")").addClass("current");
                    return false;
                }
            } else {
                $(".list-lead li:last").addClass("current");
                return false;
            }
        });
    });


    //发表评论
    var rid = 0, uid = 0; uname = "";
    $("#rtj").bind("click", function(){
        var t = $(this), content = $(".writ textarea");
        rid = 0;
        sendReply(t, content);
    });

    var businessUrl = $("#replyList").data("url");

    function sendReply(t, content){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            huoniao.login();
            return false;
        }
		
		var url,data;
			if(rid == 0){
				url = '/include/ajax.php?service=member&action=sendComment&type=info-detail&&check=1';
				data = "aid="+id+"&content="+encodeURIComponent(content.val())
			}else{
				replyid = t.parents('li').attr('data-id')
				url = '/include/ajax.php?service=member&action=replyComment&check=1';
				data = "id="+replyid+"&content="+encodeURIComponent(content.val())
				
			}
        if(!t.hasClass("disabled") && $.trim(content.val()) != ""){
            t.addClass("disabled");

            $.ajax({
                url: url,
                data: data,
                type: "POST",
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){

                        var info = data.info;
                        content.val("");

                        //一级评论
                        if(rid == 0){
                            if($("#replyList ul").size() == 0){
                                $("#replyList").html('<ul></ul>');
                            }
//                          $("#replyList ul").prepend('<li data-id="'+info.aid+'" data-uid="'+info.id+'" data-name="'+info.nickname+'"><p><a href="'+(businessUrl.replace("%id", info.id))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+info.photo+'"></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", info.id))+'" target="_blank">'+info.nickname+'</a>：</span><div class="wr-da"><em>'+info.pubdate+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+info.content+'</div></li>');
							 $("#replyList ul").prepend('<li data-id="'+info.id+'" data-uid="'+info.userinfo.userid+'" data-name="'+info.userinfo.nickname+'"><p><a href="'+(businessUrl.replace("%id", info.id))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+info.userinfo.photo+'"></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", info.id))+'" target="_blank">'+info.userinfo.nickname+'</a>：</span><div class="wr-da"><em>'+info.ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+info.content+'</div></li>');

                        //子级评论
                        }else{
                           var par = t.closest("li");
                            t.closest(".writ-reply").remove();
                            par.after('<li class="writ-repeat" data-id="'+info.id+'" data-uid="'+info.userinfo.userid+'" data-name="'+info.userinfo.nickname+'"><p><a href="'+(businessUrl.replace("%id", info.userinfo.id))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+info.userinfo.photo+'"></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", info.userinfo.id))+'" target="_blank">'+info.userinfo.nickname+'</a>&nbsp;回复&nbsp;<a href="'+(businessUrl.replace("%id", uid))+'" target="_blank">'+uname+'</a>：</span><div class="wr-da"><em>'+info.ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+info.content+'</div></li>');
                        }


                        t.removeClass("disabled");

                    }else{
                        alert(data.info);
                        t.removeClass("disabled");
                    }
                },
                error: function(){
                    alert("网络错误，发表失败，请稍候重试！");
                    t.removeClass("disabled");
                }
            });
        }
    }


    //获取评论
    var atpage = 1;
    function getReplyList(){
        $.ajax({
        	
            url: "/include/ajax.php?service=member&action=getComment&type=info-detail&son=1&orderby=time&aid="+id+"&page="+atpage+"&pageSize=5",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
                    for(var i = 0; i < list.length; i++){
                        var src = staticPath+'images/noPhoto_100.jpg';
                        if(list[i].user.photo){
                            src = huoniao.changeFileSize(list[i].user.photo, "middle");
                        }
                         html.push('<li data-id="'+list[i].id+'" data-uid="'+list[i].user.userid+'" data-name="'+list[i].user.nickname+'"><p><a href="'+(businessUrl.replace("%id", list[i].uid))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+src+'" /></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", list[i].uid))+'" target="_blank">'+list[i].user.nickname+'</a>：</span><div class="wr-da"><em>'+list[i].ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+list[i].content+'</div></li>');

                        if(list[i].lower.list != null){
                            html.push(getLowerReply(list[i].lower.list, list[i].user));
                        }
                    }

                    if($("#replyList ul").size() == 0){
                        $("#replyList").html('<ul>'+html.join("")+'</ul>');
                    }else{
                        $("#replyList ul").append(html.join(""));
                    }

                    if(atpage < pageInfo.totalPage){
                        $("#replyList").append('<div class="more"><a href="javascript:;"><span>展开更多评论</span></a></div>');
                    }
                }else{
                    if(atpage == 1){
                        $("#replyList").html('<div class="loading">暂无评论！</div>');
                    }
                }
            }
        });
    }

    //评论子级
    function getLowerReply(arr, member){
        if(arr){
            var html = [];
            for(var i = 0; i < arr.length; i++){
                var src = staticPath+'images/noPhoto_100.jpg';
                if(arr[i].user.photo){
                    src = huoniao.changeFileSize(arr[i].user.photo, "middle");
                }
                html.push('<li class="writ-repeat" data-id="'+arr[i].id+'" data-uid="'+arr[i].user.uid+'" data-name="'+arr[i].user.nickname+'"><p><a href="'+(businessUrl.replace("%id", arr[i].user.userid))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+src+'" /></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", arr[i].user.userid))+'" target="_blank">'+arr[i].user.nickname+'</a>&nbsp;回复&nbsp;<a href="'+(businessUrl.replace("%id", member.userid))+'" target="_blank">'+member.nickname+'</a>：</span><div class="wr-da"><em>'+arr[i].ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+arr[i].content+'</div></li>');

                if(arr[i].lower != null){
                    html.push(getLowerReply(arr[i].lower.list, arr[i].user));
                    
                }
            }
            return html.join("");
        }
    }

    //加载评论
    getReplyList();


    //加载更多评论
    $("#replyList").delegate(".more", "click", function(){
        atpage++;
        $(this).remove();
        getReplyList();
    });

    //回复评论
    $("#replyList").delegate(".wr-da b a", "click", function(){
        var t = $(this), li = t.closest("li");
        rid = li.attr("data-id");
        uid = li.attr("data-uid");
        uname = li.attr("data-name");
        if(li.find(".writ-reply").size() == 0){
            $("#replyList .writ-reply").remove();
            li.append('<div class="writ-reply"><textarea placeholder="回复'+uname+'：" autoHeight="true"></textarea><button>回复</button></div>');
        }
    });

    //提交回复
    $("#replyList").delegate(".writ-reply button", "click", function(){
        var t = $(this), content = t.prev("textarea");
        sendReply(t, content);
    });
    $.fn.autoHeight = function(){
        function autoHeight(elem){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }
        this.each(function(){
            autoHeight(this);
            $(this).on('keyup', function(){
                autoHeight(this);
            });
        });
    }
    $('textarea[autoHeight]').autoHeight();



})

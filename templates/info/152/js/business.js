$(function(){
        // 导航栏置顶
    var Ggoffset = $('.list-lead').offset().top;

    $(window).bind("scroll",function(){
        var d = $(document).scrollTop();

        if(Ggoffset < d){
                $('.list-lead').addClass('fixed');
        }else{
            $('.list-lead').removeClass('fixed');
        }
    });

    $('.rbox a:eq(0)').bind('click', function(){
        $('.list-lead li:eq(1) a').click();
    })

    var isClick = 0;
    //左侧导航点击
    $(".list-lead a").bind("click", function(){
        isClick = 1; //关闭滚动监听
        var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $(".con-tit:eq("+index+")").offset().top - 60;
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
                var offsetNextTop = $(".con-tit:eq(" + (index + 1) + ")").offset().top - 70;
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


    //发表评论  一级
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

        if(!t.hasClass("disabled") && $.trim(content.val()) != ""){
            t.addClass("disabled");
			var url,data;
			if(rid == 0){
				url = '/include/ajax.php?service=member&action=sendComment&type=info-business&check=1';
				data = "aid="+id+"&content="+encodeURIComponent(content.val())
			}else{
				replyid = t.parents('li').attr('data-id')
				url = '/include/ajax.php?service=member&action=replyComment&check=1';
				data = "id="+replyid+"&content="+encodeURIComponent(content.val())
				
			}
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
        	
            url: "/include/ajax.php?service=member&action=getComment&type=info-business&son=1&aid="+id+"&page="+atpage+"&pageSize=5&orderby=time",
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
                        $("#replyList").html('<ul class="fn-clear">'+html.join("")+'</ul>');
                    }else{
                        $("#replyList ul").append(html.join(""));
                    }

                    if(atpage < pageInfo.totalPage){
                        $("#replyList ul").after('<div class="more"><a href="javascript:;"><span>展开更多评论</span></a></div>');
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
    function getLowerReply(arr,member){
    	
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

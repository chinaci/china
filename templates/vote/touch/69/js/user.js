$(function(){
	// 相册
	var mySwiper = new Swiper('.slideBox',{pagination : '.swiper-pagination',autoplay : 1500,})

	// 展开/收起参赛文选
	$('.more a').click(function(){
    	$('.good_body').toggleClass('inter');
    	$(this).hide().siblings().show();
    })


    var uid = user.id;
    var uname = user.name;

    $('.vote_me .vote').click(function(){

        var r = true;
        if(vote.voteuser == 1){
            r = checkLogin();
        }
        if(r){
            var content = [];
            content.push('<div class="toupiao">');
            content.push('<label for="mname"><input type="text" name="mname" class="mname" id="mname" placeholder="姓名" /></label></label>')
            content.push('<label for="mtel"><input type="text" name="mtel" class="mtel" id="mtel" placeholder="手机号" /></label></label>');
            content.push('<label for="vdimgckinp"><input type="text" name="vdimgckinp" class="vdimgckinp" id="vdimgckinp" placeholder="验证码" /></label></label>');
            content.push('<label for="vdimgckinpimg"><img src="/include/vdimgck.php" class="vdimgck"></label>');
            content.push('<label class="errorinfo"></label></label>');
            content.push('<a href="javascript:;" class="votesubmit">投票</a>');
            content.push('</div>');
            modal.setinfo('给选手“'+uname+'”投票', content.join(""));
        }
    })
    // 更换验证码
    $('body').delegate(".vdimgck","click",function(){
        changevdimg();
    })

    // 确认投票
    $('body').delegate('.votesubmit','click',function(){
        var t = $(this);
        if(t.hasClass('disabled')) return;

        $('input.error').removeClass('error');
        var t = $(this), mname = $('.mname').val(), mtel = $('.mtel').val(), vdimgck = $('.vdimgckinp').val(), tj = true;
        if(t.hasClass('disabled')) return;

        if(mname != '' && mtel == ''){
            tj = false;
            $('.mtel').addClass('error');
            $('.errorinfo').text('请填写您的手机号');
            return false;
        }else if(mname == '' && mtel != ''){
            tj = false;
            $('.errorinfo').text('请填写您的姓名');
            $('.mname').addClass('error');
            return false;
        }
        if(mname != '' && mtel != ''){
            var telReg = !!mtel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
            if(!telReg){
                tj = false;
                $('.errorinfo').text('您的手机号不正确');
                $('.mtel').addClass('error');
                return false;
            }
        }
        if(vdimgck == ''){
            tj = false;
            $('.errorinfo').text('请填写验证码');
            $('.vdimgckinp').addClass('error');
            return false;
        }

        if(tj){
            t.addClass('disabled').text('正在提交...');
            $.ajax({
                url: '/include/ajax.php?service=vote&action=vote&tid='+vote.id+'&uid='+uid+'&mname='+mname+'&mtel='+mtel+'&vdimgck='+vdimgck,
                type: 'GET',
                dataType: 'JSONP',
                success: function(data){
                    $('.vdimgck').click();
                    if(typeof data == 'string'){
                        data = eval('('+data+')');
                    }
                    if(data && data.state == 100){
                        modal.setinfo("投票成功",'感谢您对“'+uname+'”的支持！',1500);
                        $('.votecount').text(data.info);
                    }else{
                        $('.errorinfo').text(data.info);
                    }
                    t.removeClass('disabled').text('我要投票');
                },
                error: function(){
                    $('.vdimgck').click();
                    $('.errorinfo').text('网络错误，请重试！');
                    t.removeClass('disabled').text('我要投票');
                }
            })
        }
    })

    // --------------------------投票 e

    // 报名
    $('.baoming').click(function(){
        var state = '';
        if(vote.state == 0){
            state = '抱歉，活动还未开始';
        }else if(vote.state == 2){
            state = '抱歉，报名已结束';
        }else if(vote.state == 3){
            state = '抱歉，活动已结束';
        }
        if(state == ''){
            checkLogin();
        }else{
            modal.setinfo("提示信息",state,1000);
        }
    })

    // --------------------------评论 s
    var atpage = 1, totalPage = 1;
    var commonTop = $('#replyList').offset().top - $('.header').height();

    // 上一页
    $('.fanye .fan-l').click(function(){
        if(atpage == 1) return;
        atpage--;
        getReplyList(1);
    })
    // 下一页
    $('.fanye .fan-r').click(function(){
        if(atpage == totalPage) return;
        atpage++;
        getReplyList(1);
    })

    //获取评论
    function getReplyList(go){
        var img = $('.loading').attr('data-img');
        $('.loading').html('<img src="'+img+'" alt="">').show();
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=vote&action=common&infoid="+user.id+"&page="+atpage+"&pageSize=5",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

                    if(list.length > 0){
                        for(var i = 0; i < list.length; i++){
                            var photodefault = staticPath+'images/noPhoto_100.jpg',
								photo    = '',
								uid      = -1,
								nickname = '';
                            if(list[i].userinfo == ""){
								photo = photodefault;
								nickname = '网友';
							}else{
								photo = list[i].userinfo['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(list[i].userinfo['photo'], "small");
								uid = list[i].userinfo['userid'];
								nickname = list[i].userinfo['nickname'];
							}

                            var users = '<p>'+nickname+'</p>';

                            html.push('<li data-id="'+list[i].id+'" data-uid="'+uid+'" data-name="'+nickname+'"> <a href=""><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+photo+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ nickname +'<i>'+list[i].ftime+'</i> </div> <span>'+list[i].content+'</span> </div> </li>');

                            if(list[i].lower != null){
                                html.push(getLowerReply(list[i].lower, list[i].userinfo));
                            }
                        }
                    }
                    $('.loading').hide();
                    $("#replyList ul").html(html.join(""));

                    if(go){
                        $(window).scrollTop(commonTop);
                    }

                    $('.commcount').text(pageInfo.totalCount);
                    totalPage = pageInfo.totalPage;
                    if(totalPage > 1){
                        $('.fanye').show();
                        $('.page').text(atpage+'/'+totalPage);
                    }
                }else{
                    $('.loading').html('暂无相关评论');
                    $('.fanye').hide();
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

                var photodefault = staticPath+'images/noPhoto_100.jpg',
                    photo    = '',
                    uid      = -1,
                    nickname = '';
                if(arr[i].userinfo == ""){
                    photo = photodefault;
                    nickname = '网友';
                }else{
                    photo = arr[i].userinfo.photo == "" ? photodefault : huoniao.changeFileSize(arr[i].userinfo.photo, "small");
                    uid = arr[i].userinfo['userid'];
                    nickname = arr[i].userinfo['nickname'];
                }

                var users = '<p>'+nickname+'</p>';

                var replayUser = member ? ('回复 '+member.nickname+'：') : '';

                html.push('<li data-id="'+arr[i].id+'" data-uid="'+uid+'" data-name="'+arr[i].userinfo.nickname+'"> <a href=""><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+photo+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ users +'<i>'+arr[i].ftime+'</i> </div> <span>'+replayUser+arr[i].content+'</span> </div> </li>');

                if(arr[i].lower != null){
                    html.push(getLowerReply(arr[i].lower, arr[i].userinfo));
                }
            }
            return html.join("");
        }
    }

    var first = true;
    $(window).scroll(function(){
        var wsct = $(window).scrollTop();
        if(first && wsct + $(window).height() > commonTop){
            first = false;
            getReplyList();
        }
    })

    var rid = 0, ruid = 0, runame = '', sct = 0;
    // 我要讨论
    $('.reply,.replybtm').click(function(){
        rid = 0;
        // ruid = uid;
        // runame = uname;
        replyFun();
    })
    // 发表回复
    $('#replyList').delegate(".dis-txt","click",function(){
        var t = $(this).closest('li');
        rid = t.data('id');
        // ruid = t.data('uid');
        runame = t.data('name');
        replyFun();
    })

    function replyFun(){
        /*var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }*/

        sct = $(window).scrollTop();

        $('html').addClass('fixed');

        $('.layer').addClass('show').animate({"left":"0%"},100);

        $('.editor .img').css("display","table-cell");
    }

    // $(".textarea").bind('DOMNodeInserted', function(e) {
    //     checkContentLen();
    // })
    // $(".textarea").keyup(function(){
    //     checkContentLen();
    // })
    // function checkContentLen(){
    //     var con = $('.textarea'), str = con.html(), len = str.length;
    //     if(len > 250){
    //         setTimeout(function(){
    //             con.html(str.substr(0,250));
    //             set_focus(con);
    //         },100)
    //     }
    // }

    //发表回复
    $(".top-r").bind("click", function(){
        var t = $(this), content = $(".textarea").html();
        if(!t.hasClass("disabled") && $.trim(content) != ""){
            t.addClass("disabled");

            $.ajax({
                url: "/include/ajax.php?service=vote&action=sendCommon",
                data: "tid="+vote.id+"&uid="+user.id+"&id="+rid+"&content="+encodeURIComponent(content),
                type: "POST",
                dataType: "json",
                success: function (data) {
                    t.removeClass("disabled");
                    if(data && data.state == 100){
                        var info = data.info;
                        $(".top-l").click();
                        $('.top-r').text('发表成功！');
                        $('.layer').animate({"left":"100%"},1,function(){
                            $('.layer').removeClass('show');

                            getReplyList();

                            t.removeClass("disabled").text('发表');
                        });
                    }else{
                        t.removeClass("disabled").text('发表');
                        alert("发表失败，请刷新重试！");
                    }
                },
                error: function(){
                    t.removeClass("disabled").text('发表');
                    alert("网络错误，发表失败，请稍候重试！");
                }
            });
        }
    });

    // 隐藏回复
    $('.top-l').click(function(){
        $('html').removeClass('fixed');
        $(window).scrollTop(sct);
        $('.layer').removeClass('show').animate({"left":"100%"},100);
        $('.layer .textarea').html('');
    })

    // 选择表情
    var memerySelection;
    $('.editor .emotion').click(function(){
        var t = $(this), box = $('.emotion-box');
        memerySelection = window.getSelection();
        if (box.css('display') == 'none') {
        $('.emotion-box').show();
        t.addClass('on');
        return false;
    }else {
        $('.emotion-box').hide();
        t.removeClass('on');
    }
    })

    $('.emotion-box li').click(function(){
        var t = $(this).find('img'), textarea = $('.textarea'), hfTextObj = textarea;
        hfTextObj.focus();
        pasteHtmlAtCaret('<img src="'+t.attr("src")+'" />');
    })

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
    // --------------------------评论 e


})

    // 验证是否登录
    function checkLogin(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            top.location.href = masterDomain + '/login.html';
            return false;
        }else{
            return true;
        }
    }

    function changevdimg(){
        var img = $('.vdimgck');
        var src = img.attr('src') + '?v=' + new Date().getTime();
        img.attr('src',src);
    }

    var modal = {
        time:0,
        show:function(){
            clearTimeout(this.time);
            $('.disk').show();
            var t = this;
            $('.disk,.tymodal .close').click(function(){
                t.close();
                $('.tymodal').addClass('fn-hide');
            })
        },
        close:function(id){
            $('.disk').hide();
            if(id != undefined){
                $(id).addClass('fn-hide');
            }
        },
        setinfo:function(title,body,auto){
            var t = this;
            $('.tymodal .title').text(title);
            $('.tymodal .text').html(body);
            $('.tymodal').removeClass('fn-hide');
            t.show();
            if(auto){
                t.time = setTimeout(function(){
                    t.close('.tymodal');
                },auto)
            }
        }
    }

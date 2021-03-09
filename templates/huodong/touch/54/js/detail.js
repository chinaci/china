$(function(){

    /*调起大图 S*/
    $.fn.bigImage({
        artMainCon:".content-body",  //图片所在的列表标签
    });
    var userAgent = navigator.userAgent.toLowerCase();

    var fid = 0;    // 费用类型

    // 判断是否 不能报名
    if($('.jo-3 a').hasClass('baomingend')){
        $('.baoming .bm-3, .baoming-foot').remove();
    }

    //收藏
    $('.jojo-1').click(function(){
        $(this).hide();$(this).siblings('.jojo-2').show();
    })
    $('.jojo-2').click(function(){
        $(this).hide();$(this).siblings('.jojo-1').show();
    })

    // 打开收费类型
    $('.list-4').click(function(){
        showPrice();
    })

    $('.baoming span,.black').click(function(){
        $('.baoming, .black').hide();
    })

    $('.baoming1 span.close_alert,.black1').click(function(){
        $('.baoming1, .black1').hide();
    })

    $('.baoming-yes').click(function(){
        var t = $(this);
        if(t.hasClass('disabled')) return;
        if(t.hasClass('cancel')){
          baoming(t,'cancel');
        }else{
          if(feetype){
            showPrice();
          }else{
            //填写报名信息
            $('body').scrollTop(0);
            $('.baoming1, .black1').show();
          }
        }
    })

    $('.baomin_next').click(function(){
        var t = $(this);
        if(t.hasClass('disabled')) return;
        if(feetype && fid == 0){
            alert('请选择收费类型');
        }else{
          //填写报名信息
          $('body').scrollTop(0);
          $('.baoming1, .black1').show();
          toggleDragRefresh('off');
        }
    })

    $('.baomin_next1').click(function(){
      baoming($(this));
    });

    // 显示收费类型
    function showPrice(){
        if(!feetype){
            return true;
        }else{
            $('body').scrollTop(0);
            $('.baoming').hide();
            $('.black,.baoming').show();
            return false;
        }
    }

    //价格勾选
    $('.baoming ul li').click(function(){
        var x = $(this);
        if (x.hasClass('op-1')) {
            x.removeClass('op-1');
            fid = 0;
        }else{
            x.addClass('op-1');
            x.siblings().removeClass('op-1');
            fid = x.attr('data-id');
        }
    })

    //收藏
    $('.collect').click(function(){

        var t = $(this), type = "add";
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }

        if(t.hasClass("gy")){
            type = "del";
            t.removeClass("gy").find("p").html("收藏");
        }else{
            t.addClass("gy").find("p").html("已收藏");
        }
        $.post("/include/ajax.php?service=member&action=collect&module=huodong&temp=detail&type="+type+"&id="+id);
    });
      //国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li><span>'+list[i].name+'</span><em class="fn-right">+'+list[i].code+'</em></li>');
                   }
                   $('.layer_list ul').append(phoneList.join(''));
                }else{
                   $('.layer_list ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                    $('.layer_list ul').html('<div class="loading">加载失败！</div>');
                }

        })
    }
    // 打开手机号地区弹出层
    $(".areacode_span").click(function(){
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        console.log(txt)
        $(".areacode_span label").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code, #popupReg-captcha-mobile').hide();
        $('.mask-code').removeClass('show');
    })


    function baoming(t,type){

        //验证登录
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }

        t.addClass("disabled");

        if(type == 'cancel'){

            if(confirm("确认取消报名吗？")){
                $.ajax({
                    url: masterDomain+"/include/ajax.php?service=huodong&action=cancelJoin&id="+id,
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                        t.removeClass("disabled");
                        if(data && data.state == 100){
                            location.reload();
                        }else{
                            alert(data.info);
                        }
                        t.removeClass("disabled");
                    },
                    error: function(){
                        alert("网络错误，操作失败，请稍候重试！");
                        t.removeClass("disabled");
                    }
                });
            }else{
                t.removeClass("disabled");
            }
            return false;

        }


        var tj = true, data = [];
        $('.popupForm dl').each(function(){
          if(!tj) return false;
          var dl = $(this), title = dl.attr('data-id'), type = dl.attr('data-type'), required = dl.attr('data-required');
          var val;
          //单行文本
          if(type == 'text'){
            val = $.trim(dl.find('input').val());
          }
          //多行文本
          else if(type == 'text_long'){
            val = $.trim(dl.find('textarea').val());
          }
          //单选文本
          else if(type == 'single_vote'){
            val = dl.find('input:checked').val();
          }
          //多选文本
          else if(type == 'multi_vote'){
            var che = [];
            dl.find('input:checked').each(function(){
              che.push($(this).val());
            });
            val = che.join('、');
          }
          if(required == '1' && (val == '' || val == undefined)){
            tj = false;
            alert('请'+(type == 'text' || type == 'text_long' ? '输入' : '选择') + title);
            return false;
          }

          if(val != '' && val != undefined){
            data.push('{"'+title+'": "'+val+'"}');
          }
        });

        if(!tj) return false;

        data = '['+data.join(',')+']';
        var areaCode = $('#areaCode').val();
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=huodong&action=join&id="+id+"&fid="+fid+"&areaCode="+areaCode+"&data="+data,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    if(feetype == 1 && data.info != "报名成功！"){
                        location.href = data.info;
                    }else{
                        location.reload();
                    }
                }else{
                    alert(data.info);
                    t.removeClass("disabled");
                }
            },
            error: function(){
                alert("网络错误，报名失败，请稍候重试！");
                t.removeClass("disabled");
            }
        });
    }

    // 遮罩层
    $('.mask').on('click',function(){
        $('.mask').hide();
        $('.fenlei .fenlei-1').hide();
        $('.list-head li').removeClass('active');
    })

    // 展开更多评论
    $('.dis-foot').click(function(){
        var dom = $('.discuss')
        dom.toggleClass('roll');
    })

    $('.mask').click(function(){
        var dom = $('.mask')
        if (dom.hasClass('active')) {
            $('body').addClass('by')
        }else{
            $('body').removeClass('by')
        }
    })


    var businessUrl = $("#replyList").data("url");
    var atpage = 1;

    //获取评论
    function getReplyList(){
        $('.loading').show();
        $.ajax({
            url : masterDomain + "/include/ajax.php?service=member&action=getComment&type=huodong-detail&son=1&aid="+id+"&page="+atpage+"&pageSize=10",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
                    
                    if(list.length > 0){
                        for(var i = 0; i < list.length; i++){
                            var src = staticPath+'images/noPhoto_100.jpg';
                            if(list[i].user.photo){
                                src = huoniao.changeFileSize(list[i].user.photo, "middle");
                            }
                            if(list[i].user.userid == uid){
                                var users = '<p>【主办方】'+list[i].user.nickname+'</p>';
                            }else{
                                var users = '<b>'+list[i].user.nickname+'</b>';
                            }
                            html.push('<li data-id="'+list[i].id+'" data-uid="'+list[i].user.userid+'" data-name="'+list[i].user.nickname+'"> <a href="'+(businessUrl.replace("%id", list[i].user.userid))+'"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+src+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ users +'<i>'+list[i].ftime+'</i> </div> <span>'+list[i].content+'</span> </div> </li>');

                            if(list[i]['lower']!=undefined && list[i]['lower'].count > 0 && list[i]['lower'].list!=null){
                                html.push(getLowerReply(list[i].lower.list, list[i].user));
                            }
                        }
                    }

                    $("#replyList ul").append(html.join(""));

                    if(atpage < pageInfo.totalPage){
                        $('.loading').html('<a href="javascript:;" class="getmore">显示更多讨论</a>');
                    }else if($("#replyList ul li").length > 4){
                        $('.loading').html('<a href="javascript:;" class="rollup">展开/收起讨论</a>');
                    }else{
                        $('.loading').html('<a href="javascript:;">已显示全部讨论</a>');
                    }

                }else{
                    if(atpage == 1){
                        $(".loading").html('暂无讨论！');
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

                if(arr[i].user.useruid == uid){
                    var users = '<p>【主办方】'+arr[i].user.nickname+'</p>';
                }else{
                    var users = '<b>'+arr[i].user.nickname+'</b>';
                }

                html.push('<li data-id="'+arr[i].id+'" data-uid="'+arr[i].user.useruid+'" data-name="'+arr[i].user.nickname+'"> <a href="'+(businessUrl.replace("%id", arr[i].user.useruid))+'"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+src+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ users +'<i>'+arr[i].ftime+'</i> </div> <span>回复 '+member.nickname+'：'+arr[i].content+'</span> </div> </li>');

                if(arr[i]['lower']!=undefined && arr[i]['lower'].count > 0 && arr[i]['lower'].list!=null){
                    html.push(getLowerReply(arr[i].lower.list, arr[i].user));
                }
            }
            return html.join("");
        }
    }

    var first = true;
    $(window).scroll(function(){
        var wsct = $(window).scrollTop();
        if(first && wsct + $(window).height() > $('#replyList').offset().top){
            first = false;
            getReplyList();
        }
    })

    $('#replyList').delegate(".getmore","click",function(){
        atpage++;
        $(".loading").html('获取中，请稍后···');
        getReplyList();
    })

    // 展开收起评论
    $('#replyList').delegate(".rollup","click",function(){
        var ul = $('#replyList ul');
        if(ul.hasClass('roll')){
            ul.removeClass('roll').find('li').show();
        }else{
            ul.addClass('roll').find('li').slice(4).hide();
        }
    })


    var rid = 0, ruid = 0, runame = '', sct = 0;
    // 我要讨论
    $('.reply').click(function(){
        rid = 0;
        ruid = uid;
        runame = uname;
        replyFun();
    })
    // 发表回复
    $('#replyList').delegate(".dis-txt","click",function(){
        var t = $(this).closest('li');
        rid = t.data('id');
        ruid = t.data('uid');
        runame = t.data('name');
        replyFun();
    })

    function replyFun(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }

        sct = $(window).scrollTop();

        $('body').addClass('fixed');

        $('.layer').addClass('show').animate({"left":"0%"},100);

        $('.editor .img').css("display","table-cell");
    }

      //发表回复
    $(".top-r").bind("click", function(){
        var t = $(this), content = $(".textarea").html();
        if(!t.hasClass("disabled") && $.trim(content) != ""){
            t.addClass("disabled");

            if(rid == undefined || rid == ''){
                var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=huodong-detail&aid=' + id;
            }else{
                var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + rid;
            }
            rid = rid == undefined ? 0 : rid;

            $.ajax({
                url : url,
                data : "sco1=1&content="+encodeURIComponent(content),
                type: "POST",
                dataType: "json",
                success: function (data) {
                    t.removeClass("disabled");
                    if(data && data.state == 100){console.log(data);
                        var info = data.info;
                        $(".top-l").click();
                        if(data.info.ischeck == 1){
                            $('.top-r').text('发表成功！');
                            $('.layer').animate({"left":"100%"},1,function(){
                                $('.layer').removeClass('show');

                                if(info.userinfo.userid == uid){
                                    var users = '<p>【主办方】'+info.userinfo.nickname+'</p>';
                                }else{
                                    var users = '<b>'+info.userinfo.nickname+'</b>';
                                }

                                var newReply = $('<li class="load" data-id="'+info.id+'" data-uid="'+info.userinfo.userid+'" data-name="'+info.userinfo.nickname+'" style="display:none;"> <a href="'+(businessUrl.replace("%id", info.userinfo.userid))+'"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+info.userinfo.photo+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ users +'<i>'+info.ftime+'</i> </div> <span>'+ (rid ? ('回复 '+runame+'：') : '') +info.content+'</span> </div> </li>');

                                $('#replyList ul').prepend(newReply);
                                newReply.show(300,function(){
                                    newReply.removeClass('load');
                                    $('.discuss-lead em').text(++reply);
                                });
                                t.removeClass("disabled").text('发表');
                            });
                        }else{
                          t.removeClass("disabled").text('发表');
                          alert("发表成功，等待管理员审核后显示！");
                        }
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
        $('body').removeClass('fixed');
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
    

    var textarea = $('.textarea');
    $('.emotion-box li').click(function(){
        var t = $(this).find('img');
        textarea.focus();
        if (/iphone|ipad|ipod/.test(userAgent)) {
          $('.textarea').append('<img src="'+t.attr("src")+'" class="emotion-img" />');
          return false;
        }else {
          pasteHtmlAtCaret('<img src="'+t.attr("src")+'" class="emotion-img" />');
        }
        document.activeElement.blur();
        return false;
    })
    
    $(document).click(function(){
        $('.layer').removeClass('emotion');
        $('.emotion.item').removeClass('on');
        $('.emotion-box').hide();
    })

    $('.layer').click(function(){
        set_focus($('.textarea'));
    })

    $('body').delegate('.textarea', 'click', function(){
        var t = $(this);
        set_focus(t);
        $('.editor, .anotherbox').removeClass('emotion');
        $('.emotion.item').removeClass('on');
        $('.emotion-box').hide();
        return false;
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
})

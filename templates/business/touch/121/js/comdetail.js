$(function(){
  var activeID = detail.id;
  var page = 1, pageSize = 10, isload = false;

  function auto_data_size(){
    var imgss= $("figure img");
    $("figure a").each(function() {
        var t = $(this);
        var imgs = new Image();
        imgs.src = t.attr("href");

        if (imgs.complete) {
            t.attr("data-size","").attr("data-size",imgs.width+"x"+imgs.height);
        } else {
            imgs.onload = function () {
                t.attr("data-size","").attr("data-size",imgs.width+"x"+imgs.height);
                imgs.onload = null;
            };
        };

    })
  };
  auto_data_size();
  $.fn.scrollTo =function(options){
        var defaults = {
            toT : 0, //滚动目标位置
            durTime : 500, //过渡动画时间
            delay : 30, //定时器时间
            callback:null //回调函数
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(),//滚动条当前的位置
            subTop = opts.toT - curTop, //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback == 'function'){
                        opts.callback();
                    }
                    return;
                }else{
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };
    // 播放
    $('.voiceBox .voice').on('click',function(){
      var audio;
      audio = new Audio();
      audio.src = "";
      if($(this).hasClass('play')){
        $(this).removeClass('play');
        audio.pause();

      }else{
        $(this).addClass('play');
        audio.play();
      }
      audio.loop = false;
      audio.addEventListener('ended', function () {  
          $('.voiceBox .voice').removeClass('play');
      }, false);
    })
    // 视频
    $('.comPic .comVideo video').on('tap',function(){
      $(this).closest('.wrapper').addClass('fullscreen');
      return false;
    })
     // 大图关闭
    $('.comPic .vClose').on('click',function(){
        $('.wrapper').removeClass('fullscreen');
        return false;
    })
    // 点赞
    $(".detailBox").delegate(".like","click", function(){
        var num = $(this).find("em").text();
        var t = $(this),id=t.attr('data-id'),type=t.hasClass('like1')? "del" : "add" ;
        var cid = $(this).closest('li').attr('data-id');

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
        }

        num++;
        if(type == "add"){
            t.addClass('like1');
            t.find("em").text(num);
        }else{
            t.removeClass('like1');
            t.find("em").text(num-2);
        }

        $.post("/include/ajax.php?service=member&action=dingComment&id="+detail.id+'&type='+type);
       
    });


    // 返回顶部
    var windowTop=0;
    $(window).on("scroll", function(){
            var scrolls = $(window).scrollTop();//获取当前可视区域距离页面顶端的距离
            if(scrolls>=windowTop){//当B>A时，表示页面在向上滑动
                //需要执行的操作
                windowTop=scrolls;
                $('.gotop').hide();
                $('.wechat-fix').hide();

            }else{//当B<a 表示手势往下滑动
                //需要执行的操作
                windowTop=scrolls;
                $('.gotop').show();
                $('.wechat-fix').show();
            }
            if(scrolls==0){
              $('.gotop').hide();
                $('.wechat-fix').hide();
            }
     });
   // 回到顶部
  $('.gotop').click(function(){
    var dealTop = $("body").offset().top;
        $("html,body").scrollTo({toT:dealTop})
    $('.gotop').hide();
  })
    // 返回上一页
    $('.goback').click(function(){
      history.go(-1);
    })

    function getComment(tr){
      isload = true;

      $.ajax({
        url: masterDomain + '/include/ajax.php?service=member&action=getChildComment&pid='+detail.id+'&page='+page+'&pageSize='+pageSize,
        type: 'get',
        dataType: 'jsonp',
        success: function(data){
            if(data && data.state == 100){
                var list = data.info.list;
                var pageInfo = data.info.pageInfo;
                var html = [];
                for(var i = 0; i < list.length; i++){
                    var d = list[i];
                    html.push('<li class="fn-clear">');
                    html.push('  <div class="left">');
                    html.push('    <a href="javascript:;"><img src="'+(d.user.photo ? d.user.photo : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></a>');
                    html.push('  </div>');
                    html.push('  <div class="right reply" data-id="'+d.id+'">');
                    html.push('    <p class="name fn-clear"><span class="sname">'+d.user.nickname+'</span> <span class="time">'+huoniao.transTimes(d.dtime, 2).replace(/-/g, '.')+'</span></p>');
                    html.push('    <p class="content">'+d.content.replace(/\n/g, '<br>')+'</p>');
                    html.push('  </div>');
                    if(d.lower.count){
                      html.push('  <ul class="children">');
                      for(var n = 0; n < d.lower.list.length; n++){
                        var c = d.lower.list[n];
                        html.push('    <li class="fn-clear">');
                        html.push('      <div class="left">');
                        html.push('        <a href="javascript:;"><img src="'+(c.user.photo ? c.user.photo : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></a>');
                        html.push('      </div>');
                        html.push('      <div class="right reply" data-id="'+c.id+'">');
                        html.push('        <p class="name"><span class="sname">'+c.user.nickname+'</span> <span class="time">'+huoniao.transTimes(c.dtime, 2).replace(/-/g, '.')+'</span></p>');
                        html.push('        <p class="content">回复<span>'+c.member.nickname+'</span>：'+c.content.replace(/\n/g, '<br>')+'</p>');
                        html.push('      </div>');
                        html.push('    </li>');
                      }
                      html.push('  </ul>');
                    }
                    html.push('</li>');
                }
                $('.comment_total').text(pageInfo.totalCount_all);
                if(tr){
                  $('.commentlist').html(html.join(""));
                }else{
                  $('.commentlist').append(html.join(""));
                }
                $('.commentBox').removeClass('fn-hide');

                if(pageInfo.totalPage > page){
                  isload = false;
                }
            }
        }
      })
    }

    $(".commentlist").delegate(".reply", "click", function(){
      var t = $(this), name = t.find(".sname").text();
      activeID = t.attr("data-id");
      $("#commentInput").attr("placeholder", "回复"+name+":").focus();
      $('.error').addClass('t-reply').html('').show();
    })
    $('.error').click(function(){
      var t = $(this);
      if(t.hasClass('t-reply')){
        t.removeClass('t-reply').hide();
        activeID = detail.id;
        $("#commentInput").attr("placeholder", "写点评论吧...");
      }
    })

    $(".btnSend").click(function(){
      var t = $(this);
      if(t.hasClass('disabled')) return;
      var content = $.trim($('#commentInput').val());
      if(content == ''){
        showErr('请填写内容');
        return;
      }
      t.addClass('disabled');
      $.ajax({
        url: masterDomain + '/include/ajax.php?service=member&action=replyComment&id='+activeID+'&content='+encodeURIComponent(content),
        type: 'get',
        dataType: 'json',
        success: function(data){
          if(data && data.state == 100){
            showErr(data.info, 1000, function(){
              page = 1;
              isload = false;
              activeID = detail.id;
              t.removeClass('disabled');
              $("#commentInput").val('').attr("placeholder", "写点评论吧...");
              getComment(1);
            })
          }else{
            t.removeClass('disabled');
          }
        },
        error: function(){
          showErr('网络错误，请重试!');
          t.removeClass('disabled');
        }
      })

    })

    $(window).scroll(function(){
      var sct = $(window).scrollTop(), winh = $(window).height(), bh = $('body').height();
      if(!isload && winh + sct + 50 >= bh){
        page ++;
        getComment();
      }
    })

    getComment();
})

// 错误提示
function showErr(str, type, callback){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  if(type != 'wait'){
    setTimeout(function(){
      o.hide();
      callback && callback();
    },1000);
  }
}
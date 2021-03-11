$(function(){

  var isload = false, page = 1, pageSize = 10, tofoot = $('.tofoot');

  // 标记已读
  $('.container').delegate('.btns .read', 'click', function(){
    var t = $(this), p = t.closest('.item'), id = p.attr("data-id");
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=readReview', 'id='+id, function(data){
      if(data && data.state == 100){
        p.removeClass('is_new').find('.read').remove();
        backDefPos(p);
      }else{
        showMsg.alert(data.info, 1000);
      }
    })
  })
  // 删除
  $('.container').delegate('.btns .del', 'click', function(){
    var t = $(this), p = t.parents('li'), id = p.attr("data-id");
    showMsg.confirm('确定要删除这条信息吗？', {
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=delReview', 'id='+id, function(data){
          showMsg.alert(data.info, 1000);
          if(data && data.state == 100){
            p.remove();
            if(tofoot.offset().top < $(window).height()){
              getList(1);
            }
          }
        })
        showMsg.alert('操作成功', 1000);

      }
    })
  })

  // 进入聊天页面
  $('.container').delegate('a', 'click', function(){
    var t = $(this), p = t.parent(), from = p.attr("data-my"), to = p.attr("data-other");
    if(p.hasClass('userdel')){
      showMsg.alert('用户不存在或已被删除', 1000);
      return;
    }
    if(device.indexOf('huoniao') > -1){
      var param = {
        from: userid,
        to: to,
      };
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('invokePrivateChat',  param, function(responseData){});
      })
    }else{
      showMsg.alert('请在客户端打开', 1000);
    }
  })

  function backDefPos(obj){
    obj.removeClass('open').addClass('tran').css({'transform':'translate3d(0px, 0px, 0px)'});
    setTimeout(function(){
      obj.removeClass('tran');
    },200)
  }

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(sct + $(window).height() >= tofoot.offset().top){
      page++;
      getList();
    }
  })

  function getList(tr){
    if(isload) return;
    if(tr){
      page = 1;
      $('.container ul').html('');
    }
    isload = true;
    showMsg.loading();
    var start = $('.container .item').length;
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=review&page='+page+'&pageSize=10',
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            html.push('<li class="item'+(d.isread == 0 ? ' is_new' : '')+(d.user.level > 0 ? ' vip' : '')+(d.info.isread == "0" ? ' is_new' : '')+(d.user.id == 0 ? ' userdel' : '')+'" data-id="'+d.info.id+'" data-type="'+d.user.type+'" data-my="'+d.info.my+'" data-other="'+d.user.userid+'">');
            html.push('  <a href="javascript:;" class="fn-clear">');
            html.push('    <div class="visitors_img">');
            html.push('      <div class="img"><img src="'+(d.user.id == 0 ? '/static/images/default_user.jpg' : d.user.phototurl)+'"></div>');
            html.push('    </div>');
            html.push('    <div class="visitors_txt">');
            html.push('      <p class="txt_name">');
            html.push('        <em'+(d.user.id == 0 ? ' style="color:#a0a0a0;"' : '')+'>'+d.user.nickname+'</em>');
            if(d.user.type == 0 && d.user.certifyState){
              html.push('        <em class="shim">实名</em>');
            }
            html.push('        <span class="time">'+d.info.time+'</span>');
            html.push('      </p>');
            var note = '';
            if(d.info.note.indexOf("img") > 0 || d.info.note.indexOf("images") > 0){
              note = '图片消息';
            }else if(d.info.note.indexOf('audio') > 0){
              note = '语音消息';
            }else if(d.info.note.indexOf('video') > 0){
              note = '视频消息';
            }else{
              note = d.info.note;
            }
            html.push('      <p class="txt_time">'+note+'</p>');
            html.push('    </div>');
            html.push('  </a>');
            html.push('  <div class="btns">');
            html.push((d.info.isread == "0" ? '<span class="read">设为已读</span>' : '') + '<span class="del">删除</span>');
            html.push('  </div>');
            html.push('</li>');
          }

          $('.container ul').append(html.join(""));
          itemBindTouch(start);
          showMsg.close();
          if(data.info.pageInfo.totalPage > page){
            $('.tofoot').show();
            isload = false;
          }else{
            $('.tofoot').text('已加载完全部数据').show();
          }
        }else{
          showMsg.alert(data.info, 1000);
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

  function itemBindTouch(start){
    var container = document.querySelectorAll('.container .item');
    var expansion = null;
    var start = start ? start : 0;
    for(var i = start; i < container.length; i++){
        var x, y, X, Y, swipeX, swipeY, tx, btnwidth;
        container[i].addEventListener('touchstart', function(event) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            var sty = this.style.transform;
            if(sty != undefined && sty != ''){
                sty = sty.split('(');
                sty = sty[1].split(',');
                sty = sty[0];
                tx = parseInt(sty);
            }else{
                tx = 0;
            }
            swipeX = true;
            swipeY = true ;

            btnwidth = $(this).find('.btns').width();

            $(this).removeClass("tran");

            var openList = $(this).siblings('.open');
            if(openList.length){
              backDefPos(openList);
            }

        });
        container[i].addEventListener('touchmove', function(event){
          if(!$(this).hasClass('open')){
            // event.preventDefault();
            // event.stopPropagation();
          }
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
              console.log("left right")
                var m = X-x;
                if(m <= 0){
                    if(tx == 0 && m >= -btnwidth){
                        this.style.transform = 'translate3d('+m+'px, 0px, 0px)';
                    }
                }else{
                    var r = tx + m;
                    if(r <= 0){
                        this.style.transform = 'translate3d('+r+'px, 0px, 0px)';
                    }
                }

                // 阻止事件冒泡
                event.stopPropagation();
                swipeY = false;
            }
            // 上下滑动
            if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
              console.log("up down")
                swipeX = false;
            }
        });

        container[i].addEventListener('touchend', function(event){
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;
            // 左右滑动
            // if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){}
            // 上下滑动
            if(!swipeX) return;
                var m = X-x;
                if(m <= 0){
                  if($(this).hasClass("open")){
                    return;
                  }
                  $(this).addClass("tran");
                  if(m < -btnwidth/2){
                    $(this).addClass("open");
                    this.style.transform = 'translate3d(-'+btnwidth+'px, 0px, 0px)';
                  }else{
                    $(this).removeClass("open");
                    this.style.transform = 'translate3d(0, 0px, 0px)';
                  }
                }else{
                  $(this).addClass("tran");
                  if(m < btnwidth/2){
                    $(this).addClass("open");
                    this.style.transform = 'translate3d(-'+btnwidth+'px, 0px, 0px)';
                  }else{
                    $(this).removeClass("open");
                    this.style.transform = 'translate3d(0, 0px, 0px)';
                  }
                }

        })
    }
  }

  getList();

})

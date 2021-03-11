$(function(){

  var isload = false, page = 1, pageSize = 10, tofoot = $('.tofoot');

  // 标记已读
  $('.container').delegate('.btns .read', 'click', function(){
    var t = $(this), p = t.closest('.item');
    showMsg.alert('操作成功', 1000);
    p.removeClass('is_new').find('.read').remove();
    backDefPos(p);
  })
  // 删除
  $('.container').delegate('.btns .del', 'click', function(){
    var t = $(this), p = t.parents('li'), id = p.attr("data-id");
    showMsg.confirm('确定要删除这条信息吗？', {
      ok: function(){
        p.remove();
        operaJson(masterDomain + '/include/ajax.php?service=dating&action=visitDel', 'id='+id)
        if(tofoot.offset().top < $(window).height()){
          getList(1);
        }
        showMsg.alert('操作成功', 1000);

      }
    })
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
      getList();
    }
  })

  function getList(tr){
    if(isload) return;
    isload = true;
    if(tr){
      page = 1;
      $('.container ul').html('');
    }
    showMsg.loading();
    var start = $('.container .item').length;
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=visit&oper=meet&act=out&page='+page+'&pageSize=20',
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [], length = data.info.list.length;
          if(length){
            for(var i = 0; i < length; i++){
              var d = data.info.list[i];

              html.push('<li class="item" data-id="'+d.id+'">');
              html.push('  <a href="'+d.member.url+'" class="fn-clear">');
              html.push('    <div class="visitors_img">');
              html.push('      <div class="img"><img src="'+d.member.phototurl+'"></div>');
              html.push('    </div>');
              html.push('    <div class="visitors_txt">');
              html.push('      <p class="txt_name">');
              html.push('        <em>'+d.member.nickname+'</em>');
              if(d.member.certifyState){
                html.push('        <em class="shim">实名</em>');
              }
              var time = d.pubdate.split(' ')[1].split(':');
              time = time[0]+':'+time[1];
              html.push('        <span class="time">'+time+'</span>');
              html.push('      </p>');
              html.push('      <p class="txt_time"></p>');
              html.push('    </div>');
              html.push('  </a>');
              html.push('  <div class="btns">');
              html.push('    <span class="del">删除</span>');
              html.push('  </div>');
              html.push('</li>');
            }

            $('.container ul').append(html.join(""));
            itemBindTouch(start);
            showMsg.close();
            
            if(data.info.pageInfo.totalPage > page){
              isload = false;
              $('.tofoot').show();
            }else{
              // $('.tofoot').text('已加载全部信息').show();
            }
          }else{
            if(data.info.pageInfo.totalPage){
              $('.tofoot').text('已加载全部信息').show();
            }else{
              $('.tofoot').text('暂无相关信息！').show();
            }
          }
        }else{
          if(page == 1){
            showMsg.alert('暂无相关信息！', 1000);
          }else{
            tofoot.text('已加载全部信息').show();
          }
        }
      },
      error: function(){
        isload = false;
        showMsg.alert('网络错误，请重试');
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
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
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
                swipeX = false;
            }        
        });

        container[i].addEventListener('touchend', function(event){     
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            // if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){}
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
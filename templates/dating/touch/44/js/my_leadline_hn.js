$(function(){
  // tab左右切换模块
  var navtab = $('.navtab');
  var container = $('.tabs-container');
  var tofoot = $('.tofoot');
  var activeIndex = 0;
  var pageSize = 10;
  var hnList = [];
  var tabsSwiper = new Swiper('.tabs-container',{
    speed:350,
    autoHeight: true,
    touchAngle : 35,
    onSlideChangeStart: function(swiper){
      loadMoreLock = false;
      activeIndex = swiper.activeIndex;
      var navActive = navtab.find("li").eq(activeIndex);
      navActive.addClass('active').siblings().removeClass('active');

      // 当模块的数据为空的时候加载数据
      var con = container.find(".swiper-slide").eq(activeIndex).find(".content-slide");
      if(con.html() == ''){
        getData(con);
      }else{
        var page = navActive.attr("data-page"), totalPage = navActive.attr("data-totalPage");
        if(totalPage > page){
          tofoot.text('上拉加载').show();
        }
      }


    },
    onSliderMove: function(){
      // isload = true;
    },
    onSlideChangeEnd: function(){
      // isload = false;
    },
    onInit: function(swiper){
      $('.content-slide').each(function(){
        var c = $(this);
        if(c.html() == ""){
          // c.html('<div class="loading">正在获取，请稍后</div>');
          getData();
        }
      })
    }
  })
  $(".navtab li").on('touchstart mousedown',function(e){
    e.preventDefault();
    var t = $(this), box = t.closest('.box'), sindex = box.attr("data-swiper-index");
    t.addClass('active').siblings().removeClass('active');
    tabsSwiper.slideTo( t.index() );
  })
  // 取消牵线
  container.delegate('.cancel', 'click', function(){
    var t = $(this), p = t.closest('.item'), id = p.attr('data-id');
    showMsg.confirm('是否取消牵线，本次牵线将不扣除牵线次数',{
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=leadOper', 'state=4&id='+id, function(data){
          if(data.state == 100){
            showMsg.alert(data.info, 1000, function(){
              p.remove();
            })
          }else{
            showMsg.alert(data.info, 1000);
          }
        })
      }
    })
  })
  // 同意牵线/拒绝牵线
  container.delegate('.agree, .refuse', 'click', function(){
    var t = $(this), p = t.closest('.item'), id = p.attr('data-id'), operUid = p.find('.u_right').attr('data-uid'), tit = '', state = 0;
    if(t.hasClass('agree')){
      tit = '确定同意牵线吗？';
      state = 2
    }else{
      tit = '确定拒绝牵线吗？';
      state = 3;
    }
    showMsg.confirm(tit,{
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=leadOper', 'state='+state+'&id='+id+'&operUid='+operUid, function(data){
          if(data.state == 100){
            showMsg.alert(data.info, 1000, function(){
              getData(1);
            })
          }else{
            showMsg.alert(data.info, 1000);
          }
        })
      }
    })
  })

  // 查看联系方式
  container.delegate('.contact', 'click', function(){
    var t = $(this), p = t.closest('.item').find(".u_left"), otherUid = p.attr('data-uid'), chat = p.attr('data-chat'), name = p.find('.name').text(), age = p.attr('data-age'), height = p.attr('data-height'), distance = p.attr('data-distance'), url = p.find('a').attr('href'), img = p.find('a img').attr('src');
    $(".speak.btn").attr({'data-uid': otherUid, 'chat': chat});
    $(".homepage").attr("href", url);
    operaJson(masterDomain+'/include/ajax.php', 'service=dating&action=getMemberSpecInfo&type=1&name=contact&id='+otherUid, function(data){
      if(data && data.state == 100){
        $(".Matchmaker_bot .qq").text(data.info.qq)
        $(".Matchmaker_bot .wechat").text(data.info.wechat)
        $(".Matchmaker_bot .phone").text(data.info.phone)
        $(".Matchmaker_img img").attr("src", img);
        $(".Matchmaker_page .list_01").text(name);
        $(".Matchmaker_page .age").text(age);
        $(".Matchmaker_page .height").text(height);
        $(".Matchmaker_page .distance").text(distance);

        $('.Matchmaker_top .hninfo').hide();
        $('.Matchmaker_top .userinfo').show();
        $('.Matchmaker, .desk').addClass('show');
      }else{
        showMsg.alert(data.info, 1000);
      }
    }, true)
  })

  // 进入聊天
  $("body").delegate('.speak', 'click', function(){
    var t = $(this), to = t.attr("data-uid"), chat = t.attr("data-chat");
    if(to == undefined || to == ''){
      showMsg.alert('操作错误', 1000);
    }else{
      if(device.indexOf('huoniao') > -1){
        $(".desk").click();
        var param = {
          from: hnUid,
          to: to,
        }; 
        if(chat == "0"){
          operaJson(masterDomain+'/include/ajax.php?service=dating&action=createReview', 'type=1&id='+to, function(data){
            if(data && data.state == 100){
              setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('invokePrivateChat',  param, function(responseData){});
              })
            }else{
              showMsg.alert(data.info, 1000);
            }
          })
        }else{
          setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('invokePrivateChat',  param, function(responseData){});
          })
        }
      }else{
        showMsg.alert('请在客户端打开', 1000);
      }
    }
  })

  $('.Matchmaker .close, .desk').click(function(){
    $('.Matchmaker, .desk').removeClass('show');
  })

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(sct + $(window).height() >= $('.tofoot').offset().top){
      getData();
    }
  })

  function getData(tr){

    var data = [], state = 0, spec = '';
    var navActive = $(".navtab li.active"), id = navActive.attr("data-id"), page = navActive.attr("data-page"), lock = navActive.attr("data-lock");
    var con = con ? con : container.find(".swiper-slide").eq(activeIndex).find(".content-slide");
    if(tr){
      page = 1;
      lock = 0;
      navActive.attr({"data-page": 1, "data-lock": 0});
      con.html("");
    }
    if(lock == 1) return;

    if(page == undefined){
      page = 1;
      navActive.attr("data-page", page);
    }else{
      page = parseInt(page);
      navActive.attr("data-page", page);
    }
    if(isNaN(id)){
      data.push('spec='+id);
    }else{
      data.push('state='+id);
    }
    navActive.attr("data-lock", 1);

    tofoot.hide();

    showMsg.loading();

    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=leadList&ishn=1'+'&page='+page+'&pageSize='+pageSize+'&'+data.join('&'),
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var list = data.info.list, len = list.length;
          var pageInfo = data.info.pageInfo;
          navActive.attr("data-totalPage", pageInfo.totalPage);

          $(".navtab li em").hide();
          if(pageInfo.newLoadCount){
            $(".navtab .load em, .navtab .bd em").show().text(pageInfo.newLoadCount);
          }
          if(pageInfo.newSuccCount){
            console.log(pageInfo.newSuccCount)
            $(".succ em").show().text(pageInfo.newSuccCount);
          }
          if(pageInfo.newFailCount){
            $(".fail em").show().text(pageInfo.newFailCount);
          }

          if(len){
            var html = [];
            for(var i = 0; i < len; i++){
              var d = list[i],
                  uLeft,
                  uRight,
                  state;
                  if(d.zd == "ufrom"){
                    uLeft = d.utoUser;
                    uRight = d.ufromUser;
                  }else{
                    uLeft = d.ufromUser;
                    uRight = d.utoUser;
                  }
              if(d.state == 1){
                state = '正在牵线中···';
              }else if(d.state == 2){
                state = '牵线成功';
              }else if(d.state == 3){
                state = '牵线失败';
              }
              html.push('<div class="item state'+d.state+'" data-id="'+d.id+'">');
              html.push('  <div class="btns fn-clear">');
              html.push('    <span class="time">'+huoniao.transTimes(d.pubdate, 2).replace(/-/g, '/')+'</span>');
              if(d.state == 1){
                html.push('    <span class="state">待牵线···</span>');
                if(d.zd == 'ufrom'){
                  html.push('    <span class="btn cancel">取消牵线</span>');
                }else{
                  html.push('    <span class="btn agree">同意牵线</span>');
                  html.push('    <span class="btn refuse">拒绝牵线</span>');
                }
              }else if(d.state == 2){
                html.push('    <span class="state">牵线成功</span>');
                html.push('    <span class="btn contact">TA的联系方式</span>');
              }else if(d.state == 3){
                html.push('    <span class="state">牵线失败</span>');
              }
              html.push('  </div>');
              html.push('  <div class="base fn-clear">');
              html.push('    <div class="u_left" data-uid="'+uLeft.id+'" data-age="'+uLeft.age+'" data-height="'+uLeft.heightName+'" data-chat="'+d.chat1+'">');
              html.push('      <div class="img">');
              html.push('        <a href="'+uLeft.url+'">');
              html.push('          <img src="'+uLeft.phototurl+'" alt=""></a>');
              html.push('      </div>');
              html.push('      <div class="u_name">');
              html.push('        <p class="name">'+uLeft.nickname+'</p>');
              html.push('        <p class="u_type">'+(d.zd == 'ufrom' ? '<span style="color:#8b4efa;">被动牵线</span>' : '主动牵线')+'</p>');
              html.push('        <span class="speak" data-uid="'+uLeft.id+'" data-chat="'+d.chat1+'">对话</span>');
              html.push('      </div>');
              html.push('    </div>');
              html.push('    <div class="u_right" data-uid="'+uRight.id+'">');
              html.push('      <div class="img">');
              html.push('        <a href="'+uRight.url+'">');
              html.push('          <img src="'+uRight.phototurl+'" alt=""></a>');
              html.push('      </div>');
              html.push('      <div class="u_name">');
              html.push('        <p class="name">'+uRight.nickname+'</p>');
              html.push('        <p class="u_type">'+(d.zd == 'ufrom' ? '主动牵线' : '<span style="color:#8b4efa;">被动牵线</span>')+'</p>');
              html.push('        <span class="speak" data-uid="'+uRight.id+'" data-chat="'+d.chat2+'">对话</span>');
              html.push('      </div>');
              html.push('    </div>');
              html.push('    <div class="stateinfo">');
              html.push('      <p>'+state+'</p>');
              html.push('      <img src="'+templets_skin+'images/lead_'+d.state+'.png" alt="">');
              html.push('    </div>');
              html.push('  </div>');
              html.push('</div>');
            }

            con.append(html.join(""));
            boxAutoHeight(con);
            navActive.attr({"data-page": page+1, "data-lock": 0});

            if(pageInfo.totalPage > page){
              tofoot.text('上拉加载').show();
            }
          }else{
            boxAutoHeight(con);
          }

        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试', 1000);
      }
    })

  }
})


function boxAutoHeight(box){
  var p = box.parents('.swiper-wrapper'), h = box.height();
  var min = $(window).height() - $('.header').height() - $('.navWrap').height() - 30;
  h = h < min ? min : h;
  box.parents('.swiper-wrapper').css({'height': h+'px'});
}
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
    var t = $(this), p = t.closest('.item'), id = p.attr('data-id'), tit = '', state = 0;
    if(t.hasClass('agree')){
      tit = '确定同意牵线吗？';
      state = 2
    }else{
      tit = '确定拒绝牵线吗？';
      state = 3;
    }
    showMsg.confirm(tit,{
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=leadOper', 'state='+state+'&id='+id, function(data){
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
    var t = $(this), p = t.closest('.item'), otherUid = p.attr('data-uid'), chat = p.attr('data-chat'), name = p.find('.name').text(), age = p.find('.age').text(), height = p.find('.height').text(), distance = p.find('.distance').text(), url = p.find('.user').attr('href');
    $(".speak").attr({'data-to': otherUid, 'chat': chat});
    $(".homepage").attr("href", url);
    operaJson(masterDomain+'/include/ajax.php', 'service=dating&action=getMemberSpecInfo&name=contact&id='+otherUid, function(data){
      if(data && data.state == 100){
        $(".Matchmaker_bot .qq").text(data.info.qq)
        $(".Matchmaker_bot .wechat").text(data.info.wechat)
        $(".Matchmaker_bot .phone").text(data.info.phone)
        $(".Matchmaker_img img").attr("src", p.find(".user img").attr("src"));
        $(".Matchmaker_page .list_01").text(name);
        $(".Matchmaker_page .age").text(age);
        $(".Matchmaker_page .height").text(height);
        $(".Matchmaker_page .distance").text(distance);

        $('.Matchmaker_top .hninfo').hide();
        $('.Matchmaker_top .userinfo').show();
        $('.Matchmaker, .desk').addClass('show');
      }
    }, true)
  })
  // 进入聊天
  $(".speak").click(function(){
    var t = $(this), to = t.attr("data-to"), chat = t.attr("data-chat");
    if(to == undefined || to == ''){
      showMsg.alert('操作错误', 1000);
    }else{
      if(device.indexOf('huoniao') > -1){
        $(".desk").click();
        var param = {
          from: uid,
          to: to,
        }; 
        if(chat == "0"){
          showMsg.confirm('确定使用一把聊天钥匙吗？', {
            ok: function(){
              operaJson(masterDomain+'/include/ajax.php?service=dating&action=createReview', 'id='+to, function(data){
                if(data && data.state == 100){
                  setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('invokePrivateChat',  param, function(responseData){});
                  })
                }else{
                  showMsg.alert(data.info, 1000);
                }
              })
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

  // 查看红娘信息
  container.delegate('.hn', 'click', function(){
    var t = $(this), id = t.attr("data-hn");
    var detail = hnList[id];
    $(".Matchmaker_img img").attr("src", detail.phototurl);
    $(".list_01").text(detail.nickname);
    $(".list_02 span").text(detail.tel);
    if(detail.store){
      $(".list_03").show().children('span').text(detail.store.nickname);
    }else{
      $(".list_03").hide();
    }
    $('.homepage').attr('href', detail.url);

    $('.Matchmaker .hninfo').show();
    $('.Matchmaker .userinfo').hide();
    $('.Matchmaker, .desk').addClass('show');
  })
  $('.Matchmaker .close, .desk').click(function(){
    $('.Matchmaker, .desk').removeClass('show');
  })

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(!isload && sct + $(window).height() >= tofoot.offset().top){
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
      url: masterDomain + '/include/ajax.php?service=dating&action=leadList'+'&page='+page+'&pageSize='+pageSize+'&'+data.join('&'),
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
              var d = list[i];
              html.push('<div class="item'+(d.zd ? ' zd' : ' bd')+'" data-id="'+d.id+'" data-uid="'+d.user.id+'" data-age="'+d.user.age+'" data-height="'+d.user.heightName+'" data-chat="'+d.chat+'">');
              html.push('  <div class="base fn-clear">');
              html.push('    <div class="img">');
              html.push('      <a href="'+d.user.url+'" class="user">');
              html.push('        <img src="'+d.user.phototurl+'" alt="">');
              if(d.user.my_video_state){
                html.push('        <span class="user_video"></span>');
              }
              html.push('      </a>');
              html.push('    </div>');
              html.push('    <div class="info">');
              html.push('      <p class="base fn-clear">');
              html.push('        <a href="" class="name">'+d.user.nickname+'</a>');
              if(d.user.level){
                html.push('        <em class="u_level">');
                html.push('          <img src="'+d.user.levelIcon+'" alt=""></em>');
              }
              if(d.user.phoneCheck){
                html.push('        <em class="phone"></em>');
              }
              if(d.user.online == "1"){
                html.push('        <span class="online active">在线</span>');
              }else{
                html.push('        <span class="online">离线</span>');
              }
              html.push('        <span class="picnum">'+(d.zd ? '主动牵线' : '被动牵线')+'</span></p>');
              html.push('      <p class="more">');
              html.push('        <span class="age">'+d.user.age+'岁</span>');
              html.push('        <span class="height">'+d.user.heightName+'</span>');
              html.push('        <span class="distance">13km</span></p>');
              if(d.user.hn){
                hnList[d.user.hn.id] = d.user.hn;
                html.push('      <p class="hn">所属红娘：'+(d.user.store ? d.user.store.nickname+'-' : '')+'<a href="javascript:;" class="hn" data-hn="'+d.user.hn.id+'">'+d.user.hn.nickname+'</a></p>');
              }
              html.push('    </div>');
              html.push('  </div>');
              html.push('  <div class="btns fn-clear">');
              html.push('    <span class="time">'+huoniao.transTimes(d.pubdate, 2).replace(/-/g, '/')+'</span>');
              var state = '';
              if(d.state == 1){
                html.push('    <span class="state">正在牵线中···</span>');
                if(d.zd){
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
        }else{

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
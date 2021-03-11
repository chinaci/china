$(function(){

  // 查看高级资料,认证视频
  $('.see, #u_video').click(function(){
    showMsg.confirm('您还不是会员<br>充值会员即可查看', {
      btn:{
        ok: '<a href="'+upgradeUrl+'" class="ok">充值</a>',
      }
    })
  })
  // 查看更多资料
  $('#seeMore').click(function(){
    $('.box').removeClass('fn-hide');
    $(this).parent().remove();
  })
  // 打招呼
  $("#container").delegate(".greet", "click", function(e){
    console.log("aaa")
    e.stopPropagation();
    var t = $(this), vid = t.closest('li').attr('data-uid');
    if(!t.hasClass("active") && !t.hasClass('disabled')){
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=3&id='+vid, function(data){
        if(data.state == 100){
          t.addClass("active").text('已打招呼');
        }else{
          showMsg.alert('操作失败', 1000);
        }
      })
    }
  })
  // 动态点赞
  $("#dynamicner").delegate(".good", "click", function(){
    var t = $(this), id = t.closest('li').attr('data-id');
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=circleOper', 'id='+id, function(){
      var count = parseInt(t.text());
      if(t.hasClass('active')){
        t.removeClass('active').text(--count);
      }else{
        t.addClass('active').text(++count);
      }
    })
  })

  // 点击牵她按钮再次弹出确认框
  $('.thakaway').click(function(){
    $('.Matchmaker, .desk').removeClass('show');
    leadSure();
  })
  function leadSure(){
    showMsg.confirm('确认牵线<span style="color:#f60;">'+master.nickname+'</span><br>将扣除1次牵线次数',{
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=putLead', 'id='+id, function(data){
          if(data && data.state == 100){
            leadCount--;
            showMsg.alert(data.info, 1000);
          }else{
            showMsg.alert(data.info, 1000);
          }
        })
      }
    })
  }

  var active = $(".navbar .active").index(); 
  // 导航切换
  $('.navbar li').click(function(){
    var t = $(this), index = t.index(), init = t.attr("data-init");
    active = index;
    if(!t.hasClass('active')){
      t.addClass('active');
      t.siblings().removeClass('active');
      if(index == 1 && init == undefined){
        getList();
      }else if(index == 2 && init == undefined){
        dynamicList();
      }else if(index == 3 && init == undefined){
        albumList();
      }
      t.attr("data-init", 1);
      $('.mainbox .group').eq(index).show().siblings().hide();
    }
  });
  if(active == 1){
    $('.navbar li').eq(active).attr("data-init", 1);
    getList();
  }else if(active == 2){
    $('.navbar li').eq(active).attr("data-init", 1);
    dynamicList();
  }


  // 送礼物
  var mySwiper = null;
  $('.pageFooter .gift').click(function(){
    $('.giving').show();
    if(mySwiper == null){
      mySwiper = new Swiper('.tabs-container', {
        pagination: '.swiper-pagination'
      });
    }
    $('.desk').show();
  });
  $('.giving .giving_top i').click(function(){
    $('.giving').hide();
    $('.desk').hide();
  });
  // 选择礼物
  $('.container .givinggift_list>div').click(function(){
    var b = $(this);
    b.addClass('actives');
    b.siblings().removeClass('actives');
    b.parent().parent('.swiper-slide').siblings().find('.givinggift_list>div').removeClass('actives');
    $(".rec_right").removeClass("disabled");
  });
  // 确认送礼物
  $(".rec_right").click(function(){
    var t = $(this);
    if(t.hasClass("disabled")) return;
    if(uid == visitor.id){
      showMsg.alert('自己不能给自己送礼物哦~', 1000);
      return;
    }
    var giftCurr = $(".givinggift_list .actives"), gid = giftCurr.attr("data-id"), price = parseInt(giftCurr.attr("data-price"));
    console.log(visitor.money +'--'+ price)
    if(visitor.money < price){
      showMsg.confirm('您的余额不足，请先充值或选择其它礼物', {
        btn:{
          ok: '<a href="'+rechargeUrl+'" class="ok">充值</a>',
        }
      })
    }else{
      showMsg.confirm('确定要送出礼物吗？', {
        ok: function(){
          operaJson(masterDomain + '/include/ajax.php?service=dating&action=putGift', 'id='+uid+'&gid='+gid, function(data){
            showMsg.alert(data.info, 1000);
            if(data && data.state == 100){
              visitor.money -= price;
              $(".rec_left em").text(visitor.money);
            }
          })
        }
      })
    }
  })

  // 喜欢
  $('.liketo').click(function(){
    var h = $(this), i = h.find('i');
    var data = [];
    if(i.hasClass('pitchOn')){
      data.push('service=dating&action=cancelFollow');
      data.push('id='+id);
      operaJson(masterDomain+'/include/ajax.php', data.join("&"), function(data){
        if(data && data.state == 100){
          i.removeClass('pitchOn');

          $('.follow').removeClass("fol_dui").text('关注');
        }
      });
    }else{
      data.push('service=dating&action=visitOper');
      data.push('type=2&id='+id);
      operaJson(masterDomain+'/include/ajax.php', data.join("&"), function(data){
        if(data && data.state == 100){
          i.addClass('pitchOn');

          $('.follow').addClass("fol_dui").text('已关注');
        }else{
          showMsg.alert(data.info == 'self' ? '自己不能喜欢自己哦~' : data.info, 1000);
        }
      });
    }
  });

  // 关注
  $('.follow').click(function(){
    var a = $(this);
    var data = [];
    if(a.hasClass('fol_dui')){
      data.push('service=dating&action=cancelFollow');
      data.push('&id='+id);
      operaJson(masterDomain+'/include/ajax.php', data.join("&"), function(data){
        console.log(data)
        if(data && data.state == 100){
          a.removeClass('fol_dui');
          a.text('关注');

          $('.liketo i').removeClass('pitchOn');
        }
      });

      
    }else{
      data.push('service=dating&action=visitOper');
      data.push('type=2&id='+id);
      operaJson(masterDomain+'/include/ajax.php', data.join("&"), function(data){
        if(data && data.state == 100){
          a.addClass('fol_dui');
          a.text('已关注');

          $('.liketo i').addClass('pitchOn');
        }else{
          showMsg.alert(data.info == 'self' ? '自己不能关注自己哦~' : data.info, 1000);
        }
      });
    }
  });

  // 联系方式弹出层
  $('.bg_cuo').click(function(){
    $('.succeed_box').hide();
    $('.desk').hide();
    $('.succeed_box i').removeClass();
  });

  $('.information_qq').click(function(){
    $('.succeed_boxtTxt').text('QQ');
    
    getMemberSpecInfo('qq', function(data){
      if(data && data.state == 100){
        $('.succeed_boxNum').text(data.info);
        $('.succeed_box').show();
        $('.succeed_box i').addClass('bg_qq');
        $('.desk').show();
      }else{
        showMsg.confirm(data.info, {
          btn:{
            ok: visitor.level == 0 ? '<a href="'+upgradeUrl+'" class="ok">充值</a>' : '<a href="javascript:;" class="ok">确定</a>',
          }
        })
      }
    });
  });
  $('.information_weixin').click(function(){
    $('.succeed_boxtTxt').text('微信');
    getMemberSpecInfo('wechat', function(data){
      if(data && data.state == 100){
        $('.succeed_boxNum').text(data.info);
        $('.succeed_box').show();
        $('.succeed_box i').addClass('bg_wx');
        $('.desk').show();
      }else{
        showMsg.confirm(data.info, {
          btn:{
            ok: visitor.level == 0 ? '<a href="'+upgradeUrl+'" class="ok">充值</a>' : '<a href="javascript:;" class="ok">确定</a>',
          }
        })
      }
    });
  });
  $('.information_phone').click(function(){
    $('.succeed_boxtTxt').text('手机');
    getMemberSpecInfo('phone', function(data){
      if(data && data.state == 100){
        $('.succeed_boxNum').text(data.info);
        $('.succeed_box').show();
        $('.succeed_box i').addClass('bg_sj');
        $('.desk').show();
      }else{
        showMsg.confirm(data.info, {
          btn:{
            ok: visitor.level == 0 ? '<a href="'+upgradeUrl+'" class="ok">充值</a>' : '<a href="javascript:;" class="ok">确定</a>',
          }
        })
      }
    });
  });

  function getMemberSpecInfo(name, callback){
    operaJson(masterDomain+'/include/ajax.php', 'service=dating&action=getMemberSpecInfo&name='+name+'&id='+id, function(data){
      callback(data);
    }, true)
  }

  // 牵线
  $('.information_qx').click(function(){
    var t = $(this), state = t.attr("data-state");
    if(hnUid == master.company){
      showMsg.alert("该会员是您的下属会员", 1000);
    }else if(state == "0"){
      if(leadCount){
        $('.Matchmaker, .desk').addClass('show');
      }else{
        location.href = leadPageUrl.replace('#1', id);
      }
    }
    
  });

  $('.Matchmaker .cancel').click(function(){
    $('.Matchmaker, .desk').removeClass('show');
  });

  var container = $('#container'),dynamicner = $('#dynamicner'),albumtion= $('#albumgroup');

  //获取最近访客信息
  function getList(){
    if(visitor.id != master.id && visitor.level == 0){
      showMsg.confirm('您还不是会员，请充值会员', {
        btn: {
          ok: '<a href="'+upgradeUrl+'" class="ok">充值</a>'
        },
        ok: function(){

        }
      })
      return;
    }
    var nav = $(".navbar .fangke"), page = nav.attr("data-page"), isload = nav.attr("data-load");
    if(isload == 1) return;
    if(page == undefined) {
      page = 1;
      nav.attr("data-page", 1);
    }else{
      page ++;
      nav.attr("data-page", page);
    }
    nav.attr("data-load", 1);
    showMsg.loading();
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=visit',
      data: 'oper=visit&act=in&obj='+uid,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var start = $('.container .item').length;
          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            html.push('<li class="item fn-clear" data-uid="'+d.member.id+'" data-id="'+d.id+'">');
            html.push('  <div class="info fn-clear">');
            html.push('  <div class="visitors_img">');
            html.push('  <a href="'+d.member.url+'"><img src="'+d.member.phototurl+'"></a>');
            html.push('  </div>');
            html.push('  <div class="visitors_txt">');
            html.push('    <p class="txt_name"><a href="'+d.member.url+'">'+d.member.nickname+'</a>'+(d.certifyState == 1 ? '<em class="shim">实名</em>' : '')+'</p>');
            html.push('    <p class="txt_time"><em>'+d.pubdate+'</em></p>');
            html.push('  </div>');
            html.push('  <div class="txt_hi">');
            if(d.meet){
              html.push('    <a href="javascript:;" class="greet active">已打招呼</a>');
            }else{
              html.push('    <a href="javascript:;" class="greet'+(d.member.id == visitor.id ? ' disabled' : '')+'">打招呼</a>');
            }
            html.push('  </div>');
            html.push('  </div>');
            html.push('  <div class="btns">');
            html.push('    <span class="del">删除</span>');
            html.push('  </div>');
            html.push('</li>');
          }

          container.append(html.join(""));
          showMsg.close();
          itemBindTouch(start);
          if(data.info.pageInfo.totalPage > page){
            nav.attr("data-load", 0);
            container.siblings('.tofoot').show();
          }else{
            container.siblings('.tofoot').hide();
            // container.siblings('.tofoot').text('已加载完全部数据').show();
          }

        }else{
          if(page > 1){
            showMsg.close();
            container.siblings('.tofoot').text('已加载完全部数据');
          }else{
            showMsg.alert("暂无数据！", 1000);
          }
        }
      },
      error: function(){
        nav.attr({"data-load": 0, "data-page": --page});
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

  //获取相册
  function albumList(){
    var nav = $(".navbar .xiangce"), page = nav.attr("data-page"), isload = nav.attr("data-load");
    if(isload == 1) return;
    if(page == undefined) {
      page = 1;
      nav.attr("data-page", 1);
    }else{
      page ++;
      nav.attr("data-page", page);
    }
    nav.attr("data-load", 1);
    showMsg.loading();
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=albumList&page='+page,
      data: 'isdating=1&userid='+uid,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){

          var html = [];
          var isEdit =  !$('.front_choice').is(':hidden');

          var limit = false;
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            var url = picPageUrl.replace('#atpage', i+1);
            if(d.limit != 1){
              html.push('<li data-id="'+d.id+'">');
              if(!ismine){
                html.push('<a href="'+url+'"><img src="'+d.path+'"</a>>');
              }else if(isEdit){
                html.push('<i class="choice"></i><img src="'+d.path+'">');
              }else{
                html.push('<i></i><a href="'+url+'"><img src="'+d.path+'"></a>');
              }
              html.push('</li>');
            }else{
              limit = true;
            }
          }
          albumtion.append(html.join(""));
          showMsg.close();
          
          if(limit){
            showMsg.confirm('您当前的会员等级可查看照片数量已达上限，查看更多照片请升级会员', {
              btn: {
                ok: '<a href="'+upgradeUrl+'" class="ok">充值</a>',
              }
            })
          }else{
            albumtion.siblings('.tofoot').show();
            if(data.info.pageInfo.totalPage > page){
              nav.attr("data-load", 0);
              albumtion.siblings('.tofoot').show();
            }else{
              albumtion.siblings('.tofoot').hide();
              // albumtion.siblings('.tofoot').text('已加载完全部数据').show();
            }
          }

        }else{
          if(page > 1){
            showMsg.close();
            dynamicner.siblings('.tofoot').text('已加载完全部数据');
          }else{
            showMsg.alert("暂无数据！", 1000);
          }
        }
      },
      error: function(){
        nav.attr({"data-load": 0, "data-page": --page});
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

  // 获取动态
  function dynamicList(){
    var nav = $(".navbar .dongtai"), page = nav.attr("data-page"), isload = nav.attr("data-load");
    if(isload == 1) return;
    if(page == undefined) {
      page = 1;
      nav.attr("data-page", 1);
    }else{
      page ++;
      nav.attr("data-page", page);
    }
    nav.attr("data-load", 1);
    showMsg.loading();
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=circleList&uid='+uid,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            html.push('<li class="item" data-id="'+d.id+'">');
            html.push('  <div class="img">'+d.time_d+'</div>');
            html.push('  <div class="info">');
            html.push('      <div class="content">');
            html.push('        <div class="txt">'+d.content+'</div>');

            if(visitor.id == master.id){
              html.push('        <i class="shan"></i>');
            }

            if(d.file.length){
              if(d.type == 2){
                var url = picPageUrl2.replace('#aid', d.id);
                html.push('        <div class="pics">');
                for(var n = 0; n < d.file.length; n++){
                  if(n < 8){
                    html.push('          <a href="'+url.replace('#atpage', (n+1))+'"><img src="'+d.file[n]+'" alt=""></a>');
                  }else if(n == 8){
                    html.push('          <a href="'+url.replace('#atpage', (n+1))+'"><img src="'+d.file[n]+'" alt=""><span class="picnum">'+d.file.length+'</span></a>');
                  }
                }
                html.push('        </div>');
              }else if(d.type == 3){
                var url = videoPageUrl.replace('#aid', d.id);
                html.push('        <div class="video">');
                html.push('          <a href="'+url+'"><video src="'+d.file[0]+'"></video></a>');
                html.push('        </div>');
              }
            }

            html.push('      </div>');
            html.push('    <div class="btns">');
            if(d.zan_has){
              html.push('      <a href="javascript:;" class="good active">'+d.zan+'</a>');
            }else{
              html.push('      <a href="javascript:;" class="good">'+d.zan+'</a>');
            }
            html.push('    </div>');
            html.push('  </div>');
            html.push('</li>');
          }
          dynamicner.append(html.join(""));
          showMsg.close();
          if(data.info.pageInfo.totalPage > page){
            nav.attr("data-load", 0);
            dynamicner.siblings('.tofoot').show();
          }else{
            dynamicner.siblings('.tofoot').hide();
            // albumtion.siblings('.tofoot').text('已加载完全部数据').show();
          }
        }else{
          if(page > 1){
            dynamicner.siblings('.tofoot').text('已加载完全部数据');
          }else{
            showMsg.alert("暂无数据！", 1000);
          }
        }
      },
      error: function(){
        nav.attr({"data-load": 0, "data-page": --page});
        showMsg.alert("网络错误，请重试", 1000);
      }
    })
  }

  $(window).scroll(function(){
    if(active > 0){
      var sct = $(window).scrollTop(), top = $(".mainbox .group").eq(active).find('.tofoot').offset().top;
      if(sct + $(window).height() >= top){
        //加载新数据
        if(active == 1){
          getList();
        }else if(active == 2){
          dynamicList();
        }else if(active == 3){
          albumList();
        }
      }
    }
  });

  // 播放语音
  var audio = null;
  getMemberSpecInfo('my_voice', function(data){
    var t = $('.voice');
    if(data && data.state == 100){
      audio = new Audio();
      audio.src = data.info;
      audio.onloadedmetadata = function(){
        $(".voice_m").text(parseInt(audio.duration)+'″').show();
        t.removeClass("load");
      }
      audio.onpause = function(){
        t.removeClass("play");
      }

    }else{
      t.removeClass("load").addClass("disabled").attr({'data-info': data.info});
    }
  });

  $('.voice').click(function(){
    var t = $(this);
    if(t.hasClass("load")){
      showMsg.loading('', 1000);
    }else{
      if(t.hasClass("disabled")){
        showMsg.alert(t.attr("data-info"), 1000);
      }else{
        if(t.hasClass("play")){
          audio.pause();
          t.removeClass("play");
        }else{
          audio.play();
          t.addClass("play");
        }
      }
    }
  })

  // 非客户端弹出提示
  $(".chatto").bind("click", function(event){
    if($(this).hasClass("disabled")) return;
    if(device.indexOf('huoniao') > -1){
      var param = {
        from: visitor.id,
        to: master.id,
      };
      if(!hasChat){
        if(visitor.key > 0){
          showMsg.confirm('确定使用一把聊天钥匙吗？', {
            ok: function(){
              operaJson(masterDomain+'/include/ajax.php?service=dating&action=createReview', 'id='+uid, function(data){
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
          showMsg.confirm('您还没有聊天钥匙或已用完，请先购买', {
            btn: {ok: '<a href="'+buykeyUrl+'" class="ok">购买</a>'}
          })
        }
      }else{
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('invokePrivateChat',  param, function(responseData){});
        })
      }
    }else{
      showMsg.alert('请在客户端打开', 1000);
    }
  })

  // 展开个人介绍
  $('.yuying_txt p').click(function(){
    var t = $(this), p = t.parent('.yuying_txt')
    if(p.hasClass('open')){
      p.removeClass('open');
      t.html('展开<em></em>');
    }else{
      p.addClass('open');
      t.html('收起<em></em>');
    }
  })
})

function itemBindTouch(start){}

var fixedWin = {
  init: function(ids){
    var that = this;
    $(ids).click(function(){
      var id = $(this).attr('id');
      that.show("#"+id+'Win');
    })
  },
  show: function(id){
    var that = this;
    if($('.fixedWin-show.active').length){
      $('.fixedWin-show.active').addClass('active-last').removeClass('active');
    }
    var con = $(id);
    if(con.length){
      con.addClass("fixedWin-show active");
      con.find('.fixedWin-close').off().on("click", function(){
        that.close(true);
      })
    }
    $('html').addClass('md_fixed');
  },
  close: function(id){
    if(id){
      if(Boolean(id)){
        $(".fixedWin-show.active").removeClass("fixedWin-show active");
      }else{
        $(id).removeClass("fixedWin-show active");
      }
      if($('.fixedWin-show.active-last').length){
        setTimeout(function(){
          $('.fixedWin-show.active-last').addClass('active').removeClass('active-last');
        }, 250)
      }else{
        $('html').removeClass('md_fixed');
      }
    }else{
      $('.fixedWin').removeClass('fixedWin-show active active-last');
      $('html').removeClass('md_fixed');
    }
    
  }
}